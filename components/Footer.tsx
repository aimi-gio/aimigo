import Link from 'next/link'
import ShareRow from './ShareRow'
import { getAboutRecords } from '@/lib/notion'

const IconInsta = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/>
  </svg>
)

const IconThreads = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
  </svg>
)

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
)

function getLinkIcon(item: string) {
  if (item === 'Instagram') return <IconInsta />
  if (item === 'Threads') return <IconThreads />
  if (item === '聯絡信箱') return <IconEmail />
  return <IconGlobe />
}

function getLinkHref(desc: string) {
  if (desc.startsWith('http') || desc.startsWith('mailto:')) return desc
  if (desc.includes('@') && !desc.includes('/')) return `mailto:${desc}`
  return desc
}

export default async function Footer() {
  let bio = '這裡收集了一切能讓旅途更多靈感的東西。'
  let linkRecords: { item: string; desc: string; note: string }[] = []

  try {
    const records = await getAboutRecords()
    bio = records.find(r => r.item === '全網簡介')?.desc ?? bio
    linkRecords = records.filter(r => r.type === '連結')
  } catch {}

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/site-icon.png" alt="Aimi" className="footer-logo-dot" />
            <span className="footer-logo-name">Aimi Go 分享站</span>
          </div>
          <div className="footer-bio">{bio}</div>
          {linkRecords.length > 0 && (
            <div className="footer-icon-links">
              {linkRecords.map((r, i) => {
                const href = getLinkHref(r.desc)
                return (
                  <a
                    key={i}
                    className="footer-icon-link"
                    href={href}
                    title={r.item}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  >
                    {getLinkIcon(r.item)}
                  </a>
                )
              })}
            </div>
          )}
        </div>
        <div className="footer-nav">
          <Link href="/#section-trip">旅遊行程</Link>
          <Link href="/#section-tool">好用工具</Link>
          <Link href="/#section-template">通用模板</Link>
          <Link href="/#section-inspo">靈感收藏</Link>
          <Link href="/about">關於我</Link>
        </div>
        <div className="footer-bottom">
          <ShareRow />
          <span className="footer-copy">© 2026 Aimi Go · All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}
