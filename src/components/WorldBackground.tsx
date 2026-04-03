"use client";

export function WorldBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Floor tile pattern */}
        <pattern id="floor-tile" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#0a0f1a" />
          <rect x="0" y="0" width="30" height="30" fill="#0c1220" rx="1" />
          <rect x="30" y="30" width="30" height="30" fill="#0c1220" rx="1" />
        </pattern>

        {/* Glow filter */}
        <filter id="glow-soft">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Screen glow */}
        <linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Floor */}
      <rect width="100%" height="100%" fill="url(#floor-tile)" />

      {/* Ambient gradient overlay */}
      <rect width="100%" height="100%" fill="url(#ambient-gradient)" opacity="0.5" />
      <defs>
        <radialGradient id="ambient-gradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06080f" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* === CEO DESK AREA (top center) === */}
      {/* Large desk */}
      <rect x="42%" y="25%" width="16%" height="6%" rx="4" fill="#151d2e" stroke="#1e293b" strokeWidth="1" />
      {/* Monitor */}
      <rect x="47%" y="21%" width="6%" height="5%" rx="2" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <rect x="47.5%" y="21.5%" width="5%" height="3.5%" rx="1" fill="#0c1220" />
      {/* Screen content glow */}
      <rect x="47.8%" y="21.8%" width="4.4%" height="2.8%" rx="1" fill="#34d399" opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Monitor stand */}
      <rect x="49.5%" y="26%" width="1%" height="1.5%" fill="#1e293b" />
      {/* Keyboard */}
      <rect x="48%" y="27.5%" width="4%" height="1.2%" rx="1" fill="#1a2239" stroke="#1e293b" strokeWidth="0.5" />

      {/* Chair */}
      <ellipse cx="50%" cy="34%" rx="3%" ry="1.5%" fill="#1a2239" stroke="#1e293b" strokeWidth="0.5" />

      {/* === LEFT WORKSTATION (Merlin) === */}
      <rect x="13%" y="52%" width="12%" height="5%" rx="3" fill="#151d2e" stroke="#1e293b" strokeWidth="0.8" />
      {/* Books stack */}
      <rect x="14%" y="50%" width="2.5%" height="2%" rx="1" fill="#4ade8015" stroke="#4ade8020" strokeWidth="0.5" />
      <rect x="14.3%" y="49%" width="2%" height="1.2%" rx="0.5" fill="#4ade8010" />
      {/* Small monitor */}
      <rect x="18%" y="49.5%" width="4%" height="3%" rx="1.5" fill="#111827" stroke="#1e293b" strokeWidth="0.8" />
      <rect x="18.3%" y="49.8%" width="3.4%" height="2.2%" rx="1" fill="#4ade80" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* === RIGHT WORKSTATION (Sir Debug) === */}
      <rect x="73%" y="52%" width="12%" height="5%" rx="3" fill="#151d2e" stroke="#1e293b" strokeWidth="0.8" />
      {/* Dual monitors */}
      <rect x="74%" y="49.5%" width="3.5%" height="3%" rx="1.5" fill="#111827" stroke="#1e293b" strokeWidth="0.8" />
      <rect x="78%" y="49.5%" width="3.5%" height="3%" rx="1.5" fill="#111827" stroke="#1e293b" strokeWidth="0.8" />
      <rect x="74.3%" y="49.8%" width="2.9%" height="2.2%" rx="1" fill="#60a5fa" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.07;0.03" dur="3.5s" repeatCount="indefinite" />
      </rect>
      {/* Coffee mug */}
      <circle cx="82.5%" cy="54%" r="0.8%" fill="#1a2239" stroke="#fb923c" strokeWidth="0.5" opacity="0.5" />

      {/* === BOTTOM LEFT (Pixie) === */}
      <rect x="28%" y="75%" width="11%" height="5%" rx="3" fill="#151d2e" stroke="#1e293b" strokeWidth="0.8" />
      {/* Drawing tablet */}
      <rect x="30%" y="73%" width="5%" height="3%" rx="1" fill="#111827" stroke="#fb923c20" strokeWidth="0.8" />
      {/* Pen */}
      <line x1="33%" y1="73.5%" x2="34.5%" y2="72%" stroke="#fb923c" strokeWidth="0.5" opacity="0.4" />
      {/* Color palette */}
      <circle cx="29.5%" cy="77%" r="0.5%" fill="#f87171" opacity="0.3" />
      <circle cx="30.5%" cy="77.3%" r="0.5%" fill="#fbbf24" opacity="0.3" />
      <circle cx="31.5%" cy="77%" r="0.5%" fill="#4ade80" opacity="0.3" />

      {/* === BOTTOM RIGHT (Data-X) === */}
      <rect x="58%" y="75%" width="11%" height="5%" rx="3" fill="#151d2e" stroke="#1e293b" strokeWidth="0.8" />
      {/* Server rack mini */}
      <rect x="66%" y="73%" width="2.5%" height="4%" rx="1" fill="#111827" stroke="#c084fc15" strokeWidth="0.8" />
      <circle cx="67.2%" cy="74%" r="0.3%" fill="#c084fc" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="67.2%" cy="75%" r="0.3%" fill="#4ade80" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Hologram display */}
      <rect x="59%" y="73%" width="4.5%" height="3%" rx="1.5" fill="#111827" stroke="#1e293b" strokeWidth="0.8" />
      <rect x="59.3%" y="73.3%" width="3.9%" height="2.2%" rx="1" fill="#c084fc" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.07;0.03" dur="2.8s" repeatCount="indefinite" />
      </rect>

      {/* === DECORATIONS === */}
      {/* Plant left */}
      <circle cx="5%" cy="45%" r="1.5%" fill="#4ade80" opacity="0.08" />
      <line x1="5%" y1="45%" x2="5%" y2="48%" stroke="#4ade80" strokeWidth="1" opacity="0.15" />
      <circle cx="4.3%" cy="44%" r="1%" fill="#4ade80" opacity="0.06" />
      <circle cx="5.8%" cy="43.8%" r="1.2%" fill="#34d399" opacity="0.06" />
      {/* Pot */}
      <rect x="4%" y="48%" width="2%" height="1.5%" rx="0.5" fill="#1e293b" />

      {/* Plant right */}
      <circle cx="95%" cy="45%" r="1.5%" fill="#4ade80" opacity="0.08" />
      <line x1="95%" y1="45%" x2="95%" y2="48%" stroke="#4ade80" strokeWidth="1" opacity="0.15" />
      <circle cx="94.3%" cy="44%" r="1%" fill="#4ade80" opacity="0.06" />
      <rect x="94%" y="48%" width="2%" height="1.5%" rx="0.5" fill="#1e293b" />

      {/* Whiteboard top right */}
      <rect x="88%" y="15%" width="8%" height="12%" rx="2" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <line x1="89.5%" y1="18%" x2="94.5%" y2="18%" stroke="#334155" strokeWidth="0.5" opacity="0.5" />
      <line x1="89.5%" y1="20%" x2="93%" y2="20%" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
      <line x1="89.5%" y1="22%" x2="95%" y2="22%" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
      <rect x="90%" y="24%" width="2.5%" height="1.5%" rx="0.5" fill="#60a5fa" opacity="0.08" />
      <rect x="93%" y="24%" width="1.5%" height="1.5%" rx="0.5" fill="#fb923c" opacity="0.08" />

      {/* Clock top left */}
      <circle cx="8%" cy="18%" r="2.5%" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <line x1="8%" y1="18%" x2="8%" y2="16.5%" stroke="#94a3b8" strokeWidth="0.8" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0 8 18" to="360 8 18" dur="60s" repeatCount="indefinite" />
      </line>
      <line x1="8%" y1="18%" x2="9%" y2="18.5%" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 8 18" to="360 8 18" dur="3600s" repeatCount="indefinite" />
      </line>
      <circle cx="8%" cy="18%" r="0.3%" fill="#34d399" opacity="0.5" />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={`particle-${i}`}
          cx={`${15 + i * 10}%`}
          cy={`${20 + (i % 3) * 25}%`}
          r="0.8"
          fill="#34d399"
          opacity="0.15"
        >
          <animate attributeName="cy" values={`${20 + (i % 3) * 25}%;${18 + (i % 3) * 25}%;${20 + (i % 3) * 25}%`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Rug / floor marking in center */}
      <ellipse cx="50%" cy="55%" rx="20%" ry="8%" fill="#1e293b" opacity="0.15" />

      {/* Vignette edges */}
      <rect width="100%" height="100%" fill="url(#vignette)" />
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="#06080f" stopOpacity="0.7" />
        </radialGradient>
      </defs>
    </svg>
  );
}
