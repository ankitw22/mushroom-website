'use client';

import { useEffect, useRef } from 'react';

// AI Clients data with domains for thingsofbrand.com icon API
const AI_LIST = [
  { name: 'Claude', sym: '✳', col: '#D4845A', domain: 'anthropic.com' },
  { name: 'ChatGPT', sym: '◎', col: '#74AA9C', domain: 'openai.com' },
  { name: 'Cursor', sym: '⬡', col: '#aaa', domain: 'cursor.com' },
  { name: 'Windsurf', sym: '◈', col: '#4D9FE8', domain: 'codeium.com' },
  { name: 'Gemini', sym: '✦', col: '#8B9CF6', domain: 'gemini.google.com' },
  { name: 'Copilot', sym: '⊕', col: '#0078D4', domain: 'github.com' },
  { name: 'Continue', sym: '▷', col: '#FF6B35', domain: 'continue.dev' },
  { name: 'Cline', sym: '◆', col: '#E24444', domain: 'cline.bot' },
  { name: 'Zed', sym: '⬢', col: '#7744DD', domain: 'zed.dev' },
  { name: 'Cody', sym: '✿', col: '#FF5959', domain: 'sourcegraph.com' },
  { name: 'Amp', sym: '⚡', col: '#FFCC00', domain: 'amp.dev' },
];

// App catalogue — with domains for thingsofbrand.com icon API
const APPS = [
  { nm: 'Slack',      bg: '#4A154B', fg: '#fff', l: 'S',  domain: 'slack.com' },
  { nm: 'Notion',     bg: '#000000', fg: '#fff', l: 'N',  domain: 'notion.so' },
  { nm: 'Gmail',      bg: '#EA4335', fg: '#fff', l: 'G',  domain: 'gmail.com' },
  { nm: 'GitHub',     bg: '#181717', fg: '#fff', l: 'GH', domain: 'github.com' },
  { nm: 'Zapier',     bg: '#FF4A00', fg: '#fff', l: 'Z',  domain: 'zapier.com' },
  { nm: 'Linear',     bg: '#5E6AD2', fg: '#fff', l: 'L',  domain: 'linear.app' },
  { nm: 'ClickUp',    bg: '#7B68EE', fg: '#fff', l: 'CU', domain: 'clickup.com' },
  { nm: 'Sheets',     bg: '#34A853', fg: '#fff', l: 'S',  domain: 'sheets.google.com' },
  { nm: 'Trello',     bg: '#0052CC', fg: '#fff', l: 'T',  domain: 'trello.com' },
  { nm: 'Airtable',   bg: '#18BFFF', fg: '#000', l: 'AT', domain: 'airtable.com' },
  { nm: 'Figma',      bg: '#F24E1E', fg: '#fff', l: 'F',  domain: 'figma.com' },
  { nm: 'Jira',       bg: '#0052CC', fg: '#fff', l: 'J',  domain: 'jira.atlassian.com' },
  { nm: 'Asana',      bg: '#F06A6A', fg: '#fff', l: 'A',  domain: 'asana.com' },
  { nm: 'HubSpot',    bg: '#FF7A59', fg: '#fff', l: 'H',  domain: 'hubspot.com' },
  { nm: 'Discord',    bg: '#5865F2', fg: '#fff', l: 'D',  domain: 'discord.com' },
  { nm: 'Dropbox',    bg: '#0061FF', fg: '#fff', l: 'DB', domain: 'dropbox.com' },
  { nm: 'Stripe',     bg: '#635BFF', fg: '#fff', l: 'ST', domain: 'stripe.com' },
  { nm: 'Salesforce', bg: '#00A1E0', fg: '#fff', l: 'SF', domain: 'salesforce.com' },
  { nm: 'Twilio',     bg: '#F22F46', fg: '#fff', l: 'TW', domain: 'twilio.com' },
  { nm: 'Zendesk',    bg: '#03363D', fg: '#fff', l: 'Z',  domain: 'zendesk.com' },
];

