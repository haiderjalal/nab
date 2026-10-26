# CLAUDE.md

Single-page portfolio built with Next.js 16. This file describes the layout, design system, motion, content model, and engineering rules, so a new portfolio can be built to the same standard. Last updated 2026-10-27.

To reuse it, copy this file into the root of the new project's repository and follow section 15.

> Read this file before changing anything. Small copy and style changes can go ahead. Ask first for anything listed under "Ask before" in section 2.

---

## 1. Purpose and principles

- Goal: a credible, premium profile that turns visitors into enquiries. The look is calm and editorial, and motion stays in the background.
- Priorities, in order: accuracy of content, clarity, accessibility, performance, then motion.
- Every motion effect is optional. Reduced-motion users get the finished layout with no animation.
- Keep it simple. Prefer the smallest change that works, and reuse existing components before writing new ones.

## 2. Working rules

**Always**
- Read the Next.js docs in `node_modules/next/dist/docs/` before writing Next.js code. Version 16 changed APIs and conventions (see `AGENTS.md`).
- Keep visible copy in `src/data/profile.ts`, and navigation and CTA labels in `src/lib/site.ts`. Don't hardcode visible text in components.
- Use strict TypeScript. No `any`. Explicit return types on exported functions. No non-null assertions (`!`).
- Use the token classes for colour (section 8.1). Never put hex values in components.
- Leave a `TODO` in the content file for any fact you don't have, and list the TODOs in your final message.
- Run the build gates and browser checks in section 13 before you report work as done.
- Work on a feature branch. Don't commit or push unless asked.

**Never**
- Invent facts about the person: qualifications, dates, titles, memberships, clients, results, testimonials, fees, or awards.
- Disable validation, ignore TypeScript or lint errors, or suppress a warning without explaining it.
- Run `npm audit fix --force`. It makes major version changes.
- Put secrets in the repository.

**Ask before**
- Adding a form, a CMS, analytics, a database, auth, or any new dependency.
- Adding or removing a section, or changing the hero concept.
- A refactor that touches several files, or a new folder structure.
- Changing the palette or the typefaces.

## 3. Stack

| Area | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.4, App Router, Turbopack | `cacheComponents: true`. The home page prerenders to static HTML. |
| UI | React 19.3, TypeScript (strict) | Server Components by default. |
| Styling | Tailwind CSS v4 | Theme tokens are CSS variables in `src/app/globals.css`. |
| Motion | `motion` 14 (`motion/react`) | Motion values for pointer and scroll effects. |
| Icons | `@phosphor-icons/react` 2.1 | Import only from `src/components/ui/icons.ts`. |
| Fonts | `next/font/google`: Archivo, Geist, Geist Mono | Latin subset, self-hosted at build time. |
| Lint and format | ESLint 9 with `eslint-config-next`; Prettier 3 | No Prettier config file, so defaults apply. |
| Packages | npm, `package-lock.json` committed | |
| Hosting | Vercel | Set `NEXT_PUBLIC_SITE_URL` before deploying. |

No CMS, database, auth, analytics, or form backend. Add any of them only after approval.

## 4. Commands

```bash
npm install
cp .env.example .env.local      # PowerShell: Copy-Item .env.example .env.local
npm run dev                     # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run start                   # serves the production build
npm run format
```

- `.claude/launch.json` defines the dev and start servers on port 3000 for the preview pane.
- On a fresh clone, `npm run typecheck` fails on `LayoutProps` until types are generated. Run `npx next typegen` (or `npm run build`) first.

## 5. Project structure

