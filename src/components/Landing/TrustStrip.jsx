import { Navigation, Users2, BarChart2 } from "lucide-react";

export default function TrustStrip() {
  const pillars = [
    {
      icon: Navigation,
      title: "Smarter Route Planning",
      description: "Explore multiple drivable road alternatives across Delhi NCR with distance, duration and geometry calculated via OpenStreetMap and OSRM."
    },
    {
      icon: Users2,
      title: "Community-Powered Awareness",
      description: "Commuters contribute unverified observations on dark stretches, malfunctioning streetlights and infrastructure hazards to alert others."
    },
    {
      icon: BarChart2,
      title: "Data-Informed Insights",
      description: "Official, documented statistics from NCRB publications and Ministry of Home Affairs reports, presented transparently without sensationalism."
    }
  ];

  return (
    <section className="sr-trust-strip" aria-label="SafeRoute Core Approach">
      <div className="sr-trust-container">
        <div className="sr-trust-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="sr-trust-card">
                <div className="sr-trust-icon-box">
                  <Icon size={20} color="#47263F" />
                </div>
                <div className="sr-trust-content">
                  <h3 className="sr-trust-title">{pillar.title}</h3>
                  <p className="sr-trust-desc">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
