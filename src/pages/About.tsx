import { Page, Seo } from '../components/ui'
export default function About() {
  return (
    <Page title="About" lead="I'm Rayla, and I go by trail-b1az3r online.">
      <Seo title="About" desc="About Rayla (trail-b1az3r): programming, AI and language models, game and mod development, open source." />
      <div className="prose">
        <p>I spend my time writing software and working with AI, especially language models. Most of what I do is public, so the best way to know me is to read the code.</p>
        <p>My work covers programming projects, game and mod development, and experiments with training and publishing models. I like building the tooling around an idea as much as the idea itself.</p>
        <p>The two projects I'd point to first are HyperNix-pip and Vivify Quest. On the AI side, hypernix.3-mini and hypernix.3.1-mini are the models I consider my main ones. Everything else I've published is more experimental.</p>
        <p>This site pulls its numbers straight from GitHub and Hugging Face, so it stays honest as things change. If something isn't listed here, it isn't something I've claimed.</p>
      </div>
    </Page>)
}
