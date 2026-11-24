import React from 'react';

export default function RJ05Logo({ className = "w-11 h-11", withGlow = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className} ${withGlow ? 'filter drop-shadow-[0_0_16px_rgba(255,85,0,0.65)]' : ''}`}>
      <svg 
        viewBox="0 0 140 140" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Free Fire Fire & Gold Gradients */}
          <linearGradient id="ffFireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="25%" stopColor="#FFAA00" />
            <stop offset="65%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#DD1100" />
          </linearGradient>

          <linearGradient id="heroicWings" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFAA00" />
            <stop offset="50%" stopColor="#FF4400" />
            <stop offset="100%" stopColor="#7F0909" />
          </linearGradient>

          <linearGradient id="cyberPlate" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#050811" />
          </linearGradient>

          <linearGradient id="neonCyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#00FF66" />
          </linearGradient>

          <radialGradient id="alokAuraCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5500" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFAA00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Fire Aura Glow */}
        <circle cx="70" cy="65" r="56" fill="url(#alokAuraCore)" />

        {/* ========================================================= */}
        {/* FREE FIRE HEROIC STYLE WING BLADES (TOP LEFT & RIGHT) */}
        {/* ========================================================= */}
        {/* Left Wing Tier 1 */}
        <path d="M70 18 L32 34 L12 16 L28 42 L16 54 L36 58 Z" fill="url(#heroicWings)" />
        {/* Right Wing Tier 1 */}
        <path d="M70 18 L108 34 L128 16 L112 42 L124 54 L104 58 Z" fill="url(#heroicWings)" />

        {/* Left Wing Flame Tips */}
        <path d="M38 36 L18 24 L30 46 Z" fill="#FFF275" />
        {/* Right Wing Flame Tips */}
        <path d="M102 36 L122 24 L110 46 Z" fill="#FFF275" />

        {/* Outer Heavy Beveled Shield */}
        <path 
          d="M70 14 L114 36 L114 82 Q114 116 70 134 Q26 116 26 82 L26 36 Z" 
          fill="url(#cyberPlate)" 
          stroke="url(#ffFireGrad)" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
        />

        {/* Inner Carbon Shield Inset */}
        <path 
          d="M70 24 L105 41 L105 80 Q105 109 70 124 Q35 109 35 80 L35 41 Z" 
          fill="#0D1424" 
          stroke="rgba(255, 255, 255, 0.12)" 
          strokeWidth="1.5" 
        />

        {/* Free Fire Booyah Apex Crown / Sword Tip */}
        <polygon points="70,16 77,28 63,28" fill="#FFF275" />
        <polygon points="70,22 74,32 66,32" fill="#FF5500" />
        <line x1="58" y1="36" x2="82" y2="36" stroke="url(#neonCyanGlow)" strokeWidth="2" strokeLinecap="round" />

        {/* Crosshair / Sniper Reticle Accents behind RJ05 */}
        <circle cx="70" cy="65" r="28" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="70" y1="34" x2="70" y2="40" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="90" x2="70" y2="96" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="39" y1="65" x2="45" y2="65" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="95" y1="65" x2="101" y2="65" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />

        {/* ========================================================= */}
        {/* AGGRESSIVE FREE FIRE ESPORTS MONOGRAM: RJ05 */}
        {/* ========================================================= */}
        <text 
          x="70" 
          y="72" 
          textAnchor="middle" 
          fontFamily="'Orbitron', sans-serif" 
          fontWeight="900" 
          fontSize="26" 
          fill="url(#ffFireGrad)"
          letterSpacing="1"
          style={{ textShadow: '0 0 10px rgba(255,170,0,0.8), 0 2px 5px rgba(0,0,0,0.9)' }}
        >
          RJ05
        </text>

        {/* Esports Metallic Tactical Plate */}
        <polygon points="40,84 100,84 94,100 46,100" fill="url(#heroicWings)" stroke="#FFAA00" strokeWidth="1.2" />
        <text 
          x="70" 
          y="96" 
          textAnchor="middle" 
          fontFamily="'Orbitron', sans-serif" 
          fontWeight="900" 
          fontSize="10" 
          fill="#FFFFFF" 
          letterSpacing="2.5"
        >
          ESPORTS
        </text>

        {/* Bottom Booyah Golden Emblem Star */}
        <polygon points="70,105 73,112 80,112 74,116 76,122 70,118 64,122 66,116 60,112 67,112" fill="#FFAA00" />
      </svg>
    </div>
  );
}
