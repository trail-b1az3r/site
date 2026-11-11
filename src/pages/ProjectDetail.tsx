import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getReadme, getRepos, GH_USER } from '../services/github'
import Markdown from '../components/Markdown'
import { ErrorState, Page, Seo, Skeleton, Stat } from '../components/ui'
import { ago, num } from '../lib/format'
import { PROJECT_META } from '../data/featured'
import NotFound from './NotFound'
const size = (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1)} MB` : `${kb} KB`
function excerpt(raw: string, from?: string, budget = 2600) {
  // Drop whole <details> trees first; their bodies are setup/log-help prose,
  // not a useful summary of the project.
  const withoutDetails = raw.replace(/<details[\s\S]*?<\/details>/gi, '')
  let body = withoutDetails
  if (from) {
    const start = withoutDetails.indexOf(from)
    if (start >= 0) {
      body = withoutDetails.slice(start)
      const next = body.indexOf('\n## ', from.length)
      if (next > 0) body = body.slice(0, next)
    }
  }
  const lines = body.split('\n').filter(l => {
    const t = l.trim()
    if (!t || /^(<|!\[|\[!\[|---|===|-#)/.test(t) || /^#\s+/.test(t)) return false
    // Drop shouty all-caps lines; in an excerpt they read as typos, not emphasis.
    const letters = t.replace(/[^A-Za-z]/g, '')
    const caps = (t.match(/[A-Z]/g) ?? []).length
    return !(letters.length > 16 && caps / letters.length > 0.8)
  })
  const kept: string[] = []
  let n = 0
  for (const line of lines) {
    if (n + line.length > budget) break
    kept.push(line)
    n += line.length + 1
  }
  // Embeds and shouty lines are stripped above; drop a heading left with nothing before the next one.
  return kept.filter((line, i) => {
    if (!/^#{1,6}\s/.test(line.trim())) return true
    return i + 1 < kept.length && !/^#{1,6}\s/.test(kept[i + 1].trim())
  }).join('\n')
}
function Body({ name }: { name: string }) {
  const repos = useFetch('repos', getRepos), readme = useFetch('readme:' + name, () => getReadme(name))
  const meta = PROJECT_META.find(p => p.name.toLowerCase() === name.toLowerCase())
  const r = repos.data?.find(x => x.name.toLowerCase() === name.toLowerCase())
  const text = excerpt(readme.data ?? '', meta?.readmeFrom)
  return (
    <Page title={name} lead={meta?.summary ?? r?.description ?? undefined}>
      <Seo title={name} desc={r?.description ?? `${name} on GitHub by ${GH_USER}.`} />
      {meta && <ul className="project-facts mono">{meta.facts.map(f => <li key={f}>{f}</li>)}</ul>}
      {repos.loading ? <Skeleton n={1} /> : r ? <>
        <div className="statrow"><Stat k="Stars" v={num(r.stargazers_count)} /><Stat k="Forks" v={num(r.forks_count)} /><Stat k="Open issues" v={r.open_issues_count} /><Stat k="Repo size" v={size(r.size)} /></div>
      </> : <ErrorState href={`https://github.com/${GH_USER}/${name}`} label="GitHub" />}
      <h2>From the README</h2>
      <div className="readme-layout">
        <div className="readme-main">
          {readme.loading ? <Skeleton n={1} /> : text ? <Markdown text={text} /> : <ErrorState href={`https://github.com/${GH_USER}/${name}#readme`} label="the README" />}
        </div>
        <aside className="readme-side">
          <p className="kicker">Repository</p>
          {r && <dl className="readme-facts">
            <div><dt>Language</dt><dd>{r.language ?? 'mixed'}</dd></div>
            <div><dt>Last push</dt><dd>{ago(r.pushed_at)}</dd></div>
            <div><dt>Open issues</dt><dd>{r.open_issues_count}</dd></div>
          </dl>}
          {!!r?.topics?.length && <div className="tags">{r.topics.map(t => <span key={t}>{t}</span>)}</div>}
          <p className="readme-note">A shortened excerpt. The full README, release notes and issue history stay on GitHub.</p>
          <div className="readme-actions">
            <a className="btn" href={`https://github.com/${GH_USER}/${name}#readme`} target="_blank" rel="noreferrer">Read the full README</a>
            <a className="btn ghost" href={`https://github.com/${GH_USER}/${name}`} target="_blank" rel="noreferrer">Open on GitHub</a>
          </div>
        </aside>
      </div>
    </Page>)
}
export default function ProjectDetail() {
  const f = FEATURED.find(x => x.slug === useParams().slug)
  return f ? <Body name={f.name} /> : <NotFound />
}
