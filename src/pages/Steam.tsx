import { ExternalLink } from 'lucide-react'
import { ErrorState, Page, Seo, Stat } from '../components/ui'
import { Reveal } from '../components/scroll'
import { live } from '../data/live'
import { ago } from '../lib/format'
const STEAM = 'https://steamcommunity.com/id/transgenderfireball'
const SHOWN = ['Games', 'Badges', 'Screenshots', 'Workshop Items', 'Reviews', 'Guides']
export default function Steam() {
  const s = live.steam
  return (
    <Page title="Steam" lead="A snapshot of my public Steam profile, refreshed whenever the site is built.">
      <Seo title="Steam" desc="Public Steam profile snapshot: level, games, badges, workshop items and favorite game." />
      {!s ? <ErrorState href={STEAM} label="Steam" /> : <Reveal>
        <div className="card userbox">
          {s.avatar && <img src={s.avatar} alt={`${s.name} Steam avatar`} width={96} height={96} loading="lazy" />}
          <div><h2>{s.name}</h2>{s.level ? <p className="muted">Steam level {s.level}</p> : null}
            <p className="muted">Snapshot updated {ago(s.fetchedAt)}</p>
            <a className="btn" href={STEAM} target="_blank" rel="noreferrer">Open Steam profile <ExternalLink size={14} aria-hidden /></a></div>
        </div>
        <div className="statrow">{SHOWN.filter(k => s.counts[k] !== undefined).map(k => <Stat key={k} k={k} v={s.counts[k]} />)}</div>
        {s.favoriteGame && <div className="card"><h3>Favorite game</h3><p><a href={s.favoriteGame.url} target="_blank" rel="noreferrer">{s.favoriteGame.name}</a>{s.favoriteGame.hours ? ` · ${s.favoriteGame.hours} hours played` : ''}</p></div>}
      </Reveal>}
    </Page>)
}
