export const REPORT_CONCERN_CATEGORIES = [
  "Street lighting issue",
  "Poor street lighting",
  "Dark or poorly visible stretch",
  "Isolated area",
  "Poor visibility",
  "Unsafe public infrastructure",
  "Unsafe public-space condition",
  "Suspicious activity",
  "Harassment concern",
  "Other"
];

// Controlled Delhi NCR public transit zones and commercial sectors
export const APPROVED_DELHI_LOCALITIES = [
  "Connaught Place, Central Delhi",
  "Karol Bagh, Central Delhi",
  "Paharganj / New Delhi Station, Central Delhi",
  "Pragati Maidan / ITO, Central Delhi",
  "Saket District Centre, South Delhi",
  "Hauz Khas Village & Environs, South Delhi",
  "Lajpat Nagar Central Market, South Delhi",
  "Greater Kailash (GK I & II), South Delhi",
  "Malviya Nagar / Sarvodaya, South Delhi",
  "Mehrauli / Qutub Complex, South Delhi",
  "Nehru Place Commercial Hub, South Delhi",
  "Dwarka Sector 10 / Metro Corridor, South West Delhi",
  "Dwarka Sector 12 / Transit Hub, South West Delhi",
  "Vasant Kunj Promenade Corridor, South West Delhi",
  "Munirka / Outer Ring Road, South West Delhi",
  "Janakpuri District Centre, West Delhi",
  "Rajouri Garden / Ring Road, West Delhi",
  "Punjabi Bagh Commercial Hub, West Delhi",
  "Patel Nagar / Shadipur Corridor, West Delhi",
  "Civil Lines / Delhi University North Campus",
  "Kashmere Gate ISBT & Metro Hub, North Delhi",
  "Model Town / GTB Nagar, North Delhi",
  "Rohini Sector 10 / District Centre, North West Delhi",
  "Rohini Sector 13 / Outer Ring Road, North West Delhi",
  "Pitampura / Netaji Subhash Place, North West Delhi",
  "Mayur Vihar Phase 1 & 2, East Delhi",
  "Laxmi Nagar Commercial Hub, East Delhi",
  "Anand Vihar ISBT & Transit Hub, East Delhi",
  "Preet Vihar / Vikas Marg, East Delhi",
  "Shahdara / Dilshad Garden, North East Delhi",
  "Seelampur / Welcome Metro Corridor, North East Delhi"
];

// Controlled Delhi NCR locality suggestions to encourage general public landmarks
export const DELHI_LOCALITY_SUGGESTIONS = [
  "Connaught Place, Central Delhi",
  "Saket District Centre, South Delhi",
  "Dwarka Sector 10 / Metro Corridor, South West Delhi",
  "Hauz Khas Village & Environs, South Delhi",
  "Janakpuri District Centre, West Delhi",
  "Rohini Sector 13 / Outer Ring Road, North West Delhi"
];

const STORAGE_KEY = "saferoute_community_reports";

// Seed reports for initial view
const INITIAL_SEED_REPORTS = [
  {
    id: "report-seed-1",
    area: "Connaught Place, Central Delhi",
    concern_type: "Street lighting issue",
    status: "unverified",
    displayStatus: "Community Submitted — Unverified",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    isSeed: true
  },
  {
    id: "report-seed-2",
    area: "Dwarka Sector 12 / Transit Hub, South West Delhi",
    concern_type: "Poor visibility",
    status: "unverified",
    displayStatus: "Community Submitted — Unverified",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    isSeed: true
  },
  {
    id: "report-seed-3",
    area: "Saket District Centre, South Delhi",
    concern_type: "Unsafe public infrastructure",
    status: "unverified",
    displayStatus: "Community Submitted — Unverified",
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    isSeed: true
  }
];

// In-memory fallback for environments without localStorage (e.g. Node tests)
let inMemoryReports = [...INITIAL_SEED_REPORTS];
let inMemoryUserPrivateReports = [];
let lastSubmissionTimestamp = 0;
const CLIENT_SUBMISSION_DEBOUNCE_MS = 3000;

function getStoredReports() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
        return INITIAL_SEED_REPORTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_SEED_REPORTS;
    } catch {
      return INITIAL_SEED_REPORTS;
    }
  }
  return inMemoryReports;
}

function saveStoredReports(reports) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (err) {
      console.warn("Could not save community reports to localStorage:", err);
    }
  }
  inMemoryReports = reports;
}

/**
 * Basic input sanitization to strip dangerous tags or control characters.
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  const stripped = Array.from(input)
    .filter((c) => {
      const code = c.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 10 || code === 13 || code === 9;
    })
    .join("");

  return stripped
    .replace(/<\/?script[^>]*>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Normalizes free-form locality input to approved Delhi NCR administrative / transit sectors.
 */
