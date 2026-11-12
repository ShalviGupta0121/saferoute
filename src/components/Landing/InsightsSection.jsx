import {
  TrendingDown,
  FileText,
  ArrowRight,
  Info,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import {
  NCRB_ANNUAL_TREND,
  OFFENDER_RELATIONSHIP_INSIGHT,
  DELHI_CRIME_METADATA
} from "../../data/delhiCrimeData";

export default function InsightsSection({ onNavigate }) {
  const maxCases = Math.max(...NCRB_ANNUAL_TREND.map((d) => d.registeredCases));

  return (
    <section className="sr-insights-section" aria-labelledby="insights-heading">
      <div className="sr-insights-container">
        {/* Section Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">TRANSPARENT EMPIRICAL RESEARCH</span>
          <h2 id="insights-heading" className="sr-section-heading">
            Better awareness begins with better information.
          </h2>
          <p className="sr-section-subtext">
            SafeRoute integrates officially published statistics from the National Crime Records Bureau (NCRB) and the Ministry of Home Affairs to give commuters macroscopic context.
          </p>
        </div>

        {/* Analytics Highlights Grid */}
        <div className="sr-insights-grid">
          {/* Card 1: 4-Year NCRB Trend Chart */}
          <div className="sr-insight-card trend-card">
            <div className="insight-card-header">
              <div className="card-badge-row">
                <span className="source-tag">NCRB Publication</span>
                <span className="metric-tag">Annual Registered FIRs (Delhi State/UT)</span>
              </div>
              <h3>Delhi Annual Registered Cases (2021–2024)</h3>
              <p className="insight-card-sub">
                Total police-recorded First Information Reports under Crimes Against Women in NCT of Delhi.
              </p>
            </div>

            {/* Custom Bar Visualization */}
            <div className="sr-trend-bars-wrapper">
              {NCRB_ANNUAL_TREND.map((item) => {
                const heightPercent = Math.round((item.registeredCases / maxCases) * 100);
                const isLatest = item.year === 2024;
                return (
                  <div key={item.year} className="sr-bar-column">
                    <span className="bar-count-label">
                      {item.registeredCases.toLocaleString("en-IN")}
                    </span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${isLatest ? "latest" : ""}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="bar-year-label">{item.year}</span>
                    <span className="bar-change-badge">{item.changeNote}</span>
                  </div>
                );
              })}
            </div>

            <div className="trend-card-footer">
              <TrendingDown size={14} color="#16a36a" />
              <span>Registered FIRs decreased by 6.2% between 2021 (14,277) and 2024 (13,396)</span>
            </div>

            <div className="trend-legal-note">
              <Info size={12} color="#68435F" />
              <span>
                <strong>Statutory Note:</strong> On 1 July 2024, the Bharatiya Nyaya Sanhita (BNS) superseded the Indian Penal Code (IPC). NCRB 2024 records cases across both statutory classifications.
              </span>
            </div>
          </div>

          {/* Card 2: Crucial Offender Relationship Reality */}
          <div className="sr-insight-card relationship-card">
            <div className="insight-card-header">
              <div className="card-badge-row">
                <span className="source-tag">NCRB 2024 Analysis</span>
                <span className="metric-tag">Delhi State / UT Specific</span>
              </div>
              <h3>Offender Relationship in Delhi Rape Cases</h3>
              <p className="insight-card-sub">
                Official analysis of perpetrator relationship in recorded rape cases (IPC 376 / BNS 64) across Delhi in 2024.
              </p>
            </div>

            <div className="sr-relationship-stat-box">
              <div className="big-stat-number">
                {OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage}%
              </div>
              <div className="stat-label-wrap">
                <strong>Known to the Victim (1,029 of 1,058 cases)</strong>
                <p>Family members, neighbours, employers, friends, or online acquaintances</p>
              </div>
            </div>

            <div className="ratio-comparison-bar">
              <div
                className="ratio-fill-known"
                style={{ width: `${OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage}%` }}
                title="Known offenders: 97.3% (1,029 cases)"
              />
              <div
                className="ratio-fill-unknown"
                style={{ width: `${OFFENDER_RELATIONSHIP_INSIGHT.unknownOffenderPercentage}%` }}
                title="Unknown offenders: 2.7% (29 cases)"
              />
            </div>

            <div className="ratio-legend-row">
              <span className="legend-item">
                <span className="dot known" /> Known to Victim: <strong>97.3%</strong> (1,029 cases)
              </span>
              <span className="legend-item">
                <span className="dot unknown" /> Strangers: <strong>2.7%</strong> (29 cases)
              </span>
            </div>

            <div className="relationship-card-note">
              <Info size={14} color="#68435F" />
              <p>
                <strong>Methodological Boundary:</strong> This 97.3% statistic specifically describes <em>recorded rape cases</em> in Delhi (national NCRB benchmark is 96.8%), NOT all crimes against women. Navigation platforms address street-level infrastructure (lighting, footfall) and cannot resolve interpersonal or domestic violence.
              </p>
            </div>
          </div>
        </div>

        {/* Macroscopic Caveat Notice */}
        <div className="sr-macro-caveat-box">
          <ShieldAlert size={16} color="#8A8292" />
          <p>
            <strong>Important Statistical Context:</strong> Officially registered crime statistics describe police-recorded FIRs and provide macroscopic citywide context, but they do not independently measure the safety of a particular route or predict whether an incident will occur on an individual road.
          </p>
        </div>

        {/* Methodology & Attribution Strip */}
        <div className="sr-attribution-strip">
          <div className="attribution-left">
            <FileText size={16} color="#47263F" />
            <span>
              <strong>Primary Official Sources:</strong> NCRB <em>Crime in India 2024</em> (Table 3A.1 & CAW Chapters) & Rajya Sabha Unstarred Question 390. Snapshot date: {DELHI_CRIME_METADATA.researchSnapshotDate}.
            </span>
          </div>

          <div className="attribution-actions">
            <a
              href="https://www.ncrb.mha.gov.in/crime-in-india.html"
              target="_blank"
              rel="noopener noreferrer"
              className="sr-official-source-link"
            >
              <span>NCRB Official Portal</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => onNavigate("insights")}
              className="sr-btn-explore-insights"
            >
              <span>Explore Safety Insights</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
