import { useState } from "react";
import {
  TrendingDown,
  Users,
  ExternalLink,
  Info,
  Calendar,
  FileCheck2,
  AlertTriangle,
  Scale
} from "lucide-react";
import {
  DELHI_CRIME_METADATA,
  NCRB_ANNUAL_TREND,
  NCRB_ANNUAL_METADATA,
  DELHI_2024_CATEGORIES,
  DELHI_2024_TOTALS,
  OFFENDER_RELATIONSHIP_INSIGHT,
  MHA_DELHI_POLICE_SERIES,
  MHA_SERIES_METADATA,
  METHODOLOGY_AND_LIMITATIONS
} from "../../data/delhiCrimeData";

export default function DelhiInsights() {
  const [selectedCategory, setSelectedCategory] = useState(DELHI_2024_CATEGORIES[0]);
  const [selectedYear, setSelectedYear] = useState(NCRB_ANNUAL_TREND[3]); // 2024 default

  // Max value for scaling Dataset A (max ~ 15000)
  const maxTrend = 16000;
  // Max value for scaling Dataset B categories (max ~ 1200)
  const maxCategory = 1200;

  return (
    <div className="insights-container">
      {/* Page Header */}
      <div className="insights-header">
        <div className="header-badge">
          <FileCheck2 size={16} />
          <span>OFFICIALLY RESEARCHED EVIDENCE BASE</span>
        </div>
        <h1>Delhi Women's Safety & Crime Insights</h1>
        <p className="insights-subtitle">
          Empirical analysis based strictly on National Crime Records Bureau (NCRB) publications,
          Ministry of Home Affairs parliamentary disclosures, and Directorate of Economics & Statistics data.
        </p>

        {/* Global Transparency Alert */}
        <div className="data-callout-warning">
          <AlertTriangle size={20} className="warning-icon" />
          <div className="warning-text">
            <strong>Geospatial Limitation Notice:</strong> Official government crime data in India is
            published at state and district aggregates. Coordinates for specific street segments or intersections
            are <em>not published</em>. These figures establish macroeconomic context and must <strong>never</strong>{" "}
            be interpreted as street-level hazard ratings.
          </div>
        </div>
      </div>

      {/* Snapshot Overview Metric Cards */}
      <div className="snapshot-cards-grid">
        <div className="snapshot-card">
          <div className="card-top">
            <span className="card-label">2024 NCRB Delhi Total</span>
            <Calendar size={18} color="#df5790" />
          </div>
          <div className="card-metric">{DELHI_2024_TOTALS.combinedTotal.toLocaleString()}</div>
          <p className="card-sub">
            11,795 IPC/BNS Cases + 1,601 Special & Local Laws (SLL)
          </p>
          <div className="card-footer-meta">
            Source: NCRB Crime in India 2024, Table 3A.1
          </div>
        </div>

        <div className="snapshot-card highlight-card">
          <div className="card-top">
            <span className="card-label">Offender Relationship</span>
            <Users size={18} color="#df5790" />
          </div>
          <div className="card-metric">{OFFENDER_RELATIONSHIP_INSIGHT.knownOffenderPercentage}%</div>
          <p className="card-sub">
            1,029 of 1,058 rape cases involved known perpetrators
          </p>
          <div className="card-footer-meta">
            Stranger / Unidentified Offenders: 2.7% (29 cases)
          </div>
        </div>

        <div className="snapshot-card">
          <div className="card-top">
            <span className="card-label">4-Year NCRB Trend (2021–2024)</span>
            <TrendingDown size={18} color="#df5790" />
          </div>
          <div className="card-metric">14,277 → 13,396</div>
          <p className="card-sub">
            Decline in registered FIRs (-6.2% overall across 4 years)
          </p>
          <div className="card-footer-meta">
            Caveat: Case registration ≠ Actual victimization rates
          </div>
        </div>
      </div>

      {/* DATASET A: NCRB Annual Trend (2021-2024) */}
      <section className="insight-section">
        <div className="section-title-row">
          <div>
            <span className="section-pill">DATASET A • NCRB STATE / UT TOTALS</span>
            <h2>Delhi Annual Registered Cases Trend (2021–2024)</h2>
            <p className="section-desc">
              Annual registered First Information Reports (FIRs) under Crimes Against Women in Delhi.
            </p>
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-header-info">
            <span className="chart-metric-title">
              NCRB Registered Cases (IPC/BNS + SLL)
            </span>
            <span className="chart-interactive-hint">Click a bar to inspect details</span>
          </div>

          {/* Responsive SVG/CSS Hybrid Bar Chart */}
          <div className="annual-bar-chart">
            {NCRB_ANNUAL_TREND.map((item) => {
              const heightPercent = Math.round((item.registeredCases / maxTrend) * 100);
              const isSelected = selectedYear.year === item.year;
              return (
                <div
                  key={item.year}
                  className={`bar-column ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedYear(item)}
                >
                  <span className="bar-value-label">
                    {item.registeredCases.toLocaleString()}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="bar-year-label">{item.year}</span>
                  <span className="bar-change-badge">{item.changeNote}</span>
                </div>
              );
            })}
          </div>

          {/* Selected Year Detail Callout */}
          <div className="selected-detail-panel">
            <h4>
              Year {selectedYear.year}: {selectedYear.registeredCases.toLocaleString()} registered cases
            </h4>
            <p>
              <strong>Status:</strong> {selectedYear.changeNote}. Recorded by Delhi Police and compiled in
              NCRB Crime in India.
            </p>
            <p className="critical-note">
              <strong>Methodological Caveat:</strong> {NCRB_ANNUAL_METADATA.criticalContext}
            </p>
          </div>

          <div className="chart-meta-footer">
            <div>
              <strong>Source:</strong> {NCRB_ANNUAL_METADATA.source}
            </div>
            <div>
              <strong>Geographical Scope:</strong> {NCRB_ANNUAL_METADATA.coverage}
            </div>
          </div>
        </div>
      </section>

      {/* DATASET B: 2024 Crime-Category Breakdown */}
      <section className="insight-section">
        <div className="section-title-row">
          <div>
            <span className="section-pill">DATASET B • 2024 CATEGORICAL HEADS</span>
            <h2>Selected Transit & Public-Space Crime Categories (Delhi 2024)</h2>
            <p className="section-desc">
              NCRB registered cases under specific IPC / BNS categories relevant to public safety and transit corridors.
            </p>
          </div>
        </div>

        {/* Totals Summary Banner */}
        <div className="category-totals-banner">
          <div className="total-item">
            <span className="total-num">11,795</span>
            <span className="total-name">IPC / BNS Crimes Against Women</span>
          </div>
          <div className="total-item-sep">+</div>
          <div className="total-item">
            <span className="total-num">1,601</span>
            <span className="total-name">Special & Local Laws (SLL)</span>
          </div>
          <div className="total-item-sep">=</div>
          <div className="total-item primary-total">
            <span className="total-num">13,396</span>
            <span className="total-name">2024 Combined Recorded Total</span>
          </div>
        </div>

        <div className="category-layout">
          {/* Category Horizontal Bars */}
          <div className="category-bars-col">
            <div className="category-bars-list">
              {DELHI_2024_CATEGORIES.map((cat) => {
                const widthPercent = Math.round((cat.cases / maxCategory) * 100);
                const isSelected = selectedCategory.category === cat.category;
                return (
                  <div
                    key={cat.category}
                    className={`category-bar-row ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="cat-row-header">
                      <span className="cat-name">{cat.category}</span>
                      <span className="cat-count">
                        <strong>{cat.cases.toLocaleString()}</strong> cases
                      </span>
                    </div>
                    <div className="cat-track">
                      <div
                        className="cat-fill"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <div className="cat-sub-row">
                      <span className="cat-legal">{cat.legalSection}</span>
                      <span className="cat-click-hint">Click for legal details</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="category-boundary-notice">
              <Info size={16} />
              <span>
                <strong>Note on Aggregation:</strong> These 6 selected public-space crime heads total 2,624 cases.
                They are specific selected crime heads and do <em>not</em> equal the full 13,396 total, which
                encompasses domestic cruelty (Section 498A), kidnapping, POCSO, and other categories.
              </span>
            </div>
          </div>

          {/* Interactive Category Detail Card */}
          <div className="category-detail-col">
            <div className="category-active-card">
              <span className="active-cat-badge">{selectedCategory.legalSection}</span>
              <h3>{selectedCategory.category}</h3>
              <div className="active-cat-count">
                <span>{selectedCategory.cases.toLocaleString()}</span> registered cases (2024)
              </div>

              <div className="detail-item">
                <span className="detail-label">Legal Definition:</span>
                <p>{selectedCategory.description}</p>
              </div>

              <div className="detail-item">
                <span className="detail-label">Relevance to Commuters:</span>
                <p>{selectedCategory.transitRelevance}</p>
              </div>

              <div className="detail-item">
                <span className="detail-label">Official Source:</span>
                <p>NCRB Crime in India 2024, Table 3A.1 (Delhi State/UT)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DATASET C: Offender Relationship Insight */}
      <section className="insight-section">
        <div className="section-title-row">
          <div>
            <span className="section-pill">DATASET C • PERPETRATOR RELATIONSHIP</span>
            <h2>Offender Relationship Analysis: Public Space vs. Interpersonal Violence</h2>
            <p className="section-desc">
              Understanding the boundary between road navigation technologies and personal violence protection.
            </p>
          </div>
        </div>

        <div className="relationship-card">
          <div className="relationship-split">
            <div className="split-visual">
              <div className="donut-chart-container">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#fee2e2"
                    strokeWidth="14"
                  />
                  {/* Known Offenders: 97.3% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#df5790"
                    strokeWidth="14"
                    strokeDasharray="232.3 238.8"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Unknown: 2.7% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#991b1b"
                    strokeWidth="14"
                    strokeDasharray="6.5 238.8"
                    strokeDashoffset="-232.3"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="donut-center-label">
                  <span className="donut-big">97.3%</span>
                  <span className="donut-sub">Known</span>
                </div>
              </div>
            </div>

            <div className="split-content">
              <h3>Perpetrator Familiarity in Recorded Cases</h3>
              <p className="relationship-lead">
                {OFFENDER_RELATIONSHIP_INSIGHT.insightText}
              </p>

              <div className="relationship-stats-row">
                <div className="rel-stat-chip known">
                  <span className="chip-num">1,029 Cases (97.3%)</span>
                  <span className="chip-label">Known to Victim (Family, Acquaintances, Employers, Partners)</span>
                </div>
                <div className="rel-stat-chip unknown">
                  <span className="chip-num">29 Cases (2.7%)</span>
                  <span className="chip-label">Unknown / Unidentified Offenders</span>
                </div>
              </div>

              <div className="architectural-distinction-box">
                <Scale size={20} color="#b45309" className="box-icon" />
                <div className="box-text">
                  <strong>Technology Scope & Ethical Boundary:</strong>
                  <p>{OFFENDER_RELATIONSHIP_INSIGHT.safetyBoundaryExplanation}</p>
                </div>
              </div>

              <div className="rel-source-note">
                Source: {OFFENDER_RELATIONSHIP_INSIGHT.source}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATE SOURCE SERIES: Ministry of Home Affairs (MHA) Delhi Police Data */}
      <section className="insight-section">
        <div className="section-title-row">
          <div>
            <span className="section-pill">SEPARATE SERIES • MINISTRY OF HOME AFFAIRS</span>
            <h2>Delhi Police-Reported Series (Rajya Sabha USQ 4220)</h2>
            <p className="section-desc">
              Independent administrative reporting by Delhi Police to the Ministry of Home Affairs.
            </p>
          </div>
        </div>

        <div className="mha-series-card">
          <div className="mha-notice-banner">
            <Info size={18} color="#0369a1" />
            <span>
              <strong>Methodological Note:</strong> {MHA_SERIES_METADATA.distinctionNotice}
            </span>
          </div>

          <div className="mha-series-grid">
            {MHA_DELHI_POLICE_SERIES.map((item) => (
              <div key={item.year} className="mha-stat-box">
                <span className="mha-year">{item.year}</span>
                <span className="mha-cases">{item.reportedCases.toLocaleString()}</span>
                <span className="mha-desc">Delhi Police CAW Registrations</span>
              </div>
            ))}
          </div>

          <div className="mha-meta-footer">
            <strong>Source:</strong> {MHA_SERIES_METADATA.source} | <strong>Reporter:</strong>{" "}
            {MHA_SERIES_METADATA.reporter}
          </div>
        </div>
      </section>

      {/* METHODOLOGY, LIMITATIONS & OFFICIAL CITATIONS */}
      <section className="insight-section methodology-section">
        <div className="section-title-row">
          <div>
            <span className="section-pill">EVIDENTIARY RIGOR & AUDIT TRAIL</span>
            <h2>Data Methodology, Scientific Limitations & Official Citations</h2>
            <p className="section-desc">
              Transparent assessment of data constraints, legal definitions, and verified document links.
            </p>
          </div>
        </div>

        <div className="methodology-cards-grid">
          {METHODOLOGY_AND_LIMITATIONS.map((m, idx) => (
            <div key={idx} className="methodology-card">
              <h4>{m.title}</h4>
              <p>{m.content}</p>
            </div>
          ))}
        </div>

        <div className="official-citations-card">
          <h3>Verified Source Documents & Repository Links</h3>
          <p className="citations-sub">
            All data in SafeRoute is reproducible and directly referenced from the following official publications:
          </p>

          <div className="citations-list">
            {DELHI_CRIME_METADATA.officialSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="citation-link-item"
              >
                <div className="citation-info">
                  <strong>{source.name}</strong>
                  <span>{source.reference}</span>
                </div>
                <ExternalLink size={16} className="citation-ext-icon" />
              </a>
            ))}
          </div>

          <div className="snapshot-date-tag">
            Research Snapshot Date: <strong>{DELHI_CRIME_METADATA.researchSnapshotDate}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
