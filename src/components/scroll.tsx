import { useEffect, useRef, useState, type ReactNode } from 'react'
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null); const [seen, set] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced() || !('IntersectionObserver' in window)) { set(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return <div ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}>{children}</div>
}
export function CountUp({ to }: { to: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(); const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduced()) { setV(to); return }
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 900); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref} className="tabular">{v.toLocaleString()}</span>
}
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const f = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const h = document.documentElement; ref.current?.style.setProperty('--p', String(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))) }) }
    f(); addEventListener('scroll', f, { passive: true }); addEventListener('resize', f)
    return () => { removeEventListener('scroll', f); removeEventListener('resize', f); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="progress" aria-hidden="true" />
}
export function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const f = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (ref.current) ref.current.style.transform = `translateY(${Math.min(scrollY, 900) * 0.28}px)` }) }
    addEventListener('scroll', f, { passive: true })
    return () => { removeEventListener('scroll', f); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="herogrid" aria-hidden="true" />
}
