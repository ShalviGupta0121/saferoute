/**
 * SafeRoute System Verification Script
 * Validates data integrity, crime statistics, reporting schemas, and service boundaries.
 */

import {
  NCRB_ANNUAL_TREND,
  DELHI_2024_CATEGORIES,
  DELHI_2024_TOTALS,
  OFFENDER_RELATIONSHIP_INSIGHT,
  MHA_DELHI_POLICE_SERIES,
  DELHI_CRIME_METADATA
} from "../src/data/delhiCrimeData.js";

import { REPORT_CONCERN_CATEGORIES } from "../src/services/reportService.js";
import { isSupabaseConfigured, getSupabaseConfigStatus } from "../src/lib/supabaseClient.js";

console.log("=================================================");
console.log("SAFEROUTE VERIFICATION SUITE");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. DATASET A: NCRB Annual Trend
assert(NCRB_ANNUAL_TREND.length === 4, "Dataset A has 4 recording years");
assert(NCRB_ANNUAL_TREND.find(t => t.year === 2021)?.registeredCases === 14277, "2021 registered cases == 14,277");
assert(NCRB_ANNUAL_TREND.find(t => t.year === 2022)?.registeredCases === 14247, "2022 registered cases == 14,247");
assert(NCRB_ANNUAL_TREND.find(t => t.year === 2023)?.registeredCases === 13439, "2023 registered cases == 13,439");
assert(NCRB_ANNUAL_TREND.find(t => t.year === 2024)?.registeredCases === 13396, "2024 registered cases == 13,396");

// 2. DATASET B: 2024 Categorical Breakdown
assert(DELHI_2024_CATEGORIES.length === 6, "Dataset B includes 6 specific transit/public crime heads");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Rape")?.cases === 1058, "Rape cases == 1,058");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Assault with intent to outrage modesty")?.cases === 755, "Assault with intent to outrage modesty == 755");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Sexual harassment")?.cases === 316, "Sexual harassment == 316");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Assault/disrobe")?.cases === 279, "Assault/disrobe == 279");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Stalking")?.cases === 178, "Stalking == 178");
assert(DELHI_2024_CATEGORIES.find(c => c.category === "Voyeurism")?.cases === 38, "Voyeurism == 38");

assert(DELHI_2024_TOTALS.ipcBnsCases === 11795, "2024 IPC/BNS Total == 11,795");
assert(DELHI_2024_TOTALS.sllIncidents === 1601, "2024 SLL Incidents == 1,601");
assert(DELHI_2024_TOTALS.combinedTotal === 13396, "2024 Combined Total == 13,396");

// 3. DATASET C: Offender Relationship
assert(OFFENDER_RELATIONSHIP_INSIGHT.totalRecordedCases === 1058, "Offender relationship base cases == 1,058");
assert(OFFENDER_RELATIONSHIP_INSIGHT.knownOffenders === 1029, "Known offenders == 1,029");
assert(OFFENDER_RELATIONSHIP_INSIGHT.unknownOffenders === 29, "Unknown offenders == 29");
assert(OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage === 97.3, "Known offender share == 97.3%");

// 4. MHA Separate Series
assert(MHA_DELHI_POLICE_SERIES.find(s => s.year === 2023)?.reportedCases === 13208, "MHA 2023 reported cases == 13,208");
assert(MHA_DELHI_POLICE_SERIES.find(s => s.year === 2024)?.reportedCases === 13195, "MHA 2024 reported cases == 13,195");
assert(MHA_DELHI_POLICE_SERIES.find(s => s.year === 2025)?.reportedCases === 12458, "MHA 2025 reported cases == 12,458");

// 5. Official Citations & Metadata
assert(DELHI_CRIME_METADATA.researchSnapshotDate === "10 November 2026", "Snapshot date is 10 November 2026");
assert(DELHI_CRIME_METADATA.officialSources.length === 4, "Official citation list contains all 4 verified government sources");

// 6. Community Report Categories
assert(REPORT_CONCERN_CATEGORIES.includes("Street lighting issue"), "Report categories include Street lighting issue");
assert(REPORT_CONCERN_CATEGORIES.includes("Suspicious activity"), "Report categories include Suspicious activity");
assert(REPORT_CONCERN_CATEGORIES.includes("Poor visibility"), "Report categories include Poor visibility");
assert(REPORT_CONCERN_CATEGORIES.includes("Harassment concern"), "Report categories include Harassment concern");
assert(REPORT_CONCERN_CATEGORIES.includes("Unsafe public infrastructure"), "Report categories include Unsafe public infrastructure");
assert(REPORT_CONCERN_CATEGORIES.includes("Other"), "Report categories include Other");

import {
  EMERGENCY_HELPLINES,
  TRANSIT_ASSISTANCE,
  EMERGENCY_DISCLAIMER
} from "../src/data/emergencyHelplines.js";

// 7. Verified Emergency Contacts & Transit Assistance
assert(EMERGENCY_HELPLINES.find(h => h.number === "112")?.isPrimary === true, "112 is primary police emergency response");
assert(EMERGENCY_HELPLINES.find(h => h.number === "1091")?.authority.includes("Delhi Police"), "1091 is Delhi Police Women Helpline");
assert(EMERGENCY_HELPLINES.find(h => h.number === "181")?.authority.includes("Women & Child Development"), "181 is Delhi Govt WCD Helpline");
assert(EMERGENCY_HELPLINES.every(h => h.number !== "100"), "Outdated number 100 is not listed as primary emergency contact");
assert(TRANSIT_ASSISTANCE.number === "155370" && TRANSIT_ASSISTANCE.tariffNote.includes("chargeable"), "155370 is separately listed as DMRC helpline with tariff notice");
assert(typeof EMERGENCY_DISCLAIMER === "string" && EMERGENCY_DISCLAIMER.includes("not an emergency-response service"), "Ethical emergency disclaimer is defined");

// 8. Supabase client diagnostic helper
const status = getSupabaseConfigStatus();
assert(typeof isSupabaseConfigured() === "boolean", "isSupabaseConfigured returns a boolean");
assert(typeof status.hasUrl === "boolean" && typeof status.hasKey === "boolean", "Config status reports URL and Key existence");

console.log(`\nVerification Complete: ${passedTests}/${totalTests} checks passed.`);
if (passedTests === totalTests) {
  console.log("All SafeRoute core modules verified successfully!");
}
