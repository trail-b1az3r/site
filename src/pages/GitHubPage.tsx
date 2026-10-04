import { useFetch } from '../hooks/useFetch'
import { FEATURED, getEvents, getRepos, getUser, GH_USER } from '../services/github'
import { FeaturedProjectCard, ProjectCard } from '../components/cards'
import { ErrorState, Page, Seo, Skeleton, Stat } from '../components/ui'
import Contributions from '../components/Contributions'
import { Reveal } from '../components/scroll'
import { live } from '../data/live'
import { ago, num } from '../lib/format'
export default function GitHubPage() {
  const user = useFetch('user', getUser), repos = useFetch('repos', getRepos), ev = useFetch('events', getEvents)
  const langs = Object.entries((repos.data ?? []).reduce<Record<string, number>>((a, r) => (r.language ? { ...a, [r.language]: (a[r.language] ?? 0) + 1 } : a), {})).sort((a, b) => b[1] - a[1])
  const total = langs.reduce((s, [, n]) => s + n, 0)
  const profile = `https://github.com/${GH_USER}`
  return (
    <Page title="GitHub" lead="Profile overview and recent activity.">
      <Seo title="GitHub" desc="GitHub profile overview for trail-b1az3r: repositories, languages and recent activity." />
      {user.loading ? <Skeleton n={1} /> : user.data ? (
        <div className="card userbox"><img src={user.data.avatar_url} alt={`${user.data.login} avatar`} width={88} height={88} loading="lazy" />
          <div><h2>{user.data.name ?? user.data.login}</h2>{user.data.bio && <p>{user.data.bio}</p>}
            <div className="statrow"><Stat k="Public repositories" v={user.data.public_repos} /><Stat k="Followers" v={num(user.data.followers)} /></div>
            <a className="btn" href={profile} target="_blank" rel="noreferrer">Open profile</a></div></div>) : <ErrorState href={profile} label="GitHub" />}
      <h2>Flagship repositories</h2>
      <div className="grid two">{FEATURED.map(f => <FeaturedProjectCard key={f.name} {...f} repo={repos.data?.find(r => r.name.toLowerCase() === f.name.toLowerCase())} />)}</div>
      {live.contributions && <><h2>Contributions in the last year</h2><Reveal><Contributions {...live.contributions} /></Reveal></>}
      <h2>Languages across public repositories</h2>
      {repos.loading ? <Skeleton n={1} /> : langs.length ? <Reveal><ul className="bars">{langs.map(([l, n]) => <li key={l}><span>{l}</span><i style={{ width: `${(n / total) * 100}%` }} /><b>{n}</b></li>)}</ul></Reveal> : <ErrorState href={profile} label="GitHub" />}
      <h2>Recently updated</h2>
      {repos.loading ? <Skeleton n={3} /> : repos.data?.length ? <div className="grid three">{repos.data.slice(0, 6).map(r => <ProjectCard key={r.id} r={r} />)}</div> : <ErrorState href={profile} label="GitHub" />}
      <h2>Recent activity</h2>
      {ev.loading ? <Skeleton n={1} /> : ev.data?.length ? <ul className="feed">{ev.data.map(e => <li key={e.id}><b>{e.type.replace('Event', '')}</b> in {e.repo.name}<span className="muted"> {ago(e.created_at)}</span></li>)}</ul> : <ErrorState href={profile} label="GitHub" />}
    </Page>)
}
