// Checks the built site in dist/: every internal link and asset resolves, every fragment link
// points at an existing id, and every page has a title, a description, a canonical URL and one h1.
// Usage: node check.mjs [dist-demo]   (run from the site/ folder, after build.mjs)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, posix } from 'node:path';

const dist = join(dirname(fileURLToPath(import.meta.url)), process.argv[2] || 'dist');
const demo = dist.endsWith('dist-demo');
const pages = readdirSync(dist).filter((f) => f.endsWith('.html'));
const ids = new Map();
for (const p of pages) {
  const html = readFileSync(join(dist, p), 'utf8');
  ids.set(p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
const problems = [];
for (const p of pages) {
  const html = readFileSync(join(dist, p), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  if (!/<title>[^<]+<\/title>/.test(head)) problems.push(`${p}: no <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(head)) problems.push(`${p}: no meta description`);
  if (!/<link rel="canonical" href="https:\/\//.test(head)) problems.push(`${p}: no canonical`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${p}: ${h1s} h1 elements`);
  if (/\[[A-Z][A-Z /:.'-]+\]/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) {
    const found = [...new Set(html.match(/\[[A-Z][A-Z /:.'-]+\]/g))];
    console.log(`note  ${p}: placeholders still to fill: ${found.join(', ')}`);
  }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:)/.test(raw)) continue;
    if (raw.startsWith('[')) continue; // bracketed placeholder link, reported above
    const [pathPart, fragment] = raw.split('#');
    let target = pathPart === '' ? p : pathPart;
    if (target.startsWith('/')) target = target.slice(1);
    target = posix.normalize(target.split('?')[0]);
    if (target && !existsSync(join(dist, target))) { problems.push(`${p}: missing target ${raw}`); continue; }
    if (fragment !== undefined && fragment !== '') {
      const targetPage = target.endsWith('.html') ? target : p;
      if (!ids.get(targetPage)?.has(fragment)) problems.push(`${p}: fragment #${fragment} not found in ${targetPage}`);
    }
  }
}
const required = demo
  ? ['robots.txt', '.nojekyll', 'assets/site.webmanifest', 'assets/img/og-image.png', 'assets/img/icon-512.png']
  : ['sitemap.xml', 'robots.txt', '.htaccess', 'assets/site.webmanifest', 'assets/img/og-image.png', 'assets/img/icon-512.png', 'api/request.php'];
for (const f of required) {
  if (!existsSync(join(dist, f))) problems.push(`missing ${f}`);
}
if (problems.length) {
  console.error(problems.map((x) => 'FAIL  ' + x).join('\n'));
  process.exit(1);
}
console.log(`ok    ${pages.length} pages checked, all links and assets resolve`);
