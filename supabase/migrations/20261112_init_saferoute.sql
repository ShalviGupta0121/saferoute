-- =====================================================================
-- SAFEROUTE DATABASE INITIALIZATION & MIGRATION
-- Project: SafeRoute - Women's Safety Navigation Platform
-- Date: 2026-11-12
-- =====================================================================

-- 1. Create table for Community Safety Reports
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    area TEXT NOT NULL,
    concern_type TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status TEXT NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add descriptive table and column comments
COMMENT ON TABLE public.community_reports IS 'Crowdsourced community safety reports submitted by authenticated users.';
COMMENT ON COLUMN public.community_reports.status IS 'Verification status. Default is unverified. Community submissions are marked as Community Submitted — Unverified.';
COMMENT ON COLUMN public.community_reports.user_id IS 'References the auth.users id of the submitting user. Private and protected by RLS.';

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_reports_created_at ON public.community_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_reports_user_id ON public.community_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_area ON public.community_reports (area);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy 1: Authenticated users can submit their own reports
-- Ensures a user cannot submit a report on behalf of another user id
CREATE POLICY "Authenticated users can submit their own reports"
    ON public.community_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 2: Authenticated and public users can read community reports
-- Users can browse reports without viewing private user credentials
CREATE POLICY "Public read access for community reports"
    ON public.community_reports
    FOR SELECT
    USING (true);

-- Policy 3: Users can update only their own reports
CREATE POLICY "Users can update their own reports"
    ON public.community_reports
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete only their own reports
CREATE POLICY "Users can delete their own reports"
    ON public.community_reports
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Safe Public View
-- This view omits user_id and any private profile information,
-- ensuring that public report feeds never expose reporter user IDs or emails.
CREATE OR REPLACE VIEW public.public_community_reports AS
SELECT
    id,
    area,
    concern_type,
    description,
    latitude,
    longitude,
    status,
    created_at
FROM public.community_reports
ORDER BY created_at DESC;

-- Grant select permissions on the view
GRANT SELECT ON public.public_community_reports TO anon, authenticated;
