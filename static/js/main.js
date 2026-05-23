// ============================================================
// AquaSense — Ahmednagar Pilot Farm
// Tab-switched dashboard. Lucide SVG icons. One accent.
// ============================================================

const AHMEDNAGAR = { lat: 19.0948, lon: 74.7480, name: "Ahmednagar, Maharashtra" };

const state = {
    crops: [],
    selectedCrops: [],
    crop_stage: "mid",
    lastResults: null,
    activeScheduleCrop: null,
    map: null,
    farmMarker: null,
    activeTab: "overview"
};

// ============================================================
// Lucide-style inline SVG icons (MIT, lucide.dev)
// ============================================================
const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
    dashboard: `<svg ${SVG_ATTRS}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
    "cloud-sun": `<svg ${SVG_ATTRS}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.95 12.65A4 4 0 0 0 10 8a4 4 0 0 0-3.46 2"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
    sprout: `<svg ${SVG_ATTRS}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
    droplets: `<svg ${SVG_ATTRS}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
    "bar-chart": `<svg ${SVG_ATTRS}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
    "map-pin": `<svg ${SVG_ATTRS}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    thermometer: `<svg ${SVG_ATTRS}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,
    wind: `<svg ${SVG_ATTRS}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
    "cloud-rain": `<svg ${SVG_ATTRS}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
    target: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    calendar: `<svg ${SVG_ATTRS}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    satellite: `<svg ${SVG_ATTRS}><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/></svg>`,
    brain: `<svg ${SVG_ATTRS}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
    zap: `<svg ${SVG_ATTRS}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    plus: `<svg ${SVG_ATTRS}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    x: `<svg ${SVG_ATTRS}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    "arrow-right": `<svg ${SVG_ATTRS}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    check: `<svg ${SVG_ATTRS}><polyline points="20 6 9 17 4 12"/></svg>`,
    activity: `<svg ${SVG_ATTRS}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.24 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4 12H2"/></svg>`,
    gauge: `<svg ${SVG_ATTRS}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
    leaf: `<svg ${SVG_ATTRS}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 2 2 4.5 1.8 7-.1.2-.2.4-.3.6"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`,
    user: `<svg ${SVG_ATTRS}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    "git-branch": `<svg ${SVG_ATTRS}><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    command: `<svg ${SVG_ATTRS}><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>`,
    sun: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    cloud: `<svg ${SVG_ATTRS}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    "cloud-fog": `<svg ${SVG_ATTRS}><path d="M16 17H7a5 5 0 1 1 4.9-6H16a3 3 0 0 1 0 6Z"/><path d="M16 21H8"/><path d="M17 17v4"/></svg>`,
    "cloud-snow": `<svg ${SVG_ATTRS}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>`,
    "cloud-lightning": `<svg ${SVG_ATTRS}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`,
    ruler: `<svg ${SVG_ATTRS}><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-5.6-5.6a1 1 0 0 1 0-1.4L14.3 1.7a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg>`,
    trash: `<svg ${SVG_ATTRS}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    loader: `<svg ${SVG_ATTRS}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    "circle-dashed": `<svg ${SVG_ATTRS}><path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/></svg>`,
    expand: `<svg ${SVG_ATTRS}><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/></svg>`,
    info: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    sparkles: `<svg ${SVG_ATTRS}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
    play: `<svg ${SVG_ATTRS}><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
    keyboard: `<svg ${SVG_ATTRS}><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>`,
    waves: `<svg ${SVG_ATTRS}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
    "chevron-down": `<svg ${SVG_ATTRS}><path d="m6 9 6 6 6-6"/></svg>`,
    "chevron-up": `<svg ${SVG_ATTRS}><path d="m18 15-6-6-6 6"/></svg>`,
    moon: `<svg ${SVG_ATTRS}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
    globe: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    clock: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

    // CROP CATEGORY ICONS — simple, distinct line-style
    "crop-cereal": `<svg ${SVG_ATTRS}><path d="M12 22V4"/><path d="M12 8c-2-1-4-1-5 0 1 2 3 3 5 3M12 8c2-1 4-1 5 0-1 2-3 3-5 3"/><path d="M12 13c-2-1-4-1-5 0 1 2 3 3 5 3M12 13c2-1 4-1 5 0-1 2-3 3-5 3"/><path d="M12 18c-2-1-4-1-5 0 1 2 3 3 5 3M12 18c2-1 4-1 5 0-1 2-3 3-5 3"/></svg>`,
    "crop-rice": `<svg ${SVG_ATTRS}><path d="M12 22V8"/><ellipse cx="9" cy="6" rx="1.5" ry="3" transform="rotate(-25 9 6)"/><ellipse cx="15" cy="6" rx="1.5" ry="3" transform="rotate(25 15 6)"/><ellipse cx="12" cy="3" rx="1.5" ry="2.5"/><path d="M8 22h8"/></svg>`,
    "crop-maize": `<svg ${SVG_ATTRS}><path d="M12 21c-3 0-5-3-5-9s2-9 5-9 5 3 5 9-2 9-5 9z"/><path d="M9 8v9M12 7v12M15 8v9"/><path d="M12 3c-1-1-3-1-4 0 1 2 3 2 4 2 1 0 3 0 4-2-1-1-3-1-4 0z"/></svg>`,
    "crop-bean": `<svg ${SVG_ATTRS}><path d="M6 5c-2 3-2 7 0 11s7 5 11 3 5-7 3-11-7-5-11-3z"/><circle cx="10" cy="11" r="0.7" fill="currentColor"/><circle cx="14" cy="13" r="0.7" fill="currentColor"/></svg>`,
    "crop-cotton": `<svg ${SVG_ATTRS}><circle cx="12" cy="9" r="3"/><circle cx="8" cy="12.5" r="2.5"/><circle cx="16" cy="12.5" r="2.5"/><circle cx="12" cy="15" r="2.8"/><path d="M12 18v3M10 21h4"/></svg>`,
    "crop-sunflower": `<svg ${SVG_ATTRS}><circle cx="12" cy="10" r="2.5"/><path d="M12 4v2.5M12 13.5V16M6 10h2.5M15.5 10H18M7.7 5.7l1.7 1.7M14.6 12.6l1.7 1.7M7.7 14.3l1.7-1.7M14.6 7.4l1.7-1.7"/><path d="M12 16v6M9 19h6"/></svg>`,
    "crop-sugarcane": `<svg ${SVG_ATTRS}><path d="M9 22V2"/><path d="M15 22V2"/><path d="M8 7h8M8 12h8M8 17h8"/></svg>`,
    "crop-root": `<svg ${SVG_ATTRS}><path d="M12 22c-3 0-6-2.5-6-6.5S9 9 12 9s6 2.5 6 6.5-3 6.5-6 6.5z"/><path d="M12 9V3M9 5l3-2 3 2"/></svg>`,
    "crop-onion": `<svg ${SVG_ATTRS}><path d="M12 22c-4 0-7-3-7-7 0-3 1-5 3-7 1 0 4 0 4 0s3 0 4 0c2 2 3 4 3 7 0 4-3 7-7 7z"/><path d="M9 12c1 2 2 6 3 9M15 12c-1 2-2 6-3 9"/><path d="M12 8V2"/></svg>`,
    "crop-carrot": `<svg ${SVG_ATTRS}><path d="M3 21c5-3 11-7 14-12 1-2 0-4-2-5-5 3-9 9-12 14-1 1 0 4 0 3z"/><path d="M14 4c2-3 5-2 7-1-2 2-4 4-7 5"/><path d="M17 7c1-2 3-3 4-2-1 2-3 3-4 4"/></svg>`,
    "crop-leafy": `<svg ${SVG_ATTRS}><circle cx="12" cy="13" r="7"/><path d="M5 13c2-2 5-3 7-3s5 1 7 3"/><path d="M7 10c1-1 3-2 5-2s4 1 5 2"/><path d="M9 7c1-.5 2-1 3-1s2 .5 3 1"/></svg>`,
    "crop-tomato": `<svg ${SVG_ATTRS}><circle cx="12" cy="14" r="6"/><path d="M9 9l3 1 3-1M12 4c1 2 0 4-2 5M12 4c-1 2 0 4 2 5M12 4v6"/></svg>`,
    "crop-apple": `<svg ${SVG_ATTRS}><path d="M12 21c-4 0-6-3-6-7 0-3 1-5 4-6 1 0 2 1 2 1s1-1 2-1c3 1 4 3 4 6 0 4-2 7-6 7z"/><path d="M12 7V3M14 4l-2 2"/></svg>`,
    "crop-mango": `<svg ${SVG_ATTRS}><path d="M12 22c-3 0-6-2-7-6s0-9 3-12c2 1 5 3 8 5s5 4 4 7-4 6-8 6z"/><path d="M5 4l2 2"/></svg>`,
    "crop-grape": `<svg ${SVG_ATTRS}><circle cx="12" cy="4" r="1.4"/><circle cx="9" cy="7.5" r="1.7"/><circle cx="15" cy="7.5" r="1.7"/><circle cx="7" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="17" cy="11" r="1.7"/><circle cx="9" cy="14.5" r="1.7"/><circle cx="15" cy="14.5" r="1.7"/><circle cx="12" cy="18" r="1.7"/></svg>`,
    "crop-banana": `<svg ${SVG_ATTRS}><path d="M4 18c0 2 1 3 3 3 5 0 13-7 16-15-1-1-2-1-3-1-2 4-7 9-10 11-4 2-6-1-6 2z"/></svg>`,
    "crop-coffee": `<svg ${SVG_ATTRS}><ellipse cx="12" cy="12" rx="3.5" ry="7" transform="rotate(20 12 12)"/><path d="M9 7c2 2 4 6 6 9"/></svg>`,
    "crop-tea": `<svg ${SVG_ATTRS}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 2 2 4.5 1.8 7-.1.2-.2.4-.3.6"/><path d="M2 22c0-3 1.85-5.36 5.08-6"/></svg>`,
    "crop-grass": `<svg ${SVG_ATTRS}><path d="M3 22v-6c0-3 2-5 4-5M7 22V10c0-3 2-5 5-6M12 22V6c2 0 5 2 6 5M17 22V12c0-2 2-3 4-3"/></svg>`
};

