import type { ReactNode } from 'react'

// A deliberately small Markdown renderer for README excerpts.
// It covers headings, lists, blockquotes, fenced code, links, bold, italics and
// inline code. Everything is emitted as React nodes, so no HTML is injected.
type Block =
  | { kind: 'h'; level: number; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'code'; text: string }

const link = /\[([^\]]+)\]\(([^)\s]+)\)/g
const bold = /\*\*([\s\S]+?)\*\*/g
const italic = /(^|[\s(])\*([^*\n]+)\*/g
const code = /`([^`]+)`/g

function inline(text: string, key: string): ReactNode[] {
  // Pull links out first; then format the remaining plain segments.
  const parts: ReactNode[] = []
  let rest = text
  let m: RegExpExecArray | null
  let i = 0
  link.lastIndex = 0
  while ((m = link.exec(rest))) {
    format(rest.slice(0, m.index)).forEach(n => parts.push(n))
    const href = /^https?:\/\//.test(m[2]) ? m[2] : undefined
    parts.push(href
      ? <a key={`${key}-l${i++}`} href={href} target="_blank" rel="noreferrer">{format(m[1])}</a>
      : <span key={`${key}-l${i++}`}>{m[1]}</span>)
    rest = rest.slice(m.index + m[0].length)
    link.lastIndex = 0
  }
  format(rest).forEach(n => parts.push(n))
  return parts
}

function format(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let rest = text, i = 0
  const patterns: [RegExp, (m: RegExpExecArray, k: string) => ReactNode][] = [
    [code, (m, k) => <code key={k}>{m[1]}</code>],
    [bold, (m, k) => <strong key={k}>{format(m[1])}</strong>],
    [italic, (m, k) => <span key={k}>{m[1]}<em>{format(m[2])}</em></span>],
  ]
  while (rest) {
    let best: { index: number; m: RegExpExecArray; make: (m: RegExpExecArray, k: string) => ReactNode } | null = null
    for (const [re, make] of patterns) {
      re.lastIndex = 0
      const m = re.exec(rest)
      if (m && (!best || m.index < best.index)) best = { index: m.index, m, make }
    }
    if (!best) { out.push(rest); break }
    if (best.index > 0) out.push(rest.slice(0, best.index))
    out.push(best.make(best.m, `i${i++}`))
    rest = rest.slice(best.index + best.m[0].length)
  }
  return out
}

function parse(src: string): Block[] {
  const lines = src.split('\n')
  const blocks: Block[] = []
  let p: string[] = []
  const flush = () => { if (p.length) { blocks.push({ kind: 'p', text: p.join(' ') }); p = [] } }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], t = line.trim()
    if (!t) { flush(); continue }
    if (t.startsWith('```')) {
      flush()
      const buf: string[] = []
      for (i++; i < lines.length && !lines[i].trim().startsWith('```'); i++) buf.push(lines[i])
      blocks.push({ kind: 'code', text: buf.join('\n') })
      continue
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(t)
    if (h) { flush(); blocks.push({ kind: 'h', level: h[1].length, text: h[2] }); continue }
    if (/^>\s?/.test(t)) { flush(); blocks.push({ kind: 'quote', text: t.replace(/^>\s?/, '') }); continue }
    if (/^[-*+]\s+/.test(t)) {
      flush()
      const items: string[] = []
      for (; i < lines.length; i++) {
        const l = lines[i].trim()
        if (/^[-*+]\s+/.test(l)) items.push(l.replace(/^[-*+]\s+/, ''))
        else if (l && !/^```/.test(l) && !/^>/.test(l) && !/^#{1,4}\s/.test(l) && !/^\d+\.\s/.test(l)) items[items.length - 1] += ' ' + l
        else { i--; break }
      }
      blocks.push({ kind: 'ul', items }); continue
    }
    if (/^\d+\.\s+/.test(t)) {
      flush()
      const items: string[] = []
      for (; i < lines.length; i++) {
        const l = lines[i].trim()
        if (/^\d+\.\s+/.test(l)) items.push(l.replace(/^\d+\.\s+/, ''))
        else if (l && !/^```/.test(l) && !/^>/.test(l) && !/^[-*+]\s/.test(l) && !/^#{1,4}\s/.test(l)) items[items.length - 1] += ' ' + l
        else { i--; break }
      }
      blocks.push({ kind: 'ol', items }); continue
    }
    p.push(t.replace(/<[^>]+>/g, ''))
  }
  flush()
  return blocks
}

export default function Markdown({ text }: { text: string }) {
  return (
    <div className="readme-md">
      {parse(text).map((b, i) => {
        if (b.kind === 'h') {
          const inner = inline(b.text, `h${i}`)
          return b.level <= 2 ? <h3 key={i}>{inner}</h3> : <h4 key={i}>{inner}</h4>
        }
        if (b.kind === 'ul') return <ul key={i}>{b.items.map((t, j) => <li key={j}>{inline(t, `u${i}-${j}`)}</li>)}</ul>
        if (b.kind === 'ol') return <ol key={i}>{b.items.map((t, j) => <li key={j}>{inline(t, `o${i}-${j}`)}</li>)}</ol>
        if (b.kind === 'quote') return <blockquote key={i}>{inline(b.text, `q${i}`)}</blockquote>
        if (b.kind === 'code') return <pre key={i}>{b.text}</pre>
        return <p key={i}>{inline(b.text, `p${i}`)}</p>
      })}
    </div>
  )
}
