# Portfolio

Static portfolio site. Astro 5 + Tailwind 4, no UI framework. Ships ~15 kB of gzipped
JS — all of it Astro's view-transition router; the theme toggle, scroll reveals and stat
counters are hand-written vanilla JS.

Working notes on what still needs filling in live in `CONTENT.md`, which is gitignored — this
repo is public and that file discusses draft copy, so it stays on the authoring machine.

## Running it

Node 20+ required. This repo pins 24 via `mise.toml`, because the global mise pin on this
machine is 18 and Astro 5 won't run on it.

```bash
mise install          # once — picks up mise.toml
npm install
npm run dev           # http://localhost:4321
npm run build         # → dist/
npm run preview       # serve dist/ locally
npm run check         # astro check (types + template diagnostics)
```

If `mise` isn't shimming:

```bash
PATH=/Users/duenasfl/.local/share/mise/installs/node/24.18.0/bin:$PATH npm run dev
```

## Layout

```
src/
├── data/site.ts            # name, links, experience, skills, education, lab projects
├── content/work/*.mdx      # one file per case study — the real content
├── content.config.ts       # frontmatter schema; build fails loudly on drift
├── layouts/Base.astro      # head/meta/OG, pre-paint theme init, reveal + counter + toggle JS
├── components/
│   ├── Hero.astro  Nav.astro  WorkCard.astro  Lab.astro
│   ├── AsciiPortrait.astro # photo → characters on a canvas; hidden until the file exists
│   ├── Experience.astro  Places.astro  Skills.astro  Contact.astro
│   ├── SectionHeading.astro  Icon.astro  Footer.astro
│   ├── StatTiles.astro     # UNUSED — the hero stat row, kept for easy restore
│   ├── Diagram.astro       # key → diagram component; `bare` drops the frame for thumbnails
│   ├── Figure.astro        # real images from public/, lazy + no layout shift
│   └── diagrams/           # inline SVG: Pipeline, AgentGraph, EventSourcing, Forecast,
│                           #             Benchmark, EvalMatrix
├── pages/
│   ├── index.astro          # hero → work → experience → lab → toolkit → contact
│   ├── work/[...slug].astro # case study, sticky meta rail
│   ├── og.astro             # source for public/og.png; not linked from anywhere
│   └── 404.astro
└── styles/global.css        # tokens, both themes, .accent-* locals, display/label/num/chip
```

## Design system

**Editorial, warm, near-monochrome.** Light is the default; dark is a real alternate, not
an afterthought.

**Type.** Newsreader (variable serif, weight 350, plus a true italic) for display; DM Sans
for body and UI; system mono for stack chips only. Four utility classes carry the system —
`.display`, `.label`, `.num`, `.chip` — so a new section inherits the voice without
inventing type styles.

**Colour.** Warm paper `#faf9f6` with faintly blue-cast ink `#14161c`, and **three** accents in
priority order: ink blue (`--color-accent`) carries every link and interactive state, burnt
orange (`--color-accent-2`) and violet (`--color-accent-3`) only distinguish one panel or
section from the next. All three clear WCAG AA (≥4.5:1) as small text on both paper tones in
both themes — measured, not eyeballed. Nothing is coloured for decoration; a colour always
marks a boundary.

`.accent-blue` / `.accent-orange` / `.accent-purple` in `global.css` re-point
`--color-accent` for one subtree. Every `*-accent` utility inside follows, **and so do the
inline diagram SVGs** — so one class re-tints a panel's rule, eyebrow, hover state and
drawing together. Both themes are declared in the class because an inline `style` attribute
can't be theme-conditional.

**Theming.** Every token is a CSS custom property declared in `@theme`, re-declared under
`html[data-theme="dark"]`. Tailwind utilities compile to `var()` references, so overriding
the variable re-themes the whole site with no `dark:` variants anywhere. Change
`--color-accent` in one place and everything follows.

The theme is applied by an `is:inline` script in `<head>` that runs **before first paint** —
deferring it flashes the wrong theme. It respects `prefers-color-scheme` until the user
picks explicitly, then persists to `localStorage`.

