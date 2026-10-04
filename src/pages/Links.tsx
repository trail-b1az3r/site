import { Link } from 'react-router-dom'
import { ProfileCard } from '../components/cards'
import { Page, Seo } from '../components/ui'
import { PROFILES } from '../data/profiles'
export default function Links() {
  return (
    <Page title="Links" lead="Where to find me online.">
      <Seo title="Links" desc="GitHub, Hugging Face, YouTube and Steam profiles for Rayla (trail-b1az3r)." />
      <div className="grid two">{PROFILES.map(p => <ProfileCard key={p.id} k={p.id} {...p} />)}</div>
      <p className="muted">More detail: <Link to="/steam">Steam profile snapshot</Link></p>
    </Page>)
}
