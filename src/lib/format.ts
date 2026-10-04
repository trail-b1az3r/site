export const num = (n = 0) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)
export function params(n?: number) {
  if (!n) return null
  return n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(0) + 'M' : num(n)
}
export function ago(iso?: string) {
  if (!iso) return 'unknown'
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const u: [number, string][] = [[31536000, 'year'], [2592000, 'month'], [86400, 'day'], [3600, 'hour'], [60, 'minute']]
  for (const [sec, name] of u) if (s >= sec) { const v = Math.floor(s / sec); return `${v} ${name}${v > 1 ? 's' : ''} ago` }
  return 'just now'
}
