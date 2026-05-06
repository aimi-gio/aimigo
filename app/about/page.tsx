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
const SPECIAL = ['全網簡介', '隱私權聲明']

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden
    style={{ color: 'currentColor', width: 13, height: 13 }}>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default async function AboutPage() {
  let records: Awaited<ReturnType<typeof getAboutRecords>> = []
  let photo = ''

  try {
    const [recs, ph] = await Promise.all([
      getAboutRecords(ABOUT_PAGE_ID),
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

      <div className="hero" style={{ background: 'var(--color-primary)' }}>
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
          {linkRecords.length > 0 && (
            <div className="about-social">
              {linkRecords.map((r, i) => (
                <a
                  key={i}
                  className="about-social-link"
                  href={r.desc}
                  target={r.desc.startsWith('mailto:') ? undefined : '_blank'}
                  rel={r.desc.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  {r.item}
                  {!r.desc.startsWith('mailto:') && <ExtIcon />}
                </a>
              ))}
            </div>
          )}
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
          <div className="article-body" style={{ marginBottom: '2rem' }}>
            {bioRecords.map((r, i) => <p key={i}>{r.desc}</p>)}
          </div>
        )}

        <div className="about-collab">
          歡迎品牌合作洽談，僅接受與旅遊、設計、生活風格相關、且我有興趣親自體驗的合作。
          <br />
          <a className="about-collab-email" href="mailto:aimi.girr@gmail.com">
            aimi.girr@gmail.com
            <ExtIcon />
          </a>
        </div>

      </div>
    </>
  )
}
