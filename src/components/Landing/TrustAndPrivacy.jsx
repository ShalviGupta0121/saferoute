import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function TrustAndPrivacy() {
  const points = [
    {
      icon: EyeOff,
      title: "Zero Account or Identity Required",
      desc: "SafeRoute does not require an account, name, email address, or phone number to submit hazard reports or calculate safe routes. You can participate in civic awareness with complete anonymity."
    },
    {
      icon: Lock,
      title: "Data Minimization & Sanitized Feeds",
      desc: "Submissions flow through a dedicated PostgreSQL SECURITY DEFINER function. Public feeds display only sanitized locality notices—exact personal coordinates and identities are never collected or published."
    },
    {
      icon: ShieldCheck,
      title: "No Background Tracking",
      desc: "SafeRoute operates without background location trackers or automated device telemetry. Coordinates are captured only if you explicitly choose to tag the location of an observed hazard."
    }
  ];

  return (
    <section className="sr-trust-privacy-section" id="privacy" aria-labelledby="trust-privacy-heading">
      <div className="sr-trust-privacy-container">
        {/* Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">DATA ETHICS & TECHNICAL INTEGRITY</span>
          <h2 id="trust-privacy-heading" className="sr-section-heading">
            Engineered for Privacy & Transparency
          </h2>
          <p className="sr-section-subtext">
            We reject surveillance models and dark patterns. SafeRoute enforces strict privacy-by-default architecture to protect commuters and ensure transparent, data-minimized civic participation.
          </p>
        </div>

        {/* 3 Reassurance Cards */}
        <div className="sr-trust-privacy-grid">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="sr-trust-card">
                <div className="sr-trust-icon-box">
                  <Icon size={22} color="#DF5790" />
                </div>
                <h3 className="sr-trust-card-title">{p.title}</h3>
                <p className="sr-trust-card-desc">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
