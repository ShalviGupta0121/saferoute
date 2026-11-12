/**
 * SAFEROUTE - VERIFIED DELHI CRIME DATA REPOSITORY
 * 
 * Sourced strictly from official National Crime Records Bureau (NCRB) publications,
 * Ministry of Home Affairs (MHA) parliamentary disclosures, and Delhi Directorate of
 * Economics & Statistics (DES) reports.
 * 
 * Research snapshot date: 10 November 2026
 * Geographic scope: National Capital Territory (NCT) of Delhi
 */

export const DELHI_CRIME_METADATA = {
  researchSnapshotDate: "10 November 2026",
  geographicScope: "National Capital Territory of Delhi (State / UT)",
  officialSources: [
    {
      name: "NCRB Crime in India 2024",
      reference: "Table 3A.1 & Offender-Victim Relationship Tables (Crimes Against Women)",
      url: "https://www.ncrb.mha.gov.in/crime-in-india.html"
    },
    {
      name: "Rajya Sabha Unstarred Question 390",
      reference: "Ministry of Home Affairs, Annexure III",
      url: "https://sansad.in/getFile/annex/269/AU390_BVctWd.pdf?source=pqars"
    },
    {
      name: "Delhi DES Women & Men in Delhi 2024",
      reference: "Directorate of Economics and Statistics, Govt. of NCT of Delhi",
      url: "https://des.delhi.gov.in/sites/default/files/inline-files/women_and_men_in_delhi_2024.pdf"
    },
    {
      name: "Ministry of Home Affairs / Rajya Sabha USQ 4220",
      reference: "Dated 1 April 2026 (Delhi Police CAW Series)",
      url: "https://www.mha.gov.in/MHA1/Par2017/pdfs/par2026-pdfs/RS01042026/4220.pdf"
    }
  ],
  importantDisclaimer:
    "Officially registered crime statistics describe police-recorded First Information Reports (FIRs) and provide macroscopic citywide context, but they do not independently measure the safety of a particular route or predict individual incident risk. On 1 July 2024, the Bharatiya Nyaya Sanhita (BNS) replaced the Indian Penal Code (IPC); NCRB 2024 reflects both statutory codes."
};

/**
 * Dataset A: NCRB Delhi State/UT Annual Registered Cases (2021–2024)
 * Metric: Total registered First Information Reports (FIRs) under Crimes Against Women
 */
export const NCRB_ANNUAL_TREND = [
  { year: 2021, registeredCases: 14277, changeNote: "Baseline year" },
  { year: 2022, registeredCases: 14247, changeNote: "-0.2% vs 2021" },
  { year: 2023, registeredCases: 13439, changeNote: "-5.7% vs 2022" },
  { year: 2024, registeredCases: 13396, changeNote: "-0.3% vs 2023" }
];

export const NCRB_ANNUAL_METADATA = {
  source: "NCRB Crime in India 2024, Table 3A.1, and Rajya Sabha USQ 390, Annexure III",
  coverage: "NCT of Delhi (State/UT Total)",
  definition: "Total annual registered crimes against women under both IPC/BNS and Special & Local Laws (SLL).",
  criticalContext:
    "Registered cases reflect formal police recordings (FIRs) influenced by reporting behavior, public awareness, and registration drives. A decline in registered cases is not proof that actual victimization declined."
};

/**
 * Dataset B: Delhi 2024 Crime-Category Breakdown
 * Focus: Key public space, transit, and harassment-related crime heads under IPC / BNS
 */
export const DELHI_2024_CATEGORIES = [
  {
    category: "Rape",
    cases: 1058,
    legalSection: "IPC 376 / BNS 64",
    description: "Registered sexual assault offences.",
    transitRelevance: "High public concern; official records show 97.3% involve known offenders."
  },
  {
    category: "Assault with intent to outrage modesty",
    cases: 755,
    legalSection: "IPC 354 / BNS 74",
    description: "Use of criminal force or assault against a woman with intent to outrage modesty.",
    transitRelevance: "Frequently reported in crowded public transit, bus stops, and markets."
  },
  {
    category: "Sexual harassment",
    cases: 316,
    legalSection: "IPC 354A / BNS 75",
    description: "Unwelcome physical contact, advances, demands, or sexually colored remarks.",
    transitRelevance: "Critical concern for daily commuters and pedestrian corridors."
  },
  {
    category: "Assault/disrobe",
    cases: 279,
    legalSection: "IPC 354B / BNS 76",
    description: "Assault or use of criminal force with intent to disrobe or compel nakedness.",
    transitRelevance: "Severe physical assault head under personal safety."
  },
  {
    category: "Stalking",
    cases: 178,
    legalSection: "IPC 354D / BNS 78",
    description: "Persistent following, contacting despite disinterest, or digital surveillance.",
    transitRelevance: "Directly impacts transit routes, repetitive commuter paths, and routine walks."
  },
  {
    category: "Voyeurism",
    cases: 38,
    legalSection: "IPC 354C / BNS 77",
    description: "Capturing or viewing private acts without consent.",
    transitRelevance: "Occurs in public facilities, washrooms, or concealed transport points."
  }
];

