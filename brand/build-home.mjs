// Always On Electrical — home page, reviews page (desktop + mobile) and brand sheet, from the 3D logo/button references.
import { writeFileSync } from 'node:fs';

// Palette from the OBJ materials (linear -> sRGB)
const GRAPHITE = '#201E1D', STEEL = '#C9CCCE', RED = '#EC3013', CHALK = '#F3F2F2';
const STEEL_DK = '#8E9396', PLATE = '#2A2827', PAPER = '#FFFFFF';
const FONT = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
const FONT_LINK = 'family=Archivo:wght@400;500;600;700;800&amp;display=swap';

// Business facts (entered by the user on the canvas; bracketed = still to come)
const PHONE = '+353 (83) 481 2044', PHONE_TEL = 'tel:+353834812044';
const EMAIL = 'pete@alwaysonelectrical.ie';
const ADDRESS = '7 Grangewood Court, Rochestown Avenue, Dún Laoghaire, Co. Dublin';
const EMPLOYER = 'C.J. Ryder Lawlor Ltd.';

let uid = 0;

// ---------- The mark: steel power ring + red bolt (2D rendition of always-on-Logo.obj) ----------
const BOLT = '-0.139,-1.234 0.18,-1.234 0.066,-0.631 0.236,-0.631 -0.037,0.254 0.01,-0.268 -0.207,-0.268';
const RING = 'M 0.3726 -0.744 A 0.832 0.832 0 1 1 -0.3726 -0.744';
const KEY = 'M 0.341 -0.7589 A 0.832 0.832 0 1 1 -0.341 -0.7589';
function mark({ ring = STEEL, bolt = RED, keyline = 'var(--keyline)', style = '', cls = '' }) {
  return `<svg viewBox="-1.1 -1.3 2.2 2.4" role="img" aria-label="Always On mark" class="${cls}" style="${style}"><path d="${KEY}" style="fill:none;stroke:${keyline};stroke-width:0.406;stroke-linecap:butt"></path><path class="mk-ring" d="${RING}" style="fill:none;stroke:${ring};stroke-width:0.336;stroke-linecap:butt"></path><polygon class="mk-bolt" points="${BOLT}" style="fill:${bolt}"></polygon></svg>`;
}
function wordmark({ size, ink, weight = 600, before = 'Always ', after = 'n Electrical', keyline = 'var(--keyline)' }) {
  const svg = mark({ keyline, style: 'display:inline-block;height:0.852em;vertical-align:-0.0475em;margin:0 0.01em;overflow:visible' });
  return `<span class="wm" style="font-family:${FONT};font-weight:${weight};font-size:${size}px;line-height:1;letter-spacing:-0.01em;white-space:nowrap;color:${ink};display:inline-block">${before}${svg}${after}</span>`;
}

// ---------- The button: 2D rendition of always-on-Button.obj ----------
function physButton({ size, cls = 'abtn' }) {
  const id = ++uid;
  return `<svg viewBox="-1.75 -1.75 3.5 3.6" class="${cls}" role="img" aria-label="Request a callout" style="display:block;width:${size}px;height:${size}px;overflow:visible"><defs><radialGradient id="cap${id}" cx="0.36" cy="0.32" r="0.85"><stop offset="0" stop-color="#FF7A5C"></stop><stop offset="0.45" stop-color="${RED}"></stop><stop offset="1" stop-color="#B4220C"></stop></radialGradient><linearGradient id="bez${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0F2F3"></stop><stop offset="0.5" stop-color="${STEEL}"></stop><stop offset="1" stop-color="#787D80"></stop></linearGradient><linearGradient id="well${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4E5356"></stop><stop offset="1" stop-color="#B3B7BA"></stop></linearGradient></defs><ellipse cx="0" cy="1.66" rx="1.45" ry="0.11" style="fill:rgba(0,0,0,0.38)"></ellipse><circle r="1.655" style="fill:${PLATE}"></circle><circle r="1.655" style="fill:none;stroke:rgba(255,255,255,0.07);stroke-width:0.02"></circle><circle r="1.277" style="fill:url(#bez${id})"></circle><circle r="1.05" style="fill:url(#well${id})"></circle><circle cy="0.07" r="1" style="fill:#7E1808"></circle><g class="capface"><circle r="1" style="fill:url(#cap${id})"></circle><circle r="1" style="fill:none;stroke:rgba(0,0,0,0.22);stroke-width:0.018"></circle><g transform="scale(0.617)"><path d="${RING}" style="fill:none;stroke:${CHALK};stroke-width:0.234;stroke-linecap:butt"></path><polygon points="${BOLT}" style="fill:${CHALK}"></polygon></g></g></svg>`;
}

// ---------- Icons (24px grid, stroke) ----------
const ic = (d) => `<svg viewBox="0 0 24 24" style="width:24px;height:24px;display:block;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round">${d}</svg>`;
const sz = (svg, px) => svg.replace('width:24px;height:24px', `width:${px}px;height:${px}px`);
const ICONS = {
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
  camera: ic('<path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle>'),
  whatsapp: ic('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"></path><path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-2-1-1 1a4 4 0 0 1-1.5-1.5l1-1-1-2z"></path>'),
  check: ic('<path d="M5 12l4 4L19 7"></path>'),
  mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path>'),
  quote: ic('<path d="M7 16c-1.7 0-3-1.3-3-3V8h5v5H6c0 .6.4 1 1 1z"></path><path d="M16 16c-1.7 0-3-1.3-3-3V8h5v5h-3c0 .6.4 1 1 1z"></path>'),
  starline: ic('<path d="M12 3l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 21.1l1.3-6.6L2.5 9.9l6.6-.8z"></path>'),
};
const star = `<svg viewBox="0 0 24 24" style="width:16px;height:16px;display:block;fill:${RED}"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"></path></svg>`;
const stars = `<div style="display:flex;gap:3px">${star.repeat(5)}</div>`;

