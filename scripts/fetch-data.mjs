// Build-time data snapshot: GitHub contributions, Steam profile counts, YouTube feed.
// Runs before dev/build. Each source fails independently and keeps its previous snapshot.
import { readFileSync, writeFileSync } from 'node:fs'
const OUT = 'src/data/live.json'
const GH = 'trail-b1az3r', YT_ID = 'UC92jmFxND8iRU_t5I_ULbEQ', STEAM = 'transgenderfireball'
let prev = {}
try { prev = JSON.parse(readFileSync(OUT, 'utf8')) } catch { /* first run */ }
const get = async (u) => {
  const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (personal site build script)' }, signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`${u} -> ${r.status}`)
  return r.text()
}
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

async function contributions() {
  const h = await get(`https://github.com/users/${GH}/contributions`)
  const tips = {}
  for (const m of h.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) tips[m[1]] = m[2]
  const days = []
  for (const m of h.matchAll(/<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g)) {
    const t = tips[m[2]] ?? ''
    days.push({ date: m[1], level: +m[3], count: /^No /.test(t) ? 0 : +(t.match(/^(\d+)/)?.[1] ?? 0) })
  }
  if (!days.length) throw new Error('no contribution cells found')
  days.sort((a, b) => a.date.localeCompare(b.date))
  return { total: days.reduce((s, d) => s + d.count, 0), days }
}
async function steam() {
  const h = await get(`https://steamcommunity.com/id/${STEAM}`)
  const name = dec(h.match(/class="actual_persona_name">([^<]+)</)?.[1] ?? '')
  if (!name) throw new Error('no steam profile data (private or layout changed)')
  const counts = {}
  for (const m of h.matchAll(/count_link_label">([^<]+)<\/span>[\s\S]{0,60}?profile_count_link_total">\s*([\d,]+)/g)) counts[m[1].trim()] = +m[2].replace(/,/g, '')
  return {
    ...prev.steam, name, counts: Object.keys(counts).length ? counts : prev.steam?.counts ?? {},
    avatar: h.match(/property="og:image" content="([^"]+)"/)?.[1] ?? prev.steam?.avatar,
    level: +(h.match(/friendPlayerLevelNum">(\d+)</)?.[1] ?? prev.steam?.level ?? 0) || undefined,
    fetchedAt: new Date().toISOString(),
  }
}
async function youtube() {
  const x = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_ID}`)
  const videos = [...x.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 9).map((m) => {
    const e = m[1], id = e.match(/<yt:videoId>([^<]+)</)?.[1]
    return { id, title: dec(e.match(/<title>([^<]*)</)?.[1] ?? ''), published: e.match(/<published>([^<]+)</)?.[1], thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url: `https://www.youtube.com/watch?v=${id}` }
  }).filter((v) => v.id)
  return { ...prev.youtube, channelId: YT_ID, videos }
}
const jobs = { contributions, steam, youtube }
const res = await Promise.allSettled(Object.values(jobs).map((f) => f()))
const out = { ...prev, generatedAt: new Date().toISOString() }
Object.keys(jobs).forEach((k, i) => {
  if (res[i].status === 'fulfilled') { out[k] = res[i].value; console.log(`[data] ${k}: ok`) }
  else console.log(`[data] ${k}: kept previous snapshot (${res[i].reason?.message ?? 'failed'})`)
})
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