```
src/
  app/
    layout.tsx            fonts, metadata, viewport, JSON-LD, skip link, Navbar, Footer
    page.tsx              section order (edit here to add or remove sections)
    globals.css           colour tokens, base styles, shared motion keyframes
    not-found.tsx         404 page
    opengraph-image.tsx   1200x630 social image, built from content
    robots.ts, sitemap.ts
  components/
    layout/               Navbar, Footer, PointerSpotlight
    sections/             Hero, ProjectFan, ProjectCard, RotatingRole, Ticker,
                          About, Services, Work, Experience, Contact
    ui/                   Reveal, TiltCard, MagneticLink, PausableMarquee,
                          TimelineRail, icons.ts
  data/profile.ts         all visible content
  hooks/                  useRotatingText, useActiveSection
  lib/site.ts             site URL, navigation links, CTAs
  types/profile.ts        content types
public/
  images/                 portrait and other photos
  projects/               showcase images (16:10 or 21:9 crops)
docs/architecture.md      decisions, kept in sync with changes
```

Keep this flat layout for a one-page site. Add a `features/` folder only when there are several feature areas, and only after approval.

## 6. Configuration

### 6.1 Environment

- `NEXT_PUBLIC_SITE_URL`: the public address, for example `https://example.com`. A bare domain also works. Locally it defaults to `http://localhost:3000`. Any other value fails the build with a clear message (`src/lib/site.ts`).
- It feeds canonical URLs, Open Graph tags, JSON-LD, the sitemap, and robots.
- `.env*` files are git-ignored except `.env.example`. Any new variable goes into `.env.example` with no real value, and needs approval.

### 6.2 `next.config.ts` (keep these settings)

- `cacheComponents: true` and `partialPrefetching: true`.
- `poweredByHeader: false`.
- `headers()` applies one set of headers to every route, shown below.
- CSS is processed by `@tailwindcss/turbopack`.

Content Security Policy (copy exactly; dev adds `'unsafe-eval'` to `script-src` and `ws:` to `connect-src`):

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob:
font-src 'self'
connect-src 'self'
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
```

Other headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.

Any new third-party origin (analytics, maps, booking widgets, an image CDN) must be added to this policy in the same change. Embedded frames such as maps need a `frame-src` entry.

## 7. Content model

Types live in `src/types/profile.ts`. Content lives in `src/data/profile.ts`.

```ts
export interface Profile {
  name: string;
  headline: string;               // page title and hero subheading
  description: string;            // meta description and screen-reader summary
  intro: string;                  // hero paragraph
  roles: readonly string[];       // rotating line above the name
  location: { city: string; country: string; countryCode: string };
  agency: { name: string; url: string; tagline: string };  // brand card in the hero fan
  portrait: { src: string; alt: string };
  about: {
    heading: string;
    paragraphs: readonly string[];
    facts: readonly { label: string; value: string }[];
  };
  tickerItems: readonly string[];
  services: readonly ServiceItem[];   // icon: "consultancy" | "automation" | "content" | "websites"
  projects: readonly ProjectItem[];   // name, summary, url, image, tags (image and tags required)
  experience: readonly ExperienceItem[];  // role, organization, period, summary?
  education: readonly EducationItem[];    // school, degree, period
  socials: readonly SocialLink[];     // label, handle, href, icon: "linkedin" | "instagram" | "facebook" | "website"
}
```

Content rules:
- Summaries: one or two sentences, roughly 90 to 140 characters.
- Services: 3 to 5 items. Ticker: 4 to 6 short labels.
- Dates: `"Mon YYYY - Mon YYYY"` or `"YYYY - Present"`, stored as text.
- Experience and education hide when both are empty. Other sections always render, so remove them from `page.tsx` if they aren't needed.
- Every image has `alt` text. Purely decorative images use `aria-hidden` and no alt text.
- Publish only the contact details the owner has approved.

## 8. Design system

### 8.1 Colour tokens (`src/app/globals.css`)

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` | `#e7e7e4` | `#0b0b0b` | page |
| `--surface` | `#ffffff` | `#161616` | cards, pills, buttons |
| `--foreground` | `#0b0b0b` | `#f2f2ef` | text, dark panels |
| `--muted` | `#4f4f4f` | `#a3a3a0` | secondary text |
| `--border` | `rgb(11 11 11 / 0.14)` | `rgb(255 255 255 / 0.12)` | outlines |
| `--accent` | `#d12b1f` | `#ff4b3a` | CTAs, markers, one emphasis per section |
| `--accent-text` | `#b3241a` | `#ff6f60` | small accent text (darker on light) |
| `--accent-contrast` | `#ffffff` | `#0b0b0b` | text on accent |
| `--glow` | `rgb(209 43 31 / 0.14)` | `rgb(255 75 58 / 0.16)` | hero glow |
| `--spotlight` | `rgb(11 11 11 / 0.06)` | `rgb(255 255 255 / 0.05)` | cursor light |

