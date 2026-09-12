# Brand and design canvas

The design lives on a canvas at https://claude.ai/code/artifact/23d1a01f-e8fb-4149-b853-07faaa4651c7
(home page at desktop and mobile widths, the reviews page, the mark/lockup/button sheet, and the
three superseded logo directions). The files here are its source.

- `build-home.mjs` generates `Main.dc.html`, `HomeMobile.dc.html`, `Reviews.dc.html`,
  `ReviewsMobile.dc.html`, `Brand.dc.html` and `canvas.json`. Copy and business facts are constants
  at the top of the file; bracketed values like `[NUMBER]` are still to be filled in.
- `build.mjs` generates the superseded logo-direction sheets (`Overview`, `Standby`, `Slide`, `Rocker`).
- `inspect-obj.mjs` measures the 3D models in `../assets/3d` and writes flat projections; the mark and
  button in `build-home.mjs` were traced from those measurements.

Rebuild everything with:

```bash
node build.mjs && node build-home.mjs
```

Re-seeding the canvas from the artboards is done from Claude Code (the design helper is not in this
repo). `preview/`, `saved-*/` and the seeded `always-on-electrical-logo.html` are scratch output and
are ignored by git.