// ---------- Content ----------
const SERVICES = [
  ['socket', 'Sockets &amp; lighting', 'New points, moves, replacements and LED upgrades.'],
  ['board', 'Fuse board upgrades', 'Modern consumer units with RCD protection.'],
  ['ev', 'EV charger installs', 'Home charge points, wired and signed off.'],
  ['lighting', 'Rewires', 'Full and partial rewires, planned around you.'],
  ['fault', 'Fault-finding', 'Tripping breakers, dead circuits, flickering lights.'],
  ['smart', 'Smart home', 'Smart switches, heating controls, lighting scenes.'],
  ['cert', 'Safety certs (EICR)', 'Periodic inspection reports for landlords and businesses.'],
  ['pat', 'PAT testing', 'Portable appliance testing with records you can file.'],
  ['shop', 'Small commercial fit-outs', 'Shops, offices and units, wired and certified.'],
];
const TRUST = [
  ['shield', 'Safe Electric registered', 'On the national register of electrical contractors. REC no. [NUMBER]'],
  ['umbrella', 'Fully insured', 'Public liability cover on every job. Insured by [INSURER].'],
  ['pin', 'Local to you', 'Based in Dún Laoghaire, working across Dublin, Wicklow and Kildare.'],
];
const STATS = [['shield', 'Safe Electric registered · REC [NUMBER]'], ['umbrella', 'Fully insured'], ['clock', 'Evenings on weekdays, any time at weekends'], ['pin', 'Dublin, Wicklow and Kildare']];
const STEPS = [
  ['Tell us the job', 'A few lines is plenty. A photo of the socket, board or fault helps a lot.'],
  ['Pick days that suit', 'Two dates and a time window for each. Weekdays are evenings only; weekends are any time.'],
  ['Confirmation', 'By call or text, and the job is booked.'],
];
const ABOUT_1 = `Hello, I'm Peter. Your new local electrician. I finished my apprenticeship with ${EMPLOYER} and set up Always On Electrical for jobs on weekends and evening callouts. I am careful, tidy, and adhere to the latest wiring standards and rules. Every job is done by me, and I will tell you straight what needs doing and what does not.`;
const ABOUT_2 = `Being new to running my own business means every callout matters. You'll get a reply from me personally, and I'll never leave a job in a way that I'm not happy to put my name to.`;
const CHIPS = ['Fully qualified', `Apprenticeship with ${EMPLOYER}`, 'Based in Dún Laoghaire'];
const NAV = [['index.html#services', 'Services'], ['index.html#area', 'Service area'], ['reviews.html', 'Reviews'], ['index.html#about', 'About Peter'], ['index.html#contact', 'Contact']];
const REFERENCES = [
  [`[Reference from ${EMPLOYER}: a few lines on Peter's work and attitude during his apprenticeship.]`, `[NAME], [ROLE] · ${EMPLOYER}`],
  ['[Reference from a tutor or assessor: a few lines on Peter\'s training and qualification.]', '[NAME], [ROLE] · [TRAINING CENTRE / ETB]'],
];
const REVIEWS = [
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
];

// ---------- Shared bits ----------
const eyebrow = (t, col) => `<div style="font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${col}">${t}</div>`;
const flatBtn = (label, { size = 15, pad = '12px 20px', href = '#request' } = {}) => `<a href="${href}" class="btn" style="display:inline-flex;align-items:center;gap:8px;background:${RED};color:${CHALK};font-weight:700;font-size:${size}px;padding:${pad};border-radius:6px;text-decoration:none;white-space:nowrap">${label}</a>`;
const ghostBtn = (label, icon, { href = '#' } = {}) => `<a href="${href}" class="navlink" style="display:inline-flex;align-items:center;justify-content:center;gap:10px;border:1px solid rgba(243,242,242,0.3);color:${CHALK};font-weight:600;font-size:15px;padding:12px 18px;border-radius:6px;text-decoration:none;white-space:nowrap">${sz(ICONS[icon], 18)}${label}</a>`;
const textLink = (label, col, href = '#services') => `<a href="${href}" class="tlink" style="display:inline-flex;align-items:center;gap:8px;color:${col};font-weight:600;font-size:16px;text-decoration:none">${label}${sz(ICONS.arrow, 18)}</a>`;
const placeholder = (label, style) => `<div style="display:flex;align-items:center;justify-content:center;text-align:center;border:1.5px dashed ${STEEL_DK};color:${STEEL_DK};font-size:13px;font-weight:600;letter-spacing:0.04em;border-radius:8px;padding:20px;${style}">${label}</div>`;
const phoneLink = (extra = '') => `<a href="${PHONE_TEL}" class="navlink" style="display:inline-flex;align-items:center;gap:8px;color:${CHALK};font-weight:600;font-size:15px;${extra}">${sz(ICONS.phone, 18)}${PHONE}</a>`;
const whatsappLink = (extra = '') => `<a href="#" class="navlink" style="display:inline-flex;align-items:center;gap:8px;color:${CHALK};font-weight:600;font-size:15px;${extra}">${sz(ICONS.whatsapp, 18)}WhatsApp</a>`;