// Crop name → category icon
const CROP_ICON_MAP = {
    wheat: "crop-cereal", barley: "crop-cereal", sorghum: "crop-cereal", millet: "crop-cereal",
    rice: "crop-rice",
    maize: "crop-maize",
    soybean: "crop-bean", groundnut: "crop-bean", lentil: "crop-bean", chickpea: "crop-bean",
    cotton: "crop-cotton",
    sunflower: "crop-sunflower",
    sugarcane: "crop-sugarcane",
    potato: "crop-root", cassava: "crop-root",
    onion: "crop-onion",
    carrot: "crop-carrot",
    cabbage: "crop-leafy", lettuce: "crop-leafy",
    tomato: "crop-tomato", pepper: "crop-tomato",
    banana: "crop-banana",
    apple: "crop-apple", citrus: "crop-apple",
    mango: "crop-mango",
    grape: "crop-grape",
    coffee: "crop-coffee",
    tea: "crop-tea",
    alfalfa: "crop-grass", pasture: "crop-grass"
};

function cropIcon(name) {
    return CROP_ICON_MAP[String(name || "").toLowerCase()] || "sprout";
}

// Weather code → icon name + label
const WEATHER_CODES = {
    0: { icon: "sun", desc: "Clear" },
    1: { icon: "sun", desc: "Mainly clear" },
    2: { icon: "cloud-sun", desc: "Partly cloudy" },
    3: { icon: "cloud", desc: "Overcast" },
    45: { icon: "cloud-fog", desc: "Fog" },
    48: { icon: "cloud-fog", desc: "Rime fog" },
    51: { icon: "cloud-rain", desc: "Light drizzle" },
    53: { icon: "cloud-rain", desc: "Drizzle" },
    55: { icon: "cloud-rain", desc: "Heavy drizzle" },
    61: { icon: "cloud-rain", desc: "Light rain" },
    63: { icon: "cloud-rain", desc: "Rain" },
    65: { icon: "cloud-rain", desc: "Heavy rain" },
    71: { icon: "cloud-snow", desc: "Light snow" },
    73: { icon: "cloud-snow", desc: "Snow" },
    75: { icon: "cloud-snow", desc: "Heavy snow" },
    80: { icon: "cloud-rain", desc: "Showers" },
    81: { icon: "cloud-rain", desc: "Showers" },
    82: { icon: "cloud-rain", desc: "Heavy showers" },
    95: { icon: "cloud-lightning", desc: "Thunderstorm" },
    96: { icon: "cloud-lightning", desc: "Thunder · hail" },
    99: { icon: "cloud-lightning", desc: "Severe storm" }
};

function weatherInfo(code) {
    return WEATHER_CODES[code] || { icon: "cloud", desc: "—" };
}

function svgFor(name) {
    return ICONS[name] || "";
}

function renderIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => {
        const name = el.dataset.icon;
        const svg = svgFor(name);
        if (svg) {
            el.innerHTML = svg;
            el.removeAttribute("data-icon");
            el.dataset.iconName = name;
        }
    });
}

// ============================================================
// Bootstrap
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    renderIcons();
    bindTabs();
    bindSubTabs();
    bindKeyboardNav();
    bindHashSync();
    bindCursorGlow();
    bindMagneticButtons();
    bindCropCardTilt();
    bindRippleButtons();
    bindScrollReveal();
    spawnParticles();
    initMouseLight();
    initModalLayer();
    bindCardModals();
    bindEasterEggs();
    addExpandCues();
    bindFloatingDock();
    initGreeting();
    initGlobe();
    initClock();

    await loadCrops();
    initMap();
    await loadWeather();
    bindForm();
    bindCropPicker();
    updateGeoOverview();

    // Honour URL hash if present
    const hash = location.hash.replace("#", "");
    if (hash && document.querySelector(`[data-section="${hash}"]`)) {
        activateTab(hash);
    } else {
        activateTab("overview");
    }

    // Scramble the hero title on first load
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) scrambleText(heroTitle, heroTitle.textContent, 35);

    // After ~3s on the page show the keyboard-help hint via a subtle toast
    setTimeout(() => {
        if (!sessionStorage.getItem("seenHelpHint")) {
            toast("Press ? for keyboard shortcuts", { tone: "info", duration: 4500 });
            sessionStorage.setItem("seenHelpHint", "1");
        }
    }, 4200);
});

// ============================================================
// Animation helpers
// ============================================================
const REDUCE_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tween numeric text values from current → target
function animateNumber(el, target, opts = {}) {
    if (!el || REDUCE_MOTION) {
        if (el) el.textContent = formatNumber(target, opts);
        return;
    }
    const startText = (el.textContent || "").replace(/[^0-9.\-]/g, "");
    const start = parseFloat(startText);
    const from = Number.isFinite(start) ? start : 0;
    const to = Number(target);
    if (!Number.isFinite(to) || from === to) {
        el.textContent = formatNumber(to, opts);
        flashValue(el);
        return;
    }
    const dur = opts.duration ?? 750;
    const t0 = performance.now();
    const easing = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
    function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const v = from + (to - from) * easing(p);
        el.textContent = formatNumber(v, opts);
        if (p < 1) requestAnimationFrame(tick);
        else flashValue(el);
    }
    requestAnimationFrame(tick);
}

function formatNumber(v, opts) {
    if (v == null || !Number.isFinite(v)) return "—";
    const decimals = opts.decimals ?? 0;
    const suffix = opts.suffix ?? "";
    return `${Number(v).toFixed(decimals)}${suffix}`;
}

function flashValue(el) {
    if (!el || REDUCE_MOTION) return;
    el.classList.remove("is-flashing");
    void el.offsetWidth;
    el.classList.add("is-flashing");
}