- Dark mode follows `prefers-color-scheme`. There is no toggle.
- Tailwind classes: `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `border-border`, `bg-accent`, `text-accent-text`, `text-accent-contrast`.
- Contrast: body text at least 4.5:1, large text at least 3:1. Use `text-accent-text`, not `text-accent`, for small red text.
- Theme colour in the viewport meta: `#e7e7e4` (light) and `#0b0b0b` (dark).

### 8.2 Typography

- **Display** (Archivo, `font-display`): all `h1` to `h3`. Hero name: `font-black uppercase`, `text-[clamp(2.25rem,9.5vw,8.75rem)]`, `leading-[0.92]`, `tracking-[-0.02em]`. Section headings: `text-4xl font-semibold tracking-[-0.035em] md:text-5xl` (the contact heading uses `md:text-6xl`). Card titles: `text-xl font-semibold tracking-tight`.
- **Body** (Geist, `font-sans`): lead text `text-lg leading-relaxed text-muted`. Hero intro `text-base md:text-lg`.
- **Labels, dates, tags, metadata** (Geist Mono, `font-mono`): `text-xs` or `text-sm text-muted`.
- Two font weights at most per heading level.

### 8.3 Layout and spacing

- Content width: `mx-auto max-w-7xl`. Side padding: `px-6` (the hero uses `md:px-10`).
- Section rhythm: `py-28 md:py-36`. Header to content: `mt-14`.
- Grids: About `md:grid-cols-[0.9fr_1.1fr] gap-14 md:gap-20`. Services `md:grid-cols-3 gap-5`. Work `md:grid-cols-2 gap-6`. Contact links `grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4`.
- Anchor targets: `section[id]` has `scroll-margin-top: 5rem` so the header doesn't cover headings.
- Breakpoints (Tailwind defaults): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.

### 8.4 Shape, borders, shadows

- Cards and panels: `rounded-[20px] border border-border`. Media inside cards: `rounded-[16px]`.
- Pills, buttons, icon buttons, and tags: `rounded-full`.
- Fan card shadow: `shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]`. Service card hover shadow: `shadow-[0_28px_50px_-32px_rgb(0_0_0/0.45)]`.

### 8.5 Buttons and links

| Type | Classes |
|---|---|
| Primary CTA (`MagneticLink variant="primary"`) | `rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast hover:brightness-110 active:scale-[0.98]` |
| Secondary CTA (`variant="secondary"`) | `border border-border text-foreground hover:bg-surface` |
| Header CTA | `rounded-full bg-accent px-4 py-2 text-sm font-semibold` |
| Icon button | `size-10 rounded-full border border-border bg-surface`. Hover inverts to `bg-foreground text-background`. |
| Text link | `text-muted transition-colors duration-300 hover:text-foreground` |

Link text describes the destination. Avoid "click here". External links use `target="_blank" rel="noopener noreferrer"`.

### 8.6 Atmosphere

- Hero glow: `bg-[radial-gradient(55%_45%_at_50%_30%,var(--glow),transparent)]`.
- Dot grid: `.dot-grid` (18px dots in `--border`), faded at the edges with `.dot-fade`.
- Hero corner marks: `Plus` icons at `text-foreground/40`, desktop only.
- Cursor light: `PointerSpotlight`, a 640px soft light for fine pointers only.
- Marquee edges fade with `.edge-fade` (12% at each side).
- Contact block: a dark panel with a drifting accent glow.

