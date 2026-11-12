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
          <p className="about-drop">I build software, mostly around things i use or enjoy such as small language models and Beat Saber mods. The two things I would check out first are <Link to="/projects/hypernix-pip">HyperNix-pip</Link>, a training toolkit, and <Link to="/projects/vivify-quest">Vivify Quest</Link>, a port that lets PC-only Vivify maps run on the Quest.</p>
          <p>On the model side, <a href="https://huggingface.co/ray0rf1re/hyperNix-3.1-mini_c" target="_blank" rel="noreferrer">hyperNix-3.1-mini_c</a> is the latest: a 48.7M-parameter chat model built on Compactbot/hypernix-3.1-mini. <a href="https://huggingface.co/ray0rf1re/HyperNix.3-mini" target="_blank" rel="noreferrer">HyperNix.3-mini</a> is the base model I pretrained from random init. The rest are experiments.</p>
          <p>I decided to keep the models small because my gpu is old. A GTX 1080 is over 10 years old now and it took 12 days to train 47 million peramiters, and i still need to be able to use that gpu for desktop work.</p>
          <p>A lot of my code is written with AI. I would rather you look at the code then just trust it — both main repositories are public, with all of there releases.</p>
          <p className="about-pull">“I want to learn python and c++ to minimize my use of vibecoding”</p>
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
            <p>React, TypeScript and Vite, deployed to GitHub Pages by a GitHub Action. deta comes from GitHub, Hugging Face, Steam and YouTube pages and are updated daily.</p>
            <p className="mono fact-small">Design and code: mine, with AI assistance.</p>
          </div></Reveal>
        </aside>
      </div>

      <h2>Outside of code</h2>
      <div className="grid three">
        <article className="card"><h3>Beat Saber and Arcaea</h3><p className="muted">Rhythm games. Most of my YouTube uploads are Beat Saber.</p></article>
        <article className="card"><h3>Story games</h3><p className="muted">Long single-player games with a plot I perfer. My current favorate game is Life is Strange.</p></article>
        <article className="card"><h3>Games on Steam</h3><p className="muted">My profile and a snapshot of what I have played are on the <Link to="/steam">Steam page</Link>.</p></article>
      </div>
      <p className="muted">Want the short version? See the <Link to="/resume">résumé</Link>, or what I'm learning on the <Link to="/knowledge">knowledge</Link> page.</p>
    </Page>)
}
