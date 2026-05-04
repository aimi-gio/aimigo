import Link from 'next/link'
import ShareRow from './ShareRow'

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <div className="footer-logo-dot">AG</div>
              <span className="footer-logo-name">Aimi Go 分享站</span>
            </div>
            <div className="footer-bio">這裡收集了一切能讓旅途更多靈感的東西。您的支持是我繼續分享的動力。</div>
          </div>
          <div className="footer-links">
            <a className="footer-link" href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">
              Instagram @aimi.go_ <ExtIcon />
            </a>
            <a className="footer-link" href="https://www.threads.com/@aimi.go_" target="_blank" rel="noopener noreferrer">
              Threads @aimi.go_ <ExtIcon />
            </a>
            <a className="footer-link" href="mailto:aimi.girr@gmail.com">
              aimi.girr@gmail.com
            </a>
          </div>
        </div>
        <div className="footer-nav">
          <Link href="/#section-trip">旅遊行程</Link>
          <Link href="/#section-tool">好用工具</Link>
          <Link href="/#section-template">通用模板</Link>
          <Link href="/#section-inspo">靈感收藏</Link>
          <Link href="/about">關於我</Link>
        </div>
        <ShareRow />
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Aimi Go · All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}