// ============================================================
// Text scramble effect — decodes random chars into final text
// ============================================================
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
function scrambleText(el, finalText, speed = 30) {
    if (!el || REDUCE_MOTION) { if (el) el.textContent = finalText; return; }
    let iteration = 0;
    const len = finalText.length;
    el.classList.add("is-scrambling");
    const interval = setInterval(() => {
        el.textContent = finalText
            .split("")
            .map((char, i) => {
                if (char === " ") return " ";
                if (i < iteration) return finalText[i];
                return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join("");
        if (iteration >= len) {
            clearInterval(interval);
            el.textContent = finalText;
            el.classList.remove("is-scrambling");
        }
        iteration += 1.5;
    }, speed);
}

// ============================================================
// Button ripple effect
// ============================================================
function bindRippleButtons() {
    document.querySelectorAll(".btn-cta, .btn-primary, .btn-secondary").forEach(btn => {
        btn.addEventListener("click", e => {
            if (REDUCE_MOTION) return;
            const ripple = document.createElement("span");
            ripple.className = "ripple-effect";
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.style.position = "relative";
            btn.style.overflow = "hidden";
            btn.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });
}

// ============================================================
// Floating particles — ambient background dots
// ============================================================
function spawnParticles() {
    if (REDUCE_MOTION) return;
    const container = document.querySelector(".bg-base");
    if (!container) return;
    // Fewer particles on compact / touch devices
    const compact = window.matchMedia && window.matchMedia("(max-width: 640px), (hover: none)").matches;
    const count = compact ? 8 : 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.width = p.style.height = `${2 + Math.random() * 3}px`;
        p.style.animationDuration = `${16 + Math.random() * 22}s`;
        p.style.animationDelay = `${Math.random() * -22}s`;
        p.style.opacity = `${0.15 + Math.random() * 0.25}`;
        frag.appendChild(p);
    }
    container.appendChild(frag);
}

// ============================================================
// Scroll-reveal — IntersectionObserver for .reveal-on-scroll
// ============================================================
function bindScrollReveal() {
    if (REDUCE_MOTION) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".card, .metric-card, .plot-card, .batch-card, .forecast-day").forEach(el => {
        el.classList.add("reveal-on-scroll");
        observer.observe(el);
    });
}

// Cursor-tracked radial glow used by metric/plot/crop cards
function bindCursorGlow() {
    const handler = e => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    document.querySelectorAll(".metric-card, .plot-card, .card, .batch-card").forEach(c => {
        c.addEventListener("mousemove", handler);
    });
}

// Crop cards get a subtle 3D tilt that follows the pointer
function bindCropCardTilt() {
    document.addEventListener("mousemove", () => {}, { passive: true });
    // Delegated binding — crop cards are re-rendered, so attach via event delegation
    const wrap = document.getElementById("your-crops-grid");
    if (!wrap) return;

    let activeCard = null;
    const reset = () => {
        if (activeCard) {
            activeCard.style.transform = "";
            activeCard = null;
        }
    };

    wrap.addEventListener("mousemove", e => {
        const card = e.target.closest(".crop-card");
        if (!card) { reset(); return; }
        if (REDUCE_MOTION) return;
        activeCard = card;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) - 0.5;
        const y = ((e.clientY - rect.top) / rect.height) - 0.5;
        const tilt = 6; // degrees — more pronounced
        card.style.transform = `translateY(-5px) perspective(600px) rotateY(${x * tilt}deg) rotateX(${-y * tilt}deg) scale(1.02)`;
        card.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    });

    wrap.addEventListener("mouseleave", reset, true);
}

// Buttons gently lean toward the cursor (max 4px)
function bindMagneticButtons() {
    document.querySelectorAll(".btn-cta, .btn-ghost").forEach(btn => {
        btn.addEventListener("mousemove", e => {
            if (REDUCE_MOTION) return;
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) - 0.5;
            const y = ((e.clientY - rect.top) / rect.height) - 0.5;
            btn.style.transform = `translate(${x * 6}px, ${y * 4 - 2}px) scale(1.02)`;
        });
        btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
}

// ============================================================
// Tab system
// ============================================================
function bindTabs() {
    document.querySelectorAll(".tab").forEach(t => {
        t.addEventListener("click", () => activateTab(t.dataset.tab));
    });
    document.querySelectorAll("[data-jump]").forEach(el => {
        el.addEventListener("click", e => {
            e.preventDefault();
            activateTab(el.dataset.jump);
        });
    });
    document.querySelectorAll("[data-tab-link]").forEach(el => {
        el.addEventListener("click", e => {
            e.preventDefault();
            activateTab(el.dataset.tabLink);
        });
    });

    window.addEventListener("resize", positionTabIndicator);
}

function activateTab(name) {
    state.activeTab = name;
    document.querySelectorAll(".tab").forEach(t => {
        const active = t.dataset.tab === name;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
    });

    // Mirror to floating dock
    document.querySelectorAll(".dock-item").forEach(d => {
        d.classList.toggle("is-active", d.dataset.tab === name);
    });
    positionDockIndicator();


    document.querySelectorAll(".view").forEach(v => {
        const target = v.dataset.section === name;
        // Re-trigger the stagger animation on every activation
        if (target) {
            v.classList.remove("is-active");
            void v.offsetWidth;
            v.classList.add("is-active");
            // Re-bind cursor glow for any newly-revealed cards
            v.querySelectorAll(".metric-card, .plot-card").forEach(c => {
                if (!c.dataset.glowBound) {
                    c.dataset.glowBound = "1";
                    c.addEventListener("mousemove", e => {
                        const rect = c.getBoundingClientRect();
                        c.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                        c.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                    });
                }
            });
        } else {
            v.classList.remove("is-active");
        }
    });

    positionTabIndicator();
    history.replaceState(null, "", `#${name}`);

    // Map needs a layout nudge when its section appears
    if (name === "conditions" && state.map) {
        setTimeout(() => state.map.invalidateSize(), 80);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function positionTabIndicator() {
    const indicator = document.querySelector(".tab-indicator");
    const active = document.querySelector(".tab.is-active");
    if (!indicator || !active) return;
    const rect = active.getBoundingClientRect();
    const parentRect = active.parentElement.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - parentRect.left - 4}px)`;
}

function bindSubTabs() {
    const subTabs = document.querySelectorAll(".sub-tab");
    const subViews = document.querySelectorAll(".sub-view");
    subTabs.forEach(t => {
        t.addEventListener("click", () => {
            const name = t.dataset.sub;
            subTabs.forEach(tt => tt.classList.toggle("is-active", tt === t));
            subViews.forEach(v => v.classList.toggle("is-active", v.dataset.subView === name));
        });
    });
}

function bindKeyboardNav() {
    const order = ["overview", "conditions", "crops", "irrigation", "analysis"];
    document.addEventListener("keydown", e => {
        if (e.target.matches("input, select, textarea")) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= order.length) {
            activateTab(order[n - 1]);
        }
    });
}

function bindHashSync() {
    window.addEventListener("hashchange", () => {
        const hash = location.hash.replace("#", "");
        if (hash && document.querySelector(`[data-section="${hash}"]`)) {
            activateTab(hash);
        }
    });
}

// ============================================================
// Crops dataset
// ============================================================
async function loadCrops() {
    try {
        const res = await fetch("/api/crops");
        const crops = await res.json();
        state.crops = crops;

        // Native select (hidden fallback) — keeps form-data semantics working
        const picker = document.getElementById("crop_picker");
        if (picker) {
            picker.innerHTML = "";
            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "— Select a crop —";
            picker.appendChild(placeholder);
            crops.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.crop_name;
                opt.textContent = c.crop_name.charAt(0).toUpperCase() + c.crop_name.slice(1);
                picker.appendChild(opt);
            });
        }

        // Custom dropdown — populated with crop icons
        initCustomCropSelect();

        // Do NOT auto-add any crop — keep selection empty
        renderChips();
    } catch (e) {
        console.error("Failed to load crops", e);
    }
}

// ============================================================
// Custom crop dropdown with icons
// ============================================================
function initCustomCropSelect() {
    const wrap = document.getElementById("crop-select");
    if (!wrap) return;
    const trigger = wrap.querySelector(".custom-select-trigger");
    const menu = wrap.querySelector(".custom-select-menu");
    const labelEl = wrap.querySelector(".custom-select-label");
    const iconEl = wrap.querySelector(".custom-select-value .opt-icon");

    if (!trigger || !menu) return;

    menu.innerHTML = "";
    state.crops.forEach(c => {
        const li = document.createElement("li");
        li.className = "custom-select-option";
        li.setAttribute("role", "option");
        li.dataset.value = c.crop_name;
        li.innerHTML = `<span class="opt-icon">${svgFor(cropIcon(c.crop_name))}</span><span>${c.crop_name}</span>`;
        li.addEventListener("click", () => {
            wrap.dataset.value = c.crop_name;
            labelEl.textContent = c.crop_name.charAt(0).toUpperCase() + c.crop_name.slice(1);
            iconEl.classList.remove("ghost");
            iconEl.innerHTML = svgFor(cropIcon(c.crop_name));
            menu.querySelectorAll(".custom-select-option").forEach(o => o.classList.remove("is-selected"));
            li.classList.add("is-selected");
            closeCropDropdown();

            // Mirror to native select for form submission semantics
            const picker = document.getElementById("crop_picker");
            if (picker) picker.value = c.crop_name;
        });
        menu.appendChild(li);
    });

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = wrap.classList.toggle("is-open");
        menu.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
        if (open) {
            // Highlight the selected option to scroll into view
            const sel = menu.querySelector(".is-selected");
            if (sel) sel.scrollIntoView({ block: "nearest" });
        }
    });

    // Click outside closes
    document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) closeCropDropdown();
    });

    function closeCropDropdown() {
        wrap.classList.remove("is-open");
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
    }

    // Disable already-selected crops dynamically
    document.addEventListener("crops-changed", () => {
        menu.querySelectorAll(".custom-select-option").forEach(opt => {
            opt.classList.toggle("is-disabled", state.selectedCrops.includes(opt.dataset.value));
        });
    });
}

function findCrop(name) { return state.crops.find(c => c.crop_name === name); }

function kcForStage(crop, stage) {
    if (!crop) return null;
    if (stage === "initial") return crop.kc_initial;
    if (stage === "end") return crop.kc_end;
    return crop.kc_mid;
}

// ============================================================
// Crop picker (chips)
// ============================================================
function bindCropPicker() {
    document.getElementById("add-crop-btn").addEventListener("click", () => {
        // Prefer the custom dropdown value
        const custom = document.getElementById("crop-select");
        const val = (custom && custom.dataset.value) || document.getElementById("crop_picker")?.value || "";
        if (!val) {
            toast("Pick a crop first", { tone: "info" });
            return;
        }
        if (state.selectedCrops.includes(val)) {
            toast(`${val} already added`, { tone: "info" });
            return;
        }
        addCrop(val);
        // Reset the dropdown
        if (custom) {
            custom.dataset.value = "";
            const label = custom.querySelector(".custom-select-label");
            const icon = custom.querySelector(".custom-select-value .opt-icon");
            if (label) label.textContent = "— Select a crop —";
            if (icon) { icon.classList.add("ghost"); icon.innerHTML = svgFor("sprout"); }
            custom.querySelectorAll(".custom-select-option").forEach(o => o.classList.remove("is-selected"));
        }
        const picker = document.getElementById("crop_picker");
        if (picker) picker.selectedIndex = 0;
    });

    // Clear-all button
    const clearBtn = document.getElementById("clear-crops-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            clearAllCrops();
        });
    }

    document.getElementById("crop_stage").addEventListener("change", e => {
        state.crop_stage = e.target.value;
        renderYourCrops();
        updateGeoOverview();
    });

    // Geo selected-crop dropdown change
    const geoSelect = document.getElementById("geo-selected-crop");
    if (geoSelect) {
        geoSelect.addEventListener("change", e => {
            // Could be used to highlight / focus a specific crop in future
            state.focusedCrop = e.target.value;
        });
    }
}

function addCrop(name) {
    if (!name || state.selectedCrops.includes(name)) return;
    state.selectedCrops.push(name);
    renderChips();
    renderYourCrops();
    updateGeoOverview();
    document.dispatchEvent(new CustomEvent("crops-changed"));
}

function removeCrop(name) {
    state.selectedCrops = state.selectedCrops.filter(c => c !== name);
    renderChips();
    renderYourCrops();
    updateGeoOverview();
    if (state.lastResults) {
        state.lastResults.crops = state.lastResults.crops.filter(c => c.crop.crop_name !== name);
        renderResults(state.lastResults);
    }
    document.dispatchEvent(new CustomEvent("crops-changed"));
}

function clearAllCrops() {
    state.selectedCrops = [];
    renderChips();
    renderYourCrops();
    updateGeoOverview();
    if (state.lastResults) {
        state.lastResults.crops = [];
        renderResults(state.lastResults);
    }
    document.dispatchEvent(new CustomEvent("crops-changed"));
}

function renderChips() {
    const wrap = document.getElementById("crop-chips");
    wrap.innerHTML = "";

    // Show / hide chips header with count
    const header = document.getElementById("chips-header");
    const countEl = document.getElementById("chips-count");
    if (header && countEl) {
        if (state.selectedCrops.length > 0) {
            header.hidden = false;
            countEl.textContent = `${state.selectedCrops.length} crop${state.selectedCrops.length === 1 ? "" : "s"}`;
        } else {
            header.hidden = true;
        }
    }

    state.selectedCrops.forEach(name => {
        const chip = document.createElement("span");
        chip.className = "crop-chip";
        chip.innerHTML = `<span class="chip-ic">${svgFor(cropIcon(name))}</span>${name}<button type="button" aria-label="remove ${name}">${svgFor("x")}</button>`;
        chip.querySelector("button").addEventListener("click", () => removeCrop(name));
        wrap.appendChild(chip);
    });

    // Pulse the run button when ready
    const btn = document.getElementById("submit-btn");
    if (btn) btn.classList.toggle("is-ready", state.selectedCrops.length > 0 && !btn.disabled);
}

// ============================================================
// "Your Crops" cards
// ============================================================
function renderYourCrops(perCropResults) {
    const wrap = document.getElementById("your-crops-grid");
    const hint = document.getElementById("your-crops-hint");
    wrap.innerHTML = "";

    if (state.selectedCrops.length === 0) {
        wrap.innerHTML = `<div class="your-crops-empty">Add crops from the form to see details here.</div>`;
        hint.textContent = "Your crops";
        return;
    }

    hint.textContent = `${state.selectedCrops.length} crop${state.selectedCrops.length === 1 ? "" : "s"} · Ahmednagar farm`;

    state.selectedCrops.forEach((name, idx) => {
        const c = findCrop(name);
        if (!c) return;
        const kc = kcForStage(c, state.crop_stage);
        const sim = perCropResults?.find(r => r.crop.crop_name === name);

        const card = document.createElement("div");
        card.className = "crop-card stagger-item";
        card.style.setProperty("--stagger", `${0.05 + idx * 0.06}s`);
        card.innerHTML = `
            <div class="crop-head">
                <div class="crop-name"><span class="crop-ic">${svgFor(cropIcon(name))}</span>${name}</div>
                <div class="crop-stage">${state.crop_stage}</div>
            </div>
            <div class="crop-detail-row"><span>Kc (stage)</span><strong>${kc.toFixed(2)}</strong></div>
            <div class="crop-detail-row"><span>Kc init / mid / end</span><strong>${c.kc_initial} / ${c.kc_mid} / ${c.kc_end}</strong></div>
            <div class="crop-detail-row"><span>Root depth</span><strong>${c.root_depth_m} m</strong></div>
            ${sim ? `
                <div class="crop-detail-row"><span>Batch water</span><strong>${sim.batch_total.toFixed(3)} mm</strong></div>
                <div class="crop-detail-row"><span>Events</span><strong>${sim.batch_days}</strong></div>
                <div class="crop-water-badge">5-day total · ${sumLiters(sim.schedule).toFixed(1)} L</div>
            ` : `<div class="crop-water-badge">Run simulator for water plan</div>`}
        `;
        wrap.appendChild(card);
    });

    // Update active crops count on the overview panel
    const oac = document.getElementById("overview-active-crops");
    if (oac) oac.textContent = state.selectedCrops.length;
}

function sumLiters(schedule) {
    return schedule.reduce((sum, r) => sum + (r.irrigation_liters || 0), 0);
}

// ============================================================
// Map (Leaflet)
// ============================================================
function initMap() {
    const map = L.map("farm-map", {
        zoomControl: true,
        attributionControl: true
    }).setView([AHMEDNAGAR.lat, AHMEDNAGAR.lon], 12);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap · CARTO"
    }).addTo(map);

    L.marker([AHMEDNAGAR.lat, AHMEDNAGAR.lon])
        .addTo(map)
        .bindPopup(`<strong>${AHMEDNAGAR.name}</strong><br/>Pilot farm<br/>${AHMEDNAGAR.lat.toFixed(4)}°N, ${AHMEDNAGAR.lon.toFixed(4)}°E`);

    const delta = 0.012;
    L.polygon([
        [AHMEDNAGAR.lat - delta, AHMEDNAGAR.lon - delta],
        [AHMEDNAGAR.lat - delta, AHMEDNAGAR.lon + delta],
        [AHMEDNAGAR.lat + delta, AHMEDNAGAR.lon + delta],
        [AHMEDNAGAR.lat + delta, AHMEDNAGAR.lon - delta]
    ], { color: "#4ade80", weight: 2, fillOpacity: 0.1, fillColor: "#4ade80" }).addTo(map);

    state.map = map;
    setTimeout(() => map.invalidateSize(), 250);
    window.addEventListener("resize", () => map.invalidateSize());
}

function updateGeoOverview() {
    setText("geo-num-crops", state.selectedCrops.length);

    // Populate the geo-selected-crop dropdown from user's added crops
    const geoSelect = document.getElementById("geo-selected-crop");
    if (geoSelect) {
        const prevValue = geoSelect.value;
        geoSelect.innerHTML = "";
        if (state.selectedCrops.length === 0) {
            const emptyOpt = document.createElement("option");
            emptyOpt.value = "";
            emptyOpt.textContent = "— No crops added —";
            geoSelect.appendChild(emptyOpt);
            geoSelect.disabled = true;
        } else {
            geoSelect.disabled = false;
            state.selectedCrops.forEach(name => {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
                geoSelect.appendChild(opt);
            });
            // Restore previous selection if still valid
            if (state.selectedCrops.includes(prevValue)) {
                geoSelect.value = prevValue;
            }
        }
    }

    setText("geo-pin", AHMEDNAGAR.name);
    const area = document.getElementById("area").value || "1.0";
    const unit = document.getElementById("unit").value;
    setText("geo-area", `${area} ${unit}`);
    setText("m-num-crops", state.selectedCrops.length);
    setText("overview-active-crops", state.selectedCrops.length);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================================
// Weather
// ============================================================
async function loadWeather() {
    try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        renderWeather(data);
    } catch (e) {
        console.error("Weather fetch failed", e);
    }
}

function renderWeather(data) {
    if (!data || data.status === "error") return;

    const navLoc = document.getElementById("nav-location");
    if (navLoc) navLoc.textContent = (data.location || AHMEDNAGAR.name).split(",")[0];

    const wLoc = document.getElementById("weather-location");
    if (wLoc) wLoc.textContent = data.location || AHMEDNAGAR.name;

    const statusText = document.getElementById("weather-status-text");
    if (statusText) {
        statusText.textContent = data.status === "live" ? "Live · Open-Meteo" : "Cached · using fallback CSV";
    }

    const cur = data.current || {};
    const info = weatherInfo(cur.weather_code);
    const tempStr = cur.temperature != null ? `${cur.temperature.toFixed(1)}°` : "—";
    const tempC = cur.temperature != null ? `${cur.temperature.toFixed(0)}°C` : "—";

    setText("nav-temp", tempC);
    setText("greeting-temp", tempC);
    setText("weather-now-temp", tempStr);
    setText("weather-now-desc", info.desc);
    setText("overview-temp", tempC);
    setText("overview-wind", cur.wind_speed != null ? `${cur.wind_speed.toFixed(1)} km/h` : "—");
    setText("overview-rain", cur.precipitation != null ? `${cur.precipitation.toFixed(1)} mm` : "—");

    setText("w-humidity", cur.humidity != null ? `${cur.humidity}%` : "—");
    setText("w-wind", cur.wind_speed != null ? `${cur.wind_speed.toFixed(1)} km/h` : "—");
    setText("w-rain", cur.precipitation != null ? `${cur.precipitation.toFixed(1)} mm` : "—");

    const iconEl = document.getElementById("weather-now-icon");
    if (iconEl) iconEl.innerHTML = svgFor(info.icon);

    const fcastWrap = document.getElementById("weather-forecast");
    fcastWrap.innerHTML = "";
    (data.forecast || []).forEach((d, idx) => {
        const dInfo = weatherInfo(d.weather_code);
        const dt = new Date(d.date);
        const label = isNaN(dt) ? d.date : dt.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = isNaN(dt) ? "" : dt.getDate();

        const card = document.createElement("div");
        card.className = "forecast-day stagger-item";
        card.style.setProperty("--stagger", `${0.08 + idx * 0.05}s`);
        card.innerHTML = `
            <div class="day-name">${label}${dayNum ? " · " + dayNum : ""}</div>
            <div class="day-icon">${svgFor(dInfo.icon)}</div>
            <div class="day-temp">${d.temp_max.toFixed(0)}° <span class="min">/ ${d.temp_min.toFixed(0)}°</span></div>
            <div class="day-rain">${d.rainfall.toFixed(1)} mm</div>
        `;
        fcastWrap.appendChild(card);
    });
}

// ============================================================
// Form
// ============================================================
function bindForm() {
    document.getElementById("area").addEventListener("input", updateGeoOverview);
    document.getElementById("unit").addEventListener("change", updateGeoOverview);

    document.getElementById("simulation-form").addEventListener("submit", async e => {
        e.preventDefault();
        const btn = document.getElementById("submit-btn");
        if (state.selectedCrops.length === 0) {
            if (btn) {
                btn.classList.add("shake");
                setTimeout(() => btn.classList.remove("shake"), 600);
            }
            toast("Add at least one crop before running", { tone: "error" });
            return;
        }

        const btnText = btn.querySelector("span");
        btn.disabled = true;
        btn.classList.remove("is-ready");
        btnText.textContent = "Running…";

        const payload = {
            area: parseFloat(document.getElementById("area").value),
            unit: document.getElementById("unit").value,
            use_api: document.getElementById("use_api").checked,
            crops: state.selectedCrops.map(name => ({
                crop_name: name,
                crop_stage: state.crop_stage
            }))
        };

        try {
            // Form is inside the config modal — restore it to its host first
            // so the simulation progress modal can fully replace the modal body
            restoreConfigFormFromModal();
            await runSimulationWithModal(payload);
        } catch (err) {
            console.error(err);
            toast("Network error while running", { tone: "error" });
        } finally {
            btn.disabled = false;
            btnText.textContent = "Run simulation";
            if (state.selectedCrops.length > 0) btn.classList.add("is-ready");
        }
    });
}

// (button-ready toggle is handled inside renderChips)

// ============================================================
// Render results
// ============================================================
function renderResults(data) {
    const num = data.num_crops || data.crops?.length || 0;
    animateNumber(document.getElementById("m-num-crops"), num, { decimals: 0 });
    animateNumber(document.getElementById("m-total-water"), data.total_water ?? 0, { decimals: 3, suffix: " mm" });
    animateNumber(document.getElementById("m-irrigation-days"), data.total_irrigation_days ?? 0, { decimals: 0 });
    animateNumber(document.getElementById("m-rmse"), data.rmse ?? 0, { decimals: 4 });

    renderYourCrops(data.crops);
    renderScheduleTabs(data.crops);
    renderBatchGrid(data.crops);
    renderPlanList(data.crops);
    renderModelComparison(data.model_comparison);
    refreshPlots();
    updateGeoOverview();

    // Re-attach expand affordance to freshly-rendered cards
    if (typeof addCue === "function") {
        document.querySelectorAll(".crop-card, .batch-card, .plan-crop, .forecast-day").forEach(addCue);
    }
}

function renderScheduleTabs(perCrop) {
    const tabsWrap = document.getElementById("schedule-tabs");
    tabsWrap.innerHTML = "";
    if (!perCrop || perCrop.length === 0) return;

    state.activeScheduleCrop = perCrop[0].crop.crop_name;

    perCrop.forEach(c => {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "crop-tab" + (c.crop.crop_name === state.activeScheduleCrop ? " is-active" : "");
        tab.textContent = c.crop.crop_name;
        tab.addEventListener("click", () => {
            state.activeScheduleCrop = c.crop.crop_name;
            tabsWrap.querySelectorAll(".crop-tab").forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");
            renderScheduleTable(c.schedule);
        });
        tabsWrap.appendChild(tab);
    });

    renderScheduleTable(perCrop[0].schedule);
}

function renderScheduleTable(schedule) {
    const tbody = document.querySelector("#schedule-table tbody");
    tbody.innerHTML = "";
    (schedule || []).forEach(row => {
        const tr = document.createElement("tr");
        const dateStr = row.date ? String(row.date).substring(0, 10) : `Day ${row.forecast_day ?? "-"}`;
        const moisture = (row.predicted_soil_moisture ?? row.soil_moisture ?? 0).toFixed(3);
        const rainfall = (row.forecast_rainfall ?? row.rainfall ?? 0).toFixed(1);
        const temp = (row.forecast_temperature ?? 0).toFixed(1);
        const liters = (row.irrigation_liters ?? 0).toFixed(2);
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${moisture}</td>
            <td>${rainfall} mm</td>
            <td>${temp} °C</td>
            <td><strong>${liters}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderBatchGrid(perCrop) {
    const wrap = document.getElementById("batch-grid");
    wrap.innerHTML = "";
    if (!perCrop) return;
    perCrop.forEach(c => {
        const totalL = sumLiters(c.schedule);
        const card = document.createElement("div");
        card.className = "batch-card";
        card.innerHTML = `
            <div class="batch-card-head">
                <strong><span class="crop-ic">${svgFor(cropIcon(c.crop.crop_name))}</span>${c.crop.crop_name}</strong>
                <span class="crop-stage">${c.crop.stage}</span>
            </div>
            <div class="batch-card-stat"><span>Batch total</span><strong>${c.batch_total.toFixed(3)} mm</strong></div>
            <div class="batch-card-stat"><span>Events</span><strong>${c.batch_days}</strong></div>
            <div class="batch-card-stat"><span>5-day liters</span><strong>${totalL.toFixed(1)} L</strong></div>
            <div class="batch-card-stat"><span>Crop Kc</span><strong>${c.crop.kc.toFixed(2)}</strong></div>
        `;
        wrap.appendChild(card);
    });
}

function renderPlanList(perCrop) {
    const wrap = document.getElementById("plan-list");
    wrap.innerHTML = "";
    if (!perCrop) return;
    perCrop.forEach(c => {
        const block = document.createElement("div");
        block.className = "plan-crop";
        const daysHtml = (c.schedule || []).map(row => {
            const label = row.date ? String(row.date).substring(5, 10) : `D${row.forecast_day}`;
            const liters = (row.irrigation_liters ?? 0).toFixed(1);
            const rain = (row.forecast_rainfall ?? 0).toFixed(1);
            const temp = (row.forecast_temperature ?? 0).toFixed(0);
            return `
                <div class="plan-day">
                    <div class="day-label">${label}</div>
                    <div class="day-amount">${liters} L</div>
                    <div class="day-meta">${temp}° · ${rain} mm</div>
                </div>
            `;
        }).join("");
        block.innerHTML = `
            <div class="plan-crop-head">
                <strong><span class="crop-ic">${svgFor(cropIcon(c.crop.crop_name))}</span>${c.crop.crop_name} <span class="plan-stage">(${c.crop.stage})</span></strong>
                <span class="hint">5-day total · ${sumLiters(c.schedule).toFixed(1)} L</span>
            </div>
            <div class="plan-days">${daysHtml}</div>
        `;
        wrap.appendChild(block);
    });
}

function renderModelComparison(rows) {
    const tbody = document.querySelector("#comparison-table tbody");
    tbody.innerHTML = "";
    if (!rows) return;
    rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${row.Model}</strong></td>
            <td>${row.RMSE.toFixed(4)}</td>
            <td>${row.MAE.toFixed(4)}</td>
            <td>${row["Inference Time (ms)"].toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function refreshPlots() {
    const ts = Date.now();
    document.getElementById("plot-1").src = `/plots/plot_1_moisture.png?t=${ts}`;
    document.getElementById("plot-2").src = `/plots/plot_2_irrigation.png?t=${ts}`;
    document.getElementById("plot-3").src = `/plots/plot_3_water_usage.png?t=${ts}`;
    document.getElementById("plot-4").src = `/plots/plot_4_stress_days.png?t=${ts}`;
    document.getElementById("plot-5").src = `/plots/plot_5_forecast.png?t=${ts}`;
}

// ============================================================
// MODAL SYSTEM — backdrop blur + spring-in
// ============================================================
function initModalLayer() {
    if (document.getElementById("modal-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
        <div class="modal-shell" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Close">${svgFor("x")}</button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", e => {
        if (e.target === backdrop) closeModal();
    });
    backdrop.querySelector(".modal-close").addEventListener("click", closeModal);

    // Wire up dedicated "Open simulator" triggers
    document.querySelectorAll("[data-open-config]").forEach(btn => {
        btn.addEventListener("click", openConfigModal);
    });
}

function openModal(html, opts = {}) {
    initModalLayer();
    const backdrop = document.getElementById("modal-backdrop");
    const shell = backdrop.querySelector(".modal-shell");
    const body = backdrop.querySelector(".modal-body");

    if (opts.size) shell.dataset.size = opts.size;
    else delete shell.dataset.size;

    body.innerHTML = html;
    renderIcons(body);

    backdrop.classList.add("is-open");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", _escClose);

    return backdrop;
}

function closeModal() {
    const backdrop = document.getElementById("modal-backdrop");
    if (!backdrop) return;

    // If the config form is currently in the modal, move it back to its host
    restoreConfigFormFromModal();

    backdrop.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", _escClose);
}

// ============================================================
// CONFIG MODAL  ·  move the form into the shared modal, back on close
// ============================================================
function openConfigModal() {
    initModalLayer();
    const host = document.getElementById("config-form-host");
    if (!host) return;

    const backdrop = document.getElementById("modal-backdrop");
    const shell = backdrop.querySelector(".modal-shell");
    const body = backdrop.querySelector(".modal-body");

    shell.dataset.size = "md";
    shell.classList.add("modal-config");

    // Move all of host's children into the body (form, header, etc.)
    body.innerHTML = "";
    Array.from(host.childNodes).forEach(n => body.appendChild(n));
    host.hidden = true;

    backdrop.classList.add("is-open");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", _escClose);

    // Re-render icons inside the newly-visible form (some elements rendered fresh)
    renderIcons(body);
}

function restoreConfigFormFromModal() {
    const backdrop = document.getElementById("modal-backdrop");
    const host = document.getElementById("config-form-host");
    if (!backdrop || !host) return;
    const body = backdrop.querySelector(".modal-body");
    const shell = backdrop.querySelector(".modal-shell");

    // If the host's children moved into the body, move them back
    if (body && body.querySelector("#simulation-form")) {
        Array.from(body.childNodes).forEach(n => host.appendChild(n));
        host.hidden = true;
    }
    if (shell) shell.classList.remove("modal-config");
}

function _escClose(e) {
    if (e.key === "Escape") closeModal();
}

// ============================================================
// SIMULATION MODAL — progressive steps + result summary
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runSimulationWithModal(payload) {
    const cropCount = payload.crops.length;
    const cropNames = payload.crops.map(c => c.crop_name);

    const steps = [
        { id: "load", icon: "satellite", label: "Loading SAR-calibrated dataset", duration: 360 },
        { id: "train", icon: "brain", label: "Training Random Forest · 100 trees", duration: 640 },
        { id: "compare", icon: "bar-chart", label: "Benchmarking RF vs GBM vs LSTM", duration: 520 },
        // One step per crop — uses crop icon
        ...cropNames.map((name) => ({
            id: `crop-${name}`,
            icon: cropIcon(name),
            label: `Scheduling ${name}`,
            duration: 360,
            cropName: name
        })),
        { id: "batch", icon: "zap", label: "Optimising batch irrigation", duration: 320 },
        { id: "forecast", icon: "cloud-sun", label: "Forecasting next 5 days · Open-Meteo", duration: 400 }
    ];

    openModal(`
        <div class="sim-modal">
            <div class="sim-modal-head">
                <div class="ic-tile accent"><span data-icon="droplets"></span></div>
                <div>
                    <h2>Running smart irrigation</h2>
                    <p>Ahmednagar farm · ${cropCount} crop${cropCount === 1 ? "" : "s"} · ${payload.area} ${payload.unit}</p>
                </div>
            </div>

            <div class="sim-progress">
                <div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>
                <div class="sim-progress-pct mono">0%</div>
            </div>

            <ul class="sim-steps">
                ${steps.map(s => `
                    <li data-step="${s.id}"${s.cropName ? ` data-crop="${s.cropName}"` : ""}>
                        <span class="step-icon" data-icon="circle-dashed"></span>
                        <span class="step-glyph">${svgFor(s.icon || "circle-dashed")}</span>
                        <span class="step-label">${s.label}</span>
                        <span class="step-status">Queued</span>
                    </li>
                `).join("")}
            </ul>

            <div class="sim-result" id="sim-result" hidden></div>
        </div>
    `, { size: "lg" });

    // Fire the actual request in parallel
    const fetchPromise = fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(r => r.json()).catch(err => ({ status: "error", message: err.message }));

    const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);
    let elapsed = 0;

    for (const step of steps) {
        const li = document.querySelector(`.sim-steps li[data-step="${step.id}"]`);
        if (!li) break;
        const iconEl = li.querySelector(".step-icon");
        const statusEl = li.querySelector(".step-status");

        li.classList.add("is-running");
        iconEl.innerHTML = svgFor("loader");
        statusEl.textContent = "Running…";

        await sleep(step.duration);
        elapsed += step.duration;
        updateSimProgress((elapsed / totalDuration) * 92);

        li.classList.remove("is-running");
        li.classList.add("is-done");
        iconEl.innerHTML = svgFor("check");
        statusEl.textContent = "Done";
    }

    // Wait for the request if it hasn't finished
    const result = await fetchPromise;
    updateSimProgress(100);

    if (result.status === "success") {
        state.lastResults = result.data;
        renderResults(result.data);
        showSimResult(result.data);
        confettiBurst();
    } else {
        showSimError(result.message || "Unknown error");
    }

    return result;
}

function updateSimProgress(pct) {
    const fill = document.querySelector(".sim-progress-fill");
    const pctEl = document.querySelector(".sim-progress-pct");
    if (fill) fill.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${Math.round(pct)}%`;
}

function showSimResult(data) {
    const el = document.getElementById("sim-result");
    if (!el) return;
    el.hidden = false;
    el.innerHTML = `
        <div class="sim-result-head">
            <div class="ic-tile accent"><span data-icon="check"></span></div>
            <div>
                <h3>Simulation complete</h3>
                <p>Your irrigation plan is ready.</p>
            </div>
        </div>
        <div class="sim-result-grid">
            <div class="sim-result-stat"><span>Crops</span><strong class="mono">${data.num_crops}</strong></div>
            <div class="sim-result-stat"><span>Total water</span><strong class="mono">${(data.total_water ?? 0).toFixed(3)} mm</strong></div>
            <div class="sim-result-stat"><span>Events</span><strong class="mono">${data.total_irrigation_days ?? 0}</strong></div>
            <div class="sim-result-stat"><span>Model RMSE</span><strong class="mono">${(data.rmse ?? 0).toFixed(4)}</strong></div>
        </div>
        <div class="sim-result-actions">
            <button class="btn-cta" id="sim-view-results">View dashboard <span data-icon="arrow-right"></span></button>
            <button class="btn-ghost" id="sim-close">Close</button>
        </div>
    `;
    renderIcons(el);
    el.querySelector("#sim-view-results")?.addEventListener("click", () => {
        closeModal();
        activateTab("overview");
    });
    el.querySelector("#sim-close")?.addEventListener("click", closeModal);
}

function showSimError(message) {
    const el = document.getElementById("sim-result");
    if (!el) return;
    el.hidden = false;
    el.style.borderColor = "rgba(239, 68, 68, 0.4)";
    el.style.background = "rgba(239, 68, 68, 0.06)";
    el.innerHTML = `
        <div class="sim-result-head">
            <div class="ic-tile" style="background:rgba(239,68,68,0.18);color:#fca5a5;border-color:rgba(239,68,68,0.4)"><span data-icon="x"></span></div>
            <div>
                <h3 style="color:#fca5a5">Simulation failed</h3>
                <p style="color:var(--text-2)">${message}</p>
            </div>
        </div>
        <div class="sim-result-actions">
            <button class="btn-ghost" id="sim-close">Close</button>
        </div>
    `;
    renderIcons(el);
    el.querySelector("#sim-close")?.addEventListener("click", closeModal);
}

// ============================================================
// CARD DETAIL MODALS  ·  delegated click handlers
// ============================================================
function bindCardModals() {
    // Metric cards
    document.querySelectorAll(".metric-card").forEach(card => {
        card.addEventListener("click", () => openMetricModal(card));
    });

    // Plot cards
    document.querySelectorAll(".plot-card").forEach(card => {
        card.addEventListener("click", () => openPlotModal(card));
    });

    // Crop cards (delegated)
    const cropGrid = document.getElementById("your-crops-grid");
    if (cropGrid) {
        cropGrid.addEventListener("click", e => {
            const card = e.target.closest(".crop-card");
            if (card) {
                const nameEl = card.querySelector(".crop-name");
                const name = nameEl ? nameEl.textContent.trim().toLowerCase() : null;
                if (name) openCropModal(name);
            }
        });
    }

    // Batch cards (delegated)
    const batchGrid = document.getElementById("batch-grid");
    if (batchGrid) {
        batchGrid.addEventListener("click", e => {
            const card = e.target.closest(".batch-card");
            if (card) {
                const name = card.querySelector(".batch-card-head strong")?.textContent?.trim();
                if (name) openBatchModal(name);
            }
        });
    }

    // Plan rows
    const planList = document.getElementById("plan-list");
    if (planList) {
        planList.addEventListener("click", e => {
            const card = e.target.closest(".plan-crop");
            if (card) {
                const strong = card.querySelector(".plan-crop-head strong")?.textContent || "";
                const name = strong.split("(")[0].trim().toLowerCase();
                if (name) openPlanModal(name);
            }
        });
    }

    // Forecast days
    const fc = document.getElementById("weather-forecast");
    if (fc) {
        fc.addEventListener("click", e => {
            const card = e.target.closest(".forecast-day");
            if (card) openForecastModal(card);
        });
    }
}

function openMetricModal(card) {
    const label = card.querySelector(".metric-label")?.textContent || "";
    const value = card.querySelector(".metric-value")?.textContent || "—";
    const sub = card.querySelector(".metric-sub")?.textContent || "";
    const iconHtml = card.querySelector(".ic-tile")?.outerHTML || "";

    const explainer = {
        "Crops Tracked": "Number of crops you've added to the current simulation. Each one is run through the Random Forest scheduler with its own Kc coefficient.",
        "Batch Water": "Aggregate water (in millimetres) delivered across all crops by the batch-optimised scheduler. Lower is better — provided no stress days are introduced.",
        "Irrigation Events": "Days on which the batch scheduler triggers an irrigation pulse, summed across all selected crops.",
        "Model RMSE": "Root-mean-square error of the Random Forest predictor against the held-out 20% test split. Lower is better."
    }[label.trim()] || "Live metric driven by the active simulation.";

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                ${iconHtml}
                <div>
                    <h2>${label}</h2>
                    <div class="subtitle">Calculated from the latest run · Ahmednagar pilot</div>
                </div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 3rem; font-weight: 600; letter-spacing: -1.5px; color: var(--text);">
                ${value}
            </div>
            <div class="card-modal-callout">
                <span data-icon="info" style="vertical-align:middle"></span>
                ${explainer}
            </div>
            <div class="card-modal-section">
                <h3>Source</h3>
                <p style="color: var(--text-2); font-size: 0.88rem;">${sub}</p>
            </div>
        </div>
    `, { size: "sm" });
}

function openPlotModal(card) {
    const title = card.querySelector("h4")?.textContent || "Plot";
    const legend = card.querySelector(".plot-legend")?.innerHTML || "";
    const img = card.querySelector("img");
    const src = img ? img.src : "";

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                <div class="ic-tile sky"><span data-icon="bar-chart"></span></div>
                <div>
                    <h2>${title}</h2>
                    <div class="subtitle">Regenerated on each simulation run</div>
                </div>
            </div>
            <div class="modal-plot">
                <img src="${src}" alt="${title}">
            </div>
            <div class="plot-legend" style="text-align:center;">${legend}</div>
        </div>
    `, { size: "xl" });
}

function openCropModal(name) {
    const c = findCrop(name);
    if (!c) return;
    const sim = state.lastResults?.crops?.find(x => x.crop.crop_name === name);
    const kc = kcForStage(c, state.crop_stage);

    const scheduleHtml = sim ? `
        <div class="card-modal-section">
            <h3>5-day plan</h3>
            <table class="modal-table">
                <thead><tr><th>Date</th><th>Moisture</th><th>Rain</th><th>Temp</th><th>Liters</th></tr></thead>
                <tbody>
                    ${sim.schedule.map(row => {
                        const dateStr = row.date ? String(row.date).substring(0, 10) : `Day ${row.forecast_day}`;
                        return `<tr>
                            <td>${dateStr}</td>
                            <td>${(row.predicted_soil_moisture ?? 0).toFixed(3)}</td>
                            <td>${(row.forecast_rainfall ?? 0).toFixed(1)} mm</td>
                            <td>${(row.forecast_temperature ?? 0).toFixed(1)}°</td>
                            <td><strong>${(row.irrigation_liters ?? 0).toFixed(1)}</strong></td>
                        </tr>`;
                    }).join("")}
                </tbody>
            </table>
        </div>
    ` : `<div class="card-modal-callout">Run a simulation to see the day-by-day water plan for this crop.</div>`;

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                <div class="ic-tile accent">${svgFor(cropIcon(name))}</div>
                <div>
                    <h2>${name}</h2>
                    <div class="subtitle">${state.crop_stage} stage · root depth ${c.root_depth_m} m</div>
                </div>
            </div>
            <div class="card-modal-grid">
                <div class="row"><span>Kc (initial)</span><strong>${c.kc_initial}</strong></div>
                <div class="row"><span>Kc (mid)</span><strong>${c.kc_mid}</strong></div>
                <div class="row"><span>Kc (end)</span><strong>${c.kc_end}</strong></div>
                <div class="row"><span>Kc (active)</span><strong>${kc.toFixed(2)}</strong></div>
                <div class="row"><span>Root depth</span><strong>${c.root_depth_m} m</strong></div>
                ${sim ? `<div class="row"><span>Batch water</span><strong>${sim.batch_total.toFixed(3)} mm</strong></div>` : ""}
                ${sim ? `<div class="row"><span>Events</span><strong>${sim.batch_days}</strong></div>` : ""}
                ${sim ? `<div class="row"><span>5-day total</span><strong>${sumLiters(sim.schedule).toFixed(1)} L</strong></div>` : ""}
            </div>
            ${scheduleHtml}
        </div>
    `, { size: "lg" });
}

function openBatchModal(name) {
    const sim = state.lastResults?.crops?.find(x => x.crop.crop_name === name);
    if (!sim) return;
    const totalL = sumLiters(sim.schedule);

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                <div class="ic-tile warm"><span data-icon="zap"></span></div>
                <div>
                    <h2>${name}</h2>
                    <div class="subtitle">Batch-optimised irrigation events</div>
                </div>
            </div>
            <div class="card-modal-grid">
                <div class="row"><span>Stage</span><strong>${sim.crop.stage}</strong></div>
                <div class="row"><span>Crop Kc</span><strong>${sim.crop.kc.toFixed(2)}</strong></div>
                <div class="row"><span>Batch total</span><strong>${sim.batch_total.toFixed(3)} mm</strong></div>
                <div class="row"><span>Events</span><strong>${sim.batch_days}</strong></div>
                <div class="row"><span>5-day liters</span><strong>${totalL.toFixed(1)} L</strong></div>
            </div>
            <div class="card-modal-callout">
                <span data-icon="info" style="vertical-align:middle"></span>
                Batch scheduling groups small daily irrigation amounts into ~71 practical events while keeping moisture above the critical threshold.
            </div>
        </div>
    `, { size: "sm" });
}

