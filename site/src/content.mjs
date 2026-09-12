// Single source of copy and business facts for the site.
// Bracketed values like "[NUMBER]" are still to be supplied by Peter; they render visibly so nothing ships half-filled by accident.

export const SITE = {
  name: 'Always On Electrical',
  owner: 'Peter Agnew',
  domain: 'alwaysonelectrical.ie',
  url: 'https://alwaysonelectrical.ie',
  phone: '+353 (83) 481 2044',
  phoneTel: '+353834812044',
  whatsapp: '353834812044',
  email: 'pete@alwaysonelectrical.ie',
  town: 'Dún Laoghaire',
  address: { street: '7 Grangewood Court, Rochestown Avenue', locality: 'Dún Laoghaire', region: 'Co. Dublin', country: 'IE' },
  employer: 'C.J. Ryder Lawlor Ltd.',
  counties: ['Dublin', 'Wicklow', 'Kildare'],
  rec: '[NUMBER]',
  insurer: '[INSURER]',
  googleReviewUrl: '[GOOGLE REVIEW LINK]',
  showReviewsInNav: true,
  year: 2026,
};

// Demo build (node build.mjs --demo): a preview to share before launch. Unknown facts are left out
// rather than shown in brackets, the reviews page is kept out of the menu, and the form does not send.
export const DEMO = process.env.AOE_DEMO === '1';
if (DEMO) SITE.showReviewsInNav = false;

export const isPlaceholder = (v) => /^\[.*\]$/.test(String(v).trim());
// A fact for the page: the real value when known, otherwise the bracketed placeholder (or, in a demo, a wording without it).
export const fact = (value, withValue, without) => (DEMO && isPlaceholder(value) ? without : withValue(value));
export const countiesProse = () => `${SITE.counties.slice(0, -1).join(', ')} and ${SITE.counties.at(-1)}`;
export const countiesDots = () => SITE.counties.join(' · ');

export const NAV = [
  ['services.html', 'Services'],
  ['service-area.html', 'Service area'],
  ['reviews.html', 'Reviews', 'reviews'],
  ['index.html#about', 'About Peter'],
  ['contact.html', 'Contact'],
];

// Availability: Peter keeps his day job for now, so weekdays are evenings only and weekends are open.
export const WINDOWS = [
  ['any', 'Any time'],
  ['morning', 'Morning'],
  ['afternoon', 'Afternoon'],
  ['evening', 'Evening'],
];
export const HOURS = { weekday: ['evening'], weekend: WINDOWS.map(([v]) => v) };
export const HOURS_PROSE = 'Evenings on weekdays, any time at weekends';

export const HERO = {
  eyebrow: countiesDots(),
  h1: 'Electrical work done right, by your local, reliable sparks.',
  lede: 'Sockets, lighting, rewires, fuse boards, EV chargers and fault-finding for homes and small businesses. Send a callout request and Peter confirms it himself, by call or text.',
  ctaTitle: 'Request a callout',
  ctaSub: 'Takes about two minutes. No account, no calendar, no call centre.',
  link: 'See everything Peter does',
};

export const STATS = [
  ['shield', fact(SITE.rec, (v) => `Safe Electric registered · REC ${v}`, 'Safe Electric registered')],
  ['umbrella', 'Fully insured'],
  ['clock', HOURS_PROSE],
  ['pin', countiesProse()],
];

export const SERVICES = [
  { slug: 'sockets-lighting', icon: 'socket', title: 'Sockets & lighting', short: 'New points, moves, replacements and LED upgrades.',
    long: 'Extra sockets where you actually need them, USB sockets, outdoor and garage points, new light fittings, dimmers and switches, and swapping old fittings for LED. Small jobs are welcome and tidy finishing is the point.' },
  { slug: 'fuse-boards', icon: 'board', title: 'Fuse board upgrades', short: 'Modern consumer units with RCD protection.',
    long: 'Replacing old fuse boards with a modern consumer unit, adding RCD protection for every circuit, labelling everything properly and testing the whole installation before it goes back on. If your board still has rewirable fuses, this is the job to do first.' },
  { slug: 'ev-chargers', icon: 'ev', title: 'EV charger installs', short: 'Home charge points, wired and signed off.',
    long: 'A dedicated circuit and a wall charger installed to the manufacturer’s spec, with the paperwork needed for the SEAI home charger grant. Peter will check your supply can take it before anything is ordered.' },
  { slug: 'rewires', icon: 'lighting', title: 'Rewires', short: 'Full and partial rewires, planned around you.',
    long: 'Full rewires of older houses and partial rewires of extensions, kitchens or single circuits. The work is planned room by room so you can keep living in the house, and everything is chased, made good and certified at the end.' },
  { slug: 'fault-finding', icon: 'fault', title: 'Fault-finding', short: 'Tripping breakers, dead circuits, flickering lights.',
    long: 'A breaker that keeps tripping, a circuit that has gone dead, lights that flicker or a socket that runs warm. Peter traces the fault, tells you straight what caused it and what it will take to fix, and fixes it there and then where he can.' },
  { slug: 'smart-home', icon: 'smart', title: 'Smart home', short: 'Smart switches, heating controls, lighting scenes.',
    long: 'Smart switches and dimmers, heating and immersion controls you can run from your phone, and lighting scenes for rooms you use most. Fitted to work reliably first and look neat second, which is the right order.' },
  { slug: 'safety-certs', icon: 'cert', title: 'Safety certs (EICR)', short: 'Periodic inspection reports for landlords and businesses.',
    long: 'Periodic inspection and testing of an installation, with a written report of its condition and anything that needs attention. Landlords need this for lettings and insurers increasingly ask for it; small businesses use it to keep their premises in order.' },
  { slug: 'pat-testing', icon: 'pat', title: 'PAT testing', short: 'Portable appliance testing with records you can file.',
    long: 'Testing and labelling of portable appliances for offices, shops, salons and rental properties, with a register you can hand to an insurer or auditor. Done outside your opening hours where that suits you better.' },
  { slug: 'commercial', icon: 'shop', title: 'Small commercial fit-outs', short: 'Shops, offices and units, wired and certified.',
    long: 'Power, lighting and data for small units: shops, offices, salons, workshops and cafés. Not industrial, and not large sites, but the kind of fit-out where one electrician who answers the phone is exactly what you want.' },
];

