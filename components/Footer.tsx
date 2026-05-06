import Link from 'next/link'
import ShareRow from './ShareRow'
import { getAboutRecords } from '@/lib/notion'

const ABOUT_PAGE_ID = process.env.NOTION_ABOUT_PAGE_ID ?? '34c18206525680369cb9dbe41b2be2f9'

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export default async function Footer() {
  let bio = '這裡收集了一切能讓旅途更多靈感的東西。'
  let linkRecords: { item: string; desc: string; note: string }[] = []
  let privacyText = ''

  try {
    const records = await getAboutRecords()
    bio = records.find(r => r.item === '全網簡介')?.desc ?? bio
    privacyText = records.find(r => r.item === '隱私權聲明')?.desc ?? ''
    linkRecords = records.filter(r => r.type === '連結')
  } catch {}

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <img src="/site-icon.png" alt="Aimi" className="footer-logo-dot" />
              <span className="footer-logo-name">Aimi Go 分享站</span>
            </div>
            <div className="footer-bio">{bio}</div>
          </div>
          {linkRecords.length > 0 && (
            <div className="footer-links">
              {linkRecords.map((r, i) => (
                <div key={i}>
                  <a
                    className="footer-link"
                    href={r.desc}
                    target={r.desc.startsWith('mailto:') ? undefined : '_blank'}
                    rel={r.desc.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  >
                    {r.item}
                    {!r.desc.startsWith('mailto:') && <ExtIcon />}
                  </a>
                  {r.note && <div className="footer-link-note">{r.note}</div>}
                </div>
              ))}
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
        <ShareRow />
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Aimi Go · All Rights Reserved</span>
          {privacyText && <span className="footer-privacy">{privacyText}</span>}
        </div>
      </div>
    </footer>
  )
}
