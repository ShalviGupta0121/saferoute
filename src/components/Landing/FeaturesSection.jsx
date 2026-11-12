import {
  Compass,
  MessageSquareWarning,
  BarChart3,
  PhoneCall,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function FeaturesSection({ onNavigate }) {
  const features = [
    {
      id: "routing",
      icon: Compass,
      tag: "NAVIGATION",
      title: "Smart Route Planning",
      description:
        "Calculate real road routes across Delhi using OSRM. Compare multiple driving alternatives with exact distance in kilometers and duration in minutes on interactive Leaflet maps.",
      actionLabel: "Try Route Planner",
      actionTarget: "planner",
      featured: true
    },
    {
      id: "community",
      icon: MessageSquareWarning,
      tag: "CROWDSOURCED",
      title: "Community Safety Reporting",
      description:
        "Submit crowdsourced notices regarding broken streetlights, poor visibility, or suspicious activity. Submissions are transparently labeled as unverified community observations.",
      actionLabel: "Browse Community Feed",
      actionTarget: "reports"
    },
    {
      id: "insights",
      icon: BarChart3,
      tag: "EMPIRICAL DATA",
      title: "Delhi Crime Insights",
      description:
        "Explore officially published NCRB crime statistics (2021–2024), 2024 categorical breakdowns, and the crucial 97.3% known-offender relationship dataset.",
      actionLabel: "Explore Analytics",
      actionTarget: "insights"
    },
    {
      id: "emergency",
      icon: PhoneCall,
      tag: "AWARENESS & SUPPORT",
      title: "Emergency Helpline Hub",
      description:
        "Direct access to verified official helplines: 112 National Police Emergency (ERSS), 1091 Delhi Police Women Helpline, 181 Delhi Govt WCD Helpline, and DMRC Metro Transit Assistance (155370).",
      actionLabel: "View Emergency Directory",
      actionTarget: "helplines"
    },
    {
      id: "privacy",
      icon: ShieldCheck,
      tag: "SECURITY & PRIVACY",
      title: "Privacy-First Anonymous Platform",
      description:
        "Submit hazard notices and access navigation without creating an account, logging in, or sharing your identity. SafeRoute is built around data minimization for public safety participation.",
      actionLabel: "Explore Privacy Architecture",
      actionTarget: "privacy"
    }
  ];

  const handleCardClick = (target) => {
    if (target === "helplines" || target === "privacy") {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    onNavigate(target);
  };

  return (
    <section className="sr-features-section" id="features" aria-labelledby="features-heading">
      <div className="sr-features-container">
        {/* Section Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">DESIGNED FOR TRUST AND RELIABILITY</span>
          <h2 id="features-heading" className="sr-section-heading">
            Core Platform Capabilities
          </h2>
          <p className="sr-section-subtext">
            Every feature in SafeRoute serves a deliberate purpose: to inform, connect, and empower commuters with transparent technology.
          </p>
        </div>

        {/* Feature Grid (Editorial Layout with 1 Large Featured Card + 4 Balanced Cards) */}
        <div className="sr-features-grid">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className={`sr-feature-card ${feat.featured ? "featured-card" : ""}`}
                onClick={() => handleCardClick(feat.actionTarget)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(feat.actionTarget)}
              >
                <div className="card-top-meta">
                  <div className="feature-icon-box">
                    <Icon size={22} color="#DF5790" />
                  </div>
                  <span className="feature-tag">{feat.tag}</span>
                </div>

                <div className="card-main-content">
                  <h3 className="feature-card-heading">{feat.title}</h3>
                  <p className="feature-card-desc">{feat.description}</p>
                </div>

                <div className="card-action-footer">
                  <span className="action-text">{feat.actionLabel}</span>
                  <ChevronRight size={15} className="action-chevron" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
