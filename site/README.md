# The website

Static HTML pages generated from templates, one stylesheet, one script, and (from step 3 of the build plan)
a PHP handler for the callout request form. Built for Eirhost's cPanel hosting: upload the contents of
`dist/` to `public_html/` and it runs.

## Rebuild

```bash
cd site && node build.mjs
```

Node 18 or newer, no packages to install. Output goes to `dist/`, which is committed so it can be uploaded
straight from GitHub without Node.

## Where things live

| Path | What |
| --- | --- |
| `src/content.mjs` | Every piece of copy and every business fact. Change text here, not in `dist/`. Bracketed values such as `[NUMBER]` are still to be filled in and render visibly on purpose. |
| `src/pages.mjs` | The pages: home, services, service area, reviews, contact, privacy, thank-you, 404. |
| `src/layout.mjs` | The page shell: head tags, header and navigation, footer. |
| `src/brand.mjs` | The mark, the wordmark lockup, the physical button, the icons. |
| `src/assets/css/site.css` | The stylesheet. Mobile-first; breakpoints at 720 px and 1024 px. |
| `src/assets/js/site.js` | Menu toggle and the request form: the weekday/weekend rule, validation, and sending. |
| `src/assets/fonts/` | Archivo, self-hosted (no Google Fonts call at runtime). |
| `src/assets/img/` | Mark, favicons, touch icon, social preview image. |
| `dist/` | The built site. Upload this. |

## The request handler (`src/api/`)

`request.php` takes the form post, validates it, emails Peter with any photos attached, texts him if the
SMS switch is on, and emails the customer a confirmation. Plain PHP 8, no libraries.

| File | What |
| --- | --- |
| `request.php` | The endpoint the form posts to. |
| `config.example.php` | Template for `config.php`, which holds the addresses, the SMS switch and the Twilio details. `config.php` is never committed. |
| `selftest.php` | Opens with `?key=SECRET` and sends one test email and, if switched on, one test text. |
| `lib/rules.php` | The weekday/weekend rule and field validation. |
| `lib/mail.php`, `lib/sms.php`, `lib/http.php` | Sending email, sending a text through Twilio, and responses. |
| `data/` | Rate-limit state and a short log (no personal data). Blocked from the web. |

Spam protection: a hidden honeypot field, a minimum time the form must have been open, and a per-IP
rate limit. Bots get a quiet "success" and nothing is sent.

## Deploying to Eirhost

1. In cPanel, create the mailbox `noreply@alwaysonelectrical.ie` (nobody needs to read it; it is the
   address the site sends from).
2. Upload everything in `dist/` to `public_html/`.
3. In `public_html/api/`, copy `config.example.php` to `config.php` and fill it in. Change `secret`
   to a long random string.
4. Open `https://alwaysonelectrical.ie/api/selftest.php?key=YOUR_SECRET`. It reports what the server
   can do and sends a test email (and text, if SMS is on).
5. Submit a real request from a phone. Check Peter gets the email and the customer gets the confirmation.
6. Set `'selftest' => false` in `config.php`.

To turn on text alerts later: create the Twilio account, verify Peter's number, upgrade it with a
card, then in `config.php` set `'enabled' => true` and paste the Account SID and Auth Token. Nothing
else changes.

## The availability rule

Peter works evenings on weekdays and any time at weekends. In the form each date has its own arrival
window; picking a weekday greys out Any time, Morning and Afternoon and selects Evening. The same rule
must be enforced again in the PHP handler, because the browser side can be bypassed.

## Still to do

- A photo of Peter for the about section: save it as `src/assets/img/peter.jpg` and set `ABOUT.photo` in `content.mjs`.
- The facts in brackets: REC number, insurer, Google review link, references and reviews.
- Set `SITE.showReviewsInNav` to `false` in `content.mjs` if the site launches before there are reviews to show.
