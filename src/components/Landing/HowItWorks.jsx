import { MapPin, Route, CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorks({ onNavigate }) {
  const steps = [
    {
      number: "01",
      badge: "INPUT",
      icon: MapPin,
      title: "Enter Your Journey",
      description:
        "Type your origin and destination anywhere in Delhi NCR. The platform uses OpenStreetMap Nominatim to resolve accurate coordinates without background location tracking.",
      detailItems: [
        "Interactive place autocomplete",
        "No continuous location tracking",
        "Optional GPS tagging with click"
      ]
    },
    {
      number: "02",
      badge: "CALCULATION",
      icon: Route,
      title: "Explore Available Routes",
      description:
        "SafeRoute computes real drivable road paths through the Open Source Routing Machine (OSRM), returning distance in kilometers and realistic travel times.",
      detailItems: [
        "Up to 3 road alternatives",
        "Precise vector road geometry",
        "Dynamic alternative switching"
      ]
    },
    {
      number: "03",
      badge: "DECISION",
      icon: CheckCircle2,
      title: "Make an Informed Decision",
      description:
        "Review macro-level crime data, community reports on streetlighting, and corridor characteristics to select the path that offers the highest reassurance.",
      detailItems: [
        "Unverified community notices",
        "Verified NCRB crime context",
        "Emergency helpline directory"
      ]
    }
  ];

  return (
    <section className="sr-how-section" id="how-it-works" aria-labelledby="how-heading">
      <div className="sr-how-container">
        {/* Section Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">SIMPLE, INTENTIONAL WORKFLOW</span>
          <h2 id="how-heading" className="sr-section-heading">
            How SafeRoute Works
          </h2>
          <p className="sr-section-subtext">
            Three intuitive steps designed to give commuters practical context and clarity before they step onto the road.
          </p>
        </div>

        {/* Steps Visual Sequence */}
        <div className="sr-steps-flow-wrapper">
          {/* Subtle connecting horizontal path line (visible on desktop) */}
          <div className="sr-flow-connector-line" aria-hidden="true" />

          <div className="sr-steps-grid">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="sr-step-card">
                  {/* Step Top Bar */}
                  <div className="sr-step-top-row">
                    <span className="sr-step-number">{step.number}</span>
                    <span className="sr-step-badge">{step.badge}</span>
                  </div>

                  {/* Icon Circle */}
                  <div className="sr-step-icon-circle">
                    <Icon size={24} color="#47263F" />
                  </div>

                  {/* Content */}
                  <h3 className="sr-step-title">{step.title}</h3>
                  <p className="sr-step-desc">{step.description}</p>

                  {/* Micro checklist */}
                  <ul className="sr-step-checklist">
                    {step.detailItems.map((item, i) => (
                      <li key={i}>
                        <span className="checklist-bullet">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Action Prompt */}
        <div className="sr-how-cta-strip">
          <div className="cta-strip-text">
            <h4>Ready to test the route planning workflow?</h4>
            <p>Try searching any Delhi route with live road calculations.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("planner")}
            className="sr-btn-primary"
          >
            <span>Open Route Planner</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
