// The pages. Each returns a full HTML document via page().
import { SITE, HERO, STATS, SERVICES, TRUST, ABOUT, AREA, AREAS, REQUEST, WINDOWS, REFERENCES, REVIEWS, countiesProse, countiesDots } from './content.mjs';
import { mark, physButton, ICONS, stars } from './brand.mjs';
import { page, flatBtn, ghostBtn, phoneLink, whatsappLink, eyebrow } from './layout.mjs';

// ---------- shared blocks ----------
const statsBar = () => `<ul class="stats">${STATS.map(([i, t]) => `<li>${ICONS[i]}<span>${t}</span></li>`).join('')}</ul>`;

const trustRow = () => `<ul class="trust">${TRUST.map(([i, t, d]) => `<li>${ICONS[i]}<div><strong>${t}</strong><span>${d}</span></div></li>`).join('')}</ul>`;

const serviceCards = (link = true) => `<ul class="cards cards--3">${SERVICES.map((s) => `<li class="card">${link ? `<a class="card__link" href="services.html#${s.slug}">` : ''}${ICONS[s.icon]}<h3>${s.title}</h3><p>${s.short}</p>${link ? '</a>' : ''}</li>`).join('')}</ul>`;

const dateBlock = (n) => {
  const optional = n === 2;
  return `<div class="date-block" data-day="${n}">
      <label for="date${n}">${optional ? 'Another day that works? <span class="muted">(optional)</span>' : 'Which day would suit best?'}</label>
      <input type="date" id="date${n}" name="date${n}"${optional ? '' : ' required'} autocomplete="off">
      <p class="day-note" data-note aria-live="polite">Pick a date to see the windows for that day.</p>
      <fieldset class="chips"><legend>Arrival window</legend>
        ${WINDOWS.map(([v, l]) => `<label class="chip"><input type="radio" name="window${n}" value="${v}"${v === 'any' && !optional ? ' checked' : ''}><span class="chip__box" aria-hidden="true">${ICONS.check}</span><span>${l}</span></label>`).join('')}
      </fieldset>
    </div>`;
};

export const requestForm = () => `<form class="form" id="request-form" action="api/request.php" method="post" enctype="multipart/form-data" novalidate data-request-form>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <input type="hidden" name="ts" value="0" data-ts>
    <div class="field"><label for="job">What needs doing?</label><textarea id="job" name="job" rows="4" required placeholder="e.g. Two new double sockets in the kitchen, and the bathroom light keeps tripping the board."></textarea></div>
    <div class="when">
      <div class="when__head"><span class="field__label">When suits you?</span><span class="muted">${REQUEST.hint}</span></div>
      <div class="when__grid">${dateBlock(1)}${dateBlock(2)}</div>
    </div>
    <div class="field"><span class="field__label">Photo of the job <span class="muted">(optional)</span></span><label class="dropzone" for="photos">${ICONS.camera}<span><strong>Add a photo</strong> of the socket, board or fault. Optional, but it saves a lot of guessing.</span><input type="file" id="photos" name="photos[]" accept="image/*" multiple data-photos></label><p class="muted" data-photo-names></p></div>
    <div class="field"><label for="address">Address</label><input type="text" id="address" name="address" required autocomplete="street-address" placeholder="House or unit, street, town, Eircode"><p class="muted">So Peter can check you are in ${countiesProse()}.</p></div>
    <div class="field-row">
      <div class="field"><label for="name">Your name</label><input type="text" id="name" name="name" required autocomplete="name" placeholder="Full name"></div>
      <div class="field"><label for="phone">Phone</label><input type="tel" id="phone" name="phone" required autocomplete="tel" placeholder="So Peter can confirm by call or text"></div>
    </div>
    <div class="field"><label for="email">Email</label><input type="email" id="email" name="email" required autocomplete="email" placeholder="For your confirmation"></div>
    <div class="form__foot"><button class="btn btn--lg" type="submit">Send request</button><p class="muted">${REQUEST.after}</p></div>
    <p class="form__consent">${REQUEST.consent.replace('privacy policy', '<a href="privacy.html">privacy policy</a>')}</p>
    <div class="form__status" data-status hidden role="status"></div>
  </form>`;