function openPlanModal(name) {
    const sim = state.lastResults?.crops?.find(x => x.crop.crop_name === name);
    if (!sim) return;

    const days = sim.schedule.map((row, idx) => {
        const dateStr = row.date ? String(row.date).substring(0, 10) : `Day ${row.forecast_day}`;
        return `
            <div class="row">
                <span>${dateStr}</span>
                <strong>${(row.irrigation_liters ?? 0).toFixed(1)} L</strong>
            </div>
        `;
    }).join("");

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                <div class="ic-tile sky"><span data-icon="activity"></span></div>
                <div>
                    <h2>${name} · forecast plan</h2>
                    <div class="subtitle">5-day total · ${sumLiters(sim.schedule).toFixed(1)} L</div>
                </div>
            </div>
            <div class="card-modal-grid">${days}</div>
            <table class="modal-table">
                <thead><tr><th>Date</th><th>Predicted moisture</th><th>Rain</th><th>Temp</th><th>Liters</th></tr></thead>
                <tbody>
                    ${sim.schedule.map(row => {
                        const dateStr = row.date ? String(row.date).substring(0, 10) : `Day ${row.forecast_day}`;
                        return `<tr>
                            <td>${dateStr}</td>
                            <td>${(row.predicted_soil_moisture ?? 0).toFixed(3)}</td>
                            <td>${(row.forecast_rainfall ?? 0).toFixed(1)} mm</td>
                            <td>${(row.forecast_temperature ?? 0).toFixed(1)}°</td>
                            <td><strong>${(row.irrigation_liters ?? 0).toFixed(1)}</strong></td>
                        </tr>`;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `, { size: "lg" });
}

function openForecastModal(card) {
    const day = card.querySelector(".day-name")?.textContent || "Day";
    const temp = card.querySelector(".day-temp")?.textContent || "";
    const rain = card.querySelector(".day-rain")?.textContent || "";
    const iconHtml = card.querySelector(".day-icon")?.innerHTML || "";

    openModal(`
        <div class="card-modal">
            <div class="card-modal-head">
                <div class="ic-tile sky" style="font-size:1.5rem;">${iconHtml}</div>
                <div>
                    <h2>${day}</h2>
                    <div class="subtitle">Ahmednagar · Open-Meteo</div>
                </div>
            </div>
            <div class="card-modal-grid">
                <div class="row"><span>Temperature range</span><strong>${temp}</strong></div>
                <div class="row"><span>Rainfall</span><strong>${rain}</strong></div>
            </div>
            <div class="card-modal-callout">
                <span data-icon="info" style="vertical-align:middle"></span>
                Forecasted rainfall feeds the simulator: heavier rain on this day reduces the irrigation volume scheduled the day before.
            </div>
        </div>
    `, { size: "sm" });
}

// Add small "expand" affordance to every clickable card
function addExpandCues() {
    const types = [".metric-card", ".plot-card", ".crop-card", ".batch-card", ".plan-crop"];
    types.forEach(sel => {
        document.querySelectorAll(sel).forEach(addCue);
    });
    // For dynamically created cards, observe their parents
    const observers = [
        document.getElementById("your-crops-grid"),
        document.getElementById("batch-grid"),
        document.getElementById("plan-list"),
        document.getElementById("weather-forecast")
    ].filter(Boolean);
    observers.forEach(parent => {
        const mo = new MutationObserver(() => {
            parent.querySelectorAll(".crop-card, .batch-card, .plan-crop, .forecast-day").forEach(addCue);
        });
        mo.observe(parent, { childList: true });
    });
}

function addCue(el) {
    if (el.querySelector(".card-expand-hint")) return;
    const cue = document.createElement("span");
    cue.className = "card-expand-hint";
    cue.innerHTML = svgFor("expand");
    el.appendChild(cue);
}

// ============================================================
// TOAST
// ============================================================
function toast(message, opts = {}) {
    const t = document.createElement("div");
    t.className = "toast";
    if (opts.tone) t.classList.add(`tone-${opts.tone}`);
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("is-visible"));
    const duration = opts.duration ?? 2800;
    setTimeout(() => {
        t.classList.remove("is-visible");
        setTimeout(() => t.remove(), 400);
    }, duration);
}

// ============================================================
// CONFETTI
// ============================================================
function confettiBurst() {
    if (REDUCE_MOTION) return;
    const colors = ["#4ade80", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa"];
    const wrap = document.createElement("div");
    wrap.className = "confetti-wrap";
    const count = 90;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        const startX = 50 + (Math.random() - 0.5) * 80;
        piece.style.left = `${startX}%`;
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.3}s`;
        piece.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        if (Math.random() > 0.5) piece.style.borderRadius = "50%";
        wrap.appendChild(piece);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3500);
}

// ============================================================
// MOUSE LIGHT  ·  follows the cursor
// ============================================================
function initMouseLight() {
    if (REDUCE_MOTION) return;
    // Skip on touch-primary devices — no cursor to follow
    if (window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const light = document.createElement("div");
    light.className = "mouse-light";
    document.body.appendChild(light);

    let tx = 0, ty = 0, x = 0, y = 0, dirty = false;
    document.addEventListener("mousemove", e => {
        tx = e.clientX;
        ty = e.clientY;
        dirty = true;
    }, { passive: true });

    function loop() {
        if (dirty) {
            x += (tx - x) * 0.15;
            y += (ty - y) * 0.15;
            light.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
            if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) dirty = false;
        }
        requestAnimationFrame(loop);
    }
    loop();
}

// ============================================================
// EASTER EGGS
// ============================================================
function bindEasterEggs() {
    // Konami
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let idx = 0;
    document.addEventListener("keydown", e => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expected = code[idx];
        if (key === expected) {
            idx++;
            if (idx === code.length) {
                triggerRainmaker();
                idx = 0;
            }
        } else if (key === code[0]) {
            idx = 1;
        } else {
            idx = 0;
        }
    });

    // Logo click counter (5 clicks → confetti)
    let logoClicks = 0;
    let logoTimer = null;
    document.querySelector(".brand")?.addEventListener("click", e => {
        e.preventDefault();
        logoClicks++;
        clearTimeout(logoTimer);
        logoTimer = setTimeout(() => { logoClicks = 0; }, 1200);
        if (logoClicks >= 5) {
            confettiBurst();
            const mark = document.querySelector(".brand-mark");
            if (mark) {
                mark.classList.add("celebrate");
                setTimeout(() => mark.classList.remove("celebrate"), 1500);
            }
            toast("🌱 You found a secret. Stay curious.", { tone: "success" });
            logoClicks = 0;
        }
    });

    // ? → keyboard shortcuts
    document.addEventListener("keydown", e => {
        if (e.target.matches("input, select, textarea")) return;
        if (e.key === "?") {
            e.preventDefault();
            showShortcutHelp();
        }
        if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
            // Quick-run trigger
            const form = document.getElementById("simulation-form");
            if (form && state.selectedCrops.length > 0) {
                form.dispatchEvent(new Event("submit", { cancelable: true }));
            }
        }
    });
}

