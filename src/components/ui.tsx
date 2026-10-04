import { useEffect, type ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { CountUp } from './scroll'
function meta(sel: string, attr: string, val: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(sel)
  if (!el) { el = create(); document.head.appendChild(el) }
  el.setAttribute(attr, val)
}
export function Seo({ title, desc }: { title: string; desc: string }) {
  useEffect(() => {
    const full = title === 'Home' ? 'Rayla (trail-b1az3r) — software, AI and language models' : `${title} — Rayla`
    document.title = full
    const m = (name: string, key: 'name' | 'property') => meta(`meta[${key}="${name}"]`, 'content', '', () => { const e = document.createElement('meta'); e.setAttribute(key, name); return e })
    const set = (name: string, key: 'name' | 'property', v: string) => { m(name, key); document.head.querySelector(`meta[${key}="${name}"]`)?.setAttribute('content', v) }
    set('description', 'name', desc); set('og:title', 'property', full); set('og:description', 'property', desc)
    set('twitter:title', 'name', full); set('twitter:description', 'name', desc)
    meta('link[rel="canonical"]', 'href', location.origin + location.pathname, () => { const e = document.createElement('link'); e.setAttribute('rel', 'canonical'); return e })
  }, [title, desc])
  return null
}
export const Skeleton = ({ n = 3 }: { n?: number }) => (
  <div className="grid" aria-busy="true" aria-label="Loading">{Array.from({ length: n }, (_, i) => <div key={i} className="card skel" />)}</div>
)
export function ErrorState({ href, label }: { href: string; label: string }) {
  return <p className="notice" role="status">Live data unavailable — <a href={href} target="_blank" rel="noreferrer">view {label} directly <ExternalLink size={14} aria-hidden /></a></p>
}
export const Stat = ({ k, v }: { k: string; v: ReactNode }) => <div className="stat"><b>{typeof v === 'number' ? <CountUp to={v} /> : v}</b><span>{k}</span></div>
export const Page = ({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) => (
  <div className="wrap"><header className="phead"><h1>{title}</h1>{lead && <p className="lead">{lead}</p>}</header>{children}</div>
)
