import { useMemo, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getRepos, GH_USER, isFeatured } from '../services/github'
import { FeaturedProjectCard, ProjectCard } from '../components/cards'
import { ErrorState, Page, Seo, Skeleton } from '../components/ui'
export default function Projects() {
  const { data, loading, failed } = useFetch('repos', getRepos)
  const [q, setQ] = useState(''), [lang, setLang] = useState('all'), [sort, setSort] = useState('updated'), [feat, setFeat] = useState(false)
  const langs = useMemo(() => [...new Set((data ?? []).map(r => r.language).filter(Boolean) as string[])].sort(), [data])
  const list = useMemo(() => (data ?? []).filter(r => !isFeatured(r.name))
    .filter(r => (lang === 'all' || r.language === lang) && `${r.name} ${r.description ?? ''}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'stars' ? b.stargazers_count - a.stargazers_count : sort === 'name' ? a.name.localeCompare(b.name) : +new Date(b.pushed_at) - +new Date(a.pushed_at)), [data, q, lang, sort])
  return (
    <Page title="Projects" lead="Public repositories from GitHub, with the two flagship projects first.">
      <Seo title="Projects" desc="Public GitHub repositories by trail-b1az3r, including HyperNix-pip and Vivify Quest." />
      <div className="grid two">{FEATURED.map(f => <FeaturedProjectCard key={f.name} {...f} repo={data?.find(r => r.name.toLowerCase() === f.name.toLowerCase())} />)}</div>
      <h2>All repositories</h2>
      <form className="filters" onSubmit={e => e.preventDefault()} role="search">
        <input type="search" placeholder="Search repositories" aria-label="Search repositories" value={q} onChange={e => setQ(e.target.value)} />
        <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value)}><option value="all">All languages</option>{langs.map(l => <option key={l}>{l}</option>)}</select>
        <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}><option value="updated">Recently updated</option><option value="stars">Most stars</option><option value="name">Name</option></select>
        <label><input type="checkbox" checked={feat} onChange={e => setFeat(e.target.checked)} /> Featured only</label>
      </form>
      {loading ? <Skeleton n={6} /> : failed ? <ErrorState href={`https://github.com/${GH_USER}?tab=repositories`} label="GitHub" />
        : feat ? <p className="muted">Showing only the flagship projects above.</p>
        : list.length ? <div className="grid three">{list.map(r => <ProjectCard key={r.id} r={r} />)}</div> : <p className="muted">No repositories match those filters.</p>}
    </Page>)
}