function navDesktop(active) {
  return `<div style="display:flex;align-items:center;justify-content:space-between;height:76px;padding:0 64px;border-bottom:1px solid rgba(243,242,242,0.10)">
    <a href="index.html" style="text-decoration:none">${wordmark({ size: 22, ink: CHALK })}</a>
    <div style="display:flex;align-items:center;gap:32px;font-size:15px;font-weight:500;color:rgba(243,242,242,0.78)">${NAV.map(([h, t]) => `<a href="${h}" class="navlink" style="${t === active ? `color:${CHALK};font-weight:600;border-bottom:2px solid ${RED};padding-bottom:2px` : ''}">${t}</a>`).join('')}</div>
    <div style="display:flex;align-items:center;gap:20px">${phoneLink()}${flatBtn('Request a callout', { href: 'index.html#request' })}</div>
  </div>`;
}
function navMobile() {
  return `<div style="display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px;border-bottom:1px solid rgba(243,242,242,0.10)">
    <a href="index.html" style="text-decoration:none">${wordmark({ size: 17, ink: CHALK })}</a>
    <div style="display:flex;align-items:center;gap:6px"><a href="${PHONE_TEL}" class="navlink" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:${CHALK}">${sz(ICONS.phone, 22)}</a><span style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:${CHALK}">${ICONS.menu}</span></div>
  </div>`;
}
const footerCol = (title, rows, gap = 10) => `<div style="display:flex;flex-direction:column;gap:${gap}px;font-size:14px;color:rgba(243,242,242,0.75)"><div style="font-weight:700;color:${CHALK};margin-bottom:4px">${title}</div>${rows.map((r) => `<div>${r}</div>`).join('')}</div>`;
function footerDesktop() {
  return `<div id="contact" style="border-top:1px solid rgba(243,242,242,0.12);padding:56px 64px 40px;display:flex;flex-direction:column;gap:40px">
    <div style="display:grid;grid-template-columns:minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));gap:40px">
      <div style="display:flex;flex-direction:column;gap:16px">${wordmark({ size: 22, ink: CHALK })}<p style="margin:0;font-size:14px;line-height:1.5;color:rgba(243,242,242,0.6);max-width:300px">Peter Agnew. Residential and small-commercial electrical contractor, Dublin, Wicklow and Kildare.</p></div>
      ${footerCol('Contact', [`Call or text ${PHONE}`, EMAIL])}
      ${footerCol('Pages', ['Services', 'Service area', 'Reviews', 'About Peter', 'Contact', 'Privacy policy'])}
      ${footerCol('Registered', ['Safe Electric REC [NUMBER]', 'Insured with [INSURER]', ADDRESS])}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:rgba(243,242,242,0.45);border-top:1px solid rgba(243,242,242,0.10);padding-top:20px"><div>© 2026 Always On Electrical</div><div>alwaysonelectrical.ie</div></div>
  </div>`;
}
function footerMobile() {
  return `<div id="contact" style="border-top:1px solid rgba(243,242,242,0.12);padding:40px 20px 32px;display:flex;flex-direction:column;gap:28px">
    <div style="display:flex;flex-direction:column;gap:12px">${wordmark({ size: 18, ink: CHALK })}<p style="margin:0;font-size:14px;line-height:1.5;color:rgba(243,242,242,0.6)">Peter Agnew. Residential and small-commercial electrical contractor, Dublin, Wicklow and Kildare.</p></div>
    <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:24px">
      ${footerCol('Contact', [`Call or text ${PHONE}`, `<span style="word-break:break-all">${EMAIL}</span>`], 8)}
      ${footerCol('Pages', ['Services', 'Service area', 'Reviews', 'About Peter', 'Contact', 'Privacy policy'], 8)}
    </div>
    ${footerCol('Registered', ['Safe Electric REC [NUMBER] · Insured with [INSURER]', ADDRESS], 8)}
    <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(243,242,242,0.45);border-top:1px solid rgba(243,242,242,0.10);padding-top:16px"><div>© 2026 Always On Electrical</div><div>alwaysonelectrical.ie</div></div>
  </div>`;
}

// ---------- Form (static mockup) ----------
const field = (label, control, help = '') => `<div style="display:flex;flex-direction:column;gap:6px"><label style="font-size:14px;font-weight:600;color:${GRAPHITE}">${label}</label>${control}${help ? `<div style="font-size:13px;color:${STEEL_DK}">${help}</div>` : ''}</div>`;
const input = (text, { h = 46, filled = false } = {}) => `<div style="height:${h}px;border:1px solid #C6C9CB;border-radius:6px;background:${PAPER};display:flex;align-items:center;padding:0 14px;font-size:15px;color:${filled ? GRAPHITE : STEEL_DK}">${text}</div>`;
const textarea = (ph) => `<div style="min-height:110px;border:1px solid #C6C9CB;border-radius:6px;background:${PAPER};padding:12px 14px;font-size:15px;color:${STEEL_DK};line-height:1.5">${ph}</div>`;
const chip = (label, { selected = false, disabled = false } = {}) => {
  const border = selected ? GRAPHITE : disabled ? '#E3E5E7' : '#C6C9CB';
  const boxBorder = selected ? GRAPHITE : disabled ? '#DADDDF' : '#9DA2A5';
  return `<div class="${disabled ? 'chip chip-off' : 'chip'}" style="display:flex;align-items:center;gap:10px;height:44px;border:1px solid ${border};border-radius:6px;padding:0 12px;font-size:14px;color:${disabled ? '#B0B4B7' : GRAPHITE};background:${disabled ? '#F6F6F6' : PAPER};${disabled ? 'cursor:not-allowed;' : 'cursor:pointer;'}"><span style="width:18px;height:18px;border-radius:4px;border:1.5px solid ${boxBorder};background:${selected ? GRAPHITE : disabled ? '#F6F6F6' : PAPER};display:flex;align-items:center;justify-content:center;color:${CHALK};flex:none">${selected ? sz(ICONS.check, 14).replace('stroke-width:1.75', 'stroke-width:2.5') : ''}</span>${label}</div>`;
};
const WINDOWS = ['Any time', 'Morning', 'Afternoon', 'Evening'];
function dateBlock({ label, optional = false, value, dayName, weekend, selected }) {
  const chips = WINDOWS.map((w) => chip(w, { selected: w === selected, disabled: !weekend && w !== 'Evening' })).join('');
  const note = weekend ? `${dayName} is a weekend day, so any window works.` : `${dayName} is a weekday, so evenings only.`;
  return `<div style="display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid rgba(32,30,29,0.12);border-radius:8px;background:${PAPER}">
    ${field(`${label}${optional ? ` <span style="font-weight:400;color:${STEEL_DK}">(optional)</span>` : ''}`, input(value, { h: 44, filled: true }))}
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:${GRAPHITE}"><span style="color:${weekend ? STEEL_DK : RED};display:flex">${sz(ICONS.clock, 16)}</span>${note}</div>
    <div style="font-size:13px;font-weight:600;color:${GRAPHITE}">Arrival window</div>
    <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:8px">${chips}</div>
  </div>`;
}
const dropzone = () => `<div style="border:1.5px dashed #B5B9BC;border-radius:6px;background:${PAPER};padding:18px;display:flex;align-items:center;gap:14px;color:${STEEL_DK}"><span style="color:${GRAPHITE}">${ICONS.camera}</span><div style="font-size:14px;line-height:1.45"><span style="color:${GRAPHITE};font-weight:600">Add a photo</span> of the socket, board or fault. Optional, but it saves a lot of guessing.</div></div>`;

