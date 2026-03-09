# Factopedia Landing Page

A premium, cinematic landing page for the Factopedia YouTube channel — featuring advanced Framer Motion animations, parallax scrolling, animated knowledge particles, and interactive fact cards.

## Overview

Factopedia publishes fascinating facts from around the world (History, Science, Culture, Animals, Plants, World Mysteries, News Facts) with a new video every day at 9:00 AM.

## Architecture

- **Frontend**: React + TypeScript, Vite dev server
- **Backend**: Express.js (serves static + API, currently no custom routes needed)
- **Styling**: TailwindCSS + shadcn/ui components
- **Animation**: Framer Motion (parallax, scroll-reveal, spring physics, AnimatePresence)
- **Routing**: Wouter
- **Fonts**: Space Grotesk (body), Oxanium (display headings)

## Key Pages

- `/` → `client/src/pages/home.tsx` — Full cinematic Factopedia landing page

## Landing Page Sections

1. **Navbar** — Sticky with backdrop blur on scroll, mobile-responsive hamburger menu
2. **Hero** — Animated particle canvas (WebGL-style 2D canvas), orbiting rings, floating icons, parallax scroll effect, cycling animated headline words
3. **Fact Ticker** — Live animated cycling "Did You Know?" facts strip
4. **Stats** — Animated counters (500+ videos, 365 days/year, 50K+ subscribers, 7 categories) with scroll-triggered count-up
5. **About** — Channel description, feature cards, interactive channel preview card with floating stat badges
6. **Categories** — 8 category cards (History, Science, Culture, Animals, Plants, World Mysteries, News Facts, World Curiosities) with hover lift + glow effects
7. **Videos** — 6 latest YouTube Shorts fetched dynamically from the channel API, with real thumbnails, view counts, Shorts badge, and play button overlay linking to youtube.com/shorts/
8. **Why Watch** — 6 reason cards with icons and animated micro-interactions
9. **Countdown** — Live real-time countdown to next 9:00 AM upload with animated digit transitions
10. **CTA** — Big subscribe section with YouTube branding, social proof stats, orbiting ring decorations
11. **Footer** — Branding, social links, category nav, contact info, copyright

## Design Tokens (Dark Mode — Factopedia Brand)

- **Background**: `hsl(222, 47%, 5%)` — Deep space blue-black
- **Primary**: `hsl(191, 100%, 50%)` — Electric cyan (Factopedia signature)
- **Chart-2**: `hsl(45, 95%, 58%)` — Golden yellow accent
- **Font**: Space Grotesk (sans), Oxanium (display)
- Grid background, radial glow effects, gradient text utilities in `index.css`

## Custom Utilities (index.css)

- `.gradient-text-cyan` / `.gradient-text-gold` / `.gradient-text-hero` — gradient text effects
- `.glow-cyan` / `.glow-cyan-sm` / `.glow-gold` — box-shadow glow effects
- `.grid-bg` — subtle grid pattern overlay
- `.card-glow-hover` — cyan border + glow on hover
- `.font-display` — Oxanium font

## Custom Animations (tailwind.config.ts)

- `float-slow/medium/fast` — floating elements
- `pulse-glow` — pulsing opacity+scale
- `particle-drift-1/2/3` — particle animation
- `spin-slow` — slow rotation
- `orbit` / `orbit-reverse` — orbiting elements
- `shimmer` — gradient shimmer effect

## Localization (i18n)

- **System**: Lightweight custom React context (`client/src/lib/i18n.tsx`) — no external library
- **Languages**: Bahasa Indonesia (default `"id"`) + English (`"en"`)
- **Usage**: `const { locale, setLocale, t } = useI18n()` — access translations as `t.section.key[locale]`
- **Persistence**: Locale saved to `localStorage` key `"factopedia-locale"`
- **Toggle**: Language button in Navbar (both desktop + mobile) showing "EN" / "ID"
- **Coverage**: All 11 sections fully translated — Navbar, Hero, FactTicker, Stats, About, Categories, Videos, WhyWatch, Countdown, CTA, Footer
- **Provider**: `<I18nProvider>` wraps the app in `App.tsx`

## YouTube Data API

- **Stats Endpoint**: `GET /api/youtube/stats` — returns `{ subscriberCount, videoCount, viewCount }`
- **Videos Endpoint**: `GET /api/youtube/videos` — returns latest 6 Shorts with `{ videoId, title, thumbnail, duration, viewCount, publishedAt, isShort }`
- **API Key**: `YOUTUBE_API_KEY` environment secret
- **Cache**: Server caches both stats and videos for 5 minutes to avoid rate limits
- **Channel**: `https://youtube.com/@Factopedia-ch`
- **Contact**: `factopedia.ch.id@gmail.com`

## Dependencies

All key packages already installed:
- `framer-motion` — animations
- `lucide-react` + `react-icons` — icons (SiYoutube for YouTube logo)
- `@tanstack/react-query`, `wouter`, all shadcn/ui components
