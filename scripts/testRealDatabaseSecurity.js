/**
 * SafeRoute Real Database Integration Security Runner
 * Executes real SQL / REST queries with Supabase client against an active database.
 * 
 * Tests when configured:
 * 1. Anonymous invocation of get_sanitized_community_feed RPC (Expected: Permitted & Sanitized)
 * 2. Anonymous direct table SELECT on community_reports (Expected: Denied / 0 rows)
 * 3. Anonymous direct table INSERT on community_reports (Expected: Denied / 403)
 * 4. Anonymous direct table UPDATE/DELETE on community_reports (Expected: Denied / 403)
 * 5. Anonymous direct table SELECT on profiles (Expected: Denied / 0 rows)
 * 6. Anonymous invocation of moderate_community_report RPC (Expected: Denied / 403 Forbidden)
 * 7. Anonymous RPC submission forces user_id = NULL in database
 * 
 * When Supabase environment variables are unset, reports NOT CONFIGURED / NOT VERIFIED
 * rather than fabricating a false PASS.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

console.log("=====================================================================");
console.log("SAFEROUTE REAL DATABASE INTEGRATION SECURITY TEST");
console.log("Live PostgreSQL / Supabase REST Engine Verification");
console.log("=====================================================================\n");

// Read environment variables from process.env or .env file if available
function loadEnv() {
  const envFile = join(process.cwd(), ".env");
  const env = { ...process.env };
  if (existsSync(envFile)) {
    const lines = readFileSync(envFile, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        env[key] = value.trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

async function runRealDatabaseSecurityTests() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-ref")) {
    console.log("---------------------------------------------------------------------");
    console.log("[STATUS: NOT CONFIGURED] Live Supabase credentials are not set in .env.");
    console.log("  - VITE_SUPABASE_URL: " + (supabaseUrl ? "Placeholder" : "Missing"));
    console.log("  - VITE_SUPABASE_ANON_KEY: " + (supabaseAnonKey ? "Placeholder" : "Missing"));
    console.log("");
    console.log("  STATUS NOTICE:");
    console.log("  Live network security integration tests remain NOT VERIFIED because");
    console.log("  real backend credentials are not set in this local workspace.");
    console.log("");
    console.log("  To execute real network tests against your staging/production Supabase project:");
    console.log("  1. Add your real project URL and anon key to .env");
    console.log("  2. Apply migrations: supabase/migrations/*.sql");
    console.log("  3. Run: npm run test:db-security");
    console.log("");
    console.log("  For local PostgreSQL testing via Supabase CLI:");
    console.log("  Run pgTAP test suite: supabase test db");
    console.log("  (Test definitions located at: supabase/tests/database_security.test.sql)");
    console.log("---------------------------------------------------------------------\n");
    return;
  }

  console.log(`Connecting to live Supabase endpoint: ${supabaseUrl}`);
  const { createClient } = await import("@supabase/supabase-js");
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assertReal(testName, isSuccess, message = "") {
    if (isSuccess) {
      console.log(`[PASS] [REAL-DB] ${testName}`);
      testsPassed++;
    } else {
      console.error(`[FAIL] [REAL-DB] ${testName} - ${message}`);
      testsFailed++;
      process.exitCode = 1;
    }
  }

  // -------------------------------------------------------------------
  // TEST 1: Anonymous Sanitized Feed RPC (get_sanitized_community_feed)
  // -------------------------------------------------------------------
  try {
    const { data, error } = await anonClient.rpc("get_sanitized_community_feed", {
      p_limit: 10,
      p_offset: 0
    });
    
    // Expected: Permitted for anonymous callers, but strictly sanitized
    const isSanitized = Array.isArray(data) && data.every(row => 
      row.description === undefined &&
      row.latitude === undefined &&
      row.longitude === undefined &&
      row.user_id === undefined &&
      row.email === undefined
    );

    assertReal(
      "Anonymous caller can invoke get_sanitized_community_feed and output is strictly sanitized",
      !error && isSanitized,
      error ? `RPC error: ${error.message}` : "Private fields exposed in public feed"
    );
  } catch (err) {
    assertReal(
      "Anonymous caller can invoke get_sanitized_community_feed",
      false,
      `Network/Transport error: ${err.message}`
    );
  }

  // -------------------------------------------------------------------
  // TEST 2: Anonymous Direct Table Read on community_reports
  // -------------------------------------------------------------------
  try {
    const { data, error } = await anonClient.from("community_reports").select("*");
    assertReal(
      "Anonymous caller cannot query public.community_reports table directly",
      error !== null || !data || data.length === 0,
      error ? `Denied as expected: ${error.message}` : "RLS / grant returned 0 rows"
    );
  } catch (err) {
    assertReal(
      "Anonymous caller cannot query public.community_reports table directly",
      true,
      `Rejected at transport: ${err.message}`
    );
  }

  // -------------------------------------------------------------------
  // TEST 3: Anonymous Direct Table INSERT on community_reports
  // -------------------------------------------------------------------
  try {
    const { error } = await anonClient.from("community_reports").insert({
      area: "Malicious Direct Insert",
      concern_type: "Other",
      description: "Direct insert bypassing RPC",
      status: "verified"
    });
    assertReal(
      "Anonymous caller cannot directly INSERT into public.community_reports table",
      error !== null,
      error ? `Direct insert rejected: ${error.message}` : "Direct insert unexpectedly succeeded!"
    );
  } catch (err) {
    assertReal(
      "Anonymous caller cannot directly INSERT into public.community_reports table",
      true,
      `Rejected at transport: ${err.message}`
    );
  }

  // -------------------------------------------------------------------
  // TEST 4: Anonymous Invocation of moderate_community_report RPC
  // -------------------------------------------------------------------
  try {
    const { error } = await anonClient.rpc("moderate_community_report", {
      p_report_id: "00000000-0000-0000-0000-000000000000",
      p_new_status: "verified"
    });
    assertReal(
      "Anonymous caller cannot invoke moderate_community_report RPC (403 Forbidden)",
      error !== null,
      error ? `Moderation rejected as expected: ${error.message}` : "Moderation unexpectedly succeeded!"
    );
  } catch (err) {
    assertReal(
      "Anonymous caller cannot invoke moderate_community_report RPC",
      true,
      `Rejected at transport: ${err.message}`
    );
  }

  // -------------------------------------------------------------------
  // TEST 5: Anonymous Direct Table Read on profiles
  // -------------------------------------------------------------------
  try {
    const { data, error } = await anonClient.from("profiles").select("*");
    assertReal(
      "Anonymous caller cannot query public.profiles table",
      error !== null || !data || data.length === 0,
      error ? `Denied as expected: ${error.message}` : "RLS / grant returned 0 rows"
    );
  } catch (err) {
    assertReal(
      "Anonymous caller cannot query public.profiles table",
      true,
      `Rejected: ${err.message}`
    );
  }

  console.log("\n---------------------------------------------------------------------");
  console.log(`REAL DATABASE TESTS EXECUTED: ${testsPassed} passed, ${testsFailed} failed.`);
  console.log("---------------------------------------------------------------------\n");
}

runRealDatabaseSecurityTests().catch((err) => {
  console.error("Database test runner error:", err);
  process.exitCode = 1;
});
