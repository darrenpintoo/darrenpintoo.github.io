import { useEffect, useRef } from 'react';
import { mulberry32, sampleLayout, waitForPageReady } from './introUtils';

const CROSSFADE_MS = 420;
const SEED = 1337;
const STEP = 1 / 120;
const HOLD_MS = 160;

// Deterministic verlet packing (Pezzza-style): a mass of uniform discs pours
// in, collides with one another via a spatial hash grid, and packs into the
// page's dot lattice. The animation is short and time-bounded — a snap
// deadline glides any straggler home so it always finishes fast.
const SPACING = 10;                 // target lattice pitch (px)
const COLLIDE_R = SPACING * 0.42;   // disc radius, a touch under half-pitch so packing is always feasible
const DRAW_R = COLLIDE_R * 1.02;    // draw just over collision radius so packed discs read as solid
const MAX_POINTS = 2800;
const GRAVITY = 2600;               // px/s², dominates before attraction ramps
const ATTRACT_K = 150;              // spring stiffness toward target (1/s²)
const DAMP = 0.90;                  // verlet velocity damping
const CONV_START = 0.12;            // s: attraction begins ramping
const CONV_RAMP = 0.45;             // s: ramp duration
const SNAP_START = 0.85;            // s: stragglers glide home after this
const SNAP_DUR = 0.24;              // s: glide duration
const COLLIDE_ITERS = 2;            // position solver passes per step

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
}

function BallDropIntro({ onComplete, slow = 1 }) {
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

        waitForPageReady().then(() => {
            if (cancelled || doneRef.current) return;
            const targets = sampleLayout({ spacing: SPACING, maxPoints: MAX_POINTS });
            if (targets.length < 20) {
                finish();
                return;
            }

            const N = targets.length;
            const rand = mulberry32(SEED);

            // Structure-of-arrays for cache-friendly hot loops
            const x = new Float32Array(N);
            const y = new Float32Array(N);
            const ox = new Float32Array(N);
            const oy = new Float32Array(N);
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
                // Spawn in a loose cloud above the fold, roughly over the
                // target column so the pour reads top-to-bottom
                const sx = t.x + (rand() - 0.5) * w * 0.45;
                const sy = -rand() * h * 0.9 - 20;
                x[i] = sx;
                y[i] = sy;
                ox[i] = sx - (rand() - 0.5) * 3;
                oy[i] = sy - (2 + rand() * 3); // initial downward velocity
            }

            // Spatial hash grid
            const cell = COLLIDE_R * 2;
            const cols = Math.max(1, Math.ceil(w / cell) + 1);
            const rows = Math.max(1, Math.ceil(h / cell) + 1);
            const heads = new Int32Array(cols * rows);
            const next = new Int32Array(N);

            const buildGrid = () => {
                heads.fill(-1);
                for (let i = 0; i < N; i++) {
                    if (settled[i]) continue;
                    let cx = (x[i] / cell) | 0;
                    let cy = (y[i] / cell) | 0;
                    if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
                    if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
                    const gi = cy * cols + cx;
                    next[i] = heads[gi];
                    heads[gi] = i;
                }
            };

            const solveCollisions = () => {
                const minDist = COLLIDE_R * 2;
                const minDist2 = minDist * minDist;
                for (let i = 0; i < N; i++) {
                    if (settled[i] || snapping[i]) continue;
                    let cx = (x[i] / cell) | 0;
                    let cy = (y[i] / cell) | 0;
                    if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
                    if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
                    for (let gy = cy - 1; gy <= cy + 1; gy++) {
                        if (gy < 0 || gy >= rows) continue;
                        for (let gx = cx - 1; gx <= cx + 1; gx++) {
                            if (gx < 0 || gx >= cols) continue;
                            let j = heads[gy * cols + gx];
                            while (j !== -1) {
                                if (j > i && !settled[j] && !snapping[j]) {
                                    const dx = x[j] - x[i];
                                    const dy = y[j] - y[i];
                                    const d2 = dx * dx + dy * dy;
                                    if (d2 > 0 && d2 < minDist2) {
                                        const d = Math.sqrt(d2);
                                        const push = (minDist - d) * 0.5;
                                        const nx = (dx / d) * push;
                                        const ny = (dy / d) * push;
                                        x[i] -= nx; y[i] -= ny;
                                        x[j] += nx; y[j] += ny;
                                    }
                                }
                                j = next[j];
                            }
                        }
                    }
                }
            };

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

            const dt2 = STEP * STEP;

            const stepSim = () => {
                simTime += STEP;
                const conv = clamp01((simTime - CONV_START) / CONV_RAMP);
                const attract = ATTRACT_K * conv;
                const grav = GRAVITY * (1 - conv);
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

                    // Verlet: implicit velocity carries collision corrections
                    const vx = (x[i] - ox[i]) * DAMP;
                    const vy = (y[i] - oy[i]) * DAMP;
                    ox[i] = x[i];
                    oy[i] = y[i];
                    const ax = (tx[i] - x[i]) * attract;
                    const ay = (ty[i] - y[i]) * attract + grav;
                    x[i] += vx + ax * dt2;
                    y[i] += vy + ay * dt2;

                    // Keep within horizontal bounds; allow above-screen spawn
                    if (x[i] < COLLIDE_R) x[i] = COLLIDE_R;
                    else if (x[i] > w - COLLIDE_R) x[i] = w - COLLIDE_R;
                    if (y[i] > h - COLLIDE_R) y[i] = h - COLLIDE_R;
                }

                buildGrid();
                for (let k = 0; k < COLLIDE_ITERS; k++) solveCollisions();
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

                lctx.clearRect(0, 0, w, h);
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

export default BallDropIntro;