### 8.7 Header (`Navbar.tsx`)

- Fixed, `h-16`, `z-50`, inside `max-w-7xl`.
- Left: the Waveform icon in accent, plus the name. Right: section links (md and up), the header CTA, and a menu button (below md).
- Glass background (`.glass`: 90% of `--background`, 16px blur) fades in across the first 96px of scroll.
- A 1px accent progress bar along the bottom edge tracks scroll.
- The section in view gets `aria-current="location"` and an accent underline (`useActiveSection`). Each nav href must match a section `id`, or the highlight never appears.
- Mobile menu: an opaque panel below the bar with large display-font links. It closes on link choice or Escape. The toggle has `aria-expanded` and `aria-controls`, and focus returns to it.

### 8.8 Hero (`Hero.tsx`, `ProjectFan.tsx`)

Top to bottom:
1. Top row: rotating role on the left (mono, `text-accent-text`). City and country on the right (mono, muted).
2. Name in outline and solid display letters. A 0.14em accent bar separates the first and second word. Letters cycle between outline and solid, each one 0.12s after the last.
3. Intro paragraph (left on desktop) and two CTAs (right on desktop, centred on mobile).
4. Card fan, pinned to the bottom. The cards sit on an arc that pivots below the viewport. The centre card is the brand card (accent background, icon, name, tagline). Project cards split evenly on each side.
5. Caption at bottom left (name and tags) and a "Visit" button at bottom right. On desktop the caption is a surface card so it stays readable over the fan.

Sizing: card width `clamp(150px, 17vw, 232px)`, height 1.3 times the width. Arc radius `min(80vh - card height, 58vw)`. These live in the `.fan-stage` CSS variables.

Interaction: a slow sway (±2°, about one cycle every 10 seconds). Drag horizontally to turn the fan (0.12° per px). Click a card that isn't at the front to bring it forward. Arrow keys and arrow buttons step through the cards. The front card opens its link in a new tab.

**Hard rule:** stacked hero content must never collide with the fan. During QA, an extra row under the paragraph pushed the CTAs into the cards at 799px and at 1366×768. Check both sizes after any hero change. New hero elements go in the top row, or need approval.

### 8.9 Ticker (`Ticker.tsx`, `PausableMarquee.tsx`)

- Full-width band on `bg-foreground`. Items use `font-display text-2xl uppercase text-background md:text-3xl`, separated by accent sparkle icons.
- The list renders twice so the loop has no seam. The loop takes 40 seconds. A pause button sits at the right.

### 8.10 About (`About.tsx`)

- Desktop: two columns. Left: the portrait in a `4/5` frame with a 16px accent block behind it, wrapped in `TiltCard`. Right: heading, paragraphs, and a facts grid (two columns from `sm`). Each fact is a card with a mono label and a medium-weight value.

### 8.11 Services (`Services.tsx`)

- Three columns on desktop. Cards are at least 18rem tall. Each has a duotone icon (32px), a title (`text-2xl`), a description, and an optional image (16:10 on mobile, filling the card on desktop).
- The variant map (`cardVariants`) sets each card's span and colours by icon. The first card spans two columns on dark, the second is a dot-grid surface, the third is accent-filled, and the fourth spans two columns with a split layout. With a different number of items, review the grid.
- Hover lifts the card 4px and deepens the shadow. This runs only when motion is allowed (`motion-safe:`).

### 8.12 Work (`Work.tsx`, `ProjectCard.tsx`)

- Two columns. The first card always spans the full row, and so does the last one when the count is even, so the grid never has gaps (`spansFullRow`).
- Card: image `aspect-[16/10]` (full-row cards use `aspect-[21/9]`), title, summary, and mono tag pills. The whole card links to the project in a new tab.
- Hover: the border turns accent and the image scales to 1.04. The image hover relies on the `group` class on the `TiltCard` wrapper, so keep that class there.

