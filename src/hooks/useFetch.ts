import { useEffect, useState } from 'react'
import { readCache, writeCache } from '../lib/cache'
export interface Res<T> { data: T | null; loading: boolean; failed: boolean; stale: boolean }
export function useFetch<T>(key: string, load: () => Promise<T>): Res<T> {
  const [s, set] = useState<Res<T>>(() => { const c = readCache<T>(key); return { data: c, loading: !c, failed: false, stale: false } })
  useEffect(() => {
    if (readCache<T>(key)) return
    let off = false
    load().then(d => { writeCache(key, d); if (!off) set({ data: d, loading: false, failed: false, stale: false }) })
      .catch(() => { const o = readCache<T>(key, true); if (!off) set({ data: o, loading: false, failed: !o, stale: !!o }) })
    return () => { off = true }
  }, [key]) // eslint-disable-line
  return s
}
export function useTheme() {
  const [t, setT] = useState(() => document.documentElement.dataset.theme || 'dark')
  const toggle = (origin?: { clientX: number; clientY: number }) => {
    const n = t === 'dark' ? 'light' : 'dark'
    const apply = () => { setT(n); document.documentElement.dataset.theme = n; try { localStorage.setItem('theme', n) } catch { /* ignore */ } }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    const motion = typeof matchMedia === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doc.startViewTransition && motion) {
      document.documentElement.style.setProperty('--vt-x', `${origin?.clientX ?? innerWidth / 2}px`)
      document.documentElement.style.setProperty('--vt-y', `${origin?.clientY ?? innerHeight / 2}px`)
      doc.startViewTransition(apply)
    } else apply()
  }
  return { theme: t, toggle }
}
