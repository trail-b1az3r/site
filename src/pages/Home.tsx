import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { FEATURED, getRepos, GH_USER } from '../services/github'
import { FEATURED_MODELS, getModels, HF_USER } from '../services/huggingface'
import { FeaturedProjectCard, ModelCard, ProfileCard } from '../components/cards'
import { ErrorState, Seo, Skeleton } from '../components/ui'
import { HeroGrid, Reveal } from '../components/scroll'
import { PROFILES, TAGS } from '../data/profiles'
export default function Home() {
  const repos = useFetch('repos', getRepos), models = useFetch('models', getModels)
  const feat = (models.data ?? []).filter(m => FEATURED_MODELS.includes(m.id.split('/')[1]))
  return (<>
    <Seo title="Home" desc="Rayla (trail-b1az3r): software development, AI and language models. Featured projects and models, with live data." />
    <section className="hero wrap"><HeroGrid />
      <p className="handle">trail-b1az3r</p>
      <h1>Software Vibe-coder, and LM trainer.</h1>
      <p className="lead">vibe-code, write bad code, train and publish AI models, and make things for games. Everything below links to my repositories and models.</p>
      <p className="tags">{TAGS.map(t => <span key={t}>{t}</span>)}</p>
      <p className="row"><Link className="btn" to="/projects">See the projects</Link><Link className="btn ghost" to="/ai">See the models</Link></p>
    </section>
    <section className="wrap" aria-labelledby="fp"><Reveal><h2 id="fp">Flagship projects</h2>
      <div className="grid two">{FEATURED.map(f => <FeaturedProjectCard key={f.name} {...f} repo={repos.data?.find(r => r.name.toLowerCase() === f.name.toLowerCase())} />)}</div>
    </Reveal></section>
    <section className="wrap" aria-labelledby="fm"><Reveal><h2 id="fm">Featured models</h2>
      {models.loading ? <Skeleton n={2} /> : feat.length ? <div className="grid two">{feat.map(m => <ModelCard key={m.id} m={m} primary />)}</div>
        : <ErrorState href={`https://huggingface.co/${HF_USER}`} label="Hugging Face" />}
    </Reveal></section>
    <section className="wrap" aria-labelledby="on"><Reveal><h2 id="on">Elsewhere</h2>
      <div className="grid four">{PROFILES.map(p => <ProfileCard key={p.id} k={p.id} {...p} />)}</div>
      {repos.failed && <ErrorState href={`https://github.com/${GH_USER}`} label="GitHub" />}
    </Reveal></section></>)
}