const requestSection = () => `<section class="section request" id="request">
  <div class="container request__grid">
    <div class="request__aside">
      ${eyebrow(REQUEST.eyebrow)}
      <h2>${REQUEST.h2}</h2>
      <ol class="steps">${REQUEST.steps.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join('')}</ol>
      <div class="rather"><span>Rather talk?</span>${phoneLink()}${whatsappLink()}</div>
    </div>
    ${requestForm()}
  </div>
</section>`;

const ctaStrip = () => `<section class="section section--steel strip">
  <div class="container strip__inner">
    <div><h2>Need an electrician?</h2><p>${STATS[2][1]}. ${countiesProse()}.</p></div>
    ${flatBtn('Request a callout', 'index.html#request', { cls: 'btn--lg' })}
  </div>
</section>`;

// ---------- Home ----------
export function index() {
  const a = SITE.address;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneTel,
    email: SITE.email,
    image: `${SITE.url}/assets/img/og-image.png`,
    address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.locality, addressRegion: a.region, addressCountry: a.country },
    areaServed: SITE.counties.map((c) => ({ '@type': 'AdministrativeArea', name: `County ${c}` })),
    founder: { '@type': 'Person', name: SITE.owner },
  };
  const about = `<section class="section about" id="about">
  <div class="container about__grid${ABOUT.photo ? '' : ' about__grid--nophoto'}">
    ${ABOUT.photo ? `<img class="about__photo" src="${ABOUT.photo}" alt="${ABOUT.photoAlt}" width="720" height="900" loading="lazy">` : ''}
    <div class="about__text">
      ${eyebrow(ABOUT.eyebrow)}
      <h2>${ABOUT.h2}</h2>
      <p>${ABOUT.p1}</p>
      <p>${ABOUT.p2}</p>
      <ul class="pills">${ABOUT.chips.map((c) => `<li>${c}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;
  const body = `<section class="hero">
  <div class="container hero__grid">
    <div class="hero__text">
      ${eyebrow(HERO.eyebrow)}
      <h1>${HERO.h1}</h1>
      <p class="lede">${HERO.lede}</p>
      <a class="text-link" href="services.html">${HERO.link}${ICONS.arrow}</a>
    </div>
    <a class="cta-physical" href="#request">
      ${physButton()}
      <span class="cta-physical__text"><strong>${HERO.ctaTitle}</strong><span>${HERO.ctaSub}</span></span>
    </a>
  </div>
  <div class="container">${statsBar()}</div>
</section>
<section class="section section--light" id="services">
  <div class="container">
    <div class="section__head">
      <div>${eyebrow('Services')}<h2>Always On Electrical Services</h2></div>
      <p>Residential and small commercial. Not industrial. If your job is not on the list, ask anyway.</p>
    </div>
    ${serviceCards()}
    ${trustRow()}
  </div>
</section>
${about}
<section class="section section--steel area" id="area">
  <div class="container area__inner">
    <div><h2>${AREA.h2}</h2><p>${AREA.lede} <a href="service-area.html">See the towns covered.</a></p></div>
    <ul class="pills pills--solid">${SITE.counties.map((c) => `<li>${c}</li>`).join('')}</ul>
  </div>
</section>
${requestSection()}`;
  return page({ slug: 'index', title: SITE.name, description: `Electrician for homes and small businesses in ${countiesProse()}. Sockets, lighting, rewires, fuse boards, EV chargers and fault-finding. Request a callout and Peter confirms by call or text.`, body, jsonLd, bodyClass: 'page-home' });
}

// ---------- Services ----------
export function services() {
  const body = `<section class="page-head">
  <div class="container">
    ${eyebrow('Services')}
    <h1>What Peter does</h1>
    <p class="lede">Residential and small commercial work across ${countiesProse()}. Not industrial. If your job is not listed, ask anyway; it is a quick answer.</p>
  </div>
</section>
<section class="section section--light">
  <div class="container">
    <ul class="service-list">${SERVICES.map((s) => `<li class="service" id="${s.slug}">${ICONS[s.icon]}<div><h2>${s.title}</h2><p>${s.long}</p></div></li>`).join('')}</ul>
    ${trustRow()}
  </div>
</section>
${ctaStrip()}`;
  return page({ slug: 'services', title: 'Services', description: `Sockets and lighting, fuse board upgrades, EV chargers, rewires, fault-finding, smart home, safety certs, PAT testing and small commercial fit-outs across ${countiesProse()}.`, body, active: 'Services' });
}

