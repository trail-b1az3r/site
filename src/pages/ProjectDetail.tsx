import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getReadme, getRepos, GH_USER } from '../services/github'
import { Stats } from '../components/cards'
import { ErrorState, Page, Seo, Skeleton, Stat } from '../components/ui'
import { num } from '../lib/format'
import NotFound from './NotFound'
function Body({ name }: { name: string }) {
  const repos = useFetch('repos', getRepos), readme = useFetch('readme:' + name, () => getReadme(name))
  const r = repos.data?.find(x => x.name.toLowerCase() === name.toLowerCase())
  const text = (readme.data ?? '').split('\n').filter(l => l.trim() && !/^(<|!\[|\[!\[)/.test(l.trim())).join('\n').slice(0, 1400)
  return (
    <Page title={name} lead={r?.description ?? undefined}>
      <Seo title={name} desc={r?.description ?? `${name} on GitHub by ${GH_USER}.`} />
      {repos.loading ? <Skeleton n={1} /> : r ? <>
        <div className="statrow"><Stat k="Stars" v={num(r.stargazers_count)} /><Stat k="Forks" v={num(r.forks_count)} /><Stat k="Open issues" v={r.open_issues_count} /><Stat k="Size (KB)" v={num(r.size)} /></div>
        <Stats r={r} />{!!r.topics?.length && <p className="tags">{r.topics.map(t => <span key={t}>{t}</span>)}</p>}</> : <ErrorState href={`https://github.com/${GH_USER}/${name}`} label="GitHub" />}
      <h2>From the README</h2>
      {readme.loading ? <Skeleton n={1} /> : text ? <pre className="readme">{text}{(readme.data ?? '').length > 1400 ? '…' : ''}</pre> : <ErrorState href={`https://github.com/${GH_USER}/${name}#readme`} label="the README" />}
      <p><a className="btn" href={`https://github.com/${GH_USER}/${name}`} target="_blank" rel="noreferrer">Open on GitHub</a></p>
    </Page>)
}
export default function ProjectDetail() {
  const f = FEATURED.find(x => x.slug === useParams().slug)
  return f ? <Body name={f.name} /> : <NotFound />
}
