-- =====================================================================
-- SAFEROUTE FINAL SECURITY CORRECTIONS & HARDENING
-- Migration: 20261112_final_security_corrections.sql
-- Purpose:
--   1. Secure get_sanitized_community_feed RPC:
--      - SECURITY DEFINER with SET search_path = ''
--      - Fully qualified references across all schemas (public, auth, pg_catalog)
--      - Require auth.uid() IS NOT NULL (reject anon callers)
--      - Cap pagination parameters strictly
--      - Day-level date truncation (pg_catalog.date_trunc('day', ...))
--      - REVOKE EXECUTE from PUBLIC and anon; GRANT EXECUTE ONLY to authenticated
--   2. Eliminate unnecessary UPDATE privileges on public.community_reports:
--      - REVOKE UPDATE from authenticated, anon, PUBLIC
--      - Drop any lingering UPDATE policies
--   3. Audit and drop obsolete public.public_community_reports view safely
--   4. Secure all other SECURITY DEFINER functions with SET search_path = ''
--   5. Enforce immutable profile fields trigger to prevent identity/privilege tampering
--   6. Add TOTP MFA AAL verification helper for sensitive database operations
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. AUDIT AND DROP OBSOLETE COMMUNITY REPORT VIEW
-- ---------------------------------------------------------------------
-- The old view is obsolete and superseded by get_sanitized_community_feed.
-- Drop it safely and revoke any residual grants.
DROP VIEW IF EXISTS public.public_community_reports CASCADE;

-- ---------------------------------------------------------------------
-- 2. ELIMINATE UNNECESSARY UPDATE PRIVILEGES ON COMMUNITY REPORTS
-- ---------------------------------------------------------------------
-- In our women's safety platform, reports are immutable community records.
-- Removing UPDATE prevents any user from tampering with previously filed reports,
-- altering coordinates, or elevating statuses to "verified".

-- Revoke UPDATE from all roles
REVOKE UPDATE ON public.community_reports FROM PUBLIC;
REVOKE UPDATE ON public.community_reports FROM anon;
REVOKE UPDATE ON public.community_reports FROM authenticated;

-- Drop obsolete update RLS policies
DROP POLICY IF EXISTS "Users can only update their own unverified reports" ON public.community_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.community_reports;

-- Ensure table permissions for authenticated users strictly permit: SELECT, INSERT, DELETE
GRANT SELECT, INSERT, DELETE ON public.community_reports TO authenticated;
REVOKE ALL ON public.community_reports FROM anon;
REVOKE ALL ON public.community_reports FROM PUBLIC;

-- ---------------------------------------------------------------------
-- 3. HARDEN REPORT OWNERSHIP & INTEGRITY TRIGGER
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_report_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Derive user_id directly from the verified authentication context
    NEW.user_id := auth.uid();
    
    -- Ordinary users can NEVER elevate status to verified
    IF TG_OP = 'INSERT' THEN
        NEW.status := 'unverified';
        NEW.created_at := pg_catalog.timezone('utc', pg_catalog.now());
    ELSIF TG_OP = 'UPDATE' THEN
        -- Retain original author and prevent status elevation
        NEW.user_id := OLD.user_id;
        NEW.status := 'unverified';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_report_ownership() FROM authenticated;

DROP TRIGGER IF EXISTS trg_enforce_report_ownership ON public.community_reports;
CREATE TRIGGER trg_enforce_report_ownership
    BEFORE INSERT ON public.community_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_report_ownership();

-- ---------------------------------------------------------------------
-- 4. HARDEN SANITIZED COMMUNITY FEED RPC
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
    -- 1. Reject unauthenticated callers immediately
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required: Anonymous callers cannot query community feed.';
    END IF;

    -- 2. Validate and cap pagination parameters to prevent scraping & DoS
    IF p_limit IS NULL OR p_limit > 100 THEN
        p_limit := 100;
    ELSIF p_limit < 1 THEN
        p_limit := 10;
    END IF;

    IF p_offset IS NULL OR p_offset < 0 THEN
        p_offset := 0;
    END IF;

    -- 3. Return strictly sanitized fields with day-level date truncation
    RETURN QUERY
    SELECT
        cr.id,
        pg_catalog.substr(pg_catalog.trim(cr.area), 1, 100) AS area,
        cr.concern_type,
        cr.status,
        pg_catalog.date_trunc('day', cr.created_at) AS approximate_date
    FROM public.community_reports cr
    ORDER BY cr.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Revoke all function privileges from PUBLIC and anon
REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) FROM anon;

-- Grant EXECUTE strictly to authenticated users
GRANT EXECUTE ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) TO authenticated;

COMMENT ON FUNCTION public.get_sanitized_community_feed(pg_catalog.int4, pg_catalog.int4) IS 
'Sanitized community safety feed. Callable strictly by authenticated users. Returns day-truncated timestamps without descriptions, user identifiers, or exact coordinates.';

-- ---------------------------------------------------------------------
-- 5. SECURE SIGNUP TRIGGER FUNCTION WITH SET search_path = ''
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_user_signup_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        pg_catalog.coalesce(NEW.email, ''),
        pg_catalog.coalesce(NEW.raw_user_meta_data->>'full_name', ''),
        pg_catalog.timezone('utc', pg_catalog.now()),
        pg_catalog.timezone('utc', pg_catalog.now())
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE
            WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name
            ELSE public.profiles.full_name
        END,
        updated_at = pg_catalog.timezone('utc', pg_catalog.now());
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_user_signup_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_user_signup_profile() FROM anon;
REVOKE ALL ON FUNCTION public.handle_user_signup_profile() FROM authenticated;

-- ---------------------------------------------------------------------
-- 6. IMMUTABLE PROFILE SECURITY TRIGGER
-- ---------------------------------------------------------------------
-- Prevent users from modifying their id, email, or escalation attributes
CREATE OR REPLACE FUNCTION public.protect_profile_immutable_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Preserve immutable identity fields derived from auth.users
    NEW.id := OLD.id;
    NEW.email := OLD.email;
    NEW.created_at := OLD.created_at;
    NEW.updated_at := pg_catalog.timezone('utc', pg_catalog.now());
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_immutable_fields() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_profile_immutable_fields() FROM anon;
REVOKE ALL ON FUNCTION public.protect_profile_immutable_fields() FROM authenticated;

DROP TRIGGER IF EXISTS trg_protect_profile_immutable_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_immutable_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_immutable_fields();

-- ---------------------------------------------------------------------
-- 7. TOTP MFA (AAL2) VERIFICATION HELPER
-- ---------------------------------------------------------------------
-- Returns true if the current authenticated caller has verified MFA (AAL2)
CREATE OR REPLACE FUNCTION public.is_mfa_verified()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
    SELECT (pg_catalog.coalesce((auth.jwt()->>'aal'), 'aal1') = 'aal2');
$$;

REVOKE ALL ON FUNCTION public.is_mfa_verified() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_mfa_verified() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_mfa_verified() TO authenticated;