function formCard(mobile = false) {
  const two = (a, b) => mobile ? `${a}${b}` : `<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:16px">${a}${b}</div>`;
  const day1 = dateBlock({ label: 'Which day would suit best?', value: 'Tue 15 Sep 2026', dayName: 'Tuesday', weekend: false, selected: 'Evening' });
  const day2 = dateBlock({ label: 'Another day that works?', optional: true, value: 'Sat 19 Sep 2026', dayName: 'Saturday', weekend: true, selected: 'Any time' });
  return `<div style="background:${CHALK};border-radius:12px;padding:${mobile ? '24px 20px' : '32px'};display:flex;flex-direction:column;gap:18px;--keyline:${GRAPHITE}">
    ${field('What needs doing?', textarea('e.g. Two new double sockets in the kitchen, and the bathroom light keeps tripping the board.'))}
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><div style="font-size:14px;font-weight:600;color:${GRAPHITE}">When suits you?</div><div style="font-size:13px;color:${STEEL_DK}">Peter works evenings on weekdays and any time at weekends.</div></div>
      ${two(day1, day2)}
    </div>
    ${field('Photo of the job (optional)', dropzone())}
    ${field('Address', input('House or unit, street, town, Eircode'), 'So Peter can check you are in Dublin, Wicklow or Kildare.')}
    ${two(field('Your name', input('Full name')), field('Phone', input('So Peter can confirm by call or text')))}
    ${field('Email', input('For your confirmation'))}
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:4px">${flatBtn('Send request', { size: 16, pad: '14px 26px' })}<div style="font-size:13px;color:${STEEL_DK};line-height:1.45;flex:1;min-width:200px">You get a confirmation straight away. Peter is in touch to confirm the day.</div></div>
  </div>`;
}

