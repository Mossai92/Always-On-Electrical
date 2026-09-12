// Builds the Always On Electrical logo-direction artboards (.dc.html) + plain previews.
import { writeFileSync, mkdirSync } from 'node:fs';

const CHARCOAL = '#161A21', CHALK = '#F2F3F5', SLATE = '#4B5160', ACCENT = '#FFA000';
const ACCENT_OPTIONS = ['#FFB300', '#FFA000', '#FF8A00', '#FF6F00'];

// ---- Font systems (measured from the real fonts; units: cap height = 100) ----
const FONTS = {
  A: { family: "'Sora', 'Trebuchet MS', 'Segoe UI', sans-serif", link: 'Sora:wght@400;500;700', weight: 700, cap: 0.73, lsb: 0.043 },
  B: { family: "'Barlow Semi Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif", link: 'Barlow+Semi+Condensed:wght@400;500;700', weight: 700, cap: 0.70, lsb: 0.041 },
  C: { family: "'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif", link: 'Archivo:wght@400;500;800', weight: 800, cap: 0.687, lsb: 0.045 },
};

let uid = 0;
const f2 = (n) => Number(n.toFixed(2));

// ---- Glyph A: standby glyph. Ring at Sora's O size/weight, bar lifts when on. ----
// O ink 106.7 x 105.6, stroke 22.7, overshoot 2.7.
const A_VB = { x: 0, y: -20, w: 106.7, h: 122.7 };
function glyphA({ on, col, anim = false }) {
  const R = 41.35, cx = 53.35, cy = 50, sw = 22.7, a = (36 * Math.PI) / 180;
  const x1 = f2(cx + R * Math.sin(a)), y1 = f2(cy - R * Math.cos(a)), x2 = f2(cx - R * Math.sin(a));
  const bw = 20.5, bx = f2(cx - bw / 2);
  const lift = on ? 'translateY(-14px)' : 'translateY(0px)';
  return `<svg viewBox="${A_VB.x} ${A_VB.y} ${A_VB.w} ${A_VB.h}" role="img" aria-label="On"><path class="ringA${anim ? ' anim' : ''}" d="M ${x1} ${y1} A ${R} ${R} 0 1 1 ${x2} ${y1}" style="fill:none;stroke:${col};stroke-width:${sw};stroke-linecap:butt"></path><rect class="barA${anim ? ' anim' : ''}" x="${bx}" y="-2.7" width="${bw}" height="56.7" style="fill:${col};transform:${lift}"></rect></svg>`;
}
// ---- Glyph B: solid slide-toggle; the O's counter is the knob. ----
// O ink 66.4 x 102.4, stroke 20.1, overshoot 1.2. Hole d=26.
const B_VB = { x: 0, y: -1.2, w: 66.4, h: 102.4 };
function glyphB({ on, col, anim = false }) {
  const w = 66.4, h = 102.4, y0 = -1.2, r = 33.2, cx = 33.2, rr = 16, cyOff = 68, cyOn = 32;
  const pill = `M ${r} ${y0} H ${f2(w - r)} A ${r} ${r} 0 0 1 ${w} ${f2(y0 + r)} V ${f2(y0 + h - r)} A ${r} ${r} 0 0 1 ${f2(w - r)} ${f2(y0 + h)} H ${r} A ${r} ${r} 0 0 1 0 ${f2(y0 + h - r)} V ${f2(y0 + r)} A ${r} ${r} 0 0 1 ${r} ${y0} Z`;
  if (!anim) {
    const cy = on ? cyOn : cyOff;
    const hole = `M ${f2(cx - rr)} ${cy} a ${rr} ${rr} 0 1 0 ${2 * rr} 0 a ${rr} ${rr} 0 1 0 ${-2 * rr} 0 Z`;
    return `<svg viewBox="${B_VB.x} ${B_VB.y} ${B_VB.w} ${B_VB.h}" role="img" aria-label="On"><path class="pillB" d="${pill} ${hole}" style="fill:${col};fill-rule:evenodd"></path></svg>`;
  }
  const shift = on ? `translateY(${f2(cyOn - cyOff)}px)` : 'translateY(0px)';
  return `<svg viewBox="${B_VB.x} ${B_VB.y} ${B_VB.w} ${B_VB.h}" role="img" aria-label="On"><path class="pillB anim" d="${pill}" style="fill:${col}"></path><circle class="holeB anim" cx="${cx}" cy="${cyOff}" r="${rr}" style="fill:var(--bg);transform:${shift}"></circle></svg>`;
}
// ---- Glyph C: rocker switch, two paddles; top paddle is the indicator. ----
// Archivo O ink 104.8 x 103.5, overshoot 1.7. Rocker drawn 92 wide.
const C_VB = { x: 0, y: -1.7, w: 84, h: 103.5 };
function glyphC({ on, col, ink, anim = false }) {
  const w = 84, R = 22, r = 4, seam = 5;
  const y0 = -1.7, hTop = 50 - seam / 2 - y0, yB = 50 + seam / 2, hBot = 101.8 - yB;
  const top = `M ${R} ${y0} H ${w - R} A ${R} ${R} 0 0 1 ${w} ${f2(y0 + R)} V ${f2(y0 + hTop - r)} A ${r} ${r} 0 0 1 ${w - r} ${f2(y0 + hTop)} H ${r} A ${r} ${r} 0 0 1 0 ${f2(y0 + hTop - r)} V ${f2(y0 + R)} A ${R} ${R} 0 0 1 ${R} ${y0} Z`;
  const bot = `M ${r} ${yB} H ${w - r} A ${r} ${r} 0 0 1 ${w} ${f2(yB + r)} V ${f2(yB + hBot - R)} A ${R} ${R} 0 0 1 ${w - R} ${f2(yB + hBot)} H ${R} A ${R} ${R} 0 0 1 0 ${f2(yB + hBot - R)} V ${f2(yB + r)} A ${r} ${r} 0 0 1 ${r} ${yB} Z`;
  return `<svg viewBox="${C_VB.x} ${C_VB.y} ${C_VB.w} ${C_VB.h}" role="img" aria-label="On"><path class="topC${anim ? ' anim' : ''}" d="${top}" style="fill:${col}"></path><path class="botC" d="${bot}" style="fill:${ink}"></path></svg>`;
}

