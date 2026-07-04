import { useEffect, useRef } from 'react';
import { mulberry32, sampleLayout, waitForPageReady } from './introUtils';

const CROSSFADE_MS = 550;
const SEED = 1337;
const STEP = 1 / 120;
const HOLD_MS = 320;
const MAX_SIM_S = 5;
const CONVERGE_START = 0.7;
const CONVERGE_RAMP = 0.9;

// Particles drift through a smooth curl-like flow field (silky swirls in
// the page's own colors), then a spring force ramps in and they condense
// onto the dot mosaic of the real page. Seeded and fixed-step, so the
// murmuration is identical on every load.
function FlowFieldIntro({ onComplete, slow = 1 }) {
    const rootRef = useRef(null);
    const settledRef = useRef(null);
    const liveRef = useRef(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const root = rootRef.current;
        const settledCanvas = settledRef.current;
        const liveCanvas = liveRef.current;
        if (!root || !settledCanvas || !liveCanvas) return;

        let rafId = 0;
        let finishTimeout = 0;
        let cancelled = false;

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            cancelAnimationFrame(rafId);
            root.style.transition = `opacity ${CROSSFADE_MS}ms ease-out`;
            root.style.opacity = '0';
            root.style.pointerEvents = 'none';
            finishTimeout = setTimeout(() => onCompleteRef.current?.(), CROSSFADE_MS);
        };

        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const sctx = settledCanvas.getContext('2d');
        const lctx = liveCanvas.getContext('2d');
        [settledCanvas, liveCanvas].forEach((c) => {
            c.width = w * dpr;
            c.height = h * dpr;
        });
        sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const field = (x, y, t) => {
            const s = 0.0021;
            const fx =
                Math.sin(y * s * 1.35 + t * 0.8) +
                Math.sin((x + y) * s * 0.75 - t * 0.5);
            const fy =
                Math.cos(x * s * 1.1 - t * 0.65) +
                Math.cos((x - y) * s * 0.9 + t * 0.45);
            return { fx: fx * 110, fy: fy * 110 };
        };

        waitForPageReady().then(() => {
            if (cancelled || doneRef.current) return;
            const targets = sampleLayout();
            if (targets.length < 20) {
                finish();
                return;
            }

            const rand = mulberry32(SEED);
            const parts = targets.map((t) => ({
                tx: t.x,
                ty: t.y,
                color: t.color,
                r: t.r,
                x: rand() * w,
                y: rand() * h,
                vx: (rand() - 0.5) * 40,
                vy: (rand() - 0.5) * 40,
                settled: false,
            }));

            let settledCount = 0;
            let simTime = 0;
            let holdStart = 0;
            let acc = 0;
            let last = performance.now();

            const stamp = (p) => {
                sctx.fillStyle = p.color;
                sctx.beginPath();
                sctx.arc(p.tx, p.ty, p.r, 0, Math.PI * 2);
                sctx.fill();
            };

            const stepSim = () => {
                simTime += STEP;
                const raw = (simTime - CONVERGE_START) / CONVERGE_RAMP;
                const c = Math.max(0, Math.min(1, raw));
                const converge = c * c * (3 - 2 * c);
                for (const p of parts) {
                    if (p.settled) continue;
                    const f = field(p.x, p.y, simTime);
                    const ax = (1 - converge) * (f.fx - p.vx * 0.7)
                        + converge * ((p.tx - p.x) * 30 - p.vx * 9);
                    const ay = (1 - converge) * (f.fy - p.vy * 0.7)
                        + converge * ((p.ty - p.y) * 30 - p.vy * 9);
                    p.vx += ax * STEP;
                    p.vy += ay * STEP;
                    p.x += p.vx * STEP;
                    p.y += p.vy * STEP;
                    if (converge > 0.6) {
                        const dist = Math.hypot(p.tx - p.x, p.ty - p.y);
                        const speed = Math.hypot(p.vx, p.vy);
                        if (dist < 1.4 && speed < 26) {
                            p.settled = true;
                            p.x = p.tx;
                            p.y = p.ty;
                            settledCount += 1;
                            stamp(p);
                        }
                    }
                }
            };

            const draw = (now) => {
                if (doneRef.current) return;
                acc += Math.min((now - last) / 1000, 0.05) / slow;
                last = now;
                while (acc >= STEP) {
                    stepSim();
                    acc -= STEP;
                }

                // long silky trails: fade the previous frame gently
                lctx.globalCompositeOperation = 'destination-out';
                lctx.fillStyle = 'rgba(0,0,0,0.22)';
                lctx.fillRect(0, 0, w, h);
                lctx.globalCompositeOperation = 'source-over';
                for (const p of parts) {
                    if (p.settled) continue;
                    lctx.fillStyle = p.color;
                    lctx.beginPath();
                    lctx.arc(p.x, p.y, Math.min(p.r, 2.2), 0, Math.PI * 2);
                    lctx.fill();
                }

                const allIn = settledCount === parts.length || simTime > MAX_SIM_S;
                if (allIn) {
                    if (!holdStart) holdStart = now;
                    if (now - holdStart >= HOLD_MS * slow) {
                        finish();
                        return;
                    }
                }
                rafId = requestAnimationFrame(draw);
            };

            rafId = requestAnimationFrame(draw);
        });

        const onKey = (event) => {
            if (event.key === 'Escape') finish();
        };
        window.addEventListener('keydown', onKey);
        root.addEventListener('click', finish);

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
            clearTimeout(finishTimeout);
            window.removeEventListener('keydown', onKey);
            root.removeEventListener('click', finish);
        };
    }, [slow]);

    return (
        <div ref={rootRef} className="intro-overlay" aria-hidden="true">
            <div className="intro-cover" />
            <canvas ref={settledRef} className="intro-canvas" />
            <canvas ref={liveRef} className="intro-canvas" />
        </div>
    );
}

export default FlowFieldIntro;
