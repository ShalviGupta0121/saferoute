# SafeRoute 🛡️
### Safer Journeys, Stronger Women — Standalone Web Application

SafeRoute is a women's safety-focused navigation and public awareness web application built to empower commuters across Delhi NCR with drivable road routing alternatives, verified government crime statistics, and crowdsourced community safety notices.

Unlike conventional navigation applications that solely prioritize the fastest path, SafeRoute emphasizes informed decision-making, contextual public safety transparency, and community-reported street infrastructure observations.

SafeRoute operates as a **privacy-first, standalone client-side web application** utilizing browser local storage for persistent data management, eliminating unnecessary login barriers and external database dependencies.

---

## 📑 Table of Contents

1. [Key Features & Capabilities](#-key-features--capabilities)
2. [Verified Delhi Crime Data Integration](#-verified-delhi-crime-data-integration)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Community Reporting & Local Data Storage](#-community-reporting--local-data-storage)
5. [Local Development Quickstart](#-local-development-quickstart)
6. [Vercel Deployment Guide](#-vercel-deployment-guide)
7. [Demonstration Scenarios (For Evaluators & Video Recording)](#-demonstration-scenarios-for-evaluators--video-recording)
8. [Data Methodology, Ethics & Transparency](#-data-methodology-ethics--transparency)
9. [Current Limitations](#-current-limitations)
10. [Archived Cloud Database Architecture](#-archived-cloud-database-architecture)

---

## ✨ Key Features & Capabilities

- **Real Road Routing via OSRM & Nominatim:** Computes actual drivable road routes across Delhi NCR using Project-OSRM and OpenStreetMap Nominatim with status checking, network failure handling, and request timeouts.
- **Alternative Routes & Interactive Selection:** Displays returned road alternatives with distance in kilometers and duration in minutes. Users can interactively select any route card or map polyline to highlight the active route and inspect metrics.
- **Strict Data Transparency:** Clearly distinguishes between road calculation and crime risk. No artificial route safety scores or fabricated micro-hotspots are generated from citywide crime aggregates.
- **Empirical Delhi Crime Data:** Structured datasets covering 4-year NCRB registered crime trends (2021–2024), 2024 IPC/BNS categorical heads, offender-victim relationship analyses (97.3% known perpetrators), and a separate Ministry of Home Affairs (MHA) Delhi Police series.
- **Privacy-First Anonymous Community Reporting:** Commuters can report infrastructure hazards (e.g. broken streetlights, unlit stretches, poor visibility) without creating an account, logging in, or disclosing any personal contact information.
- **Locality Privacy & PII Safeguards:** Automated client-side sanitization strips dangerous tags, rejects phone numbers and emails, blocks private residential addresses (flat/house numbers), and normalizes free-form inputs to 31 approved Delhi NCR transit/commercial sectors.
- **Coordinate Privacy (~100m Approximation):** Device geolocation is requested only upon explicit user consent and rounded to 3 decimal places (~100m locality radius), protecting pinpoint user coordinates.
- **Persistent Local Browser Storage:** Community notices are stored and managed using HTML5 `localStorage`, persisting reliably across browser refreshes and sessions without requiring external backend servers.
- **Emergency Helpline Directory:** One-tap verified directory for emergency services: 112 (Primary Police Response), 1091 (Delhi Police Women Helpline), 181 (Delhi Govt WCD Helpline), and 155370 (DMRC Metro Helpline).
- **Responsive & Accessible Design:** Cohesive visual identity maintaining SafeRoute's signature blush-pink, rose-white, and dark-plum palette across desktop, tablet, and mobile browsers.

---

## 📊 Verified Delhi Crime Data Integration

SafeRoute utilizes strictly documented official statistics embedded directly in the application ([src/data/delhiCrimeData.js](file:///src/data/delhiCrimeData.js)), sourced from National Crime Records Bureau (NCRB) publications, Ministry of Home Affairs parliamentary replies, and the Delhi Directorate of Economics & Statistics (DES):

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
├── docs/
│   └── database/               # Archived PostgreSQL migrations, RLS policies & Edge Functions
├── public/                     # Static brand assets (favicons, logos, SVGs)
├── scripts/
│   ├── verifySystem.js         # Core module & official crime dataset verification suite
│   ├── securityAuditSimulation.js # 84-assertion adversarial security & privacy test suite
│   └── testRealDatabaseSecurity.js # Optional real database test runner
├── src/
│   ├── assets/                 # Component assets
│   ├── components/
│   │   ├── Auth/               # Client-side Login, Register & ForgotPassword views
│   │   ├── Brand/              # SVG brand logos & lockups
│   │   ├── CommunityReports/   # Crowdsourced reporting form & persistent notices feed
│   │   ├── Dashboard/          # Welcome banner, quick planner & metrics snapshot
│   │   ├── DelhiInsights/      # Interactive NCRB & MHA statistical charts
│   │   ├── Landing/            # Brand hero, quick lookup, core pillars & footer
│   │   ├── Profile/            # Client profile management, my reports & emergency directory
│   │   ├── RoutePlanner/       # Leaflet map, OSRM routing & interactive alternatives
│   │   ├── Navbar.jsx          # Responsive sticky navigation bar (4 primary destinations)
│   │   └── Toast.jsx           # Global status notification toasts
│   ├── context/
│   │   └── AuthContext.jsx     # Standalone client session & demo guest mode provider
│   ├── data/
│   │   ├── delhiCrimeData.js   # Structured official datasets, metadata & citations
│   │   └── emergencyHelplines.js # Verified 112, 1091, 181 & 155370 directory
│   ├── lib/
│   │   └── supabaseClient.js   # Diagnostic configuration stub for standalone mode
│   ├── services/
│   │   ├── profileService.js   # Local browser storage service for user preferences
│   │   └── reportService.js    # LocalStorage community reporting service with PII validation
│   ├── App.css                 # SafeRoute design system & responsive layout styles
│   ├── App.jsx                 # Application root & client-side view router
│   ├── index.css               # Global typography & root variables
│   ├── main.jsx                # React DOM entry point & Leaflet stylesheet
│   └── map.jsx                 # Leaflet interactive map component
├── .env.example                # Template for optional external API configuration
├── vercel.json                 # Vercel SPA rewrite configuration & security headers
├── vite.config.js              # Vite bundler configuration
└── package.json                # Project dependencies and npm scripts
```

### Technology Matrix

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Component-driven architecture using functional components and modern hooks. |
| **Build & Tooling** | **Vite 8** | Rapid development server with optimized production bundling (830ms build). |
| **Icons & Visuals** | **Lucide React** | Clean, accessible SVG iconography. |
| **Mapping Engine** | **Leaflet & React-Leaflet** | Lightweight, open-source interactive mapping. |
| **Tile Provider** | **OpenStreetMap** | Raster tiles via `https://*.tile.openstreetmap.org`. No API key required. |
| **Geocoding** | **OSM Nominatim** | Public geocoding API with Delhi NCR location queries. |
| **Route Calculation** | **Project-OSRM** | Multi-alternative road route generation with driving/walking metrics. |
| **Data Persistence** | **Browser localStorage** | HTML5 client-side storage for community reports and preferences. |

---

## 📝 Community Reporting & Local Data Storage

SafeRoute's community reporting architecture is built on a **privacy-by-default, data-minimized model**:

### 1. Account-Free Submission
- Commuters are **never required** to create an account, log in, or provide a username, email address, or phone number to share a public infrastructure notice.
- The 4 primary public destinations (Home, Plan Your Journey, Community, Safety Insights) are completely unrestricted.

### 2. Client-Side PII Safeguards
Every submitted report is filtered client-side before storage:
- **Phone Number Rejection:** Submissions containing 7 or more consecutive digits are rejected with an explanatory privacy warning.
- **Email Address Rejection:** Submissions containing email patterns are blocked.
- **Residential Address Filtering:** Keywords such as `flat`, `apartment`, `house no`, `h.no`, `room`, and `floor` followed by numbers are rejected to prevent publishing private home addresses.
- **Locality Normalization:** Free-form landmark inputs (e.g., `"Saket Metro Gate 2 lane"`) are mapped to standardized sector labels (`"Saket District Centre, South Delhi"`) via `normalizeLocalityLabel()`.

### 3. Coordinate Privacy
- GPS location is **never captured automatically**.
- Commuters may voluntarily tag coordinates using browser geolocation only when physically present at the hazard.
- Coordinates are automatically rounded to 3 decimal places (`toFixed(3)`), providing an approximate **~100m locality radius** rather than pinpoint device tracking.
- Commuters can click **Clear Pin** at any time to remove coordinates and submit purely by locality text.

### 4. Data Storage & Lifecycle
- Community notices are stored in the user's browser via **`localStorage`** under the key `saferoute_community_reports`.
- New reports are prepended to the local collection and persist across page refreshes and browser sessions.
- **Important Multi-User Note:** Because data is stored in the local browser, notices submitted on one device or browser are **not synchronized across other users or external devices**.
- **Initial Seed Notices:** SafeRoute includes pre-configured sample notices (covering Connaught Place, Dwarka Sector 12, and Saket District Centre) so evaluators can inspect the community feed immediately upon first launch.

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

### 3. Run Automated System Verification & Tests
Execute the verification suite (38 system checks + 84 security simulation assertions):
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open the local URL displayed (typically `http://localhost:5173`) in your web browser.

### 5. Run Linter & Production Build
```bash
npm run lint
npm run build
```

---

## ☁️ Vercel Deployment Guide

SafeRoute is pre-configured for continuous zero-config deployment on Vercel:

1. Push your repository changes to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New** -> **Project**.
3. Import your `SafeRoute` repository.
4. Verify the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `./`
5. **No Environment Variables Required:** Because SafeRoute runs as a self-contained client-side application, no backend environment variables are needed for basic deployment.
6. Click **Deploy**. The included [vercel.json](file:///vercel.json) configures:
   - SPA route rewrites (`/(.*)` -> `/index.html`) so refreshing `/planner`, `/community`, or `/insights` works seamlessly.
   - Strict security headers (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `HSTS`).

---

## 🎥 Demonstration Scenarios (For Evaluators & Video Recording)

SafeRoute includes three reproducible demonstration flows designed for evaluation and video walkthroughs:

### Demo Scenario 1: Delhi Safety Insights Walkthrough
1. From the navigation bar, click **Safety Insights** (or `/insights`).
2. **Dataset A (Annual Trend):** Inspect the 2021–2024 NCRB recorded cases trend (14,277 → 13,396). Click on any year's bar to view the detailed registration context.
3. **Dataset B (Categorical Breakdown):** Observe the 2024 totals (11,795 IPC/BNS + 1,601 SLL = 13,396 combined). Click on individual crime heads (Rape: 1,058, Outrage modesty: 755, Sexual harassment: 316, Assault/disrobe: 279, Stalking: 178, Voyeurism: 38) to view legal definitions and commuter relevance.
4. **Dataset C (Offender Relationship):** Review the 97.3% known-perpetrator finding and read the technology scope boundary explaining why road navigation addresses transit corridors rather than domestic violence.
5. **Separate MHA Series:** Examine the distinct Ministry of Home Affairs series (2023: 13,208; 2024: 13,195; 2025: 12,458) with clear source attribution.
6. **Official Citations:** Scroll to the bottom to verify active links to NCRB and Rajya Sabha source documentation.

### Demo Scenario 2: Smart Journey Planning (Saket → Rohini)
1. Navigate to **Plan Your Journey** (or `/planner`).
2. Click the preset button: **"Saket → Rohini, Delhi"** (or type custom origin and destination landmarks).
3. Click **Calculate Road Routes**.
4. Observe:
   - OpenStreetMap Nominatim geocodes Saket (South Delhi) and Rohini (North-West Delhi).
   - OSRM computes actual driving routes across Delhi's arterial road network.
   - All returned alternative routes display with real distance (km) and travel duration (min).
   - The map fits bounds, rendering start and destination markers with interactive route polylines.
   - Click on different alternative route cards or map polylines to switch the highlighted active route.
   - Read the prominent **Important Safety Distinction** notice clarifying that route navigation is not ranked with aggregate crime figures.

### Demo Scenario 3: Community Reporting & Local Data Storage
1. Navigate to **Community** (or `/community`).
2. Notice the existing seed reports displayed in the shared community notices feed.
3. Under "Submit a Safety Concern":
   - Enter Area: `Saket District Centre` (or choose from the autocomplete datalist)
   - Select Category: `Street lighting issue`
   - Description: `Two high-mast lights out near pedestrian crossing.`
   - (Optional) Click **Tag Hazard Location** to demonstrate consent-based coordinate capture (~100m approximation).
   - Click **Submit Community Notice**.
4. Observe the green confirmation card: *"Your safety concern has been recorded. It is permanently saved in browser storage and published as a Community Submitted — Unverified notice in the shared community feed."*
5. Refresh the browser page (`F5`) to demonstrate that your new notice remains saved in the community feed via `localStorage`.

---

## ⚖️ Data Methodology, Ethics & Transparency

SafeRoute operates on strict principles of scientific integrity and user safety:

1. **No Simulated or Fabricated Incident Coordinates:** Official Indian crime statistics do not provide street-level coordinates. SafeRoute never invents artificial 300-meter crime circles, mock heatmaps, or fabricated locality hazard scores.
2. **Reporting FIRs vs. True Victimization:** Official statistics record formal police First Information Reports. Due to social barriers and under-reporting, registered cases do not equal all incidents experienced.
3. **Public Navigation vs. Domestic Violence:** Public-space navigation technologies focus on physical infrastructure—lighting, active thoroughfares, and emergency helplines. They cannot prevent domestic or intimate partner violence.
4. **No Commercial Ranking of Speed as Safety:** The fastest route is not automatically labeled the safest. SafeRoute presents factual distance, duration, and transparent safety guidance to support informed travel.
5. **Separation from Emergency Services:** SafeRoute is an informational navigation aid, not an emergency response system. In imminent danger, users are directed to call **112** immediately.

---

## ⚠️ Current Limitations

- **Local-Only Notice Storage:** Community safety notices are saved to the user's browser `localStorage`. Submissions do not synchronize across different devices or separate user browsers without a connected central backend.
- **Public Geocoding & Routing Limits:** Address lookup and route geometry calculation rely on public OpenStreetMap Nominatim and Project-OSRM endpoints, which may experience latency or rate limits during peak network traffic.
- **Macroscopic Data Scope:** Crime statistics provide broad citywide administrative context but cannot measure micro-level street safety or predict real-time incident risk on individual street segments.

---

## 🏛️ Archived Cloud Database Architecture

For academic evaluation, hackathon judging, and future production deployment, the complete backend database architecture designed for SafeRoute is preserved in the [docs/database/](file:///docs/database/) directory:

- **PostgreSQL Schemas:** Baseline tables for `profiles` and `community_reports` ([docs/database/migrations/](file:///docs/database/migrations/)).
- **Row Level Security (RLS):** Policies enforcing authenticated user isolation and anonymous notice shielding.
- **Server-Side Abuse Prevention:** Keyed HMAC-SHA-256 rate limiting with server-side secrets, row-level locking (`SELECT ... FOR UPDATE`), and rightmost proxy IP extraction (`cf-connecting-ip`, `x-forwarded-for`).
- **Edge Function Reference:** Web Crypto API HMAC computation implementation ([docs/database/functions/submit-report/index.ts](file:///docs/database/functions/submit-report/index.ts)).
- **pgTAP Test Suite:** Automated PostgreSQL engine security assertions ([docs/database/tests/database_security.test.sql](file:///docs/database/tests/database_security.test.sql)).

See [docs/database/README.md](file:///docs/database/README.md) for full database documentation and deployment instructions.

---

**SafeRoute — Safer Journeys, Stronger Women.**
