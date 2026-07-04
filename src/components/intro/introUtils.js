// Shared helpers for the intro animations: a seeded PRNG (so the
// "physics" is deterministic — every visitor sees the same choreography),
// and a DOM sampler that turns the real rendered page into target dots.

export const INTRO_VARIANT_NAMES = ['shader', 'orbit', 'balls', 'flow', 'scan'];
export const DEFAULT_INTRO = 'shader';

// Dev/testing switch: ?intro=balls|flow|scan|none forces a variant and
// bypasses the once-per-session gate; add &slow=1 for 6x slow motion.
export function getForcedIntro() {
    try {
        const value = new URLSearchParams(window.location.search).get('intro');
        if (value && (INTRO_VARIANT_NAMES.includes(value) || value === 'none')) return value;
    } catch { /* ignore */ }
    return null;
}

export function getIntroSlowMo() {
    try {
        if (new URLSearchParams(window.location.search).get('slow')) return 6;
    } catch { /* ignore */ }
    return 1;
}

export function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Wait for fonts + the profile photo so sampled geometry/colors are stable.
// Races a timeout so a slow network can never stall the intro.
export function waitForPageReady(timeoutMs = 550) {
    const fonts = (document.fonts && document.fonts.ready) || Promise.resolve();
    const img = document.querySelector('img.profile-image');
    const imgReady = img && !img.complete
        ? new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        })
        : Promise.resolve();
    const minWait = new Promise((resolve) => setTimeout(resolve, 250));
    const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
    return Promise.race([Promise.all([fonts, imgReady, minWait]), timeout]);
}

const OUTLINE_SELECTORS =
    '.status-pill, .theme-toggle, .nav-links, .latest-post-card, .post-card, .course-card, .semester-review-card';

// Sample the live page into { x, y, color, r } dots:
// - text gets one dot row per line box, in its real rendered color
// - bordered containers get outline dots in their border color
// - the profile photo becomes a dot portrait with real pixel colors
export function sampleLayout({ spacing = 13, maxPoints = 850 } = {}) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const seen = new Set();
    const points = [];
    // Dedup pitch ~= disc diameter so sampled targets never sit closer than a
    // disc can pack — keeps the collision packer from fighting itself
    const cell = Math.max(6, spacing * 0.82);

    const add = (x, y, color, r = 2.4) => {
        if (x < 2 || x > vw - 2 || y < 2 || y > vh - 2) return;
        const key = ((x / cell) | 0) + ':' + ((y / cell) | 0);
        if (seen.has(key)) return;
        seen.add(key);
        points.push({ x, y, color, r });
    };

    // Text line boxes via Range so wrapped lines each get their own row
    const range = document.createRange();
    document.querySelectorAll('header, main').forEach((root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) =>
                node.textContent.trim().length > 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
        });
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent) continue;
            const style = getComputedStyle(parent);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            const color = style.color;
            const fontPx = parseFloat(style.fontSize) || 16;
            range.selectNodeContents(node);
            for (const rect of range.getClientRects()) {
                if (rect.width < 4 || rect.bottom < 0 || rect.top > vh) continue;
                // Denser fill: multiple rows per text line, tight columns, so
                // glyph runs read as solid packed bars rather than thin dots
                const glyphH = Math.min(rect.height * 0.66, fontPx * 1.0);
                const rows = Math.max(2, Math.round(glyphH / (spacing * 0.7)));
                const step = spacing * 0.85;
                for (let ri = 0; ri < rows; ri++) {
                    const y = rect.top + rect.height / 2
                        + (rows > 1 ? (ri / (rows - 1) - 0.5) * glyphH : 0);
                    for (let x = rect.left + 2; x <= rect.right - 2; x += step) {
                        add(x, y, color, fontPx > 26 ? 3 : 2.4);
                    }
                }
            }
        }
    });

    // Bordered containers become dotted outlines
    document.querySelectorAll(OUTLINE_SELECTORS).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || rect.bottom < 0 || rect.top > vh) return;
        const color = getComputedStyle(el).borderTopColor;
        const perim = 2 * (rect.width + rect.height);
        const n = Math.max(8, Math.round(perim / spacing));
        for (let i = 0; i < n; i++) {
            const d = (i / n) * perim;
            let x;
            let y;
            if (d < rect.width) {
                x = rect.left + d;
                y = rect.top;
            } else if (d < rect.width + rect.height) {
                x = rect.right;
                y = rect.top + (d - rect.width);
            } else if (d < 2 * rect.width + rect.height) {
                x = rect.right - (d - rect.width - rect.height);
                y = rect.bottom;
            } else {
                x = rect.left;
                y = rect.bottom - (d - 2 * rect.width - rect.height);
            }
            add(x, y, color, 2);
        }
    });

    // Profile photo → dot portrait sampled from real pixels (same-origin)
    const img = document.querySelector('img.profile-image');
    if (img && img.complete && img.naturalWidth > 0) {
        const rect = img.getBoundingClientRect();
        if (rect.width > 40 && rect.top < vh && rect.bottom > 0) {
            try {
                const res = 48;
                const c = document.createElement('canvas');
                c.width = res;
                c.height = res;
                const cctx = c.getContext('2d', { willReadFrequently: true });
                // approximate object-fit: cover / object-position: center 15%
                const side = Math.min(img.naturalWidth, img.naturalHeight);
                cctx.drawImage(
                    img,
                    (img.naturalWidth - side) / 2,
                    (img.naturalHeight - side) * 0.15,
                    side, side, 0, 0, res, res
                );
                const data = cctx.getImageData(0, 0, res, res).data;
                const dotStep = Math.max(9, spacing * 0.72);
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const R = rect.width / 2 - 3;
                for (let y = rect.top + 4; y < rect.bottom - 4; y += dotStep) {
                    for (let x = rect.left + 4; x < rect.right - 4; x += dotStep) {
                        if (Math.hypot(x - cx, y - cy) > R) continue;
                        const u = Math.min(res - 1, Math.max(0, Math.round(((x - rect.left) / rect.width) * res)));
                        const v = Math.min(res - 1, Math.max(0, Math.round(((y - rect.top) / rect.height) * res)));
                        const idx = (v * res + u) * 4;
                        add(x, y, `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`, 3);
                    }
                }
            } catch {
                // canvas readback failed — skip the portrait dots
            }
        }
    }

    // Stay within budget so low-end devices keep 60fps
    if (points.length > maxPoints) {
        const kept = [];
        const stride = points.length / maxPoints;
        for (let i = 0; i < points.length; i += stride) kept.push(points[Math.floor(i)]);
        return kept;
    }
    return points;
}
