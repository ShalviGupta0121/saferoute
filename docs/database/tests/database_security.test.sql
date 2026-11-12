-- =====================================================================
-- SAFEROUTE REAL DATABASE SECURITY TEST SUITE (pgTAP)
-- Test file: supabase/tests/database_security.test.sql
-- Execution command: supabase test db
-- Purpose:
--   Verifies database privileges, RLS status, function security definer
--   configurations, search_path restrictions, and privilege revocations
--   directly inside the PostgreSQL engine.
-- =====================================================================

BEGIN;

-- Load pgTAP testing extension
CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(22);

-- ---------------------------------------------------------------------
-- 1. SCHEMA INTEGRITY & TABLE VERIFICATION
-- ---------------------------------------------------------------------

-- Verify private user profiles table exists
SELECT has_table('public', 'profiles', 'Table public.profiles must exist');

-- Verify community reports table exists
SELECT has_table('public', 'community_reports', 'Table public.community_reports must exist');

-- Verify obsolete public view was dropped
SELECT hasnt_view('public', 'public_community_reports', 'Obsolete view public.public_community_reports must NOT exist');

-- ---------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) STATUS VERIFICATION
-- ---------------------------------------------------------------------

-- Profiles must have RLS active
SELECT results_eq(
    $$ SELECT relrowsecurity FROM pg_class WHERE oid = 'public.profiles'::regclass $$,
    $$ VALUES (true) $$,
    'public.profiles must have Row Level Security enabled'
);

-- Community reports must have RLS active
SELECT results_eq(
    $$ SELECT relrowsecurity FROM pg_class WHERE oid = 'public.community_reports'::regclass $$,
    $$ VALUES (true) $$,
    'public.community_reports must have Row Level Security enabled'
);

-- ---------------------------------------------------------------------
-- 3. FUNCTION SECURITY DEFINER & SEARCH_PATH CONFIGURATION
-- ---------------------------------------------------------------------

-- get_sanitized_community_feed must exist
SELECT has_function(
    'public',
    'get_sanitized_community_feed',
    ARRAY['integer', 'integer'],
    'Function public.get_sanitized_community_feed(int, int) must exist'
);

-- get_sanitized_community_feed must be SECURITY DEFINER
SELECT results_eq(
    $$ SELECT prosecdef FROM pg_proc WHERE proname = 'get_sanitized_community_feed' AND pronamespace = 'public'::regnamespace $$,
    $$ VALUES (true) $$,
    'public.get_sanitized_community_feed must be declared SECURITY DEFINER'
);

-- get_sanitized_community_feed must enforce empty search_path
SELECT results_eq(
    $$ SELECT proconfig FROM pg_proc WHERE proname = 'get_sanitized_community_feed' AND pronamespace = 'public'::regnamespace $$,
    $$ VALUES (ARRAY['search_path=']::text[]) $$,
    'public.get_sanitized_community_feed must have search_path set to empty'
);

-- enforce_report_ownership trigger function must have search_path set to empty
SELECT results_eq(
    $$ SELECT proconfig FROM pg_proc WHERE proname = 'enforce_report_ownership' AND pronamespace = 'public'::regnamespace $$,
    $$ VALUES (ARRAY['search_path=']::text[]) $$,
    'public.enforce_report_ownership must have search_path set to empty'
);

-- handle_user_signup_profile trigger function must have search_path set to empty
SELECT results_eq(
    $$ SELECT proconfig FROM pg_proc WHERE proname = 'handle_user_signup_profile' AND pronamespace = 'public'::regnamespace $$,
    $$ VALUES (ARRAY['search_path=']::text[]) $$,
    'public.handle_user_signup_profile must have search_path set to empty'
);

-- ---------------------------------------------------------------------
-- 4. FUNCTION EXECUTION PRIVILEGES (REVOKE FROM ANON, GRANT AUTHENTICATED)
-- ---------------------------------------------------------------------

