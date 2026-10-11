import { Link } from 'react-router-dom'
import { FEATURED, getRepos } from '../services/github'
import { FEATURED_MODELS, getModels } from '../services/huggingface'
import { useFetch } from '../hooks/useFetch'
import { ActivityRadar } from '../components/Radar'
import { Page, Seo } from '../components/ui'
import { PROFILES } from '../data/profiles'
import { RESUME } from '../data/resume'
import { live } from '../data/live'
import { num } from '../lib/format'
export default function Resume() {
  const repos = useFetch('repos', getRepos), models = useFetch('models', getModels)
  const key = (id: string) => id.split('/')[1]
  const primary = FEATURED_MODELS.map(n => models.data?.find(m => key(m.id) === n)).filter(Boolean) as NonNullable<typeof models.data>
  const releases = live.releases?.filter(r => /^v\d+\.\d+\.\d+$/.test(r.tag_name)).length
  return (
    <Page title="Résumé" lead={RESUME.summary}>
      <Seo title="Résumé" desc="Résumé for Rayla (trail-b1az3r): skills, projects, language models, and links." />
      <p className="row no-print"><button className="btn ghost" type="button" onClick={() => window.print()}>Print or save as PDF</button></p>

      <h2>Skills</h2>
      <dl className="topics">{RESUME.skills.map(s => <div key={s.area}><dt>{s.area}</dt><dd>{s.items.join(' · ')}</dd></div>)}</dl>

      {!!RESUME.experience.length && <><h2>Experience</h2>
        {RESUME.experience.map(e => <article key={e.role + e.org} className="card resume-item"><h3>{e.role}, {e.org}</h3><p className="muted">{e.period}</p><ul>{e.points.map(p => <li key={p}>{p}</li>)}</ul></article>)}</>}

      {!!RESUME.education.length && <><h2>Education</h2>
        {RESUME.education.map(e => <article key={e.what} className="card resume-item"><h3>{e.what}</h3><p className="muted">{e.where} · {e.period}</p></article>)}</>}

      <h2>Projects</h2>
      <div className="grid two">{FEATURED.map(f => {
        const r = repos.data?.find(x => x.name.toLowerCase() === f.name.toLowerCase())
        return <article key={f.name} className="card resume-item"><h3><Link to={`/projects/${f.slug}`}>{f.name}</Link></h3>
          <p>{r?.description ?? 'Details are on the project page.'}</p>
          {r && <p className="muted small">{num(r.stargazers_count)} stars · {r.language ?? 'mixed languages'}{!!releases && f.name === 'HyperNix-pip' ? ` · ${releases} full releases` : ''}</p>}
        </article>
      })}</div>

      <h2>Language models</h2>
      <div className="grid two">{primary.map(m => <article key={m.id} className="card resume-item"><h3><a href={`https://huggingface.co/${m.id}`} target="_blank" rel="noreferrer">{key(m.id)}</a></h3>
        <p className="muted small">{num(m.downloads)} downloads · {num(m.likes)} likes{m.pipeline_tag ? ` · ${m.pipeline_tag}` : ''}</p></article>)}</div>
      <p className="muted"><Link to="/ai">All models</Link>, including the experiments.</p>

      <h2>Activity</h2>
      <div className="card"><ActivityRadar /></div>

      <h2>Links</h2>
      <div className="grid four">{PROFILES.map(p => <a key={p.id} className="card profile" href={p.href} target="_blank" rel="noreferrer"><h3>{p.name}</h3><p className="muted">{p.handle}</p></a>)}</div>
    </Page>)
}