### 8.13 Experience (`Experience.tsx`, `TimelineRail.tsx`)

- The rail draws down as the list enters the viewport. Each entry has an accent-ringed dot.
- Desktop: a 14rem date column, then the role (`text-xl`), the organisation (`text-accent-text`), and the summary (muted, `max-w-2xl`). Mobile: stacked.
- Education follows, with a smaller heading and no rail.

### 8.14 Contact (`Contact.tsx`)

- A dark panel (`bg-foreground text-background rounded-[20px] p-8 md:p-14`) with the drifting glow (`.aurora`), a large heading, a supporting paragraph, and a grid of link cards. Each card has an accent icon, an arrow, a label, and the handle. Links open in a new tab.

### 8.15 Footer (`Footer.tsx`)

- Top border. The name and a one-line summary with city and country sit on the left. Section links and social links sit on the right and wrap on small screens.
- No year. The page is prerendered, and `new Date()` breaks prerendering.

## 9. Motion

### 9.1 Principles

- Animate only `transform` and `opacity`, plus colour and stroke on the outline letters. Never animate layout properties.
- Pointer and scroll effects use motion values (`useMotionValue`, `useSpring`, `useTransform`, `useScroll`). They never re-render React on each frame. React state changes only when the visible state changes, for example the active fan card.
- Effects that must show before JavaScript loads use CSS: `.rise`, `.outline-letter`, `.hero-bar`, `.marquee-track`, `.aurora`.
- Signature easing for entrances and snaps: `[0.16, 1, 0.3, 1]`. Stagger siblings by 0.06 to 0.12 seconds.
- Every effect is optional. In JS, check `useReducedMotion()`. In CSS, add a `prefers-reduced-motion: reduce` override for that animation.
- Never add a global `animation-duration: 0.01ms` override. It makes some animations more jarring. Turn each animation off by name.
- Hover transforms need `motion-safe:` or a `(pointer: fine)` check, so they don't stick on touch screens.
- CSS scroll-driven animations don't work in Firefox. Use `motion/react` instead, or write a fallback.

### 9.2 Inventory (current values)

| Effect | Where | Spec |
|---|---|---|
| Reveal | section headings, cards | Opacity 0 to 1, y 32 to 0, rotateX 10 to 0. 0.9s. Plays once, when 20% is visible. Wrap content in `<Reveal delay>`. |
| TiltCard | About portrait, cards | Max 7°. Spring 160 / 20 / mass 0.6. White glare at 16%. Mouse only; touch stays flat. |
| MagneticLink | hero CTAs | Moves 25% of the pointer offset. Spring 300 / 22 / mass 0.5. Mouse only. |
| PointerSpotlight | whole page | 640px soft light. Spring 120 / 26 / mass 0.6. Fine pointers only; off for reduced motion. |
| ProjectFan | hero | 16° between cards. Sway ±2°. Drag 0.12° per px after 6px. Snap spring 180 / 26 / mass 0.9. Entrance 1.6s. |
| RotatingRole | hero | Text changes every 2.8s with a 0.4s slide. Shows the first role when reduced. |
| Outline cycle | hero name | 7s loop. Letters offset by 0.12s. Outline at 40 to 60%. |
| Hero bar | hero name | scaleY 0 to 1 over 1.2s. |
| Rise | hero rows, caption | 0.9s, y 18px to 0 with a fade. Delay set per element. The caption replays when the card changes. |
| Marquee | ticker | 40s linear loop. |
| Aurora | contact glow | 14s ease-in-out. Drifts 48px and 36px, scale 1.08. |
| Header backdrop | header | Opacity from scroll position, 0 to 96px. |
| Progress bar | header | scaleX from scroll progress. |
| Mobile menu | header | Fade and y −12px, 0.35s. |
| Timeline rail | experience | scaleY 0 to 1 over 1.8s, once. |
| Service hover | service cards | Lift 4px, deeper shadow, 0.5s. Motion-safe only. |