// ---------- Home page, desktop (1440) ----------
function desktop() {
  const hero = `<div style="display:grid;grid-template-columns:minmax(0, 1.15fr) minmax(0, 0.85fr);gap:48px;align-items:center;padding:72px 64px 64px">
    <div style="display:flex;flex-direction:column;gap:24px;max-width:640px">
      ${eyebrow('Dublin · Wicklow · Kildare', 'rgba(243,242,242,0.6)')}
      <h1 style="margin:0;font-size:60px;line-height:1.05;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">Electrical work done right, by your local, reliable sparks.</h1>
      <p style="margin:0;font-size:19px;line-height:1.5;color:rgba(243,242,242,0.72);max-width:560px;text-wrap:pretty">Sockets, lighting, rewires, fuse boards, EV chargers and fault-finding for homes and small businesses. Send a callout request and Peter confirms it himself, by call or text.</p>
      <div style="display:flex;align-items:center;gap:28px;margin-top:8px">${textLink('See everything Peter does', CHALK)}</div>
    </div>
    <a href="#request" class="cta" style="display:flex;align-items:center;gap:28px;justify-self:end;text-decoration:none;padding:12px 8px">
      ${physButton({ size: 230 })}
      <div style="display:flex;flex-direction:column;gap:6px;max-width:220px"><div style="font-size:24px;font-weight:700;color:${CHALK};line-height:1.15">Request a callout</div><div style="font-size:15px;line-height:1.45;color:rgba(243,242,242,0.62)">Takes about two minutes. No account, no calendar, no call centre.</div></div>
    </a>
  </div>
  <div style="margin:0 64px;border-top:1px solid rgba(243,242,242,0.12);display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:24px;padding:22px 0 40px">
    ${STATS.map(([i, t]) => `<div style="display:flex;align-items:center;gap:12px;color:${CHALK};font-size:15px;font-weight:500"><span style="color:${STEEL};flex:none">${sz(ICONS[i], 20)}</span>${t}</div>`).join('')}
  </div>`;

  const services = `<div id="services" style="background:${CHALK};--keyline:${GRAPHITE};padding:88px 64px;display:flex;flex-direction:column;gap:40px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px">
      <div style="display:flex;flex-direction:column;gap:12px">${eyebrow('Services', STEEL_DK)}<h2 style="margin:0;font-size:40px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Always On Electrical Services</h2></div>
      <p style="margin:0;max-width:420px;font-size:16px;line-height:1.5;color:${STEEL_DK}">Residential and small commercial. Not industrial. If your job is not on the list, ask anyway.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:16px">
      ${SERVICES.map(([i, t, d]) => `<div class="svc" style="background:${PAPER};border:1px solid rgba(32,30,29,0.10);border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:14px"><span style="color:${GRAPHITE}">${ICONS[i]}</span><div style="font-size:18px;font-weight:700;color:${GRAPHITE}">${t}</div><div style="font-size:15px;line-height:1.45;color:${STEEL_DK}">${d}</div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:16px;border-top:1px solid rgba(32,30,29,0.12);padding-top:32px">
      ${TRUST.map(([i, t, d]) => `<div style="display:flex;gap:14px;align-items:flex-start"><span style="color:${RED};flex:none">${ICONS[i]}</span><div style="display:flex;flex-direction:column;gap:4px"><div style="font-size:16px;font-weight:700;color:${GRAPHITE}">${t}</div><div style="font-size:14px;line-height:1.45;color:${STEEL_DK}">${d}</div></div></div>`).join('')}
    </div>
  </div>`;

  const about = `<div id="about" style="padding:88px 64px;display:grid;grid-template-columns:minmax(0, 0.9fr) minmax(0, 1.1fr);gap:64px;align-items:center">
    ${placeholder('[PHOTO: Peter on site]', `aspect-ratio:4/5;background:rgba(243,242,242,0.04);border-color:rgba(243,242,242,0.25);color:rgba(243,242,242,0.5)`)}
    <div style="display:flex;flex-direction:column;gap:22px">
      ${eyebrow('About Peter', 'rgba(243,242,242,0.6)')}
      <h2 style="margin:0;font-size:40px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">Fully qualified. Properly trained. Genuinely keen.</h2>
      <p style="margin:0;font-size:17px;line-height:1.55;color:rgba(243,242,242,0.75);text-wrap:pretty">${ABOUT_1}</p>
      <p style="margin:0;font-size:17px;line-height:1.55;color:rgba(243,242,242,0.75);text-wrap:pretty">${ABOUT_2}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">${CHIPS.map((t) => `<span style="font-size:13px;font-weight:600;color:${CHALK};border:1px solid rgba(243,242,242,0.25);border-radius:999px;padding:8px 14px">${t}</span>`).join('')}</div>
    </div>
  </div>`;

  const area = `<div id="area" style="background:${STEEL};--keyline:${GRAPHITE};padding:56px 64px;display:grid;grid-template-columns:minmax(0, 1fr) auto;gap:40px;align-items:center">
    <div style="display:flex;flex-direction:column;gap:10px"><h2 style="margin:0;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Covering Dublin, Wicklow and Kildare</h2><p style="margin:0;font-size:16px;line-height:1.5;color:rgba(32,30,29,0.7);max-width:620px">Not sure if you are covered? Give me a call and ask directly.</p></div>
    <div style="display:flex;gap:10px">${['Dublin', 'Wicklow', 'Kildare'].map((c) => `<span style="font-size:15px;font-weight:700;color:${CHALK};background:${GRAPHITE};border-radius:999px;padding:12px 20px">${c}</span>`).join('')}</div>
  </div>`;

  const request = `<div id="request" style="padding:88px 64px;display:grid;grid-template-columns:minmax(0, 0.8fr) minmax(0, 1.2fr);gap:64px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:28px;position:sticky;top:32px">
      <div style="display:flex;flex-direction:column;gap:12px">${eyebrow('Request a callout', 'rgba(243,242,242,0.6)')}<h2 style="margin:0;font-size:40px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK}">Tell us what needs doing</h2></div>
      <div style="display:flex;flex-direction:column;gap:18px">${STEPS.map(([t, d], i) => `<div style="display:flex;gap:16px;align-items:flex-start"><span style="flex:none;width:32px;height:32px;border-radius:50%;background:${RED};color:${CHALK};font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center">${i + 1}</span><div style="display:flex;flex-direction:column;gap:3px"><div style="font-size:17px;font-weight:700;color:${CHALK}">${t}</div><div style="font-size:15px;line-height:1.45;color:rgba(243,242,242,0.65)">${d}</div></div></div>`).join('')}</div>
      <div style="display:flex;align-items:center;gap:18px;padding-top:8px;border-top:1px solid rgba(243,242,242,0.12)"><div style="font-size:14px;color:rgba(243,242,242,0.6)">Rather talk?</div>${phoneLink()}${whatsappLink()}</div>
    </div>
    ${formCard(false)}
  </div>`;

  return shell({ body: navDesktop('') + hero + services + about + area + request + footerDesktop(), width: 1440, height: 4300 });
}

// ---------- Home page, mobile (390) ----------
function mobile() {
  const hero = `<div style="padding:40px 20px 32px;display:flex;flex-direction:column;gap:20px">
    ${eyebrow('Dublin · Wicklow · Kildare', 'rgba(243,242,242,0.6)')}
    <h1 style="margin:0;font-size:36px;line-height:1.08;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">Electrical work done right, by your local, reliable sparks.</h1>
    <p style="margin:0;font-size:17px;line-height:1.5;color:rgba(243,242,242,0.72);text-wrap:pretty">Sockets, lighting, rewires, fuse boards, EV chargers and fault-finding for homes and small businesses. Peter confirms every request himself, by call or text.</p>
    <a href="#request" class="cta" style="display:flex;align-items:center;gap:20px;text-decoration:none;padding:12px 0 4px">${physButton({ size: 150 })}<div style="display:flex;flex-direction:column;gap:6px"><div style="font-size:21px;font-weight:700;color:${CHALK};line-height:1.15">Request a callout</div><div style="font-size:14px;line-height:1.45;color:rgba(243,242,242,0.62)">About two minutes. No account, no call centre.</div></div></a>
    ${textLink('See everything Peter does', CHALK)}
    <div style="border-top:1px solid rgba(243,242,242,0.12);display:flex;flex-direction:column;gap:12px;padding-top:20px;margin-top:8px">
      ${STATS.map(([i, t]) => `<div style="display:flex;align-items:center;gap:12px;color:${CHALK};font-size:14px;font-weight:500"><span style="color:${STEEL};flex:none">${sz(ICONS[i], 20)}</span>${t}</div>`).join('')}
    </div>
  </div>`;
  const services = `<div id="services" style="background:${CHALK};--keyline:${GRAPHITE};padding:56px 20px;display:flex;flex-direction:column;gap:24px">
    <div style="display:flex;flex-direction:column;gap:10px">${eyebrow('Services', STEEL_DK)}<h2 style="margin:0;font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Always On Electrical Services</h2><p style="margin:0;font-size:15px;line-height:1.5;color:${STEEL_DK}">Residential and small commercial. Not industrial. If your job is not on the list, ask anyway.</p></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${SERVICES.map(([i, t, d]) => `<div class="svc" style="background:${PAPER};border:1px solid rgba(32,30,29,0.10);border-radius:10px;padding:16px;display:flex;gap:14px;align-items:flex-start"><span style="color:${GRAPHITE};flex:none;padding-top:2px">${ICONS[i]}</span><div style="display:flex;flex-direction:column;gap:3px"><div style="font-size:16px;font-weight:700;color:${GRAPHITE}">${t}</div><div style="font-size:14px;line-height:1.45;color:${STEEL_DK}">${d}</div></div></div>`).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:18px;border-top:1px solid rgba(32,30,29,0.12);padding-top:24px">
      ${TRUST.map(([i, t, d]) => `<div style="display:flex;gap:14px;align-items:flex-start"><span style="color:${RED};flex:none">${ICONS[i]}</span><div style="display:flex;flex-direction:column;gap:3px"><div style="font-size:15px;font-weight:700;color:${GRAPHITE}">${t}</div><div style="font-size:14px;line-height:1.45;color:${STEEL_DK}">${d}</div></div></div>`).join('')}
    </div>
  </div>`;
  const about = `<div id="about" style="padding:56px 20px;display:flex;flex-direction:column;gap:20px">
    ${eyebrow('About Peter', 'rgba(243,242,242,0.6)')}
    <h2 style="margin:0;font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">Fully qualified. Properly trained. Genuinely keen.</h2>
    ${placeholder('[PHOTO: Peter on site]', `aspect-ratio:4/3;background:rgba(243,242,242,0.04);border-color:rgba(243,242,242,0.25);color:rgba(243,242,242,0.5)`)}
    <p style="margin:0;font-size:16px;line-height:1.55;color:rgba(243,242,242,0.75);text-wrap:pretty">${ABOUT_1}</p>
    <p style="margin:0;font-size:16px;line-height:1.55;color:rgba(243,242,242,0.75);text-wrap:pretty">${ABOUT_2}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${CHIPS.map((t) => `<span style="font-size:13px;font-weight:600;color:${CHALK};border:1px solid rgba(243,242,242,0.25);border-radius:999px;padding:8px 14px">${t}</span>`).join('')}</div>
  </div>`;
  const area = `<div id="area" style="background:${STEEL};--keyline:${GRAPHITE};padding:40px 20px;display:flex;flex-direction:column;gap:16px">
    <h2 style="margin:0;font-size:26px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Covering Dublin, Wicklow and Kildare</h2>
    <p style="margin:0;font-size:15px;line-height:1.5;color:rgba(32,30,29,0.7)">Not sure if you are covered? Give me a call and ask directly.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${['Dublin', 'Wicklow', 'Kildare'].map((c) => `<span style="font-size:14px;font-weight:700;color:${CHALK};background:${GRAPHITE};border-radius:999px;padding:10px 16px">${c}</span>`).join('')}</div>
  </div>`;
  const request = `<div id="request" style="padding:56px 20px;display:flex;flex-direction:column;gap:28px">
    <div style="display:flex;flex-direction:column;gap:10px">${eyebrow('Request a callout', 'rgba(243,242,242,0.6)')}<h2 style="margin:0;font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK}">Tell us what needs doing</h2></div>
    <div style="display:flex;flex-direction:column;gap:14px">${STEPS.map(([t, d], i) => `<div style="display:flex;gap:14px;align-items:flex-start"><span style="flex:none;width:30px;height:30px;border-radius:50%;background:${RED};color:${CHALK};font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center">${i + 1}</span><div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:16px;font-weight:700;color:${CHALK}">${t}</div><div style="font-size:14px;line-height:1.45;color:rgba(243,242,242,0.65)">${d}</div></div></div>`).join('')}</div>
    ${formCard(true)}
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><div style="font-size:14px;color:rgba(243,242,242,0.6)">Rather talk?</div>${phoneLink('min-height:44px')}${whatsappLink('min-height:44px')}</div>
  </div>`;
  return shell({ body: navMobile() + hero + services + about + area + request + footerMobile(), width: 390, height: 6200 });
}

// ---------- Reviews page ----------
const refCard = (quote, who, mobile = false) => `<div style="background:${PAPER};border:1px solid rgba(32,30,29,0.10);border-radius:10px;padding:${mobile ? '20px' : '28px'};display:flex;flex-direction:column;gap:16px"><span style="color:${RED}">${ICONS.quote}</span><p style="margin:0;font-size:${mobile ? 15 : 17}px;line-height:1.55;color:${GRAPHITE};text-wrap:pretty">${quote}</p><div style="font-size:14px;font-weight:600;color:${STEEL_DK}">${who}</div></div>`;
const reviewCard = (quote, who, meta, mobile = false) => `<div style="border:1px solid rgba(243,242,242,0.12);border-radius:10px;padding:${mobile ? '20px' : '28px'};display:flex;flex-direction:column;gap:14px">${stars}<p style="margin:0;font-size:${mobile ? 15 : 16}px;line-height:1.55;color:rgba(243,242,242,0.85);text-wrap:pretty">${quote}</p><div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:14px;font-weight:700;color:${CHALK}">${who}</div><div style="font-size:13px;color:rgba(243,242,242,0.55)">${meta}</div></div></div>`;

function reviewsDesktop() {
  const head = `<div style="padding:72px 64px 56px;display:flex;flex-direction:column;gap:20px;max-width:760px">
    ${eyebrow('Reviews and references', 'rgba(243,242,242,0.6)')}
    <h1 style="margin:0;font-size:52px;line-height:1.05;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">What people say about Peter's work</h1>
    <p style="margin:0;font-size:18px;line-height:1.5;color:rgba(243,242,242,0.72);text-wrap:pretty">Always On Electrical is new, so this page will fill up as jobs get done. For now it holds references from the people Peter trained and worked alongside, and the first customer reviews as they come in.</p>
  </div>`;
  const refs = `<div style="background:${CHALK};--keyline:${GRAPHITE};padding:72px 64px;display:flex;flex-direction:column;gap:32px">
    <div style="display:flex;flex-direction:column;gap:12px">${eyebrow('References', STEEL_DK)}<h2 style="margin:0;font-size:34px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">From the people who trained him</h2></div>
    <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:20px">${REFERENCES.map(([q, w]) => refCard(q, w)).join('')}</div>
  </div>`;
  const revs = `<div style="padding:72px 64px;display:flex;flex-direction:column;gap:32px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px"><div style="display:flex;flex-direction:column;gap:12px">${eyebrow('Customer reviews', 'rgba(243,242,242,0.6)')}<h2 style="margin:0;font-size:34px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK}">From customers</h2></div><p style="margin:0;max-width:380px;font-size:15px;line-height:1.5;color:rgba(243,242,242,0.6)">Reviews are published with the customer's permission, in their own words.</p></div>
    <div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:20px">${REVIEWS.map(([q, w, m]) => reviewCard(q, w, m)).join('')}</div>
    <div style="border:1px solid rgba(243,242,242,0.12);border-radius:12px;padding:32px;display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap">
      <div style="display:flex;flex-direction:column;gap:6px;max-width:520px"><div style="font-size:22px;font-weight:700;color:${CHALK}">Had a job done by Peter?</div><div style="font-size:15px;line-height:1.5;color:rgba(243,242,242,0.65)">A short review helps a new business more than you would think. A line or two is plenty.</div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">${ghostBtn('Leave a Google review', 'starline', { href: '[GOOGLE REVIEW LINK]' })}${ghostBtn('Email a review', 'mail', { href: `mailto:${EMAIL}` })}</div>
    </div>
  </div>`;
  const strip = `<div style="background:${STEEL};--keyline:${GRAPHITE};padding:48px 64px;display:flex;justify-content:space-between;align-items:center;gap:40px">
    <div style="display:flex;flex-direction:column;gap:6px"><div style="font-size:26px;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Need an electrician?</div><div style="font-size:15px;color:rgba(32,30,29,0.7)">Evenings on weekdays, any time at weekends. Dublin, Wicklow and Kildare.</div></div>
    ${flatBtn('Request a callout', { size: 16, pad: '14px 26px', href: 'index.html#request' })}
  </div>`;
  return shell({ body: navDesktop('Reviews') + head + refs + revs + strip + footerDesktop(), width: 1440, height: 2100 });
}
function reviewsMobile() {
  const head = `<div style="padding:40px 20px 36px;display:flex;flex-direction:column;gap:16px">
    ${eyebrow('Reviews and references', 'rgba(243,242,242,0.6)')}
    <h1 style="margin:0;font-size:34px;line-height:1.08;font-weight:800;letter-spacing:-0.02em;color:${CHALK};text-wrap:balance">What people say about Peter's work</h1>
    <p style="margin:0;font-size:16px;line-height:1.5;color:rgba(243,242,242,0.72);text-wrap:pretty">Always On Electrical is new, so this page will fill up as jobs get done. For now it holds references from the people Peter trained and worked alongside, and the first customer reviews as they come in.</p>
  </div>`;
  const refs = `<div style="background:${CHALK};--keyline:${GRAPHITE};padding:48px 20px;display:flex;flex-direction:column;gap:20px">
    <div style="display:flex;flex-direction:column;gap:10px">${eyebrow('References', STEEL_DK)}<h2 style="margin:0;font-size:28px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">From the people who trained him</h2></div>
    ${REFERENCES.map(([q, w]) => refCard(q, w, true)).join('')}
  </div>`;
  const revs = `<div style="padding:48px 20px;display:flex;flex-direction:column;gap:20px">
    <div style="display:flex;flex-direction:column;gap:10px">${eyebrow('Customer reviews', 'rgba(243,242,242,0.6)')}<h2 style="margin:0;font-size:28px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${CHALK}">From customers</h2><p style="margin:0;font-size:14px;line-height:1.5;color:rgba(243,242,242,0.6)">Reviews are published with the customer's permission, in their own words.</p></div>
    ${REVIEWS.map(([q, w, m]) => reviewCard(q, w, m, true)).join('')}
    <div style="border:1px solid rgba(243,242,242,0.12);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;flex-direction:column;gap:6px"><div style="font-size:20px;font-weight:700;color:${CHALK}">Had a job done by Peter?</div><div style="font-size:14px;line-height:1.5;color:rgba(243,242,242,0.65)">A short review helps a new business more than you would think. A line or two is plenty.</div></div>
      <div style="display:flex;flex-direction:column;gap:10px">${ghostBtn('Leave a Google review', 'starline', { href: '[GOOGLE REVIEW LINK]' })}${ghostBtn('Email a review', 'mail', { href: `mailto:${EMAIL}` })}</div>
    </div>
  </div>`;
  const strip = `<div style="background:${STEEL};--keyline:${GRAPHITE};padding:36px 20px;display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:${GRAPHITE}">Need an electrician?</div><div style="font-size:14px;color:rgba(32,30,29,0.7)">Evenings on weekdays, any time at weekends. Dublin, Wicklow and Kildare.</div>
    ${flatBtn('Request a callout', { size: 16, pad: '14px 26px', href: 'index.html#request' })}
  </div>`;
  return shell({ body: navMobile() + head + refs + revs + strip + footerMobile(), width: 390, height: 2960 });
}

// ---------- Brand sheet (1100) ----------
function brand() {
  const label = (t) => `<div style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(243,242,242,0.5)">${t}</div>`;
  const panel = (inner, extra = '') => `<div style="border:1px solid rgba(243,242,242,0.10);border-radius:6px;${extra}">${inner}</div>`;
  const light = (inner, extra = '') => `<div style="background:${CHALK};--keyline:${GRAPHITE};border-radius:6px;${extra}">${inner}</div>`;
  const sw = (bg, name, hex, role) => `<div style="flex:1;display:flex;flex-direction:column;gap:10px"><div style="height:80px;border-radius:6px;background:${bg};border:1px solid rgba(243,242,242,0.10)"></div><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:15px;font-weight:600">${name}</span><span style="font-size:13px;color:rgba(243,242,242,0.55)">${hex}</span></div><div style="font-size:13px;line-height:1.4;color:rgba(243,242,242,0.55)">${role}</div></div>`;
  const body = `
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px">
    <div style="display:flex;flex-direction:column;gap:6px">${label('Brand sheet · from the 3D references')}<div style="font-size:30px;font-weight:800;line-height:1.1;letter-spacing:-0.02em">Mark, lockup and button</div></div>
    <p style="margin:0;max-width:500px;font-size:14px;line-height:1.5;color:rgba(243,242,242,0.65);text-wrap:pretty">Traced from always-on-Logo.obj and always-on-Button.obj. Ring stroke 34% of its radius, gap 27° each side of top, bolt as modelled. Colours converted from the material file.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:20px">
    ${panel(`<div style="height:220px;display:flex;align-items:center;justify-content:center;gap:48px">${mark({ style: 'height:150px;display:block' })}${wordmark({ size: 40, ink: CHALK })}</div>`)}
    ${light(`<div style="height:220px;display:flex;align-items:center;justify-content:center;gap:48px">${mark({ style: 'height:150px;display:block' })}${wordmark({ size: 40, ink: GRAPHITE })}</div>`)}
  </div>
  <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:20px">
    <div style="display:flex;flex-direction:column;gap:14px">${label('Mark alone · 96 / 48 / 24 / 16')}${panel(`<div style="display:flex;align-items:flex-end;gap:28px;padding:22px 28px">${[96, 48, 24, 16].map((s) => `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center">${mark({ style: `height:${Math.round(s * 0.86)}px;display:block` })}</div>`).join('')}</div>`)}${light(`<div style="display:flex;align-items:flex-end;gap:28px;padding:22px 28px">${[96, 48, 24, 16].map((s) => `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center">${mark({ style: `height:${Math.round(s * 0.86)}px;display:block` })}</div>`).join('')}</div>`)}</div>
    <div style="display:flex;flex-direction:column;gap:14px">${label('The button · rest, hover, pressed')}${panel(`<div style="display:flex;align-items:center;justify-content:space-around;padding:22px 28px;height:206px;box-sizing:border-box">${physButton({ size: 130 })}${physButton({ size: 130, cls: 'abtn is-hover' })}${physButton({ size: 130, cls: 'abtn is-pressed' })}</div>`)}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">${label('Palette')}<div style="display:flex;gap:20px">${sw(GRAPHITE, 'Graphite', GRAPHITE, 'Base. Page background, text on light.')}${sw(RED, 'Signal red', RED, 'The bolt, the button cap, the primary action. Nothing else.')}${sw(STEEL, 'Brushed steel', STEEL, 'The ring, bezel, icons on dark, the service-area band.')}${sw(CHALK, 'Chalk', CHALK, 'Text on dark, light sections, the glyph on the button.')}</div></div>`;
  return shell({ body, width: 1100, height: 960, pad: 56, gap: 28 });
}

// ---------- Shell ----------
function shell({ body, width, height, pad = 0, gap = 0 }) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${FONT_LINK}">
  <style>
    body { margin: 0; background: ${GRAPHITE}; font-family: ${FONT}; -webkit-font-smoothing: antialiased; }
    a { color: ${CHALK}; text-decoration: none; } a:hover { color: ${CHALK}; }
    .navlink { transition: color .2s ease, border-color .2s ease; } .navlink:hover { color: ${RED} !important; }
    .btn { transition: background .2s ease, transform .15s ease; } .btn:hover { background: #FF4A2B !important; } .btn:active { transform: translateY(1px); }
    .tlink svg { transition: transform .2s ease; } .tlink:hover svg { transform: translateX(4px); }
    .svc { transition: border-color .2s ease, transform .2s ease; } .svc:hover { border-color: ${GRAPHITE} !important; transform: translateY(-2px); }
    .chip { transition: border-color .15s ease; } .chip:not(.chip-off):hover { border-color: ${GRAPHITE} !important; }
    .abtn .capface { transition: transform .12s ease; }
    .cta:hover .abtn .capface, .abtn.is-hover .capface { transform: translateY(0.035px); }
    .cta:active .abtn .capface, .abtn.is-pressed .capface { transform: translateY(0.09px); }
    .wm .mk-bolt { transition: fill .25s ease; }
  </style>
</helmet>
<div style="--keyline: transparent; width: ${width}px; min-height: ${height}px; box-sizing: border-box; background: ${GRAPHITE}; color: ${CHALK}; font-family: ${FONT}; padding: ${pad}px; display: flex; flex-direction: column; gap: ${gap}px">
${body}
</div>
</x-dc>
</body>
</html>
`;
}

// ---------- Emit ----------
const out = { 'Main.dc.html': desktop(), 'HomeMobile.dc.html': mobile(), 'Reviews.dc.html': reviewsDesktop(), 'ReviewsMobile.dc.html': reviewsMobile(), 'Brand.dc.html': brand() };
for (const [name, src] of Object.entries(out)) {
  writeFileSync(name, src);
  const helmet = (src.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  const prev = src.replace('<script src="./support.js"></script>', '').replace(/<helmet>[\s\S]*?<\/helmet>/, '').replace('</head>', `${helmet}</head>`).replace(/<\/?x-dc>/g, '');
  writeFileSync(`preview/${name.replace('.dc.html', '.html')}`, prev);
}
const canvas = {
  pages: [{ id: 'page-1', name: 'Home page' }, { id: 'page-2', name: 'Reviews page' }, { id: 'page-3', name: 'Logo directions' }],
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1440, h: 4300, title: 'Home · desktop', page: 'page-1' },
    { file: 'HomeMobile.dc.html', x: 1540, y: 0, w: 390, h: 6200, title: 'Home · mobile', page: 'page-1' },
    { file: 'Brand.dc.html', x: 2030, y: 0, w: 1100, h: 960, title: 'Mark, lockup and button', page: 'page-1' },
    { file: 'Reviews.dc.html', x: 0, y: 0, w: 1440, h: 2100, title: 'Reviews · desktop', page: 'page-2' },
    { file: 'ReviewsMobile.dc.html', x: 1540, y: 0, w: 390, h: 2960, title: 'Reviews · mobile', page: 'page-2' },
    { file: 'Overview.dc.html', x: 0, y: 0, w: 1100, h: 640, title: 'Overview (superseded)', page: 'page-3' },
    { file: 'Standby.dc.html', x: 0, y: 800, w: 1100, h: 1500, title: 'A · Standby', page: 'page-3' },
    { file: 'Slide.dc.html', x: 1200, y: 800, w: 1100, h: 1500, title: 'B · Slide', page: 'page-3' },
    { file: 'Rocker.dc.html', x: 2400, y: 800, w: 1100, h: 1500, title: 'C · Rocker', page: 'page-3' },
  ],
  launch: { view: 'canvas', page: 'page-1' },
};
writeFileSync('canvas.json', JSON.stringify(canvas, null, 2));
console.log('built', Object.keys(out).join(', '), '+ canvas.json (3 pages)');