-- anon role must NOT have EXECUTE on get_sanitized_community_feed
SELECT results_eq(
    $$ SELECT has_function_privilege('anon', 'public.get_sanitized_community_feed(int, int)', 'EXECUTE') $$,
    $$ VALUES (false) $$,
    'anon role must be REVOKED from executing get_sanitized_community_feed'
);

-- PUBLIC pseudo-role must NOT have EXECUTE on get_sanitized_community_feed
SELECT results_eq(
    $$ SELECT has_function_privilege('public', 'public.get_sanitized_community_feed(int, int)', 'EXECUTE') $$,
    $$ VALUES (false) $$,
    'PUBLIC role must be REVOKED from executing get_sanitized_community_feed'
);

-- authenticated role MUST have EXECUTE on get_sanitized_community_feed
SELECT results_eq(
    $$ SELECT has_function_privilege('authenticated', 'public.get_sanitized_community_feed(int, int)', 'EXECUTE') $$,
    $$ VALUES (true) $$,
    'authenticated role MUST have EXECUTE privilege on get_sanitized_community_feed'
);

-- ---------------------------------------------------------------------
-- 5. TABLE ACCESS PRIVILEGES & ELIMINATING UNNECESSARY UPDATE
-- ---------------------------------------------------------------------

-- anon role must have NO privileges on community_reports
SELECT results_eq(
    $$ SELECT has_table_privilege('anon', 'public.community_reports', 'SELECT') $$,
    $$ VALUES (false) $$,
    'anon role must NOT have SELECT on public.community_reports'
);

-- anon role must have NO privileges on profiles
SELECT results_eq(
    $$ SELECT has_table_privilege('anon', 'public.profiles', 'SELECT') $$,
    $$ VALUES (false) $$,
    'anon role must NOT have SELECT on public.profiles'
);

-- authenticated role MUST have SELECT on community_reports (filtered by RLS)
SELECT results_eq(
    $$ SELECT has_table_privilege('authenticated', 'public.community_reports', 'SELECT') $$,
    $$ VALUES (true) $$,
    'authenticated role must have SELECT privilege on public.community_reports'
);

-- authenticated role MUST have INSERT on community_reports (controlled by RLS & trigger)
SELECT results_eq(
    $$ SELECT has_table_privilege('authenticated', 'public.community_reports', 'INSERT') $$,
    $$ VALUES (true) $$,
    'authenticated role must have INSERT privilege on public.community_reports'
);

-- authenticated role MUST have DELETE on community_reports (controlled by RLS)
SELECT results_eq(
    $$ SELECT has_table_privilege('authenticated', 'public.community_reports', 'DELETE') $$,
    $$ VALUES (true) $$,
    'authenticated role must have DELETE privilege on public.community_reports'
);

-- CRITICAL: authenticated role must NOT have UPDATE privilege on community_reports
SELECT results_eq(
    $$ SELECT has_table_privilege('authenticated', 'public.community_reports', 'UPDATE') $$,
    $$ VALUES (false) $$,
    'authenticated role must NOT have UPDATE privilege on public.community_reports (reports are immutable)'
);

-- Verify no UPDATE policy exists on community_reports
SELECT results_eq(
    $$ SELECT count(*)::int FROM pg_policies WHERE tablename = 'community_reports' AND cmd = 'UPDATE' $$,
    $$ VALUES (0) $$,
    'No UPDATE RLS policy should exist on public.community_reports'
);

-- ---------------------------------------------------------------------
-- 6. MFA HELPER VERIFICATION
-- ---------------------------------------------------------------------

SELECT has_function(
    'public',
    'is_mfa_verified',
    ARRAY[]::text[],
    'Function public.is_mfa_verified() must exist'
);

SELECT results_eq(
    $$ SELECT has_function_privilege('authenticated', 'public.is_mfa_verified()', 'EXECUTE') $$,
    $$ VALUES (true) $$,
    'authenticated role must have EXECUTE privilege on public.is_mfa_verified()'
);

SELECT * FROM finish();
ROLLBACK;
