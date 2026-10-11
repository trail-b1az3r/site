# Rayla / trail-b1az3r — personal [site](https://trail-b1az3r.github.io/site/)

Vite + React + TypeScript. Live data from the public GitHub and Hugging Face APIs, cached in `localStorage` for 10 minutes with stale fallback. No secrets are used or needed.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview
```

## Live data
- **Browser, live:** GitHub repos/profile/events, Hugging Face models, YouTube (public RSS via rss2json).
- **Build-time snapshot:** `scripts/fetch-data.mjs` runs before `dev` and `build` and writes `src/data/live.json` with the GitHub contribution calendar, the 12-month GitHub activity counts behind the radar chart (commits, PRs opened and merged, issues, reviews, new repos), Steam profile counts, releases and the YouTube feed. The activity counts use the GitHub search API; set `GITHUB_TOKEN` to avoid its unauthenticated rate limit. Each source fails independently and keeps its last snapshot, so a blocked request never breaks a build. Run `npm run fetch-data` to refresh manually.
- `.github/workflows/refresh-data.yml` runs `npm run fetch-data` every day and commits `src/data/live.json` if it changed. Run it by hand from the Actions tab with *Run workflow*.
- `.github/workflows/deploy.yml` rebuilds and deploys to GitHub Pages on every push and daily (06:00 UTC), so the published numbers are at most a day old.
- YouTube: the RSS feed is tried first. When YouTube returns 404 for it (it has been doing so), the script reads the channel's `/videos` page instead. Dates from that page are approximate, because the page only shows "N days ago". If the repo is a user site (`<user>.github.io`), change `VITE_BASE` to `/`.

## Configuration
- `VITE_BASE` — base path for sub-path hosting, e.g. `VITE_BASE=/my-repo/ npm run build`.
- `VITE_YOUTUBE_CHANNEL_ID` — optional override; defaults to the @Rmcgugan channel ID.

## Notes
- Design tokens (colors, Inter and JetBrains Mono) follow the HyperNix docs site; edit them at the top of `src/styles.css`.
- Featured repos: `src/services/github.ts`. Featured models: `src/services/huggingface.ts`. Profile links: `src/data/profiles.ts`.
- Résumé: skills, and any experience or education, live in `src/data/resume.ts`. Empty lists hide their section.
- Radar chart: `src/components/Radar.tsx`, fed by `activity` in `live.json`.
- The build copies `index.html` to `404.html` so deep links work on GitHub Pages.


