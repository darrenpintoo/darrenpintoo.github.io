import { useEffect, useRef, useState } from 'react';

// Interactive portrait driven by the real iPhone Portrait-mode depth map (no AI).
//   mode="parallax": a 2.5D tilt; each pixel shifts by its measured depth as the
//                    pointer moves, like a window onto the scene
//   mode="points":   the photo as a 3D point cloud that orbits with the pointer
// Plain WebGL1, no dependencies. Falls back to the still image when WebGL is
// unavailable, and holds still for reduced-motion visitors.

const PARALLAX_VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Steps along the view ray so near pixels (white in the depth map) move more
// than far ones; the 0.5 focal plane stays put. A short search reduces the
// stretching at depth edges compared with a single lookup.
const PARALLAX_FS = `
precision mediump float;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uOffset;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  for (int i = 0; i < 6; i++) {
    float d = texture2D(uDepth, uv).r;
    uv = vUv + uOffset * (d - 0.45);
  }
  gl_FragColor = texture2D(uColor, clamp(uv, 0.0, 1.0));
}`;

const POINTS_VS = `
attribute vec3 aPos;
attribute vec3 aCol;
uniform vec2 uRot;
uniform float uAspect;
uniform float uSize;
varying vec3 vCol;
varying float vFog;
void main() {
  float cy = cos(uRot.x), sy = sin(uRot.x);
  float cx = cos(uRot.y), sx = sin(uRot.y);
  vec3 p = aPos;
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  float z = p.z + 1.6;
  gl_Position = vec4(p.x * 2.1 / z / uAspect, p.y * 2.1 / z, 0.5 - 0.1 / z, 1.0);
  gl_PointSize = uSize * 2.6 / z;
  vCol = aCol;
  vFog = clamp((z - 1.6) / 2.6, 0.0, 0.6);
}`;

const POINTS_FS = `
precision mediump float;
uniform vec3 uBg;
varying vec3 vCol;
varying float vFog;
void main() {
  gl_FragColor = vec4(mix(vCol, uBg, vFog), 1.0);
}`;

function compile(gl, vs, fs) {
    const prog = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
        gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    return prog;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function texture(gl, img) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}

function pixels(img, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h).data;
}

// Back-project every sampled pixel to 3D using its depth; drop sky (no depth
// return) and depth discontinuities, which would smear between layers
function buildCloud(colorImg, depthImg, step) {
    const w = depthImg.naturalWidth, h = depthImg.naturalHeight;
    const dep = pixels(depthImg, w, h);
    const col = pixels(colorImg, w, h);
    const pos = [], rgb = [];
    const at = (x, y) => dep[(y * w + x) * 4] / 255;
    const aspect = w / h;
    for (let y = 1; y < h - 1; y += step) {
        for (let x = 1; x < w - 1; x += step) {
            const d = at(x, y);
            if (d < 0.04) continue;
            const grad = Math.abs(at(x + 1, y) - at(x - 1, y)) + Math.abs(at(x, y + 1) - at(x, y - 1));
            if (grad > 0.06) continue;
            const z = 1 / (0.12 + 1.15 * d);
            const jx = x + (Math.random() - 0.5) * step, jy = y + (Math.random() - 0.5) * step;
            // pivot the orbit at depth 1.6 (just behind the subject)
            pos.push(((jx / w) - 0.5) * aspect * z * 0.9, (0.5 - jy / h) * z * 0.9, z - 1.6);
            const i = (y * w + x) * 4;
            rgb.push(col[i] / 255, col[i + 1] / 255, col[i + 2] / 255);
        }
    }
    return { pos: new Float32Array(pos), rgb: new Float32Array(rgb) };
}

