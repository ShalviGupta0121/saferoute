# SafeRoute — Archived PostgreSQL & Supabase Architecture

This directory preserves the complete database architecture, Row Level Security (RLS) migrations, rate-limiting algorithms, and Edge Function implementations developed for SafeRoute's backend.

The live SafeRoute web application operates as a privacy-first, standalone client-side platform utilizing browser `localStorage` for offline and immediate persistence without backend dependencies. These SQL files serve as the production reference architecture for cloud deployment and hackathon evaluation.

## Contents

- **`migrations/20261112_init_saferoute.sql`**: Initial schema definition for `profiles` and `community_reports`.
- **`migrations/20261112_security_hardening.sql`**: Row Level Security policies, unverified status constraints, and search_path hardening.
- **`migrations/20261112_final_security_corrections.sql`**: Revocation of raw table execution and implementation of `get_sanitized_community_feed()`.
- **`migrations/20261112_anonymous_reporting.sql`**: Complete anonymous reporting architecture:
  - Keyed HMAC-SHA-256 rate limiting with server-side secrets.
  - Concurrency-safe row-level locking (`SELECT ... FOR UPDATE`).
  - Rightmost proxy header parsing (`cf-connecting-ip`, `x-forwarded-for`).
  - Approved Delhi NCR locality normalizer (`normalize_public_locality`).
  - Strict `service_role` moderation RPC (`moderate_community_report`).
  - Direct table isolation for authenticated users (`USING (auth.uid() = user_id AND user_id IS NOT NULL)`).
- **`functions/submit-report/index.ts`**: Edge function reference implementation for Web Crypto HMAC calculation.
- **`tests/database_security.test.sql`**: Automated pgTAP database security test suite.
