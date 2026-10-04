import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { reduced, useInView } from './scroll'

export interface TItem {
  id: string; date: string; title: string; badge: string; tone: 'major' | 'minor'; href: string; linkLabel: string
  meta?: string; thumb?: string; lines?: string[]; note?: string
}
const fmt = (d: string) => new Date(d).toLocaleDateString('en', { dateStyle: 'medium' })

function Row({ it }: { it: TItem }) {
  const [ref, seen] = useInView<HTMLLIElement>()
  const [hover, setHover] = useState(false), [kbd, setKbd] = useState(false), [pin, setPin] = useState(false)
  const open = hover || kbd || pin
  const body = 'tl-' + it.id.replace(/\W/g, '_')
  return (
    <li ref={ref} className={`tl-item reveal ${seen ? 'in' : ''} ${it.tone} ${open ? 'open' : ''}`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={e => { if (e.target.matches(':focus-visible')) setKbd(true) }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKbd(false) }}>
      <span className="tl-node" aria-hidden="true" />
      <div className="tl-card">
        <button type="button" className="tl-head" aria-expanded={open} aria-controls={body} onClick={() => setPin(p => !p)}>
          <time dateTime={it.date}>{fmt(it.date)}</time>
          <strong>{it.title}</strong>
          <span className="tl-badge">{it.badge}</span>
        </button>
        <div className="tl-body" id={body}><div><div className="tl-inner">
          {it.thumb && <img className="tl-thumb" src={it.thumb} alt="" loading="lazy" />}
          {it.meta && <p className="muted">{it.meta}</p>}
          {!!it.lines?.length && <ul>{it.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>}
          {it.note && <p className="muted">{it.note}</p>}
          <a href={it.href} target="_blank" rel="noreferrer">{it.linkLabel} <ExternalLink size={13} aria-hidden /></a>
        </div></div></div>
      </div>
    </li>
  )
}

export default function Timeline({ items }: { items: TItem[] }) {
  const ol = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const el = ol.current
    if (!el) return
    if (reduced()) { el.style.setProperty('--fill', '100%'); return }
    let raf = 0
    const f = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--fill', (Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / Math.max(1, r.height))) * 100).toFixed(1) + '%')
    }) }
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f); cancelAnimationFrame(raf) }
  }, [items.length])
  let year = ''
  return (
    <ol className="tl" ref={ol}>
      {items.flatMap(it => {
        const y = it.date.slice(0, 4), out = []
        if (y !== year) { year = y; out.push(<li key={'y' + y} className="tl-year">{y}</li>) }
        out.push(<Row key={it.id} it={it} />)
        return out
      })}
    </ol>
  )
}
