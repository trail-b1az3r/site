import { useMemo, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getReleases, GH_USER } from '../services/github'
import { FEATURED_MODELS, getModels, HF_USER } from '../services/huggingface'
import { getVideos, YT_URL } from '../services/youtube'
import { highlights, toReleases } from '../lib/releases'
import { live } from '../data/live'
import { ago, num, params } from '../lib/format'
import Timeline, { type TItem } from '../components/Timeline'
import { ErrorState, Page, Seo, Skeleton, Stat } from '../components/ui'

type Tab = 'releases' | 'youtube' | 'models'
const TABS: [Tab, string][] = [['releases', 'HyperNix releases'], ['youtube', 'YouTube uploads'], ['models', 'Hugging Face models']]
const iso = (p: string) => (p.includes('T') ? p : p.replace(' ', 'T') + 'Z')
const byDate = (a: TItem, b: TItem) => +new Date(b.date) - +new Date(a.date)
const REPO = `https://github.com/${GH_USER}/${FEATURED[0].name}`

function Releases() {
  const { data, loading } = useFetch('releases', getReleases)
  const [kind, setKind] = useState<'all' | 'full' | 'patch'>('all')
  const all = useMemo(() => toReleases(data?.length ? data : live.releases ?? []), [data])
  const shown = all.filter(r => kind === 'all' || r.kind === kind)
  const items: TItem[] = shown.map((r): TItem => {
    const h = highlights(r.body)
    return {
      id: r.tag, date: r.date, title: r.tag, badge: r.kind === 'full' ? 'Full release' : 'Patch', tone: r.kind === 'full' ? 'major' : 'minor',
      href: r.url, linkLabel: 'Read the release notes', lines: h.items,
      note: h.items.length ? [h.more ? `+${h.more} more changes` : '', h.since ? `${h.total} commits since ${h.since}` : ''].filter(Boolean).join(' · ') : 'This release has no changelog summary. Open the release notes for details.',
    }
  })
  if (!all.length) return loading ? <Skeleton n={3} /> : <ErrorState href={`${REPO}/releases`} label="GitHub releases" />
  return (<>
    <div className="statrow"><Stat k="Full releases" v={all.filter(r => r.kind === 'full').length} /><Stat k="Patches" v={all.filter(r => r.kind === 'patch').length} /><Stat k="Latest" v={all[0].tag} /></div>
    <p className="muted">Stable versions only. Release candidates, betas, dev builds and nightlies are left out.</p>
    <div className="tl-chips" role="group" aria-label="Filter releases">
      {([['all', 'All'], ['full', 'Full releases'], ['patch', 'Patches']] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>{l}</button>)}
    </div>
    <Timeline key={kind} items={items} />
  </>)
}

function Uploads() {
  const { data, loading } = useFetch('videos', getVideos)
  const vids = data?.length ? data : live.youtube.videos
  const items: TItem[] = vids.filter(v => v.published).map((v): TItem => ({
    id: v.id, date: iso(v.published), title: v.title, badge: 'Upload', tone: 'minor', href: v.url, linkLabel: 'Watch on YouTube', thumb: v.thumb,
  })).sort(byDate)
  if (!items.length) return loading ? <Skeleton n={3} /> : <ErrorState href={YT_URL} label="YouTube" />
  return (<>
    <div className="statrow"><Stat k="Recent uploads" v={items.length} /><Stat k="Latest" v={new Date(items[0].date).toLocaleDateString('en', { dateStyle: 'medium' })} /></div>
    <p className="muted">The public channel feed only lists the most recent uploads.</p>
    <Timeline items={items} />
  </>)
}

function Models() {
  const { data, loading, failed } = useFetch('models', getModels)
  const key = (id: string) => id.split('/')[1]
  const items: TItem[] = (data ?? []).map((m): TItem => {
    const primary = FEATURED_MODELS.includes(key(m.id)), p = params(m.safetensors?.total), date = m.createdAt ?? m.lastModified ?? ''
    return {
      id: m.id, date, title: key(m.id) ?? m.id, badge: primary ? 'Primary model' : 'Model', tone: primary ? 'major' : 'minor',
      href: `https://huggingface.co/${m.id}`, linkLabel: 'Open on Hugging Face',
      meta: [m.pipeline_tag, p && `${p} parameters`].filter(Boolean).join(' · ') || undefined,
      lines: [`${num(m.downloads)} downloads · ${num(m.likes)} likes`, m.lastModified && `Last updated ${ago(m.lastModified)}`, m.tags?.length ? `Tags: ${m.tags.slice(0, 5).join(', ')}` : ''].filter(Boolean) as string[],
      note: m.createdAt ? undefined : 'Shown by last update, because the creation date was not available.',
    }
  }).filter(i => i.date).sort(byDate)
  if (!items.length) return loading ? <Skeleton n={3} /> : <ErrorState href={`https://huggingface.co/${HF_USER}`} label={failed ? 'Hugging Face' : 'Hugging Face (no public models yet)'} />
  return (<>
    <div className="statrow"><Stat k="Public models" v={items.length} /><Stat k="Primary models" v={items.filter(i => i.tone === 'major').length} /></div>
    <Timeline items={items} />
  </>)
}

export default function TimelinePage() {
  const [tab, setTab] = useState<Tab>('releases')
  return (
    <Page title="Timeline" lead="Releases, uploads and models in date order. Hover, focus or tap an entry for details.">
      <Seo title="Timeline" desc="Interactive timelines of HyperNix full releases and patches, YouTube uploads and Hugging Face models." />
      <div className="tl-tabs" role="tablist" aria-label="Timeline">
        {TABS.map(([k, l]) => <button key={k} role="tab" id={`tab-${k}`} aria-selected={tab === k} aria-controls="tl-panel" onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div id="tl-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'releases' ? <Releases /> : tab === 'youtube' ? <Uploads /> : <Models />}
      </div>
    </Page>)
}
