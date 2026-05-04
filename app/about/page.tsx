import DetailNav from '@/components/DetailNav'
import NotionBlocks, { splitBlocks, flattenBlocks } from '@/components/NotionBlocks'
import { getPageBlocks, getPagePhoto } from '@/lib/notion'

export const revalidate = 3600

const BASE = 'https://aimigo.vercel.app'
const ABOUT_OG = `${BASE}/og?title=${encodeURIComponent('關於我')}&emoji=✨&type=`

export const metadata = {
  title: '關於我 · Aimi Go 分享站',
  description: 'UIUX 設計師 Aimi，透過 Instagram 分享旅遊行程、好用工具與生活靈感。',
  openGraph: {
    title: '關於我 · Aimi Go 分享站',
    images: [ABOUT_OG],
  },
  twitter: { card: 'summary_large_image', images: [ABOUT_OG] },
}

const ABOUT_PAGE_ID = '34c18206525680369cb9dbe41b2be2f9'

const FALLBACK_STATS = [
  { num: '2018', label: '開始成為 UI/UX 設計師' },
  { num: '2022', label: '開始經營內容' },
  { num: '12+',  label: '去過的國家數' },
  { num: '100%', label: '都是真實體驗分享' },
]

function parseStats(blocks: any[]): { num: string; label: string }[] {
  const callout = blocks.find(b => b.type === 'callout' && b.callout?.icon?.emoji === '📌')
  if (!callout) return []
  return (callout.children ?? [])
    .filter((b: any) => b.type === 'bulleted_list_item')
    .map((b: any) => {
      const text = (b.bulleted_list_item?.rich_text ?? []).map((r: any) => r.plain_text).join('')
      // support both half-width | and full-width ｜
      const sep = text.search(/[|｜]/)
      if (sep === -1) return { num: text.trim(), label: '' }
      return { num: text.slice(0, sep).trim(), label: text.slice(sep + 1).trim() }
    })
}

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden
    style={{ color: 'var(--color-text-muted)', width: 14, height: 14 }}>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default async function AboutPage() {
  let stats = FALLBACK_STATS
  let bodyBlocks: any[] = []
  let faqBlocks: any[] = []
  let photo = ''

  try {
    const [rawBlocks, pagePhoto] = await Promise.all([
      getPageBlocks(ABOUT_PAGE_ID),
      getPagePhoto(ABOUT_PAGE_ID),
    ])
    photo = pagePhoto
    const { content } = splitBlocks(flattenBlocks(rawBlocks))

    const parsed = parseStats(content)
    if (parsed.length > 0) stats = parsed

    // exclude 📌 callout from body (it's rendered as stats grid)
    bodyBlocks = content.filter(b =>
      b.type !== 'toggle' && !(b.type === 'callout' && b.callout?.icon?.emoji === '📌')
    )
    faqBlocks = content.filter(b => b.type === 'toggle')
  } catch {
    // page not accessible, use fallback static content
  }

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
            <div className="about-hero-bio">UIUX 設計師 / 最近患上旅遊照拍了就一定要做成貼文強迫症</div>
          </div>
          <div className="about-social">
            <a className="about-social-link" href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">IG</a>
            <a className="about-social-link" href="https://www.threads.com/@aimi.go_" target="_blank" rel="noopener noreferrer">Threads</a>
            <a className="about-social-link" href="https://sometimesgrowth.com/" target="_blank" rel="noopener noreferrer">部落格</a>
            <a className="about-social-link" href="mailto:aimi.girr@gmail.com">Email</a>
          </div>
        </div>
      </div>

      <div className="content" style={{ paddingBottom: '3rem' }}>

        <div className="about-stats">
          {stats.map((s, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="about-collab">
          歡迎品牌合作洽談，僅接受與旅遊、設計、生活風格相關、且我有興趣親自體驗的合作。
          <br />
          <a className="about-collab-email" href="mailto:aimi.girr@gmail.com">
            aimi.girr@gmail.com
            <ExtIcon />
          </a>
        </div>

        {faqBlocks.length > 0 && (
          <div className="about-faq">
            <NotionBlocks blocks={faqBlocks} />
          </div>
        )}

      </div>
    </>
  )
}