const GLYPH = { A: glyphA, B: glyphB, C: glyphC };
const VB = { A: A_VB, B: B_VB, C: C_VB };
const OVERSHOOT = { A: 2.7, B: 1.2, C: 1.7 };

// Inline-in-wordmark sizing: svg height = cap * vbH/100 em, sits on baseline with overshoot below it.
function wordmark(dir, { on, size, ink, before = 'Always ', after = 'n Electrical', anim = false, extra = '' }) {
  const F = FONTS[dir], vb = VB[dir];
  const col = on ? 'var(--accent)' : 'var(--slate)';
  const hEm = f2(F.cap * vb.h / 100 * 1000) / 1000;
  const vaEm = -f2(F.cap * OVERSHOOT[dir] / 100 * 1000) / 1000;
  const svg = GLYPH[dir]({ on, col, ink, anim });
  const inner = svg.replace('<svg ', `<svg style="display:inline-block;height:${hEm}em;vertical-align:${vaEm}em;margin:0 ${F.lsb}em;overflow:visible" `);
  return `<span class="wm" style="font-family:${F.family};font-weight:${F.weight};font-size:${size}px;line-height:1;white-space:nowrap;letter-spacing:0;color:${ink};display:inline-block;${extra}">${before}${inner}${after}</span>`;
}
// Standalone mark in an S x S box.
function mark(dir, { on, size, ink, anim = false, boxBg = '' }) {
  const col = on ? 'var(--accent)' : 'var(--slate)';
  const scale = { A: 0.80, B: 0.82, C: 0.80 }[dir];
  const svg = GLYPH[dir]({ on, col, ink, anim }).replace('<svg ', `<svg style="display:block;height:${f2(size * scale)}px;overflow:visible" `);
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;flex:none;${boxBg}">${svg}</div>`;
}
// "On" lockup tile (toggle + n), the app-icon form.
function tile(dir, { on, bg, ink, size = 96, radius = 22 }) {
  const F = FONTS[dir];
  const fs = Math.round((size * 0.40) / F.cap);
  return `<div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${bg};--bg:${bg};display:flex;align-items:center;justify-content:center;flex:none">${wordmark(dir, { on, size: fs, ink, before: '', after: 'n' })}</div>`;
}

