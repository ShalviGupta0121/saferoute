/**
 * SafeRoute Client Configuration
 * SafeRoute operates as a standalone client-side platform utilizing browser localStorage
 * for offline and immediate persistence without backend dependencies.
 */
export function isSupabaseConfigured() {
  return false;
}

export const isConfigured = false;
export const supabase = null;

export function getSupabaseConfigStatus() {
  return {
    isConfigured: false,
    hasUrl: false,
    hasKey: false,
    urlDomain: "Standalone Local Storage Mode"
  };
}
