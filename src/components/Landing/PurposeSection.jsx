import { Compass, Users, FileCheck2 } from "lucide-react";

export default function PurposeSection() {
  const pillars = [
    {
      icon: Compass,
      title: "Corridor Awareness",
      desc: "Alternative road choices through major arterial corridors rather than isolated shortcuts."
    },
    {
      icon: Users,
      title: "Community Ground Truth",
      desc: "Crowdsourced notices on broken streetlights, poor visibility, and civic infrastructure hazards."
    },
    {
      icon: FileCheck2,
      title: "Empirical Evidence Base",
      desc: "Verified NCRB and Delhi Police datasets providing macroeconomic context without sensationalism."
    }
  ];

  return (
    <section className="sr-purpose-section" id="purpose" aria-labelledby="purpose-heading">
      <div className="sr-purpose-container">
        {/* Section Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">PURPOSE & CIVIC MISSION</span>
          <h2 id="purpose-heading" className="sr-section-heading">
            Empowering informed transit decisions across Delhi NCR
          </h2>
          <p className="sr-section-subtext">
            Everyday navigation apps optimize purely for speed, often directing commuters through unlit or isolated stretches without environmental context. SafeRoute combines route alternatives with verified crime research and community observations so commuters can travel with greater confidence.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="sr-purpose-pillars-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="sr-purpose-pillar-card">
                <div className="sr-purpose-icon-box">
                  <Icon size={22} color="#DF5790" />
                </div>
                <h3 className="sr-purpose-card-title">{pillar.title}</h3>
                <p className="sr-purpose-card-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Dignified Mission Quote */}
        <div className="sr-purpose-mission-banner">
          <div className="mission-quote-sign">“</div>
          <p className="mission-quote-copy">
            Navigation is not simply about reaching a destination faster. It is about the dignity of moving through one’s city freely, confidently, and with complete information.
          </p>
          <div className="mission-quote-attribution">
            <strong>SafeRoute Platform Mission</strong>
            <span>Public-Interest Civic Technology</span>
          </div>
        </div>
      </div>
    </section>
  );
}
