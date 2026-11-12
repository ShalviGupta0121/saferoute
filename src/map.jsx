import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";

// Leaflet default marker icons fix for bundlers
const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FitMapBounds({ routes, startCoords, destCoords }) {
  const map = useMap();

  useEffect(() => {
    const points = [];

    if (startCoords) points.push([startCoords.lat, startCoords.lon]);
    if (destCoords) points.push([destCoords.lat, destCoords.lon]);

    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        if (route.coordinates && route.coordinates.length > 0) {
          route.coordinates.forEach((pt) => {
            points.push([pt[1], pt[0]]);
          });
        }
      });
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [routes, startCoords, destCoords, map]);

  return null;
}

export default function MapView({
  routes = [],
  selectedRouteId = 1,
  onSelectRoute,
  startLocation = null,
  destLocation = null,
  center = [28.6139, 77.209] // Delhi default center
}) {
  return (
    <div className="leaflet-map-wrapper">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="saferoute-leaflet-container"
        style={{ height: "460px", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapBounds
          routes={routes}
          startCoords={startLocation}
          destCoords={destLocation}
        />

        {/* Start Point Marker */}
        {startLocation && (
          <Marker position={[startLocation.lat, startLocation.lon]} icon={startIcon}>
            <Popup>
              <div style={{ textAlign: "left", fontSize: "13px" }}>
                <strong style={{ color: "#16a36a" }}>Starting Point</strong>
                <div>{startLocation.name || "Start Location"}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destLocation && (
          <Marker position={[destLocation.lat, destLocation.lon]} icon={destIcon}>
            <Popup>
              <div style={{ textAlign: "left", fontSize: "13px" }}>
                <strong style={{ color: "#7c3aed" }}>Destination</strong>
                <div>{destLocation.name || "Destination"}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polylines */}
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const positions = route.coordinates.map((pt) => [pt[1], pt[0]]);

          return (
            <Polyline
              key={route.id}
              positions={positions}
              eventHandlers={{
                click: () => onSelectRoute && onSelectRoute(route.id)
              }}
              pathOptions={{
                color: isSelected ? "#df5790" : "#94a3b8",
                weight: isSelected ? 7 : 4,
                opacity: isSelected ? 0.95 : 0.6,
                dashArray: isSelected ? null : "4, 6"
              }}
            >
              <Popup>
                <div style={{ fontSize: "13px" }}>
                  <strong>Route {route.id}</strong> {isSelected ? "(Selected)" : ""}
                  <div>Distance: {route.distanceKm} km</div>
                  <div>Est. Time: {route.durationMin} mins</div>
                  <div style={{ marginTop: "4px", fontSize: "11px", color: "#64748b" }}>
                    Click to select this route
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
}
