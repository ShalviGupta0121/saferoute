import { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import LandingFooter from "./components/Landing/LandingFooter";

// Views
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import RoutePlanner from "./components/RoutePlanner/RoutePlanner";
import DelhiInsights from "./components/DelhiInsights/DelhiInsights";
import CommunityReports from "./components/CommunityReports/CommunityReports";
import Profile from "./components/Profile/Profile";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";

const PATH_TO_TAB = {
  "/": "landing",
  "/home": "landing",
  "/planner": "planner",
  "/plan": "planner",
  "/reports": "reports",
  "/community": "reports",
  "/insights": "insights",
  "/dashboard": "dashboard",
  "/profile": "profile",
  "/login": "login",
  "/register": "register",
  "/forgot-password": "forgot-password"
};

const TAB_TO_PATH = {
  landing: "/",
  planner: "/planner",
  reports: "/community",
  insights: "/insights",
  dashboard: "/dashboard",
  profile: "/profile",
  login: "/login",
  register: "/register",
  "forgot-password": "/forgot-password"
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Tab state derived from current browser URL:
  // 'landing' | 'planner' | 'reports' | 'insights' | 'dashboard' | 'profile' | 'login' | 'register' | 'forgot-password'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      return PATH_TO_TAB[path] || "landing";
    }
    return "landing";
  });

  const [prefillSource, setPrefillSource] = useState("");
  const [prefillDestination, setPrefillDestination] = useState("");
  const [toast, setToast] = useState(null);

  // Sync browser back/forward buttons with tab view state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const tab = PATH_TO_TAB[path] || "landing";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectTab = (tab) => {
    // Protected routes check
    if ((tab === "dashboard" || tab === "profile") && !isAuthenticated) {
      setToast({
        type: "info",
        message: "Please log in to access your personal dashboard and profile."
      });
      setActiveTab("login");
      if (window.location.pathname !== "/login") {
        window.history.pushState({}, "", "/login");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setActiveTab(tab);
    const targetPath = TAB_TO_PATH[tab] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrefillRoute = (src, dest) => {
    setPrefillSource(src);
    setPrefillDestination(dest);
  };

  if (loading) {
    return (
      <div
        className="app-loading-screen"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8fb"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>🛡️</span>
          <div
            className="spinner"
            style={{ width: "24px", height: "24px", borderColor: "#f5dce8", borderTopColor: "#df5790" }}
          />
          <p style={{ marginTop: "12px", color: "#6b6375", fontSize: "14px", fontWeight: 600 }}>
            Loading SafeRoute...
          </p>
        </div>
      </div>
    );
  }

  // Derive current effective tab based on authentication guards
  let currentTab = activeTab;
  if (!isAuthenticated && (activeTab === "dashboard" || activeTab === "profile")) {
    currentTab = "landing";
  }

  return (
    <div className="app">
      {/* Main Navbar - 4 Primary Public Destinations + Auth */}
      <Navbar activeTab={currentTab} onSelectTab={handleSelectTab} />

      {/* Page Content View Router */}
      <main className="main-content-area">
        {currentTab === "landing" && (
          <Landing
            onNavigate={handleSelectTab}
            onPrefillRoute={handlePrefillRoute}
          />
        )}

        {currentTab === "dashboard" && (
          <Dashboard
            onNavigate={handleSelectTab}
            onPrefillRoute={handlePrefillRoute}
          />
        )}

        {currentTab === "planner" && (
          <RoutePlanner
            key={`${prefillSource}-${prefillDestination}`}
            initialSource={prefillSource}
            initialDestination={prefillDestination}
          />
        )}

        {currentTab === "insights" && <DelhiInsights />}

        {currentTab === "reports" && (
          <CommunityReports
            onShowToast={setToast}
          />
        )}

        {currentTab === "profile" && (
          <Profile
            onShowToast={setToast}
            onNavigateToPlanner={() => handleSelectTab("planner")}
          />
        )}

        {currentTab === "login" && (
          <Login onNavigate={handleSelectTab} onShowToast={setToast} />
        )}

        {currentTab === "register" && (
          <Register onNavigate={handleSelectTab} onShowToast={setToast} />
        )}

        {currentTab === "forgot-password" && (
          <ForgotPassword onNavigate={handleSelectTab} onShowToast={setToast} />
        )}
      </main>

      {/* Global Platform Footer across all four public destinations */}
      <LandingFooter onNavigate={handleSelectTab} />

      {/* Global Toast Alerts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
