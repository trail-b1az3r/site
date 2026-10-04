import { PROFILES } from '../data/profiles'
export default function Footer() {
  return (
    <footer className="foot"><div className="wrap footin">
      <p>Rayla (trail-b1az3r) © {new Date().getFullYear()}. Live data comes from the public GitHub and Hugging Face APIs.</p>
      <p>{PROFILES.map(p => <a key={p.id} href={p.href} target="_blank" rel="noreferrer">{p.name}</a>)}</p>
    </div></footer>
  )
}
