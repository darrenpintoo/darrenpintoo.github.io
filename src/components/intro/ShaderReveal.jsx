import { useEffect, useLayoutEffect, useRef } from 'react';

const DURATION_MS = 1900;
const FADE_MS = 300;

// A fullscreen WebGL fragment shader gently dissolves an opaque cover away,
// unmasking the real page. The dissolve field is genuine simplex noise with
// domain warping (organic, no grid artifacts) and blooms outward from the hero
// so the reveal feels intentional rather than a wipe. No discrete particles —
// continuous, and since it reveals the real DOM it can never look "busy".
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uProgress;   // 0 = fully covered, 1 = fully revealed
uniform float uTime;
uniform vec3 uBg;          // page base colour (--bg-primary)
uniform vec3 uGlowA;       // coral ambient glow, matches the CSS body background
uniform vec3 uGlowB;       // blue ambient glow, matches the CSS body background
uniform vec2 uName;        // hero name centre, normalized (top-down)
uniform vec2 uPhoto;       // profile photo centre, normalized (top-down)

// Ashima simplex noise (public domain) — smooth, gradient-based, no grid cells
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 4; i++){
        v += a * snoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

// Reproduces the site's own ambient background: base colour layered with the
// coral glow at 15%/50% and the blue glow at 85%/30% (see body in index.css).
// Because the cover paints exactly this, it reads as the real page background,
// not a foreign overlay.
vec3 ambient(vec2 apx, float aspect){
    vec3 col = uBg;
    float dC = distance(apx, vec2(0.15 * aspect, 0.50));
    float dB = distance(apx, vec2(0.85 * aspect, 0.70));
    col = mix(col, uGlowA, 0.08 * (1.0 - smoothstep(0.0, 0.42, dC)));
    col = mix(col, uGlowB, 0.08 * (1.0 - smoothstep(0.0, 0.42, dB)));
    return col;
}

void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;
    vec2 ap = vec2(uv.x * aspect, uv.y);
    float t = uTime * 0.12;

    // Domain-warped fbm → soft, flowing, organic field in [0,1]
    vec2 p = ap * 2.4;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    float nf = fbm(p + 1.3 * q) * 0.5 + 0.5;

    // Bloom outward from the real name + photo (flip y: uniforms are top-down).
    // The name resolves a beat before the photo, then the page radiates out.
    vec2 nameA  = vec2(uName.x  * aspect, 1.0 - uName.y);
    vec2 photoA = vec2(uPhoto.x * aspect, 1.0 - uPhoto.y);
    float dName  = distance(ap, nameA) * 0.82;
    float dPhoto = distance(ap, photoA);
    float dHero  = min(dName, dPhoto);
    float radial = dHero / (0.62 * length(vec2(aspect, 1.0)));
    float field = mix(radial, nf, 0.42);

    // Wide, soft transition front for a natural, non-choppy dissolve
    float edge = 0.24;
    float prog = uProgress * (1.0 + 2.0 * edge) - edge;
    float cover = smoothstep(prog - edge, prog + edge, field);
    // Guarantee a clean finish: sweep away any remainder in the last stretch
    cover *= 1.0 - smoothstep(0.86, 1.0, uProgress);

    // Ordered dither breaks up 8-bit banding on the gradient
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    cover = clamp(cover + (dither - 0.5) * 0.02, 0.0, 1.0);

    // The cover is the site's ambient background, so it never looks foreign.
    // The dissolve front lifts toward the local ambient glow — coral on the
    // left, blue on the right — matching where the real glows live.
    vec3 bgCol = ambient(ap, aspect);
    float band = cover * (1.0 - cover) * 4.0;
    vec3 frontGlow = mix(uGlowA, uGlowB, smoothstep(0.25, 0.75, uv.x));
    vec3 rgb = mix(bgCol, frontGlow, band * 0.16);
    gl_FragColor = vec4(rgb, cover);
}
`;

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

function hexToRgb(hex) {
    let h = (hex || '').trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const int = parseInt(h, 16);
    if (Number.isNaN(int) || h.length !== 6) return [0.07, 0.07, 0.07];
    return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

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

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            cancelAnimationFrame(rafId);
            root.style.transition = `opacity ${FADE_MS}ms ease-out`;
            root.style.opacity = '0';
            root.style.pointerEvents = 'none';
            fadeTimeout = setTimeout(() => onCompleteRef.current?.(), FADE_MS);
        };

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
            || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            // No WebGL — reveal instantly rather than block the page
            finish();
            return;
        }

        const styles = getComputedStyle(document.documentElement);
        const bg = hexToRgb(styles.getPropertyValue('--bg-primary') || '#121212');
        // The two ambient glow colours from the body background in index.css
        const glowA = [242 / 255, 92 / 255, 84 / 255];  // coral, left-centre
        const glowB = [59 / 255, 130 / 255, 246 / 255]; // blue, upper-right

        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        const prog = vs && fs && gl.createProgram();
        if (!vs || !fs || !prog) {
            finish();
            return;
        }
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            finish();
            return;
        }
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(prog, 'aPos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, 'uRes');
        const uProgress = gl.getUniformLocation(prog, 'uProgress');
        const uTime = gl.getUniformLocation(prog, 'uTime');
        const uBg = gl.getUniformLocation(prog, 'uBg');
        const uGlowA = gl.getUniformLocation(prog, 'uGlowA');
        const uGlowB = gl.getUniformLocation(prog, 'uGlowB');
        const uName = gl.getUniformLocation(prog, 'uName');
        const uPhoto = gl.getUniformLocation(prog, 'uPhoto');

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Measure the live positions of the name and photo so the dissolve
        // blooms from them. Falls back to sensible spots if not on the page.
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
            const name = anchorFrom(document.querySelector('main h1'), 0.32, 0.24);
            const photo = anchorFrom(document.querySelector('img.profile-image'), 0.5, 0.5);
            gl.uniform2fv(uName, name);
            gl.uniform2fv(uPhoto, photo);
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            setAnchors();
        };
        resize();
        window.addEventListener('resize', resize);

        gl.uniform3fv(uBg, bg);
        gl.uniform3fv(uGlowA, glowA);
        gl.uniform3fv(uGlowB, glowB);
        gl.uniform1f(uProgress, 0);
        gl.uniform1f(uTime, 0);

        // Paint the fully-covered first frame immediately (no flash of page)
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        let start = 0;
        const draw = (now) => {
            if (doneRef.current) return;
            if (!start) start = now;
            const elapsed = (now - start) / 1000;
            const t = Math.min((elapsed * 1000) / DURATION_MS, 1);
            // smootherstep — gentle acceleration and a soft, natural settle
            const eased = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
            gl.uniform1f(uProgress, eased);
            gl.uniform1f(uTime, elapsed);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (t >= 1) {
                finish();
                return;
            }
            rafId = requestAnimationFrame(draw);
        };

        // Start immediately — the dissolve runs over the real DOM as it settles,
        // so there's no need to wait (and waiting felt like a stall)
        rafId = requestAnimationFrame(draw);

        const onKey = (event) => {
            if (event.key === 'Escape') finish();
        };
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
