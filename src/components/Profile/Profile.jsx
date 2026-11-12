import { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  LogOut,
  Trash2,
  Phone,
  Clock,
  MessageSquareWarning,
  MapPin,
  Lock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserReports, deleteCommunityReport, clearReportSessionState } from "../../services/reportService";
import { fetchUserProfile, updateUserProfile } from "../../services/profileService";
import MfaSection from "./MfaSection";

export default function Profile({ onShowToast, onNavigateToPlanner }) {
  const { user, signOut, isDemoGuest } = useAuth();
  const [userReports, setUserReports] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmergency, setEditEmergency] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [loading, setLoading] = useState(() => Boolean(user?.id));
  const [deletingId, setDeletingId] = useState(null);

  const fullName =
    profileData?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "SafeRoute User";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Active Session";

  useEffect(() => {
    let ignore = false;
    if (!user?.id) return;

    // Load private reports (author only, enforced via RLS)
    fetchUserReports(user.id)
      .then((reports) => {
        if (!ignore) {
          setUserReports(reports);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setLoading(false);
          onShowToast({
            type: "error",
            message: "Failed to load your submitted reports."
          });
        }
      });

    // Load private profile (author only, enforced via RLS)
    fetchUserProfile(user.id)
      .then((data) => {
        if (!ignore && data) {
          setProfileData(data);
          setEditFullName(data.full_name || "");
          setEditPhone(data.phone_number || "");
          setEditEmergency(data.emergency_contact || "");
        }
      })
      .catch((err) => {
        console.error("Profile load notice:", err);
      });

    return () => {
      ignore = true;
    };
  }, [user?.id, onShowToast]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSavingProfile(true);
      const updated = await updateUserProfile(user.id, {
        fullName: editFullName,
        phoneNumber: editPhone,
        emergencyContact: editEmergency
      });
      setProfileData(updated);
      setIsEditingProfile(false);
      onShowToast({
        type: "success",
        message: "Private profile updated successfully."
      });
    } catch (err) {
      onShowToast({
        type: "error",
        message: err.message || "Failed to update profile."
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      setDeletingId(reportId);
      await deleteCommunityReport(reportId, user.id);
      setUserReports((prev) => prev.filter((r) => r.id !== reportId));
      onShowToast({
        type: "success",
        message: "Your report has been removed."
      });
    } catch (err) {
      onShowToast({
        type: "error",
        message: err.message || "Failed to delete report."
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    clearReportSessionState();
    await signOut();
  };

  const emergencyHelplines = [
    {
      name: "Delhi Police Women Helpline",
      number: "1091",
      description: "Dedicated 24/7 helpline for women in distress within NCT of Delhi."
    },
    {
      name: "National Emergency Number",
      number: "112",
      description: "Unified pan-India emergency service (Police, Fire, Ambulance)."
    },
    {
      name: "Delhi Police Control Room",
      number: "100",
      description: "Immediate emergency police dispatch."
    },
    {
      name: "National Commission for Women (NCW)",
      number: "7827170170",
      description: "24/7 violence against women grievance and support helpline."
    },
    {
      name: "Delhi Metro (DMRC) Helpline",
      number: "155370",
      description: "Emergency commuter support across all metro stations and trains."
    }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <span className="profile-pill">COMMUTER ACCOUNT & PRIVACY HUB</span>
        <h1>Account & Safety Resources</h1>
        <p>Your profile data is strictly private. Enforced by PostgreSQL Row Level Security (RLS).</p>
      </div>

      <div className="profile-grid">
        {/* Left Column: User Card, MFA & Helplines */}
        <div className="profile-sidebar-col">
          {/* Account Details Card */}
          <div className="profile-card">
            <div className="profile-avatar-row">
              <div className="profile-avatar-circle">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-name-group">
                <h3>{fullName}</h3>
                <span className="account-type-tag">
                  {isDemoGuest ? "Demo Mode Account" : "Isolated User Account"}
                </span>
              </div>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#8a8292", textTransform: "uppercase" }}>Full Name</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ead3df", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#8a8292", textTransform: "uppercase" }}>Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ead3df", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{ flex: 1, padding: "8px", background: "#df5790", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    style={{ padding: "8px 12px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-list">
                <div className="profile-detail-item">
                  <Mail size={16} color="#df5790" />
                  <div>
                    <label>Email Address</label>
                    <span>{user?.email || "evaluator@demo.saferoute"}</span>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <Calendar size={16} color="#df5790" />
                  <div>
                    <label>Member Since</label>
                    <span>{memberSince}</span>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <Lock size={16} color="#16a36a" />
                  <div>
                    <label>Privacy Boundary</label>
                    <span>PostgreSQL RLS Isolated (auth.uid() = id)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  style={{ background: "#fff0f6", border: "1px solid #f5dce8", color: "#df5790", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", marginTop: "4px" }}
                >
                  Edit Profile Info
                </button>
              </div>
            )}

            {/* TOTP Multi-Factor Authentication Section */}
            <MfaSection onShowToast={onShowToast} />

            <button onClick={handleSignOut} className="profile-logout-btn" style={{ marginTop: "16px" }}>
              <LogOut size={16} />
              <span>Sign Out of SafeRoute</span>
            </button>
          </div>

          {/* Delhi Emergency Helplines Directory */}
          <div className="profile-card emergency-card">
            <div className="emergency-header">
              <Phone size={18} color="#dc2626" />
              <h4>Delhi Emergency Helplines</h4>
            </div>
            <p className="emergency-sub">Keep these verified crisis numbers handy while traveling:</p>

            <div className="helpline-list">
              {emergencyHelplines.map((line, idx) => (
                <div key={idx} className="helpline-item">
                  <div className="helpline-info">
                    <strong>{line.name}</strong>
                    <p>{line.description}</p>
                  </div>
                  <a href={`tel:${line.number}`} className="helpline-call-btn">
                    <Phone size={13} /> {line.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: User's Private Submitted Reports */}
        <div className="profile-main-col">
          <div className="profile-card">
            <div className="user-reports-header">
              <div className="header-title">
                <MessageSquareWarning size={20} color="#df5790" />
                <h3>Your Private Reports</h3>
              </div>
              <span className="report-count-badge">
                {userReports.length} {userReports.length === 1 ? "report" : "reports"}
              </span>
            </div>

            <p className="user-reports-desc">
              Only you can see these full records with complete descriptions and exact coordinates. Other users only see minimized locality summaries.
            </p>

            {loading ? (
              <div className="profile-loading-state">
                <span className="spinner" />
                <p>Loading your reports securely...</p>
              </div>
            ) : userReports.length === 0 ? (
              <div className="profile-empty-reports">
                <p>You have not submitted any safety reports yet.</p>
                <button
                  type="button"
                  onClick={onNavigateToPlanner}
                  className="start-reporting-btn"
                >
                  Explore Route Planner
                </button>
              </div>
            ) : (
              <div className="user-reports-list">
                {userReports.map((report) => (
                  <div key={report.id} className="user-report-item">
                    <div className="item-header-row">
                      <div className="category-group">
                        <span className="user-cat-badge">{report.concern_type}</span>
                        <span className="user-status-badge">
                          {report.displayStatus || "Unverified Community Report"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={deletingId === report.id}
                        className="delete-report-btn"
                        title="Delete your report"
                      >
                        <Trash2 size={15} />
                        <span>{deletingId === report.id ? "Deleting..." : "Delete"}</span>
                      </button>
                    </div>

                    <h4 className="user-report-area">{report.area}</h4>
                    
                    {/* Private description only shown to author */}
                    <div style={{ background: "white", border: "1px solid #f5dce8", borderRadius: "6px", padding: "10px", margin: "8px 0" }}>
                      <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#df5790", marginBottom: "2px" }}>
                        🔒 Private Description (Author Only):
                      </span>
                      <p className="user-report-desc" style={{ margin: 0 }}>{report.description}</p>
                    </div>

                    {report.latitude && report.longitude && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#166534", background: "#f0fdf4", padding: "4px 8px", borderRadius: "4px", marginBottom: "8px" }}>
                        <MapPin size={12} />
                        <span>Exact Tagged GPS: {Number(report.latitude).toFixed(6)}°N, {Number(report.longitude).toFixed(6)}°E (Private)</span>
                      </div>
                    )}

                    <div className="user-report-footer">
                      <Clock size={13} />
                      <span>
                        Submitted on{" "}
                        {new Date(report.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