const label = (t, extra = '') => `<div style="font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(242,243,245,0.5);${extra}">${t}</div>`;
const labelDark = (t) => `<div style="font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(22,26,33,0.5)">${t}</div>`;

const COMMON_CSS = `
    body { margin: 0; background: ${CHARCOAL}; }
    a { color: ${ACCENT}; } a:hover { color: #FFB84D; }
    .wm svg path, .wm svg rect, .wm svg circle, .mk svg path, .mk svg rect, .mk svg circle { transition: fill .35s ease, stroke .35s ease, transform .35s cubic-bezier(.2,.8,.2,1); }
    .offpanel:hover .ringA { stroke: var(--accent) !important; }
    .offpanel:hover .barA { fill: var(--accent) !important; transform: translateY(-14px) !important; }
    .offpanel:hover .pillB { fill: var(--accent) !important; }
    .offpanel:hover .holeB { transform: translateY(-36px) !important; }
    .offpanel:hover .topC { fill: var(--accent) !important; }
    @keyframes swA-ring { 0%,40% { stroke: var(--slate); } 46%,92% { stroke: var(--accent); } 100% { stroke: var(--slate); } }
    @keyframes swA-bar { 0%,40% { fill: var(--slate); transform: translateY(0px); } 46%,92% { fill: var(--accent); transform: translateY(-14px); } 100% { fill: var(--slate); transform: translateY(0px); } }
    @keyframes swB-pill { 0%,40% { fill: var(--slate); } 46%,92% { fill: var(--accent); } 100% { fill: var(--slate); } }
    @keyframes swB-hole { 0%,40% { transform: translateY(0px); } 46%,92% { transform: translateY(-36px); } 100% { transform: translateY(0px); } }
    @keyframes swC-top { 0%,40% { fill: var(--slate); } 46%,92% { fill: var(--accent); } 100% { fill: var(--slate); } }
    .demo .ringA.anim { animation: swA-ring 5s ease-in-out infinite; }
    .demo .barA.anim { animation: swA-bar 5s cubic-bezier(.2,.8,.2,1) infinite; }
    .demo .pillB.anim { animation: swB-pill 5s ease-in-out infinite; }
    .demo .holeB.anim { animation: swB-hole 5s cubic-bezier(.2,.8,.2,1) infinite; }
    .demo .topC.anim { animation: swC-top 5s ease-in-out infinite; }
`;

function head(fontLinks, extraCss = '') {
  const links = fontLinks.map((l) => `family=${l}`).join('&');
  return `<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${links}&display=swap">
  <style>${COMMON_CSS}${extraCss}
  </style>
</helmet>`;
}

