'use client';

import { useEffect, useRef } from 'react';
import { AI_CLIENTS, INTEGRATION_APPS, APP_ACTIONS } from '@/config/brand-icons';

// Local type for canvas apps
type CanvasApp = {
    nm: string;
    bg: string;
    fg: string;
    l: string;
    domain: string;
};

// Map INTEGRATION_APPS to canvas format
const APPS: CanvasApp[] = INTEGRATION_APPS.map(app => ({
    nm: app.name,
    bg: app.bg,
    fg: app.fg,
    l: app.letter,
    domain: app.domain,
}));

interface Mushroom {
    app: CanvasApp;
    state: 'landing' | 'gone';
    x: number;
    y: number;
    vy: number;
    bobT: number;
    scaleY: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    col: string;
    sz: number;
    life: number;
    dec: number;
}

interface FloatText {
    s: string;
    x: number;
    y: number;
    age: number;
    t: number;
}

interface ActionBubble {
    text: string;
    x: number;
    y: number;
    age: number;
    maxAge: number;
}

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Constants
        const P = 4;
        const TICKER_H = 0;
        const GRAV = 0.54;

        let W = 0;
        let H = 0;
        let GY = 0;
        let currentAIIdx = 0;
        let booted = false;

        // State
        let mushrooms: Mushroom[] = [];
        let parts: Particle[] = [];
        let floats: FloatText[] = [];
        let actionBubbles: ActionBubble[] = [];
        const logoImgs: Record<string, HTMLImageElement> = {};
        const appIconImgs: Record<string, HTMLImageElement> = {};
        const loadedAppIcons = new Set<string>();
        const failedAppIcons = new Set<string>();
        const loadedLogoImgs = new Set<string>();
        const failedLogoImgs = new Set<string>();

        // Character — stationary doodle
        const char = {
            x: 100,
            y: 0,
            vx: 0,
            vy: 0,
            w: 10 * P,
            h: 20 * P,
            face: 'right' as 'left' | 'right',
            onGround: false,
            frame: 0,
            frameT: 0,
            flashT: 0,
            powerUps: 0,
        };

        // Preload AI logos
        AI_CLIENTS.forEach((ai) => {
            if (!ai.domain) return;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { logoImgs[ai.name] = img; loadedLogoImgs.add(ai.name); };
            img.onerror = () => { failedLogoImgs.add(ai.name); };
            img.src = `/api/icon/${ai.domain}`;
        });

        // Preload app icons
        APPS.forEach((app) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { appIconImgs[app.nm] = img; loadedAppIcons.add(app.nm); };
            img.onerror = () => { failedAppIcons.add(app.nm); };
            img.src = `/api/icon/${app.domain}`;
        });

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            W = canvas.width = r.width;
            H = canvas.height = r.height;

            const chatDemo = document.getElementById('chat-demo-container');
            if (chatDemo) {
                const chatRect = chatDemo.getBoundingClientRect();
                GY = chatRect.top - r.top - 5;
            } else {
                GY = H - TICKER_H;
            }

            if (char.y + char.h > GY) char.y = GY - char.h;
        };

        const lighten = (hex: string, a: number) => {
            try {
                const n = parseInt(hex.replace('#', ''), 16);
                return `rgb(${Math.min(255, ((n >> 16) & 255) + a)},${Math.min(255, ((n >> 8) & 255) + a)},${Math.min(255, (n & 255) + a)})`;
            } catch { return hex; }
        };

        const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        };

        const burst = (cx: number, cy: number, cols: string[], n: number) => {
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
                const sp = 2.5 + Math.random() * 5.5;
                parts.push({
                    x: cx, y: cy,
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp - 2.5,
                    col: cols[i % cols.length],
                    sz: 3 + Math.random() * 5,
                    life: 1,
                    dec: 0.02 + Math.random() * 0.014,
                });
            }
        };

        const addFloat = (txt: string, x: number, y: number) => {
            floats.push({ s: txt, x, y, age: 0, t: 100 });
        };

        const addActionBubble = (text: string, x: number, y: number) => {
            actionBubbles.push({ text, x, y, age: 0, maxAge: 160 });
        };

        const spawnTwoMushrooms = () => {
            const mushroomY = GY - 45;
            // Define range to the right of the doodle
            const minX = char.x + char.w + 60;
            const maxX = Math.max(minX + 100, W * 0.9 - 48);

            const getRandomX = (start: number, end: number) => start + Math.random() * (end - start);

            let x1 = getRandomX(minX, maxX);
            let x2 = getRandomX(minX, maxX);

            // Ensure they are not too close to each other (min 80px apart)
            if (Math.abs(x1 - x2) < 80) {
                if (x1 < x2) x2 = Math.min(maxX, x1 + 80 + Math.random() * 50);
                else x1 = Math.min(maxX, x2 + 80 + Math.random() * 50);
            }

            mushrooms = [
                {
                    app: APPS[Math.floor(Math.random() * APPS.length)],
                    state: 'landing',
                    x: x1,
                    y: mushroomY,
                    vy: 0,
                    bobT: Math.random() * 100,
                    scaleY: 1
                },
                {
                    app: APPS[Math.floor(Math.random() * APPS.length)],
                    state: 'landing',
                    x: x2,
                    y: mushroomY,
                    vy: 0,
                    bobT: Math.random() * 100,
                    scaleY: 1
                },
            ];
        };

        const drawMushroom = (m: Mushroom) => {
            if (!m || m.state === 'gone') return;
            const { app, x, y, bobT, scaleY } = m;
            const bob = Math.sin(bobT * 0.048) * 3.5;
            const cx = x + 24;
            const cy = y + 28 + bob;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(1, scaleY || 1);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.14)';
            ctx.beginPath();
            ctx.ellipse(0, 28, 16, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Stem
            ctx.fillStyle = '#F2EDD8';
            ctx.fillRect(-8, 0, 16, 16);
            ctx.fillRect(-10, 13, 20, 4);
            ctx.fillStyle = 'rgba(255,255,255,0.32)';
            ctx.fillRect(-8, 0, 4, 14);

            // Cap
            ctx.fillStyle = app.bg;
            const capRects: [number, number, number, number][] = [
                [-10, -18, 20, 6],
                [-14, -12, 28, 6],
                [-16, -6, 32, 6],
                [-16, 0, 32, 4],
            ];
            capRects.forEach(([ox, oy, rw, rh]) => ctx.fillRect(ox, oy, rw, rh));
            const lighter = lighten(app.bg, 45);
            ctx.fillStyle = lighter;
            ctx.fillRect(-16, 0, 32, 4);

            // Spots
            ctx.fillStyle = 'rgba(255,255,255,0.88)';
            const spots: [number, number, number, number][] = [
                [-11, -15, 6, 5],
                [4, -13, 6, 5],
                [-2, -18, 5, 4],
                [8, -8, 5, 5],
                [-12, -7, 5, 5],
            ];
            spots.forEach(([ox, oy, sw, sh]) => ctx.fillRect(ox, oy, sw, sh));

            /*
            // App icon on cap
            const mushIconImg = appIconImgs[app.nm];
            const mushIconSize = 16;
            const mushIconLoaded = loadedAppIcons.has(app.nm);
            const mushIconFailed = failedAppIcons.has(app.nm);
            if (mushIconLoaded && mushIconImg && mushIconImg.complete && mushIconImg.naturalWidth > 0) {
              ctx.drawImage(mushIconImg, -mushIconSize / 2, -16, mushIconSize, mushIconSize);
            } else if (mushIconFailed) {
              ctx.fillStyle = app.fg;
              const fz = app.l.length > 1 ? 9 : 12;
              ctx.font = `700 ${fz}px 'Press Start 2P', monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(app.l[0], 0, -8);
            }
            */

            // Eyes on stem
            ctx.fillStyle = app.fg === '#fff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.65)';
            ctx.fillRect(-6, 4, 4, 4);
            ctx.fillRect(2, 4, 4, 4);

            ctx.restore();
        };

        const drawChar = () => {
            const ai = AI_CLIENTS[currentAIIdx % AI_CLIENTS.length];
            const { x, y, face, frame, flashT } = char;
            const cx = x + char.w / 2;

            ctx.save();
            if (face === 'left') {
                ctx.translate(x + char.w, y);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(x, y);
            }

            if (flashT > 0 && (flashT >> 2) & 1) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 18;
            }

            const r = (c: string, px: number, py: number, pw: number, ph: number) => {
                ctx.fillStyle = c;
                ctx.fillRect(px * P, py * P, pw * P, ph * P);
            };

            // Antenna
            r('#94a3b8', 4, 0, 2, 2);
            r('#5CD2A2', 4, 0, 2, 1);

            // Head
            r('#e8ecf0', 1, 2, 8, 7);
            r('#f0f4f8', 2, 2, 6, 1);
            r('#d1d8e0', 1, 8, 8, 1);

            // Eyes
            r('#0a0a0a', 3, 4, 2, 2);
            r('#0a0a0a', 6, 4, 2, 2);
            r('#ffffff', 3, 4, 1, 1);
            r('#ffffff', 6, 4, 1, 1);

            // Mouth
            r('#94a3b8', 4, 7, 3, 1);

            // Body
            r(ai.col, 1, 9, 8, 6);
            r('#ffffff', 1, 9, 8, 1);

            /*
            // AI logo on torso
            ctx.save();
            const badgeX = 5 * P;
            const badgeY = 11.5 * P;
            const badgeS = 16;
            const logo = logoImgs[ai.name];
            const logoLoaded = loadedLogoImgs.has(ai.name);
            const logoFailed = failedLogoImgs.has(ai.name);
            if (logoLoaded && logo && logo.complete && logo.naturalWidth > 0) {
              ctx.drawImage(logo, badgeX - badgeS / 2, badgeY - badgeS / 2, badgeS, badgeS);
            } else if (logoFailed) {
              ctx.fillStyle = '#fff';
              ctx.font = "10px 'Press Start 2P', monospace";
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(ai.sym, badgeX, badgeY);
            }
            ctx.restore();
            */

            // Waist
            r('#64748b', 1, 15, 8, 1);

            // Legs — static stance (frame always 0)
            r('#94a3b8', 1, 16, 3, 3);
            r('#94a3b8', 6, 16, 3, 3);
            r('#64748b', 1, 19, 3, 1);
            r('#64748b', 6, 19, 3, 1);

            ctx.restore();

            /*
            // Name label
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.font = "600 8px 'Poppins', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(ai.name, cx, y + char.h + 4);
            ctx.restore();
            */
        };

        const update = () => {
            // Gravity — keep char on ground
            char.vy = Math.min(char.vy + GRAV, 20);
            char.y += char.vy;
            if (char.y + char.h >= GY) {
                char.y = GY - char.h;
                char.vy = 0;
                char.onGround = true;
            }
            if (char.flashT > 0) char.flashT--;

            // Mushroom bobbing
            mushrooms.forEach((m) => { if (m.state === 'landing') m.bobT++; });

            // Particles
            parts.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3;
                p.vx *= 0.97;
                p.life -= p.dec;
            });
            parts = parts.filter((p) => p.life > 0);

            // Floats
            floats.forEach((f) => { f.t--; f.age++; });
            floats = floats.filter((f) => f.t > 0);
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            mushrooms.forEach((m) => drawMushroom(m));
            drawChar();

            // Particles
            parts.forEach((p) => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.col;
                ctx.fillRect(p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
                ctx.restore();
            });

            // Floats
            floats.forEach((f) => {
                const alpha = Math.min(1, f.t / 22);
                const yOff = f.age * 0.9;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.font = "700 9px 'Press Start 2P', monospace";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'alphabetic';
                ctx.strokeStyle = 'rgba(0,0,0,0.75)';
                ctx.lineWidth = 3.5;
                ctx.strokeText(f.s, f.x, f.y - yOff);
                ctx.fillStyle = '#FFD700';
                ctx.fillText(f.s, f.x, f.y - yOff);
                ctx.restore();
            });

            // Action bubbles
            actionBubbles.forEach((ab) => {
                const fadeIn = Math.min(1, ab.age / 15);
                const fadeOut = ab.age > 100 ? Math.max(0, 1 - (ab.age - 100) / 60) : 1;
                const alpha = fadeIn * fadeOut;
                const yOff = ab.age * 0.4;
                if (alpha <= 0) return;

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.font = "600 10px 'Poppins', sans-serif";
                const label = '\u2713 ' + ab.text;
                const tw = ctx.measureText(label).width;
                const px = 12;
                const py = 8;
                const bx = ab.x - tw / 2 - px;
                const by = ab.y - yOff - py - 6;

                ctx.fillStyle = 'rgba(10,10,10,0.82)';
                roundRect(bx, by, tw + px * 2, 24 + py, 8);
                ctx.fill();

                ctx.fillStyle = '#5CD2A2';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, ab.x, by + (24 + py) / 2);
                ctx.restore();

                ab.age++;
            });
            actionBubbles = actionBubbles.filter((ab) => ab.age < ab.maxAge);
        };

        let animationId: number;

        const loop = () => {
            update();
            draw();
            animationId = requestAnimationFrame(loop);
        };

        const boot = () => {
            if (booted) return;
            booted = true;
            resize();

            // Place doodle at center-bottom, stationary
            char.y = GY - char.h;
            char.x = W / 2 - char.w / 2 - 300;
            char.face = 'right';

            // Spawn the two static mushrooms
            spawnTwoMushrooms();

            loop();
        };

        // Wait for fonts
        document.fonts.ready.then(boot);
        const timeout = setTimeout(boot, 1600);

        const handleResize = () => {
            resize();
            char.x = W / 2 - char.w / 2 - 300;
            spawnTwoMushrooms();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };

        // Keep these referenced so TypeScript doesn't complain about unused vars
        void burst; void addFloat; void addActionBubble;
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="gc"
            className="absolute inset-0 mx-auto max-w-[1120px] w-full h-full block pixelated"
        />
    );
}