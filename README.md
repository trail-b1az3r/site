# Rayla / trail-b1az3r — personal [site](https://trail-b1az3r.github.io/site/)

A personal lab notebook: small language models, the HyperNix training toolkit,
and Beat Saber Quest mods. Vite + React + TypeScript, deployed to GitHub Pages.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview
```

## Design

The site is an editorial "personal lab": warm black and paper themes, a
signal-red accent, a hairline grid, mono metadata, oversized Space Grotesk
display type and Instrument Serif italic accents. The hand-drawn HyperNix mark
in `public/media/hnx-31c-mini.png` is the one on the model card.

- Fonts: Space Grotesk (display), Inter (body), Instrument Serif (accents) and
  JetBrains Mono (labels/data), all self-hosted through Fontsource.
- Design tokens live at the top of `src/styles.css`.
- Motion: hero line reveals, scroll reveals, a ticker, the loss bars, the
  contribution heatmap and radar, page transitions, a view-transition theme
  toggle and a full-screen index overlay. Everything respects
  `prefers-reduced-motion: reduce`.
- The full-screen index is the small "Index" button in the nav; it traps focus,
  closes on Escape and restores focus to its trigger.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, latest public signals, selected work, model spotlight, activity, live services, off-the-clock, links |
| `/ai` | Model spotlight for `hyperNix-3.1-mini_c`, the base model, and every other public model |
| `/services` | Browser-side status and endpoints for the SideStore Anisette server and the HyperNix T1 API |
| `/projects` | Flagships plus a searchable/filterable list of public repositories |
| `/projects/:slug` | Project facts, stats, topics and a rendered README excerpt |
| `/timeline` | Releases, YouTube uploads and models in date order |
| `/github` | Profile, 12-month radar, contributions, languages and recent events |
| `/youtube`, `/steam`, `/about`, `/resume`, `/knowledge`, `/links` | The rest |

## Live services

`/services` reports two real services running on the home desktop, and the Home
page repeats their status as a strip. The status is measured from the visitor's
browser at page load; if the desktop is asleep, the page says "no answer" rather
than pretending.

| Service | Public endpoint | Local unit |
|---|---|---|
| Anisette v3 (SideStore signing helper) | `https://blazeindustries.taile82951.ts.net/anisette` | `anisette-v3.service` · `:6969` |
| HyperNix T1 API | `https://blazeindustries.taile82951.ts.net` | `hypernix-t1.service` · `:8001` |

- A Caddy relay (`caddy-relay.service`, `:8088`) strips the `/anisette` prefix
  and proxies it to the Anisette process; every other path goes to T1. Tailscale
  Funnel publishes that relay on `https://blazeindustries.taile82951.ts.net`
  and terminates TLS.
- LAN and tailnet paths stay unproxied: `100.109.195.71:8001` for T1 and
  `100.109.195.71:6969` for Anisette. Neither is routed publicly.
- Public T1 requests are classified as public. `/health`, `/version`, `/status`
  and `/models` answer without a key; inference and administration do not.
- `public/servers.json` is the list SideStore can subscribe to:
  `https://trail-b1az3r.github.io/site/servers.json`. The Anisette endpoint is
  the direct server URL.
- Endpoints, versions and host facts live in `src/data/services.ts`, not in the
  page. Change them there when a unit or version moves.
- The public hostname is a Tailscale Funnel on the tailnet's own `ts.net`
  domain. The Funnel is managed by tailscaled, not by a user unit; inspect it
  with `tailscale funnel status`. It is a desktop, not a cloud region: when the
  machine sleeps or reboots, both services go with it. There is no SLA, and no
  secret or Apple account credential is part of this repository.

## The featured model

`hyperNix-3.1-mini_c` is a 48.7M-parameter chat tune of
[`Compactbot/hypernix-3.1-mini`](https://huggingface.co/Compactbot/hypernix-3.1-mini),
trained with HyperNix on 440,871 smol-smoltalk examples. Best chat validation
loss was 2.6645, down from 6.9494 untuned. Apache-2.0.

The base model, [`HyperNix.3-mini`](https://huggingface.co/ray0rf1re/HyperNix.3-mini),
is 48.7M parameters pretrained from random init on 0.87B tokens with a custom
32,000-token BPE vocabulary — one GTX 1080, 12 days and 3 hours.

Facts shown on the site come from the Hugging Face model cards and the GitHub
repositories; nothing about training runs or hardware is invented. Model and
project metadata lives in `src/data/featured.ts` so it stays next to its source
links.

## Live data

- **Browser, live:** GitHub repos/profile/events, Hugging Face models, YouTube
  (public RSS via rss2json).
- **Build-time snapshot:** `scripts/fetch-data.mjs` runs before `dev` and
  `build` and writes `src/data/live.json` with the GitHub contribution calendar,
  the 12-month GitHub activity counts behind the radar chart (commits, PRs
  opened and merged, issues, reviews, new repos), Steam profile counts, releases
  and the YouTube feed. The activity counts use the GitHub search API; set
  `GITHUB_TOKEN` to avoid its unauthenticated rate limit. Each source fails
  independently and keeps its last snapshot, so a blocked request never breaks a
  build. Run `npm run fetch-data` to refresh manually.
- `.github/workflows/refresh-data.yml` runs `npm run fetch-data` every day and
  commits `src/data/live.json` if it changed. Run it by hand from the Actions tab
  with *Run workflow*.
- `.github/workflows/deploy.yml` rebuilds and deploys to GitHub Pages on every
  push and daily (06:00 UTC), so the published numbers are at most a day old.
- YouTube: the RSS feed is tried first. When YouTube returns 404 for it (it has
  been doing so), the script reads the channel's `/videos` page instead. Dates
  from that page are approximate, because the page only shows "N days ago". If
  the repo is a user site (`<user>.github.io`), change `VITE_BASE` to `/`.
- Release counts shown as "stable" only include full releases and patches;
  release candidates, betas, dev builds and nightlies are left out.

## Configuration

- `VITE_BASE` — base path for sub-path hosting, e.g. `VITE_BASE=/my-repo/ npm run build`.
- `VITE_YOUTUBE_CHANNEL_ID` — optional override; defaults to the @Rmcgugan channel ID.

## Notes

- Featured repos: `src/services/github.ts`. Featured models:
  `src/data/featured.ts`. Profile links: `src/data/profiles.ts`.
- Résumé: skills, and any experience or education, live in
  `src/data/resume.ts`. Empty lists hide their section.
- The README excerpt on project pages is rendered by
  `src/components/Markdown.tsx` (a small, HTML-free Markdown subset), not
  injected as raw HTML.
- The build copies `index.html` to `404.html` so deep links work on GitHub Pages.
