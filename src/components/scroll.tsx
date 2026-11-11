import { useEffect, useRef, useState, type ReactNode } from 'react'
export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
export function useInView<T extends Element>(threshold = 0.12) {
  const ref = useRef<T>(null); const [seen, set] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced() || !('IntersectionObserver' in window)) { set(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect() } }, { threshold, rootMargin: '0px 0px -4% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return <div ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>{children}</div>
}
export function CountUp({ to, format }: { to: number; format?: (n: number) => string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(); const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduced()) { setV(to); return }
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 900); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref} className="tabular">{format ? format(v) : v.toLocaleString()}</span>
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
/** Soft light that follows the pointer inside the hero. Desktop pointers only. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
        el.style.setProperty('--spot', '1')
      })
    }
    const leave = () => el.style.setProperty('--spot', '0')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])
  return ref
}
export function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const f = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (ref.current) ref.current.style.transform = `translateY(${Math.min(scrollY, 900) * 0.22}px)` }) }
    addEventListener('scroll', f, { passive: true })
    return () => { removeEventListener('scroll', f); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="herogrid" aria-hidden="true" />
}
export function useScrollDirection(threshold = 180) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = scrollY, raf = 0
    const f = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = scrollY
        if (Math.abs(y - last) > 8) setHidden(y > last && y > threshold)
        last = y
      })
    }
    addEventListener('scroll', f, { passive: true })
    return () => { removeEventListener('scroll', f); cancelAnimationFrame(raf) }
  }, [threshold])
  return hidden
}
