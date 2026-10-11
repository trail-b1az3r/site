import { Link } from 'react-router-dom'
import { Page, Seo } from '../components/ui'
export default function About() {
  return (
    <Page title="About" lead="I'm Rayla, and I go by trail-b1az3r online.">
      <Seo title="About" desc="About Rayla (trail-b1az3r): software, language models, games and the projects I work on." />
      <div className="prose">
        <p>I build software, mostly in public, and I've spent a lot of time on language models: training them, publishing them, and seeing what small models can do. Most of what I make is on GitHub and Hugging Face, so the easiest way to judge my work is to read it.</p>
        <p>The two projects I'd start with are <Link to="/projects/hypernix-pip">HyperNix-pip</Link> and <Link to="/projects/vivify-quest">Vivify Quest</Link>. On the model side, <a href="https://huggingface.co/ray0rf1re/hypernix.3-mini">hypernix.3-mini</a> and <a href="https://huggingface.co/ray0rf1re/hypernix.3.1-mini">hypernix.3.1-mini</a> are the ones I'd point to. The other models I've published are smaller experiments.</p>
        <p>A lot of my code is written with AI coding assistants, and I'd rather you read the code than take my word for what it does.</p>
      </div>
      <h2>My machine</h2>
      <p className="prose">I train and test on a desktop: a ZOTAC ZBOX EN1080 mini PC with an Intel Core i7-7700, a GeForce GTX 1080 Mobile GPU, 32GB of DDR4 SO-DIMM memory, and a 2TB NVMe drive.</p>
      <h2>Outside of code</h2>
      <div className="grid three">
        <article className="card"><h3>Beat Saber and Arcaea</h3><p className="muted">Rhythm games. Most of my YouTube uploads are Beat Saber.</p></article>
        <article className="card"><h3>Story games</h3><p className="muted">Long single-player games with a plot I want to finish.</p></article>
        <article className="card"><h3>Games on Steam</h3><p className="muted">My profile and a snapshot of what I've played are on the <Link to="/steam">Steam page</Link>.</p></article>
      </div>
      <p className="muted">Want the short version? See the <Link to="/resume">résumé</Link>, or what I'm learning on the <Link to="/knowledge">knowledge</Link> page.</p>
    </Page>)
}