function triggerRainmaker() {
    if (REDUCE_MOTION) return;
    const rain = document.createElement("div");
    rain.className = "rainmaker";
    for (let i = 0; i < 80; i++) {
        const drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 1.8}s`;
        drop.style.animationDuration = `${0.9 + Math.random() * 1.6}s`;
        drop.style.opacity = `${0.4 + Math.random() * 0.4}`;
        rain.appendChild(drop);
    }
    document.body.appendChild(rain);
    setTimeout(() => rain.remove(), 6000);
    toast("☔ Rainmaker unlocked", { tone: "success", duration: 3500 });
}

function showShortcutHelp() {
    openModal(`
        <div class="help-modal card-modal">
            <div class="card-modal-head">
                <div class="ic-tile accent"><span data-icon="keyboard"></span></div>
                <div>
                    <h2>Keyboard shortcuts</h2>
                    <div class="subtitle">Move faster — no mouse needed.</div>
                </div>
            </div>

            <div class="help-grid">
                <div class="help-row"><span>Switch to tab 1–5</span><span class="keys"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd><kbd>5</kbd></span></div>
                <div class="help-row"><span>Quick-run simulation</span><span class="keys"><kbd>R</kbd></span></div>
                <div class="help-row"><span>Close any popup</span><span class="keys"><kbd>Esc</kbd></span></div>
                <div class="help-row"><span>Show this help</span><span class="keys"><kbd>?</kbd></span></div>
                <div class="help-row hidden-shortcut"><span>Rainmaker mode 🌧</span><span class="keys"><kbd>↑↑↓↓←→←→BA</kbd></span></div>
            </div>

            <div class="help-footer">
                <span data-icon="sparkles" style="vertical-align:middle"></span>
                Try clicking the logo five times — there's a small surprise.
            </div>
        </div>
    `, { size: "sm" });
}

// ============================================================
// FLOATING DOCK
// ============================================================
function bindFloatingDock() {
    const dock = document.querySelector(".floating-dock");
    if (!dock) return;

    // Tab buttons
    dock.querySelectorAll(".dock-item").forEach(item => {
        item.addEventListener("click", () => {
            const tab = item.dataset.tab;
            if (tab) activateTab(tab);
        });
    });

    // Run-simulation pill — always opens the config modal so the user can
    // review crops & settings, then click Run inside the popup
    const runBtn = document.getElementById("dock-run");
    if (runBtn) {
        runBtn.addEventListener("click", () => {
            openConfigModal();
        });
    }

    // Initial indicator position
    setTimeout(positionDockIndicator, 50);
    window.addEventListener("resize", positionDockIndicator, { passive: true });
}

function positionDockIndicator() {
    const indicator = document.querySelector(".dock-indicator");
    const active = document.querySelector(".dock-item.is-active");
    if (!indicator || !active) return;
    const bar = active.parentElement;
    const rect = active.getBoundingClientRect();
    const parentRect = bar.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - parentRect.left - 8}px)`;
}

