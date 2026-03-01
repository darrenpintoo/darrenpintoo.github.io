import { useEffect, useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';

const CELL = 4;
const FLOAT_DURATION = 1200;
const SHOCKWAVE_DURATION = 1500;
const FADE_DURATION = 300;
const TOTAL_DURATION = FLOAT_DURATION + SHOCKWAVE_DURATION + FADE_DURATION;
const SNAP_MS = 220;

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function LidarScanReveal({ onComplete, contentReady = true }) {
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const onCompleteRef = useRef(onComplete);
    const skippedRef = useRef(false);
    const [captured, setCaptured] = useState(false);
    const particlesRef = useRef(null);
    const dimsRef = useRef({ w: 0, h: 0, cols: 0, rows: 0 });

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const finish = useCallback(() => {
        if (skippedRef.current) return;
        skippedRef.current = true;
        const overlay = overlayRef.current;
        if (overlay) {
            overlay.style.transition = 'opacity 0.3s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => onCompleteRef.current?.(), 300);
        } else {
            onCompleteRef.current?.();
        }
    }, []);

    // Capture screenshot when content is ready
    useEffect(() => {
        if (!contentReady || captured) return;

        const mainEl = document.querySelector('.main-content');
        const headerEl = document.querySelector('.header');
        if (!mainEl) return;

        // Temporarily show content behind the overlay (overlay z-index hides it)
        mainEl.style.opacity = '1';
        if (headerEl) headerEl.style.opacity = '1';

        // Give layout a frame to settle
        requestAnimationFrame(() => {
            html2canvas(document.body, {
                scale: 1,
                useCORS: true,
                logging: false,
                backgroundColor: null,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                ignoreElements: (el) => {
                    return el.classList?.contains('lidar-overlay');
                },
            }).then((screenshotCanvas) => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                const cols = Math.ceil(w / CELL);
                const rows = Math.ceil(h / CELL);

                const sCtx = screenshotCanvas.getContext('2d', { willReadFrequently: true });
                const imgData = sCtx.getImageData(0, 0, screenshotCanvas.width, screenshotCanvas.height);
                const sW = screenshotCanvas.width;

                const particles = new Array(cols * rows);
                const cx = w / 2;
                const cy = h / 2;
                const maxDist = Math.sqrt(cx * cx + cy * cy);

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const idx = row * cols + col;
                        const targetX = col * CELL;
                        const targetY = row * CELL;

                        // Sample color from screenshot at center of this cell
                        const sampleX = Math.min(targetX + (CELL >> 1), sW - 1);
                        const sampleY = Math.min(targetY + (CELL >> 1), screenshotCanvas.height - 1);
                        const pxIdx = (sampleY * sW + sampleX) * 4;
                        const r = imgData.data[pxIdx];
                        const g = imgData.data[pxIdx + 1];
                        const b = imgData.data[pxIdx + 2];

                        // Distance from center (for shockwave ordering)
                        const dx = targetX + CELL / 2 - cx;
                        const dy = targetY + CELL / 2 - cy;
                        const distFromCenter = Math.sqrt(dx * dx + dy * dy) / maxDist;

                        // Random starting position — scattered across viewport
                        const angle = Math.random() * Math.PI * 2;
                        const spread = Math.random() * Math.max(w, h) * 0.6;
                        const startX = cx + Math.cos(angle) * spread;
                        const startY = cy + Math.sin(angle) * spread;

                        particles[idx] = {
                            x: startX,
                            y: startY,
                            targetX,
                            targetY,
                            r, g, b,
                            colorStr: `rgb(${r},${g},${b})`,
                            vx: (Math.random() - 0.5) * 2.0,
                            vy: (Math.random() - 0.5) * 2.0,
                            distFromCenter,
                            snapStart: -1,
                        };
                    }
                }

                dimsRef.current = { w, h, cols, rows };
                particlesRef.current = particles;

                // Restore hidden state
                mainEl.style.opacity = '';
                if (headerEl) headerEl.style.opacity = '';

                setCaptured(true);
            }).catch(() => {
                // If screenshot fails, just finish the animation
                mainEl.style.opacity = '';
                if (headerEl) headerEl.style.opacity = '';
                finish();
            });
        });
    }, [contentReady, captured, finish]);

    // Run the animation once capture is done
    useEffect(() => {
        if (!captured || !particlesRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const particles = particlesRef.current;
        const { w, h } = dimsRef.current;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? 'rgb(10,10,10)' : 'rgb(250,250,250)';

        const globalStart = performance.now();
        let rafId;

        const draw = () => {
            if (skippedRef.current) return;

            const now = performance.now();
            const elapsed = now - globalStart;
            const t = Math.min(elapsed / TOTAL_DURATION, 1);

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, w, h);

            // Phase boundaries (in ms)
            const floatEnd = FLOAT_DURATION;
            const shockEnd = FLOAT_DURATION + SHOCKWAVE_DURATION;

            // Shockwave progress (0-1 during shockwave phase)
            const shockProgress = elapsed < floatEnd
                ? 0
                : Math.min((elapsed - floatEnd) / SHOCKWAVE_DURATION, 1);
            const shockEased = easeOutQuart(shockProgress);

            // Shockwave radius normalized to maxDist
            const waveFrontNorm = shockEased * 1.15;

            // Fade progress
            const fadeProgress = elapsed < shockEnd
                ? 0
                : Math.min((elapsed - shockEnd) / FADE_DURATION, 1);

            const count = particles.length;

            for (let i = 0; i < count; i++) {
                const p = particles[i];

                // Has the shockwave reached this particle's target?
                if (p.snapStart < 0 && waveFrontNorm >= p.distFromCenter && shockProgress > 0) {
                    p.snapStart = now;
                }

                if (p.snapStart > 0) {
                    // Snapping toward target
                    const snapT = Math.min((now - p.snapStart) / SNAP_MS, 1);
                    const snapEased = easeOutCubic(snapT);

                    if (snapT >= 1) {
                        // Fully settled — draw exact pixel
                        ctx.fillStyle = p.colorStr;
                        ctx.fillRect(p.targetX, p.targetY, CELL, CELL);
                    } else {
                        // Lerping toward target
                        const drawX = p.x + (p.targetX - p.x) * snapEased;
                        const drawY = p.y + (p.targetY - p.y) * snapEased;
                        ctx.fillStyle = p.colorStr;
                        ctx.fillRect(drawX, drawY, CELL, CELL);
                    }
                } else {
                    // Still floating — drift
                    p.x += p.vx;
                    p.y += p.vy;

                    // Gentle deceleration so it feels organic
                    p.vx *= 0.999;
                    p.vy *= 0.999;

                    // Wrap around edges
                    if (p.x < -CELL) p.x += w + CELL * 2;
                    if (p.x > w + CELL) p.x -= w + CELL * 2;
                    if (p.y < -CELL) p.y += h + CELL * 2;
                    if (p.y > h + CELL) p.y -= h + CELL * 2;

                    ctx.fillStyle = p.colorStr;
                    ctx.fillRect(p.x, p.y, CELL, CELL);
                }
            }

            // Draw shockwave ring
            if (shockProgress > 0 && shockProgress < 1) {
                const cx = w / 2;
                const cy = h / 2;
                const maxR = Math.sqrt(cx * cx + cy * cy);
                const ringR = shockEased * maxR * 1.15;
                const ringWidth = 40 + shockEased * 80;
                const ringOpacity = (1 - shockProgress) * 0.18;

                const innerR = Math.max(0, ringR - ringWidth / 2);
                const outerR = ringR + ringWidth / 2;

                const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.35, `rgba(242,92,84,${ringOpacity * 0.5})`);
                grad.addColorStop(0.5, `rgba(242,92,84,${ringOpacity})`);
                grad.addColorStop(0.65, `rgba(242,92,84,${ringOpacity * 0.5})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            }

            // Fade out overlay at end
            if (fadeProgress > 0 && overlayRef.current) {
                overlayRef.current.style.opacity = String(1 - easeOutCubic(fadeProgress));
            }

            if (t >= 1) {
                finish();
                return;
            }

            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(rafId);
    }, [captured, finish]);

    // Fill canvas with bg color immediately so there's no flash
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgb(10,10,10)' : 'rgb(250,250,250)';
        ctx.fillRect(0, 0, w, h);
    }, []);

    // Escape to skip
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') finish(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [finish]);

    return (
        <div ref={overlayRef} className="lidar-overlay" aria-hidden="true">
            <canvas ref={canvasRef} className="lidar-canvas" />
            <button className="lidar-skip" onClick={finish}>
                Skip
            </button>
        </div>
    );
}

export default LidarScanReveal;