export function normalizeLocalityLabel(rawInput) {
  const clean = sanitizeInput(rawInput);
  if (!clean) return "Delhi NCR Public Space";

  // Check if exactly matches an approved sector
  const exact = APPROVED_DELHI_LOCALITIES.find(
    (loc) => loc.toLowerCase() === clean.toLowerCase()
  );
  if (exact) return exact;

  const lower = clean.toLowerCase();

  // Sector / transit hub mappings
  if (lower.includes("connaught") || lower.includes(" cp") || lower.startsWith("cp ") || lower === "cp") {
    return "Connaught Place, Central Delhi";
  }
  if (lower.includes("saket") || lower.includes("press enclave")) {
    return "Saket District Centre, South Delhi";
  }
  if (lower.includes("hauz khas") || lower.includes("hkv")) {
    return "Hauz Khas Village & Environs, South Delhi";
  }
  if (lower.includes("dwarka") && (lower.includes("12") || lower.includes("sector 12"))) {
    return "Dwarka Sector 12 / Transit Hub, South West Delhi";
  }
  if (lower.includes("dwarka")) {
    return "Dwarka Sector 10 / Metro Corridor, South West Delhi";
  }
  if (lower.includes("karol bagh")) {
    return "Karol Bagh, Central Delhi";
  }
  if (lower.includes("lajpat") || lower.includes("central market")) {
    return "Lajpat Nagar Central Market, South Delhi";
  }
  if (lower.includes("greater kailash") || lower.includes("gk 1") || lower.includes("gk 2") || lower.includes("gk i")) {
    return "Greater Kailash (GK I & II), South Delhi";
  }
  if (lower.includes("nehru place")) {
    return "Nehru Place Commercial Hub, South Delhi";
  }
  if (lower.includes("janakpuri")) {
    return "Janakpuri District Centre, West Delhi";
  }
  if (lower.includes("rajouri")) {
    return "Rajouri Garden / Ring Road, West Delhi";
  }
  if (lower.includes("punjabi bagh")) {
    return "Punjabi Bagh Commercial Hub, West Delhi";
  }
  if (lower.includes("rohini") && lower.includes("13")) {
    return "Rohini Sector 13 / Outer Ring Road, North West Delhi";
  }
  if (lower.includes("rohini")) {
    return "Rohini Sector 10 / District Centre, North West Delhi";
  }
  if (lower.includes("pitampura") || lower.includes("netaji subhash") || lower.includes("nsp")) {
    return "Pitampura / Netaji Subhash Place, North West Delhi";
  }
  if (lower.includes("kashmere gate") || lower.includes("isbt")) {
    return "Kashmere Gate ISBT & Metro Hub, North Delhi";
  }
  if (lower.includes("anand vihar")) {
    return "Anand Vihar ISBT & Transit Hub, East Delhi";
  }
  if (lower.includes("mayur vihar")) {
    return "Mayur Vihar Phase 1 & 2, East Delhi";
  }
  if (lower.includes("laxmi nagar")) {
    return "Laxmi Nagar Commercial Hub, East Delhi";
  }
  if (lower.includes("vasant kunj")) {
    return "Vasant Kunj Promenade Corridor, South West Delhi";
  }
  if (lower.includes("munirka")) {
    return "Munirka / Outer Ring Road, South West Delhi";
  }
  if (lower.includes("civil lines") || lower.includes("north campus") || lower.includes("du ")) {
    return "Civil Lines / Delhi University North Campus";
  }

  // If already a reasonably descriptive public landmark, append Delhi NCR context
  if (clean.length >= 6 && !/[0-9]/.test(clean)) {
    return `${clean}, Delhi NCR`;
  }

  return "Delhi NCR Public Space";
}

/**
 * Validate locality input and prevent PII leakage.
 */
export function validateLocalityArea(area) {
  const clean = sanitizeInput(area);
  if (clean.length < 3 || clean.length > 100) {
    throw new Error("Location area must be between 3 and 100 characters.");
  }

  // Reject consecutive phone-like numbers
  if (/[0-9]{7,}/.test(clean)) {
    throw new Error("Privacy safeguard: Phone numbers or numeric IDs must not be entered in the location field.");
  }

  // Reject email addresses
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(clean)) {
    throw new Error("Privacy safeguard: Email addresses must not be entered in the location field.");
  }

  // Reject private residential patterns (flat, apt, house no, floor)
  if (/(flat|apartment|apt|house|h\.?\s*no|room|floor|villa)\s*[:#]?[0-9]+/i.test(clean)) {
    throw new Error("Privacy safeguard: Enter a general public landmark or road, not a private residential address or flat number.");
  }

  return normalizeLocalityLabel(clean);
}