// ============================================================
// MULTI-LANGUAGE GREETING  (cycles every ~2.4s)
// ============================================================
const GREETINGS = [
    { lang: "English",    text: "Hello" },
    { lang: "हिन्दी",       text: "Namaste" },
    { lang: "मराठी",       text: "Namaskar" },
    { lang: "Español",    text: "Hola" },
    { lang: "Français",   text: "Bonjour" },
    { lang: "Deutsch",    text: "Hallo" },
    { lang: "Italiano",   text: "Ciao" },
    { lang: "Português",  text: "Olá" },
    { lang: "日本語",       text: "こんにちは" },
    { lang: "한국어",        text: "안녕" },
    { lang: "中文",         text: "你好" },
    { lang: "العربية",     text: "مرحبا" },
    { lang: "Русский",    text: "Привет" },
    { lang: "Ελληνικά",   text: "Γεια" },
    { lang: "Türkçe",     text: "Merhaba" },
    { lang: "Nederlands", text: "Hallo" },
    { lang: "ਪੰਜਾਬੀ",       text: "Sat Sri Akaal" },
    { lang: "தமிழ்",       text: "Vanakkam" },
    { lang: "తెలుగు",      text: "Namaskaram" },
    { lang: "বাংলা",       text: "Nomoshkar" },
    { lang: "ภาษาไทย",   text: "Sawasdee" },
    { lang: "Tiếng Việt", text: "Xin chào" },
    { lang: "Kiswahili",  text: "Jambo" },
    { lang: "עברית",      text: "Shalom" },
    { lang: "Suomi",      text: "Hei" }
];

