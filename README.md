# SafeRoute 🛡️
### Safer Journeys, Stronger Women — Demonstration-Ready Platform

SafeRoute is a women's safety-focused navigation and public awareness web application built to empower commuters across Delhi NCR with drivable road routing alternatives, verified crime statistics, and crowdsourced community safety notices.

Unlike conventional navigation applications that solely prioritize the fastest path, SafeRoute emphasizes informed decision-making, contextual public safety transparency, and community-reported street infrastructure observations.

---

## 📑 Table of Contents

1. [Key Features & Capabilities](#-key-features--capabilities)
2. [Verified Delhi Crime Data Integration](#-verified-delhi-crime-data-integration)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Database Architecture & Security (Supabase)](#-database-architecture--security-supabase)
5. [Local Development Quickstart](#-local-development-quickstart)
6. [Supabase Setup & SQL Migration Guide](#-supabase-setup--sql-migration-guide)
7. [Vercel Deployment Guide](#-vercel-deployment-guide)
8. [Demonstration Scenarios (For Evaluators & Video Recording)](#-demonstration-scenarios-for-evaluators--video-recording)
9. [Data Methodology, Ethics & Transparency](#-data-methodology-ethics--transparency)

---

## ✨ Key Features & Capabilities

- **Real Road Routing via OSRM & Nominatim:** Computes actual drivable road routes across Delhi using Project-OSRM and OpenStreetMap Nominatim with robust status checking, network failure handling, and request timeouts.
- **Alternative Routes & Interactive Selection:** Displays all returned route alternatives with distance in kilometers and duration in minutes. Users can interactively select any route card or map polyline to highlight the active route and update metrics dynamically.
- **Strict Data Transparency:** Clearly distinguishes between road calculation and crime risk. No artificial route safety scores or fabricated micro-hotspots are generated from citywide aggregates.
- **Empirical Delhi Crime Data:** Structured datasets covering 4-year NCRB registered crime trends (2021–2024), 2024 IPC/BNS categorical heads, offender-victim relationship analyses (97.3% known perpetrators), and a separate Ministry of Home Affairs (MHA) Delhi Police series.
- **Supabase Authentication:** Complete authentication system supporting email/password registration, login with show/hide password, session restoration across refreshes, password reset dispatches, and protected routes.
- **PostgreSQL Community Reporting:** Crowdsourced reporting for street lighting failures, suspicious activity, and infrastructure concerns with Row-Level Security (RLS) enforcement, optional GPS tagging with explicit consent, and privacy preservation (reporter emails are never publicly exposed).
- **Profile & Emergency Safety Hub:** Personal dashboard displaying submitted reports (with deletion controls) and a verified Delhi emergency helpline directory (1091, 112, 100, NCW, and DMRC).
- **Responsive & Accessible Design:** Cohesive visual identity maintaining SafeRoute's signature blush-pink, rose-white, and dark-plum palette across desktop, tablet, and mobile browsers.

---

## 📊 Verified Delhi Crime Data Integration

SafeRoute utilizes strictly documented official statistics from National Crime Records Bureau (NCRB) publications, Ministry of Home Affairs parliamentary replies, and the Directorate of Economics & Statistics (DES):

### Dataset A: NCRB Delhi State/UT Annual Registered Cases (2021–2024)
- **2021:** 14,277 registered cases
- **2022:** 14,247 registered cases (-0.2%)
- **2023:** 13,439 registered cases (-5.7%)
- **2024:** 13,396 registered cases (-0.3%)
- *Source:* NCRB Crime in India 2024, Table 3A.1, and Rajya Sabha USQ 390, Annexure III.
- *Methodological Caveat:* Registered cases reflect formal police recordings (FIRs) and reporting patterns. A decline in registered FIRs is not evidence that actual victimization decreased.

### Dataset B: Delhi 2024 Crime-Category Breakdown (Selected IPC/BNS Heads)
- **Rape (IPC 376 / BNS 64):** 1,058 cases
- **Assault with intent to outrage modesty (IPC 354 / BNS 74):** 755 cases
- **Sexual harassment (IPC 354A / BNS 75):** 316 cases
- **Assault/disrobe (IPC 354B / BNS 76):** 279 cases
- **Stalking (IPC 354D / BNS 78):** 178 cases
- **Voyeurism (IPC 354C / BNS 77):** 38 cases
- **2024 Totals:** 11,795 IPC/BNS cases + 1,601 Special & Local Laws (SLL) incidents = **13,396 combined total**.
- *Aggregation Note:* The 6 selected categories represent key public-space safety heads and do not equal the full 13,396 total (which includes domestic cruelty, kidnapping, dowry prohibition, and POCSO).

### Dataset C: Offender Relationship Insight (2024)
- **Recorded Rape Cases:** 1,058
- **Known Offenders:** 1,029 (**97.3%**)
- **Unknown / Unidentified Offenders:** 29 (**2.7%**)
- *Crucial Context:* Demonstrates that 97.3% of recorded sexual violence involves individuals known to the victim. Route navigation technologies address public-space street infrastructure (lighting, active corridors) and cannot prevent domestic or interpersonal violence.

### Separate Series: MHA / Delhi Police-Reported Cases (Rajya Sabha USQ 4220)
- **2023:** 13,208 cases
- **2024:** 13,195 cases
- **2025:** 12,458 cases
- *Source:* Ministry of Home Affairs / Rajya Sabha USQ 4220, dated 1 April 2026.
- *Distinction Notice:* Published as a separate administrative series and maintained independently without averaging or merging with NCRB figures.

---

## 🛠️ Architecture & Tech Stack

```
SafeRoute/
├── public/                     # Static assets
├── scripts/
│   ├── verifySystem.js         # Automated data integrity & test suite
│   ├── securityAuditSimulation.js # 42-point adversarial attack & security simulation
│   └── testRealDatabaseSecurity.js # Live PostgreSQL integration security test
├── src/
│   ├── assets/                 # Icons and imagery
│   ├── components/
│   │   ├── Auth/               # Login, Register, ForgotPassword views
│   │   ├── CommunityReports/   # Crowdsourced reporting form & sanitized shared feed
│   │   ├── Dashboard/          # Welcome banner, quick planner, analytics snapshot
│   │   ├── DelhiInsights/      # Interactive NCRB & MHA statistical charts
│   │   ├── Landing/            # Brand hero, quick lookup, core pillars
│   │   ├── Profile/            # Account details, my reports, emergency directory, TOTP MFA
│   │   ├── RoutePlanner/       # OSRM navigation & interactive alternative selection
│   │   ├── Navbar.jsx          # Responsive sticky navigation bar
│   │   ├── SupabaseConfigBanner.jsx # Real-time backend connection diagnostic banner
│   │   └── Toast.jsx           # Dismissible status notification alerts
│   ├── context/
│   │   └── AuthContext.jsx     # Supabase auth state, session persistence & demo mode
│   ├── data/
│   │   ├── delhiCrimeData.js   # Structured official datasets, metadata & citations
│   │   └── safetyData.js       # Legacy reference data
│   ├── lib/
│   │   └── supabaseClient.js   # Singleton Supabase client with status detection
│   ├── services/
│   │   └── reportService.js    # PostgreSQL database service for community reports
│   ├── App.css                 # SafeRoute design system & responsive styling
│   ├── App.jsx                 # Application root & view router
│   ├── index.css               # Global typography & root container
│   ├── main.jsx                # React DOM mount point & Leaflet CSS
│   └── map.jsx                 # Leaflet interactive map component
├── supabase/
│   ├── migrations/
│   │   ├── 20261112_init_saferoute.sql # Baseline schema
│   │   ├── 20261112_security_hardening.sql # Dedicated profiles table & RLS user isolation
│   │   └── 20261112_final_security_corrections.sql # Final RPC hardening, revoked UPDATE, immutable profiles
│   └── tests/
│       └── database_security.test.sql # pgTAP PostgreSQL engine security test suite
├── .env.example                # Environment variable template
├── vercel.json                 # Vercel SPA rewrite & strict security headers (CSP, HSTS)
├── vite.config.js              # Vite bundler configuration
└── package.json                # Project dependencies and npm scripts
```

---

## 🗄️ Database Architecture & Security (Supabase)

The backend runs on Supabase (PostgreSQL) with strict **Row Level Security (RLS)** and database-level authorization:

### 1. Private User Profiles Table (`public.profiles`)
- `id`: UUID primary key referencing `auth.users(id)` ON DELETE CASCADE.
- `email`: Text (populated from verified auth identity).
- `full_name`, `phone_number`, `emergency_contact`, `preferred_language`: Private user attributes.
- **RLS Access Rule:** Accessible strictly by the authenticated profile owner (`auth.uid() = id`).
- **Immutable Fields Trigger:** Trigger `trg_protect_profile_immutable_fields` enforces that users cannot modify `id`, `email`, or inject administrative claims.
- **Access Privileges:** All access revoked from `anon` and `PUBLIC`. Only `authenticated` users can read/modify their own record.

### 2. Community Reports Table (`public.community_reports`)
- `id`: UUID primary key (`gen_random_uuid()`).
- `user_id`: UUID foreign key derived securely from `auth.uid()`.
- `area`: Text (2–150 chars).
- `concern_type`: Text (strictly checked against enumerated categories).
- `description`: Text (5–2000 chars; kept private to the report author).
- `latitude`, `longitude`: Numeric (captured only upon explicit user click; kept private to author).
- `status`: Text (forced to `'unverified'` upon creation).
- `created_at`: Timestamptz (system UTC timestamp).
- **Report Immutability:** `UPDATE` privilege is completely **REVOKED** from all roles (`authenticated`, `anon`, `PUBLIC`). Reports cannot be altered, spoofed, or self-elevated to "verified".
- **RLS Access Rule:** Authenticated users can `INSERT`, `SELECT`, and `DELETE` strictly their own reports (`auth.uid() = user_id`).

### 3. Sanitized Shared Feed RPC (`public.get_sanitized_community_feed`)
- Declared `SECURITY DEFINER` with empty search path (`SET search_path = ''`) and fully qualified catalog references.
- Rejects unauthenticated callers immediately (`IF auth.uid() IS NULL THEN RAISE EXCEPTION...`).
- `EXECUTE` privilege is completely **REVOKED** from `PUBLIC` and `anon`; granted strictly to `authenticated`.
- Enforces validated pagination (`p_limit` capped between 1 and 100, `p_offset >= 0`).
- Returns strictly sanitized fields: `id`, `area` (broad locality), `concern_type`, `status`, and `approximate_date` (truncated to day level via `pg_catalog.date_trunc('day', ...)`).
- Completely excludes private descriptions, GPS coordinates, emails, and user IDs.
- Obsolete view `public.public_community_reports` has been safely dropped.

### 4. Two-Factor Authentication (TOTP MFA)
- Integrated via Supabase Auth MFA (`supabase.auth.mfa.enroll`, `challengeAndVerify`).
- Database verification helper function `public.is_mfa_verified()` checks if the session has achieved Authenticator Assurance Level 2 (`(auth.jwt()->>'aal') = 'aal2'`).

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Navigate
```bash
git clone https://github.com/ritikasingh2509/SafeRoute.git
cd SafeRoute
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated System Verification
Verify all crime data points, calculations, and service interfaces:
```bash
npm test
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If Supabase credentials are not added yet, the application gracefully launches in **Demo Preview Mode** with an explicit diagnostic banner).*

### 5. Start Development Server
```bash
npm run dev
```
Open the local URL displayed (typically `http://localhost:5173`) in your web browser.

### 6. Run Production Build & Linting
```bash
npm run lint
npm run build
```

---

## 🔐 Supabase Setup & SQL Migration Guide

To connect your own real Supabase project:

1. **Create Project:** Visit [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Migration:**
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Open the file `supabase/migrations/20261112_init_saferoute.sql` from this repository.
   - Paste the SQL into the editor and click **Run**.
   - This creates the `community_reports` table, indexes, RLS policies, and the sanitized `public_community_reports` view.
3. **Configure Authentication:**
   - In Supabase Dashboard, navigate to **Authentication** -> **Providers** -> **Email**.
   - Ensure Email provider is enabled. (For development testing, you can disable "Confirm email" if you want users to log in immediately upon signup).
4. **Copy API Credentials:**
   - Navigate to **Project Settings** -> **API**.
   - Copy **Project URL** and the **anon (public)** key.
5. **Update `.env`:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key-here
   ```
6. **Restart Vite:**
   Restart your dev server (`npm run dev`). The top diagnostic banner will confirm real Supabase connectivity, and user registrations and reports will store directly in PostgreSQL.

---

## ☁️ Vercel Deployment Guide

SafeRoute is fully configured for continuous deployment on Vercel:

1. Push your changes to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New** -> **Project**.
3. Import your `SafeRoute` repository.
4. Set Framework Preset: **Vite**.
5. Set Build & Output Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL` = Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
7. Click **Deploy**. The included `vercel.json` ensures client-side routes and page refreshes work seamlessly.

---

## 🎥 Demonstration Scenarios (For Evaluators & Video Recording)

SafeRoute includes two dedicated, reproducible demonstration flows designed for evaluation and video walkthroughs:

### Demo Scenario 1: Delhi Safety Insights Walkthrough
1. From the navigation bar, click **Delhi Safety Insights**.
2. **Dataset A (Annual Trend):** Inspect the 2021–2024 NCRB recorded cases trend (14,277 → 13,396). Click on any year's bar to view the detailed registration context.
3. **Dataset B (Categorical Breakdown):** Observe the 2024 totals (11,795 IPC/BNS + 1,601 SLL = 13,396 combined). Click on individual crime heads (Rape: 1,058, Outrage modesty: 755, Sexual harassment: 316, Assault/disrobe: 279, Stalking: 178, Voyeurism: 38) to view legal definitions and commuter relevance.
4. **Dataset C (Offender Relationship):** Review the 97.3% known-perpetrator finding and read the technology scope boundary explaining why road navigation addresses transit corridors rather than domestic violence.
5. **Separate MHA Series:** Examine the distinct Ministry of Home Affairs series (2023: 13,208; 2024: 13,195; 2025: 12,458) with clear source attribution.
6. **Official Citations:** Scroll to the bottom to verify active links to NCRB and Rajya Sabha source documentation.

### Demo Scenario 2: Smart Journey Planning (Saket → Rohini)
1. Navigate to **Plan a Journey** (or use the shortcut in the Dashboard).
2. Click the preset button: **"Load: Saket → Rohini, Delhi"**.
3. Click **Calculate Road Routes**.
4. Observe:
   - Nominatim geocodes Saket (South Delhi) and Rohini (North-West Delhi).
   - OSRM computes actual driving routes across Delhi's arterial road network.
   - All returned alternative routes display with real distance (km) and travel duration (min).
   - The map fits bounds, rendering green (start) and violet (destination) markers.
   - Click on different alternative route cards or map polylines to switch the highlighted active route.
   - Read the prominent **Important Safety Distinction** notice clarifying that route navigation is not ranked with aggregate crime figures.

### Demo Scenario 3: Community Reporting & Live Database Persistence
1. Navigate to **Community Reports**.
2. Under "Submit a Safety Concern":
   - Enter Area: `Connaught Place, Block M`
   - Select Category: `Street lighting issue`
   - Description: `Two high-mast lights out near pedestrian crossing.`
   - (Optional) Click **Tag Current Location** to demonstrate consent-based coordinate capture.
   - Click **Submit Community Report**.
3. Confirm that the notice immediately appears in the shared community feed with the badge `"Community Submitted — Unverified"`.
4. Navigate to **Profile / Account** to verify your report appears under "Your Submitted Safety Reports" with a functioning **Delete** control.

---

## ⚖️ Data Methodology, Ethics & Transparency

SafeRoute operates on strict principles of scientific integrity and user safety:

1. **No Simulated or Fabricated Incident Coordinates:** Official Indian crime statistics do not provide street-level coordinates. SafeRoute never invents artificial 300-meter crime circles, mock heatmaps, or fabricated locality hazard scores.
2. **Reporting FIRs vs. True Victimization:** Official statistics record formal police First Information Reports. Due to social barriers and under-reporting, registered cases do not equal all incidents experienced.
3. **Public Navigation vs. Domestic Violence:** Public-space navigation technologies focus on physical infrastructure—lighting, active thoroughfares, and emergency helplines. They cannot prevent domestic or intimate partner violence.
4. **No Commercial Ranking of Speed as Safety:** The fastest route is not automatically labeled the safest. SafeRoute presents factual distance, duration, and transparent safety guidance to support informed travel.

---

**SafeRoute — Safer Journeys, Stronger Women.**
