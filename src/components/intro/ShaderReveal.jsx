import { useEffect, useLayoutEffect, useRef } from 'react';
import { createVeil } from './veilShader';

const DURATION_MS = 1900;
const FADE_MS = 300;

// Dissolves the ambient-background veil away, unmasking the real page. The
// dissolve blooms from the measured name + photo so it reads as the page
// resolving into place. Continuous, theme-matched, zero dependencies.
function ShaderReveal({ onComplete }) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;

        let rafId = 0;
        let fadeTimeout = 0;

        // Hold the elements' own entrance animations at their final state so the
        // dissolve unveils settled content (no competing motion).
        document.documentElement.classList.add('intro-freeze');

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            cancelAnimationFrame(rafId);
            // Lock the revealed hero so lifting the freeze can't replay its
            // entrance; future in-app navigations then animate normally.
            document.querySelectorAll('.animate-blur-fade, .pre-animate, .profile-image')
                .forEach((el) => {
                    el.style.animation = 'none';
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
            document.documentElement.classList.remove('intro-freeze');
            root.style.transition = `opacity ${FADE_MS}ms ease-out`;
            root.style.opacity = '0';
            root.style.pointerEvents = 'none';
            fadeTimeout = setTimeout(() => onCompleteRef.current?.(), FADE_MS);
        };

        const veil = createVeil(canvas, { noise: 0.42 });
        if (!veil) {
            // No WebGL / program failed — reveal instantly rather than block
            finish();
            return;
        }
        veil.resize();

        const anchorFrom = (el, fx, fy) => {
            if (!el) return [fx, fy];
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return [fx, fy];
            return [
                (r.left + r.width / 2) / window.innerWidth,
                (r.top + r.height / 2) / window.innerHeight,
            ];
        };
        const setAnchors = () => {
            veil.setAnchors(
                anchorFrom(document.querySelector('main h1'), 0.32, 0.24),
                anchorFrom(document.querySelector('img.profile-image'), 0.5, 0.5),
            );
        };
        setAnchors();

        const resize = () => { veil.resize(); setAnchors(); };
        window.addEventListener('resize', resize);

        veil.draw(); // paint the fully-covered first frame (no flash)

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
            if (t >= 1) { finish(); return; }
            rafId = requestAnimationFrame(draw);
        };
        rafId = requestAnimationFrame(draw);

        const onKey = (event) => { if (event.key === 'Escape') finish(); };
        window.addEventListener('keydown', onKey);
        root.addEventListener('click', finish);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(fadeTimeout);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', onKey);
            root.removeEventListener('click', finish);
        };
    }, []);

    return (
        <div ref={rootRef} className="intro-overlay" aria-hidden="true">
            <canvas ref={canvasRef} className="intro-canvas" />
        </div>
    );
}

export default ShaderReveal;
