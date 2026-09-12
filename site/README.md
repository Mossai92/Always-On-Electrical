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

## The availability rule

Peter works evenings on weekdays and any time at weekends. In the form each date has its own arrival
window; picking a weekday greys out Any time, Morning and Afternoon and selects Evening. The same rule
must be enforced again in the PHP handler, because the browser side can be bypassed.

## Still to do

- `api/request.php` and its configuration (email to Peter with photos, SMS alert, confirmation to the customer).
- A photo of Peter for the about section: save it as `src/assets/img/peter.jpg` and set `ABOUT.photo` in `content.mjs`.
- The facts in brackets: REC number, insurer, Google review link, references and reviews.
- Set `SITE.showReviewsInNav` to `false` in `content.mjs` if the site launches before there are reviews to show.
