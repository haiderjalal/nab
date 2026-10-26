# Architecture

Built from the portfolio template described in `CLAUDE.md`, adapted for a law practice (section 15 of that file).

## Rendering

- Next.js 16 App Router with Cache Components enabled. The home page prerenders to static HTML.
- Server Components are the default. Client components are limited to interactive leaves: the card fan, the motion wrappers, the navbar, the motion pause toggle, the rotating role, and the experience timeline rail.
- Visible copy comes from `src/data/profile.ts`, typed by `src/types/profile.ts`. Section headings are in `profile.sections`, so no visible section copy is hardcoded in components.
- With Cache Components, `new Date()` and `Math.random()` fail prerendering. The footer shows no year and the sitemap has no `lastModified` for this reason.

## Hero card fan

- `ProjectFan` is a client component. Each project is a card on an arc that pivots below the viewport. The brand card (the firm or chambers, or her name when there is no firm) sits in the centre, and the projects split evenly on either side.
- With no projects, the fan shows the brand card alone.
- Each card's pose is a motion value. Idle sway, drag, arrow keys, and the entrance animation update those values directly, so the fan does not re-render React while it moves.
- React state holds only the active card index, which changes once per card.
- The `.fan-stage` CSS variables size the cards and the arc from the viewport, so the arc stays on screen on phones and laptops.

## Motion

- Pointer and scroll effects use motion values (`useMotionValue`, `useSpring`, `useScroll`), so they never re-render React.
- Reveal, tilt, magnetic, spotlight, fan, and timeline effects all respect `prefers-reduced-motion`.
- The hero letters, the marquee, the hero entrance (`.rise`), and the contact glow (`.aurora`) are CSS-only, so they show before JavaScript loads. Each one is switched off under reduced motion by its own rule. The global `animation-duration: 0.01ms` override is deliberately not used.
- One pause control stops every loop (WCAG 2.2.2). `MotionPauseProvider` holds the state and sets `data-motion-paused` on `<html>`. CSS loops pause through that attribute, and script loops (the role rotator and the fan's sway) read the `useMotionPause` context. The control lives in the header, so it stays visible while the page scrolls.
- The entrance and caption transitions use `transform` and `opacity` only, so they stay on the compositor.

## Navigation

- The navbar underlines the section in the middle band of the viewport. `useActiveSection` runs one `IntersectionObserver` over the nav targets and sets `aria-current="location"`.
- Navigation labels are in `src/lib/site.ts`, listed in page order.
- Below `md`, a menu toggle opens the section links. It exposes `aria-expanded` and `aria-controls`, closes on Escape, and closes when a link is chosen.

## Security

- `next.config.ts` sends one set of headers for every route: a Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, a `Referrer-Policy`, and a `Permissions-Policy` that turns off camera, microphone, geolocation, payment, and USB.
- The policy keeps `'unsafe-inline'` for scripts and styles. Next.js hydration and the motion library's inline styles need it, and the site is prerendered, so per-request nonces are not available. The policy still blocks framing, plugins, `base-uri` changes, form posts to other origins, and any foreign script or stylesheet. `'unsafe-eval'` and `ws:` are added only in development.
- `poweredByHeader` is off, so the framework name is not sent.
- The image optimizer rejects external sources. Re-check this after any change to `next/image` remote patterns.
- `npm audit` reports five high-severity advisories through `eslint-config-next`, via `braces` and `fast-glob`. They are dev-only and never run on the deployed site. The only automated fix is a major downgrade of `eslint-config-next`, so it is deferred.

## Icons

Phosphor icons are re-exported from `src/components/ui/icons.ts`, a client module. Phosphor calls `createContext` when it loads, which the server component graph cannot evaluate. Server components import icons through this module.

## Decisions

- Socials: LinkedIn only. Other profiles, and personal email, phone, and address, wait for the owner's approval.
- No contact form, CMS, analytics, database, or auth. Each one needs approval first (CLAUDE.md, section 2).
- The portrait is a neutral placeholder silhouette until the owner approves a photograph.
- Hero visual: the card fan is kept for now. The owner has not yet chosen between text practice-area cards and a portrait-led hero (CLAUDE.md, section 16).
- Motion: one header control pauses every loop. This is the recommended approach in CLAUDE.md section 9.3 and awaits the owner's approval (section 16, item 2).
- HTTPS is provided by the hosting platform after deployment.
