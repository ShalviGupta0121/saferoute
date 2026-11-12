/**
 * SAFEROUTE - VERIFIED DELHI EMERGENCY HELPLINES DIRECTORY
 * 
 * Sourced strictly from official Delhi government and transit portals:
 * 1. Delhi Police Emergency Response Support System (ERSS): https://www.delhipolice.gov.in/
 * 2. Delhi Govt Women & Child Development (WCD): https://wcd.delhi.gov.in/wcd/helplines-women-distress-delhi
 * 3. Delhi Metro Rail Corporation (DMRC): https://delhimetrorail.com/contact-us
 * 
 * Last verified: 12 November 2026
 */

export const EMERGENCY_HELPLINES = [
  {
    id: "police-erss",
    category: "Police Emergency Response",
    number: "112",
    telLink: "tel:112",
    label: "National Emergency Response Support System (ERSS)",
    description: "24x7 primary emergency number for immediate police assistance, ambulance, or fire in Delhi.",
    authority: "Delhi Police / MHA",
    sourceUrl: "https://www.delhipolice.gov.in/",
    isPrimary: true
  },
  {
    id: "women-delhi-police",
    category: "Women in Distress — Delhi Police",
    number: "1091",
    telLink: "tel:1091",
    label: "Delhi Police Special Women Helpline",
    description: "24x7 dedicated emergency helpline for women facing harassment, stalking, or distress in public spaces.",
    authority: "Delhi Police Special Police Unit for Women & Children (SPUWAC)",
    sourceUrl: "https://www.delhipolice.gov.in/",
    isPrimary: false
  },
  {
    id: "women-delhi-govt",
    category: "Women in Distress — Delhi Government",
    number: "181",
    telLink: "tel:181",
    label: "Delhi Govt (WCD) Women Helpline",
    description: "24x7 toll-free helpline providing crisis intervention, legal counselling, and shelter support for women.",
    authority: "Department of Women & Child Development, Govt. of NCT of Delhi",
    sourceUrl: "https://wcd.delhi.gov.in/wcd/helplines-women-distress-delhi",
    isPrimary: false
  }
];

export const TRANSIT_ASSISTANCE = {
  id: "dmrc-metro",
  category: "Delhi Metro Transit Assistance",
  number: "155370",
  telLink: "tel:155370",
  label: "DMRC 24x7 Passenger Helpline",
  description: "Assistance for Delhi Metro commuters, station safety concerns, and lost property.",
  tariffNote: "Please note: Calls to 155370 are chargeable as per standard telecom network tariffs.",
  authority: "Delhi Metro Rail Corporation (DMRC)",
  sourceUrl: "https://delhimetrorail.com/contact-us"
};

export const EMERGENCY_DISCLAIMER =
  "SafeRoute is an informational and awareness platform, not an emergency-response service. In an active emergency or immediate danger, dial 112 or 1091 directly. SafeRoute cannot dispatch emergency personnel.";