function initGreeting() {
    const helloEl = document.getElementById("greeting-hello");
    const langEl  = document.getElementById("greeting-lang");
    const timeEl  = document.getElementById("greeting-time");
    if (!helloEl) return;

    function timeOfDay() {
        const h = new Date().getHours();
        if (h < 5)  return "still awake";
        if (h < 12) return "good morning";
        if (h < 17) return "good afternoon";
        if (h < 21) return "good evening";
        return "good night";
    }
    if (timeEl) timeEl.textContent = timeOfDay();

    // Faster cycle — 1300ms interval, 200ms fade
    let idx = 0;
    function cycle() {
        idx = (idx + 1) % GREETINGS.length;
        const g = GREETINGS[idx];
        helloEl.classList.add("is-fading");
        if (langEl) langEl.classList.add("is-fading");
        setTimeout(() => {
            helloEl.textContent = g.text;
            helloEl.setAttribute("data-lang", g.lang);
            if (langEl) langEl.textContent = g.lang;
            helloEl.classList.remove("is-fading");
            if (langEl) langEl.classList.remove("is-fading");
        }, 200);
    }

    if (!REDUCE_MOTION) {
        setInterval(cycle, 1300);
    }
}

// ============================================================
// CLOCK + temperature on the greeting line
// ============================================================
function initClock() {
    const clockEl = document.getElementById("greeting-clock");
    if (!clockEl) return;

    function tick() {
        // Show local Ahmednagar time (IST = UTC+5:30)
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const ist = new Date(utc + (5.5 * 60 * 60 * 1000));
        const hh = String(ist.getHours()).padStart(2, "0");
        const mm = String(ist.getMinutes()).padStart(2, "0");
        clockEl.textContent = `${hh}:${mm} IST`;
    }
    tick();
    setInterval(tick, 30000);

    // The greeting-temp field gets the current temperature
    // (renderWeather already sets it as soon as the weather API resolves)
}

