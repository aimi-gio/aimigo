import Link from 'next/link'

const ExtIcon = () => (
  <svg style={{ width: 14, height: 14, flexShrink: 0 }} viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface BottomCtaProps {
  href: string
  label: string
  variant?: 'trip' | 'tool' | 'template' | 'inspo' | 'ig'
  external?: boolean
  moreHref?: string
  moreLabel?: string
  hideButton?: boolean
}

export default function BottomCta({ href, label, variant = 'trip', external = false, moreHref, moreLabel, hideButton = false }: BottomCtaProps) {
  const variantClass = variant === 'ig' ? 'bottom-cta-ig' : `bottom-cta-${variant}`
  const ctaStyle = variant !== 'ig' ? { background: `var(--color-${variant})` } : {}

  return (
    <>
      {!hideButton && (
        <div className="bottom-cta-wrap">
          {external ? (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className={`bottom-cta ${variantClass}`} style={ctaStyle}>
              <span>{label}</span>
              <ExtIcon />
            </a>
          ) : (
            <Link href={href} className={`bottom-cta ${variantClass}`} style={ctaStyle}>
              <span>{label}</span>
            </Link>
          )}
        </div>
      )}
      {moreHref && moreLabel && (
        <div className="text-link-wrap">
          <Link href={moreHref} className="text-link-arrow">
            {moreLabel}
            <ArrowIcon />
          </Link>
        </div>
      )}
    </>
  )
}