### 9.3 Auto-moving content must be pausable

- Anything that moves or changes by itself for more than five seconds needs a visible pause control (WCAG 2.2.2). The ticker has one.
- The role rotator, the outline cycle, and the fan's sway also run continuously and have no pause yet. Decide the approach at the start. Recommended: one "pause motion" control that stops every loop. Build it before launch.

### 9.4 Performance

- Keep motion in the client components listed in section 10. Don't make whole pages client components.
- Test loops in a real browser at 375px and 1440px. Watch for jank whenever a new loop is added.

## 10. Components and the client boundary

| Component | Type | Notes |
|---|---|---|
| `layout.tsx`, `page.tsx`, `Hero`, `Footer`, `Ticker`, `About`, `Services`, `Work`, `ProjectCard`, `Experience`, `Contact` | Server | Import client pieces where needed. |
| `Navbar`, `PointerSpotlight`, `ProjectFan`, `RotatingRole`, `PausableMarquee`, `TimelineRail` | Client | Interactive leaves. |
| `Reveal`, `TiltCard`, `MagneticLink` | Client (`ui/`) | Shared motion wrappers. |
| `ui/icons.ts` | Client re-export | See below. |

- Put `"use client"` on the smallest component that needs it.
- **Icons:** Phosphor calls `React.createContext` on import, which breaks when a Server Component imports it directly. Import every icon from `@/components/ui/icons`, and add new names there. Check that a name exists in the installed version before using it.
- Phosphor weights: `bold` for UI controls, `duotone` for feature icons, `fill` for small decorative marks.

## 11. Metadata, SEO, structured data

- `layout.tsx` metadata: `metadataBase` from `siteUrl`. Title `"{name} | {headline}"` with the template `"%s | {name}"`. Description. Canonical `/`. Robots index and follow. Open Graph (`website`, `en_US`). Twitter `summary_large_image`.
- JSON-LD `Person` in the layout: name, url, description, `jobTitle` (array), `sameAs` from the social links (skip the "website" entry), and an address. The layout already escapes `<` in the JSON. Keep every field true to the visible page. A `LegalService` or `Attorney` type can be used once the owner confirms the details.
- Social image: `opengraph-image.tsx`, 1200×630, prerendered from profile data. Its colours must match the tokens in 8.1.
- `robots.ts` allows all and points at `sitemap.xml`. `sitemap.ts` lists the home URL only. `lastModified` is omitted because of prerendering.
- `not-found.tsx` is titled "Page not found" and links home.
- Headings: one `h1` (the name), an `h2` per section, and `h3` for items. Link text is descriptive. Every image has alt text.
- Local search: once the owner confirms them, put the city and practice area in the description and headings.

## 12. Security

- Headers come from `next.config.ts` (section 6.2). Check them after every build (section 13.3).
- No forms or user input today. A contact or consultation form needs an approved design first: client and server validation with React Hook Form and Zod, a Server Action or route handler, a honeypot field, rate limiting, an email provider, and no personal data in logs. The form posts to the same origin, so it stays within `form-action 'self'`.
- Images: `next/image` with local paths only. A remote host needs an `images.remotePatterns` entry for that exact hostname and a CSP `img-src` update.
- Links that open a new tab always carry `rel="noopener noreferrer"`.
- Production builds don't publish source maps. Keep it that way.
- Secrets: none in the repository. Any future secret goes in Vercel environment variables.
- Dependencies: run `npm audit` at each release. Accepted today: five high advisories in dev-only lint tooling (`braces` and `fast-glob`, through `eslint-config-next`), with no non-breaking fix. Don't run `npm audit fix --force`, which downgrades `eslint-config-next` to a major version.
- Personal data: publish only what the owner approves. Leave out a home address, personal phone, and personal email unless she asks for them.

