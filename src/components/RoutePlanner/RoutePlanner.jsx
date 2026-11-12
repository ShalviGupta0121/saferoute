import { useState } from "react";
import {
  Navigation,
  MapPin,
  Compass,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import MapView from "../../map";

export default function RoutePlanner({ initialSource = "", initialDestination = "" }) {
  const [source, setSource] = useState(initialSource || "Saket, Delhi");
  const [destination, setDestination] = useState(initialDestination || "Rohini, Delhi");

  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null); // 'geocode' | 'routing' | 'network'
  const [errorMessage, setErrorMessage] = useState("");

  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(1);
  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  // Robust geocoding with timeout and error categorization
  async function geocodeLocation(query, label) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    // If query doesn't specify Delhi or India, append context to improve accuracy
    const normalizedQuery =
      query.toLowerCase().includes("delhi") || query.toLowerCase().includes("india")
        ? query
        : `${query}, Delhi, India`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      normalizedQuery
    )}`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Geocoding service rate limit reached. Please wait a few seconds.");
        }
        throw new Error(`Geocoding server error (HTTP ${response.status}).`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          `Unable to find "${query}". Please check the spelling or specify a Delhi landmark.`
        );
      }

      return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        name: data[0].display_name ? data[0].display_name.split(",")[0] : query
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error(`Geocoding request timed out while locating ${label}. Check your internet connection.`, {
          cause: err
        });
      }
      throw err;
    }
  }

  // Fetch real road routes from OSRM
  async function fetchDrivingRoutes(start, end) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start.lon},${start.lat};${end.lon},${end.lat}` +
      `?alternatives=true&overview=full&geometries=geojson&steps=false`;

    try {
      const response = await fetch(osrmUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OSRM routing server responded with status HTTP ${response.status}.`);
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error(
          `No drivable road routes found between ${start.name} and ${end.name}.`
        );
      }

      return data.routes.map((r, index) => {
        const distanceKm = (r.distance / 1000).toFixed(1);
        const durationMin = Math.round(r.duration / 60);
        const roadSummary = r.legs?.[0]?.summary || `Via primary arterial route`;

        return {
          id: index + 1,
          coordinates: r.geometry.coordinates,
          distanceKm,
          durationMin,
          summary: roadSummary,
          isFastest: index === 0
        };
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Routing request timed out. Public OSRM routing servers may be congested.", {
          cause: err
        });
      }
      throw err;
    }
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!source.trim() || !destination.trim()) {
      setErrorType("validation");
      setErrorMessage("Please enter both a starting location and destination.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setErrorType(null);
    setRoutes([]);

    try {
      // 1. Geocode Start Location
      let start;
      try {
        start = await geocodeLocation(source, "starting point");
        setStartCoords(start);
      } catch (err) {
        setErrorType("geocode");
        throw new Error(`Starting location error: ${err.message}`, { cause: err });
      }

      // 2. Geocode Destination
      let dest;
      try {
        dest = await geocodeLocation(destination, "destination");
        setDestCoords(dest);
      } catch (err) {
        setErrorType("geocode");
        throw new Error(`Destination location error: ${err.message}`, { cause: err });
      }

      // 3. Request OSRM driving routes
      let calculatedRoutes;
      try {
        calculatedRoutes = await fetchDrivingRoutes(start, dest);
      } catch (err) {
        setErrorType("routing");
        throw new Error(`Route calculation error: ${err.message}`, { cause: err });
      }

      setRoutes(calculatedRoutes);
      setSelectedRouteId(1);
    } catch (err) {
      setErrorMessage(err.message || "Failed to calculate navigation route.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (src, dest) => {
    setSource(src);
    setDestination(dest);
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="planner-container">
      {/* Header */}
      <div className="planner-header">
        <span className="planner-pill">OSRM ROAD ROUTING ENGINE</span>
        <h1>Smart Route Planning & Navigation</h1>
        <p>
          Compute real drivable road routes, compare distance & travel duration,
          and view public safety context across the Delhi NCR network.
        </p>
      </div>

      {/* Main Layout: Inputs & Map */}
      <div className="planner-layout">
        {/* Left Column: Form & Route Alternatives */}
        <div className="planner-sidebar">
          <div className="planner-card">
            <h3>Plan Your Commute</h3>

            {/* Evaluation Scenario Preset */}
            <div className="scenario-demo-banner">
              <div className="scenario-top">
                <Sparkles size={16} color="#df5790" />
                <strong>Evaluation Scenario 2:</strong>
              </div>
              <p>Demo route between South Delhi and North-West Delhi:</p>
              <button
                type="button"
                className="scenario-btn"
                onClick={() => handlePresetSelect("Saket, Delhi", "Rohini, Delhi")}
              >
                Load: Saket → Rohini, Delhi
              </button>
            </div>

            <form onSubmit={handleSearch} className="route-form">
              <div className="form-group">
                <label>
                  <MapPin size={15} color="#16a36a" /> Starting Point
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saket, Delhi"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={15} color="#7c3aed" /> Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohini, Delhi"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="calculate-routes-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner-row">
                    <span className="spinner" /> Calculating Routes...
                  </span>
                ) : (
                  <>
                    <Navigation size={18} />
                    <span>Calculate Road Routes</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {errorMessage && (
              <div className="planner-error-box">
                <AlertTriangle size={18} />
                <div className="error-copy">
                  <strong>
                    {errorType === "geocode"
                      ? "Geocoding Failed"
                      : errorType === "routing"
                      ? "Routing Service Issue"
                      : "Navigation Notice"}
                  </strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Alternative Routes Cards */}
          {routes.length > 0 && (
            <div className="alternatives-wrapper">
              <div className="alternatives-header">
                <h4>Available Routes ({routes.length} returned)</h4>
                <span className="hint-label">Click any route to select</span>
              </div>

              <div className="alternatives-list">
                {routes.map((r) => {
                  const isSelected = r.id === selectedRouteId;
                  return (
                    <div
                      key={r.id}
                      className={`route-choice-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedRouteId(r.id)}
                    >
                      <div className="choice-top">
                        <div className="choice-title">
                          <span className="route-num-badge">Route {r.id}</span>
                          {r.isFastest && <span className="fastest-pill">Fastest Duration</span>}
                        </div>
                        <span className="choice-duration">{r.durationMin} min</span>
                      </div>

                      <div className="choice-meta">
                        <span>Distance: <strong>{r.distanceKm} km</strong></span>
                        {r.summary && <span className="choice-summary">• {r.summary}</span>}
                      </div>

                      <div className="selection-status">
                        {isSelected ? (
                          <span className="selected-indicator">
                            <CheckCircle2 size={14} /> Active on Map
                          </span>
                        ) : (
                          <span className="unselected-indicator">Select this alternative</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Leaflet Map & Safety Disclaimers */}
        <div className="planner-map-col">
          {/* Important Safety Notice */}
          <div className="route-transparency-banner">
            <AlertTriangle size={18} className="transparency-icon" />
            <div className="transparency-text">
              <strong>Important Safety Distinction:</strong> Verified route-level crime data is not
              currently available. Delhi-wide crime statistics are displayed as contextual information and
              are <strong>not</strong> used to determine the safety of individual roads. Do not assume
              the fastest or shortest route is inherently safest.
            </div>
          </div>

          {/* Interactive Map */}
          <MapView
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            startLocation={startCoords}
            destLocation={destCoords}
            center={startCoords ? [startCoords.lat, startCoords.lon] : [28.6139, 77.209]}
          />

          {/* Selected Route Dynamic Information Card */}
          {routes.length > 0 && selectedRoute && (
            <div className="selected-route-info-card">
              <div className="info-card-header">
                <div className="info-title-group">
                  <Compass size={20} color="#df5790" />
                  <h4>Active Selection: Route {selectedRoute.id}</h4>
                </div>
                <div className="info-metrics-badge">
                  <span>{selectedRoute.distanceKm} km</span>
                  <span className="dot">•</span>
                  <span>Est. {selectedRoute.durationMin} mins driving</span>
                </div>
              </div>

              <div className="commuter-safety-guidance">
                <h5>Commuter Safety Advisory & Precautions:</h5>
                <ul className="safety-bullets">
                  <li>
                    <strong>Arterial Roads:</strong> When traveling between South and North Delhi,
                    prefer illuminated primary corridors (e.g. Ring Road / Outer Ring Road) over unlit interior bypasses.
                  </li>
                  <li>
                    <strong>Live Journey Sharing:</strong> Keep trusted emergency contacts informed of your
                    expected arrival time and active route.
                  </li>
                  <li>
                    <strong>Emergency Helplines:</strong> Police ERSS: <strong>112</strong> | Delhi Women Helpline: <strong>1091</strong> | WCD Women Helpline: <strong>181</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