export const TRUST = [
  ['shield', 'Safe Electric registered', fact(SITE.rec, (v) => `On the national register of electrical contractors. REC no. ${v}`, 'On the national register of electrical contractors.')],
  ['umbrella', 'Fully insured', fact(SITE.insurer, (v) => `Public liability cover on every job. Insured by ${v}.`, 'Public liability cover on every job.')],
  ['pin', 'Local to you', `Based in ${SITE.town}, working across ${countiesProse()}.`],
];
export const REGISTERED = [
  fact(SITE.rec, (v) => `Safe Electric REC ${v}`, 'Safe Electric registered'),
  fact(SITE.insurer, (v) => `Insured with ${v}`, 'Fully insured'),
];

export const ABOUT = {
  eyebrow: 'About Peter',
  h2: 'Fully qualified. Properly trained. Genuinely keen.',
  p1: `Hello, I'm Peter. Your new local electrician. I finished my apprenticeship with ${SITE.employer} and set up Always On Electrical for jobs on weekends and evening callouts. I am careful, tidy, and adhere to the latest wiring standards and rules. Every job is done by me, and I will tell you straight what needs doing and what does not.`,
  p2: `Being new to running my own business means every callout matters. You'll get a reply from me personally, and I'll never leave a job in a way that I'm not happy to put my name to.`,
  chips: ['Fully qualified', `Apprenticeship with ${SITE.employer}`, `Based in ${SITE.town}`],
  photoAlt: 'Peter Agnew on site',
  photo: null, // set to 'assets/img/peter.jpg' once a photo exists; the layout adapts when it is null
};

export const AREA = {
  h2: `Covering ${countiesProse()}`,
  lede: 'Not sure if you are covered? Give me a call and ask directly.',
};

// Towns are listed for local search. Peter should trim anything he does not want to travel to.
export const AREAS = [
  { county: 'Dublin', intro: `Peter is based in ${SITE.town}, so south Dublin is home ground, and the rest of the county is a normal callout.`,
    towns: ['Dún Laoghaire', 'Blackrock', 'Dalkey', 'Killiney', 'Stillorgan', 'Dundrum', 'Sandyford', 'Rathfarnham', 'Tallaght', 'Clondalkin', 'Lucan', 'Blanchardstown', 'Swords', 'Malahide', 'Howth', 'Clontarf', 'Dublin city centre'] },
  { county: 'Wicklow', intro: 'North and east Wicklow are a short run down the N11, and the rest of the county by arrangement.',
    towns: ['Bray', 'Greystones', 'Delgany', 'Kilcoole', 'Newtownmountkennedy', 'Enniskerry', 'Roundwood', 'Ashford', 'Wicklow town', 'Rathnew', 'Blessington', 'Arklow'] },
  { county: 'Kildare', intro: 'The commuter towns along the N7 and the M4 are covered, with the rest of Kildare by arrangement.',
    towns: ['Naas', 'Newbridge', 'Sallins', 'Clane', 'Maynooth', 'Celbridge', 'Leixlip', 'Kilcullen', 'Kildare town', 'Athy'] },
];

export const REQUEST = {
  eyebrow: 'Request a callout',
  h2: 'Tell us what needs doing',
  hint: 'Peter works evenings on weekdays and any time at weekends.',
  steps: [
    ['Tell us the job', 'A few lines is plenty. A photo of the socket, board or fault helps a lot.'],
    ['Pick days that suit', 'Two dates and a time window for each. Weekdays are evenings only; weekends are any time.'],
    ['Confirmation', 'By call or text, and the job is booked.'],
  ],
  after: 'You get a confirmation straight away. Peter is in touch to confirm the day.',
  consent: 'By sending this request you agree to Always On Electrical using your details to reply to you and arrange the work. See the privacy policy for what is kept and for how long.',
};

export const REFERENCES = [
  [`[Reference from ${SITE.employer}: a few lines on Peter's work and attitude during his apprenticeship.]`, `[NAME], [ROLE] · ${SITE.employer}`],
  ['[Reference from a tutor or assessor: a few lines on Peter’s training and qualification.]', '[NAME], [ROLE] · [TRAINING CENTRE / ETB]'],
];
export const REVIEWS = [
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
  ['[Review text: what the job was, how it went, and whether they would recommend Peter.]', '[CUSTOMER NAME], [AREA]', '[JOB TYPE] · [MONTH YEAR]'],
];

export const FOOTER = {
  blurb: `${SITE.owner}. Residential and small-commercial electrical contractor, ${countiesProse()}.`,
  pages: [...NAV.filter(([, , flag]) => flag !== 'reviews' || SITE.showReviewsInNav).map(([h, t]) => [h, t]), ['privacy.html', 'Privacy policy']],
};
