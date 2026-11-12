import {
  MessageSquareWarning,
  Lightbulb,
  Shield,
  Eye,
  ArrowRight,
  Send
} from "lucide-react";

export default function CommunitySection({ onNavigate }) {
  const reportingPillars = [
    {
      icon: Lightbulb,
      title: "Broken Streetlighting",
      desc: "Flag dark stretches, non-functional municipal lamps, and unlit metro walkway alleys."
    },
    {
      icon: Eye,
      title: "Visibility & Isolation",
      desc: "Report poorly visible pedestrian underpasses, overgrown vegetation, or isolated bus stops."
    },
    {
      icon: Shield,
      title: "Harassment & Suspicion",
      desc: "Share unverified observations on loitering or unsafe vehicle activity to alert commuters."
    }
  ];

  return (
    <section className="sr-community-section" aria-labelledby="community-heading">
      <div className="sr-community-container">
        {/* Editorial Narrative Grid */}
        <div className="sr-community-layout-grid">
          {/* Left Column: Mission & Voice */}
          <div className="sr-community-text-col">
            <span className="sr-section-eyebrow">COLLECTIVE CIVIC VIGILANCE</span>
            <h2 id="community-heading" className="sr-community-headline">
              Safer journeys begin with awareness.{" "}
              <span className="headline-emphasis">Stronger communities begin with participation.</span>
            </h2>
            <p className="sr-community-body">
              Every day, commuters observe practical details that algorithms and aggregate crime reports cannot capture: which side of the metro station is well-lit, where sidewalks are crowded, and where streetlights fail.
            </p>
            <p className="sr-community-body">
              SafeRoute provides a platform for women and citizens to contribute anonymous notices, transforming individual awareness into collective safety reassurance.
            </p>

            <div className="sr-community-pillars-stack">
              {reportingPillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="community-pillar-item">
                    <div className="pillar-icon-box">
                      <Icon size={18} color="#DF5790" />
                    </div>
                    <div className="pillar-text">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sr-community-actions">
              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="sr-btn-primary"
              >
                <MessageSquareWarning size={16} />
                <span>Browse Community Notices</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("reports")}
                className="sr-btn-secondary"
              >
                <Send size={15} />
                <span>Submit an Observation</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Community Notice Stream Preview */}
          <div className="sr-community-visual-col" aria-hidden="true">
            <div className="sr-community-feed-preview-card">
              <div className="feed-card-header">
                <div className="header-badge-row">
                  <span className="pulse-dot green" />
                  <span className="feed-title">Live Community Notice Stream</span>
                </div>
                <span className="feed-subtag">Delhi NCR</span>
              </div>

              {/* Feed Items Mock Stack */}
              <div className="feed-items-stack">
                <div className="feed-item-card">
                  <div className="item-meta">
                    <span className="item-tag lighting">Street lighting issue</span>
                    <span className="item-badge">Community Submitted — Unverified</span>
                  </div>
                  <h4 className="item-location">Connaught Place, Radial Road 3</h4>
                  <p className="item-note">
                    Municipal streetlights non-operational along 150m stretch heading toward Barakhamba Metro Gate 4.
                  </p>
                  <div className="item-footer">
                    <span className="item-time">🕒 Reported: Today</span>
                    <span className="item-anon">🔒 Author Anonymous</span>
                  </div>
                </div>

                <div className="feed-item-card">
                  <div className="item-meta">
                    <span className="item-tag infrastructure">Infrastructure Concern</span>
                    <span className="item-badge">Community Submitted — Unverified</span>
                  </div>
                  <h4 className="item-location">Dwarka Sector 12 Metro Walkway</h4>
                  <p className="item-note">
                    Overgrown trees obstructing pedestrian walkway lights. Recommended to use main road avenue.
                  </p>
                  <div className="item-footer">
                    <span className="item-time">🕒 Reported: Yesterday</span>
                    <span className="item-anon">🔒 Author Anonymous</span>
                  </div>
                </div>

                <div className="feed-item-card">
                  <div className="item-meta">
                    <span className="item-tag visibility">Poor visibility</span>
                    <span className="item-badge">Community Submitted — Unverified</span>
                  </div>
                  <h4 className="item-location">Saket District Centre, Press Enclave</h4>
                  <p className="item-note">
                    Underpass lighting intermittently flickering after 9 PM. Pedestrian traffic active near mall side.
                  </p>
                  <div className="item-footer">
                    <span className="item-time">🕒 Reported: 2 days ago</span>
                    <span className="item-anon">🔒 Author Anonymous</span>
                  </div>
                </div>
              </div>

              <div className="feed-card-note">
                <span>All submissions are published without personal identifiers, exact coordinates, or private contact details.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
