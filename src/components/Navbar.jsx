import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Navigation,
  BarChart3,
  MessageSquareWarning,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SafeRouteLogo from "./Brand/SafeRouteLogo";

export default function Navbar({ activeTab, onSelectTab }) {
  const { user, isAuthenticated, signOut, isDemoGuest } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (tab, anchorId = null) => {
    setMobileMenuOpen(false);

    if (anchorId) {
      if (activeTab !== "landing") {
        onSelectTab("landing");
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 120);
      } else {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    onSelectTab(tab);
  };

  return (
    <header className={`navbar-header-root ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner-wrapper">
        {/* Brand Logo - Always returns to Home */}
        <div
          className="navbar-brand-col"
          onClick={() => handleNavClick("landing")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleNavClick("landing")}
          aria-label="SafeRoute Home"
        >
          <SafeRouteLogo variant="primary" size={36} showTagline={false} />
        </div>

        {/* Center Navigation Links - The 4 Primary Public Destinations */}
        <nav className="navbar-nav-links desktop-only" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => handleNavClick("landing")}
            className={`nav-text-btn ${activeTab === "landing" ? "active" : ""}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("planner")}
            className={`nav-text-btn nav-planner-cta ${activeTab === "planner" ? "active" : ""}`}
          >
            <Navigation size={15} />
            <span>Plan Your Journey</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("reports")}
            className={`nav-text-btn ${activeTab === "reports" ? "active" : ""}`}
          >
            <MessageSquareWarning size={15} />
            <span>Community</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("insights")}
            className={`nav-text-btn ${activeTab === "insights" ? "active" : ""}`}
          >
            <BarChart3 size={15} />
            <span>Safety Insights</span>
          </button>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => handleNavClick("dashboard")}
              className={`nav-text-btn ${activeTab === "dashboard" ? "active" : ""}`}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </button>
          )}
        </nav>

        {/* Actions Col: Only shown when authenticated (subtle indicator + sign out) */}
        <div className="navbar-actions-col desktop-only">
          {isAuthenticated && (
            <div className="navbar-user-cluster">
              <button
                type="button"
                onClick={() => handleNavClick("profile")}
                className={`user-profile-pill ${activeTab === "profile" ? "active" : ""}`}
                title="View My Profile & Emergency Details"
              >
                <div className="user-avatar-mini">
                  <User size={14} />
                </div>
                <span className="user-display-name">
                  {user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Account"}
                </span>
                {isDemoGuest && <span className="demo-badge-mini">Demo</span>}
              </button>

              <button
                type="button"
                onClick={signOut}
                className="nav-logout-icon-btn"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-hamburger-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer mobile-only" role="dialog" aria-modal="true">
          <div className="mobile-drawer-body">
            {!isAuthenticated ? (
              <div className="mobile-links-stack">
                <button
                  type="button"
                  onClick={() => handleNavClick("landing")}
                  className={`mobile-link-item ${activeTab === "landing" ? "active" : ""}`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("planner")}
                  className={`mobile-link-item ${activeTab === "planner" ? "active" : ""}`}
                >
                  <Navigation size={17} />
                  <span>Plan Your Journey</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("reports")}
                  className={`mobile-link-item ${activeTab === "reports" ? "active" : ""}`}
                >
                  <MessageSquareWarning size={17} />
                  <span>Community</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("insights")}
                  className={`mobile-link-item ${activeTab === "insights" ? "active" : ""}`}
                >
                  <BarChart3 size={17} />
                  <span>Safety Insights</span>
                </button>
              </div>
            ) : (
              <div className="mobile-links-stack">
                <button
                  type="button"
                  onClick={() => handleNavClick("dashboard")}
                  className={`mobile-link-item ${activeTab === "dashboard" ? "active" : ""}`}
                >
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("planner")}
                  className={`mobile-link-item ${activeTab === "planner" ? "active" : ""}`}
                >
                  <Navigation size={17} />
                  <span>Plan Your Journey</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("reports")}
                  className={`mobile-link-item ${activeTab === "reports" ? "active" : ""}`}
                >
                  <MessageSquareWarning size={17} />
                  <span>Community</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("insights")}
                  className={`mobile-link-item ${activeTab === "insights" ? "active" : ""}`}
                >
                  <BarChart3 size={17} />
                  <span>Safety Insights</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("landing")}
                  className={`mobile-link-item ${activeTab === "landing" ? "active" : ""}`}
                >
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("profile")}
                  className={`mobile-link-item ${activeTab === "profile" ? "active" : ""}`}
                >
                  <User size={17} />
                  <span>My Profile & Emergency</span>
                </button>

                <div className="mobile-drawer-separator" />

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="mobile-logout-action"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
