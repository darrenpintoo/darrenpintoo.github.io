import { useEffect, useRef } from 'react';
import { mulberry32, sampleLayout, waitForPageReady } from './introUtils';

const CROSSFADE_MS = 480;
const SEED = 1337;
const STEP = 1 / 120;
const HOLD_MS = 160;

// A galaxy of scattered orbs that orbit the screen center, then get drawn to
// their true positions as a ramping spring (gravity) takes over. No collision
// — pure force integration — so it stays glassy-smooth at a high orb count and
// leaves silky motion trails. Deterministic (seeded) and time-bounded.
const SPACING = 8;                  // target lattice pitch (px) — smaller = more orbs
const DRAW_R = 2.7;                 // orb radius
const MAX_POINTS = 4800;
const OMEGA = 1.7;                  // initial angular velocity of the swirl (rad/s)
const SWIRL0 = 1500;               // sustaining tangential accel, decays early
const SWIRL_FADE = 0.7;            // s: swirl gone by here
const K_START = 7;                  // spring stiffness before gravity ramps
const K_END = 115;                  // spring stiffness once fully drawn in
const CONV_START = 0.18;            // s: gravity begins ramping
const CONV_RAMP = 0.95;             // s: ramp duration
const DRAG = 0.992;                 // per-step velocity damping (smoothness)
const SNAP_START = 1.25;            // s: glide stragglers home after this
const SNAP_DUR = 0.3;               // s: glide duration
const SETTLE_DIST = 1.4;
const SETTLE_SPEED = 24;

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
}

function OrbitIntro({ onComplete, slow = 1 }) {
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

        const cx = w / 2;
        const cy = h / 2;

        waitForPageReady().then(() => {
            if (cancelled || doneRef.current) return;
            const targets = sampleLayout({ spacing: SPACING, maxPoints: MAX_POINTS });
            if (targets.length < 20) {
                finish();
                return;
            }

            const N = targets.length;
            const rand = mulberry32(SEED);

            const x = new Float32Array(N);
            const y = new Float32Array(N);
            const vx = new Float32Array(N);
            const vy = new Float32Array(N);
            const tx = new Float32Array(N);
            const ty = new Float32Array(N);
            const settled = new Uint8Array(N);
            const snapping = new Uint8Array(N);
            const snapFromX = new Float32Array(N);
            const snapFromY = new Float32Array(N);
            const snapProg = new Float32Array(N);
            const colors = new Array(N);

            for (let i = 0; i < N; i++) {
                const t = targets[i];
                tx[i] = t.x;
                ty[i] = t.y;
                colors[i] = t.color;

                // Scatter uniformly across a disc that covers the viewport
                const a = rand() * Math.PI * 2;
                const rr = Math.sqrt(rand()) * Math.hypot(w, h) * 0.55;
                const sx = cx + Math.cos(a) * rr;
                const sy = cy + Math.sin(a) * rr;
                x[i] = sx;
                y[i] = sy;

                // Seed a rigid-rotation orbit around the centre
                const dx = sx - cx;
                const dy = sy - cy;
                const r = Math.hypot(dx, dy) || 1;
                const tanX = -dy / r;
                const tanY = dx / r;
                const speed = OMEGA * r;
                vx[i] = tanX * speed + (rand() - 0.5) * 24;
                vy[i] = tanY * speed + (rand() - 0.5) * 24;
            }

            let settledCount = 0;
            let simTime = 0;
            let holdStart = 0;
            let acc = 0;
            let last = performance.now();

            const stamp = (i) => {
                sctx.fillStyle = colors[i];
                sctx.beginPath();
                sctx.arc(tx[i], ty[i], DRAW_R, 0, Math.PI * 2);
                sctx.fill();
            };

            const settleOne = (i) => {
                settled[i] = 1;
                x[i] = tx[i];
                y[i] = ty[i];
                settledCount += 1;
                stamp(i);
            };

            const stepSim = () => {
                simTime += STEP;
                const conv = clamp01((simTime - CONV_START) / CONV_RAMP);
                const k = K_START + (K_END - K_START) * conv;
                const swirl = SWIRL0 * (1 - clamp01(simTime / SWIRL_FADE));
                const past = simTime >= SNAP_START;

                for (let i = 0; i < N; i++) {
                    if (settled[i]) continue;

                    if (snapping[i]) {
                        snapProg[i] += STEP / SNAP_DUR;
                        const e = easeOutCubic(snapProg[i] < 1 ? snapProg[i] : 1);
                        x[i] = snapFromX[i] + (tx[i] - snapFromX[i]) * e;
                        y[i] = snapFromY[i] + (ty[i] - snapFromY[i]) * e;
                        if (snapProg[i] >= 1) settleOne(i);
                        continue;
                    }
                    if (past) {
                        snapping[i] = 1;
                        snapFromX[i] = x[i];
                        snapFromY[i] = y[i];
                        snapProg[i] = 0;
                        continue;
                    }

                    let ax = (tx[i] - x[i]) * k;
                    let ay = (ty[i] - y[i]) * k;
                    if (swirl > 0) {
                        const dx = x[i] - cx;
                        const dy = y[i] - cy;
                        const r = Math.hypot(dx, dy) || 1;
                        ax += (-dy / r) * swirl;
                        ay += (dx / r) * swirl;
                    }
                    vx[i] = (vx[i] + ax * STEP) * DRAG;
                    vy[i] = (vy[i] + ay * STEP) * DRAG;
                    x[i] += vx[i] * STEP;
                    y[i] += vy[i] * STEP;

                    if (conv > 0.5) {
                        const ddx = tx[i] - x[i];
                        const ddy = ty[i] - y[i];
                        if (ddx * ddx + ddy * ddy < SETTLE_DIST * SETTLE_DIST
                            && vx[i] * vx[i] + vy[i] * vy[i] < SETTLE_SPEED * SETTLE_SPEED) {
                            settleOne(i);
                        }
                    }
                }
            };

            const draw = (now) => {
                if (doneRef.current) return;
                acc += Math.min((now - last) / 1000, 0.05) / slow;
                last = now;
                let steps = 0;
                while (acc >= STEP && steps < 8) {
                    stepSim();
                    acc -= STEP;
                    steps += 1;
                }

                // Silky trails: fade the previous frame toward transparent
                lctx.globalCompositeOperation = 'destination-out';
                lctx.fillStyle = 'rgba(0,0,0,0.16)';
                lctx.fillRect(0, 0, w, h);
                lctx.globalCompositeOperation = 'source-over';
                for (let i = 0; i < N; i++) {
                    if (settled[i]) continue;
                    lctx.fillStyle = colors[i];
                    lctx.beginPath();
                    lctx.arc(x[i], y[i], DRAW_R, 0, Math.PI * 2);
                    lctx.fill();
                }

                if (settledCount === N) {
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

export default OrbitIntro;
