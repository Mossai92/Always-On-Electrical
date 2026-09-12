// Builds the static site into dist/ (what gets uploaded to public_html on Eirhost).
// Usage: node build.mjs   (run from the site/ folder)
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITE } from './src/content.mjs';
import * as pages from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const dist = join(root, 'dist');

// keep a local api/config.php across rebuilds (it is never committed)
const localConfig = join(dist, 'api', 'config.php');
const keptConfig = existsSync(localConfig) ? readFileSync(localConfig) : null;
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const PAGES = [
  ['index.html', pages.index, { sitemap: true, priority: '1.0' }],
  ['services.html', pages.services, { sitemap: true, priority: '0.9' }],
  ['service-area.html', pages.serviceArea, { sitemap: true, priority: '0.8' }],
  ['reviews.html', pages.reviews, { sitemap: true, priority: '0.6' }],
  ['contact.html', pages.contact, { sitemap: true, priority: '0.9' }],
  ['privacy.html', pages.privacy, { sitemap: true, priority: '0.2' }],
  ['thank-you.html', pages.thankYou, { sitemap: false }],
  ['404.html', pages.notFound, { sitemap: false }],
];
for (const [name, render] of PAGES) writeFileSync(join(dist, name), render());

cpSync(join(src, 'assets'), join(dist, 'assets'), { recursive: true });
if (existsSync(join(src, 'api'))) cpSync(join(src, 'api'), join(dist, 'api'), { recursive: true, filter: (p) => !/config\.php$/.test(p) || p.endsWith('config.example.php') });
if (keptConfig) writeFileSync(localConfig, keptConfig);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter(([, , o]) => o.sitemap).map(([n, , o]) => `  <url><loc>${SITE.url}/${n === 'index.html' ? '' : n}</loc><lastmod>${today}</lastmod><priority>${o.priority}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(join(dist, '.htaccess'), `# Always On Electrical — Apache (cPanel) configuration
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # force https and the bare domain
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} ^www\\. [NC]
  RewriteRule ^ https://${SITE.domain}%{REQUEST_URI} [L,R=301]
  # allow clean URLs: /services -> services.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Strict-Transport-Security "max-age=31536000"
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# keep the handler's configuration and data private
<FilesMatch "^(config\\.php|.*\\.log)$">
  Require all denied
</FilesMatch>
`);

console.log(`built ${PAGES.length} pages into dist/`);

// node build.mjs --zip  -> always-on-electrical-site.zip next to this file, for uploading through cPanel's File Manager
if (process.argv.includes('--zip')) {
  const { spawnSync } = await import('node:child_process');
  const zip = join(root, 'always-on-electrical-site.zip');
  rmSync(zip, { force: true });
  // bsdtar (Windows 10+ ships it at System32\tar.exe) writes zip entries with forward slashes,
  // which is what cPanel's extractor expects; PowerShell's Compress-Archive does not.
  const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
  // a local api/config.php must never travel in the zip: the server keeps its own
  const r = spawnSync(tar, ['-a', '-c', '-f', zip, '--exclude', './api/config.php', '--exclude', './api/data/*.json', '--exclude', './api/data/*.log', '-C', dist, '.'], { stdio: 'inherit' });
  console.log(r.status === 0 && existsSync(zip) ? `zipped dist/ into ${zip}` : 'zip failed');
}
