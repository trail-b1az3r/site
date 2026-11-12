import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getRepos, GH_USER, isFeatured } from '../services/github'
import { FeaturedProjectCard, ProjectCard } from '../components/cards'
import { ErrorState, Page, Seo, Skeleton } from '../components/ui'

export default function Projects() {
  const { data, loading, failed } = useFetch('repos', getRepos)
  const [q, setQ] = useState(''), [lang, setLang] = useState('all'), [sort, setSort] = useState('updated')
  const langs = useMemo(() => [...new Set((data ?? []).map(r => r.language).filter(Boolean) as string[])].sort(), [data])
  const list = useMemo(() => (data ?? []).filter(r => !isFeatured(r.name))
    .filter(r => (lang === 'all' || r.language === lang) && `${r.name} ${r.description ?? ''}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'stars' ? b.stargazers_count - a.stargazers_count : sort === 'name' ? a.name.localeCompare(b.name) : +new Date(b.pushed_at) - +new Date(a.pushed_at)), [data, q, lang, sort])
  return (
    <Page title="Projects" lead="Public repositories from GitHub. The main ones i have not abandoned come first; the rest are searchable below.">
      <Seo title="Projects" desc="Public GitHub repositories by trail-b1az3r, including HyperNix and Vivify [for] Quest." />
      <div className="grid two">{FEATURED.map(f => <FeaturedProjectCard key={f.name} {...f} repo={data?.find(r => r.name.toLowerCase() === f.name.toLowerCase())} />)}</div>
      <p className="muted">Release history is on the <Link to="/timeline">timeline</Link>. Vivify Quest is also documented on its <Link to="/projects/vivify-quest">project page</Link>.</p>
      <div className="list-head">
        <h2>All repositories</h2>
        {!loading && !failed && <span className="mono">{list.length} public repos</span>}
      </div>
      <form className="filters" onSubmit={e => e.preventDefault()} role="search">
        <input type="search" placeholder="Search repositories" aria-label="Search repositories" value={q} onChange={e => setQ(e.target.value)} />
        <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value)}><option value="all">All languages</option>{langs.map(l => <option key={l}>{l}</option>)}</select>
        <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}><option value="updated">Recently updated</option><option value="stars">Most stars</option><option value="name">Name</option></select>
      </form>
      {loading ? <Skeleton n={6} /> : failed ? <ErrorState href={`https://github.com/${GH_USER}?tab=repositories`} label="GitHub" />
        : list.length ? <div className="grid three repo-grid">{list.map(r => <ProjectCard key={r.id} r={r} />)}</div> : <p className="muted">No repositories match those filters.</p>}
    </Page>)
}
