import { useState, useEffect } from "react";
import {
  Navigation,
  BarChart3,
  MessageSquareWarning,
  User,
  ArrowRight,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchCommunityReports } from "../../services/reportService";
import {
  DELHI_2024_TOTALS,
  OFFENDER_RELATIONSHIP_INSIGHT
} from "../../data/delhiCrimeData";

export default function Dashboard({ onNavigate, onPrefillRoute }) {
  const { user, isDemoGuest } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [quickSource, setQuickSource] = useState("");
  const [quickDestination, setQuickDestination] = useState("");

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Commuter";

  useEffect(() => {
    let isMounted = true;
    fetchCommunityReports()
      .then((data) => {
        if (isMounted) {
          setRecentReports(data.slice(0, 3));
          setReportsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setReportsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickRouteSubmit = (e) => {
    e.preventDefault();
    if (quickSource && quickDestination) {
      onPrefillRoute(quickSource, quickDestination);
      onNavigate("planner");
    }
  };

  const handleDemoPreset = (src, dest) => {
    onPrefillRoute(src, dest);
    onNavigate("planner");
  };

  return (
    <div className="dashboard-container">
      {/* 1. Welcome Banner */}
      <section className="dashboard-welcome-card">
        <div className="welcome-text-col">
          <span className="welcome-tagline">
            YOUR SAFETY, OUR PRIORITY {isDemoGuest && "• (DEMO MODE)"}
          </span>
          <h1>
            Welcome, <span>{userName}</span>
          </h1>
          <p>
            Explore verified Delhi crime trends, plan driving routes with road-level alternatives,
            and view crowdsourced community safety notices.
          </p>
          <div className="welcome-actions">
            <button
              onClick={() => onNavigate("planner")}
              className="dashboard-primary-btn"
            >
              <Navigation size={18} />
              <span>Plan a Journey</span>
            </button>
            <button
              onClick={() => onNavigate("insights")}
              className="dashboard-secondary-btn"
            >
              <BarChart3 size={18} />
              <span>View Delhi Insights</span>
            </button>
          </div>
        </div>

        <div className="welcome-badge-col">
          <div className="hero-shield-badge">
            <span className="shield-large">🛡️</span>
            <h4>SafeRoute Platform</h4>
            <p>Designed for women commuter awareness & community reporting</p>
          </div>
        </div>
      </section>

      {/* 2. Platform Data Limitation Transparency Banner */}
      <section className="data-limitations-notice">
        <div className="notice-icon">
          <AlertTriangle size={20} color="#b45309" />
        </div>
        <div className="notice-content">
          <h4>Data Transparency & Operational Limitations</h4>
          <p>
            Official National Crime Records Bureau (NCRB) statistics reflect state/citywide recorded
            FIRs and do <strong>not</strong> provide micro-level or street-by-street incident coordinates.
            City statistics provide macroscopic public context and are <strong>not</strong> used to calculate
            individual street safety scores. Always exercise caution and use active, well-lit main arterial roads.
          </p>
        </div>
      </section>

      {/* 3. Grid: Quick Journey Planner + Delhi Stats Snapshot */}
      <div className="dashboard-grid">
        {/* Quick Journey Form */}
        <div className="dash-card quick-planner-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <Navigation size={20} color="#df5790" />
              <h3>Quick Route Planner</h3>
            </div>
            <span className="dash-badge">OSRM Powered</span>
          </div>

          <form onSubmit={handleQuickRouteSubmit} className="quick-plan-form">
            <div className="quick-input-group">
              <label>Starting Point</label>
              <div className="input-with-pin">
                <MapPin size={16} color="#df5790" />
                <input
                  type="text"
                  placeholder="e.g. Saket, Delhi"
                  value={quickSource}
                  onChange={(e) => setQuickSource(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="quick-input-group">
              <label>Destination</label>
              <div className="input-with-pin">
                <MapPin size={16} color="#df5790" />
                <input
                  type="text"
                  placeholder="e.g. Rohini, Delhi"
                  value={quickDestination}
                  onChange={(e) => setQuickDestination(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="plan-now-btn">
              <span>Find Routes & Safety Context</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Demo Scenario Shortcuts */}
          <div className="demo-shortcuts">
            <span className="shortcuts-label">Evaluation Demo Scenarios:</span>
            <div className="shortcut-pills">
              <button
                type="button"
                className="shortcut-pill"
                onClick={() => handleDemoPreset("Saket, Delhi", "Rohini, Delhi")}
              >
                <Sparkles size={13} />
                <span>Saket → Rohini (Demo 2)</span>
              </button>
              <button
                type="button"
                className="shortcut-pill"
                onClick={() => handleDemoPreset("Connaught Place, Delhi", "India Gate, Delhi")}
              >
                <span>CP → India Gate</span>
              </button>
              <button
                type="button"
                className="shortcut-pill"
                onClick={() => handleDemoPreset("Dwarka, Delhi", "Saket, Delhi")}
              >
                <span>Dwarka → Saket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delhi Safety Overview Cards */}
        <div className="dash-card safety-stats-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <BarChart3 size={20} color="#df5790" />
              <h3>Delhi Safety Overview</h3>
            </div>
            <button
              onClick={() => onNavigate("insights")}
              className="text-link view-all-link"
            >
              Full Analytics <ArrowRight size={14} />
            </button>
          </div>

          <div className="mini-stats-grid">
            <div className="mini-stat-box">
              <span className="mini-stat-number">{DELHI_2024_TOTALS.combinedTotal.toLocaleString()}</span>
              <span className="mini-stat-label">2024 NCRB Delhi Cases</span>
              <small className="mini-stat-sub">
                11,795 IPC/BNS + 1,601 SLL
              </small>
            </div>

            <div className="mini-stat-box">
              <span className="mini-stat-number">
                {OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage}%
              </span>
              <span className="mini-stat-label">Known-Offender Share</span>
              <small className="mini-stat-sub">
                1,029 of 1,058 rape cases
              </small>
            </div>

            <div className="mini-stat-box">
              <span className="mini-stat-number">13,396</span>
              <span className="mini-stat-label">4-Yr Registered Trend</span>
              <small className="mini-stat-sub">
                2021 (14,277) → 2024 (13,396)
              </small>
            </div>

            <div className="mini-stat-box">
              <span className="mini-stat-number">24 / 7</span>
              <span className="mini-stat-label">Delhi Women Helpline</span>
              <small className="mini-stat-sub">
                Dial 1091 or National 112
              </small>
            </div>
          </div>

          <div className="stats-quote-box">
            <p>
              "97.3% of registered sexual violence cases involve individuals known to the victim.
              Navigation tools support public-space street awareness, while domestic and interpersonal
              safety require distinct societal interventions."
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Community Reports Preview & Quick Access */}
      <div className="dashboard-grid bottom-grid">
        {/* Recent Community Reports Preview */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <MessageSquareWarning size={20} color="#df5790" />
              <h3>Recent Community Reports</h3>
            </div>
            <button
              onClick={() => onNavigate("reports")}
              className="text-link view-all-link"
            >
              View Feed & Submit <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-reports-list">
            {reportsLoading ? (
              <p className="loading-reports-msg">Loading community reports...</p>
            ) : recentReports.length === 0 ? (
              <p className="no-reports-msg">No community reports submitted yet.</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="dash-report-item">
                  <div className="report-item-top">
                    <span className="report-category-badge">{report.concern_type}</span>
                    <span className="report-status-unverified">Unverified Notice</span>
                  </div>
                  <h4 className="report-item-area">{report.area}</h4>
                  <p className="report-item-desc">Public locality advisory (author identity & GPS coordinates strictly protected).</p>
                  <div className="report-item-time">
                    <Clock size={12} />
                    <span>
                      {new Date(report.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Access Feature Cards */}
        <div className="dash-card quick-access-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <Sparkles size={20} color="#df5790" />
              <h3>Feature Shortcuts</h3>
            </div>
          </div>

          <div className="feature-shortcut-buttons">
            <div
              className="feature-shortcut-tile"
              onClick={() => onNavigate("planner")}
            >
              <div className="shortcut-tile-icon">
                <Navigation size={22} color="#df5790" />
              </div>
              <div className="shortcut-tile-text">
                <h4>Smart Route Planning</h4>
                <p>OSRM real driving route computation with interactive route switching.</p>
              </div>
              <ArrowRight size={16} className="tile-arrow" />
            </div>

            <div
              className="feature-shortcut-tile"
              onClick={() => onNavigate("insights")}
            >
              <div className="shortcut-tile-icon">
                <BarChart3 size={22} color="#df5790" />
              </div>
              <div className="shortcut-tile-text">
                <h4>Delhi Safety Insights</h4>
                <p>Verified NCRB & MHA statistical charts, category breakdown & methodology.</p>
              </div>
              <ArrowRight size={16} className="tile-arrow" />
            </div>

            <div
              className="feature-shortcut-tile"
              onClick={() => onNavigate("reports")}
            >
              <div className="shortcut-tile-icon">
                <MessageSquareWarning size={22} color="#df5790" />
              </div>
              <div className="shortcut-tile-text">
                <h4>Submit a Safety Report</h4>
                <p>Contribute unlit areas or infrastructure issues to our shared database.</p>
              </div>
              <ArrowRight size={16} className="tile-arrow" />
            </div>

            <div
              className="feature-shortcut-tile"
              onClick={() => onNavigate("profile")}
            >
              <div className="shortcut-tile-icon">
                <User size={22} color="#df5790" />
              </div>
              <div className="shortcut-tile-text">
                <h4>Account & Helplines</h4>
                <p>Manage your submitted reports and access emergency safety contacts.</p>
              </div>
              <ArrowRight size={16} className="tile-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
