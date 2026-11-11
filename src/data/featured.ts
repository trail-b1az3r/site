// Facts for the two flagship projects and the published models.
// Kept next to the links so the site never drifts into claims the sources don't make.
// Sources: the Hugging Face model cards and the GitHub repositories.

export const FEATURED_MODELS = ['hyperNix-3.1-mini_c', 'HyperNix.3-mini'] as const

export interface ModelMeta {
  kind: string
  summary: string
  specs: { k: string; v: string }[]
  loss?: { before: number; after: number; caption: string }
  note?: string
}

export const MODEL_META: Record<string, ModelMeta> = {
  'hyperNix-3.1-mini_c': {
    kind: 'Chat-tuned · latest',
    summary:
      'A ~49M-parameter chat tune of Compactbot/hypernix-3.1-mini, trained with HyperNix on 440,871 smol-smoltalk examples. Short answers, small footprint.',
    specs: [
      { k: 'Parameters', v: '48.7M' },
      { k: 'Architecture', v: 'hyperNix0x-v2' },
      { k: 'Layers', v: '8' },
      { k: 'd_model / heads / KV', v: '512 / 8 / 2' },
      { k: 'Context', v: '512 tokens' },
      { k: 'Vocabulary', v: '32,000 BPE' },
      { k: 'Training data', v: 'smol-smoltalk' },
      { k: 'License', v: 'Apache-2.0' },
    ],
    loss: {
      before: 6.9494,
      after: 2.6645,
      caption: 'Best validation loss on the chat tune, before and after tuning.',
    },
    note:
      'Built on Compactbot/hypernix-3.1-mini. Thanks to Compact AI for the compute for the continued-pretraining run.',
  },
  'HyperNix.3-mini': {
    kind: 'Base model',
    summary:
      '48.7M parameters, pretrained from random init on 0.87B tokens with a custom 32,000-token vocabulary — on one GTX 1080, in 12 days and 3 hours.',
    specs: [
      { k: 'Parameters', v: '48.7M' },
      { k: 'Architecture', v: 'hyperNix0x-v2' },
      { k: 'Training tokens', v: '0.87B' },
      { k: 'Training hardware', v: '1× GTX 1080' },
      { k: 'Training time', v: '12d 3h' },
      { k: 'Context', v: '512 tokens' },
      { k: 'Vocabulary', v: '32,000 BPE' },
      { k: 'License', v: 'Apache-2.0' },
    ],
    note:
      'A base model: it completes text. It was never instruction-tuned, chat-tuned or aligned, and at this size it does not reliably follow instructions.',
  },
}

export interface ProjectMeta {
  name: string
  slug: string
  kicker: string
  summary: string
  facts: string[]
  visual: 'terminal' | 'shaders'
  /** Skip setup/log-help preamble when showing the README on the project page. */
  readmeFrom?: string
}

export const PROJECT_META: ProjectMeta[] = [
  {
    name: 'HyperNix-pip',
    slug: 'hypernix-pip',
    kicker: 'Training toolkit · Python',
    summary:
      'An end-to-end toolkit for training AI models on modern or old devices. It started as a way to turn hypernix.1 into GGUF; now it covers training, runners, an OpenAI-style server and a CLI.',
    facts: ['Python 3.12–3.15', 'HOS-1.1 / Apache-2.0', 'Stable releases on GitHub', 'PyPI: hypernix'],
    visual: 'terminal',
    readmeFrom: "## What's new:",
  },
  {
    name: 'vivify-quest',
    slug: 'vivify-quest',
    kicker: 'Beat Saber Quest mod · C++',
    summary:
      'A Quest port of Vivify for Beat Saber 1.40.8. It plays Vivify maps on the headset, including maps that were only ever built for PC — on the device, with a DirectX → GLSL shader translator.',
    facts: ['Beat Saber 1.40.8', 'On-device PC → Quest conversion', 'AudioLink', 'MIT license'],
    visual: 'shaders',
    readmeFrom: '## Features',
  },
]