function shell({ body, fontLinks, width, height, extraCss = '' }) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
${head(fontLinks, extraCss)}
<div style="--accent: {{accent}}; --slate: ${SLATE}; --charcoal: ${CHARCOAL}; --chalk: ${CHALK}; --ink: ${CHALK}; --bg: ${CHARCOAL}; width: ${width}px; min-height: ${height}px; box-sizing: border-box; background: ${CHARCOAL}; color: ${CHALK}; padding: 56px; display: flex; flex-direction: column; gap: 28px">
${body}
</div>
</x-dc>
<script data-dc-script data-props='{"accent":{"editor":"color","default":"${ACCENT}","options":${JSON.stringify(ACCENT_OPTIONS)},"section":"Brand"},"$preview":{"width":${width},"height":${height}}}'>
class Component extends DCLogic {
  renderVals() {
    return { accent: this.props.accent ?? '${ACCENT}' };
  }
}
</script>
</body>
</html>
`;
}

const panel = (inner, extra = '') => `<div style="border: 1px solid rgba(242,243,245,0.10); border-radius: 6px; ${extra}">${inner}</div>`;
const lightPanel = (inner, extra = '') => `<div style="background: ${CHALK}; --ink: ${CHARCOAL}; --bg: ${CHALK}; border-radius: 6px; ${extra}">${inner}</div>`;

function swatches() {
  const sw = (bg, name, hex, role) => `<div style="flex: 1; display: flex; flex-direction: column; gap: 10px"><div style="height: 88px; border-radius: 6px; background: ${bg}; border: 1px solid rgba(242,243,245,0.10)"></div><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size: 15px; font-weight: 500">${name}</span><span style="font-size: 13px; color: rgba(242,243,245,0.55); font-variant-numeric: tabular-nums">${hex}</span></div><div style="font-size: 13px; line-height: 1.4; color: rgba(242,243,245,0.55)">${role}</div></div>`;
  return `<div style="display: flex; gap: 20px">
      ${sw(CHARCOAL, 'Charcoal', CHARCOAL, 'Base. Backgrounds, and text on light.')}
      ${sw('var(--accent)', 'Amber', '{{accent}}', 'Accent. The ON state, and nothing else.')}
      ${sw(SLATE, 'Slate', SLATE, 'Neutral. The OFF state, secondary text.')}
      ${sw(CHALK, 'Chalk', CHALK, 'Neutral. Light backgrounds, text on dark.')}
    </div>`;
}

function directionSheet(dir, { letter, name, rationale, heroSize, panelSize }) {
  const F = FONTS[dir];
  const ink = 'var(--ink)';
  const sizes = [96, 48, 24, 16];
  const strip = (on) => `<div style="display: flex; align-items: flex-end; gap: 22px">${sizes.map((s) => mark(dir, { on, size: s, ink })).join('')}</div>`;
  const body = `
  <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px">
    <div style="display: flex; flex-direction: column; gap: 6px">
      ${label(`Direction ${letter}`)}
      <div style="font-size: 34px; font-weight: ${F.weight}; line-height: 1.1">${name}</div>
    </div>
    <p style="margin: 0; max-width: 520px; font-size: 14px; line-height: 1.5; color: rgba(242,243,245,0.65); text-wrap: pretty">${rationale}</p>
  </div>

  ${panel(`<div style="height: 300px; display: flex; align-items: center; justify-content: center">${wordmark(dir, { on: true, size: heroSize, ink })}</div>`)}

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
    ${lightPanel(`<div style="height: 168px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; padding: 18px 24px 22px">${labelDark('On · light background')}<div style="display:flex;justify-content:center">${wordmark(dir, { on: true, size: panelSize, ink })}</div></div>`)}
    ${panel(`<div class="offpanel" style="height: 168px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; padding: 18px 24px 22px">${label('Off · dormant state')}<div style="display:flex;justify-content:center">${wordmark(dir, { on: false, size: panelSize, ink, anim: true })}</div></div>`)}
  </div>

  <div style="display: flex; flex-direction: column; gap: 14px">
    ${label('Mark alone · 96 / 48 / 24 / 16')}
    ${panel(`<div class="mk" style="display: flex; align-items: center; justify-content: space-between; padding: 22px 28px; gap: 40px">${strip(false)}<div style="width: 1px; align-self: stretch; background: rgba(242,243,245,0.10)"></div>${strip(true)}</div>`)}
    ${lightPanel(`<div class="mk" style="display: flex; align-items: center; justify-content: space-between; padding: 22px 28px; gap: 40px">${strip(false)}<div style="width: 1px; align-self: stretch; background: rgba(22,26,33,0.10)"></div>${strip(true)}</div>`)}
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
    <div style="display: flex; flex-direction: column; gap: 14px">
      ${label('App icon · the word “On”')}
      ${panel(`<div style="display: flex; gap: 20px; padding: 22px 24px; align-items: center">${tile(dir, { on: true, bg: CHARCOAL, ink: CHALK })}${tile(dir, { on: false, bg: CHARCOAL, ink: CHALK })}${tile(dir, { on: true, bg: CHALK, ink: CHARCOAL })}</div>`)}
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px">
      ${label('Section divider · the recurring switch-on moment')}
      ${panel(`<div class="demo" style="height: 140px; box-sizing: border-box; display: flex; align-items: center; gap: 18px; padding: 0 28px"><div style="flex: 1; height: 2px; background: rgba(242,243,245,0.12)"></div>${mark(dir, { on: false, size: 44, ink, anim: true })}<div style="flex: 1; height: 2px; background: rgba(242,243,245,0.12)"></div></div>`)}
    </div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 14px">
    ${label('Palette')}
    ${swatches()}
  </div>
`;
  return shell({ body, fontLinks: [F.link], width: 1100, height: 1500, extraCss: `\n    body { font-family: ${F.family}; }` });
}

