import { useInView } from './scroll'
interface Day { date: string; level: number; count: number }
export default function Contributions({ days, total }: { days: Day[]; total: number }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const weeks: Day[][] = []
  days.forEach((d, i) => { if (i % 7 === 0) weeks.push([]); weeks[weeks.length - 1].push(d) })
  return (
    <div ref={ref} className={`heat ${seen ? 'in' : ''}`} role="img" aria-label={`Contribution graph: ${total.toLocaleString()} contributions in the last year`}>
      <div className="heatgrid">{weeks.map((w, c) => (
        <div key={c} className="heatcol">{w.map(d => <i key={d.date} className="cell" data-l={d.level} style={{ ['--c' as string]: c }} title={`${d.count} on ${d.date}`} />)}</div>))}</div>
      <p className="muted"><b className="tabular">{total.toLocaleString()}</b> contributions in the last year, from GitHub's public contribution calendar.</p>
    </div>
  )
}
