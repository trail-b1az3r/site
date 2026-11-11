// Real endpoints for the two services running on the home desktop.
// Keep this file honest: if a host or version changes, change it here.
export const PUBLIC_ORIGIN = 'https://blazeindustries.taile82951.ts.net'
export const SITE_ORIGIN = 'https://trail-b1az3r.github.io'
export const SERVERS_JSON = `${SITE_ORIGIN}/site/servers.json`

export const ANISETTE = {
  id: 'anisette',
  index: '01',
  name: 'Anisette v3',
  role: 'SideStore signing helper',
  summary:
    'A public anisette-v3 server for SideStore. It answers the signing handshake with a spoofed Mac’s anisette data; no Apple account credentials are sent to it.',
  endpoint: `${PUBLIC_ORIGIN}/anisette`,
  probe: `${PUBLIC_ORIGIN}/anisette/v3/client_info`,
  docs: 'https://docs.sidestore.io/docs/advanced/anisette',
  source: 'https://github.com/Dadoum/anisette-v3-server',
  version: 'anisette-v3-server v2.2.2',
  host: 'blazeindustries',
  unit: 'anisette-v3.service',
  port: '6969',
  note: 'The public URL is TLS at the Funnel; the process itself listens on the desktop.',
  facts: [
    ['Protocol', 'Anisette v1 and v3'],
    ['Runtime', 'systemd user unit'],
    ['Exposure', 'Public HTTPS + LAN/tailnet :6969'],
  ],
} as const

export const T1 = {
  id: 't1',
  index: '02',
  name: 'HyperNix T1',
  role: 'Model API + HyperLink',
  summary:
    'The T1 API control plane for the models on the desktop: catalog, keys, jobs and the inference surface HyperLink talks to. It is keyed; the public catalog and health endpoints are readable without one.',
  endpoint: PUBLIC_ORIGIN,
  health: `${PUBLIC_ORIGIN}/health`,
  versionEndpoint: `${PUBLIC_ORIGIN}/version`,
  statusEndpoint: `${PUBLIC_ORIGIN}/status`,
  docs: 'https://github.com/trail-b1az3r/HyperNix-pip',
  source: 'https://github.com/trail-b1az3r/HyperNix-pip',
  version: 'T1 v1.2.26.11.0.0',
  hypernix: 'HyperNix 0.73.0.dev2',
  host: 'blazeindustries',
  unit: 'hypernix-t1.service',
  port: '8001',
  note: 'Public requests are classified as public, so keyless access stops at the catalog. Keys are minted on the host.',
  facts: [
    ['Transport', 'HTTP + SSE'],
    ['Runtime', 'systemd user unit'],
    ['Exposure', 'Public HTTPS + LAN/tailnet :8001'],
  ],
} as const
