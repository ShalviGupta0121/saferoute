/**
 * SafeRoute Logo Component
 * Bespoke brand mark combining:
 * 1. An elegant location pin silhouette with protective shield contours.
 * 2. A graceful upward-sweeping route/pathway through the core.
 * 3. A 4-point central guidance star / directional spark at the apex focal point.
 * 
 * Supports variants: 'primary' (full lockup), 'compact', 'symbol', 'dark' (on plum/dark backgrounds)
 */

export function SafeRouteSymbol({ size = 38, isDark = false, className = "" }) {
  const primaryPlum = isDark ? "#FFFFFF" : "#47263F";
  const accentRose = isDark ? "#FF8BB7" : "#DF5790";
  const softBlush = isDark ? "rgba(255, 255, 255, 0.15)" : "#F4DDE5";
  const sparkGold = isDark ? "#FFD6A5" : "#E5A12B";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`saferoute-symbol ${className}`}
      aria-label="SafeRoute Brand Symbol"
    >
      <defs>
        {/* Soft radial backdrop glow */}
        <radialGradient id={`srGlow-${isDark ? "d" : "l"}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accentRose} stopOpacity={isDark ? "0.35" : "0.18"} />
          <stop offset="100%" stopColor={accentRose} stopOpacity="0" />
        </radialGradient>

        {/* Shield / Pin gradient */}
        <linearGradient id={`srPinGrad-${isDark ? "d" : "l"}`} x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#68435F" : "#47263F"} />
          <stop offset="60%" stopColor={isDark ? "#47263F" : "#311428"} />
          <stop offset="100%" stopColor={isDark ? "#2A0F22" : "#220A1A"} />
        </linearGradient>

        {/* Protective border stroke */}
        <linearGradient id={`srBorderGrad-${isDark ? "d" : "l"}`} x1="8" y1="2" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentRose} />
          <stop offset="50%" stopColor={isDark ? "#FFB3D1" : "#E9BFCF"} />
          <stop offset="100%" stopColor={accentRose} />
        </linearGradient>

        {/* Path ribbon gradient */}
        <linearGradient id={`srPathGrad-${isDark ? "d" : "l"}`} x1="24" y1="40" x2="24" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#DF5790" : "#C83C77"} stopOpacity="0.2" />
          <stop offset="60%" stopColor={accentRose} />
          <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#FFE5EE"} />
        </linearGradient>
      </defs>

      {/* Background aura */}
      <circle cx="24" cy="22" r="21" fill={`url(#srGlow-${isDark ? "d" : "l"})`} />

      {/* Main Outer Shield-Pin Form */}
      {/* Smooth continuous contour: curved shield top curving into a location pin anchor tip */}
      <path
        d="M24 3.5C14.335 3.5 6.5 11.335 6.5 21C6.5 28.5 12.8 35.5 22.2 43.6C23.25 44.5 24.75 44.5 25.8 43.6C35.2 35.5 41.5 28.5 41.5 21C41.5 11.335 33.665 3.5 24 3.5Z"
        fill={`url(#srPinGrad-${isDark ? "d" : "l"})`}
        stroke={`url(#srBorderGrad-${isDark ? "d" : "l"})`}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Subtle Inner Protective Arch */}
      <path
        d="M24 8.5C16.82 8.5 11 14.32 11 21.5C11 27.2 15.6 32.8 24 39.8C32.4 32.8 37 27.2 37 21.5C37 14.32 31.18 8.5 24 8.5Z"
        fill="none"
        stroke={softBlush}
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeOpacity={isDark ? "0.4" : "0.5"}
      />

      {/* Dynamic Route / Pathway: sweeps upward through the shield core */}
      <path
        d="M24 38C20 33 16.5 28 17.5 23C18.5 18 22 17 24 17C26 17 29.5 18 30.5 23C31.5 28 28 33 24 38Z"
        fill="none"
        stroke={`url(#srPathGrad-${isDark ? "d" : "l"})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Route Guide Curve */}
      <path
        d="M21 34C20 30 20 25 24 21C27 18 27 15 24 13"
        fill="none"
        stroke={accentRose}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Central Guidance Spark / 4-Point Star of Direction */}
      <g transform="translate(24, 18)">
        <path
          d="M0 -4.5C0.3 -1.5 1.5 -0.3 4.5 0C1.5 0.3 0.3 1.5 0 4.5C-0.3 1.5 -1.5 0.3 -4.5 0C-1.5 -0.3 -0.3 -1.5 0 -4.5Z"
          fill={sparkGold}
        />
        <circle cx="0" cy="0" r="1.1" fill={primaryPlum} />
      </g>
    </svg>
  );
}

export default function SafeRouteLogo({
  variant = "primary", // 'primary' | 'compact' | 'symbol' | 'dark'
  size = 38,
  showTagline = true,
  className = "",
  onClick = null
}) {
  const isDark = variant === "dark";

  if (variant === "symbol") {
    return (
      <div
        className={`saferoute-logo-container symbol-only ${className}`}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default", display: "inline-flex", alignItems: "center" }}
      >
        <SafeRouteSymbol size={size} isDark={isDark} />
      </div>
    );
  }

  const textColor = isDark ? "#FFFFFF" : "#381E32";
  const accentColor = isDark ? "#FF8BB7" : "#DF5790";
  const taglineColor = isDark ? "rgba(255, 255, 255, 0.7)" : "#746B73";

  return (
    <div
      className={`saferoute-brand-lockup ${variant} ${className}`}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none"
      }}
    >
      <SafeRouteSymbol size={size} isDark={isDark} />

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: `${Math.round(size * 0.58)}px`,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: textColor
            }}
          >
            Safe
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              fontSize: `${Math.round(size * 0.58)}px`,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: accentColor
            }}
          >
            Route
          </span>
        </div>

        {showTagline && variant !== "compact" && (
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              fontSize: `${Math.max(10, Math.round(size * 0.26))}px`,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: taglineColor,
              marginTop: "4px"
            }}
          >
            Smarter, Safer Journeys
          </span>
        )}
      </div>
    </div>
  );
}
