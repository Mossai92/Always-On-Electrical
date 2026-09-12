# Always On Electrical — Website Project Handoff

## Business

- **Business name:** Always On Electrical
- **Owner:** Peter Agnew (soon-to-be fully qualified electrician)
- **Service area:** Dublin, Wicklow and Kildare, Ireland
- **Safe Electric registration:** Not yet registered — expected to be complete by launch. Trust badge/mention should be ready to add but doesn't need to block launch.
- **Timeline:** ASAP — aiming for weeks, not months
- **Scope of work:** Residential + small commercial (not industrial)

## Core purpose

A lead-generation site. The primary conversion action is a **callout request form** — not a live booking calendar. Peter confirms every request manually by call/text, so the site's job is to capture a clear, complete request and get it to him fast.

## Booking mechanism (v1)

Simple form, no calendar integration. Modelled on Jobber's request flow ([reference](https://mobbin.com/flows/13bc2f40-c708-4405-89a3-3a6e72376e07)):

- Job description (free text)
- "Which day would suit best?" + "Another day that works?" (two date fields, not one — gives Peter flexibility rather than a rigid slot)
- Preferred arrival window: Any time / Morning / Afternoon / Evening (checkboxes, not exact time slots)
- Optional photo upload (customers can show the fault/socket/fusebox — genuinely high-value for electricians)
- Address field (used to softly confirm the job is within Dublin/Wicklow/Kildare)
- Contact details (name, phone, email)
- On submit: confirmation message ("Request received, we'll be in touch") + **notify Peter by email AND SMS**

## Site structure / features (v1)

**Homepage**
- Hero: bold headline, one-line subheadline, primary CTA ("Request a Callout") + secondary CTA ("View Services"), trust stat bar underneath (e.g. "Safe Electric registered · Fully insured · Dublin, Wicklow & Kildare"). Pattern reference: [ASMOB/Framer hero](https://mobbin.com/screens/7209c5ef-6a08-464b-9fb1-99b70cc8e836)
- Services grid: icon + label per service, pattern reference: [Airbnb services grid](https://mobbin.com/sites/sections/b886e6eb-e6ec-46dc-bfea-c32905850d05)
- Trust badges row: Safe Electric, fully insured — small badge-row pattern, not the enterprise-compliance style
- About/story section: leans into Peter being newly qualified — apprenticeship, training, genuine enthusiasm, rather than pretending otherwise
- Footer: contact details, service area, social links if any

**Services page** — full list: sockets & lighting, rewires, fuse board/consumer unit upgrades, EV charger installs, smart home, fault-finding, safety certs (EICR) for landlords/small businesses, PAT testing, minor commercial fit-outs

**Service area page** — Dublin, Wicklow, Kildare, for local SEO

**Contact** — click-to-call, WhatsApp button, email, contact form

**Legal** — GDPR-compliant privacy policy (site stores customer contact info + job details via the form)

**Technical requirement** — mobile-first responsive design. Customers are very likely to find and contact an electrician from their phone; every layout pattern above needs to stack/collapse cleanly (single-column form, grid drops to 1–2 columns, badge row wraps).

## v2 / future (not blocking launch)

- Real content photos replacing stock, as Peter builds a job portfolio
- Live availability calendar (once request volume justifies it)
- Online deposits/payments
- Live Google Reviews widget once reviews exist
- Blog for local SEO

## Content gap for launch

No existing work photos yet. **v1 plan:** tasteful stock photography (electrical panels, tools, hands-on work) standing in until Peter has his own job photos to swap in.

## Branding

Needs full branding designed as part of this project — nothing exists yet beyond the name and the icon concept.

- **Wordmark concept:** "Always On Electrical" with the O in "On" rendered as a power on/off toggle symbol
- **Signature device:** the toggle icon literally shifts colour between its two states — muted/grey for "off", bold amber/orange for "on" — used as a recurring brand moment (not just a static logo mark)
- **Base colour:** deep charcoal / near-black navy
- **Accent colour:** bold, fully saturated amber/orange (not muted gold) — reads as the "spark"/glow of something switching on
- **Rest of wordmark:** kept restrained/neutral so the toggle icon carries the visual interest
- **Typography:** not yet decided — open item for the build phase
- **Accessibility note:** the icon must still read clearly as the word "On" at small sizes (favicon) and to screen readers — needs real alt text, can't rely on the icon alone

## Hosting & Domain

- **Domain:** alwaysonelectrical.ie — registered through Eirhost
- **Host:** Eirhost — Irish shared/cPanel hosting (not a serverless platform like Netlify/Vercel)
- **Build implication:** the booking form's email + SMS notification needs to run as something cPanel can execute (e.g. a PHP script), not a Node.js serverless function — plan the tech stack around that rather than assuming a JAMstack-style backend
- **Email:** peter@alwaysonelectrical.ie available on the same plan

(Domain/hosting pricing and account setup are being handled directly by Peter and Mossy — not something the build needs to reference.)

## Open items to resolve during build

- Final hex values for the palette (directional colours above, not locked)
- Typeface pairing
- Hosting choice
- Exact domain
