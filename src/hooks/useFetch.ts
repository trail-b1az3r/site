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
  const toggle = () => { const n = t === 'dark' ? 'light' : 'dark'; setT(n); document.documentElement.dataset.theme = n; try { localStorage.setItem('theme', n) } catch { /* ignore */ } }
  return { theme: t, toggle }
}
