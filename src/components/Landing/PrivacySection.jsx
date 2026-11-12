import {
  Lock,
  EyeOff,
  Database,
  ShieldCheck,
  Compass
} from "lucide-react";

export default function PrivacySection() {
  const privacyPoints = [
    {
      icon: EyeOff,
      title: "Zero Account Requirement",
      desc: "Anyone can plan routes and submit public-space safety notices anonymously. We do not require account registration, names, phone numbers, or email addresses for civic participation."
    },
    {
      icon: Database,
      title: "Database Isolation & RPC",
      desc: "Submissions flow through an isolated PostgreSQL SECURITY DEFINER RPC with search_path safety. Direct table insertion is revoked from anonymous clients to prevent data tampering."
    },
    {
      icon: Compass,
      title: "No Background Tracking",
      desc: "SafeRoute does not monitor your device location in the background. Device coordinates are accessed only upon your explicit click when searching a route or tagging an infrastructure concern."
    },
    {
      icon: ShieldCheck,
      title: "Sanitized Public Notices",
      desc: "Public community notices omit personal identifiers: author emails, user IDs, private descriptions, and exact GPS coordinates are excluded from public feeds with day-truncated dates."
    }
  ];

  return (
    <section className="sr-privacy-section" aria-labelledby="privacy-heading">
      <div className="sr-privacy-container">
        {/* Header */}
        <div className="sr-section-header-centered">
          <div className="privacy-badge">
            <Lock size={14} color="#527B65" />
            <span>TRANSPARENT SECURITY</span>
          </div>
          <h2 id="privacy-heading" className="sr-section-heading">
            Your privacy matters as much as your journey.
          </h2>
          <p className="sr-section-subtext">
            We believe in verifiable security. We do not make claims of being completely impenetrable, but we enforce database-level access controls, data minimization, and zero forced identification for every commuter.
          </p>
        </div>

        {/* 4 Technical Guarantees Grid */}
        <div className="sr-privacy-grid">
          {privacyPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="sr-privacy-card">
                <div className="privacy-icon-box">
                  <Icon size={20} color="#527B65" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Architecture & Ethical Commitment Box */}
        <div className="sr-privacy-notice-box">
          <ShieldCheck size={18} color="#47263F" style={{ flexShrink: 0 }} />
          <p>
            <strong>Commitment to Truth in Technology:</strong> SafeRoute does not fabricate crime hotspots, will not claim an unverified road is guaranteed safe, and does not sell or broker commuter movement patterns. All shared notices are explicitly labeled as unverified community observations.
          </p>
        </div>
      </div>
    </section>
  );
}
