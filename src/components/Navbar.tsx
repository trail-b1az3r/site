import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useFetch'
const LINKS = [['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/ai', 'AI / Models'], ['/github', 'GitHub'], ['/youtube', 'YouTube'], ['/knowledge', 'Knowledge'], ['/links', 'Links']]
export default function Navbar() {
  const [open, setOpen] = useState(false); const { theme, toggle } = useTheme()
  return (
    <header className="nav"><div className="wrap navin">
      <NavLink to="/" className="brand" onClick={() => setOpen(false)}>trail-b1az3r</NavLink>
      <nav id="menu" aria-label="Main" className={open ? 'open' : ''}>
        {LINKS.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{t}</NavLink>)}
      </nav>
      <button className="icon" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
      <button className="icon burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu" aria-label="Menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div></header>
  )
}