## 13. Testing and verification

### 13.1 Build gates (in order)

1. `npm run lint`
2. `npm run typecheck` (run `npx next typegen` first on a fresh clone)
3. `npm run build`. The routes `/`, `/_not-found`, `/opengraph-image`, `/robots.txt`, and `/sitemap.xml` should all show as static.

### 13.2 Browser checks

Sizes: 375×812 (phone), about 800px wide (narrow laptop or tablet), 1366×768 (laptop), and 1440×900 (desktop). Run each in light and dark.

- Console: no errors and no CSP violations.
- No horizontal scroll at 375px: `document.documentElement.scrollWidth` equals `innerWidth`.
- Hero: the paragraph and CTAs don't touch the fan at about 800px or at 1366×768.
- Header: the underline follows the section in view. The mobile menu opens, closes on Escape and on link choice, and returns focus to the toggle.
- Ticker: the pause button toggles `data-paused` and the track's `animation-play-state`.
- Keyboard: Tab through the header, hero CTAs, fan arrows, project links, and contact links. The focus ring is visible.
- Every image loads.

### 13.3 Security checks (after `npm run build` and `npm run start`)

```bash
curl -sI http://localhost:3000/ | grep -iE "content-security|x-frame|x-content|referrer|permissions|x-powered"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/does-not-exist
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/_next/image?url=https%3A%2F%2Fexample.com%2Fx.png&w=384&q=75"
```

Expected: the CSP and the other headers are present, `X-Powered-By` is absent, the 404 and 405 responses come back, and the external image URL returns 400.

### 13.4 Content review

- Every fact in `profile.ts` must come from the owner or a source that can be checked. Have the owner read the final copy before launch.
- Click every link. Check dates, titles, and spelling.

### 13.5 Test scope

The template has no unit or end-to-end tests. Add Vitest or Playwright only after approval. If approved, start with the pure helpers: `spansFullRow`, `buildFanItems`, and `resolveSiteUrl`.

## 14. Git and delivery

