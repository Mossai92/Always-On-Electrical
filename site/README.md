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

## Checking a build

```bash
cd site && node build.mjs && node check.mjs
```

`check.mjs` confirms every internal link and asset resolves, every fragment link has a target, every
page has a title, description, canonical URL and one heading, and lists any bracketed placeholders
still on the pages. `node build.mjs --zip` also writes `always-on-electrical-site.zip` (ignored by
git) for uploading in one go.

## Launch checklist (Eirhost cPanel)

1. **Domain.** Point `alwaysonelectrical.ie` at the Eirhost nameservers (Peter and Mossy have the
   registrar login). Wait until `https://alwaysonelectrical.ie` shows the hosting's default page with a
   padlock: cPanel's AutoSSL issues the certificate once the domain resolves. The site's `.htaccess`
   forces HTTPS, so upload only after the padlock appears.
2. **Mailbox.** In cPanel, create `noreply@alwaysonelectrical.ie`. Nobody needs to read it; it is the
   address the site sends from, and mail providers trust it because it is on the same domain.
3. **Upload.** In cPanel's File Manager, upload `always-on-electrical-site.zip` into `public_html/`,
   extract it there, and delete the zip. Make sure `.htaccess` and the `api/` folder came across
   (turn on "Show hidden files" in File Manager settings).
4. **Configure.** In `public_html/api/`, copy `config.example.php` to `config.php` and fill it in.
   Change `secret` to a long random string. Leave `sms.enabled` as `false` for now.
5. **Self-test.** Open `https://alwaysonelectrical.ie/api/selftest.php?key=YOUR_SECRET`. It reports the
   PHP version, upload limits and whether the data folder is writable, and sends a test email to
   Peter. If the email does not arrive, check the spam folder, then the mailbox in step 2.
6. **Real test.** From a phone, submit a request with a photo, choosing a weekday and a weekend date.
   Peter should get the email with the photo attached; the customer address should get a confirmation.
7. **Lock down.** Set `'selftest' => false` in `config.php`.
8. **Search.** Add the site to Google Search Console and submit
   `https://alwaysonelectrical.ie/sitemap.xml`. Set up a Google Business Profile for Always On
   Electrical with the same phone number and address; the Google review link for the reviews page
   comes from there.

To turn on text alerts later: create the Twilio account, verify Peter's number, upgrade it with a
card, then in `config.php` set `'enabled' => true` and paste the Account SID and Auth Token. Nothing
else changes. Re-run the self-test afterwards; it sends one test text.

## Updating the site later

Edit `src/content.mjs` (or the page you need), run the build and check commands above, upload the
changed files from `dist/`, or the whole zip again. `config.php` on the server is never overwritten by
this, because it is not in `dist/`.

## The availability rule

Peter works evenings on weekdays and any time at weekends. In the form each date has its own arrival
window; picking a weekday greys out Any time, Morning and Afternoon and selects Evening. The same rule
must be enforced again in the PHP handler, because the browser side can be bypassed.

## Still to do

- A photo of Peter for the about section: save it as `src/assets/img/peter.jpg` and set `ABOUT.photo` in `content.mjs`.
- The facts in brackets: REC number, insurer, Google review link, references and reviews.
- Set `SITE.showReviewsInNav` to `false` in `content.mjs` if the site launches before there are reviews to show.
