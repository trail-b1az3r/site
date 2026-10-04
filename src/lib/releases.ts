import type { RawRelease } from '../types'
export type Kind = 'full' | 'patch'
export interface Rel { tag: string; date: string; url: string; kind: Kind; body: string }

/** Full release: v1.2.3. Patch: v1.2.3.post4 or v1.2.3-4. Everything else (rc, beta, alpha, dev, nightly) is left out. */
export function classify(tag: string): Kind | null {
  if (/^v\d+\.\d+\.\d+$/.test(tag)) return 'full'
  if (/^v\d+\.\d+\.\d+(\.post\d+|-\d+)$/.test(tag)) return 'patch'
  return null
}
export function toReleases(raw: RawRelease[]): Rel[] {
  const out: Rel[] = []
  for (const r of raw) {
    const kind = classify(r.tag_name)
    if (kind && !r.draft && !r.prerelease) out.push({ tag: r.tag_name, date: r.published_at, url: r.html_url, kind, body: r.body ?? '' })
  }
  return out.sort((a, b) => +new Date(b.date) - +new Date(a.date))
}
const NOISE = /^(chore: (refresh|update)|auto-update|nightly:)|stat-bot|update json stats|\[skip ci\]/i
/** Pulls the useful commit lines out of a release body, skipping automated housekeeping commits. */
export function highlights(body: string) {
  const since = body.match(/since the last stable release \(`([^`]+)`\)/)?.[1]
  const items = body.split('\n').filter(l => /^\s*[-*] /.test(l))
    .map(l => l.replace(/^\s*[-*] /, '').replace(/\s*\(?[0-9a-f]{7,9}\)?\s*$/, '').replace(/`/g, '').trim()).filter(Boolean)
  const useful = items.filter(i => !NOISE.test(i))
  return { since, total: items.length, items: useful.slice(0, 6), more: Math.max(0, useful.length - 6) }
}