- Branch names: `feature/<topic>`, `fix/<topic>`, `chore/<topic>`. Lowercase, with hyphens. Never commit to `main`.
- Conventional commits: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`. One logical change per commit. Each commit must lint, type-check, and build. Examples: `feat(hero): stagger the entrance`, `fix(navbar): close the menu on Escape`, `docs: update the content guide`.
- Pull request description: summary, changes, testing performed, screenshots (desktop and mobile) for UI work, breaking changes, and future improvements. Squash and merge.
- Push and open pull requests only when asked.

## 15. Adapting the template to a new person

0. **Start a clean repository.** Don't keep the original `.git` history or its remote. Run `git init`, then make the first commit on `main`. Remove the previous person's images from `public/`, and remove their social links.
1. `package.json`: rename `name`. Update the README title and description.
2. `src/lib/site.ts`: navigation links (labels, and hrefs that match section ids), the header CTA label, and the primary CTA label.
3. `src/data/profile.ts`: all copy, roles, location, portrait, about facts, ticker items, services, projects, experience, education, and socials. Search for `TODO` until none remain.
4. `src/types/profile.ts`: change types only if the content model changes (see the mapping below). Update the icon unions and the `serviceIcons` and `socialIcons` maps to match.
5. Images: replace `public/images/*` and `public/projects/*`. Keep the aspect ratios. Write real alt text.
6. `src/app/layout.tsx`: JSON-LD `jobTitle` and `sameAs`. Viewport colours, if the palette changes.
7. `src/app/opengraph-image.tsx`: text and colours (the colours must match the tokens).
8. `src/app/globals.css`: change tokens only if the owner wants a different palette. Re-check contrast in both schemes, and update the OG colours to match.
9. `.env.example` and Vercel: `NEXT_PUBLIC_SITE_URL`.
10. `src/components/sections/Contact.tsx`: copy, labels, and the availability line.
11. `docs/architecture.md`: replace the old decisions with the new ones.
12. Run the checks in section 13.

**Recommended first change:** move the headings and paragraphs still hardcoded in components (for example "What I do", "Selected work", "Experience", and the contact heading and paragraph) into `profile.ts`. Then all visible copy lives in one file.

### Suggested content mapping for a law practice

| Template item | Suggested use for a law practice |
|---|---|
| `services` (four offerings) | Practice areas (3 to 5), each with a short description |
| `projects` (website case studies with screenshots) | Publications, speaking, or awards, each with an image and a link. Case details only with written client consent, and only where her regulator allows it |
| `agency` (brand card in the hero fan) | Firm or chambers name, if she has one |
| `roles` | Professional titles she confirms, such as the courts she practises in |
| `about.facts` | Based in, admitted to, languages, focus areas |
| `experience` | Career and appointments |
| `education` | Degrees, bar admissions with years, certifications |
| `socials` | Professional profiles: LinkedIn, a bar or regulator directory listing (if one lists her), a firm listing |
| `Contact` | Office address, phone, email, and a consultation call-to-action that she approves |

## 16. Decisions to confirm before building

Ask the owner about these first. Each one changes the design or the code.

1. **Hero visual.** The card fan shows website screenshots, and a law practice may have none. Options: (a) text cards for practice areas, in the brand-card style on a surface colour; (b) a portrait-led hero with no fan. Choose before the copy is written.
2. **Persistent motion.** Approve the pause approach (section 9.3).
3. **Contact method.** Email, phone, address, a map, a messaging link, or a consultation form. A form needs approval and server work (section 12).
4. **Advertising and client content.** Check her regulator's rules on advertising, testimonials, fees, and naming clients. Decide which matter or case information can be shown, and whether written consent is needed. Ask whether her regulator expects a disclaimer; she or her firm supplies the wording.
5. **Language.** English only, or a second language too. The current fonts (Archivo and Geist, Latin subset) can't display Arabic-script text. A second language needs a font that covers it, loaded through `next/font`.
6. **Photograph.** A professional portrait at least 1200px tall, with her consent to publish it, and alt text.
7. **Domain and public details.** The domain, and which contact details go public.

## 17. Known pitfalls (learned on the original portfolio)

- **Hero collisions.** Stacked hero rows pushed the CTAs into the fan on mid-size laptops. Check about 800px and 1366×768 after every hero change.
- **Showcase screenshots.** Never publish a screenshot of a loading or error state. Check the live page in a browser first, and crop only to real content.
- **Live dependencies.** A showcased product with a broken API shows its failure to visitors. Check the card's link and the product's main feature before publishing.
- **Headless capture.** A headless browser can take a screenshot before the page finishes loading. Use a longer virtual time budget, and check the image.
- **Browser pane.** It doesn't render frames until something forces one, such as a screenshot. Intersection observers and animations can look stalled when read from JavaScript alone.
- **Tailwind v4.** A pseudo-element needs `after:content-['']`. `scale-x-*` uses the CSS `scale` property.
- **`cacheComponents`.** `new Date()` and `Math.random()` break prerendering. The footer has no year, and the sitemap has no `lastModified`.
- **Generated types.** `LayoutProps` appears after a build or `npx next typegen`.
- **Work grid.** The full-row logic assumes an even count of single cells. If card types change (for example, to make image or URL optional), keep that logic working.
- **Fan density.** Each added project adds a card. Check nine or more cards at 1366×768 and at 375px.
- **Hardcoded headings.** Some headings live in components. Move them into the content file.

## 18. Definition of done

- All copy is verified by the owner, and no `TODO` remains.
- The build gates and browser checks in section 13 pass, and the security checks in 13.3 pass.
- Light and dark modes, reduced motion, and the keyboard path have been checked.
- Metadata, the social image, and `NEXT_PUBLIC_SITE_URL` are set for the deployment.
- `docs/architecture.md` and the README match the final build.
