import type { Repo, GhUser, GhEvent, RawRelease } from '../types'
export const GH_USER = 'trail-b1az3r'
export const FEATURED = [{ name: 'HyperNix-pip', slug: 'hypernix-pip' }, { name: 'vivify-quest', slug: 'vivify-quest' }]
export const isFeatured = (n: string) => FEATURED.some(f => f.name.toLowerCase() === n.toLowerCase())
async function gh(path: string, accept = 'application/vnd.github+json'): Promise<Response> {
  const r = await fetch('https://api.github.com' + path, { headers: { Accept: accept } })
  if (!r.ok) throw new Error(String(r.status))
  return r
}
export const getUser = async () => (await gh(`/users/${GH_USER}`)).json() as Promise<GhUser>
export const getRepos = async () => (await gh(`/users/${GH_USER}/repos?per_page=100&sort=pushed`)).json() as Promise<Repo[]>
export const getEvents = async () => (await gh(`/users/${GH_USER}/events/public?per_page=10`)).json() as Promise<GhEvent[]>
export const getReadme = async (name: string) => (await gh(`/repos/${GH_USER}/${name}/readme`, 'application/vnd.github.raw+json')).text()
export async function getReleases(): Promise<RawRelease[]> {
  const out: RawRelease[] = []
  for (let page = 1; page <= 5; page++) {
    const list = (await (await gh(`/repos/${GH_USER}/${FEATURED[0].name}/releases?per_page=100&page=${page}`)).json()) as RawRelease[]
    for (const r of list) if (!r.draft && !r.prerelease) out.push({ tag_name: r.tag_name, published_at: r.published_at, html_url: r.html_url, prerelease: false, draft: false, body: (r.body ?? '').slice(0, 1800) })
    if (list.length < 100) break
  }
  return out
}
