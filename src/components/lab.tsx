import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Download, Heart } from 'lucide-react'
import type { Activity, HfModel, RawRelease, Video } from '../types'
import type { ModelMeta, ProjectMeta } from '../data/featured'
import { ago, num, params } from '../lib/format'
import { useInView } from './scroll'

const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export function SectionHead({ n, title, note, id }: { n: string; title: string; note?: string; id?: string }) {
  return (
    <header className="shead">
      <span className="shead-n" aria-hidden="true">{n}</span>
      <h2 id={id}>{title}</h2>
      {note && <p className="shead-note">{note}</p>}
    </header>
  )
}

export function Ticker({ items }: { items: string[] }) {
  const set = (k: number) => (
    <div className="ticker-set" key={k} aria-hidden={k > 0}>
      {items.map((t, i) => (
        <span key={`${k}-${i}`}><i aria-hidden="true">✳</i>{t}</span>
      ))}
    </div>
  )
  return <div className="ticker" aria-label={items.join(', ')}><div className="ticker-track">{set(0)}{set(1)}</div></div>
}

export function LocalClock({ label = 'local time' }: { label?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <span className="clock" title={label}><span className="clock-dot" aria-hidden="true" />{time}</span>
}

interface SignalProps {
  model?: HfModel | null
  release?: RawRelease | null
  video?: Video | null
  activity?: Activity | null
  contributions?: { total: number; days: { date: string; level: number; count: number }[] } | null
  releases: number
  snapshot?: string
}

function Sparkline({ days }: { days: { count: number }[] }) {
  const [ref, seen] = useInView<SVGSVGElement>()
  const points = useMemo(() => {
    const weeks: number[] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7).reduce((s, d) => s + d.count, 0))
    const tail = weeks.slice(-26)
    const max = Math.max(1, ...tail)
    return tail.map((v, i) => [4 + (i / Math.max(1, tail.length - 1)) * 292, 56 - (v / max) * 48] as const)
  }, [days])
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const area = `${line} L${last?.[0] ?? 296} 60 L4 60 Z`
  return (
    <svg ref={ref} className={`spark ${seen ? 'in' : ''}`} viewBox="0 0 300 64" role="img" aria-label="Weekly GitHub contributions, last 26 weeks">
      <path className="spark-fill" d={area} />
      <path className="spark-line" d={line} pathLength={1} />
      {last && <circle className="spark-end" cx={last[0]} cy={last[1]} r="3" />}
    </svg>
  )
}

export function SignalPanel({ model, release, video, activity, contributions, releases, snapshot }: SignalProps) {
  const p = params(model?.safetensors?.total) ?? '48.7M'
  return (
    <aside className="panel signal" aria-label="Latest public signals">
      <div className="panel-head">
        <span className="mono">Signals</span>
        <span className="signal-state"><i className="live-dot" aria-hidden="true" />public data</span>
      </div>
      <div className="signal-rows">
        <div className="signal-row">
          <span className="signal-k">Model</span>
          <span className="signal-v">{model?.id.split('/')[1] ?? 'hyperNix-3.1-mini_c'}</span>
          <span className="signal-m">{p} params{model?.downloads !== undefined ? ` · ${num(model.downloads)} downloads` : ''}</span>
        </div>
        <div className="signal-row">
          <span className="signal-k">Release</span>
          <span className="signal-v">{release?.tag_name ?? '—'}</span>
          <span className="signal-m">HyperNix-pip · {when(release?.published_at)}</span>
        </div>
        <div className="signal-row">
          <span className="signal-k">Upload</span>
          <span className="signal-v signal-title">{video?.title ?? 'Beat Saber on YouTube'}</span>
          <span className="signal-m">{when(video?.published)}</span>
        </div>
        <div className="signal-row">
          <span className="signal-k">Activity</span>
          <span className="signal-v tabular">{contributions ? contributions.total.toLocaleString() : '—'} <small>contributions</small></span>
          <span className="signal-m tabular">{activity ? `${num(activity.commits)} commits` : '— commits'} · {releases} stable</span>
        </div>
      </div>
      {contributions?.days?.length ? <Sparkline days={contributions.days} /> : null}
      <div className="panel-foot">
        <span>Snapshot {when(snapshot)}</span>
        <span>GitHub / HF / YouTube</span>
      </div>
    </aside>
  )
}

