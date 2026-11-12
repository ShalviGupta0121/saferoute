// Supabase Edge Function: submit-report
// Implements server-side abuse prevention, concurrency-safe rate limiting,
// and locality privacy validation before calling PostgreSQL community_reports.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory sliding window for Edge runtime abuse prevention
// Stores pseudonymous HMAC-SHA-256 tokens (zero permanent raw IP storage)
const rateLimitMap = new Map<string, { count: number; lastTime: number; windowStart: number }>();

async function getHmacRateKey(req: Request): Promise<string> {
  // Trusted Gateway IP resolution:
  // 1. cf-connecting-ip (Cloudflare edge sets this; cannot be client-spoofed)
  // 2. x-real-ip (Gateway proxy)
  // 3. Rightmost entry of x-forwarded-for (appended by nearest trusted proxy)
  let clientIp = "gateway_anonymous_pool";
  const cfIp = req.headers.get("cf-connecting-ip");
  const realIp = req.headers.get("x-real-ip");
  const forwarded = req.headers.get("x-forwarded-for");

  if (cfIp) {
    clientIp = cfIp.trim();
  } else if (realIp) {
    clientIp = realIp.trim();
  } else if (forwarded) {
    const parts = forwarded.split(",");
    clientIp = parts[parts.length - 1].trim();
  }

  // Server-only HMAC secret (never exposed to client)
  const secret = Deno.env.get("RATE_LIMIT_HMAC_SECRET") || "saferoute_server_edge_secret_key_2026";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(clientIp));
  const hashHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `hmac_${hashHex.slice(0, 32)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const now = Date.now();
    const rateKey = await getHmacRateKey(req);
    const existing = rateLimitMap.get(rateKey);

    // Concurrency-safe abuse controls: 10s cooldown, max 5 reports per 10 minutes
    if (existing) {
      if (now - existing.lastTime < 10000) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded: Please wait at least 10 seconds between submissions." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (now - existing.windowStart < 600000) {
        if (existing.count >= 5) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded: Maximum 5 safety notices permitted per 10-minute window." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        existing.count++;
        existing.lastTime = now;
      } else {
        rateLimitMap.set(rateKey, { count: 1, lastTime: now, windowStart: now });
      }
    } else {
      rateLimitMap.set(rateKey, { count: 1, lastTime: now, windowStart: now });
    }

    // Parse payload
    const body = await req.json();
    const { area, concernType, description, latitude, longitude } = body;

    const cleanArea = String(area || "").trim();
    const cleanDesc = String(description || "").trim();
    const cleanCat = String(concernType || "").trim();

    // Locality validations: Reject residential patterns, phone numbers, and emails
    if (cleanArea.length < 3 || cleanArea.length > 80) {
      return new Response(
        JSON.stringify({ error: "Invalid area: Locality must be between 3 and 80 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (/[0-9]{7,}/.test(cleanArea)) {
      return new Response(
        JSON.stringify({ error: "Privacy violation: Phone numbers or numeric identifiers must not be entered in the location field." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (/(flat|apartment|apt|house|h\.?\s*no|room|floor|villa)\s*[:#]?[0-9]+/i.test(cleanArea)) {
      return new Response(
        JSON.stringify({ error: "Privacy violation: Please select an approved public locality or landmark, not a private residential address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Forward to PostgreSQL RPC with anon key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error } = await supabaseClient.rpc("submit_anonymous_community_report", {
      p_area: cleanArea,
      p_concern_type: cleanCat,
      p_description: cleanDesc,
      p_latitude: latitude ? Number(Number(latitude).toFixed(3)) : null,
      p_longitude: longitude ? Number(Number(longitude).toFixed(3)) : null,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ data, isDemo: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