// ============================================================
// 3D GLOBE  (globe.gl + Three.js)
// ============================================================
function initGlobe() {
    const container = document.getElementById("globe-container");
    if (!container) return;

    // Wait one frame so layout (width) is known
    requestAnimationFrame(() => {
        if (typeof Globe === "undefined" || typeof THREE === "undefined") {
            console.warn("globe.gl not available — using CSS fallback");
            container.classList.add("globe-fallback");
            return;
        }

        try {
            const size = container.offsetWidth || 360;

            const globe = Globe()
                .width(size)
                .height(size)
                .backgroundColor("rgba(0,0,0,0)")
                .globeImageUrl("https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg")
                .bumpImageUrl("https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png")
                .showAtmosphere(true)
                .atmosphereColor("#4ade80")
                .atmosphereAltitude(0.18)
                .pointsData([{
                    lat: AHMEDNAGAR.lat,
                    lng: AHMEDNAGAR.lon,
                    label: "Ahmednagar Pilot Farm",
                    size: 0.6,
                    color: "#4ade80"
                }])
                .pointAltitude(0.05)
                .pointColor("color")
                .pointRadius("size")
                .pointLabel(d => `<div style="background:#11141a;color:#fafafa;padding:6px 10px;border:1px solid rgba(255,255,255,.1);border-radius:6px;font-family:Inter;font-size:12px;">${d.label}</div>`)
                .ringsData([{
                    lat: AHMEDNAGAR.lat,
                    lng: AHMEDNAGAR.lon,
                    maxR: 4,
                    propagationSpeed: 1.5,
                    repeatPeriod: 2200
                }])
                .ringColor(() => t => `rgba(74, 222, 128, ${1 - t})`)
                .ringMaxRadius("maxR")
                .ringPropagationSpeed("propagationSpeed")
                .ringRepeatPeriod("repeatPeriod")
                (container);

            // Auto-rotate; mouse-drag rotates manually
            const controls = globe.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.6;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.rotateSpeed = 0.4;

            // Set initial viewpoint near Ahmednagar
            globe.pointOfView({ lat: AHMEDNAGAR.lat, lng: AHMEDNAGAR.lon - 40, altitude: 2.4 }, 0);

            // Resize handler
            const resize = () => {
                const w = container.offsetWidth || 360;
                globe.width(w);
                globe.height(w);
            };
            window.addEventListener("resize", resize, { passive: true });

            // Pause auto-rotate while user drags
            container.addEventListener("mousedown", () => { controls.autoRotate = false; });
            container.addEventListener("mouseup", () => {
                clearTimeout(state._globeResumeTimer);
                state._globeResumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
            });
            container.addEventListener("touchstart", () => { controls.autoRotate = false; }, { passive: true });
            container.addEventListener("touchend", () => {
                clearTimeout(state._globeResumeTimer);
                state._globeResumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
            });

            state.globe = globe;
        } catch (e) {
            console.error("Globe init failed", e);
            container.classList.add("globe-fallback");
        }
    });
}

// ============================================================
// THEME TOGGLE  (dark / light)
// ============================================================
function initTheme() {
    // Saved → preferred → default dark
    const saved = localStorage.getItem("aqua-theme");
    let theme = saved;
    if (!theme) {
        const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        theme = prefersLight ? "light" : "dark";
    }
    setTheme(theme, false);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
        btn.addEventListener("click", () => {
            const cur = document.documentElement.dataset.theme || "dark";
            const next = cur === "dark" ? "light" : "dark";
            setTheme(next, true);
        });
    }
}

function setTheme(theme, animate) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("aqua-theme", theme);

    if (animate) {
        toast(theme === "light" ? "Light mode" : "Dark mode", { tone: "info", duration: 1600 });
        // Subtle confetti burst on switch
        if (!REDUCE_MOTION && Math.random() < 0.18) confettiBurst();
    }
}

