// Résumé content that isn't on GitHub or Hugging Face. Empty lists hide their section on the Résumé page.
export const RESUME = {
  summary: 'Developer who builds software in public and trains small language models for fun and for learning. Most of the work is on GitHub and Hugging Face, and most of it is linked from this site.',
  skills: [
    { area: 'Programming', items: ['JavaScript (basics)', 'Python (learning)', 'C++ (next)'] },
    { area: 'Language models', items: ['Training and fine-tuning experiments', 'Publishing models on Hugging Face'] },
    { area: 'Tools', items: ['Git and GitHub, including Actions for builds and deploys', 'React, TypeScript and Vite (this site)', 'AI coding assistants'] },
  ],
  // Add roles here, newest first: { role, org, period, points: [...] }
  experience: [] as { role: string; org: string; period: string; points: string[] }[],
  // Add study or courses here: { what, where, period }
  education: [] as { what: string; where: string; period: string }[],
}
