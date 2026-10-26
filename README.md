# Nayab Anjum Babar | Portfolio

Single-page portfolio for Nayab Anjum Babar. Built with Next.js 16, React 19, Tailwind CSS v4, and Motion. The working rules and design standard are in [CLAUDE.md](CLAUDE.md).

Content is not final. Every fact the owner has not confirmed is marked `TODO` in `src/data/profile.ts`. The site should not launch until none remain.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run format` | Format the project with Prettier |

## Editing content

All visible copy lives in `src/data/profile.ts`, including section headings (`sections`). Navigation and button labels live in `src/lib/site.ts`.

- Portrait: `public/images/portrait-placeholder.png` is a neutral stand-in. Replace it with an approved professional portrait at least 1200px tall, and write its alt text.
- Experience and education: leave the arrays empty to hide the section.
- Publications, talks, and awards: `projects` takes an image, a link, and tags for each item. While it is empty, the section shows its empty message.
- Deployment: set `NEXT_PUBLIC_SITE_URL` to the full site address before deploying, for example `https://example.com`. Any other value fails the build with a clear message.

## Motion

One control in the header pauses every looping effect: the role rotator, the hero letters, the card fan's sway, the ticker, and the contact glow. Reduced-motion users get the static layout with no loops.

## Structure

```
src/
  app/          routes, metadata, OG image, sitemap, robots
  components/
    layout/     navbar, footer, motion pause provider and toggle, cursor spotlight
    sections/   hero with the card fan, ticker, about, services, work, experience, contact
    ui/         reveal, tilt card, magnetic link, timeline rail, icon re-exports
  data/         all visible content
  hooks/        section tracking, rotating text, motion pause
  lib/          site URL, navigation links, and CTA labels
  types/        content types
```

Rendering and motion decisions are described in [docs/architecture.md](docs/architecture.md).
