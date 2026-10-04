import { Page, Seo } from '../components/ui'
export default function About() {
  return (
    <Page title="About" lead="I'm Rayla, and I go by trail-b1az3r online.">
      <Seo title="About" desc="About Rayla (trail-b1az3r): programming, AI and language models, game and mod development, open source." />
      <div className="prose">
        <p>I spend my time writing software and working with AI, especially language models. Most of what I do is public, so the best way to know me is to read the code.</p>
        <p>My work covers programming projects, game and mod development, primaraly focusing on experiments with training and publishing models.</p>
        <p>The two projects I'd point to first are HyperNix-pip and Vivify Quest. On the AI side, hypernix.3-mini and hypernix.3.1-mini are the models I consider my main ones. Everything else I've published is more experimental or undertrained.</p>
        <p>i like to play beatsaber, arcaea, story games. i have a old gtx 1080, and a intel i7 7700hq, with 32gb of soddim ddr4 ram, on my non laptop desktop pc</p>
      </div>
    </Page>)
}
