import type { Video } from '../types'
export const YT_URL = 'https://www.youtube.com/@Rmcgugan'
// Public channel ID (not a secret). Override with VITE_YOUTUBE_CHANNEL_ID if needed.
export const YT_CHANNEL_ID = (import.meta.env.VITE_YOUTUBE_CHANNEL_ID as string | undefined) ?? 'UC92jmFxND8iRU_t5I_ULbEQ'
export async function getVideos(): Promise<Video[]> {
  if (!YT_CHANNEL_ID) throw new Error('no channel id')
  const feed = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`
  const r = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
  if (!r.ok) throw new Error(String(r.status))
  const j = await r.json()
  if (!Array.isArray(j.items) || !j.items.length) throw new Error('empty')
  return j.items.slice(0, 9).map((i: { guid: string; title: string; pubDate: string; thumbnail: string; link: string }) =>
    ({ id: i.guid, title: i.title, published: i.pubDate, thumb: i.thumbnail, url: i.link }))
}
