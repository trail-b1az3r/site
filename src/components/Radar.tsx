import { live } from '../data/live'
import { ago, num } from '../lib/format'
import type { Activity } from '../types'

export interface RadarAxis { label: string; value: number }

const SIZE = 400, C = SIZE / 2, R = 112
const RINGS = [0.25, 0.5, 0.75, 1]

/** Radar (spider) chart. Square-root scale shared by all axes, so small counts stay visible. */
export function Radar({ axes, title }: { axes: RadarAxis[]; title: string }) {
  const n = axes.length, max = Math.max(1, ...axes.map(a => a.value))
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const at = (i: number, k: number) => [C + R * k * Math.cos(angle(i)), C + R * k * Math.sin(angle(i))] as const
  const scale = (v: number) => Math.sqrt(v / max)
  const ring = (k: number) => axes.map((_, i) => at(i, k).join(',')).join(' ')
  const shape = axes.map((a, i) => at(i, scale(a.value)).join(',')).join(' ')
  return (
    <figure className="radar">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${title}: ${axes.map(a => `${a.label} ${num(a.value)}`).join(', ')}`}>
        {RINGS.map(k => <polygon key={k} className="ring" points={ring(k)} />)}
        {axes.map((a, i) => { const [x, y] = at(i, 1); return <line key={a.label} className="spoke" x1={C} y1={C} x2={x} y2={y} /> })}
        <polygon className="shape" points={shape} />
        {axes.map((a, i) => { const [x, y] = at(i, scale(a.value)); return <circle key={a.label} className="dot" cx={x} cy={y} r={3.5} /> })}
        {axes.map((a, i) => {
          const [x, y] = at(i, 1.19), anchor = Math.abs(x - C) < 4 ? 'middle' : x < C ? 'end' : 'start'
          return <text key={a.label} x={x} y={y} textAnchor={anchor} dominantBaseline="middle">{a.label}</text>
        })}
      </svg>
      <figcaption className="muted">Outer ring = {num(max)}. Square-root scale, shared by all axes.</figcaption>
    </figure>
  )
}

export function activityAxes(a: Activity): RadarAxis[] {
  return [
    { label: 'Commits', value: a.commits },
    { label: 'PRs opened', value: a.pullsOpened },
    { label: 'PRs merged', value: a.pullsMerged },
    { label: 'Issues', value: a.issuesOpened },
    { label: 'Reviews', value: a.reviews },
    { label: 'New repos', value: a.reposCreated },
  ]
}

/** GitHub activity radar from the build-time snapshot (see scripts/fetch-data.mjs). */
export function ActivityRadar({ legend = true }: { legend?: boolean }) {
  const a = live.activity ?? null
  if (!a) return <p className="notice" role="status">The GitHub activity snapshot is filled in by the next site build.</p>
  const axes = activityAxes(a)
  return (
    <div className="activity">
      <Radar axes={axes} title="GitHub activity, last 12 months" />
      {legend && <dl className="legend">{axes.map(x => <div key={x.label}><dt>{x.label}</dt><dd className="tabular">{num(x.value)}</dd></div>)}</dl>}
      <p className="muted small">Last 12 months, from {a.since}. Snapshot taken {ago(a.fetchedAt)}.</p>
    </div>
  )
}
