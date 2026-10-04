import type { Repo, GhUser, GhEvent } from '../types'
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
