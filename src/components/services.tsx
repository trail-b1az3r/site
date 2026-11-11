import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import type { Probe } from '../hooks/useServiceStatus'

export function StatusPill({ probe, compact = false }: { probe: Probe; compact?: boolean }) {
  const label = probe.state === 'up' ? 'up' : probe.state === 'down' ? 'no answer' : 'checking'
  return (
    <span className={`svc-pill ${probe.state}`} title={probe.detail ?? undefined}>
      <i className="svc-dot" aria-hidden="true" />
      <span>{label}</span>
      {!compact && probe.state === 'up' && probe.ms !== null && <span className="svc-ms mono">{probe.ms} ms</span>}
    </span>
  )
}

export function CopyButton({ value, label = 'Copy URL' }: { value: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('done')
      window.setTimeout(() => setState('idle'), 1600)
    } catch {
      setState('failed')
      window.setTimeout(() => setState('idle'), 2200)
    }
  }
  return (
    <button className="copy-btn mono" type="button" onClick={copy} aria-live="polite">
      {state === 'done' ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}
    </button>
  )
}

export function ServiceLine({
  to, index, name, role, probe, endpoint,
}: {
  to: string
  index: string
  name: string
  role: string
  probe: Probe
  endpoint: string
}) {
  return (
    <Link to={to} className="svc-line">
      <span className="svc-line-n mono" aria-hidden="true">{index}</span>
      <span className="svc-line-main">
        <span className="svc-line-name">{name}</span>
        <span className="svc-line-role">{role}</span>
      </span>
      <span className="svc-line-end mono">{endpoint.replace(/^https?:\/\//, '')}</span>
      <StatusPill probe={probe} compact />
      <ArrowUpRight className="svc-line-arrow" size={18} aria-hidden="true" />
    </Link>
  )
}

export function StatusSummary({ t1, anisette }: { t1: Probe; anisette: Probe }) {
  const up = [t1, anisette].filter(p => p.state === 'up').length
  const checking = [t1, anisette].some(p => p.state === 'checking')
  return (
    <p className="svc-summary mono" aria-live="polite">
      {checking ? 'checking both endpoints' : `${up} of 2 answering from this browser`}
    </p>
  )
}
