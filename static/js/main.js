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
    trash: `<svg ${SVG_ATTRS}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`
};

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
    renderIcons();
    bindTabs();
    bindSubTabs();
    bindKeyboardNav();
    bindHashSync();
    bindCursorGlow();
    bindMagneticButtons();
    bindCropCardTilt();

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

// Cursor-tracked radial glow used by metric/plot/crop cards
function bindCursorGlow() {
    const handler = e => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    document.querySelectorAll(".metric-card, .plot-card").forEach(c => {
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
        const tilt = 4; // degrees
        card.style.transform = `translateY(-3px) perspective(800px) rotateY(${x * tilt}deg) rotateX(${-y * tilt}deg)`;
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
            btn.style.transform = `translate(${x * 4}px, ${y * 3 - 2}px)`;
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

        const picker = document.getElementById("crop_picker");
        picker.innerHTML = "";

        // Placeholder option
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "— Select a crop —";
        placeholder.disabled = true;
        placeholder.selected = true;
        picker.appendChild(placeholder);

        crops.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.crop_name;
            opt.textContent = c.crop_name.charAt(0).toUpperCase() + c.crop_name.slice(1);
            picker.appendChild(opt);
        });

        // Do NOT auto-add any crop — keep selection empty
        renderChips();
    } catch (e) {
        console.error("Failed to load crops", e);
    }
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
        const picker = document.getElementById("crop_picker");
        const val = picker.value;
        if (!val) return; // ignore placeholder
        addCrop(val);
        // Reset picker back to placeholder
        picker.selectedIndex = 0;
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
        chip.innerHTML = `${name}<button type="button" aria-label="remove ${name}">${svgFor("x")}</button>`;
        chip.querySelector("button").addEventListener("click", () => removeCrop(name));
        wrap.appendChild(chip);
    });
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
                <div class="crop-name">${svgFor("sprout")}<span class="ic-sm-wrap"></span>${name}</div>
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
        // Wrap the sprout svg in a span so styling lines up
        const head = card.querySelector(".crop-name");
        const svg = head.querySelector("svg");
        if (svg) {
            svg.setAttribute("width", "14");
            svg.setAttribute("height", "14");
            svg.classList.add("ic-sm");
        }
        const placeholder = head.querySelector(".ic-sm-wrap");
        if (placeholder) placeholder.remove();
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
        if (state.selectedCrops.length === 0) {
            alert("Add at least one crop before running the simulation.");
            return;
        }

        const btn = document.getElementById("submit-btn");
        const spinner = btn.querySelector(".spinner");
        const btnText = btn.querySelector("span");
        btn.disabled = true;
        spinner.classList.remove("hidden");
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
            const res = await fetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.status === "success") {
                state.lastResults = result.data;
                renderResults(result.data);
            } else {
                alert("Simulation error: " + result.message);
            }
        } catch (err) {
            console.error(err);
            alert("Network error while running simulation.");
        } finally {
            btn.disabled = false;
            spinner.classList.add("hidden");
            btnText.textContent = "Run simulation";
        }
    });
}

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
                <strong>${c.crop.crop_name}</strong>
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
                <strong>${svgFor("sprout")}${c.crop.crop_name} (${c.crop.stage})</strong>
                <span class="hint">5-day total · ${sumLiters(c.schedule).toFixed(1)} L</span>
            </div>
            <div class="plan-days">${daysHtml}</div>
        `;
        // Ensure the sprout svg has the right size class
        const svg = block.querySelector(".plan-crop-head svg");
        if (svg) {
            svg.setAttribute("width", "14");
            svg.setAttribute("height", "14");
            svg.classList.add("ic-sm");
        }
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
