import { useFetch } from '../hooks/useFetch'
import { getVideos, YT_URL } from '../services/youtube'
import { ErrorState, Page, Seo, Skeleton } from '../components/ui'
import { live } from '../data/live'
const when = (p: string) => new Date(p.includes('T') ? p : p.replace(' ', 'T') + 'Z').toLocaleDateString('en', { dateStyle: 'medium' })
export default function YouTubePage() {
  const { data, loading } = useFetch('videos', getVideos)
  const videos = data?.length ? data : live.youtube.videos
  return (
    <Page title="YouTube" lead={`${live.youtube.name} (@Rmcgugan): Arcaea, art and other uploads, plus an interest in ML and AI.`}>
      <Seo title="YouTube" desc="Latest videos from the @Rmcgugan YouTube channel." />
      <p><a className="btn" href={YT_URL} target="_blank" rel="noreferrer">Visit the channel</a></p>
      {videos.length ? (
        <div className="grid three">{videos.map(v => (
          <a key={v.id} className="card video" href={v.url} target="_blank" rel="noreferrer"><img src={v.thumb} alt="" loading="lazy" /><h3>{v.title}</h3>
            {v.published && <p className="muted">{when(v.published)}</p>}</a>))}</div>
      ) : loading ? <Skeleton n={3} /> : <ErrorState href={YT_URL} label="YouTube" />}
    </Page>)
}
