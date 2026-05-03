import Link from 'next/link'

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">Aimi Go</Link>
      <div className="nav-links">
        <Link href="/about">關於我</Link>
        <a href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">
          Instagram <ExtIcon />
        </a>
      </div>
    </nav>
  )
}
