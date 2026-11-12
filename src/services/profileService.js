const PROFILE_STORAGE_KEY = "saferoute_user_profile";

/**
 * Fetch the profile of the current user from browser storage or defaults.
 */
export async function fetchUserProfile(userId) {
  if (!userId) throw new Error("User identifier required to access profile.");

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.id === userId) return parsed;
      }
    } catch {
      // Fallback
    }
  }

  return {
    id: userId,
    email: "user@saferoute.local",
    full_name: "SafeRoute Commuter",
    phone_number: null,
    emergency_contact: null,
    created_at: new Date().toISOString()
  };
}

/**
 * Update profile information for the current user in browser storage.
 */
export async function updateUserProfile(userId, { fullName, phoneNumber = null, emergencyContact = null }) {
  if (!userId) throw new Error("User identifier required to update profile.");

  const cleanFullName = String(fullName || "").trim().slice(0, 100);
  const cleanPhone = phoneNumber ? String(phoneNumber).trim().slice(0, 20) : null;
  const cleanEmergency = emergencyContact ? String(emergencyContact).trim().slice(0, 20) : null;

  if (cleanFullName.length === 0) {
    throw new Error("Full name cannot be blank.");
  }

  const profile = {
    id: userId,
    email: "user@saferoute.local",
    full_name: cleanFullName,
    phone_number: cleanPhone,
    emergency_contact: cleanEmergency,
    updated_at: new Date().toISOString()
  };

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.warn("Could not write profile to localStorage:", err);
    }
  }

  return profile;
}
