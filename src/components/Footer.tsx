import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PROFILES } from '../data/profiles'
import { live } from '../data/live'

const PAGES: [string, string][] = [
  ['/projects', 'Projects'], ['/ai', 'Models'], ['/services', 'Services'], ['/timeline', 'Timeline'], ['/github', 'GitHub'],
  ['/youtube', 'YouTube'], ['/knowledge', 'Knowledge'], ['/steam', 'Steam'], ['/links', 'Links'],
]

export default function Footer() {
  const snap = live.generatedAt ? new Date(live.generatedAt).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' }) : null
  return (
    <footer className="foot">
      <div className="wrap">
        <p className="foot-line mono"><span>Small models</span><span>Ported worlds</span><span>Built in public</span></p>
        <div className="foot-grid">
          <div className="foot-brand">
            <Link to="/" className="foot-word">rayla<span>.</span></Link>
            <p>Software, small language models and Quest mods. Most of it is on GitHub and Hugging Face, and this site is the notebook.</p>
          </div>
          <nav className="foot-col" aria-label="Pages">
            <p className="mono">Pages</p>
            {PAGES.map(([to, t]) => <Link key={to} to={to}>{t}</Link>)}
          </nav>
          <div className="foot-col">
            <p className="mono">Elsewhere</p>
            {PROFILES.map(p => <a key={p.id} href={p.href} target="_blank" rel="noreferrer">{p.name} <ArrowUpRight size={12} aria-hidden="true" /></a>)}
          </div>
          <div className="foot-col foot-note">
            <p className="mono">This site</p>
            <p>React, TypeScript and Vite. Deployed on GitHub Pages. Numbers come from public GitHub, Hugging Face, Steam and YouTube pages.</p>
            <p className="mono">{snap ? `Snapshot ${snap}` : 'Snapshot refreshed daily'}</p>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Rayla. No analytics, no cookies, no accounts.</p>
          <button className="to-top mono" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  )
}
