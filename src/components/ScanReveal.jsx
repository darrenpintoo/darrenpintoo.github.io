import { useEffect, useRef } from 'react';

const SWEEP_MS = 1300;
const FADE_MS = 300;
const FEATHER_DEG = 16;

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// One clockwise lidar sweep that unmasks the already-rendered page.
// The cover div hides content behind an animated conic-gradient mask;
// the canvas on top draws only the beam, faint range rings, and sparse
// scan returns — the page itself is live DOM, never a screenshot.
function ScanReveal({ onComplete }) {
    const rootRef = useRef(null);
    const coverRef = useRef(null);
    const canvasRef = useRef(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const root = rootRef.current;
        const cover = coverRef.current;
        const canvas = canvasRef.current;
        if (!root || !cover || !canvas) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim() || '#9d2235';

        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.hypot(cx, cy) + 8;

        let rafId = 0;
        let finishTimeout = 0;
        const dots = [];

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            cancelAnimationFrame(rafId);
            root.style.transition = `opacity ${FADE_MS}ms ease-out`;
            root.style.opacity = '0';
            root.style.pointerEvents = 'none';
            finishTimeout = setTimeout(() => onCompleteRef.current?.(), FADE_MS);
        };

        // Mask semantics: opaque mask pixels keep the cover visible (content
        // hidden), transparent pixels hide it (content revealed). The feather
        // is a soft edge trailing just behind the beam.
        const setMask = (deg) => {
            const lead = Math.min(deg, 360);
            const trail = Math.max(lead - FEATHER_DEG, 0);
            const value = `conic-gradient(from 0deg, transparent 0deg ${trail}deg, black ${lead}deg 360deg)`;
            cover.style.maskImage = value;
            cover.style.webkitMaskImage = value;
        };

        setMask(0);

        const start = performance.now();

        const draw = (now) => {
            if (doneRef.current) return;
            const t = Math.min((now - start) / SWEEP_MS, 1);
            const sweepDeg = easeInOutCubic(t) * 360;
            setMask(sweepDeg);

            // conic 0deg points up and runs clockwise; canvas 0rad points right
            const ang = (sweepDeg - 90) * (Math.PI / 180);
            const fade = t > 0.85 ? Math.max(1 - (t - 0.85) / 0.15, 0) : 1;

            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = accent;
            ctx.lineWidth = 1;

            ctx.globalAlpha = 0.06 * fade;
            for (let r = 90; r < maxR; r += 130) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (t < 1) {
                for (let i = 16; i >= 1; i--) {
                    const a = ang - i * 0.02;
                    ctx.globalAlpha = 0.05 * (1 - i / 16) * fade;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
                    ctx.stroke();
                }

                ctx.globalAlpha = 0.55 * fade;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
                ctx.stroke();

                if (Math.random() < 0.7) {
                    const rr = 40 + Math.random() * (maxR - 60);
                    dots.push({
                        x: cx + Math.cos(ang) * rr,
                        y: cy + Math.sin(ang) * rr,
                        born: now,
                        life: 400 + Math.random() * 350,
                        size: 1 + Math.random() * 1.4,
                    });
                }
            }

            ctx.fillStyle = accent;
            for (let i = dots.length - 1; i >= 0; i--) {
                const d = dots[i];
                const lt = (now - d.born) / d.life;
                if (lt >= 1) {
                    dots.splice(i, 1);
                    continue;
                }
                ctx.globalAlpha = 0.5 * (1 - lt) * fade;
                ctx.fillRect(d.x, d.y, d.size, d.size);
            }
            ctx.globalAlpha = 1;

            if (t >= 1) {
                finish();
                return;
            }
            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);

        const onKey = (event) => {
            if (event.key === 'Escape') finish();
        };
        window.addEventListener('keydown', onKey);
        root.addEventListener('click', finish);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(finishTimeout);
            window.removeEventListener('keydown', onKey);
            root.removeEventListener('click', finish);
        };
    }, []);

    return (
        <div ref={rootRef} className="scan-reveal" aria-hidden="true">
            <div ref={coverRef} className="scan-reveal-cover" />
            <canvas ref={canvasRef} className="scan-reveal-canvas" />
        </div>
    );
}

export default ScanReveal;