export const DELHI_2024_TOTALS = {
  ipcBnsCases: 11795,
  sllIncidents: 1601,
  combinedTotal: 13396,
  source: "NCRB Crime in India 2024 (Delhi State / UT)",
  note:
    "The 6 selected categories above total 2,624 cases and represent specific public-safety crime heads. They are not the complete dataset and do not equal the combined total of 13,396 cases (which includes other offences like cruelty by husband/relatives, kidnapping, dowry prohibition, and POCSO)."
};

/**
 * Dataset C: Offender Relationship Insight (2024)
 * Metric: Breakdown of recorded rape cases by relationship to victim
 */
export const OFFENDER_RELATIONSHIP_INSIGHT = {
  subject: "Recorded Rape Cases (IPC Section 376 / BNS Section 64)",
  geographicScope: "National Capital Territory of Delhi (State / UT)",
  reportingYear: 2024,
  totalRecordedCases: 1058,
  knownOffenders: 1029,
  unknownOffenders: 29,
  knownOffenderPercent: 97.3,
  knownOffenderPercentage: 97.3,
  unknownOffenderPercent: 2.7,
  unknownOffenderPercentage: 2.7,
  nationalBenchmark: "96.8% known offenders nationally across India (NCRB 2024 / CEDA Ashoka analysis)",
  source: "NCRB Crime in India 2024, Offender-Victim Relationship Analysis (Delhi State / UT)",
  methodologyNote:
    "Calculated as 1,029 known offenders out of 1,058 total recorded rape cases in NCT of Delhi (1,029 / 1,058 = 97.26% ≈ 97.3%). Known offenders include family members, neighbours, employers, friends, and online acquaintances. Crucially, this percentage applies to recorded rape cases in Delhi, NOT all crimes against women.",
  insightText:
    "In 97.3% of registered rape cases in Delhi (1,029 of 1,058), the accused was known to the victim. Only 2.7% (29 cases) involved unidentified or stranger offenders.",
  safetyBoundaryExplanation:
    "Public-space route navigation technologies focus on physical infrastructure—such as street lighting, transit frequency, and active thoroughfares. They are designed for public street safety and cannot address or prevent domestic, intimate partner, or interpersonal violence."
};

/**
 * Separate Source Series: Delhi Police-Reported Figures from MHA
 * Sourced from Ministry of Home Affairs parliamentary disclosures.
 * Distinct published series; NOT to be averaged or merged with NCRB totals.
 */
export const MHA_DELHI_POLICE_SERIES = [
  { year: 2023, reportedCases: 13208 },
  { year: 2024, reportedCases: 13195 },
  { year: 2025, reportedCases: 12458 }
];

export const MHA_SERIES_METADATA = {
  source: "Ministry of Home Affairs / Rajya Sabha USQ 4220, dated 1 April 2026",
  reporter: "Delhi Police administrative records communicated to MHA",
  distinctionNotice:
    "This is an independent administrative series from the Ministry of Home Affairs. Because reporting dates and compilation criteria vary between NCRB publications and Ministry parliamentary replies, this series is presented separately and never averaged with the NCRB State/UT statistics."
};

/**
 * Comprehensive Methodology & Limitations
 */
export const METHODOLOGY_AND_LIMITATIONS = [
  {
    title: "Registered Cases vs. True Victimization",
    content:
      "All figures represent formal police First Information Reports (FIRs). Criminological research consistently shows that crimes against women face severe under-reporting due to social stigma, fear of retaliation, and procedural hurdles. A decline in registered FIRs cannot be interpreted as an absolute decline in incidents."
  },
  {
    title: "Absence of Street-Level / Coordinate Data",
    content:
      "Neither NCRB nor MHA releases public geospatial coordinates, street-level geocodes, or micro-locality incidence counts. Citywide numbers cannot be converted into street safety scores or neighborhood hazard rankings."
  },
  {
    title: "Private Space vs. Transit Corridors",
    content:
      "A large fraction of registered offences occur within private homes or workplaces. SafeRoute specifically assists commuters with street infrastructure factors (lighting, route clarity, active roads) and makes no claims regarding domestic safety."
  },
  {
    title: "Temporal & Environmental Variables",
    content:
      "Official annual data does not record hour-by-hour light conditions, crowd presence, or immediate policing shifts. Route choices must always rely on real-time awareness and caution."
  }
];