function DepthPortrait({ src, depth, mode = 'parallax', alt = '', strength = 0.045, background = '#121212', className = '', autoplay = false }) {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
        if (!gl) { setFailed(true); return undefined; }

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0, alive = true, draw = null;
        const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
        const t0 = performance.now();

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(wrap.clientWidth * dpr);
            canvas.height = Math.round(wrap.clientHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        const onMove = (e) => {
            const r = wrap.getBoundingClientRect();
            target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        };
        const onLeave = () => { target.x = 0; target.y = 0; };

        const loop = (now) => {
            if (!alive) return;
            if (autoplay && !reduced && target.x === 0 && target.y === 0) {
                // idle drift so the depth reads even without a mouse (touch screens)
                const t = (now - t0) / 1000;
                cur.x += (Math.sin(t * 0.6) * 0.6 - cur.x) * 0.05;
                cur.y += (Math.cos(t * 0.45) * 0.25 - cur.y) * 0.05;
            } else {
                cur.x += (target.x - cur.x) * 0.08;
                cur.y += (target.y - cur.y) * 0.08;
            }
            draw(cur);
            raf = requestAnimationFrame(loop);
        };

        Promise.all([loadImage(src), loadImage(depth)]).then(([colorImg, depthImg]) => {
            if (!alive) return;
            resize();
            if (mode === 'points') {
                const prog = compile(gl, POINTS_VS, POINTS_FS);
                const cloud = buildCloud(colorImg, depthImg, 1);
                const buf = (data, name, size) => {
                    const b = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, b);
                    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                    const loc = gl.getAttribLocation(prog, name);
                    gl.enableVertexAttribArray(loc);
                    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
                };
                gl.useProgram(prog);
                buf(cloud.pos, 'aPos', 3);
                buf(cloud.rgb, 'aCol', 3);
                const bg = background.match(/[0-9a-f]{2}/gi).map((h) => parseInt(h, 16) / 255);
                gl.uniform3f(gl.getUniformLocation(prog, 'uBg'), bg[0], bg[1], bg[2]);
                const uRot = gl.getUniformLocation(prog, 'uRot');
                const uAspect = gl.getUniformLocation(prog, 'uAspect');
                const uSize = gl.getUniformLocation(prog, 'uSize');
                gl.enable(gl.DEPTH_TEST);
                const n = cloud.pos.length / 3;
                draw = (c) => {
                    gl.clearColor(bg[0], bg[1], bg[2], 1);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.uniform2f(uRot, c.x * 0.22, c.y * 0.1);
                    gl.uniform1f(uAspect, canvas.width / canvas.height);
                    gl.uniform1f(uSize, Math.max(1.5, canvas.height / 420));
                    gl.drawArrays(gl.POINTS, 0, n);
                };
            } else {
                const prog = compile(gl, PARALLAX_VS, PARALLAX_FS);
                gl.useProgram(prog);
                const b = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, b);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
                const loc = gl.getAttribLocation(prog, 'aPos');
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                texture(gl, colorImg);
                gl.uniform1i(gl.getUniformLocation(prog, 'uColor'), 0);
                gl.activeTexture(gl.TEXTURE1);
                texture(gl, depthImg);
                gl.uniform1i(gl.getUniformLocation(prog, 'uDepth'), 1);
                const uOffset = gl.getUniformLocation(prog, 'uOffset');
                draw = (c) => {
                    gl.uniform2f(uOffset, -c.x * strength, -c.y * strength);
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                };
            }
            setReady(true);
            if (reduced) {
                draw(cur);
            } else {
                wrap.addEventListener('pointermove', onMove);
                wrap.addEventListener('pointerleave', onLeave);
                raf = requestAnimationFrame(loop);
            }
        }).catch(() => setFailed(true));

        window.addEventListener('resize', resize);
        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            wrap.removeEventListener('pointermove', onMove);
            wrap.removeEventListener('pointerleave', onLeave);
        };
    }, [src, depth, mode, strength, background, autoplay]);

    return (
        <div ref={wrapRef} className={`depth-portrait ${ready ? 'is-ready' : ''} ${className}`}>
            <img src={src} alt={alt} className="depth-portrait-still" decoding="async" />
            {!failed && <canvas ref={canvasRef} className="depth-portrait-canvas" aria-hidden="true" />}
        </div>
    );
}

export default DepthPortrait;
