import { ArrowRight, BarChart3, MessageSquareWarning, ShieldAlert, Sparkles, TrendingDown, Users } from "lucide-react";
import { OFFENDER_RELATIONSHIP_INSIGHT } from "../../data/delhiCrimeData";

export default function PreviewsSection({ onNavigate }) {
  return (
    <section className="sr-previews-section" id="previews" aria-labelledby="previews-heading">
      <div className="sr-previews-container">
        {/* Section Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">DEDICATED PLATFORM DESTINATIONS</span>
          <h2 id="previews-heading" className="sr-section-heading">
            Explore Community & Official Insights
          </h2>
          <p className="sr-section-subtext">
            SafeRoute separates verified official crime research from crowdsourced community notices. Visit our dedicated destinations below for comprehensive data.
          </p>
        </div>

        {/* 2-Column Previews Grid */}
        <div className="sr-previews-grid">
          {/* Preview Card 1: Safety Insights */}
          <div className="sr-preview-card insights-preview-card">
            <div className="preview-card-header">
              <div className="preview-icon-pill insights-pill">
                <BarChart3 size={18} color="#DF5790" />
                <span>OFFICIAL RESEARCH DESTINATION</span>
              </div>
              <span className="preview-source-badge">NCRB 2021–2024</span>
            </div>

            <h3 className="preview-card-title">Delhi Crime Insights & Analysis</h3>
            <p className="preview-card-desc">
              Rigorous, reproducible analysis sourced strictly from the National Crime Records Bureau (NCRB) and Delhi Police Crime Branch reviews.
            </p>

            <div className="preview-metrics-stack">
              <div className="preview-metric-box">
                <div className="metric-box-top">
                  <Users size={16} color="#DF5790" />
                  <span className="metric-box-label">Perpetrator Familiarity (2024)</span>
                </div>
                <div className="metric-box-value">
                  {OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage}% Known
                </div>
                <p className="metric-box-sub">
                  1,029 of 1,058 recorded rape cases involved known perpetrators (29 stranger cases). Demonstrates why street navigation addresses transit hazards, not interpersonal violence.
                </p>
              </div>

              <div className="preview-metric-box">
                <div className="metric-box-top">
                  <TrendingDown size={16} color="#DF5790" />
                  <span className="metric-box-label">4-Year Registered FIR Trend</span>
                </div>
                <div className="metric-box-value">
                  14,277 → 13,396 (-6.2%)
                </div>
                <p className="metric-box-sub">
                  Overall decline in registered crimes against women FIRs across Delhi (2021–2024). Note: IPC to BNS statutory transition enacted 1 July 2024.
                </p>
              </div>
            </div>

            <div className="preview-action-row">
              <button
                type="button"
                onClick={() => onNavigate("insights")}
                className="preview-cta-btn insights-cta"
              >
                <span>Inspect Full Safety Insights</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Preview Card 2: Community Reports */}
          <div className="sr-preview-card community-preview-card">
            <div className="preview-card-header">
              <div className="preview-icon-pill community-pill">
                <MessageSquareWarning size={18} color="#DF5790" />
                <span>COMMUNITY PARTICIPATION DESTINATION</span>
              </div>
              <span className="preview-source-badge">CROWDSOURCED</span>
            </div>

            <h3 className="preview-card-title">Community Safety Reports</h3>
            <p className="preview-card-desc">
              Commuters share local visibility alerts, broken street lighting, and public space observations across Delhi NCR to keep each other informed.
            </p>

            {/* Sample Sanitized Notices */}
            <div className="preview-notices-stack">
              <div className="preview-notice-item">
                <div className="notice-item-top">
                  <span className="notice-cat-tag">Street lighting issue</span>
                  <span className="notice-status-tag">Unverified Observation</span>
                </div>
                <h4 className="notice-area-name">Connaught Place, Inner Circle</h4>
                <p className="notice-privacy-note">
                  <ShieldAlert size={12} /> Sanitized public notice: submitted without an account; author identity is not collected or published.
                </p>
              </div>

              <div className="preview-notice-item">
                <div className="notice-item-top">
                  <span className="notice-cat-tag">Poor visibility</span>
                  <span className="notice-status-tag">Unverified Observation</span>
                </div>
                <h4 className="notice-area-name">Dwarka Sector 12 Metro Station</h4>
                <p className="notice-privacy-note">
                  <ShieldAlert size={12} /> Sanitized public notice: submitted without an account; author identity is not collected or published.
                </p>
              </div>
            </div>

            <div className="preview-responsible-note">
              <Sparkles size={14} color="#DF5790" />
              <span>
                All community notices are crowd-submitted observations. Reports do not represent certified municipal audits.
              </span>
            </div>

            <div className="preview-action-row">
              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="preview-cta-btn community-cta"
              >
                <span>View Community & Submit Notice</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
