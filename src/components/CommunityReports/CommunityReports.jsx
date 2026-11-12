import { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  MapPin,
  Send,
  AlertTriangle,
  Clock,
  Compass,
  Filter,
  ShieldAlert,
  Info,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Lock,
  XCircle
} from "lucide-react";
import {
  fetchCommunityReports,
  submitCommunityReport,
  REPORT_CONCERN_CATEGORIES,
  DELHI_LOCALITY_SUGGESTIONS,
  APPROVED_DELHI_LOCALITIES
} from "../../services/reportService";

export default function CommunityReports({ onShowToast }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Form State
  const [area, setArea] = useState("");
  const [concernType, setConcernType] = useState(REPORT_CONCERN_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchCommunityReports()
      .then((data) => {
        if (!ignore) {
          setReports(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) {
          setLoading(false);
          if (onShowToast) {
            onShowToast({
              type: "error",
              message: "Failed to load community reports from database."
            });
          }
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshTrigger, onShowToast]);

  // Request browser geolocation with explicit consent to tag hazard location
  // Clearly explains that browser geolocation captures current physical location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoNotice("Requesting device location for hazard...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Round to 3 decimal places for locality privacy (~110m accuracy)
        const approxLat = Number(position.coords.latitude.toFixed(3));
        const approxLon = Number(position.coords.longitude.toFixed(3));

        setCoordinates({
          latitude: approxLat,
          longitude: approxLon
        });
        setGeoNotice(
          `Approximate hazard coordinates tagged (~100m area): ${approxLat}° N, ${approxLon}° E`
        );
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoNotice("Location permission denied. Report will be submitted using area text only.");
        } else {
          setGeoNotice("Could not determine device location coordinates.");
        }
      },
      { timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    setCoordinates(null);
    setGeoNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedArea = area.trim();
    const trimmedDesc = description.trim();

    if (!trimmedArea || !trimmedDesc) {
      setFormError("Please fill in both the location and description fields.");
      return;
    }

    setSubmitting(true);

    try {
      await submitCommunityReport({
        area: trimmedArea,
        concernType,
        description: trimmedDesc,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null
      });

      // Clear input fields and show success state
      setArea("");
      setDescription("");
      setConcernType(REPORT_CONCERN_CATEGORIES[0]);
      setCoordinates(null);
      setGeoNotice("");
      setSubmitSuccess(true);

      if (onShowToast) {
        onShowToast({
          type: "success",
          message: "Report submitted successfully! Saved to community notices."
        });
      }

      // Trigger reload of shared reports
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      // Retain entered form values and display truthful error
      setFormError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports =
    filterCategory === "ALL"
      ? reports
      : reports.filter((r) => r.concern_type === filterCategory);

  return (
    <div className="reports-page-container">
      {/* Header & Purpose Banner */}
      <div className="reports-header">
        <span className="reports-pill">CROWDSOURCED SAFETY NOTICES</span>
        <h1>Community Safety Reports</h1>
        <p className="reports-header-sub">
          SafeRoute Community is a shared civic awareness space where commuters document everyday public-space observations—such as broken streetlights, poorly lit corridors, or infrastructure hazards. By sharing observed conditions, commuters help each other make more informed transit choices.
        </p>

        <div className="community-intro-banner">
          <div className="intro-banner-item">
            <Sparkles size={16} color="#df5790" />
            <span><strong>Civic Hazard Awareness:</strong> Share ground-level conditions to improve collective commuter clarity.</span>
          </div>
          <div className="intro-banner-item emergency-warning">
            <AlertTriangle size={16} color="#b45309" />
            <span><strong>Emergency Distinction:</strong> Community reports are not monitored by emergency dispatch. In immediate danger, call <strong>112</strong> immediately.</span>
          </div>
        </div>
      </div>

      <div className="reports-grid-layout">
        {/* Left Column: Anonymous Submission Form */}
        <div className="report-submit-col">
          <div className="report-form-card">
            <div className="form-card-title">
              <MessageSquareWarning size={20} color="#df5790" />
              <h3>Submit a Safety Concern</h3>
            </div>
            <p className="form-card-sub">
              Help other commuters stay informed by sharing observations about poorly lit streets, isolated areas, or other public-space concerns.
            </p>

            {/* Privacy Assurance Notice */}
            <div className="form-privacy-assurance-box">
              <Lock size={16} color="#df5790" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Privacy Notice:</strong> Community reporting does not require an account, name, email address, or phone number. Reports are submitted without a user profile, and only limited information relevant to the safety concern is stored and shared in the community feed.
              </span>
            </div>

            {submitSuccess ? (
              <div className="report-success-state live-mode-state">
                <div className="success-icon-badge">
                  <CheckCircle2 size={36} color="#16a36a" />
                </div>
                <span className="live-pill-badge">COMMUNITY NOTICE RECORDED</span>
                <h4>Safety Concern Submitted</h4>
                <p className="success-message-text">
                  Your safety concern has been recorded. It is permanently saved in browser storage and published as a <strong>Community Submitted — Unverified</strong> notice in the shared community feed.
                </p>
                <button
                  type="button"
                  className="submit-another-btn"
                  onClick={() => {
                    setSubmitSuccess(false);
                  }}
                >
                  Submit Another Concern
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="safety-report-form">
                {formError && (
                  <div className="form-error-alert">
                    <AlertTriangle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Locality Input with Privacy Helper and Quick Suggestion Chips */}
                <div className="form-group">
                  <label htmlFor="report-area">Area / Public Landmark *</label>
                  <div className="input-with-pin">
                    <MapPin size={16} color="#df5790" />
                    <input
                      id="report-area"
                      type="text"
                      list="approved-localities-list"
                      maxLength={80}
                      placeholder="e.g. Connaught Place, Central Delhi"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      required
                    />
                    <datalist id="approved-localities-list">
                      {APPROVED_DELHI_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                  <small className="locality-field-warning">
                    Select an approved public transit zone or commercial landmark. SafeRoute normalizes reports to general public sector labels to ensure no residential addresses or personal names can appear in community feeds.
                  </small>

                  {/* Controlled Locality Chips */}
                  <div className="locality-chips-row">
                    <span className="chips-label">Suggestions:</span>
                    {DELHI_LOCALITY_SUGGESTIONS.slice(0, 4).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className="locality-chip-btn"
                        onClick={() => setArea(loc)}
                      >
                        {loc.split(",")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="report-concern">Type of Concern *</label>
                  <select
                    id="report-concern"
                    value={concernType}
                    onChange={(e) => setConcernType(e.target.value)}
                    className="category-select"
                  >
                    {REPORT_CONCERN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="report-desc">Detailed Description *</label>
                  <textarea
                    id="report-desc"
                    rows="4"
                    maxLength={1000}
                    placeholder="Describe observable conditions (e.g. non-functional streetlights along a 200m stretch, overgrown shrubs blocking sidewalk visibility). Avoid private names or contact info."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <small style={{ color: "#8a8292", fontSize: "11px", marginTop: "2px", display: "block" }}>
                    {description.length}/1000 characters (minimum 5). Avoid personal phone numbers or names.
                  </small>
                </div>

                {/* Optional Geolocation with clear consent and physical presence explanation */}
                <div className="form-group geo-consent-group">
                  <div className="geo-header">
                    <label>Hazard Location GPS (Optional)</label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="tag-gps-btn"
                      disabled={geoLoading}
                    >
                      <Compass size={14} />
                      <span>{geoLoading ? "Locating..." : "Use Current Location as Hazard Pin"}</span>
                    </button>
                  </div>
                  
                  {coordinates && (
                    <div className="gps-tagged-row">
                      <span className="geo-feedback-note" style={{ margin: 0 }}>
                        Tagged ~100m area: {coordinates.latitude}° N, {coordinates.longitude}° E
                      </span>
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="clear-gps-btn"
                        title="Remove tagged coordinates"
                      >
                        <XCircle size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                        Clear Pin
                      </button>
                    </div>
                  )}

                  {!coordinates && geoNotice && <span className="geo-feedback-note">{geoNotice}</span>}

                  <small className="geo-disclaimer">
                    <strong>Important:</strong> Browser geolocation identifies your device's current position. Use this option only when you are physically at the reported hazard location. If reporting after the fact or from home, please use the manual Area field above instead. Exact coordinates are never published in community feeds.
                  </small>
                </div>

                <button
                  type="submit"
                  className="submit-report-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="btn-spinner-row">
                      <span className="spinner" /> Storing Notice...
                    </span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Anonymous Safety Report</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="form-compliance-notice" style={{ marginTop: "16px" }}>
              <ShieldAlert size={15} color="#6b7280" />
              <span>
                Privacy Notice: No user account or contact details required. Ephemeral request hashing is used strictly to enforce server-side rate limits against automated spam.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Shared Community Report Feed */}
        <div className="report-feed-col">
          <div className="feed-header-bar">
            <div>
              <h3>Shared Community Feed</h3>
              <p>Reports contributed by commuters across Delhi NCR</p>
            </div>

            {/* Filter Dropdown */}
            <div className="filter-wrapper">
              <Filter size={15} color="#df5790" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
                aria-label="Filter reports by concern type"
              >
                <option value="ALL">All Categories ({reports.length})</option>
                {REPORT_CONCERN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feed List */}
          <div className="community-reports-list">
            {loading ? (
              <div className="feed-loading-state">
                <span className="spinner" />
                <p>Retrieving community reports from database...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="feed-empty-state">
                <Info size={28} color="#df5790" />
                <h4>No reports found for this filter</h4>
                <p>Be the first to submit a safety observation for this category.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="community-report-card">
                  <div className="card-top-row">
                    <span className="concern-tag">{report.concern_type}</span>
                    <span className="unverified-badge">
                      {report.displayStatus || "Community Submitted — Unverified"}
                    </span>
                  </div>

                  <h4 className="card-area-name">{report.area}</h4>
                  
                  <div className="sanitized-summary-note">
                    <ShieldAlert size={12} color="#8a8292" />
                    <span>Sanitized public notice. Exact coordinates, author identity, and descriptions are omitted from the public feed.</span>
                  </div>

                  <div className="card-footer-row">
                    <div className="timestamp-group">
                      <Clock size={13} />
                      <span>
                        Reported: {new Date(report.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="privacy-protected-tag">
                      <span className="privacy-shield-icon">🔒</span>
                      <span>Author Anonymous</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="feed-audit-note">
            <Info size={14} />
            <span>
              <strong>Platform Notice:</strong> Community reports are crowd-submitted observations.
              No formal municipal verification process currently exists. Use as advisory context.
            </span>
          </div>
        </div>
      </div>

      {/* Verification, Moderation & Responsible Reporting Standards */}
      <section className="community-guidelines-section" aria-labelledby="guidelines-heading">
        <div className="guidelines-card-container">
          <div className="guidelines-header-row">
            <ShieldCheck size={22} color="#df5790" />
            <div>
              <h3 id="guidelines-heading">Verification, Moderation & Responsible Reporting Standards</h3>
              <p>How SafeRoute protects data integrity, community trust, and personal privacy.</p>
            </div>
          </div>

          <div className="guidelines-four-grid">
            <div className="guideline-pillar">
              <div className="pillar-header">
                <HelpCircle size={16} color="#df5790" />
                <h4>What 'Unverified' Means</h4>
              </div>
              <p>
                All crowd-submitted notices are tagged as <strong>Community Submitted — Unverified</strong>. They reflect individual commuter observations and have not been independently certified by municipal corporations or police authorities.
              </p>
            </div>

            <div className="guideline-pillar">
              <div className="pillar-header">
                <ShieldAlert size={16} color="#df5790" />
                <h4>Moderation & Standards</h4>
              </div>
              <p>
                Submissions are subject to community guidelines. Commercial advertisements, spam, abusive language, or defamatory allegations will be rejected. Reports are published strictly as advisory situational context.
              </p>
            </div>

            <div className="guideline-pillar">
              <div className="pillar-header">
                <Clock size={16} color="#df5790" />
                <h4>Report Lifecycle & Retirement</h4>
              </div>
              <p>
                Because reports are submitted completely anonymously without user accounts, submitters cannot edit or delete reports after submission. Community notices remain in the shared feed as unverified observations and are periodically reviewed and retired by platform moderators to keep information current.
              </p>
            </div>

            <div className="guideline-pillar">
              <div className="pillar-header">
                <CheckCircle2 size={16} color="#16a36a" />
                <h4>Privacy & No Personal Data (PII)</h4>
              </div>
              <p>
                Never enter private names, vehicle registration plates, residential addresses, or phone numbers in descriptions. Public feeds display only general localities; author identities are never requested or stored.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
