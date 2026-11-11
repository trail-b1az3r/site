import { Link } from 'react-router-dom'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { Page, Seo } from '../components/ui'
import { CopyButton, StatusPill, StatusSummary } from '../components/services'
import { clockTime, useServiceStatus } from '../hooks/useServiceStatus'
import { ANISETTE, SERVERS_JSON, T1 } from '../data/services'

function Endpoint({ value, label = 'Copy URL' }: { value: string; label?: string }) {
  return (
    <div className="svc-endpoint">
      <code>{value}</code>
      <CopyButton value={value} label={label} />
    </div>
  )
}

export default function Services() {
  const { t1, anisette, info, busy, check } = useServiceStatus()
  const checked = [t1.at, anisette.at].filter((n): n is number => typeof n === 'number')
  const latest = checked.length ? Math.max(...checked) : null

  return (
    <Page
      title="Live services"
      kicker="Rayla / trail-b1az3r / services"
      lead="Two real servers on the home desktop — the same machine that trained the base model: a SideStore Anisette server and the HyperNix T1 API. This page checks both from your browser and reports what answered."
    >
      <Seo
        title="Live services"
        desc="Live status for Rayla's SideStore Anisette v3 server and the HyperNix T1 API running on the home desktop."
      />

      <div className="svc-bar">
        <div>
          <p className="mono svc-bar-k">Browser-side check</p>
          <StatusSummary t1={t1} anisette={anisette} />
        </div>
        <div className="svc-bar-right">
          <span className="mono svc-checked">checked {clockTime(latest)}</span>
          <button className="btn ghost svc-refresh" type="button" onClick={() => void check()} disabled={busy}>
            <RefreshCw size={14} className={busy ? 'spin' : undefined} aria-hidden="true" />
            {busy ? 'Checking' : 'Check again'}
          </button>
        </div>
      </div>

      <div className="svc-grid">
        <article className="svc-card">
          <header className="svc-head">
            <span className="svc-index mono">{ANISETTE.index}</span>
            <StatusPill probe={anisette} />
          </header>
          <p className="kicker">{ANISETTE.role}</p>
          <h2>{ANISETTE.name}</h2>
          <p className="svc-summary">{ANISETTE.summary}</p>
          <p className="mono svc-label">Public endpoint</p>
          <Endpoint value={ANISETTE.endpoint} />
          <dl className="svc-facts">
            {ANISETTE.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            <div><dt>Version</dt><dd>{ANISETTE.version}</dd></div>
          </dl>
          <p className="svc-note">{ANISETTE.note}</p>
          <div className="row svc-actions">
            <a className="btn" href={ANISETTE.docs} target="_blank" rel="noreferrer">SideStore guide <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a className="btn ghost" href={ANISETTE.source} target="_blank" rel="noreferrer">Source <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </article>

        <article className="svc-card">
          <header className="svc-head">
            <span className="svc-index mono">{T1.index}</span>
            <StatusPill probe={t1} />
          </header>
          <p className="kicker">{T1.role}</p>
          <h2>{T1.name}</h2>
          <p className="svc-summary">{T1.summary}</p>
          <p className="mono svc-label">Public API root</p>
          <Endpoint value={T1.endpoint} label="Copy root" />
          <div className="svc-chips">
            <span className="svc-chip mono">{info.api ?? T1.version}</span>
            <span className="svc-chip mono">{info.hypernix ?? T1.hypernix}</span>
            <span className="svc-chip mono">{info.models !== null ? `${info.models} models` : 'catalog'}</span>
            {info.environment && <span className="svc-chip mono">{info.environment}</span>}
          </div>
          <dl className="svc-facts">
            {T1.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="svc-note">{T1.note}</p>
          <div className="row svc-actions">
            <a className="btn" href={T1.health} target="_blank" rel="noreferrer">Health JSON <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a className="btn ghost" href={T1.source} target="_blank" rel="noreferrer">Source <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </article>
      </div>

      <section className="svc-section" aria-labelledby="sidestore">
        <div className="svc-section-head">
          <p className="mono">Using it</p>
          <h2 id="sidestore">Point SideStore at the server</h2>
        </div>
        <ol className="svc-steps">
          <li><span className="mono">01</span><p>In SideStore, open <strong>Settings → Anisette Servers</strong>.</p></li>
          <li><span className="mono">02</span><p>Set the list URL to the server list below, then tap <strong>Refresh Servers</strong>.</p></li>
          <li><span className="mono">03</span><p>Select <strong>Rayla · blazeindustries</strong>, or paste the endpoint directly if your build asks for a server URL.</p></li>
        </ol>
        <div className="svc-urls">
          <div>
            <p className="mono svc-label">SideStore server list</p>
            <Endpoint value={SERVERS_JSON} label="Copy list" />
          </div>
          <div>
            <p className="mono svc-label">Direct server URL</p>
            <Endpoint value={ANISETTE.endpoint} />
          </div>
        </div>
        <p className="svc-small mono">Use the URL without a trailing slash. The list is a plain JSON file on GitHub Pages; the server address is the same public endpoint above.</p>
      </section>

      <section className="svc-section" aria-labelledby="running">
        <div className="svc-section-head">
          <p className="mono">Under the hood</p>
          <h2 id="running">What is actually running</h2>
        </div>
        <div className="svc-table-wrap">
          <table className="svc-table">
            <thead>
              <tr><th scope="col">Piece</th><th scope="col">Where</th><th scope="col">How</th></tr>
            </thead>
            <tbody>
              <tr><td>Desktop</td><td>{ANISETTE.host}</td><td>ZOTAC ZBOX EN1080 · i7-7700 · GTX 1080 · 32GB RAM</td></tr>
              <tr><td>T1 API</td><td>{T1.unit} · :{T1.port}</td><td>{T1.version.replace('T1 ', 'T1 API ')} · {T1.hypernix}</td></tr>
              <tr><td>Anisette</td><td>{ANISETTE.unit} · :{ANISETTE.port}</td><td>{ANISETTE.version}, anisette v1 + v3</td></tr>
              <tr><td>Relay</td><td>Tailscale Funnel · caddy-relay.service</td><td>Caddy routes <code>/anisette</code> to :6969 and everything else to :8001; Tailscale Funnel terminates TLS at <code>blazeindustries.taile82951.ts.net</code>.</td></tr>
              <tr><td>Private paths</td><td>LAN / tailnet</td><td><code>100.109.195.71:8001</code> for T1, <code>100.109.195.71:6969</code> for Anisette. The LAN addresses answer too; neither is routed publicly.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="svc-section svc-limits" aria-labelledby="limits">
        <div className="svc-section-head">
          <p className="mono">Honest limits</p>
          <h2 id="limits">What this is not</h2>
        </div>
        <ul className="svc-list">
          <li>It is a desktop, not a cloud region. When the machine sleeps or reboots, both services go with it. There is no SLA.</li>
          <li>The public hostname is a Tailscale Funnel on the tailnet’s own <code>ts.net</code> domain, with a real TLS certificate. It is still the desktop answering; Funnel is the only public ingress.</li>
          <li>T1 runs in staging mode. Public requests are treated as public: health, version, status and the model catalog are readable, but inference and administration need a key minted on the host.</li>
          <li>Anisette is a signing helper, not an Apple ID service. SideStore’s own documentation recommends a burner Apple ID with any shared anisette server, and that advice applies here too.</li>
        </ul>
        <p className="section-more mono"><Link to="/projects/hypernix-pip">HyperNix-pip project notes</Link><Link to="/links">Elsewhere <ArrowUpRight size={13} aria-hidden="true" /></Link></p>
      </section>
    </Page>
  )
}
