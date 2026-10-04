import { Link } from 'react-router-dom'
import { Page, Seo } from '../components/ui'
const TOPICS: [string, string][] = [
  ['Language models', 'Building, training and using LLMs, and publishing the results on Hugging Face.'],
  ['Training and fine-tuning', 'Experimenting with how models are trained and adapted.'],
  ['Inference', 'Running models efficiently and making them usable in real software.'],
  ['Datasets', 'Preparing the data that models learn from.'],
  ['Model architecture', 'Exploring how model design choices affect behaviour.'],
  ['AI tooling', 'Developer tooling that makes working with models smoother.'],
]
export default function Knowledge() {
  return (
    <Page title="Knowledge" lead="What I work on in AI, and where you can see it.">
      <Seo title="Knowledge" desc="Technical interests in language models, training, fine-tuning, inference and AI tooling, backed by public projects." />
      <h2>Areas I work in</h2>
      <dl className="topics">{TOPICS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
      <h2>Evidence</h2>
      <p className="prose">I'd rather you check than take my word. The <Link to="/ai">AI / Models</Link> page lists what I've published on Hugging Face, the <Link to="/projects">projects</Link> page lists my repositories, and <Link to="/projects/hypernix-pip">HyperNix-pip</Link> is my main project. I'm a developer working in public, not an academic researcher.</p>
    </Page>)
}
