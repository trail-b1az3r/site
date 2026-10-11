import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getRepos, GH_USER } from '../services/github'
import { FEATURED_MODELS, getModels, HF_USER } from '../services/huggingface'
import { FeaturedProjectCard, ModelCard, ProfileCard } from '../components/cards'
import { ActivityRadar } from '../components/Radar'
import { ErrorState, Seo, Skeleton } from '../components/ui'
import { HeroGrid, Reveal } from '../components/scroll'
import { PROFILES, TAGS } from '../data/profiles'
export default function Home() {
  const repos = useFetch('repos', getRepos), models = useFetch('models', getModels)
  const feat = (models.data ?? []).filter(m => FEATURED_MODELS.includes(m.id.split('/')[1]))
  return (<>
    <Seo title="Home" desc="Rayla (trail-b1az3r): software, language models, interests and a short résumé, with live GitHub and Hugging Face data." />
    <section className="hero wrap"><HeroGrid />
      <div className="split">
        <div>
          <p className="handle">trail-b1az3r</p>
          <h1>Hi, I'm Rayla.</h1>
          <p className="lead">I write software, train and publish small language models, and make things for games. This site holds my projects, my notes and my résumé.</p>
          <p className="row"><Link className="btn" to="/projects">Projects</Link><Link className="btn ghost" to="/ai">Models</Link><Link className="btn ghost" to="/resume">Résumé</Link></p>
        </div>
        <div className="card radar-card"><h2 className="card-title">GitHub, last 12 months</h2><ActivityRadar legend={false} /></div>
      </div>
      <p className="tags">{TAGS.map(t => <span key={t}>{t}</span>)}</p>
    </section>
    <section className="wrap" aria-labelledby="fp"><Reveal><h2 id="fp">Projects</h2>
      <div className="grid two">{FEATURED.map(f => <FeaturedProjectCard key={f.name} {...f} repo={repos.data?.find(r => r.name.toLowerCase() === f.name.toLowerCase())} />)}</div>
    </Reveal></section>
    <section className="wrap" aria-labelledby="fm"><Reveal><h2 id="fm">Models</h2>
      {models.loading ? <Skeleton n={2} /> : feat.length ? <div className="grid two">{feat.map(m => <ModelCard key={m.id} m={m} primary />)}</div>
        : <ErrorState href={`https://huggingface.co/${HF_USER}`} label="Hugging Face" />}
    </Reveal></section>
    <section className="wrap" aria-labelledby="int"><Reveal><h2 id="int">Interests</h2>
      <div className="grid three">
        <article className="card"><h3>Rhythm games</h3><p>Beat Saber and Arcaea. Most of my YouTube uploads are Beat Saber.</p></article>
        <article className="card"><h3>Story games</h3><p>Long, plot-driven games. My Steam profile has the hours.</p></article>
        <article className="card"><h3>Small models</h3><p>What a model can do at a small size, and how much of that comes from the data.</p></article>
      </div>
    </Reveal></section>
    <section className="wrap" aria-labelledby="on"><Reveal><h2 id="on">Elsewhere</h2>
      <div className="grid four">{PROFILES.map(p => <ProfileCard key={p.id} k={p.id} {...p} />)}</div>
      {repos.failed && <ErrorState href={`https://github.com/${GH_USER}`} label="GitHub" />}
    </Reveal></section></>)
}
