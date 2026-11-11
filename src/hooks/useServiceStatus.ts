import { useCallback, useEffect, useRef, useState } from 'react'
import { ANISETTE, T1 } from '../data/services'

export type ProbeState = 'checking' | 'up' | 'down'

export interface Probe {
  state: ProbeState
  ms: number | null
  at: number | null
  detail: string | null
}

export interface T1Info {
  api: string | null
  hypernix: string | null
  models: number | null
  environment: string | null
}

const EMPTY: Probe = { state: 'checking', ms: null, at: null, detail: null }

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json() as T
}

/**
 * Probes the two public endpoints from the visitor's browser. The answer is
 * deliberately presented as "as seen from here" — a static page cannot know
 * whether a service is reachable from anywhere else.
 */
export function useServiceStatus() {
  const [t1, setT1] = useState<Probe>(EMPTY)
  const [anisette, setAnisette] = useState<Probe>(EMPTY)
  const [info, setInfo] = useState<T1Info>({ api: null, hypernix: null, models: null, environment: null })
  const [busy, setBusy] = useState(false)
  const ctrl = useRef<AbortController | null>(null)

  const check = useCallback(async () => {
    ctrl.current?.abort()
    const c = new AbortController()
    ctrl.current = c
    const timer = window.setTimeout(() => c.abort(), 9000)
    setBusy(true)
    setT1(EMPTY)
    setAnisette(EMPTY)

    const t1Start = performance.now()
    const anisetteStart = performance.now()

    const t1Health = getJson<{ status: string }>(T1.health, c.signal)
    const t1Version = getJson<{ t1_api_version?: string; hypernix?: string }>(T1.versionEndpoint, c.signal).catch(() => null)
    const t1Status = getJson<{ model_count?: number; environment?: string }>(T1.statusEndpoint, c.signal).catch(() => null)
    const anisetteProbe = getJson<{ client_info?: string }>(ANISETTE.probe, c.signal)

    const [health, version, status, anisetteResult] = await Promise.allSettled([
      t1Health,
      t1Version,
      t1Status,
      anisetteProbe,
    ])

    const now = Date.now()
    if (health.status === 'fulfilled' && health.value.status === 'ok') {
      setT1({
        state: 'up',
        ms: Math.round(performance.now() - t1Start),
        at: now,
        detail: status.status === 'fulfilled' && status.value && typeof status.value.model_count === 'number'
          ? `${status.value.model_count} models catalogued`
          : 'health answered',
      })
      setInfo({
        api: version.status === 'fulfilled' && version.value ? version.value.t1_api_version ?? null : null,
        hypernix: version.status === 'fulfilled' && version.value ? version.value.hypernix ?? null : null,
        models: status.status === 'fulfilled' && status.value ? status.value.model_count ?? null : null,
        environment: status.status === 'fulfilled' && status.value ? status.value.environment ?? null : null,
      })
    } else {
      setT1({ state: 'down', ms: Math.round(performance.now() - t1Start), at: now, detail: 'no answer from this browser' })
    }

    if (anisetteResult.status === 'fulfilled' && typeof anisetteResult.value.client_info === 'string') {
      setAnisette({
        state: 'up',
        ms: Math.round(performance.now() - anisetteStart),
        at: now,
        detail: 'v3 handshake answered',
      })
    } else {
      setAnisette({ state: 'down', ms: Math.round(performance.now() - anisetteStart), at: now, detail: 'no answer from this browser' })
    }

    window.clearTimeout(timer)
    setBusy(false)
  }, [])

  useEffect(() => {
    void check()
    return () => ctrl.current?.abort()
  }, [check])

  return { t1, anisette, info, busy, check }
}

export const clockTime = (at: number | null) =>
  at ? new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'