const DIRS = {
  A: { file: 'Standby', letter: 'A', name: 'Standby', heroSize: 64, panelSize: 38,
    rationale: 'The standard power glyph, drawn at the same stem weight as the type so it sits in the word as a letter. Off: the bar rests flush with the cap line. On: it lifts clear of the ring. The most instantly understood of the three, and the least ownable, because the same glyph is on every device.' },
  B: { file: 'Slide', letter: 'B', name: 'Slide', heroSize: 78, panelSize: 46,
    rationale: 'The O becomes a solid slide toggle and its counter becomes the knob: low when off, high when on. The most modern and the most naturally animated. It reads slightly more “smart home app” than “trade”, and the O is a heavier shape than its neighbours.' },
  C: { file: 'Rocker', letter: 'C', name: 'Rocker', heroSize: 60, panelSize: 36,
    rationale: 'A wall rocker switch, face on: the O is split into two paddles and the top one is the indicator lamp. Off: dark. On: amber. The most physical and the most “electrician” of the three. It is also the heaviest O, the change is colour only (so the least kinetic), and it is the least literal at 16 px.' },
};

// ---- Main: side-by-side overview ----
function overview() {
  const ink = 'var(--ink)';
  const row = (dir) => {
    const D = DIRS[dir], F = FONTS[dir];
    return `<div style="display: grid; grid-template-columns: 150px minmax(0, 1fr) 150px; gap: 24px; align-items: center; padding: 22px 0; border-top: 1px solid rgba(242,243,245,0.10)">
      <div style="display: flex; flex-direction: column; gap: 4px"><div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(242,243,245,0.5)">Direction ${D.letter}</div><div style="font-family: ${F.family}; font-weight: ${F.weight}; font-size: 24px">${D.name}</div></div>
      <div style="display: flex; align-items: center; justify-content: center">${wordmark(dir, { on: true, size: 46, ink })}</div>
      <div class="mk" style="display: flex; align-items: center; justify-content: flex-end; gap: 12px">${mark(dir, { on: false, size: 44, ink })}${mark(dir, { on: true, size: 44, ink })}</div>
    </div>`;
  };
  const body = `
  <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px">
    <div style="display: flex; flex-direction: column; gap: 6px">
      ${label('Logo directions')}
      <div style="font-size: 34px; font-weight: 600; line-height: 1.1">Always On Electrical</div>
    </div>
    <p style="margin: 0; max-width: 520px; font-size: 14px; line-height: 1.5; color: rgba(242,243,245,0.65); text-wrap: pretty">Three ways to build the toggle into the O, each with its own typeface. Same palette throughout. The full sheet for each direction is below.</p>
  </div>
  <div style="display: flex; flex-direction: column">
    ${row('A')}${row('B')}${row('C')}
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; border-top: 1px solid rgba(242,243,245,0.10); padding-top: 22px">
    <div style="font-size: 13px; line-height: 1.5; color: rgba(242,243,245,0.65)"><strong style="color:${CHALK}">A · Standby.</strong> Sora. Most instantly read as “power”. Least ownable.</div>
    <div style="font-size: 13px; line-height: 1.5; color: rgba(242,243,245,0.65)"><strong style="color:${CHALK}">B · Slide.</strong> Barlow Semi Condensed. Most modern, best animation. Reads a little “app”.</div>
    <div style="font-size: 13px; line-height: 1.5; color: rgba(242,243,245,0.65)"><strong style="color:${CHALK}">C · Rocker.</strong> Archivo. Most physical and “trade”. Colour-only switch, least literal when tiny.</div>
  </div>`;
  return shell({ body, fontLinks: Object.values(FONTS).map((f) => f.link), width: 1100, height: 640, extraCss: `\n    body { font-family: system-ui, 'Segoe UI', sans-serif; }` });
}