// ---------- Service area ----------
export function serviceArea() {
  const body = `<section class="page-head">
  <div class="container">
    ${eyebrow('Service area')}
    <h1>${AREA.h2}</h1>
    <p class="lede">Based in ${SITE.town}, working evenings on weekdays and any time at weekends. ${AREA.lede}</p>
  </div>
</section>
<section class="section section--light">
  <div class="container areas">
    ${AREAS.map((a) => `<section class="areas__county" id="${a.county.toLowerCase()}"><h2>County ${a.county}</h2><p>${a.intro}</p><ul class="pills">${a.towns.map((t) => `<li>${t}</li>`).join('')}</ul></section>`).join('')}
    <p class="muted">Somewhere not listed? It may still be covered. Call or text ${SITE.phone} and ask.</p>
  </div>
</section>
${ctaStrip()}`;
  return page({ slug: 'service-area', title: 'Service area', description: `Always On Electrical covers ${countiesProse()}: ${AREAS.map((a) => a.towns.slice(0, 4).join(', ')).join(', ')} and more.`, body, active: 'Service area' });
}

// ---------- Reviews ----------
export function reviews() {
  const body = `<section class="page-head">
  <div class="container">
    ${eyebrow('Reviews and references')}
    <h1>What people say about Peter's work</h1>
    <p class="lede">Always On Electrical is new, so this page will fill up as jobs get done. For now it holds references from the people Peter trained and worked alongside, and the first customer reviews as they come in.</p>
  </div>
</section>
<section class="section section--light">
  <div class="container">
    <div class="section__head"><div>${eyebrow('References')}<h2>From the people who trained him</h2></div></div>
    <ul class="cards cards--2">${REFERENCES.map(([q, w]) => `<li class="card card--quote">${ICONS.quote}<blockquote><p>${q}</p><footer>${w}</footer></blockquote></li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section__head"><div>${eyebrow('Customer reviews')}<h2>From customers</h2></div><p>Reviews are published with the customer's permission, in their own words.</p></div>
    <ul class="cards cards--3 cards--dark">${REVIEWS.map(([q, w, m]) => `<li class="card card--review">${stars()}<blockquote><p>${q}</p><footer><strong>${w}</strong><span>${m}</span></footer></blockquote></li>`).join('')}</ul>
    <div class="review-cta">
      <div><h2>Had a job done by Peter?</h2><p>A short review helps a new business more than you would think. A line or two is plenty.</p></div>
      <div class="review-cta__actions">${ghostBtn('Leave a Google review', SITE.googleReviewUrl, 'star')}${ghostBtn('Email a review', `mailto:${SITE.email}?subject=Review%20for%20Always%20On%20Electrical`, 'mail')}</div>
    </div>
  </div>
</section>
${ctaStrip()}`;
  return page({ slug: 'reviews', title: 'Reviews', description: `References and customer reviews for Always On Electrical, Peter Agnew's electrical business in ${countiesProse()}.`, body, active: 'Reviews' });
}

// ---------- Contact ----------
export function contact() {
  const a = SITE.address;
  const body = `<section class="page-head">
  <div class="container">
    ${eyebrow('Contact')}
    <h1>Call, message, or send a request</h1>
    <p class="lede">Peter answers his own phone. On a job, he calls back as soon as he is free.</p>
    <ul class="contact-ways">
      <li><a href="tel:${SITE.phoneTel}">${ICONS.phone}<span><strong>Call or text</strong><span>${SITE.phone}</span></span></a></li>
      <li><a href="https://wa.me/${SITE.whatsapp}" rel="noopener">${ICONS.whatsapp}<span><strong>WhatsApp</strong><span>Send a photo of the job</span></span></a></li>
      <li><a href="mailto:${SITE.email}">${ICONS.mail}<span><strong>Email</strong><span>${SITE.email}</span></span></a></li>
      <li><span class="contact-ways__static">${ICONS.pin}<span><strong>Based in</strong><span>${a.street}, ${a.locality}, ${a.region}</span></span></span></li>
    </ul>
  </div>
</section>
${requestSection()}`;
  return page({ slug: 'contact', title: 'Contact', description: `Call, text or WhatsApp Peter at ${SITE.phone}, email ${SITE.email}, or send a callout request online.`, body, active: 'Contact' });
}

