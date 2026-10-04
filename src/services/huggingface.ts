import type { HfModel } from '../types'
export const HF_USER = 'ray0rf1re'
export const FEATURED_MODELS = ['hypernix.3-mini', 'hypernix.3.1-mini']
export async function getModels(): Promise<HfModel[]> {
  const q = ['downloads', 'likes', 'tags', 'pipeline_tag', 'lastModified', 'safetensors'].map(e => `expand[]=${e}`).join('&')
  const r = await fetch(`https://huggingface.co/api/models?author=${HF_USER}&limit=100&${q}`)
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}
