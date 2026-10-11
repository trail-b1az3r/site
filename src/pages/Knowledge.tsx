import { Link } from 'react-router-dom'
import { Page, Seo } from '../components/ui'
const DONE: [string, string, string][] = [
  ['Publishing language models', 'Uploading models and writing model pages on Hugging Face.', '/ai'],
  ['Shipping releases', 'Tagging versions and writing release notes for HyperNix on GitHub.', '/timeline'],
  ['Training and fine-tuning experiments', 'Small runs to see how training choices change a model.', '/ai'],
  ['Building this site', 'React, TypeScript and Vite, with a build that pulls live GitHub and Hugging Face data and deploys on GitHub Pages.', '/github'],
]
const LEARNING: [string, string][] = [
  ['Python', 'I know enough to script with it, and I\'m learning more.'],
  ['C++', 'The next language on my list, for performance and lower-level work.'],
  ['Machine learning fundamentals', 'Datasets, evaluation and why a model behaves the way it does.'],
  ['JavaScript and TypeScript', 'I know a little. This site is written in TypeScript, with a lot of help from AI tools.'],
]
export default function Knowledge() {
  return (
    <Page title="Knowledge" lead="What I've done, what I'm learning, and where you can check it.">
      <Seo title="Knowledge" desc="What Rayla has built and is learning: language models, training experiments, releases and web tooling." />
      <h2>What I've done</h2>
      <dl className="topics">{DONE.map(([t, d, to]) => <div key={t}><dt>{t}</dt><dd>{d} <Link to={to}>See it</Link></dd></div>)}</dl>
      <h2>What I'm learning</h2>
      <dl className="topics">{LEARNING.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
      <h2>A note on the levels</h2>
      <p className="prose">I'd rather under-claim than over-claim. The first list is things I've shipped and you can open. The second is what I'm studying now, not a skill I'd put on a job application yet.</p>
    </Page>)
}
