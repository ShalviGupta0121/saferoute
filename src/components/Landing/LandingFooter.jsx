import SafeRouteLogo from "../Brand/SafeRouteLogo";
import { PhoneCall, ShieldAlert, Heart, ExternalLink, AlertTriangle } from "lucide-react";
import {
  EMERGENCY_HELPLINES,
  TRANSIT_ASSISTANCE,
  EMERGENCY_DISCLAIMER
} from "../../data/emergencyHelplines";

export default function LandingFooter({ onNavigate }) {
  const scrollToSection = (id) => {
    onNavigate("landing");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="sr-landing-footer-root" aria-label="SafeRoute Platform Footer">
      <div className="sr-footer-container">
        {/* Top Grid */}
        <div className="sr-footer-grid">
          {/* Brand & Purpose Column */}
          <div className="sr-footer-brand-col">
            <SafeRouteLogo variant="dark" size={38} showTagline={true} />
            <p className="sr-footer-about">
              SafeRoute is a women's safety navigation and civic awareness initiative providing route context, verified macroscopic crime statistics, and community infrastructure observations across Delhi NCR.
            </p>
            <div className="sr-footer-disclaimer-pill">
              <ShieldAlert size={14} color="#FFB3D1" />
              <span>{EMERGENCY_DISCLAIMER}</span>
            </div>
          </div>

          {/* Navigation Links Column - The 4 Primary Public Destinations */}
          <div className="sr-footer-links-col">
            <h4 className="footer-col-title">Primary Destinations</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => onNavigate("landing")}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("planner")}>
                  Plan Your Journey
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("reports")}>
                  Community Reports
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("insights")}>
                  Safety Insights
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("how-it-works")}>
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Features & Methodology Column */}
          <div className="sr-footer-links-col">
            <h4 className="footer-col-title">Platform & Privacy</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => onNavigate("planner")}>
                  Smart Road Routing
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("reports")}>
                  Lighting & Infrastructure Notices
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("insights")}>
                  NCRB 4-Year Crime Statistics
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("privacy")}>
                  Data Ethics & Privacy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("reports")}>
                  Anonymous Safety Reporting
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Official Emergency Helplines Column */}
          <div className="sr-footer-helplines-col" id="helplines">
            <div className="helplines-header-row">
              <h4 className="footer-col-title" style={{ margin: 0 }}>Delhi Official Helplines</h4>
              <span className="official-verified-tag">OFFICIAL SOURCES</span>
            </div>

            <p className="helpline-col-sub">
              Tap any number below to dial directly. In immediate danger, call <strong>112</strong> immediately.
            </p>

            <div className="helplines-mini-stack">
              {/* Emergency Response Numbers */}
              {EMERGENCY_HELPLINES.map((item) => (
                <a
                  key={item.id}
                  href={item.telLink}
                  className={`helpline-entry ${item.isPrimary ? "primary-emergency" : ""}`}
                  aria-label={`Dial ${item.category}: ${item.number}`}
                >
                  <div className="helpline-icon-wrap">
                    <PhoneCall size={14} color={item.isPrimary ? "#FFFFFF" : "#FF8BB7"} />
                  </div>
                  <div className="helpline-meta">
                    <div className="meta-top">
                      <strong className="helpline-num">{item.number}</strong>
                      {item.isPrimary && <span className="primary-pill">POLICE EMERGENCY (ERSS)</span>}
                    </div>
                    <span className="helpline-cat">{item.category}</span>
                    <span className="helpline-auth">{item.authority}</span>
                  </div>
                </a>
              ))}

              {/* DMRC Transit Assistance (Explicitly Separated with Tariff Note) */}
              <div className="dmrc-assistance-card">
                <a
                  href={TRANSIT_ASSISTANCE.telLink}
                  className="helpline-entry transit-entry"
                  aria-label={`Dial ${TRANSIT_ASSISTANCE.label}: ${TRANSIT_ASSISTANCE.number}`}
                >
                  <div className="helpline-icon-wrap transit">
                    <PhoneCall size={14} color="#60A5FA" />
                  </div>
                  <div className="helpline-meta">
                    <div className="meta-top">
                      <strong className="helpline-num">{TRANSIT_ASSISTANCE.number}</strong>
                      <span className="transit-pill">METRO TRANSIT ONLY</span>
                    </div>
                    <span className="helpline-cat">{TRANSIT_ASSISTANCE.label}</span>
                    <span className="helpline-tariff-note">{TRANSIT_ASSISTANCE.tariffNote}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Official Source References */}
            <div className="helpline-source-links">
              <a
                href="https://www.delhipolice.gov.in/telephone-directory.html"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span>Delhi Police Directory</span>
                <ExternalLink size={10} />
              </a>
              <span className="source-divider">•</span>
              <a
                href="https://wcd.delhi.gov.in/wcd/helplines-women-distress-delhi"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span>Delhi WCD 181</span>
                <ExternalLink size={10} />
              </a>
              <span className="source-divider">•</span>
              <a
                href="https://delhimetrorail.com/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span>DMRC Contact</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Notice: Explicit Ethical Disclaimer */}
        <div className="sr-footer-safety-notice-bar">
          <AlertTriangle size={15} color="#FFD6A5" style={{ flexShrink: 0 }} />
          <span>
            <strong>Emergency & Safety Disclaimer:</strong> SafeRoute is an informational and awareness platform, not an emergency-response service. Route calculation, crime statistics, and community notices have inherent limitations and do not guarantee personal safety. In an active emergency or immediate risk, contact official emergency services (112 / 1091) directly.
          </span>
        </div>

        {/* Bottom Bar: Ethics, Privacy & Copyright */}
        <div className="sr-footer-bottom-bar">
          <div className="footer-copy-text">
            <span>© 2026 SafeRoute Initiative. Built for safer, stronger communities.</span>
          </div>

          <div className="footer-policy-row">
            <span>Transparent Data Policy</span>
            <span className="dot-divider">•</span>
            <span>No Background Tracking</span>
            <span className="dot-divider">•</span>
            <span>Open Civic Technology</span>
          </div>

          <div className="footer-made-with">
            <span>Built with care for women commuters</span>
            <Heart size={13} color="#FF8BB7" fill="#FF8BB7" />
          </div>
        </div>
      </div>
    </footer>
  );
}