export function LossBars({ before, after, caption }: { before: number; after: number; caption: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const max = Math.ceil(before)
  return (
    <div ref={ref} className={`loss ${seen ? 'in' : ''}`} role="img" aria-label={`${caption} ${before} before, ${after} after`}>
      <div className="loss-head"><span className="mono">Chat validation loss</span><span className="mono">lower is better</span></div>
      <div className="loss-plot">
        <div className="loss-bar before" style={{ ['--h' as string]: `${(before / max) * 100}%` }}><span className="loss-val">{before.toFixed(4)}</span><span className="loss-fill" /><span className="loss-label">untuned</span></div>
        <div className="loss-bar after" style={{ ['--h' as string]: `${(after / max) * 100}%` }}><span className="loss-val">{after.toFixed(4)}</span><span className="loss-fill" /><span className="loss-label">chat-tuned</span></div>
      </div>
      <p className="loss-cap">{caption}</p>
    </div>
  )
}

function TerminalVisual() {
  return (
    <div className="terminal" aria-hidden="true">
      <div className="term-bar"><i /><i /><i /><span>hnx</span></div>
      <pre><span className="term-p">$</span> hnx download --latest{'\n'}<span className="term-o">→ HyperNix.3.1-mini</span>{'\n'}<span className="term-p">$</span> hnx-t1 runner start latest{'\n'}<span className="term-o">→ runner registered</span><span className="caret" /></pre>
    </div>
  )
}

function ShaderVisual() {
  const nodes = ['PC bundle', 'DXBC', 'GLSL', 'Quest']
  return (
    <div className="shader" aria-hidden="true">
      <div className="shader-top"><span className="mono">on the headset</span><span className="shader-badge">1.40.8</span></div>
      <div className="shader-flow">
        {nodes.map((n, i) => (
          <div className="shader-step" key={n} style={{ ['--i' as string]: i }}>
            <span>{n}</span>
            {i < nodes.length - 1 && <i className="shader-link"><b /></i>}
          </div>
        ))}
      </div>
      <p className="shader-note">convert · translate · draw</p>
    </div>
  )
}

export function WorkRow({ index, project, repo, stars, forks }: {
  index: number
  project: ProjectMeta
  repo?: { description: string | null; language: string | null; stargazers_count: number; forks_count: number } | null
  stars?: number
  forks?: number
}) {
  const [ref, seen] = useInView<HTMLAnchorElement>()
  const s = stars ?? repo?.stargazers_count ?? 0
  const f = forks ?? repo?.forks_count ?? 0
  const hasStats = !!repo || stars !== undefined || forks !== undefined
  return (
    <Link ref={ref} to={`/projects/${project.slug}`} className={`work-row ${seen ? 'in' : ''}`}>
      <span className="work-n mono" aria-hidden="true">{String(index).padStart(2, '0')}</span>
      <div className="work-main">
        <p className="kicker">{project.kicker}</p>
        <h3>{project.name}</h3>
        <p className="work-desc">{project.summary}</p>
        <ul className="work-facts">{project.facts.map(f => <li key={f}>{f}</li>)}</ul>
        <p className="work-foot mono">
          <span>{hasStats ? `${s} stars · ${f} forks${repo?.language ? ` · ${repo.language}` : ''}` : 'Public on GitHub'}</span>
          <span className="work-go">Open the project <ArrowUpRight size={15} aria-hidden="true" /></span>
        </p>
      </div>
      <div className="work-visual">{project.visual === 'terminal' ? <TerminalVisual /> : <ShaderVisual />}</div>
    </Link>
  )
}

export function ModelSpotlight({ name, model, meta }: { name: string; model?: HfModel | null; meta: ModelMeta }) {
  const [ref, seen] = useInView<HTMLElement>()
  const href = `https://huggingface.co/${model?.id ?? `ray0rf1re/${name}`}`
  return (
    <article ref={ref} className={`spotlight ${seen ? 'in' : ''}`}>
      <div className="spot-mark">
        <div className="spot-label mono"><span>Latest model</span><span>01</span></div>
        <img src={`${import.meta.env.BASE_URL}media/hnx-31c-mini.png`} alt="Hand-drawn HyperNix 3.1C mini logo" width={476} height={198} loading="lazy" />
        <p className="spot-stamp mono">48.7M params · Apache-2.0</p>
        <p className="spot-credit">The mark, as drawn for the model card.</p>
      </div>
      <div className="spot-body">
        <p className="kicker">{meta.kind}</p>
        <h3><span>{name}</span><span className="spot-caret" aria-hidden="true">_</span></h3>
        <p className="spot-summary">{meta.summary}</p>
        {meta.loss && <LossBars {...meta.loss} />}
        <dl className="specs">
          {meta.specs.map(s => <div key={s.k}><dt>{s.k}</dt><dd>{s.v}</dd></div>)}
        </dl>
        <p className="spot-note">{meta.note}</p>
        <div className="spot-meta mono">
          {model?.downloads !== undefined && <span><Download size={13} aria-hidden="true" /> {num(model.downloads)} downloads</span>}
          {model?.likes !== undefined && <span><Heart size={13} aria-hidden="true" /> {num(model.likes)} likes</span>}
          {model?.lastModified && <span>updated {ago(model.lastModified)}</span>}
        </div>
        <div className="row">
          <a className="btn" href={href} target="_blank" rel="noreferrer">Read the model card <ArrowUpRight size={15} aria-hidden="true" /></a>
          <Link className="btn ghost" to="/ai">All models <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  )
}
