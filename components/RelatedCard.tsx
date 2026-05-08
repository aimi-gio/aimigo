import type { CSSProperties } from 'react'

interface RelatedCardProps {
  href: string
  emoji?: string
  type: string
  title: string
  desc?: string
  thumbnail?: string
  external?: boolean
  colorVar?: string
}

function sourceStyle(source: string): CSSProperties {
  if (source === 'Instagram') return {
    background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }
  if (source === 'Threads') return { color: '#000000' }
  if (source === 'YouTube') return { color: '#FF0000' }
  return {}
}

function thumbBg(source: string, colorVar?: string): string {
  if (source === 'Instagram') return 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)'
  if (source === 'Threads') return '#000000'
  if (source === 'YouTube') return '#FF0000'
  return colorVar ? `var(${colorVar})` : 'var(--color-primary-light)'
}

export default function RelatedCard({ href, emoji, type, title, desc, thumbnail, external = true, colorVar }: RelatedCardProps) {
  return (
    <a
      className="related-card"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <div className="related-thumb">
        {thumbnail
          ? <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div className="related-thumb-placeholder" style={{ background: thumbBg(type, colorVar) }}>
              {emoji ?? '🔗'}
            </div>
        }
      </div>
      <div className="related-info">
        <div className="related-type" style={sourceStyle(type)}>{type}</div>
        <div className="related-title">{title}</div>
        {desc && <div className="related-desc">{desc}</div>}
      </div>
      {external && (
        <svg style={{ width: 16, height: 16, color: 'var(--color-text-muted)', flexShrink: 0, paddingRight: '20px' }}
          viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </a>
  )
}
