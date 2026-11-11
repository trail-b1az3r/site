import { Link } from 'react-router-dom'
import { Page, Seo } from '../components/ui'
import { Reveal } from '../components/scroll'

const MACHINE: [string, string][] = [
  ['Machine', 'ZOTAC ZBOX EN1080 mini PC'],
  ['CPU', 'Intel Core i7-7700'],
  ['GPU', 'GeForce GTX 1080 Mobile'],
  ['Memory', '32GB DDR4 SO-DIMM'],
  ['Storage', '2TB NVMe'],
  ['Trained here', 'HyperNix.3-mini — 0.87B tokens, 12 days 3 hours'],
]

export default function About() {
  return (
    <Page title="About" lead="I'm Rayla, and I go by trail-b1az3r online.">
      <Seo title="About" desc="About Rayla (trail-b1az3r): software, small language models, Quest mods and the desktop they run on." />
      <div className="about-grid">
        <div className="prose about-copy">
          <p className="about-drop">I build software in public, mostly around small language models and Beat Saber mods. The two things I would read first are <Link to="/projects/hypernix-pip">HyperNix-pip</Link>, a training toolkit, and <Link to="/projects/vivify-quest">Vivify Quest</Link>, a port that lets PC-only Vivify maps run on the Quest.</p>
          <p>On the model side, <a href="https://huggingface.co/ray0rf1re/hyperNix-3.1-mini_c" target="_blank" rel="noreferrer">hyperNix-3.1-mini_c</a> is the latest: a 48.7M-parameter chat tune built on Compactbot/hypernix-3.1-mini. <a href="https://huggingface.co/ray0rf1re/HyperNix.3-mini" target="_blank" rel="noreferrer">HyperNix.3-mini</a> is the base model I pretrained from random init. The rest are experiments.</p>
          <p>I decided to keep the models small because the machine is small. A GTX 1080 is not a training cluster, and seeing what fits on one card turned out to be more interesting than renting a bigger one. The base model took 12 days and 3 hours, and the card is still in the desktop.</p>
          <p>A lot of my code is written with AI coding assistants. I would rather you read the code than take my word for what it does — both flagship repositories are public, with their releases and issue history.</p>
          <p className="about-pull">“I want to learn python and c++ to minimize my use of vibe” — that is the GitHub bio, and it is still the plan.</p>
        </div>
        <aside className="about-side">
          <Reveal><div className="card fact-card">
            <p className="kicker">The desktop</p>
            <dl className="fact-list">
              {MACHINE.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="fact-note">The same machine trains, tests and runs the local models.</p>
          </div></Reveal>
          <Reveal delay={80}><div className="card fact-card fact-note-card">
            <p className="kicker">How this site is made</p>
            <p>React, TypeScript and Vite, deployed to GitHub Pages by a GitHub Action. The numbers come from public GitHub, Hugging Face, Steam and YouTube pages and are snapshotted daily. No analytics, no accounts.</p>
            <p className="mono fact-small">Design and code: mine, with AI assistance where it helped.</p>
          </div></Reveal>
        </aside>
      </div>

      <h2>Outside of code</h2>
      <div className="grid three">
        <article className="card"><h3>Beat Saber and Arcaea</h3><p className="muted">Rhythm games. Most of my YouTube uploads are Beat Saber, and Vivify Quest started because a map looked better on PC.</p></article>
        <article className="card"><h3>Story games</h3><p className="muted">Long single-player games with a plot I want to finish. Steam currently lists Life is Strange as the favourite.</p></article>
        <article className="card"><h3>Games on Steam</h3><p className="muted">My profile and a snapshot of what I have played are on the <Link to="/steam">Steam page</Link>.</p></article>
      </div>
      <p className="muted">Want the short version? See the <Link to="/resume">résumé</Link>, or what I'm learning on the <Link to="/knowledge">knowledge</Link> page.</p>
    </Page>)
}
