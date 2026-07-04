// Shared WebGL "veil" shader used by the intro reveals. It paints the site's
// own ambient background (base + coral/blue glows, matching index.css) and
// dissolves it away from the hero outward, so the cover reads as the real page
// background rather than a foreign overlay. `uNoise` controls how organic vs.
// how radial/predictable the dissolve front is (lower = more predictable,
// better for coordinating DOM elements with the front).

export const VEIL_VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const VEIL_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uProgress;   // 0 = fully covered, 1 = fully revealed
uniform float uTime;
uniform float uNoise;      // weight of organic noise vs. radial bloom
uniform vec3 uBg;          // page base colour (--bg-primary)
uniform vec3 uGlowA;       // coral ambient glow (matches CSS body background)
uniform vec3 uGlowB;       // blue ambient glow (matches CSS body background)
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

// Reproduces the site's own ambient background (see body in index.css).
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

    vec2 p = ap * 2.4;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    float nf = fbm(p + 1.3 * q) * 0.5 + 0.5;

    vec2 nameA  = vec2(uName.x  * aspect, 1.0 - uName.y);
    vec2 photoA = vec2(uPhoto.x * aspect, 1.0 - uPhoto.y);
    float dName  = distance(ap, nameA) * 0.82;
    float dPhoto = distance(ap, photoA);
    float dHero  = min(dName, dPhoto);
    float radial = dHero / (0.62 * length(vec2(aspect, 1.0)));
    float field = mix(radial, nf, uNoise);

    float edge = 0.24;
    float prog = uProgress * (1.0 + 2.0 * edge) - edge;
    float cover = smoothstep(prog - edge, prog + edge, field);
    cover *= 1.0 - smoothstep(0.86, 1.0, uProgress);

    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    cover = clamp(cover + (dither - 0.5) * 0.02, 0.0, 1.0);

    vec3 bgCol = ambient(ap, aspect);
    float band = cover * (1.0 - cover) * 4.0;
    vec3 frontGlow = mix(uGlowA, uGlowB, smoothstep(0.25, 0.75, uv.x));
    vec3 rgb = mix(bgCol, frontGlow, band * 0.16);
    gl_FragColor = vec4(rgb, cover);
}
`;

// The two ambient glow colours from the body background in index.css
export const GLOW_A = [242 / 255, 92 / 255, 84 / 255];  // coral, left-centre
export const GLOW_B = [59 / 255, 130 / 255, 246 / 255]; // blue, upper-right

export function hexToRgb(hex) {
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

// Sets up the veil program on a canvas and returns a small driver API, or null
// if WebGL is unavailable / the program fails to build.
export function createVeil(canvas, { noise = 0.42 } = {}) {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
        || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VEIL_VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, VEIL_FRAG);
    const prog = vs && fs && gl.createProgram();
    if (!vs || !fs || !prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name) => gl.getUniformLocation(prog, name);
    const uRes = u('uRes');
    const uProgress = u('uProgress');
    const uTime = u('uTime');
    const uNoise = u('uNoise');
    const uBg = u('uBg');
    const uGlowA = u('uGlowA');
    const uGlowB = u('uGlowB');
    const uName = u('uName');
    const uPhoto = u('uPhoto');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const styles = getComputedStyle(document.documentElement);
    gl.uniform3fv(uBg, hexToRgb(styles.getPropertyValue('--bg-primary') || '#121212'));
    gl.uniform3fv(uGlowA, GLOW_A);
    gl.uniform3fv(uGlowB, GLOW_B);
    gl.uniform1f(uNoise, noise);
    gl.uniform1f(uProgress, 0);
    gl.uniform1f(uTime, 0);

    return {
        gl,
        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
        },
        setAnchors(name, photo) {
            gl.uniform2fv(uName, name);
            gl.uniform2fv(uPhoto, photo);
        },
        setProgress(p) { gl.uniform1f(uProgress, p); },
        setTime(sec) { gl.uniform1f(uTime, sec); },
        draw() { gl.drawArrays(gl.TRIANGLES, 0, 3); },
    };
}
