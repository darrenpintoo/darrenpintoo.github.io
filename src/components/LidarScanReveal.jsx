import { useEffect, useRef, useCallback } from 'react';

const DURATION = 1200;
const CELL = 4;

function getThemeColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? [10, 10, 10] : [250, 250, 250];
}

function buildShuffledOrder(total) {
    const order = new Array(total);
    for (let i = 0; i < total; i++) order[i] = i;
    for (let i = total - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }
    return order;
}

function LidarScanReveal({ onComplete, contentReady = true }) {
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const onCompleteRef = useRef(onComplete);
    const skippedRef = useRef(false);
    const lidarDoneRef = useRef(false);
    const contentReadyRef = useRef(contentReady);
    onCompleteRef.current = onComplete;
    contentReadyRef.current = contentReady;

    const finish = useCallback(() => {
        if (skippedRef.current) return;
        skippedRef.current = true;
        onCompleteRef.current?.();
    }, []);

    const start = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w, h, cols, rows, totalCells, order, cleared;

        const setup = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / CELL);
            rows = Math.ceil(h / CELL);
            totalCells = cols * rows;
            order = buildShuffledOrder(totalCells);
            cleared = new Uint8Array(totalCells);
        };

        setup();

        const onResize = () => {
            const oldW = w, oldH = h;
            w = window.innerWidth;
            h = window.innerHeight;
            if (w === oldW && h === oldH) return;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / CELL);
            rows = Math.ceil(h / CELL);
            totalCells = cols * rows;
            order = buildShuffledOrder(totalCells);
            cleared = new Uint8Array(totalCells);

            const [bgR, bgG, bgB] = getThemeColor();
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, w, h);
        };
        window.addEventListener('resize', onResize);

        const [bgR, bgG, bgB] = getThemeColor();
        ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
        ctx.fillRect(0, 0, w, h);

        const globalStart = performance.now();
        let rafId;

        const draw = () => {
            if (skippedRef.current) return;

            const elapsed = performance.now() - globalStart;
            const t = Math.min(elapsed / DURATION, 1);

            // Slow start, fast middle, gentle end
            const eased = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const cellsToClear = Math.floor(eased * totalCells);
            for (let i = 0; i < cellsToClear; i++) {
                if (cleared[i]) continue;
                cleared[i] = 1;
                const idx = order[i];
                const cx = (idx % cols) * CELL;
                const cy = ((idx / cols) | 0) * CELL;
                ctx.clearRect(cx, cy, CELL, CELL);
            }

            // Gentle opacity fade at the tail so remnant pixels don't pop
            if (t > 0.8 && overlayRef.current) {
                overlayRef.current.style.opacity = String(1 - ((t - 0.8) / 0.2));
            }

            if (t >= 1) {
                lidarDoneRef.current = true;
                if (contentReadyRef.current) {
                    finish();
                }
                return;
            }

            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
        };
    }, [finish]);

    useEffect(() => {
        if (contentReady && lidarDoneRef.current) {
            finish();
        }
    }, [contentReady, finish]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') finish(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [finish]);

    useEffect(() => {
        const cleanup = start();
        return cleanup;
    }, [start]);

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
