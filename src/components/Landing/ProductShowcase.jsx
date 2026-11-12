import { useState } from "react";
import {
  Navigation,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";

export default function ProductShowcase({ onNavigate, onPrefillRoute }) {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const showcaseRoutes = [
    {
      id: 1,
      name: "Route 1: Via Outer Ring Road & NH 44",
      distance: "28.4 km",
      duration: "48 min",
      color: "#16a36a",
      corridorType: "High Commercial Activity",
      lightingNote: "Continuous streetlighting across 92% of corridor",
      alternativeTag: "FASTEST & MOST ACTIVE"
    },
    {
      id: 2,
      name: "Route 2: Via Mahatma Gandhi Marg (Ring Rd)",
      distance: "31.2 km",
      duration: "54 min",
      color: "#e5a12b",
      corridorType: "Moderate Transit Density",
      lightingNote: "Standard municipal lighting with 2 metro flyovers",
      alternativeTag: "ALTERNATIVE CORRIDOR"
    },
    {
      id: 3,
      name: "Route 3: Via Lala Lajpat Rai Path & Ridge",
      distance: "33.8 km",
      duration: "59 min",
      color: "#df5790",
      corridorType: "Lower Footfall Stretch",
      lightingNote: "Reduced pedestrian activity along ridge sector",
      alternativeTag: "LONGER ROUTE"
    }
  ];

  const currentRoute = showcaseRoutes[selectedRouteIndex];

  const handleLaunchPlanner = () => {
    onPrefillRoute("Saket District Centre, Delhi", "Sector 14, Rohini, Delhi");
    onNavigate("planner");
  };

  return (
    <section className="sr-showcase-section" aria-labelledby="showcase-heading">
      <div className="sr-showcase-container">
        {/* Header */}
        <div className="sr-section-header-centered">
          <span className="sr-section-eyebrow">REAL PRODUCT EXPERIENCE</span>
          <h2 id="showcase-heading" className="sr-section-heading">
            Navigating with SafeRoute
          </h2>
          <p className="sr-section-subtext">
            Experience our interactive road routing engine. Explore alternative driving geometries, distance, duration, and safety context across Delhi NCR.
          </p>
        </div>

        {/* Product UI Window Shell */}
        <div className="sr-product-window-card">
          {/* Window Chrome Titlebar */}
          <div className="sr-window-chrome">
            <div className="chrome-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="chrome-title">
              <Navigation size={13} color="#df5790" />
              <span>SafeRoute Navigation Console — Sample Journey (Illustrative Route Preview)</span>
            </div>
            <div className="chrome-status-tag">
              <span className="live-dot" />
              <span>Sample Demonstration</span>
            </div>
          </div>

          {/* Window Inner Grid: Control Sidebar + Map View */}
          <div className="sr-window-inner-grid">
            {/* Left Controls Column */}
            <div className="sr-window-controls-col">
              {/* Journey Input Simulation */}
              <div className="sr-showcase-inputs">
                <div className="showcase-input-item">
                  <div className="input-icon-dot origin-dot">A</div>
                  <div className="input-text-wrap">
                    <span className="input-label">Origin</span>
                    <span className="input-val">Saket District Centre, Delhi</span>
                  </div>
                </div>

                <div className="input-connecting-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="showcase-input-item">
                  <div className="input-icon-dot dest-dot">B</div>
                  <div className="input-text-wrap">
                    <span className="input-label">Destination</span>
                    <span className="input-val">Sector 14, Rohini, Delhi</span>
                  </div>
                </div>
              </div>

              {/* Route Alternatives Selector */}
              <div className="sr-route-alternatives-list">
                <div className="alt-list-header">
                  <span className="alt-title">Available Drivable Alternatives</span>
                  <span className="alt-count-pill">{showcaseRoutes.length} Found</span>
                </div>

                {showcaseRoutes.map((route, idx) => {
                  const isSelected = selectedRouteIndex === idx;
                  return (
                    <div
                      key={route.id}
                      className={`sr-route-alt-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedRouteIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedRouteIndex(idx)}
                    >
                      <div className="alt-card-header">
                        <span className="alt-name" style={{ color: isSelected ? route.color : "#47263F" }}>
                          {route.name}
                        </span>
                        {isSelected && (
                          <span className="selected-check">
                            <Check size={14} color={route.color} />
                          </span>
                        )}
                      </div>

                      <div className="alt-metrics-row">
                        <span className="alt-distance"><strong>{route.distance}</strong></span>
                        <span className="alt-divider">•</span>
                        <span className="alt-duration"><strong>{route.duration}</strong></span>
                        <span className="alt-tag-chip" style={{ borderColor: isSelected ? route.color : "#EDE4E9" }}>
                          {route.alternativeTag}
                        </span>
                      </div>

                      <p className="alt-corridor-desc">
                        {route.lightingNote}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Direct Launch Button */}
              <div className="sr-showcase-action-box">
                <button
                  type="button"
                  onClick={handleLaunchPlanner}
                  className="sr-btn-launch-planner"
                >
                  <Sparkles size={16} />
                  <span>Launch in Interactive Map View</span>
                  <ArrowRight size={15} />
                </button>
                <small className="showcase-disclaimer">
                  Demonstration preview. Opens full OSRM road planner with live OpenStreetMap calculations.
                </small>
              </div>
            </div>

            {/* Right Map Canvas Simulation */}
            <div className="sr-window-map-col">
              <div className="sr-showcase-map-frame">
                {/* Vector map representation of selected alternative */}
                <svg
                  viewBox="0 0 520 440"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="showcase-map-svg"
                >
                  {/* Background grid */}
                  <rect width="520" height="440" fill="#FBF7FA" rx="12" />
                  
                  {/* Road Grid Background */}
                  <g opacity="0.45" stroke="#E6DCE2" strokeWidth="1">
                    <line x1="0" y1="80" x2="520" y2="80" />
                    <line x1="0" y1="160" x2="520" y2="160" />
                    <line x1="0" y1="240" x2="520" y2="240" />
                    <line x1="0" y1="320" x2="520" y2="320" />
                    <line x1="0" y1="400" x2="520" y2="400" />
                    <line x1="100" y1="0" x2="100" y2="440" />
                    <line x1="200" y1="0" x2="200" y2="440" />
                    <line x1="300" y1="0" x2="300" y2="440" />
                    <line x1="400" y1="0" x2="400" y2="440" />
                  </g>

                  {/* Major Delhi Arterials */}
                  <path d="M50 400 Q200 350 260 220 T460 70" stroke="#EDE4E9" strokeWidth="12" strokeLinecap="round" />
                  <path d="M50 400 Q200 350 260 220 T460 70" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

                  <path d="M80 80 Q240 180 320 280 T480 380" stroke="#EDE4E9" strokeWidth="10" strokeLinecap="round" />
                  <path d="M80 80 Q240 180 320 280 T480 380" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />

                  {/* Route 1 Path */}
                  <path
                    d="M110 370 C160 330 200 280 270 230 C340 180 390 130 420 80"
                    fill="none"
                    stroke="#16a36a"
                    strokeWidth={selectedRouteIndex === 0 ? "7" : "3"}
                    strokeOpacity={selectedRouteIndex === 0 ? "1" : "0.35"}
                    strokeLinecap="round"
                    strokeDasharray={selectedRouteIndex === 0 ? "none" : "6 4"}
                  />

                  {/* Route 2 Path */}
                  <path
                    d="M110 370 C140 300 180 210 290 180 C360 160 390 110 420 80"
                    fill="none"
                    stroke="#e5a12b"
                    strokeWidth={selectedRouteIndex === 1 ? "7" : "3"}
                    strokeOpacity={selectedRouteIndex === 1 ? "1" : "0.35"}
                    strokeLinecap="round"
                    strokeDasharray={selectedRouteIndex === 1 ? "none" : "6 4"}
                  />

                  {/* Route 3 Path */}
                  <path
                    d="M110 370 C220 380 320 310 340 220 C360 150 380 120 420 80"
                    fill="none"
                    stroke="#df5790"
                    strokeWidth={selectedRouteIndex === 2 ? "7" : "3"}
                    strokeOpacity={selectedRouteIndex === 2 ? "1" : "0.35"}
                    strokeLinecap="round"
                    strokeDasharray={selectedRouteIndex === 2 ? "none" : "6 4"}
                  />

                  {/* Origin Pin (Saket) */}
                  <g transform="translate(110, 370)">
                    <circle cx="0" cy="0" r="14" fill="#47263F" fillOpacity="0.2" />
                    <circle cx="0" cy="0" r="9" fill="#47263F" />
                    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                    <rect x="-42" y="-34" width="84" height="22" rx="11" fill="#47263F" />
                    <text x="0" y="-20" fill="#FFFFFF" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
                      Saket (Origin)
                    </text>
                  </g>

                  {/* Destination Pin (Rohini) */}
                  <g transform="translate(420, 80)">
                    <circle cx="0" cy="0" r="15" fill="#527B65" fillOpacity="0.2" />
                    <circle cx="0" cy="0" r="9.5" fill="#527B65" />
                    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                    <rect x="-45" y="-34" width="90" height="22" rx="11" fill="#527B65" />
                    <text x="0" y="-20" fill="#FFFFFF" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" textAnchor="middle">
                      Rohini (Dest)
                    </text>
                  </g>
                </svg>

                {/* Overlaid Active Route Details Overlay */}
                <div className="sr-active-route-badge-box">
                  <div className="badge-header">
                    <span className="badge-dot" style={{ background: currentRoute.color }} />
                    <span className="badge-name">{currentRoute.name}</span>
                  </div>
                  <div className="badge-stats">
                    <span className="stat-dist"><strong>{currentRoute.distance}</strong></span>
                    <span className="stat-time"><Clock size={12} /> {currentRoute.duration}</span>
                  </div>
                  <div className="badge-lighting">
                    <ShieldCheck size={13} color="#16a36a" />
                    <span>{currentRoute.corridorType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
