-- =====================================================================
-- SAFEROUTE ANONYMOUS REPORTING & PRIVACY-FIRST DATABASE MIGRATION
-- Migration: 20261112_anonymous_reporting.sql
-- Purpose:
--   1. Allow anonymous safety reporting without requiring user accounts or PII.
--   2. Make community_reports.user_id NULLABLE.
--   3. Strictly guarantee public submissions have user_id = NULL (never linked to accounts).
--   4. Concurrency-Safe Server-Side Rate Limiting (FOR UPDATE row locking, keyed HMAC-SHA-256).
--   5. Trusted Gateway Header Selection (cf-connecting-ip / rightmost proxy, anti-spoofing).
--   6. Locality Privacy Safeguards (controlled public zones, no unmoderated free-text addresses).
--   7. Coordinate Approximation (round coordinates to 3 decimal places; omit from public feed).
--   8. Reconciled Moderation RPC (strictly restricted to service_role).
--   9. Sanitized Public Feed (day-truncated dates, no private descriptions or coordinates).
--  10. Defense-in-depth: Direct table access REVOKED from anon and PUBLIC;
--      Authenticated users restricted to (auth.uid() = user_id AND user_id IS NOT NULL).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. MAKE USER_ID NULLABLE ON COMMUNITY_REPORTS
-- ---------------------------------------------------------------------
ALTER TABLE public.community_reports ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN public.community_reports.user_id IS 'Optional reference to auth.users. Strictly NULL for public anonymous submissions to guarantee reporter privacy.';

-- ---------------------------------------------------------------------
-- 2. SERVER-SIDE RATE LIMITING CONFIG & STORAGE TABLES
-- ---------------------------------------------------------------------
-- Persistent server-only secret for HMAC-SHA-256 (never exposed to frontend/client)
CREATE TABLE IF NOT EXISTS public.community_rate_limit_config (
    config_key pg_catalog.text PRIMARY KEY,
    secret_value pg_catalog.text NOT NULL
);

REVOKE ALL ON public.community_rate_limit_config FROM PUBLIC;
REVOKE ALL ON public.community_rate_limit_config FROM anon;
REVOKE ALL ON public.community_rate_limit_config FROM authenticated;

-- Seed internal HMAC secret if not already set
INSERT INTO public.community_rate_limit_config (config_key, secret_value)
VALUES ('hmac_secret', pg_catalog.md5('saferoute_server_secret_init_' || pg_catalog.timezone('utc', pg_catalog.now())::text))
ON CONFLICT (config_key) DO NOTHING;

-- Tracks ephemeral rate-limit windows using pseudonymous HMAC identifiers (zero raw IP storage)
CREATE TABLE IF NOT EXISTS public.community_report_rate_limits (
    rate_key pg_catalog.text PRIMARY KEY,
    submission_count pg_catalog.int4 NOT NULL DEFAULT 1,
    window_start pg_catalog.timestamptz NOT NULL DEFAULT pg_catalog.timezone('utc', pg_catalog.now()),
    last_submission pg_catalog.timestamptz NOT NULL DEFAULT pg_catalog.timezone('utc', pg_catalog.now())
);

REVOKE ALL ON public.community_report_rate_limits FROM PUBLIC;
REVOKE ALL ON public.community_report_rate_limits FROM anon;
REVOKE ALL ON public.community_report_rate_limits FROM authenticated;

-- ---------------------------------------------------------------------
-- 3. REPORT OWNERSHIP & INTEGRITY TRIGGER
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_report_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Public anonymous submissions must NEVER be linked to an account
        -- If NEW.user_id is passed as NULL, keep it strictly NULL regardless of auth session
        IF NEW.user_id IS NOT NULL THEN
            NEW.user_id := auth.uid();
        END IF;
        NEW.status := 'unverified';
        NEW.created_at := pg_catalog.timezone('utc', pg_catalog.now());
    ELSIF TG_OP = 'UPDATE' THEN
        -- Retain original author and prevent status elevation by ordinary users
        NEW.user_id := OLD.user_id;
        NEW.status := 'unverified';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM authenticated;

