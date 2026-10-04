const TTL = 10 * 60 * 1000
export function readCache<T>(k: string, allowStale = false): T | null {
  try {
    const raw = localStorage.getItem('rb:' + k)
    if (!raw) return null
    const { t, d } = JSON.parse(raw)
    return allowStale || Date.now() - t < TTL ? (d as T) : null
  } catch { return null }
}
export function writeCache(k: string, d: unknown) {
  try { localStorage.setItem('rb:' + k, JSON.stringify({ t: Date.now(), d })) } catch { /* storage unavailable */ }
}
