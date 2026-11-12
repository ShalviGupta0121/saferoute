import { useState } from "react";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Navigation2,
  Sparkles,
  Clock,
  Compass,
  AlertCircle
} from "lucide-react";

export default function HeroSection({ onNavigate, onPrefillRoute }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (source.trim() && destination.trim()) {
      onPrefillRoute(source.trim(), destination.trim());
      onNavigate("planner");
    } else {
      onNavigate("planner");
    }
  };

  const handleQuickPreset = (src, dest) => {
    onPrefillRoute(src, dest);
    onNavigate("planner");
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="sr-hero-section" aria-labelledby="hero-main-heading">
      <div className="sr-hero-container">
        {/* Left Column: Editorial Headline, Mission & Quick Search */}
        <div className="sr-hero-text-col">
          {/* Eyebrow badge */}
          <div className="sr-hero-eyebrow">
            <span className="sr-eyebrow-dot" />
            <span className="sr-eyebrow-text">WOMEN’S SAFETY • SMARTER MOBILITY</span>
          </div>

          {/* Main Headline */}
          <h1 id="hero-main-heading" className="sr-hero-headline">
            Every journey deserves a{" "}
            <span className="sr-headline-highlight">greater sense of safety.</span>
          </h1>

          {/* Supporting Narrative */}
          <p className="sr-hero-subtext">
            SafeRoute brings together intelligent route planning, safety awareness and community-powered insights to help people make more informed travel decisions.
          </p>

          {/* Journey Planning Input Box */}
          <div className="sr-hero-plan-box">
            <form onSubmit={handleSearch} className="sr-plan-form">
              <div className="sr-plan-inputs-grid">
                <div className="sr-input-field">
                  <div className="sr-input-icon-pin start-pin">
                    <span className="pin-letter">A</span>
                  </div>
                  <div className="sr-input-content">
                    <label htmlFor="hero-start-input">Starting Point</label>
                    <input
                      id="hero-start-input"
                      type="text"
                      placeholder="e.g. Connaught Place, New Delhi"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="sr-input-divider-line" />

                <div className="sr-input-field">
                  <div className="sr-input-icon-pin dest-pin">
                    <span className="pin-letter">B</span>
                  </div>
                  <div className="sr-input-content">
                    <label htmlFor="hero-dest-input">Destination</label>
                    <input
                      id="hero-dest-input"
                      type="text"
                      placeholder="e.g. Hauz Khas Village, New Delhi"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className="sr-plan-actions-row">
                <button type="submit" className="sr-btn-primary-hero">
                  <span>Plan Your Journey</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={scrollToHowItWorks}
                  className="sr-btn-secondary-hero"
                >
                  Explore SafeRoute
                </button>
              </div>
            </form>

            {/* Quick Demonstration Scenario Shortcut */}
            <div className="sr-quick-scenario-strip">
              <span className="scenario-label">Try evaluation scenario:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset("Saket, Delhi", "Rohini, Delhi")}
                className="scenario-pill-btn"
                title="Load Saket to Rohini evaluation route"
              >
                <Sparkles size={12} color="#DF5790" />
                <span>Saket → Rohini (Alternative Routes)</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="sr-hero-trust-row">
            <div className="trust-item">
              <ShieldCheck size={16} color="#527B65" />
              <span>Verified Official Crime Data</span>
            </div>
            <div className="trust-item">
              <Navigation2 size={15} color="#DF5790" />
              <span>Real OSRM Road Geometry</span>
            </div>
            <div className="trust-item">
              <Compass size={15} color="#68435F" />
              <span>Zero Location Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stylised Delhi Navigation Map Composition */}
        <div className="sr-hero-visual-col" aria-hidden="true">
          <div className="sr-map-composition-card">
            {/* Visual Canvas: Stylised Delhi Urban Transit Map */}
            <div className="sr-delhi-vector-map">
              <svg
                viewBox="0 0 600 520"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sr-vector-canvas"
              >
                <defs>
                  {/* Subtle map grid pattern */}
                  <pattern id="delhiGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F4ECF1" strokeWidth="0.8" />
                  </pattern>

                  {/* Gradient for illuminated safe route */}
                  <linearGradient id="routePinkGlow" x1="120" y1="100" x2="480" y2="420" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#DF5790" />
                    <stop offset="50%" stopColor="#E04683" />
                    <stop offset="100%" stopColor="#C83C77" />
                  </linearGradient>

                  {/* Gradient for alternative route */}
                  <linearGradient id="routeAltGlow" x1="120" y1="100" x2="480" y2="420" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D9822B" />
                    <stop offset="100%" stopColor="#B47C42" />
                  </linearGradient>

                  {/* Filter for route glow effect */}
                  <filter id="routeGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Base Map Canvas Fill */}
                <rect width="600" height="520" fill="#FAF6F8" rx="20" />
                <rect width="600" height="520" fill="url(#delhiGrid)" rx="20" />

                {/* Urban Parks & Green Corridors */}
                {/* Central Ridge / Lodi Gardens shape */}
                <path
                  d="M160 210C180 195 240 200 250 250C260 290 220 330 180 340C140 350 120 310 130 260C140 225 150 220 160 210Z"
                  fill="#EAF3EE"
                  stroke="#D3E5DA"
                  strokeWidth="1.2"
                />
                <text x="165" y="275" fill="#6B967D" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" letterSpacing="0.04em">
                  Lodi Forest & Gardens
                </text>

                {/* Yamuna River Curve in eastern Delhi */}
                <path
                  d="M520 0C515 80 540 180 525 280C510 370 545 460 550 520"
                  fill="none"
                  stroke="#E0EDF8"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                <path
                  d="M520 0C515 80 540 180 525 280C510 370 545 460 550 520"
                  fill="none"
                  stroke="#BDD9EE"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <text x="500" y="160" fill="#7EA5C4" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" transform="rotate(78 500 160)">
                  Yamuna River Basin
                </text>

                {/* Delhi Major Road Network (Base Greys) */}
                {/* Ring Road Arc */}
                <path
                  d="M70 380C140 390 280 430 420 390C490 370 530 330 570 310"
                  stroke="#EADBCE"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M70 380C140 390 280 430 420 390C490 370 530 330 570 310"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Inner Ring / Radial Arterials */}
                <path d="M120 60 L480 460" stroke="#EADBCE" strokeWidth="6" strokeLinecap="round" />
                <path d="M120 60 L480 460" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

                <path d="M500 80 L100 440" stroke="#EADBCE" strokeWidth="6" strokeLinecap="round" />
                <path d="M500 80 L100 440" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

                <path d="M300 30 L300 490" stroke="#EADBCE" strokeWidth="6" strokeLinecap="round" />
                <path d="M300 30 L300 490" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

                <path d="M30 240 L570 240" stroke="#EADBCE" strokeWidth="6" strokeLinecap="round" />
                <path d="M30 240 L570 240" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

                {/* Connaught Place Concentric Rings */}
                <circle cx="210" cy="130" r="42" fill="none" stroke="#EADBCE" strokeWidth="5" />
                <circle cx="210" cy="130" r="42" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="210" cy="130" r="22" fill="#FAF0F4" stroke="#DF5790" strokeWidth="1.5" />
                <circle cx="210" cy="130" r="6" fill="#DF5790" />
                <text x="222" y="115" fill="#47263F" fontSize="11" fontFamily="'Playfair Display', serif" fontWeight="700">
                  Connaught Place (CP)
                </text>

                {/* India Gate Circle Landmark */}
                <circle cx="360" cy="220" r="30" fill="none" stroke="#EADBCE" strokeWidth="4" />
                <circle cx="360" cy="220" r="14" fill="#FFF2F7" stroke="#68435F" strokeWidth="1.2" />
                <text x="375" y="215" fill="#68435F" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">
                  India Gate Hexagon
                </text>

                {/* Hauz Khas / South Delhi Node */}
                <circle cx="430" cy="400" r="26" fill="none" stroke="#EADBCE" strokeWidth="4" />
                <circle cx="430" cy="400" r="10" fill="#EAF3EE" stroke="#527B65" strokeWidth="1.5" />
                <text x="360" y="440" fill="#47263F" fontSize="11" fontFamily="'Playfair Display', serif" fontWeight="700">
                  Hauz Khas / Aurobindo Marg
                </text>

                {/* ALTERNATIVE ROUTE (Route 2 — Secondary Corridor) */}
                <path
                  d="M210 130 C270 120 330 160 360 220 C380 260 380 320 430 400"
                  fill="none"
                  stroke="url(#routeAltGlow)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />

                {/* PRIMARY RECOMMENDED SAFEROUTE PATH (Route 1 — Illuminated Corridors) */}
                <path
                  d="M210 130 C190 190 220 270 290 320 C350 360 390 360 430 400"
                  fill="none"
                  stroke="url(#routePinkGlow)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#routeGlowFilter)"
                />
                <path
                  d="M210 130 C190 190 220 270 290 320 C350 360 390 360 430 400"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                />

                {/* Origin Pin A (Connaught Place) */}
                <g transform="translate(210, 130)">
                  <circle cx="0" cy="0" r="16" fill="#DF5790" fillOpacity="0.25" />
                  <circle cx="0" cy="0" r="10" fill="#47263F" />
                  <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  <rect x="-35" y="-36" width="70" height="22" rx="11" fill="#47263F" />
                  <text x="0" y="-22" fill="#FFFFFF" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
                    START (A)
                  </text>
                </g>

                {/* Destination Pin B (Hauz Khas) */}
                <g transform="translate(430, 400)">
                  <circle cx="0" cy="0" r="18" fill="#527B65" fillOpacity="0.25" />
                  <circle cx="0" cy="0" r="11" fill="#527B65" />
                  <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
                  <rect x="-38" y="-38" width="76" height="22" rx="11" fill="#527B65" />
                  <text x="0" y="-24" fill="#FFFFFF" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
                    DEST (B)
                  </text>
                </g>
              </svg>

              {/* Floating Route Info HUD Card */}
              <div className="sr-hero-floating-card">
                <div className="floating-card-header">
                  <div className="route-status-indicator">
                    <span className="live-pulse-dot" />
                    <span className="route-tag">SAMPLE ROUTE (COMMERCIAL CORRIDOR)</span>
                  </div>
                  <span className="engine-badge">OSRM Preview</span>
                </div>

                <div className="floating-card-title">
                  <h4>Connaught Place → Hauz Khas</h4>
                  <p className="route-via-text">Via Janpath & Lodi Active Corridor</p>
                </div>

                <div className="floating-metrics-row">
                  <div className="metric-pill">
                    <Clock size={13} color="#68435F" />
                    <span><strong>28 min</strong> (14.2 km)</span>
                  </div>
                  <div className="metric-pill highlighted">
                    <span className="lighting-icon">💡</span>
                    <span>High Street Lighting Context</span>
                  </div>
                </div>

                <div className="floating-card-footer">
                  <div className="foot-note">
                    <AlertCircle size={12} color="#8A8292" />
                    <span>Sample Journey — Demonstration preview. Connects to live OSRM in Planner.</span>
                  </div>
                  <span className="alt-count">+1 Alternative Available</span>
                </div>
              </div>

              {/* Secondary Floating Safety Observation Bubble */}
              <div className="sr-hero-comm-bubble">
                <div className="bubble-icon">
                  <MapPin size={13} color="#DF5790" />
                </div>
                <div className="bubble-content">
                  <span className="bubble-title">Community Advisory</span>
                  <span className="bubble-desc">Well-lit pedestrian sidewalks active until 11 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
