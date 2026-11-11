import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../hooks/useFetch'
import { useScrollDirection } from './scroll'
import { LocalClock } from './lab'
import { PROFILES } from '../data/profiles'
import { live } from '../data/live'
import { num } from '../lib/format'
import { toReleases } from '../lib/releases'

const LINKS: [string, string][] = [
  ['/', 'Home'], ['/about', 'About'], ['/resume', 'Résumé'], ['/projects', 'Projects'], ['/ai', 'Models'], ['/services', 'Services'],
  ['/timeline', 'Timeline'], ['/github', 'GitHub'], ['/youtube', 'YouTube'], ['/knowledge', 'Knowledge'],
  ['/steam', 'Steam'], ['/links', 'Links'],
]
const PRIMARY = LINKS.slice(0, 6)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const hidden = useScrollDirection()
  const { pathname } = useLocation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    let focusTimer = 0
    const focusClose = (tries = 0) => {
      const el = closeRef.current
      if (!el) return
      el.focus()
      if (document.activeElement !== el && tries < 20) focusTimer = window.setTimeout(() => focusClose(tries + 1), 50)
    }
    focusTimer = window.setTimeout(() => focusClose(), 50)
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab') return
      const root = document.getElementById('site-index')
      if (!root) return
      const f = [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null)
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [open])

  const close = () => { setOpen(false); triggerRef.current?.focus() }

  const overlay = createPortal(
    <div id="site-index" className="index" data-open={open} role="dialog" aria-modal="true" aria-label="Site index" aria-hidden={!open}>
      <div className="index-top wrap">
        <span className="mono">Index · 00—11</span>
        <button ref={closeRef} className="icon index-close" type="button" onClick={close} aria-label="Close index"><X size={18} /></button>
      </div>
      <div className="index-body wrap">
        <nav className="index-nav" aria-label="All pages">
          {LINKS.map(([to, label], i) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close} style={{ ['--i' as string]: i }}>
              <span className="index-i mono">{String(i).padStart(2, '0')}</span>
              <span className="index-label">{label}</span>
              <ArrowUpRight className="index-arrow" size={22} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
        <aside className="index-side">
          <div>
            <p className="mono index-h">Elsewhere</p>
            {PROFILES.map(p => <a key={p.id} href={p.href} target="_blank" rel="noreferrer">{p.name}<span className="mono">{p.handle}</span></a>)}
          </div>
          <div>
            <p className="mono index-h">Signals</p>
            <p className="index-note">{live.activity ? `${num(live.activity.commits)} commits and ${num(live.activity.pullsMerged)} merged PRs in the last 12 months.` : 'Live public data from GitHub and Hugging Face.'}</p>
            <p className="index-note">{toReleases(live.releases ?? []).length} stable HyperNix-pip releases{live.releases?.[0] ? `, newest ${live.releases[0].tag_name}` : ''}.</p>
          </div>
          <div className="index-clock">
            <p className="mono index-h">Local</p>
            <LocalClock label="your local time" />
          </div>
        </aside>
      </div>
      <p className="index-foot wrap mono">Rayla / trail-b1az3r · small models, ported worlds</p>
    </div>,
    document.body,
  )

  return (
    <>
      <header className={`nav ${hidden && !open ? 'nav-hidden' : ''}`}>
        <div className="wrap navin">
          <NavLink to="/" className="brand" onClick={close}>rayla<span className="brand-dot">.</span></NavLink>
          <span className="brand-sub mono">trail-b1az3r</span>
          <nav id="menu" aria-label="Main" className="main-nav">
            {PRIMARY.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'}>{t}</NavLink>)}
          </nav>
          <div className="nav-actions">
            <button className="icon theme-btn" onClick={e => toggle(e)} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button ref={triggerRef} className="index-open" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
              <Menu size={16} aria-hidden="true" /><span>Index</span>
            </button>
          </div>
        </div>
      </header>
      {overlay}
    </>
  )
}
