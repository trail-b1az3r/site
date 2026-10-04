import { useFetch } from '../hooks/useFetch'
import { FEATURED_MODELS, getModels, HF_USER } from '../services/huggingface'
import { ModelCard } from '../components/cards'
import { ErrorState, Page, Seo, Skeleton } from '../components/ui'
export default function Models() {
  const { data, loading, failed } = useFetch('models', getModels)
  const key = (id: string) => id.split('/')[1]
  const primary = FEATURED_MODELS.map(n => data?.find(m => key(m.id) === n)).filter(Boolean) as NonNullable<typeof data>
  const others = (data ?? []).filter(m => !FEATURED_MODELS.includes(key(m.id)))
  const hf = `https://huggingface.co/${HF_USER}`
  return (
    <Page title="AI / Models" lead="Language models published on Hugging Face. The two primary models come first; everything else is experimental.">
      <Seo title="AI / Models" desc="Hugging Face models by ray0rf1re, featuring hypernix.3-mini and hypernix.3.1-mini." />
      <h2>Primary models</h2>
      {loading ? <Skeleton n={2} /> : failed ? <ErrorState href={hf} label="Hugging Face" /> : primary.length ? <div className="grid two">{primary.map(m => <ModelCard key={m.id} m={m} primary />)}</div> : <ErrorState href={hf} label="Hugging Face" />}
      <h2>Other / experimental models</h2>
      {loading ? <Skeleton n={3} /> : others.length ? <div className="grid three">{others.map(m => <ModelCard key={m.id} m={m} />)}</div> : !failed && <p className="muted">No other public models yet.</p>}
    </Page>)
}