// ---- Emit ----
const files = { 'Overview.dc.html': overview() };
for (const dir of ['A', 'B', 'C']) files[`${DIRS[dir].file}.dc.html`] = directionSheet(dir, DIRS[dir]);
mkdirSync('preview', { recursive: true });
for (const [name, src] of Object.entries(files)) {
  writeFileSync(name, src);
  // Plain preview: strip runtime bits, substitute the tweak default.
  const helmet = (src.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  const prev = src.replace('<script src="./support.js"></script>', '').replace(/<helmet>[\s\S]*?<\/helmet>/, '').replace('</head>', `${helmet}</head>`)
    .replace(/<script data-dc-script[\s\S]*?<\/script>/, '').replace(/<\/?x-dc>/g, '').replace(/\{\{accent\}\}/g, ACCENT);
  writeFileSync(`preview/${name.replace('.dc.html', '.html')}`, prev);
}
const canvas = {
  artboards: [
    { file: 'Overview.dc.html', x: 0, y: 0, w: 1100, h: 640, title: 'Overview' },
    { file: 'Standby.dc.html', x: 0, y: 800, w: 1100, h: 1500, title: 'A · Standby' },
    { file: 'Slide.dc.html', x: 1200, y: 800, w: 1100, h: 1500, title: 'B · Slide' },
    { file: 'Rocker.dc.html', x: 2400, y: 800, w: 1100, h: 1500, title: 'C · Rocker' },
  ],
  launch: { view: 'canvas' },
};
writeFileSync('canvas.json', JSON.stringify(canvas, null, 2));
console.log('built', Object.keys(files).join(', '), '+ canvas.json');

// ---- Inspection page (preview only): huge lockups against an H for cap/baseline reference ----
{
  const rows = ['A', 'B', 'C'].map((dir) => {
    const F = FONTS[dir];
    const big = (on) => wordmark(dir, { on, size: 300, ink: CHALK, before: 'H', after: 'n' });
    const small = [16, 24, 32, 48].map((s) => mark(dir, { on: true, size: s, ink: CHALK })).join('');
    const smallOff = [16, 24, 32, 48].map((s) => mark(dir, { on: false, size: s, ink: CHALK })).join('');
    return `<div style="display:flex;align-items:center;gap:40px;padding:10px 0;border-bottom:1px solid #333">${big(false)}${big(true)}<div style="display:flex;align-items:flex-end;gap:10px">${smallOff}${small}</div><div style="font:20px system-ui;color:#aaa">${dir}</div></div>`;
  }).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${Object.values(FONTS).map((f) => `family=${f.link}`).join('&')}&display=swap"><style>body{margin:0;background:${CHARCOAL};--accent:${ACCENT};--slate:${SLATE};--ink:${CHALK};--bg:${CHARCOAL};padding:20px;width:2400px}</style></head><body>${rows}</body></html>`;
  writeFileSync('preview/inspect.html', html);
}
