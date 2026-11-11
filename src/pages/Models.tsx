import { ArrowRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { FEATURED_MODELS, getModels, HF_USER } from '../services/huggingface'
import { ModelCard } from '../components/cards'
import { ModelSpotlight } from '../components/lab'
import { ErrorState, Page, Seo, Skeleton } from '../components/ui'
import { MODEL_META } from '../data/featured'

export default function Models() {
  const { data, loading, failed } = useFetch('models', getModels)
  const key = (id: string) => id.split('/')[1]
  const primary = FEATURED_MODELS.map(n => data?.find(m => key(m.id) === n)).filter(Boolean) as NonNullable<typeof data>
  const latest = primary.find(m => key(m.id) === FEATURED_MODELS[0])
  const rest = primary.filter(m => key(m.id) !== FEATURED_MODELS[0])
  const others = (data ?? []).filter(m => !(FEATURED_MODELS as readonly string[]).includes(key(m.id)))
  const hf = `https://huggingface.co/${HF_USER}`
  return (
    <Page title="Models" lead="Small language models, published on Hugging Face. The latest chat tune comes first; the experiments are at the bottom.">
      <Seo title="Models" desc="Hugging Face models by ray0rf1re, including hyperNix-3.1-mini_c and HyperNix.3-mini." />
      <ModelSpotlight name="hyperNix-3.1-mini_c" model={latest} meta={MODEL_META['hyperNix-3.1-mini_c']} />

      <h2>Also published</h2>
      {loading ? <Skeleton n={2} /> : failed ? <ErrorState href={hf} label="Hugging Face" /> : rest.length ? <div className="grid two">
        {rest.map(m => <ModelCard key={m.id} m={m} />)}
        <article className="card model-more">
          <p className="kicker">The archive</p>
          <h3>{data?.length ?? 0} public models</h3>
          <p>Most of the account is experiments: small pretraining runs, chat tunes, quantised builds, image models and things that did not work. The models above are the ones I would read first.</p>
          <p className="mono model-more-note">Everything is on Hugging Face under <span>ray0rf1re</span>.</p>
          <a className="text-link mono" href={hf} target="_blank" rel="noreferrer">Open the account <ArrowRight size={14} aria-hidden="true" /></a>
        </article>
      </div> : <ErrorState href={hf} label="Hugging Face" />}

      <h2>Experiments</h2>
      <p className="section-lede">The rest of the public account: small pretraining runs, quantised builds, image models and things that did not work out. All of it is on <a href={hf} target="_blank" rel="noreferrer">Hugging Face</a>.</p>
      {loading ? <Skeleton n={3} /> : others.length ? <div className="grid three model-grid">{others.map(m => <ModelCard key={m.id} m={m} />)}</div> : !failed && <p className="muted">No other public models yet.</p>}
      <p className="section-more mono"><a href={hf} target="_blank" rel="noreferrer">The whole account on Hugging Face <ArrowRight size={14} aria-hidden="true" /></a><span>{others.length} experiments and counting</span></p>
    </Page>)
}