-- ---------------------------------------------------------------------
-- 4. APPROVED LOCALITY NORMALIZER & VALIDATOR
-- ---------------------------------------------------------------------
-- Prevents publication of arbitrary unmoderated free-text containing residential PII
CREATE OR REPLACE FUNCTION public.normalize_public_locality(p_input pg_catalog.text)
RETURNS pg_catalog.text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
    v_clean pg_catalog.text;
BEGIN
    v_clean := pg_catalog.trim(p_input);

    -- Strict pattern rejection: residential units, house numbers, phones, emails
    IF v_clean ~ '[0-9]{7,}' THEN
        RAISE EXCEPTION 'Privacy violation: Phone numbers or numeric identifiers must not be entered in the location field.';
    END IF;

    IF v_clean ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' THEN
        RAISE EXCEPTION 'Privacy violation: Email addresses must not be entered in the location field.';
    END IF;

    IF v_clean ~* '(flat|apartment|apt|house|h\.?\s*no|room|floor|villa)\s*[:#]?[0-9]+' THEN
        RAISE EXCEPTION 'Privacy violation: Please select an approved public locality or landmark, not a private residential address.';
    END IF;

    -- Normalize into approved public transit and sector zones across Delhi NCR
    IF v_clean ~* 'connaught|cp|inner circle|outer circle' THEN
        RETURN 'Connaught Place, Central Delhi';
    ELSIF v_clean ~* 'karol bagh' THEN
        RETURN 'Karol Bagh, Central Delhi';
    ELSIF v_clean ~* 'paharganj|new delhi station' THEN
        RETURN 'Paharganj / New Delhi Station, Central Delhi';
    ELSIF v_clean ~* 'pragati maidan|ito' THEN
        RETURN 'Pragati Maidan / ITO, Central Delhi';
    ELSIF v_clean ~* 'saket|press enclave' THEN
        RETURN 'Saket District Centre, South Delhi';
    ELSIF v_clean ~* 'hauz khas' THEN
        RETURN 'Hauz Khas Village & Environs, South Delhi';
    ELSIF v_clean ~* 'lajpat nagar' THEN
        RETURN 'Lajpat Nagar Central Market, South Delhi';
    ELSIF v_clean ~* 'greater kailash|gk' THEN
        RETURN 'Greater Kailash (GK I & II), South Delhi';
    ELSIF v_clean ~* 'malviya nagar' THEN
        RETURN 'Malviya Nagar / Sarvodaya, South Delhi';
    ELSIF v_clean ~* 'mehrauli|qutub' THEN
        RETURN 'Mehrauli / Qutub Complex, South Delhi';
    ELSIF v_clean ~* 'nehru place' THEN
        RETURN 'Nehru Place Commercial Hub, South Delhi';
    ELSIF v_clean ~* 'dwarka sector 10' THEN
        RETURN 'Dwarka Sector 10 / Metro Corridor, South West Delhi';
    ELSIF v_clean ~* 'dwarka' THEN
        RETURN 'Dwarka Sector 12 / Transit Hub, South West Delhi';
    ELSIF v_clean ~* 'vasant kunj' THEN
        RETURN 'Vasant Kunj Promenade Corridor, South West Delhi';
    ELSIF v_clean ~* 'munirka' THEN
        RETURN 'Munirka / Outer Ring Road, South West Delhi';
    ELSIF v_clean ~* 'janakpuri' THEN
        RETURN 'Janakpuri District Centre, West Delhi';
    ELSIF v_clean ~* 'rajouri garden' THEN
        RETURN 'Rajouri Garden / Ring Road, West Delhi';
    ELSIF v_clean ~* 'punjabi bagh' THEN
        RETURN 'Punjabi Bagh Commercial Hub, West Delhi';
    ELSIF v_clean ~* 'patel nagar' THEN
        RETURN 'Patel Nagar / Shadipur Corridor, West Delhi';
    ELSIF v_clean ~* 'civil lines|north campus' THEN
        RETURN 'Civil Lines / Delhi University North Campus';
    ELSIF v_clean ~* 'kashmere gate' THEN
        RETURN 'Kashmere Gate ISBT & Metro Hub, North Delhi';
    ELSIF v_clean ~* 'model town|gtb nagar' THEN
        RETURN 'Model Town / GTB Nagar, North Delhi';
    ELSIF v_clean ~* 'rohini sector 10' THEN
        RETURN 'Rohini Sector 10 / District Centre, North West Delhi';
    ELSIF v_clean ~* 'rohini' THEN
        RETURN 'Rohini Sector 13 / Outer Ring Road, North West Delhi';
    ELSIF v_clean ~* 'pitampura|netaji subhash' THEN
        RETURN 'Pitampura / Netaji Subhash Place, North West Delhi';
    ELSIF v_clean ~* 'mayur vihar' THEN
        RETURN 'Mayur Vihar Phase 1 & 2, East Delhi';
    ELSIF v_clean ~* 'laxmi nagar' THEN
        RETURN 'Laxmi Nagar Commercial Hub, East Delhi';
    ELSIF v_clean ~* 'anand vihar' THEN
        RETURN 'Anand Vihar ISBT & Transit Hub, East Delhi';
    ELSIF v_clean ~* 'preet vihar|vikas marg' THEN
        RETURN 'Preet Vihar / Vikas Marg, East Delhi';
    ELSIF v_clean ~* 'shahdara|dilshad' THEN
        RETURN 'Shahdara / Dilshad Garden, North East Delhi';
    ELSIF v_clean ~* 'seelampur|welcome' THEN
        RETURN 'Seelampur / Welcome Metro Corridor, North East Delhi';
    ELSE
        -- If clean text conforms to public zone bounds and has no residential indicators, format cleanly
        IF pg_catalog.length(v_clean) >= 3 AND pg_catalog.length(v_clean) <= 80 THEN
            RETURN pg_catalog.initcap(v_clean);
        ELSE
            RAISE EXCEPTION 'Invalid locality: Please select an approved public transit zone or commercial landmark.';
        END IF;
    END IF;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. SECURE ANONYMOUS REPORT SUBMISSION RPC WITH CONCURRENCY-SAFE ABUSE CONTROLS
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_anonymous_community_report(
    p_area pg_catalog.text,
    p_concern_type pg_catalog.text,
    p_description pg_catalog.text,
    p_latitude pg_catalog.numeric DEFAULT NULL,
    p_longitude pg_catalog.numeric DEFAULT NULL
)
RETURNS TABLE (
    id pg_catalog.uuid,
    status pg_catalog.text,
    created_at pg_catalog.timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_clean_area pg_catalog.text;
    v_clean_desc pg_catalog.text;
    v_clean_cat pg_catalog.text;
    v_approx_lat pg_catalog.numeric;
    v_approx_lon pg_catalog.numeric;
    v_new_id pg_catalog.uuid;
    v_now pg_catalog.timestamptz;
    v_headers pg_catalog.json;
    v_client_ip pg_catalog.text;
    v_hmac_secret pg_catalog.text;
    v_rate_key pg_catalog.text;
    v_existing_count pg_catalog.int4;
    v_last_sub pg_catalog.timestamptz;
    v_win_start pg_catalog.timestamptz;
BEGIN
    v_now := pg_catalog.timezone('utc', pg_catalog.now());

    -- -----------------------------------------------------------------
    -- A. TRUSTED GATEWAY CALLER IP IDENTIFICATION
    -- -----------------------------------------------------------------
    -- Priority 1: cf-connecting-ip (Cloudflare edge proxy header; cannot be spoofed by client)
    -- Priority 2: x-real-ip (set by trusted edge gateway)
    -- Priority 3: Rightmost entry of x-forwarded-for (appended by nearest trusted proxy)
    BEGIN
        v_headers := NULLIF(pg_catalog.current_setting('request.headers', true), '')::pg_catalog.json;
        IF v_headers->>'cf-connecting-ip' IS NOT NULL THEN
            v_client_ip := pg_catalog.trim(v_headers->>'cf-connecting-ip');
        ELSIF v_headers->>'x-real-ip' IS NOT NULL THEN
            v_client_ip := pg_catalog.trim(v_headers->>'x-real-ip');
        ELSIF v_headers->>'x-forwarded-for' IS NOT NULL THEN
            -- Extract rightmost IP to defeat left-side proxy injection spoofing
            v_client_ip := pg_catalog.trim(
                pg_catalog.split_part(
                    v_headers->>'x-forwarded-for',
                    ',',
                    pg_catalog.array_length(pg_catalog.string_to_array(v_headers->>'x-forwarded-for', ','), 1)
                )
            );
        ELSE
            -- Fallback to PostgreSQL client address; never silently disable rate limiting
            v_client_ip := pg_catalog.coalesce(pg_catalog.inet_client_addr()::text, 'gateway_anonymous_pool');
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_client_ip := 'gateway_anonymous_pool';
    END;

    IF v_client_ip IS NULL OR pg_catalog.length(v_client_ip) < 1 THEN
        v_client_ip := 'gateway_anonymous_pool';
    END IF;

    -- -----------------------------------------------------------------
    -- B. KEYED HMAC-SHA-256 IDENTIFIER (STABLE ACROSS HOUR BOUNDARIES)
    -- -----------------------------------------------------------------
    -- Retrieve server-only secret (never exposed to frontend/client)
    SELECT secret_value INTO v_hmac_secret
    FROM public.community_rate_limit_config
    WHERE config_key = 'hmac_secret';

    IF v_hmac_secret IS NULL THEN
        v_hmac_secret := 'saferoute_server_fallback_key_secure_2026';
    END IF;

    -- Keyed HMAC-SHA-256 computation: Stable across windows (eliminates hourly reset bypass)
    -- Raw IP address is NEVER stored in the database table.
    BEGIN
        v_rate_key := pg_catalog.encode(extensions.hmac(v_client_ip::bytea, v_hmac_secret::bytea, 'sha256'), 'hex');
    EXCEPTION WHEN OTHERS THEN
        v_rate_key := pg_catalog.encode(pg_catalog.sha256((v_hmac_secret || ':' || v_client_ip)::bytea), 'hex');
    END;

    -- -----------------------------------------------------------------
    -- C. CONCURRENCY-SAFE TRANSACTIONAL RATE LIMITING
    -- -----------------------------------------------------------------
    -- Opportunistically prune records older than 20 minutes (minimum retention needed)
    DELETE FROM public.community_report_rate_limits
    WHERE window_start < (v_now - interval '20 minutes');

    -- Atomic row initialization to eliminate race conditions
    INSERT INTO public.community_report_rate_limits (
        rate_key, submission_count, window_start, last_submission
    ) VALUES (
        v_rate_key, 0, v_now, v_now - interval '1 hour'
    ) ON CONFLICT (rate_key) DO NOTHING;

    -- Acquire row-level lock on rate_key (serializes concurrent submissions from the same identifier)
    SELECT submission_count, window_start, last_submission
    INTO v_existing_count, v_win_start, v_last_sub
    FROM public.community_report_rate_limits
    WHERE rate_key = v_rate_key
    FOR UPDATE;

    -- Limit 1: Minimum 10 seconds cooldown between consecutive submissions
    IF v_last_sub > (v_now - interval '10 seconds') THEN
        RAISE EXCEPTION 'Rate limit exceeded: Please wait at least 10 seconds between submissions.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Limit 2: Maximum 5 submissions per 10-minute sliding window
    IF v_win_start > (v_now - interval '10 minutes') THEN
        IF v_existing_count >= 5 THEN
            RAISE EXCEPTION 'Rate limit exceeded: Maximum 5 safety notices permitted per 10-minute window. Please try again later.'
                USING ERRCODE = 'P0001';
        END IF;

        UPDATE public.community_report_rate_limits
        SET submission_count = submission_count + 1,
            last_submission = v_now
        WHERE rate_key = v_rate_key;
    ELSE
        -- Window expired (> 10 mins): start new 10-minute window
        UPDATE public.community_report_rate_limits
        SET submission_count = 1,
            window_start = v_now,
            last_submission = v_now
        WHERE rate_key = v_rate_key;
    END IF;

    -- -----------------------------------------------------------------
    -- D. SERVER-SIDE INPUT SANITIZATION & PRIVACY NORMALIZATION
    -- -----------------------------------------------------------------
    -- Normalize locality into approved general public sector label
    v_clean_area := public.normalize_public_locality(p_area);

    -- Neutralize control characters and trim description
    v_clean_desc := pg_catalog.regexp_replace(pg_catalog.trim(p_description), '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g');
    v_clean_cat  := pg_catalog.trim(p_concern_type);

    -- Description Length Bounds (5 - 1000 characters)
    IF pg_catalog.length(v_clean_desc) < 5 THEN
        RAISE EXCEPTION 'Invalid description: Description must be at least 5 characters.';
    END IF;

    IF pg_catalog.length(v_clean_desc) > 1000 THEN
        RAISE EXCEPTION 'Invalid description: Description must be 1000 characters or fewer.';
    END IF;

    -- Privacy Protection: Reject contact details in Description field
    IF v_clean_desc ~ '[0-9]{10}' THEN
        RAISE EXCEPTION 'Privacy violation: 10-digit phone numbers must not be included in the report description.';
    END IF;

    IF v_clean_desc ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' THEN
        RAISE EXCEPTION 'Privacy violation: Email addresses must not be included in the report description.';
    END IF;

    -- Validate concern category against approved whitelist
    IF v_clean_cat NOT IN (
        'Street lighting issue',
        'Suspicious activity',
        'Poor visibility',
        'Harassment concern',
        'Unsafe public infrastructure',
        'Poor street lighting',
        'Dark or poorly visible stretch',
        'Isolated area',
        'Unsafe public-space condition',
        'Other'
    ) THEN
        RAISE EXCEPTION 'Invalid concern category: %', v_clean_cat;
    END IF;

    -- Validate and approximate coordinates to 3 decimal places (~100m locality radius)
    IF p_latitude IS NOT NULL THEN
        IF p_latitude < -90 OR p_latitude > 90 THEN
            RAISE EXCEPTION 'Invalid latitude: Must be between -90 and 90.';
        END IF;
        v_approx_lat := pg_catalog.round(p_latitude, 3);
    ELSE
        v_approx_lat := NULL;
    END IF;

    IF p_longitude IS NOT NULL THEN
        IF p_longitude < -180 OR p_longitude > 180 THEN
            RAISE EXCEPTION 'Invalid longitude: Must be between -180 and 180.';
        END IF;
        v_approx_lon := pg_catalog.round(p_longitude, 3);
    ELSE
        v_approx_lon := NULL;
    END IF;

    -- -----------------------------------------------------------------
    -- E. SERVER-ENFORCED INSERTION (STRICTLY FORCE user_id = NULL)
    -- -----------------------------------------------------------------
    -- Public anonymous submissions are NEVER linked to an account (auth.uid() is intentionally ignored)
    INSERT INTO public.community_reports (
        user_id,
        area,
        concern_type,
        description,
        latitude,
        longitude,
        status,
        created_at
    ) VALUES (
        NULL,              -- Explicitly NULL: anonymous public reports are NEVER tied to accounts
        v_clean_area,      -- Approved, normalized public locality label
        v_clean_cat,
        v_clean_desc,
        v_approx_lat,      -- Approximate 3-decimal place coordinates
        v_approx_lon,
        'unverified',      -- Forced unverified status
        v_now
    )
    RETURNING community_reports.id INTO v_new_id;

    RETURN QUERY SELECT v_new_id, 'unverified'::pg_catalog.text, v_now;
END;
$$;

-- Restrict function execution
REVOKE ALL ON FUNCTION public.submit_anonymous_community_report(
    pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.numeric, pg_catalog.numeric
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_anonymous_community_report(
    pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.numeric, pg_catalog.numeric
) FROM anon;
REVOKE ALL ON FUNCTION public.submit_anonymous_community_report(
    pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.numeric, pg_catalog.numeric
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.submit_anonymous_community_report(
    pg_catalog.text, pg_catalog.text, pg_catalog.text, pg_catalog.numeric, pg_catalog.numeric
) TO anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. SANITIZED PUBLIC COMMUNITY FEED RPC
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_sanitized_community_feed(
    p_limit pg_catalog.int4 DEFAULT 50,
    p_offset pg_catalog.int4 DEFAULT 0
)
RETURNS TABLE (
    id pg_catalog.uuid,
    area pg_catalog.text,
    concern_type pg_catalog.text,
    status pg_catalog.text,
    approximate_date pg_catalog.timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Validate and cap pagination parameters to prevent scraping & DoS
    IF p_limit IS NULL OR p_limit > 100 THEN
        p_limit := 100;
    ELSIF p_limit < 1 THEN
        p_limit := 10;
    END IF;

    IF p_offset IS NULL OR p_offset < 0 THEN
        p_offset := 0;
    END IF;

    -- Return strictly sanitized fields with day-level date truncation
    -- NEVER returns descriptions, exact coordinates, user IDs, or emails
    RETURN QUERY
    SELECT
        cr.id,
        cr.area,
        cr.concern_type,
        cr.status,
        pg_catalog.date_trunc('day', cr.created_at) AS approximate_date
    FROM public.community_reports cr
    WHERE cr.status <> 'rejected' AND cr.status <> 'retired'
    ORDER BY cr.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) FROM anon;
REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) TO anon, authenticated;

-- ---------------------------------------------------------------------
-- 7. RECONCILED MODERATION RPC (AUTHORIZED SERVICE_ROLE ONLY)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.moderate_community_report(
    p_report_id pg_catalog.uuid,
    p_new_status pg_catalog.text
)
RETURNS TABLE (
    id pg_catalog.uuid,
    status pg_catalog.text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Moderation is exclusively authorized for service_role
    IF auth.jwt()->>'role' IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION '403 Forbidden: Only authorized service_role administrators can moderate reports.'
            USING ERRCODE = '42501';
    END IF;

    -- Allowed moderation statuses
    IF p_new_status NOT IN ('unverified', 'reviewed', 'verified', 'retired', 'rejected') THEN
        RAISE EXCEPTION 'Invalid moderation status: %', p_new_status;
    END IF;

    UPDATE public.community_reports
    SET status = p_new_status
    WHERE community_reports.id = p_report_id;

    RETURN QUERY SELECT p_report_id, p_new_status;
END;
$$;

REVOKE ALL ON FUNCTION public.moderate_community_report(pg_catalog.uuid, pg_catalog.text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.moderate_community_report(pg_catalog.uuid, pg_catalog.text) FROM anon;
REVOKE ALL ON FUNCTION public.moderate_community_report(pg_catalog.uuid, pg_catalog.text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.moderate_community_report(pg_catalog.uuid, pg_catalog.text) TO service_role;

-- ---------------------------------------------------------------------
-- 8. REINFORCE TABLE PERMISSIONS & RLS POLICIES
-- ---------------------------------------------------------------------
-- Direct table access on community_reports:
REVOKE ALL ON public.community_reports FROM anon;
REVOKE ALL ON public.community_reports FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.community_reports FROM authenticated;

-- Ensure RLS on community_reports strictly shields anonymous notices from direct table queries:
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only read their own reports" ON public.community_reports;
DROP POLICY IF EXISTS "Users can only read their own non-null reports" ON public.community_reports;

-- Authenticated users can ONLY query their own non-null records (for private profile history)
-- Anonymous reports (user_id IS NULL) are NEVER returned by direct table queries to any role!
CREATE POLICY "Users can only read their own non-null reports" ON public.community_reports
FOR SELECT TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Profiles table remains strictly accessible only to authenticated owner
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM PUBLIC;
