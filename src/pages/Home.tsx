import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getRepos } from '../services/github'
import { FEATURED_MODELS, getModels } from '../services/huggingface'
import { toReleases } from '../lib/releases'
import { ModelCard } from '../components/cards'
import { ActivityRadar } from '../components/Radar'
import Contributions from '../components/Contributions'
import { Seo, Stat } from '../components/ui'
import { HeroGrid, Reveal, useSpotlight } from '../components/scroll'
import { LocalClock, ModelSpotlight, SectionHead, SignalPanel, Ticker, WorkRow } from '../components/lab'
import { ServiceLine } from '../components/services'
import { useServiceStatus } from '../hooks/useServiceStatus'
import { ANISETTE, T1 } from '../data/services'
import { MODEL_META, PROJECT_META } from '../data/featured'
import { PROFILES } from '../data/profiles'
import { live } from '../data/live'

const TICKER = [
  'From-scratch small models', 'Chat tuning', 'Training tooling', 'Beat Saber Quest mods',
  'DirectX → GLSL', 'Open source', 'One GTX 1080',
]

export default function Home() {
  const repos = useFetch('repos', getRepos)
  const models = useFetch('models', getModels)
  const key = (id: string) => id.split('/')[1]
  const latest = models.data?.find(m => key(m.id) === FEATURED_MODELS[0]) ?? null
  const base = models.data?.find(m => key(m.id) === FEATURED_MODELS[1]) ?? null
  const release = live.releases?.[0] ?? null
  const stableReleases = toReleases(live.releases ?? []).length
  const video = live.youtube.videos?.[0] ?? null
  const activity = live.activity ?? null
  const spotlightRef = useSpotlight<HTMLElement>()
  const { t1, anisette } = useServiceStatus()
  const repo = (name: string) => repos.data?.find(r => r.name.toLowerCase() === name.toLowerCase()) ?? null

  return (
    <>
      <Seo title="Home" desc="Rayla (trail-b1az3r): small language models, the HyperNix training toolkit and Beat Saber Quest mods." />
      <section ref={spotlightRef} className="hero">
        <HeroGrid />
        <div className="wrap hero-inner">
          <div className="hero-meta mono">
            <span>Trail-b1az3r / personal lab</span>
            <span className="hero-meta-mid">Software · small models · Quest mods</span>
            <LocalClock label="your local time" />
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Rayla — software, small language models</p>
              <h1>
                <span className="h-line"><span>Small models.</span></span>
                <span className="h-line"><span>Ported <em>worlds</em>.</span></span>
              </h1>
              <p className="lead">I’m Rayla. I create small language models.</p>
              <div className="row hero-actions">
                <a className="btn" href="#work">Selected work <ArrowDown size={15} aria-hidden="true" /></a>
                <Link className="btn ghost" to="/resume">Résumé</Link>
                <a className="text-link mono" href="https://github.com/trail-b1az3r" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
            <SignalPanel model={latest} release={release} video={video} activity={activity} contributions={live.contributions} releases={stableReleases} snapshot={live.generatedAt} />
          </div>
        </div>
        <Ticker items={TICKER} />
      </section>

      <section className="wrap section" id="work">
        <Reveal><SectionHead n="01" title="Selected work" note="Two projects I keep coming back to. Both are public." /></Reveal>
        <div className="work-list">
          {PROJECT_META.map((p, i) => <WorkRow key={p.slug} index={i + 1} project={p} repo={repo(p.name)} />)}
        </div>
        <Reveal><p className="section-more mono"><Link to="/projects">All repositories <ArrowRight size={14} aria-hidden="true" /></Link><Link to="/timeline">Release history <ArrowRight size={14} aria-hidden="true" /></Link></p></Reveal>
      </section>

      <section className="wrap section" id="models">
        <Reveal><SectionHead n="02" title="Models" note="Published on Hugging Face. Small on purpose." /></Reveal>
        <ModelSpotlight name="hyperNix-3.1-mini_c" model={latest} meta={MODEL_META['hyperNix-3.1-mini_c']} />
        <div className="model-sub">
          <Reveal><ModelCard m={base ?? undefined} primary={false} fallback="HyperNix.3-mini" /></Reveal>
          <Reveal delay={80}><article className="card model-more">
            <p className="kicker">The rest</p>
            <h3>{models.loading || models.failed ? 'Public models' : `${models.data?.length ?? 0} public models`}</h3>
            <p>Most are experiments: small pretraining runs, chat tunes, quantised builds and things that did not work. The two above are the ones i like most.</p>
            <p className="mono model-more-note">Everything is on Hugging Face under <span>ray0rf1re</span>.</p>
            <Link className="text-link mono" to="/ai">Browse all models <ArrowRight size={14} aria-hidden="true" /></Link>
          </article></Reveal>
        </div>
      </section>

      <section className="wrap section" id="activity">
        <Reveal><SectionHead n="03" title="Signals" note="last 12 months." /></Reveal>
        <div className="signal-grid">
          <Reveal><div className="card radar-card">
            <p className="card-title mono">GitHub activity / 12 months</p>
            <ActivityRadar />
          </div></Reveal>
          <div className="signal-stack">
            <Reveal delay={60}><div className="statrow statrow-tight">
              <Stat k="Contributions" v={live.contributions?.total ?? 0} />
              <Stat k="Commits" v={activity?.commits ?? 0} />
              <Stat k="PRs merged" v={activity?.pullsMerged ?? 0} />
              <Stat k="Stable releases" v={stableReleases} />
              <Stat k="Public models" v={models.loading ? '—' : models.data?.length ?? 0} />
            </div></Reveal>
            {live.contributions && <Reveal delay={120}><div className="card heat-card"><Contributions {...live.contributions} /><p className="mono heat-source">Source: GitHub public contribution calendar. Snapshot refreshed daily.</p></div></Reveal>}
            <Reveal delay={160}><p className="section-more mono"><Link to="/github">More on GitHub <ArrowRight size={14} aria-hidden="true" /></Link></p></Reveal>
          </div>
        </div>
      </section>

      <section className="wrap section" id="services">
        <Reveal><SectionHead n="04" title="Live services" note="Not a mock: two servers answering from the home desktop." /></Reveal>
        <div className="svc-lines">
          <Reveal><ServiceLine to="/services" index="01" name="Anisette v3" role="SideStore signing helper" probe={anisette} endpoint={ANISETTE.endpoint} /></Reveal>
          <Reveal delay={70}><ServiceLine to="/services" index="02" name="HyperNix T1" role="Model API + HyperLink" probe={t1} endpoint={T1.endpoint} /></Reveal>
        </div>
        <Reveal><p className="section-more mono"><Link to="/services">Service notes and endpoints <ArrowRight size={14} aria-hidden="true" /></Link><span>Checked from your browser, just now</span></p></Reveal>
      </section>

      <section className="wrap section" id="off">
        <Reveal><SectionHead n="05" title="Off the clock" note="The rest of the week." /></Reveal>
        <div className="off-grid">
          <Reveal><article className="card off-card"><span className="mono off-n">01</span><h3>Rhythm games</h3><p>Beat Saber and Arcaea. Most of my YouTube uploads are Beat Saber — including the ones below.</p></article></Reveal>
          <Reveal delay={70}><article className="card off-card"><span className="mono off-n">02</span><h3>Story games</h3><p>Long, plot-driven single-player games. Steam’s snapshot lists Life is Strange as the favourite{live.steam?.counts.Games ? `, and ${live.steam.counts.Games} games in the library` : ''}.</p></article></Reveal>
          <Reveal delay={140}><article className="card off-card"><span className="mono off-n">03</span><h3>The desktop</h3><p>A ZOTAC ZBOX EN1080: i7-7700, GTX 1080 Mobile, 32GB RAM, 2TB NVMe. The base HyperNix model was trained on the 1080.</p></article></Reveal>
        </div>
        {live.youtube.videos.length > 0 && <>
          <div className="uploads-head"><h3 className="mono">Latest uploads</h3><Link className="mono" to="/youtube">All videos <ArrowRight size={14} aria-hidden="true" /></Link></div>
          <div className="uploads">
            {live.youtube.videos.slice(0, 3).map((v, i) => (
              <a key={v.id} className="upload" href={v.url} target="_blank" rel="noreferrer">
                <span className="upload-img"><img src={v.thumb} alt="" loading="lazy" /><span className="play" aria-hidden="true">▶</span></span>
                <span className="upload-meta mono">{String(i + 1).padStart(2, '0')} · {v.published ? new Date(v.published).toLocaleDateString('en', { day: '2-digit', month: 'short' }) : 'YouTube'}</span>
                <span className="upload-title">{v.title}</span>
              </a>
            ))}
          </div>
        </>}
      </section>

      <section className="wrap section" id="elsewhere">
        <Reveal><SectionHead n="06" title="Elsewhere" note="Work." /></Reveal>
        <div className="links-list">
          {PROFILES.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}><a className="link-row" href={p.href} target="_blank" rel="noreferrer">
              <span className="link-i mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="link-main"><span className="link-name">{p.name}</span><span className="link-desc">{p.desc}</span></span>
              <span className="link-handle mono">{p.handle}</span>
              <ArrowUpRight className="link-arrow" size={20} aria-hidden="true" />
            </a></Reveal>
          ))}
        </div>
        <p className="section-more mono"><Link to="/links">All links <ArrowRight size={14} aria-hidden="true" /></Link><span>{(live.contributions?.total ?? 0).toLocaleString()} contributions in the last year</span></p>
      </section>
    </>
  )
}