**Motion, and its limits.** Reveals are opacity plus a 12px rise over 650ms on
`cubic-bezier(.22, 1, .36, 1)`, staggered 70–90ms via `--reveal-delay`. Hover moves an
arrow, or tints a row — it never lifts a card. That's the entire vocabulary. There is no
hero canvas, no parallax, no cursor effect: on a typographic layout those read as
decoration competing with the words. Everything respects `prefers-reduced-motion`, and
counters print their final value rather than animating.

**Motion, one exception.** `AsciiPortrait.astro` resamples a real photo into characters on a
canvas, and hover widens the character ramp so the face resolves further. It's the only
pointer-driven effect on the site, it's the portrait rather than an ornament, and it's skipped
entirely under `prefers-reduced-motion`. The canvas re-renders on theme change; on a dark page
dense characters have to mean *bright*, or the portrait draws as its own negative.

**Visuals are diagrams, not screenshots.** Most of the work described here is internal and
unpublishable, so the visual load is carried by six inline-SVG architecture diagrams in
`components/diagrams/`. Inline rather than exported files for two reasons: they inherit the
theme custom properties, so there's no second dark-mode asset to keep in sync, and they cost
no extra request. Each carries a `<title>` for screen readers describing the system in prose.
`Figure.astro` handles real images when there are some — see [CONTENT.md](./CONTENT.md).

**Accessibility.** Skip link, `:focus-visible` rings, `aria-hidden` on decorative layers,
`aria-pressed` + a live `aria-label` on the theme toggle, real `<dl>`/`<ol>` semantics for
figures and timeline.

**No network fonts.** Newsreader and DM Sans are self-hosted via `@fontsource-variable`
(8 woff2 files), so there's no render-blocking third-party request and no layout shift.

### Two traps worth remembering

**Astro scopes component `<style>` to that component's elements.** A rule targeting an
element rendered by a *child* component (e.g. an SVG from `Icon.astro`) will silently never
match. That's why the theme-toggle glyph rules live in `global.css` — the scoped version
compiled fine and showed the same icon in both themes.

**Tailwind resolves conflicting utilities by stylesheet order, not class order.** Don't
write `pl-0 sm:pl-0` next to `sm:pl-6` and expect the last one to win. `cellClass()` in
`StatTiles.astro` returns one complete string per case for exactly this reason.

## Deploying — Cloudflare Pages

The build is fully static, so `dist/` works on any host. Target is Cloudflare Pages with
Git integration: push to `main`, it rebuilds and redeploys itself.

**1. Put it on GitHub** (private is fine — Cloudflare can still read it):

```bash
cd /Users/duenasfl/portfolio
git init && git add -A && git commit -m "Portfolio site"
gh repo create portfolio --private --source=. --push
```

**2. Connect it** at [dash.cloudflare.com](https://dash.cloudflare.com) →
Workers & Pages → Create → Pages → Connect to Git:

| Field | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | from `.node-version` (24.18.0) |

That `.node-version` file matters — Cloudflare's default Node is older than Astro 5
tolerates, and the build fails with a confusing engine error without it.

**3. Set `SITE`** in `astro.config.mjs` to the `*.pages.dev` URL Cloudflare assigns, then
push again. Until then the sitemap and canonical URLs point at a placeholder.

A custom domain is a later, independent step — Pages → Custom domains, then update `SITE`.

### Before the first public deploy

- [ ] `grep -rn "TODO" src/` comes back empty
- [ ] All four case studies read and approved by your manager
- [ ] Both themes eyeballed in a real browser
- [ ] `npm run check` and `npm run build` clean
- [ ] `SITE` in `astro.config.mjs` matches the real URL — `og:image` is built from it, and a
      wrong value gives every shared link a blank preview card
- [ ] `public/og.png` regenerated if the name, role or positioning line changed

### The share image

`public/og.png` is a screenshot of `src/pages/og.astro`, taken from the **built** site so the
dev toolbar doesn't appear in it:

```bash
npm run build && npm run preview -- --port 4399 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --screenshot=public/og.png --virtual-time-budget=4000 \
  http://localhost:4399/og
```
