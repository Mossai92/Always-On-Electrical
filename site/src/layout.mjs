// Page shell: head, header/nav, footer. Every page goes through page().
import { SITE, NAV, FOOTER, countiesProse } from './content.mjs';
import { wordmark, ICONS } from './brand.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const flatBtn = (label, href, { cls = '' } = {}) => `<a class="btn ${cls}" href="${href}">${label}</a>`;
export const ghostBtn = (label, href, icon) => `<a class="btn btn--ghost" href="${href}">${ICONS[icon] || ''}${label}</a>`;
export const phoneLink = (cls = 'phone-link') => `<a class="${cls}" href="tel:${SITE.phoneTel}">${ICONS.phone}<span>${SITE.phone}</span></a>`;
export const whatsappLink = (cls = 'phone-link') => `<a class="${cls}" href="https://wa.me/${SITE.whatsapp}" rel="noopener">${ICONS.whatsapp}<span>WhatsApp</span></a>`;
export const eyebrow = (t) => `<p class="eyebrow">${t}</p>`;

function header(active) {
  const links = NAV.filter(([, , flag]) => flag !== 'reviews' || SITE.showReviewsInNav)
    .map(([href, label]) => `<li><a href="${href}"${label === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  return `<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__brand" href="index.html" aria-label="${SITE.name} home">${wordmark()}</a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="site-nav__list">${links}</ul>
      <div class="site-nav__actions">${phoneLink()}${flatBtn('Request a callout', 'index.html#request')}</div>
    </nav>
    <div class="site-header__mobile">
      <a class="icon-btn" href="tel:${SITE.phoneTel}" aria-label="Call ${SITE.phone}">${ICONS.phone}</a>
      <button class="icon-btn nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Menu"><span class="nav-toggle__open">${ICONS.menu}</span><span class="nav-toggle__close">${ICONS.close}</span></button>
    </div>
  </div>
</header>`;
}

function footer() {
  const a = SITE.address;
  return `<footer class="site-footer" id="contact">
  <div class="container">
    <div class="site-footer__grid">
      <div class="site-footer__brand">${wordmark()}<p>${FOOTER.blurb}</p></div>
      <div class="site-footer__col"><h2>Contact</h2><ul><li><a href="tel:${SITE.phoneTel}">Call or text ${SITE.phone}</a></li><li><a href="https://wa.me/${SITE.whatsapp}" rel="noopener">WhatsApp</a></li><li><a href="mailto:${SITE.email}">${SITE.email}</a></li></ul></div>
      <div class="site-footer__col"><h2>Pages</h2><ul>${FOOTER.pages.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div class="site-footer__col"><h2>Registered</h2><ul><li>Safe Electric REC ${SITE.rec}</li><li>Insured with ${SITE.insurer}</li><li>${a.street}, ${a.locality}, ${a.region}</li></ul></div>
    </div>
    <div class="site-footer__bottom"><span>© ${SITE.year} ${SITE.name}</span><span>${SITE.domain}</span></div>
  </div>
</footer>`;
}

export function page({ slug, title, description, body, active = '', jsonLd = null, bodyClass = '', noindex = false }) {
  const url = `${SITE.url}/${slug === 'index' ? '' : slug + '.html'}`;
  const fullTitle = slug === 'index' ? `${SITE.name} · Electrician in ${countiesProse()}` : `${title} · ${SITE.name}`;
  return `<!doctype html>
<html lang="en-IE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.url}/assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SITE.name}: electrician for homes and small businesses, ${countiesProse()}">
<meta property="og:locale" content="en_IE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE.url}/assets/img/og-image.png">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
<meta name="theme-color" content="#201E1D">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="assets/site.webmanifest">
<link rel="preload" href="assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to content</a>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}
