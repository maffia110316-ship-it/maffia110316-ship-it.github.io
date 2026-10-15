// Curated media presets for Avatars and Banners
// Features 60fps Animated SVG data-uris (guaranteed zero-downtime, no CORS, works in offline mode)
// and curated high-definition gaming aesthetics.

export interface MediaPreset {
  id: string;
  name: string;
  type: 'animated' | 'static';
  category: string;
  url: string;
  badge?: string;
  description?: string;
}

// ==========================================
// ANIMATED AVATARS (SVG 60fps & Animated Loops)
// ==========================================
export const ANIMATED_AVATAR_PRESETS: MediaPreset[] = [
  {
    id: 'anim_avatar_glitch_skull',
    name: 'Cyber Neon Skull',
    type: 'animated',
    category: 'Cyberpunk',
    badge: 'GIF FX',
    description: 'Pulsing neon cyberpunk skull with glowing cyber optics',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%230f0c29"/>
          <stop offset="50%" stop-color="%23302b63"/>
          <stop offset="100%" stop-color="%2324243e"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <style>
        @keyframes pulse { 0% { r: 16px; opacity: 0.8; } 50% { r: 20px; opacity: 1; } 100% { r: 16px; opacity: 0.8; } }
        @keyframes eyeGlow { 0% { fill: %2300ffcc; filter: drop-shadow(0 0 2px %2300ffcc); } 50% { fill: %23ff007f; filter: drop-shadow(0 0 6px %23ff007f); } 100% { fill: %2300ffcc; filter: drop-shadow(0 0 2px %2300ffcc); } }
        @keyframes floatSkull { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes ringSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .skull-grp { animation: floatSkull 3s ease-in-out infinite; transform-origin: center; }
        .eye { animation: eyeGlow 2s ease-in-out infinite; }
        .ring { animation: ringSpin 8s linear infinite; transform-origin: 60px 60px; stroke-dasharray: 8 6; }
      </style>
      <rect width="120" height="120" rx="36" fill="url(%23bgG)"/>
      <circle cx="60" cy="60" r="50" fill="none" stroke="%235865f2" stroke-width="2" opacity="0.4" class="ring"/>
      <g class="skull-grp">
        <path d="M40 38 C40 24, 80 24, 80 38 C80 50, 74 58, 68 62 L68 76 L52 76 L52 62 C46 58, 40 50, 40 38 Z" fill="%231a1b26" stroke="%235865f2" stroke-width="3" filter="url(%23glow)"/>
        <circle cx="49" cy="46" r="6" class="eye"/>
        <circle cx="71" cy="46" r="6" class="eye"/>
        <rect x="56" y="56" width="8" height="6" rx="2" fill="%23ff007f" opacity="0.8"/>
        <line x1="56" y1="70" x2="56" y2="76" stroke="%2300ffcc" stroke-width="2"/>
        <line x1="60" y1="70" x2="60" y2="76" stroke="%2300ffcc" stroke-width="2"/>
        <line x1="64" y1="70" x2="64" y2="76" stroke="%2300ffcc" stroke-width="2"/>
      </g>
    </svg>`,
  },
  {
    id: 'anim_avatar_synth_sun',
    name: 'Synthwave 80s Sun',
    type: 'animated',
    category: 'Retro',
    badge: 'GIF FX',
    description: 'Animated retro 80s neon sun with moving horizon bars',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%23ffdd00"/>
          <stop offset="50%" stop-color="%23ff007f"/>
          <stop offset="100%" stop-color="%237928ca"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(12px); } }
        @keyframes glowRing { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .grid-line { animation: scan 1.5s linear infinite; }
        .sun { animation: glowRing 3s ease-in-out infinite; }
      </style>
      <rect width="120" height="120" rx="36" fill="%230d0914"/>
      <circle cx="60" cy="55" r="34" fill="url(%23sunGrad)" class="sun"/>
      <mask id="sunMask">
        <circle cx="60" cy="55" r="34" fill="white"/>
        <rect x="20" y="55" width="80" height="3" fill="black"/>
        <rect x="20" y="62" width="80" height="4" fill="black"/>
        <rect x="20" y="70" width="80" height="5" fill="black"/>
        <rect x="20" y="79" width="80" height="6" fill="black"/>
      </mask>
      <circle cx="60" cy="55" r="34" fill="url(%23sunGrad)" mask="url(%23sunMask)"/>
      <line x1="10" y1="96" x2="110" y2="96" stroke="%23ff007f" stroke-width="2" opacity="0.8"/>
      <line x1="20" y1="104" x2="100" y2="104" stroke="%2300f2fe" stroke-width="1.5" opacity="0.6"/>
      <line x1="30" y1="110" x2="90" y2="110" stroke="%2300f2fe" stroke-width="1" opacity="0.4"/>
    </svg>`,
  },
  {
    id: 'anim_avatar_pixel_mage',
    name: 'Pixel 8-Bit Wizard',
    type: 'animated',
    category: 'Pixel Art',
    badge: '8-BIT',
    description: 'Retro 8-bit wizard holding a glowing animated orb',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <style>
        @keyframes orbPulse { 0%, 100% { r: 6px; fill: %2300f2fe; } 50% { r: 8px; fill: %23ff00ea; } }
        @keyframes staffWiggle { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-3deg); } }
        .magic-orb { animation: orbPulse 1.2s ease-in-out infinite; }
        .staff { animation: staffWiggle 2s ease-in-out infinite; transform-origin: 30px 70px; }
      </style>
      <rect width="120" height="120" rx="36" fill="%23181824"/>
      <!-- Hat -->
      <polygon points="60,20 40,55 80,55" fill="%235865f2"/>
      <rect x="35" y="52" width="50" height="7" rx="2" fill="%234752c4"/>
      <!-- Face & Beard -->
      <rect x="46" y="59" width="28" height="14" fill="%23ffd1a4"/>
      <rect x="50" y="63" width="4" height="4" fill="%23000"/>
      <rect x="66" y="63" width="4" height="4" fill="%23000"/>
      <polygon points="46,73 74,73 60,94" fill="%23ffffff"/>
      <!-- Staff & Orb -->
      <g class="staff">
        <rect x="28" y="38" width="4" height="60" rx="1" fill="%23c68a4c"/>
        <circle cx="30" cy="34" r="7" class="magic-orb"/>
      </g>
    </svg>`,
  },
  {
    id: 'anim_avatar_matrix_coder',
    name: 'Matrix Data Stream',
    type: 'animated',
    category: 'Hacker',
    badge: 'MATRIX',
    description: 'Falling green digital matrix code over terminal visor',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <style>
        @keyframes fall1 { 0% { transform: translateY(-40px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(120px); opacity: 0; } }
        @keyframes fall2 { 0% { transform: translateY(-30px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(130px); opacity: 0; } }
        @keyframes visorGlow { 0%, 100% { stroke: %2300ff66; filter: drop-shadow(0 0 4px %2300ff66); } 50% { stroke: %2339ff14; filter: drop-shadow(0 0 8px %2339ff14); } }
        .col1 { animation: fall1 2.2s linear infinite; }
        .col2 { animation: fall2 1.8s linear infinite 0.5s; }
        .visor { animation: visorGlow 2s ease-in-out infinite; }
      </style>
      <rect width="120" height="120" rx="36" fill="%23030f06"/>
      <g fill="%2300ff66" font-family="monospace" font-size="9" font-weight="bold" opacity="0.6">
        <g class="col1">
          <text x="24" y="20">1</text><text x="24" y="35">0</text><text x="24" y="50">1</text><text x="24" y="65">X</text><text x="24" y="80">7</text>
        </g>
        <g class="col2">
          <text x="90" y="10">9</text><text x="90" y="26">F</text><text x="90" y="42">0</text><text x="90" y="58">1</text><text x="90" y="74">A</text>
        </g>
      </g>
      <circle cx="60" cy="55" r="28" fill="%2308180c" stroke="%2300ff66" stroke-width="2"/>
      <path d="M42 55 Q60 50 78 55 Q60 62 42 55 Z" fill="%2300ff66" opacity="0.9" class="visor"/>
      <circle cx="60" cy="55" r="3" fill="%23ffffff"/>
    </svg>`,
  },
  {
    id: 'anim_avatar_phoenix_flame',
    name: 'Inferno Phoenix',
    type: 'animated',
    category: 'Fantasy',
    badge: 'FIRE FX',
    description: 'Roaring mythical phoenix with rising ember particles',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <radialGradient id="fireGrad" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stop-color="%23ffff00"/>
          <stop offset="40%" stop-color="%23ff4500"/>
          <stop offset="100%" stop-color="%238b0000"/>
        </radialGradient>
      </defs>
      <style>
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.04, 0.96) rotate(-1deg); }
          50% { transform: scale(0.97, 1.05) rotate(1deg); }
          75% { transform: scale(1.02, 0.98) rotate(0deg); }
        }
        @keyframes floatEmber {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        .flame-core { animation: flameFlicker 1.4s ease-in-out infinite; transform-origin: 60px 80px; }
        .ember1 { animation: floatEmber 2s ease-out infinite; }
        .ember2 { animation: floatEmber 2.4s ease-out infinite 0.8s; }
      </style>
      <rect width="120" height="120" rx="36" fill="%231a0803"/>
      <circle cx="45" cy="80" r="3" fill="%23ffff00" class="ember1"/>
      <circle cx="75" cy="70" r="2.5" fill="%23ff7700" class="ember2"/>
      <g class="flame-core">
        <path d="M60 22 C75 42, 90 60, 85 80 C80 96, 40 96, 35 80 C30 60, 45 42, 60 22 Z" fill="url(%23fireGrad)"/>
        <path d="M60 38 C70 52, 78 66, 74 78 C70 88, 50 88, 46 78 C42 66, 50 52, 60 38 Z" fill="%23ffffaa"/>
      </g>
    </svg>`,
  },
  {
    id: 'anim_avatar_pulsing_cat',
    name: 'Cyber Meow Mascot',
    type: 'animated',
    category: 'Mascot',
    badge: 'KAWAII',
    description: 'Anime cyberpunk neon cat with blinking digital eyes',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <style>
        @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes earTwitch { 0%, 80%, 100% { transform: rotate(0deg); } 85% { transform: rotate(-5deg); } }
        .eyes { animation: blink 4s infinite; transform-origin: center 58px; }
        .left-ear { animation: earTwitch 3.5s ease-in-out infinite; transform-origin: 35px 40px; }
      </style>
      <rect width="120" height="120" rx="36" fill="%231e1338"/>
      <!-- Ears -->
      <polygon points="30,55 45,25 60,55" fill="%23a855f7" class="left-ear"/>
      <polygon points="35,50 45,32 55,50" fill="%23ec4899"/>
      <polygon points="60,55 75,25 90,55" fill="%23a855f7"/>
      <polygon points="65,50 75,32 85,50" fill="%23ec4899"/>
      <!-- Head -->
      <circle cx="60" cy="65" r="30" fill="%23a855f7"/>
      <!-- Cyber Visor / Eyes -->
      <g class="eyes">
        <ellipse cx="48" cy="62" rx="5" ry="6" fill="%2322d3ee"/>
        <ellipse cx="72" cy="62" rx="5" ry="6" fill="%2322d3ee"/>
        <circle cx="50" cy="60" r="2" fill="%23ffffff"/>
        <circle cx="74" cy="60" r="2" fill="%23ffffff"/>
      </g>
      <!-- Nose & Mouth -->
      <polygon points="58,72 62,72 60,75" fill="%23f43f5e"/>
      <path d="M54 77 Q60 81 66 77" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
];

// ==========================================
// ANIMATED BANNERS (Motion SVG 60fps & Loops)
// ==========================================
export const ANIMATED_BANNER_PRESETS: MediaPreset[] = [
  {
    id: 'anim_banner_synthwave',
    name: 'Synthwave Highway 80s',
    type: 'animated',
    category: 'Retro Gaming',
    badge: 'ANIMATED',
    description: 'Animated 80s wireframe grid with neon sunset and shooting stars',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%230b051b"/>
          <stop offset="55%" stop-color="%233b0764"/>
          <stop offset="60%" stop-color="%231e082b"/>
          <stop offset="100%" stop-color="%2306020c"/>
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%23fde047"/>
          <stop offset="50%" stop-color="%23ec4899"/>
          <stop offset="100%" stop-color="%239333ea"/>
        </linearGradient>
        <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%2306b6d4" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="%23ec4899" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(32px); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        @keyframes sunGlow {
          0%, 100% { filter: drop-shadow(0 0 15px %23ec4899); }
          50% { filter: drop-shadow(0 0 35px %23fde047); }
        }
        .anim-grid { animation: gridMove 1.2s linear infinite; }
        .star { animation: starTwinkle 2s ease-in-out infinite; }
        .sun-disc { animation: sunGlow 4s ease-in-out infinite; }
      </style>
      <rect width="1000" height="320" fill="url(%23bg)"/>
      <!-- Stars -->
      <circle cx="120" cy="40" r="1.5" fill="%23fff" class="star"/>
      <circle cx="280" cy="70" r="2" fill="%23fde047" class="star" style="animation-delay: 0.7s"/>
      <circle cx="750" cy="50" r="1.5" fill="%2338bdf8" class="star" style="animation-delay: 1.2s"/>
      <circle cx="890" cy="80" r="2" fill="%23fff" class="star" style="animation-delay: 0.4s"/>
      <!-- Sun -->
      <circle cx="500" cy="180" r="90" fill="url(%23sun)" class="sun-disc"/>
      <mask id="stripes">
        <rect width="1000" height="320" fill="white"/>
        <rect x="350" y="150" width="300" height="4" fill="black"/>
        <rect x="350" y="160" width="300" height="6" fill="black"/>
        <rect x="350" y="172" width="300" height="8" fill="black"/>
        <rect x="350" y="186" width="300" height="10" fill="black"/>
        <rect x="350" y="202" width="300" height="12" fill="black"/>
      </mask>
      <circle cx="500" cy="180" r="90" fill="url(%23sun)" mask="url(%23stripes)"/>
      <!-- Horizon Neon Line -->
      <line x1="0" y1="180" x2="1000" y2="180" stroke="%23ec4899" stroke-width="3" filter="drop-shadow(0 0 8px %23ec4899)"/>
      <!-- Moving Grid Floor -->
      <g clip-path="polygon(0 180, 1000 180, 1000 320, 0 320)">
        <g class="anim-grid" stroke="url(%23gridGrad)" stroke-width="1.5">
          <line x1="0" y1="180" x2="0" y2="340"/>
          <line x1="0" y1="190" x2="1000" y2="190"/>
          <line x1="0" y1="210" x2="1000" y2="210"/>
          <line x1="0" y1="235" x2="1000" y2="235"/>
          <line x1="0" y1="265" x2="1000" y2="265"/>
          <line x1="0" y1="300" x2="1000" y2="300"/>
          <line x1="0" y1="340" x2="1000" y2="340"/>
        </g>
        <!-- Perspective lines -->
        <g stroke="%2306b6d4" stroke-width="1.5" opacity="0.7">
          <line x1="500" y1="180" x2="0" y2="320"/>
          <line x1="500" y1="180" x2="150" y2="320"/>
          <line x1="500" y1="180" x2="300" y2="320"/>
          <line x1="500" y1="180" x2="420" y2="320"/>
          <line x1="500" y1="180" x2="580" y2="320"/>
          <line x1="500" y1="180" x2="700" y2="320"/>
          <line x1="500" y1="180" x2="850" y2="320"/>
          <line x1="500" y1="180" x2="1000" y2="320"/>
        </g>
      </g>
    </svg>`,
  },
  {
    id: 'anim_banner_matrix',
    name: 'Cyberpunk Matrix Rain',
    type: 'animated',
    category: 'Cyberpunk',
    badge: 'ANIMATED',
    description: 'Continuous animated cascade of green cyberpunk matrix data',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
      <style>
        @keyframes drop1 { 0% { transform: translateY(-100px); opacity: 0; } 50% { opacity: 0.9; } 100% { transform: translateY(340px); opacity: 0; } }
        @keyframes drop2 { 0% { transform: translateY(-80px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(360px); opacity: 0; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.35; } }
        .d1 { animation: drop1 2.8s linear infinite; }
        .d2 { animation: drop2 2.2s linear infinite 0.7s; }
        .d3 { animation: drop1 3.2s linear infinite 1.4s; }
        .bg-glow { animation: pulseGlow 4s ease-in-out infinite; }
      </style>
      <rect width="1000" height="320" fill="%23020904"/>
      <circle cx="500" cy="160" r="300" fill="%2300ff66" filter="blur(60px)" class="bg-glow"/>
      <g fill="%2322c55e" font-family="monospace" font-size="14" font-weight="bold">
        <g class="d1" transform="translate(60, 0)">
          <text y="0">0101</text><text y="30">MAFFIA</text><text y="60">ROOT</text><text y="90">7F3A</text><text y="120">01</text><text y="150">KILL</text><text y="180">99</text>
        </g>
        <g class="d2" transform="translate(220, 0)">
          <text y="0">DISCORD</text><text y="30">RPC</text><text y="60">0x89</text><text y="90">PASS</text><text y="120">STREAM</text><text y="150">NODE</text>
        </g>
        <g class="d3" transform="translate(420, 0)">
          <text y="0">GAMING</text><text y="30">TROPHY</text><text y="60">100%</text><text y="90">STEAM</text><text y="120">LEVEL</text><text y="150">XP</text>
        </g>
        <g class="d1" transform="translate(640, 0)">
          <text y="0">MATRIX</text><text y="30">HOST</text><text y="60">CONNECT</text><text y="90">PORT:3000</text><text y="120">OK</text>
        </g>
        <g class="d2" transform="translate(840, 0)">
          <text y="0">CYBER</text><text y="30">01001</text><text y="60">SYSTEM</text><text y="90">READY</text><text y="120">SYNC</text>
        </g>
      </g>
      <rect width="1000" height="320" fill="none" stroke="%2322c55e" stroke-width="1" opacity="0.3"/>
    </svg>`,
  },
  {
    id: 'anim_banner_cosmos',
    name: 'Cosmic Starfield Vortex',
    type: 'animated',
    category: 'Cosmic',
    badge: 'ANIMATED',
    description: 'Animated swirling galactic star cluster with drifting nebulas',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
      <defs>
        <radialGradient id="nebulaA" cx="30%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%23818cf8" stop-opacity="0.6"/>
          <stop offset="60%" stop-color="%23c084fc" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="%23020617" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="nebulaB" cx="80%" cy="60%" r="50%">
          <stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.5"/>
          <stop offset="70%" stop-color="%2306b6d4" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="%23020617" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <style>
        @keyframes rotateGalaxy { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulseStars { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .galaxy-spin { animation: rotateGalaxy 40s linear infinite; transform-origin: 500px 160px; }
        .stars-sparkle { animation: pulseStars 2.5s ease-in-out infinite; }
      </style>
      <rect width="1000" height="320" fill="%23030712"/>
      <rect width="1000" height="320" fill="url(%23nebulaA)"/>
      <rect width="1000" height="320" fill="url(%23nebulaB)"/>
      <g class="galaxy-spin">
        <circle cx="500" cy="160" r="120" fill="none" stroke="%23818cf8" stroke-width="1.5" stroke-dasharray="10 20" opacity="0.4"/>
        <circle cx="500" cy="160" r="180" fill="none" stroke="%23c084fc" stroke-width="1" stroke-dasharray="15 30" opacity="0.3"/>
        <circle cx="500" cy="160" r="240" fill="none" stroke="%2338bdf8" stroke-width="1" stroke-dasharray="20 40" opacity="0.2"/>
      </g>
      <g class="stars-sparkle" fill="%23ffffff">
        <circle cx="150" cy="80" r="2.5"/>
        <circle cx="340" cy="240" r="1.5"/>
        <circle cx="620" cy="60" r="2"/>
        <circle cx="820" cy="200" r="2.2"/>
        <circle cx="480" cy="120" r="3"/>
        <circle cx="520" cy="200" r="1.8"/>
      </g>
    </svg>`,
  },
  {
    id: 'anim_banner_fire',
    name: 'Infernal Magma Embers',
    type: 'animated',
    category: 'Fantasy',
    badge: 'ANIMATED',
    description: 'Animated blazing volcanic embers and fiery heatwave aura',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
      <defs>
        <linearGradient id="fireBg" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="%23450a0a"/>
          <stop offset="40%" stop-color="%231c0505"/>
          <stop offset="100%" stop-color="%230c0202"/>
        </linearGradient>
      </defs>
      <style>
        @keyframes floatUp1 { 0% { transform: translateY(320px) scale(0.6); opacity: 0; } 50% { opacity: 0.9; } 100% { transform: translateY(-20px) scale(1.2); opacity: 0; } }
        @keyframes floatUp2 { 0% { transform: translateY(320px) scale(0.8); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-20px) scale(1.4); opacity: 0; } }
        @keyframes lavaGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .e1 { animation: floatUp1 3.5s ease-out infinite; }
        .e2 { animation: floatUp2 2.8s ease-out infinite 1s; }
        .e3 { animation: floatUp1 4s ease-out infinite 2s; }
        .lava-bar { animation: lavaGlow 2.5s ease-in-out infinite; }
      </style>
      <rect width="1000" height="320" fill="url(%23fireBg)"/>
      <rect x="0" y="290" width="1000" height="30" fill="%23ef4444" filter="blur(15px)" class="lava-bar"/>
      <circle cx="180" cy="0" r="4" fill="%23f59e0b" class="e1"/>
      <circle cx="380" cy="0" r="3" fill="%23f97316" class="e2"/>
      <circle cx="560" cy="0" r="5" fill="%23ef4444" class="e3"/>
      <circle cx="780" cy="0" r="3.5" fill="%23fde047" class="e1" style="animation-delay: 1.5s"/>
      <circle cx="920" cy="0" r="4" fill="%23f59e0b" class="e2" style="animation-delay: 0.5s"/>
    </svg>`,
  },
];

// ==========================================
// STATIC PRESETS (HD High Quality)
// ==========================================
export const STATIC_AVATAR_PRESETS = [
  { id: 'av_bottts_maffia', name: 'Maffia Boss', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maffia' },
  { id: 'av_bottts_viper', name: 'Viper Strike', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Viper' },
  { id: 'av_bottts_cyber', name: 'Cyber Neon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' },
  { id: 'av_bottts_shadow', name: 'Shadow Ops', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow' },
  { id: 'av_bottts_knight', name: 'Steel Knight', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Knight' },
  { id: 'av_bottts_wizard', name: 'Archmage', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Wizard' },
  { id: 'av_bottts_nova', name: 'Nova Prime', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova' },
  { id: 'av_bottts_titan', name: 'Titan Mech', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Titan' },
];

export const STATIC_BANNER_PRESETS = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    type: 'static' as const,
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    color: 'from-purple-900 via-indigo-950 to-pink-900',
  },
  {
    id: 'space',
    name: 'Deep Cosmos',
    type: 'static' as const,
    category: 'Cosmic',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    color: 'from-blue-950 via-slate-900 to-indigo-950',
  },
  {
    id: 'retro',
    name: 'Retro Arcade',
    type: 'static' as const,
    category: 'Arcade',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    color: 'from-amber-900 via-orange-950 to-rose-950',
  },
  {
    id: 'esports',
    name: 'Esports Arena',
    type: 'static' as const,
    category: 'Esports',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    color: 'from-emerald-950 via-slate-900 to-teal-950',
  },
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy Realm',
    type: 'static' as const,
    category: 'Fantasy',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    color: 'from-red-950 via-stone-900 to-neutral-950',
  },
  {
    id: 'clean-dark',
    name: 'Obsidian Minimal',
    type: 'static' as const,
    category: 'Minimal',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    color: 'from-slate-950 via-zinc-900 to-neutral-950',
  },
];
