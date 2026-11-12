import { createContext, useContext, useState } from "react";

const AUTH_STORAGE_KEY = "saferoute_auth_user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return null;
  });
  const [session, setSession] = useState(() => (user ? { user } : null));
  const [authError, setAuthError] = useState(null);
  const [isDemoGuest, setIsDemoGuest] = useState(false);

  /**
   * Register a new user in local browser storage
   */
  async function signUp({ email, fullName }) {
    setAuthError(null);
    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: {
        full_name: fullName || "SafeRoute User"
      },
      created_at: new Date().toISOString()
    };

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }

    setUser(newUser);
    setSession({ user: newUser });
    setIsDemoGuest(false);
    return { user: newUser, session: { user: newUser } };
  }

  /**
   * Sign in an existing user in local browser storage
   */
  async function signIn({ email }) {
    setAuthError(null);
    const authUser = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: {
        full_name: email.split("@")[0]
      },
      created_at: new Date().toISOString()
    };

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    }

    setUser(authUser);
    setSession({ user: authUser });
    setIsDemoGuest(false);
    return { user: authUser, session: { user: authUser } };
  }

  /**
   * Send password reset confirmation
   */
  async function resetPassword() {
    setAuthError(null);
    return { success: true };
  }

  /**
   * Sign out current user
   */
  async function signOut() {
    setAuthError(null);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setUser(null);
    setSession(null);
    setIsDemoGuest(false);
  }

  /**
   * Demo Guest Mode: Allows exploring personalized features immediately
   */
  function enterDemoGuestMode() {
    const demoUser = {
      id: "demo-guest-id",
      email: "evaluator@demo.saferoute",
      user_metadata: {
        full_name: "Demo Evaluator"
      },
      isDemo: true
    };
    setIsDemoGuest(true);
    setUser(demoUser);
    setSession({ user: demoUser });
  }

  function exitDemoGuestMode() {
    setIsDemoGuest(false);
    setUser(null);
    setSession(null);
  }

  const value = {
    user,
    session,
    loading: false,
    authError,
    setAuthError,
    isSupabaseConfigured: false,
    configStatus: {
      isConfigured: false,
      hasUrl: false,
      hasKey: false,
      urlDomain: "Standalone Client Mode"
    },
    isDemoGuest,
    signUp,
    signIn,
    signOut,
    resetPassword,
    enterDemoGuestMode,
    exitDemoGuestMode,
    isAuthenticated: Boolean(user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
