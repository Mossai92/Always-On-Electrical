// Brand components: the mark (steel power ring + red bolt), the wordmark lockup, the physical button, and the icon set.
// Geometry is the 2D trace of assets/3d/always-on-Logo.obj and always-on-Button.obj (see brand/build-home.mjs).

export const BOLT = '-0.139,-1.234 0.18,-1.234 0.066,-0.631 0.236,-0.631 -0.037,0.254 0.01,-0.268 -0.207,-0.268';
export const RING = 'M 0.3726 -0.744 A 0.832 0.832 0 1 1 -0.3726 -0.744';
export const KEY = 'M 0.341 -0.7589 A 0.832 0.832 0 1 1 -0.341 -0.7589';

// Colours are CSS custom properties so the mark adapts to dark and light sections.
export function mark({ cls = 'mark', label = 'Always On mark' } = {}) {
  return `<svg class="${cls}" viewBox="-1.1 -1.3 2.2 2.4" role="img" aria-label="${label}"><path class="mark-key" d="${KEY}"></path><path class="mark-ring" d="${RING}"></path><polygon class="mark-bolt" points="${BOLT}"></polygon></svg>`;
}

// The mark stands in for the O of "On". Sized in em by CSS so it follows the text size.
export function wordmark({ cls = 'wordmark' } = {}) {
  return `<span class="${cls}"><span aria-hidden="true">Always ${mark({ cls: 'wordmark-mark', label: '' })}n Electrical</span><span class="visually-hidden">Always On Electrical</span></span>`;
}

let buttonId = 0;
// The physical red button. Gradient ids are made unique per instance so several can share a page.
export function physButton({ label = 'Request a callout' } = {}) {
  const id = ++buttonId;
  return `<svg class="pbtn" viewBox="-1.75 -1.75 3.5 3.6" role="img" aria-label="${label}"><defs><radialGradient id="pbtn-cap-${id}" cx="0.36" cy="0.32" r="0.85"><stop offset="0" stop-color="#FF7A5C"></stop><stop offset="0.45" stop-color="#EC3013"></stop><stop offset="1" stop-color="#B4220C"></stop></radialGradient><linearGradient id="pbtn-bezel-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0F2F3"></stop><stop offset="0.5" stop-color="#C9CCCE"></stop><stop offset="1" stop-color="#787D80"></stop></linearGradient><linearGradient id="pbtn-well-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4E5356"></stop><stop offset="1" stop-color="#B3B7BA"></stop></linearGradient></defs><ellipse class="pbtn-shadow" cx="0" cy="1.66" rx="1.45" ry="0.11"></ellipse><circle class="pbtn-plate" r="1.655"></circle><circle class="pbtn-plate-edge" r="1.655"></circle><circle r="1.277" fill="url(#pbtn-bezel-${id})"></circle><circle r="1.05" fill="url(#pbtn-well-${id})"></circle><circle class="pbtn-side" cy="0.07" r="1"></circle><g class="pbtn-face"><circle r="1" fill="url(#pbtn-cap-${id})"></circle><circle class="pbtn-rim" r="1"></circle><g transform="scale(0.617)"><path class="pbtn-glyph-ring" d="${RING}"></path><polygon class="pbtn-glyph-bolt" points="${BOLT}"></polygon></g></g></svg>`;
}

const ic = (d) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
export const ICONS = {
  socket: ic('<rect x="3" y="3" width="18" height="18" rx="3"></rect><rect x="10.5" y="7" width="3" height="4" rx="0.5"></rect><rect x="6.5" y="13" width="3" height="4" rx="0.5"></rect><rect x="14.5" y="13" width="3" height="4" rx="0.5"></rect>'),
  lighting: ic('<path d="M9 18h6"></path><path d="M10 21h4"></path><path d="M12 3a6 6 0 0 0-3.5 10.9c.7.5 1 1.3 1 2.1h5c0-.8.3-1.6 1-2.1A6 6 0 0 0 12 3z"></path>'),
  board: ic('<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 9v6M11 9v6M15 9v6"></path><path d="M19 8v8"></path>'),
  ev: ic('<rect x="4" y="3" width="12" height="18" rx="2"></rect><path d="M16 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0"></path><path d="M11 7l-2.5 5H11l-1 4 3-5.5H10.5z"></path>'),
  smart: ic('<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M9.5 16.5a3.5 3.5 0 0 1 5 0"></path><path d="M7.5 14a6.5 6.5 0 0 1 9 0"></path>'),
  fault: ic('<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M20 20l-4.5-4.5"></path><path d="M11.5 7l-2.5 4h2.5l-1 3"></path>'),
  cert: ic('<path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v4h4"></path><path d="M9 14l2 2 4-4"></path>'),
  pat: ic('<path d="M9 3v4M15 3v4"></path><rect x="6" y="7" width="12" height="7" rx="2"></rect><path d="M12 14v3"></path><path d="M8 20h8l-1-3H9z"></path>'),
  shop: ic('<path d="M4 10l1-5h14l1 5"></path><path d="M4 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"></path><path d="M5 12v8h14v-8"></path><path d="M10 20v-5h4v5"></path>'),
  shield: ic('<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path>'),
  umbrella: ic('<path d="M3 13a9 9 0 0 1 18 0z"></path><path d="M12 13v6a2 2 0 0 0 4 0"></path><path d="M12 3v2"></path>'),
  pin: ic('<path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z"></path><circle cx="12" cy="10" r="2.2"></circle>'),
  clock: ic('<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>'),
  phone: ic('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path>'),
  arrow: ic('<path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path>'),
  menu: ic('<path d="M4 7h16M4 12h16M4 17h16"></path>'),
  close: ic('<path d="M6 6l12 12M18 6L6 18"></path>'),
  camera: ic('<path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle>'),
  whatsapp: ic('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"></path><path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-2-1-1 1a4 4 0 0 1-1.5-1.5l1-1-1-2z"></path>'),
  check: ic('<path d="M5 12l4 4L19 7"></path>'),
  mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path>'),
  quote: ic('<path d="M7 16c-1.7 0-3-1.3-3-3V8h5v5H6c0 .6.4 1 1 1z"></path><path d="M16 16c-1.7 0-3-1.3-3-3V8h5v5h-3c0 .6.4 1 1 1z"></path>'),
  star: ic('<path d="M12 3l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 21.1l1.3-6.6L2.5 9.9l6.6-.8z"></path>'),
};
export const STAR_FILLED = `<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"></path></svg>`;
export const stars = (n = 5) => `<div class="stars" aria-label="${n} out of 5 stars">${STAR_FILLED.repeat(n)}</div>`;
