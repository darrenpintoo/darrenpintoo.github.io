import { useEffect, useLayoutEffect, useRef } from 'react';
import { createVeil } from './veilShader';

const DURATION_MS = 2000;
const FADE_MS = 260;
const EDGE = 0.24;        // must match the veil's edge in veilShader
const FADE_SPAN = 0.34;   // how long each element takes to resolve (progress units)
const TRAIL = 0.04;       // resolve just behind the front (in its wake)
const RISE_PX = 8;        // subtle settle distance
const NOISE = 0.28;       // calmer front → element timing tracks it closely

// The above-the-fold elements to resolve individually, in the wake of the
// dissolve front. Wrappers (.animate-blur-fade blocks) stay visible via CSS;
// these leaf units get their opacity/rise driven by the shared loop.
const REVEAL_SELECTORS = [
    '.header',
    'main h1',
    '.header-status-pill',
    '.subtitle',
    'img.profile-image',
    '.profile-section > p',
    '.latest-post-card',
];

function smoothstep(a, b, x) {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
}

// Idea #3: instead of freezing the elements' entrance (shader-only) or running
// them independently (the muddy overlap), a single rAF drives BOTH the veil
// dissolve and each element's fade+settle, timed so every element resolves
// exactly as the dissolve front reaches it — one coordinated wave out from the
// name and photo.
function CoordinatedReveal({ onComplete }) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;

        let rafId = 0;
        let fadeTimeout = 0;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Suppress the elements' own CSS entrances (without forcing their
        // opacity) so this loop is the sole controller, then hide + collect the
        // above-fold targets before first paint.
        document.documentElement.classList.add('intro-coordinate');
        const seen = new Set();
        const targets = [];
        REVEAL_SELECTORS.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el) => {
                if (seen.has(el)) return;
                const r = el.getBoundingClientRect();
                if (!r.width || r.top > vh) return; // skip below-fold / hidden
                seen.add(el);
                targets.push({ el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
                el.style.opacity = '0';
                el.style.transform = `translateY(${RISE_PX}px)`;
                el.style.willChange = 'opacity, transform';
            });
        });

        const releaseTargets = () => {
            targets.forEach(({ el }) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.animation = 'none'; // lock so lifting the class can't replay
                el.style.willChange = '';
            });
            document.documentElement.classList.remove('intro-coordinate');
        };

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            cancelAnimationFrame(rafId);
            releaseTargets();
            root.style.transition = `opacity ${FADE_MS}ms ease-out`;
            root.style.opacity = '0';
            root.style.pointerEvents = 'none';
            fadeTimeout = setTimeout(() => onCompleteRef.current?.(), FADE_MS);
        };

        const veil = createVeil(canvas, { noise: NOISE });
        if (!veil) { finish(); return; }
        veil.resize();

        // Hero anchors (normalized, top-down) — same convention as the shader
        const anchor = (el, fx, fy) => {
            if (!el) return [fx, fy];
            const r = el.getBoundingClientRect();
            if (!r.width) return [fx, fy];
            return [(r.left + r.width / 2) / vw, (r.top + r.height / 2) / vh];
        };
        const nameN = anchor(document.querySelector('main h1'), 0.32, 0.24);
        const photoN = anchor(document.querySelector('img.profile-image'), 0.5, 0.5);
        veil.setAnchors(nameN, photoN);

        // Each element's arrival = the uProgress at which the dissolve front
        // reaches it, derived from its radial distance to the nearer hero
        // anchor. Mirrors the shader field so DOM and veil resolve together.
        const aspect = vw / vh;
        const norm = 0.62 * Math.hypot(aspect, 1);
        const nax = nameN[0] * aspect, nay = 1 - nameN[1];
        const pax = photoN[0] * aspect, pay = 1 - photoN[1];
        targets.forEach((tg) => {
            const ax = (tg.cx / vw) * aspect;
            const ay = 1 - tg.cy / vh;
            const dName = Math.hypot(ax - nax, ay - nay) * 0.82;
            const dPhoto = Math.hypot(ax - pax, ay - pay);
            const field = Math.min(dName, dPhoto) / norm;          // ~[0,1]
            tg.arrival = (field + EDGE) / (1 + 2 * EDGE) + TRAIL;   // veil-clear centre + wake
        });

        veil.draw(); // covered first frame (no flash)

        let start = 0;
        const draw = (now) => {
            if (doneRef.current) return;
            if (!start) start = now;
            const elapsed = (now - start) / 1000;
            const t = Math.min((elapsed * 1000) / DURATION_MS, 1);
            const eased = t * t * t * (t * (t * 6.0 - 15.0) + 10.0); // smootherstep

            veil.setProgress(eased);
            veil.setTime(elapsed);
            veil.draw();

            for (let i = 0; i < targets.length; i++) {
                const tg = targets[i];
                const local = smoothstep(tg.arrival - FADE_SPAN / 2, tg.arrival + FADE_SPAN / 2, eased);
                tg.el.style.opacity = String(local);
                tg.el.style.transform = local >= 1 ? 'none' : `translateY(${(1 - local) * RISE_PX}px)`;
            }

            if (t >= 1) { finish(); return; }
            rafId = requestAnimationFrame(draw);
        };
        rafId = requestAnimationFrame(draw);

        const resize = () => veil.resize(); // element positions frozen mid-intro
        window.addEventListener('resize', resize);
        const onKey = (e) => { if (e.key === 'Escape') finish(); };
        window.addEventListener('keydown', onKey);
        root.addEventListener('click', finish);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(fadeTimeout);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', onKey);
            root.removeEventListener('click', finish);
            if (!doneRef.current) releaseTargets(); // never leave content hidden
        };
    }, []);

    return (
        <div ref={rootRef} className="intro-overlay" aria-hidden="true">
            <canvas ref={canvasRef} className="intro-canvas" />
        </div>
    );
}

export default CoordinatedReveal;