// ---------- Privacy ----------
export function privacy() {
  const a = SITE.address;
  const body = `<section class="page-head">
  <div class="container">
    ${eyebrow('Privacy policy')}
    <h1>How your details are used</h1>
    <p class="lede">Plain-English version first, the formal parts after. [DRAFT: review before launch]</p>
  </div>
</section>
<section class="section section--light">
  <div class="container prose">
    <h2>In short</h2>
    <p>When you send a callout request, the details you type go to Peter by email and a short text message, and you get a confirmation email. That is what they are used for: replying to you and doing the job. Nothing is sold or shared for marketing.</p>
    <h2>Who is responsible</h2>
    <p>${SITE.name} (${SITE.owner}), ${a.street}, ${a.locality}, ${a.region}. Email <a href="mailto:${SITE.email}">${SITE.email}</a>, phone ${SITE.phone}.</p>
    <h2>What is collected</h2>
    <ul>
      <li>What you type into the request form: a description of the job, the dates and time windows that suit you, your address, name, phone number and email address.</li>
      <li>Any photos you attach.</li>
      <li>When you call, text or WhatsApp, whatever you send in that message.</li>
    </ul>
    <p>The website itself sets no cookies and uses no analytics. The hosting provider keeps standard server logs (IP address, pages requested, time) for security, for a short period.</p>
    <h2>Why, and on what basis</h2>
    <p>To answer your enquiry, arrange the work and carry it out. Under the GDPR this is processing needed to take steps at your request before entering into a contract, and to perform that contract (Article 6(1)(b)). Keeping records of completed work is a legitimate interest (Article 6(1)(f)) and, for certified work, a legal obligation.</p>
    <h2>Who else sees it</h2>
    <ul>
      <li>The email provider that delivers the request to Peter and the confirmation to you.</li>
      <li>The text-message provider that sends Peter the short alert. [SMS PROVIDER NAME, and where their servers are]</li>
      <li>The hosting provider, Eirhost, on whose servers the website runs.</li>
    </ul>
    <p>Nobody else, unless the law requires it.</p>
    <h2>How long it is kept</h2>
    <p>Requests that do not turn into a job are deleted within [6] months. Records of completed work, including certificates, are kept for [6] years for warranty, insurance and Safe Electric purposes. Photos are deleted once the job is closed unless they form part of the work record.</p>
    <h2>Your rights</h2>
    <p>You can ask what is held about you, have it corrected or deleted, restrict or object to its use, or receive a copy. Email <a href="mailto:${SITE.email}">${SITE.email}</a> and it will be dealt with within a month. If you are unhappy with how your details were handled you can complain to the Data Protection Commission, <a href="https://www.dataprotection.ie" rel="noopener">dataprotection.ie</a>.</p>
    <h2>Changes</h2>
    <p>This page is updated if anything above changes. Last updated [DATE].</p>
  </div>
</section>`;
  return page({ slug: 'privacy', title: 'Privacy policy', description: `How ${SITE.name} uses the details you send through the website and by phone.`, body });
}

// ---------- Thank you (used by the form handler for non-JavaScript submissions) ----------
export function thankYou() {
  const body = `<section class="page-head page-head--center">
  <div class="container narrow">
    ${mark({ cls: 'mark mark--big' })}
    <h1>Request received</h1>
    <p class="lede">Thanks. Peter has your request and will be in touch by call or text to confirm the day. A confirmation has gone to your email.</p>
    <p>${flatBtn('Back to the home page', 'index.html')}</p>
  </div>
</section>`;
  return page({ slug: 'thank-you', title: 'Request received', description: 'Your callout request has been sent to Peter.', body });
}

// ---------- 404 ----------
export function notFound() {
  const body = `<section class="page-head page-head--center">
  <div class="container narrow">
    <h1>That page is not here</h1>
    <p class="lede">The link may be old, or the address mistyped. The home page has everything, and the phone number is at the top of every page.</p>
    <p>${flatBtn('Go to the home page', 'index.html')}</p>
  </div>
</section>`;
  return page({ slug: '404', title: 'Page not found', description: 'Page not found.', body });
}
