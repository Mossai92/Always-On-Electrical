import { readFileSync, writeFileSync } from 'node:fs';
const MAT = { brushed_steel: '#C9CCCE', signal_red: '#ED2F13', chalk_white: '#F3F2F2', graphite: '#1F1E1D' };
function parse(file) {
  const v = [], objs = []; let cur = null;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const p = line.trim().split(/\s+/);
    if (p[0] === 'v') v.push([+p[1], +p[2], +p[3]]);
    else if (p[0] === 'o') { cur = { name: p[1], mtl: '', faces: [] }; objs.push(cur); }
    else if (p[0] === 'usemtl') cur.mtl = p[1];
    else if (p[0] === 'f') cur.faces.push(p.slice(1).map((s) => +s.split('/')[0] - 1));
  }
  return { v, objs };
}
for (const name of ['Logo', 'Button']) {
  const { v, objs } = parse(`../assets/3d/always-on-${name}.obj`);
  const all = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  const info = objs.map((o) => {
    const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (const f of o.faces) for (const i of f) { const p = v[i]; for (let k = 0; k < 3; k++) { b[k] = Math.min(b[k], p[k]); b[k + 3] = Math.max(b[k + 3], p[k]); all[k] = Math.min(all[k], p[k]); all[k + 3] = Math.max(all[k + 3], p[k]); } }
    return { o, b };
  });
  const ext = [all[3] - all[0], all[4] - all[1], all[5] - all[2]];
  const depthAxis = ext.indexOf(Math.min(...ext));
  const [ax, ay] = [0, 1, 2].filter((k) => k !== depthAxis);
  console.log(`=== ${name}: extent x ${ext[0].toFixed(3)} y ${ext[1].toFixed(3)} z ${ext[2].toFixed(3)} -> depth axis ${'xyz'[depthAxis]}, view plane ${'xyz'[ax]}${'xyz'[ay]}`);
  for (const { o, b } of info) console.log(`  ${o.name.padEnd(12)} ${o.mtl.padEnd(14)} faces ${String(o.faces.length).padStart(5)}  bbox x[${b[0].toFixed(3)}, ${b[3].toFixed(3)}] y[${b[1].toFixed(3)}, ${b[4].toFixed(3)}] z[${b[2].toFixed(3)}, ${b[5].toFixed(3)}]`);
  // flat orthographic projection SVG, sorted by depth (back to front)
  const W = 1000, s = W / Math.max(ext[ax], ext[ay]);
  const X = (p) => ((p[ax] - all[ax]) * s).toFixed(1), Y = (p) => ((all[ay + 3] - p[ay]) * s).toFixed(1);
  const tris = [];
  for (const { o } of info) for (const f of o.faces) { const d = f.reduce((a, i) => a + v[i][depthAxis], 0) / f.length; tris.push({ d, f, c: MAT[o.mtl] || '#f0f', n: o.name }); }
  tris.sort((a, b) => a.d - b.d);
  const H = ext[ay] * s, Wd = ext[ax] * s;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd.toFixed(0)} ${H.toFixed(0)}" width="${Wd.toFixed(0)}" height="${H.toFixed(0)}"><rect width="100%" height="100%" fill="#8899aa"/>${tris.map((t) => `<polygon points="${t.f.map((i) => `${X(v[i])},${Y(v[i])}`).join(' ')}" fill="${t.c}" stroke="${t.c}" stroke-width="0.4"/>`).join('')}</svg>`;
  writeFileSync(`preview/ortho-${name}.svg`, svg);
  writeFileSync(`preview/ortho-${name}.html`, `<!doctype html><html><body style="margin:0;background:#8899aa">${svg}</body></html>`);
  console.log(`  wrote preview/ortho-${name}.svg (${(svg.length / 1024).toFixed(0)} KB), size ${Wd.toFixed(0)}x${H.toFixed(0)}`);
}