// App actions
const APP_ACTIONS: Record<string, string> = {
  Slack: 'Sent message',
  Notion: 'Updated wiki',
  Gmail: 'Sent email',
  GitHub: 'Created issue',
  Zapier: 'Ran workflow',
  Linear: 'Filed ticket',
  ClickUp: 'Created task',
  Sheets: 'Updated data',
  Trello: 'Moved card',
  Airtable: 'Added record',
  Figma: 'Left comment',
  Jira: 'Logged issue',
  Asana: 'Assigned task',
  HubSpot: 'Logged contact',
};

// Cloud pattern
const CLOUD_G = [
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface Cloud {
  x: number;
  y: number;
  sc: number;
  sp: number;
}

interface FallingApp {
  app: (typeof APPS)[0];
  x: number;
  y: number;
  vy: number;
  state: 'falling' | 'morphing' | 'done';
  morphT: number;
}

interface Mushroom {
  app: (typeof APPS)[0];
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
    const TICKER_H = 52;
    const GRAV = 0.54;
    const SPD = 4.4;
    const FALL_SPEED = 1.5;
    const MORPH_FRAMES = 20;
    const MAX_ON_SCREEN = 3;
    const NAV_CLEARANCE = 60;

    let W = 0;
    let H = 0;
    let GY = 0;
    let appIdx = 0;
    let currentAIIdx = 0;
    let dropTimer = 40;
    let booted = false;

    // State
    let clouds: Cloud[] = [];
    let fallingApps: FallingApp[] = [];
    let mushrooms: Mushroom[] = [];
    let parts: Particle[] = [];
    let floats: FloatText[] = [];
    let actionBubbles: ActionBubble[] = [];
    const logoImgs: Record<string, HTMLImageElement> = {};
    const appIconImgs: Record<string, HTMLImageElement> = {};

    // Character
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

    let autoState = 'idle';
    let pauseTimer = 0;

    // Preload AI logos via thingsofbrand.com API
    AI_LIST.forEach((ai) => {
      if (!ai.domain) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `https://thingsofbrand.com/api/icon/${ai.domain}`;
      img.onload = () => {
        logoImgs[ai.name] = img;
      };
    });

    // Preload app icons via thingsofbrand.com API
    APPS.forEach((app) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `https://thingsofbrand.com/api/icon/${app.domain}`;
      img.onload = () => {
        appIconImgs[app.nm] = img;
      };
    });

    const nextApp = () => {
      const a = APPS[appIdx % APPS.length];
      appIdx++;
      return a;
    };

    const getWalkBounds = () => ({
      minX: Math.round(W * 0.1),
      maxX: Math.round(W * 0.88),
    });

    const getOccupiedXPositions = () => {
      const positions: number[] = [];
      fallingApps.forEach((a) => positions.push(a.x));
      mushrooms.forEach((m) => {
        if (m.state !== 'gone') positions.push(m.x + 24);
      });
      return positions;
    };

    const initClouds = () => {
      const configs = [
        { pct: 0.12, y: 0.04, sc: 1.6, sp: 0.11 },
        { pct: 0.5, y: 0.03, sc: 1.9, sp: 0.13 },
        { pct: 0.82, y: 0.05, sc: 1.3, sp: 0.08 },
      ];
      clouds = configs.map((c) => ({
        x: W * c.pct - 20,
        y: Math.max(NAV_CLEARANCE, H * c.y),
        sc: c.sc,
        sp: c.sp,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
      GY = H - TICKER_H;
      if (char.y + char.h > GY) char.y = GY - char.h;
    };

    const lighten = (hex: string, a: number) => {
      try {
        const n = parseInt(hex.replace('#', ''), 16);
        return `rgb(${Math.min(255, ((n >> 16) & 255) + a)},${Math.min(255, ((n >> 8) & 255) + a)},${Math.min(255, (n & 255) + a)})`;
      } catch {
        return hex;
      }
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
          x: cx,
          y: cy,
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

    const startDrop = () => {
      const totalOnScreen = fallingApps.length + mushrooms.filter((m) => m.state !== 'gone').length;
      if (totalOnScreen >= MAX_ON_SCREEN) return;

      const app = nextApp();
      const bounds = getWalkBounds();
      const occupied = getOccupiedXPositions();
      const charCx = char.x + char.w / 2;

      const isTooClose = (testX: number) => {
        if (Math.abs(testX - charCx) < 60) return true;
        for (const ox of occupied) {
          if (Math.abs(testX - ox) < 70) return true;
        }
        return false;
      };

      const shuffled = [...clouds].sort(() => Math.random() - 0.5);
      let chosenCloud: Cloud | null = null;
      let chosenX: number | null = null;
      for (const c of shuffled) {
        const cloudCx = c.x + (10 * 7 * c.sc) / 2;
        const x = Math.max(bounds.minX + 30, Math.min(bounds.maxX - 30, cloudCx));
        if (!isTooClose(x)) {
          chosenCloud = c;
          chosenX = x;
          break;
        }
      }
      if (!chosenCloud || chosenX === null) return;

      const cloudBottom = chosenCloud.y + CLOUD_G.length * 7 * chosenCloud.sc;
      fallingApps.push({
        app,
        x: chosenX,
        y: cloudBottom,
        vy: FALL_SPEED + Math.random() * 0.45,
        state: 'falling',
        morphT: 0,
      });
    };

    const absorbMush = (m: Mushroom) => {
      if (!m || m.state === 'gone') return;
      m.state = 'gone';
      char.flashT = 36;
      char.powerUps++;

      burst(char.x + char.w / 2, char.y + char.h / 2, [m.app.bg, '#FFD700', '#ffffff', '#FF69B4', '#00FFAA'], 42);
      addFloat('+1 POWER', char.x + char.w / 2, char.y - 8);

      const action = APP_ACTIONS[m.app.nm] || 'Performed action';
      setTimeout(() => {
        addActionBubble(`${action} in ${m.app.nm}`, char.x + char.w / 2, char.y - 16);
      }, 400);

      setTimeout(() => {
        currentAIIdx = (currentAIIdx + 1) % AI_LIST.length;
      }, 600);

      setTimeout(() => {
        mushrooms = mushrooms.filter((x) => x !== m);
      }, 600);

      autoState = 'pausing';
      pauseTimer = 50;
    };

    const drawCloud = (c: Cloud) => {
      const pw = 7 * c.sc;
      c.x += c.sp;
      if (c.x > W + 100) c.x = -100;
      CLOUD_G.forEach((row, ri) =>
        row.forEach((v, ci) => {
          if (!v) return;
          ctx.fillStyle = ri < 2 ? '#fff' : 'rgba(220,238,255,0.88)';
          ctx.fillRect(c.x + ci * pw, c.y + ri * pw, pw, pw);
          if (ri === 0 || (ri > 0 && !CLOUD_G[ri - 1][ci])) {
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(c.x + ci * pw, c.y + ri * pw, pw, 1.5);
          }
          if (ci === 0 || (ci > 0 && !CLOUD_G[ri][ci - 1])) {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(c.x + ci * pw, c.y + ri * pw, 1.5, pw);
          }
        })
      );
    };

    const drawAppLogo = (app: (typeof APPS)[0], cx: number, cy: number) => {
      const s = 40;
      const r = 10;
      // White card background (thingsofbrand icons are full-colour on transparent)
      ctx.fillStyle = '#ffffff';
      roundRect(cx - s / 2, cy - s / 2, s, s, r);
      ctx.fill();
      // Subtle drop-shadow ring
      ctx.strokeStyle = 'rgba(0,0,0,0.10)';
      ctx.lineWidth = 1.5;
      roundRect(cx - s / 2, cy - s / 2, s, s, r);
      ctx.stroke();
      // Icon image or letter fallback
      const iconImg = appIconImgs[app.nm];
      const iconSize = s * 0.68;
      if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
        ctx.drawImage(iconImg, cx - iconSize / 2, cy - iconSize / 2, iconSize, iconSize);
      } else {
        // Letter fallback on brand colour
        ctx.fillStyle = app.bg;
        roundRect(cx - s / 2, cy - s / 2, s, s, r);
        ctx.fill();
        ctx.fillStyle = app.fg;
        const fz = app.l.length > 1 ? 10 : 14;
        ctx.font = `700 ${fz}px 'Press Start 2P', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(app.l, cx, cy + 1);
      }
    };

    const drawFallingApps = () => {
      fallingApps.forEach((a) => {
        if (a.state === 'falling') {
          drawAppLogo(a.app, a.x, a.y);
        } else if (a.state === 'morphing') {
          const p = Math.min(1, a.morphT / MORPH_FRAMES);
          if (p < 0.6) {
            ctx.save();
            ctx.globalAlpha = 1 - p * 1.6;
            drawAppLogo(a.app, a.x, GY - 28);
            ctx.restore();
          }
        }
      });
    };

    const drawMushroom = (m: Mushroom) => {
      if (!m || m.state === 'gone') return;
      const { app, x, y, bobT, scaleY } = m;
      const bob = m.state === 'landing' ? Math.sin(bobT * 0.048) * 3.5 : 0;
      const cx = x + 24;
      const cy = y + 28 + bob;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, scaleY || 1);

      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.beginPath();
      ctx.ellipse(0, 28, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F2EDD8';
      ctx.fillRect(-8, 0, 16, 16);
      ctx.fillRect(-10, 13, 20, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      ctx.fillRect(-8, 0, 4, 14);

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

      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      const spots: [number, number, number, number][] = [
        [-11, -15, 6, 5],
        [4, -13, 6, 5],
        [-2, -18, 5, 4],
        [8, -8, 5, 5],
        [-12, -7, 5, 5],
      ];
      spots.forEach(([ox, oy, sw, sh]) => ctx.fillRect(ox, oy, sw, sh));

      const mushIconImg = appIconImgs[app.nm];
      const mushIconSize = 16;
      if (mushIconImg && mushIconImg.complete && mushIconImg.naturalWidth > 0) {
        ctx.drawImage(mushIconImg, -mushIconSize / 2, -16, mushIconSize, mushIconSize);
      } else {
        ctx.fillStyle = app.fg;
        const fz = app.l.length > 1 ? 9 : 12;
        ctx.font = `700 ${fz}px 'Press Start 2P', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(app.l[0], 0, -8);
      }

      ctx.fillStyle = app.fg === '#fff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.65)';
      ctx.fillRect(-6, 4, 4, 4);
      ctx.fillRect(2, 4, 4, 4);

      ctx.restore();
    };

    const drawChar = () => {
      const ai = AI_LIST[currentAIIdx % AI_LIST.length];
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

      // AI client logo on torso
      ctx.save();
      const badgeX = 5 * P;
      const badgeY = 11.5 * P;
      const badgeS = 16;
      const logo = logoImgs[ai.name];
      if (logo) {
        ctx.drawImage(logo, badgeX - badgeS / 2, badgeY - badgeS / 2, badgeS, badgeS);
      } else {
        ctx.fillStyle = '#fff';
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ai.sym, badgeX, badgeY);
      }
      ctx.restore();

      // Waist
      r('#64748b', 1, 15, 8, 1);

      // Legs
      if (frame === 0) {
        r('#94a3b8', 1, 16, 3, 3);
        r('#94a3b8', 6, 16, 3, 3);
        r('#64748b', 1, 19, 3, 1);
        r('#64748b', 6, 19, 3, 1);
      } else {
        r('#94a3b8', 1, 16, 3, 4);
        r('#94a3b8', 5, 16, 4, 3);
        r('#64748b', 1, 19, 4, 1);
        r('#64748b', 5, 19, 4, 1);
      }

      ctx.restore();

      // Name label
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.font = "600 8px 'Poppins', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(ai.name, cx, y + char.h + 4);
      ctx.restore();
    };

    const drawGround = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, GY, W, 4);
    };

    const update = () => {
      // Drop timer
      dropTimer--;
      if (dropTimer <= 0 && fallingApps.length + mushrooms.filter((m) => m.state !== 'gone').length < MAX_ON_SCREEN) {
        startDrop();
        dropTimer = 40 + Math.floor(Math.random() * 40);
      }

      // Update falling apps
      fallingApps.forEach((a) => {
        if (a.state === 'falling') {
          a.y += a.vy;
          if (a.y >= GY - 32) {
            a.y = GY - 32;
            a.state = 'morphing';
            a.morphT = 0;
          }
        } else if (a.state === 'morphing') {
          a.morphT++;
          if (a.morphT >= MORPH_FRAMES) {
            mushrooms.push({
              app: a.app,
              state: 'landing',
              x: a.x - 24,
              y: GY - 56,
              vy: 0,
              bobT: 0,
              scaleY: 1,
            });
            a.state = 'done';
          }
        }
      });
      fallingApps = fallingApps.filter((a) => a.state !== 'done');

      // Character AI
      const collectible = mushrooms.filter((m) => m.state === 'landing');
      if (autoState === 'pausing') {
        char.vx = 0;
        pauseTimer--;
        if (pauseTimer <= 0) {
          autoState = 'seeking';
        }
      } else if (collectible.length > 0) {
        autoState = 'seeking';
        let nearest: Mushroom | null = null;
        let nearDist = Infinity;
        collectible.forEach((m) => {
          const d = Math.abs(m.x + 24 - (char.x + char.w / 2));
          if (d < nearDist) {
            nearDist = d;
            nearest = m;
          }
        });
        if (nearest !== null) {
          const nearestMush = nearest as Mushroom;
          const mushCx = nearestMush.x + 24;
          const targetX = mushCx - char.w / 2;
          if (Math.abs(char.x - targetX) > 8) {
            const dir = char.x < targetX ? 1 : -1;
            char.vx = SPD * 0.8 * dir;
            char.face = dir > 0 ? 'right' : 'left';
          } else {
            char.vx = 0;
            absorbMush(nearestMush);
          }
        }
      } else {
        char.vx = 0;
        autoState = 'idle';
      }

      // Physics
      char.vy = Math.min(char.vy + GRAV, 20);
      char.x += char.vx;
      char.y += char.vy;

      const bounds = getWalkBounds();
      char.x = Math.max(bounds.minX, Math.min(bounds.maxX - char.w, char.x));

      char.onGround = false;
      if (char.y + char.h >= GY) {
        char.y = GY - char.h;
        char.vy = 0;
        char.onGround = true;
      }

      // Walk animation
      if (Math.abs(char.vx) > 0.5) {
        char.frameT++;
        if (char.frameT > 7) {
          char.frame ^= 1;
          char.frameT = 0;
        }
      } else {
        char.frame = 0;
      }
      if (char.flashT > 0) char.flashT--;

      // Mushroom bobbing
      mushrooms.forEach((m) => {
        if (m.state === 'landing') m.bobT++;
      });

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
      floats.forEach((f) => {
        f.t--;
        f.age++;
      });
      floats = floats.filter((f) => f.t > 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      clouds.forEach(drawCloud);
      drawFallingApps();
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

      drawGround();
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
      initClouds();

      const bounds = getWalkBounds();
      char.y = GY - char.h;
      char.x = (bounds.minX + bounds.maxX) / 2 - char.w / 2;
      autoState = 'idle';
      dropTimer = 10;

      loop();
    };

    // Wait for fonts
    document.fonts.ready.then(boot);
    const timeout = setTimeout(boot, 1600);

    const handleResize = () => {
      resize();
      initClouds();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gc"
      className="absolute inset-0 w-full h-full block pixelated"
    />
  );
}
