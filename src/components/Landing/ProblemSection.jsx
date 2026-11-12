import { Eye, Shield, Compass, Sparkles } from "lucide-react";

export default function ProblemSection() {
  const challenges = [
    {
      icon: Eye,
      heading: "Everyday Transit Uncertainty",
      body: "Navigating unfamiliar stretches after dusk often means making quick decisions without knowing whether a route is well-lit, isolated, or active with foot traffic."
    },
    {
      icon: Compass,
      heading: "Beyond the Shortest Path",
      body: "Standard navigation platforms optimize strictly for the fewest minutes or kilometers, neglecting environmental factors that significantly affect a commuter's sense of security."
    },
    {
      icon: Shield,
      heading: "Informed Decision-Making",
      body: "Having visibility into route alternatives, street lighting conditions, and nearby transit hubs empowers women to choose roads that offer confidence and peace of mind."
    },
    {
      icon: Sparkles,
      heading: "Shared Civic Responsibility",
      body: "Safety cannot rely on algorithms alone. When citizens flag broken streetlights and isolated corridors, the entire community benefits from shared vigilance."
    }
  ];

  return (
    <section className="sr-problem-section" id="about-us" aria-labelledby="problem-heading">
      <div className="sr-problem-container">
        {/* Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">THE CHALLENGE WE ADDRESS</span>
          <h2 id="problem-heading" className="sr-section-heading">
            Safety should be part of every journey.
          </h2>
          <p className="sr-section-subtext">
            For millions of women commuters across Delhi NCR, moving through the city involves subtle mental calculations: Is this road lit? Are transit stations nearby? Can someone see me?
          </p>
        </div>

        {/* Narrative & Insight Grid */}
        <div className="sr-problem-cards-grid">
          {challenges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="sr-problem-card">
                <div className="sr-problem-icon-wrap">
                  <Icon size={20} color="#DF5790" />
                </div>
                <h3 className="sr-problem-card-title">{item.heading}</h3>
                <p className="sr-problem-card-body">{item.body}</p>
              </div>
            );
          })}
        </div>

        {/* Empathetic Editorial Quote Box */}
        <div className="sr-problem-quote-banner">
          <div className="quote-mark">“</div>
          <p className="quote-text">
            Navigation is not simply about reaching a destination faster. It is about the dignity of moving through one’s city freely, confidently, and with complete information.
          </p>
          <div className="quote-author">
            <span className="author-name">SafeRoute Core Mission</span>
            <span className="author-sub">Public-Interest Mobility Initiative</span>
          </div>
        </div>
      </div>
    </section>
  );
}
