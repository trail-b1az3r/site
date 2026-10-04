import { Link } from 'react-router-dom'
import { Star, GitFork, Download, Heart, Github, Youtube, Gamepad2, Boxes, ExternalLink } from 'lucide-react'
import type { Repo, HfModel } from '../types'
import { ago, num, params } from '../lib/format'
import { GH_USER } from '../services/github'

export const Stats = ({ r }: { r: Repo }) => (
  <p className="stats"><span><Star size={14} aria-label="stars" />{num(r.stargazers_count)}</span><span><GitFork size={14} aria-label="forks" />{num(r.forks_count)}</span>
    {r.language && <span>{r.language}</span>}<span>Updated {ago(r.pushed_at)}</span></p>
)
export const ProjectCard = ({ r }: { r: Repo }) => (
  <article className="card"><h3><a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a></h3>
    <p>{r.description ?? 'No description provided.'}</p><Stats r={r} />
    <p className="stats"><span>{r.open_issues_count} open issues</span><span>{num(r.size)} KB</span></p></article>
)
export function FeaturedProjectCard({ name, slug, repo }: { name: string; slug: string; repo?: Repo | null }) {
  return (
    <article className="flagship">
      <h3>{name}</h3>
      <p className="big">{repo ? repo.description ?? 'No description provided on GitHub.' : 'Live repository details are unavailable right now.'}</p>
      {repo && <Stats r={repo} />}
      <p className="row"><Link className="btn" to={`/projects/${slug}`}>Project details</Link>
        <a className="btn ghost" href={`https://github.com/${GH_USER}/${name}`} target="_blank" rel="noreferrer">Open on GitHub <ExternalLink size={14} aria-hidden /></a></p>
    </article>
  )
}
export function ModelCard({ m, primary }: { m: HfModel; primary?: boolean }) {
  const [author, name] = m.id.split('/'); const p = params(m.safetensors?.total)
  return (
    <article className={primary ? 'flagship' : 'card'}>
      <h3><a href={`https://huggingface.co/${m.id}`} target="_blank" rel="noreferrer">{name ?? m.id}</a></h3>
      <p className="muted">by {author}{m.pipeline_tag ? ` · ${m.pipeline_tag}` : ''}{p ? ` · ${p} parameters` : ''}</p>
      <p className="stats"><span><Download size={14} aria-label="downloads" />{num(m.downloads)}</span><span><Heart size={14} aria-label="likes" />{num(m.likes)}</span><span>Updated {ago(m.lastModified)}</span></p>
      {!!m.tags?.length && <p className="tags">{m.tags.slice(0, 5).map(t => <span key={t}>{t}</span>)}</p>}
    </article>
  )
}
const ICONS = { github: Github, hf: Boxes, youtube: Youtube, steam: Gamepad2 }
export function ProfileCard({ k, name, handle, href, desc }: { k: keyof typeof ICONS; name: string; handle: string; href: string; desc: string }) {
  const I = ICONS[k]
  return <a className={`card profile p-${k}`} href={href} target="_blank" rel="noreferrer"><I size={28} aria-hidden /><h3>{name}</h3><p className="muted">{handle}</p><p>{desc}</p></a>
}
