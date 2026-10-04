# Rayla / trail-b1az3r — personal site

Vite + React + TypeScript. Live data from the public GitHub and Hugging Face APIs, cached in `localStorage` for 10 minutes with stale fallback. No secrets are used or needed.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview
```

## Live data
- **Browser, live:** GitHub repos/profile/events, Hugging Face models, YouTube (public RSS via rss2json).
- **Build-time snapshot:** `scripts/fetch-data.mjs` runs before `dev` and `build` and writes `src/data/live.json` with the GitHub contribution calendar, Steam profile counts and the YouTube feed. Each source fails independently and keeps its last snapshot, so a blocked request never breaks a build. Run `npm run fetch-data` to refresh manually.
- `.github/workflows/deploy.yml` rebuilds and deploys to GitHub Pages on every push and daily, which keeps the snapshots fresh. If the repo is a user site (`<user>.github.io`), change `VITE_BASE` to `/`.

## Configuration
- `VITE_BASE` — base path for sub-path hosting, e.g. `VITE_BASE=/my-repo/ npm run build`.
- `VITE_YOUTUBE_CHANNEL_ID` — optional override; defaults to the @Rmcgugan channel ID.

## Notes
- Design tokens (colors, Inter and JetBrains Mono) follow the HyperNix docs site; edit them at the top of `src/styles.css`.
- Featured repos: `src/services/github.ts`. Featured models: `src/services/huggingface.ts`. Profile links: `src/data/profiles.ts`.
- The build copies `index.html` to `404.html` so deep links work on GitHub Pages.