/**
 * Validate description text and prevent contact details leakage.
 */
export function validateReportDescription(desc) {
  const clean = sanitizeInput(desc);
  if (clean.length < 5 || clean.length > 1000) {
    throw new Error("Report description must be between 5 and 1000 characters.");
  }

  if (/[0-9]{10}/.test(clean)) {
    throw new Error("Privacy safeguard: 10-digit phone numbers must not be included in the report description.");
  }

  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(clean)) {
    throw new Error("Privacy safeguard: Email addresses must not be included in the report description.");
  }

  return clean;
}

/**
 * Validate latitude and longitude coordinate bounds and round to 3 decimal places (~100m approximate area).
 */
export function validateCoordinates(lat, lon) {
  if (lat === null && lon === null) return { lat: null, lon: null };
  const numLat = Number(lat);
  const numLon = Number(lon);
  if (isNaN(numLat) || isNaN(numLon)) {
    throw new Error("Invalid coordinate values provided.");
  }
  if (numLat < -90 || numLat > 90) {
    throw new Error("Latitude must be between -90 and 90 degrees.");
  }
  if (numLon < -180 || numLon > 180) {
    throw new Error("Longitude must be between -180 and 180 degrees.");
  }
  // Approximate coordinates to 3 decimal places for locality privacy (~110m accuracy)
  return { lat: Number(numLat.toFixed(3)), lon: Number(numLon.toFixed(3)) };
}

/**
 * Fetch SHARED community report summaries.
 * STRICT PRIVACY REQUIREMENT:
 * Exposes ONLY: { id, area, concern_type, status, created_at }.
 * NEVER exposes private report descriptions, exact coordinates, user IDs, or emails.
 * Accessible to ANY visitor without requiring an account or login.
 */
export async function fetchCommunityReports(limit = 50, offset = 0) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const stored = getStoredReports();
  const slice = stored.slice(safeOffset, safeOffset + safeLimit);
  return slice.map(normalizeSanitizedReport);
}

/**
 * Fetch reports submitted by the CURRENT user (retained for profile view).
 */
export async function fetchUserReports(userId) {
  if (!userId) return [];
  return inMemoryUserPrivateReports;
}

/**
 * Submit a safety concern ANONYMOUSLY without requiring accounts, logins, or PII.
 * Validates input, sanitizes text, normalizes locality, and persists to browser storage.
 * Returns { id, area, concern_type, status, created_at, isLocal: boolean }.
 */
export async function submitCommunityReport({
  area,
  concernType,
  description,
  latitude = null,
  longitude = null
}) {
  // 1. Client-side UX debouncing cooldown
  const now = Date.now();
  if (now - lastSubmissionTimestamp < CLIENT_SUBMISSION_DEBOUNCE_MS) {
    throw new Error("Please wait a moment before submitting another safety notice.");
  }

  // 2. Strict validation and PII prevention rules
  const cleanArea = validateLocalityArea(area);
  const cleanDesc = validateReportDescription(description);
  const cleanConcern = String(concernType || "").trim();

  if (!REPORT_CONCERN_CATEGORIES.includes(cleanConcern)) {
    throw new Error("Invalid concern category selected.");
  }

  validateCoordinates(latitude, longitude);

  // 3. Persistent browser storage
  lastSubmissionTimestamp = Date.now();
  const newReportId = `cr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const isoNow = new Date().toISOString();

  const publicRecord = {
    id: newReportId,
    area: cleanArea,
    concern_type: cleanConcern,
    description: cleanDesc,
    status: "unverified",
    displayStatus: "Community Submitted — Unverified",
    approximate_date: isoNow,
    created_at: isoNow,
    isLocal: true
  };

  const existing = getStoredReports();
  const updated = [publicRecord, ...existing];
  saveStoredReports(updated);

  return publicRecord;
}

/**
 * Delete a report from local storage.
 */
export async function deleteCommunityReport(reportId) {
  if (!reportId) throw new Error("Report ID required for deletion.");
  const existing = getStoredReports();
  const filtered = existing.filter((r) => r.id !== reportId);
  saveStoredReports(filtered);
  inMemoryUserPrivateReports = inMemoryUserPrivateReports.filter((r) => r.id !== reportId);
  return true;
}

/**
 * Clear in-memory sensitive report state on session logout.
 */
export function clearReportSessionState() {
  inMemoryUserPrivateReports = [];
}

function normalizeSanitizedReport(r) {
  return {
    id: r.id,
    area: r.area,
    concern_type: r.concern_type,
    status: r.status,
    displayStatus: r.status === "unverified" ? "Community Submitted — Unverified" : (r.displayStatus || r.status),
    created_at: r.approximate_date || r.created_at
  };
}
