import DetailNav from '@/components/DetailNav'
import { getAboutRecords, getPagePhoto } from '@/lib/notion'

export const revalidate = 3600

const BASE = 'https://aimigo.vercel.app'
const ABOUT_OG = `${BASE}/og?title=${encodeURIComponent('關於我')}&emoji=✨&type=`

export const metadata = {
  title: '關於我 · Aimi Go 分享站',
  description: 'UIUX 設計師 Aimi，透過 Instagram 分享旅遊行程、好用工具與生活靈感。',
  openGraph: { title: '關於我 · Aimi Go 分享站', images: [ABOUT_OG] },
  twitter: { card: 'summary_large_image', images: [ABOUT_OG] },
}

const ABOUT_PAGE_ID = process.env.NOTION_ABOUT_PAGE_ID ?? '34c18206525680369cb9dbe41b2be2f9'
const SPECIAL = ['全網簡介', '隱私權聲明', '我是']

const IconInsta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/>
  </svg>
)

const IconThreads = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
  </svg>
)

const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
)

const ExtArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, color: 'var(--color-text-muted)' }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
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

export default async function AboutPage() {
  let records: Awaited<ReturnType<typeof getAboutRecords>> = []
  let photo = ''

  try {
    const [recs, ph] = await Promise.all([
      getAboutRecords(),
      getPagePhoto(ABOUT_PAGE_ID),
    ])
    records = recs
    photo = ph
  } catch {}

  const siteDesc = records.find(r => r.item === '全網簡介')?.desc ?? ''
  const statRecords = records.filter(r => r.type === '數字')
  const linkRecords = records.filter(r => r.type === '連結')
  const bioRecords  = records.filter(r => r.type === '簡介' && !SPECIAL.includes(r.item))

  return (
    <>
      <DetailNav title="關於我" backHref="/" backLabel="首頁" />

      <div className="hero about-hero" style={{ background: 'var(--color-primary)' }}>
        <div className="about-hero-pattern" />
        <div className="about-hero-content">
          <div className="about-avatar">
            {photo
              ? <img src={photo} alt="Aimi" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span>AG</span>
            }
          </div>
          <div>
            <div className="about-hero-name">艾米 Aimi</div>
            {siteDesc && <div className="about-hero-bio">{siteDesc}</div>}
          </div>
        </div>
      </div>

      <div className="content" style={{ paddingBottom: '3rem' }}>

        {statRecords.length > 0 && (
          <div className="about-stats">
            {statRecords.map((r, i) => (
              <div key={i} className="about-stat">
                <div className="about-stat-num">{r.desc}</div>
                <div className="about-stat-label">{r.item}</div>
              </div>
            ))}
          </div>
        )}

        {bioRecords.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            {bioRecords.map((r, i) => (
              <div key={i} className="about-bio-section">
                <h3 className="about-bio-heading">{r.item}</h3>
                <p className="about-bio-text">{r.desc}</p>
                {r.note && <p className="about-bio-note">{r.note}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="about-collab">
          歡迎品牌合作洽談，僅接受與旅遊、設計、生活風格相關、且我有興趣親自體驗的合作。
          <br />
          <a className="about-collab-email" href="mailto:aimi.girr@gmail.com">
            aimi.girr@gmail.com
          </a>
        </div>

        {linkRecords.length > 0 && (
          <div className="about-links">
            {linkRecords.map((r, i) => {
              const href = getLinkHref(r.desc)
              return (
                <a
                  key={i}
                  className="about-link-item"
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  <div className="about-link-icon">
                    {getLinkIcon(r.item)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="about-link-label">{r.item}</div>
                    {r.note && <div className="about-link-url">{r.note}</div>}
                  </div>
                  <ExtArrow />
                </a>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}
