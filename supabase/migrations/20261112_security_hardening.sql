-- =====================================================================
-- SAFEROUTE SECURITY & DATABASE HARDENING MIGRATION
-- Migration: 20261112_security_hardening.sql
-- Purpose: Complete user data isolation, RLS hardening, sanitized feeds,
--          profiles architecture, and database constraint enforcement.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. USER PROFILES TABLE (STRICTLY PRIVATE USER DATA ISOLATION)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    phone_number TEXT,
    emergency_contact TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_profile_full_name_len CHECK (char_length(full_name) <= 100),
    CONSTRAINT chk_profile_phone_len CHECK (phone_number IS NULL OR char_length(phone_number) <= 20)
);

COMMENT ON TABLE public.profiles IS 'Private commuter profile data. Accessible strictly by the profile owner.';

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Revoke all public / anon access from private profiles table
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Strict User Isolation Policies for profiles: auth.uid() = id
DROP POLICY IF EXISTS "Users can only read their own profile" ON public.profiles;
CREATE POLICY "Users can only read their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can only insert their own profile" ON public.profiles;
CREATE POLICY "Users can only insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can only update their own profile" ON public.profiles;
CREATE POLICY "Users can only update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can only delete their own profile" ON public.profiles;
CREATE POLICY "Users can only delete their own profile"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Trigger to automatically create private profile upon user registration
CREATE OR REPLACE FUNCTION public.handle_user_signup_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE
            WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name
            ELSE public.profiles.full_name
        END,
        updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_signup_profile ON auth.users;
CREATE TRIGGER trg_user_signup_profile
    AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_signup_profile();

-- ---------------------------------------------------------------------
-- 2. HARDENING COMMUNITY REPORTS TABLE (REMOVING OVERLY PERMISSIVE RLS)
-- ---------------------------------------------------------------------

-- Remove the previous insecure "Public read access" policy (FOR SELECT USING (true))
DROP POLICY IF EXISTS "Public read access for community reports" ON public.community_reports;
DROP POLICY IF EXISTS "Authenticated users can submit their own reports" ON public.community_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.community_reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.community_reports;
DROP POLICY IF EXISTS "Users can only read their own reports" ON public.community_reports;

-- Enforce strict database constraints on community_reports
ALTER TABLE public.community_reports
    DROP CONSTRAINT IF EXISTS chk_report_area_len,
    DROP CONSTRAINT IF EXISTS chk_report_desc_len,
    DROP CONSTRAINT IF EXISTS chk_report_concern_type,
    DROP CONSTRAINT IF EXISTS chk_report_coords,
    DROP CONSTRAINT IF EXISTS chk_report_status;

ALTER TABLE public.community_reports
    ADD CONSTRAINT chk_report_area_len CHECK (char_length(trim(area)) BETWEEN 2 AND 150),
    ADD CONSTRAINT chk_report_desc_len CHECK (char_length(trim(description)) BETWEEN 5 AND 2000),
    ADD CONSTRAINT chk_report_concern_type CHECK (concern_type IN (
        'Street lighting issue',
        'Suspicious activity',
        'Poor visibility',
        'Harassment concern',
        'Unsafe public infrastructure',
        'Other'
    )),
    ADD CONSTRAINT chk_report_coords CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude BETWEEN -90.0 AND 90.0 AND longitude BETWEEN -180.0 AND 180.0)
    ),
    ADD CONSTRAINT chk_report_status CHECK (status IN ('unverified', 'verified', 'flagged'));

-- Revoke all table-level access from anon and PUBLIC
REVOKE ALL ON public.community_reports FROM anon;
REVOKE ALL ON public.community_reports FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_reports TO authenticated;

-- RLS Policy 1 (Private Reading): Users can ONLY read their own full report records
CREATE POLICY "Users can only read their own reports"
    ON public.community_reports
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policy 2 (Tamper-Resistant Insertion): Only authenticated owner, forced to unverified
CREATE POLICY "Users can only insert their own unverified reports"
    ON public.community_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND status = 'unverified'
    );

-- RLS Policy 3 (Tamper-Resistant Update): Only author can edit, cannot elevate status to verified
CREATE POLICY "Users can only update their own unverified reports"
    ON public.community_reports
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND status = 'unverified'
    );

-- RLS Policy 4 (Owner Deletion): Author can delete their own report
CREATE POLICY "Users can only delete their own reports"
    ON public.community_reports
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger to enforce identity from verified session and prevent verification tampering
CREATE OR REPLACE FUNCTION public.enforce_report_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Derive user_id directly from the verified authentication context
    NEW.user_id := auth.uid();
    
    -- Ordinary users can NEVER elevate status to verified
    IF TG_OP = 'INSERT' THEN
        NEW.status := 'unverified';
        NEW.created_at := timezone('utc'::text, now());
    ELSIF TG_OP = 'UPDATE' THEN
        -- Retain original author and prevent status elevation
        NEW.user_id := OLD.user_id;
        NEW.status := 'unverified';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_report_ownership ON public.community_reports;
CREATE TRIGGER trg_enforce_report_ownership
    BEFORE INSERT OR UPDATE ON public.community_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_report_ownership();

-- ---------------------------------------------------------------------
-- 3. SANITIZED COMMUNITY REPORT FEED (NO PRIVATE DETAILS EXPOSED)
-- ---------------------------------------------------------------------
-- RPC Function to safely query sanitized community summaries.
-- Explicitly omits: description, exact coordinates (lat/long), and user_id.
-- Truncates timestamps to hour to prevent temporal tracking.
CREATE OR REPLACE FUNCTION public.get_sanitized_community_feed(
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    area TEXT,
    concern_type TEXT,
    status TEXT,
    approximate_date TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Enforce strict pagination limits to prevent database scraping
    IF p_limit > 100 THEN p_limit := 100; END IF;
    IF p_limit < 1 THEN p_limit := 10; END IF;
    IF p_offset < 0 THEN p_offset := 0; END IF;

    RETURN QUERY
    SELECT
        cr.id,
        cr.area,
        cr.concern_type,
        cr.status,
        date_trunc('hour', cr.created_at) AS approximate_date
    FROM public.community_reports cr
    ORDER BY cr.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Secure function permissions
REVOKE ALL ON FUNCTION public.get_sanitized_community_feed(INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_sanitized_community_feed(INT, INT) TO anon, authenticated;

-- Replace existing public_community_reports view with a sanitized security_barrier view
DROP VIEW IF EXISTS public.public_community_reports;
CREATE VIEW public.public_community_reports
WITH (security_barrier = true) AS
SELECT
    id,
    area,
    concern_type,
    status,
    date_trunc('hour', created_at) AS approximate_date
FROM public.community_reports;

COMMENT ON VIEW public.public_community_reports IS 'Sanitized community summary feed. Excludes all private descriptions, coordinates, and user identities.';

REVOKE ALL ON public.public_community_reports FROM PUBLIC;
GRANT SELECT ON public.public_community_reports TO anon, authenticated;
