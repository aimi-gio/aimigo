import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { tools } from '@/lib/data'
import { getCardById } from '@/lib/notion'
import NotionDetailPage from '@/components/NotionDetailPage'
import DetailNav from '@/components/DetailNav'
import RelatedCard from '@/components/RelatedCard'
import BottomCta from '@/components/BottomCta'
import NotionEmbed from '@/components/NotionEmbed'

const BASE = 'https://aimigo.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const tool = tools.find(t => t.id === id)
  if (tool) {
    const img = `${BASE}/og?title=${encodeURIComponent(tool.title)}&emoji=${encodeURIComponent(tool.emoji)}&type=tool`
    return {
      title: `${tool.title} · Aimi Go 分享站`,
      openGraph: { title: tool.title, images: [img] },
      twitter: { card: 'summary_large_image', images: [img] },
    }
  }
  const card = await getCardById(id)
  if (!card) return {}
  const img = `${BASE}/og?title=${encodeURIComponent(card.name)}&emoji=${encodeURIComponent(card.icon)}&type=tool`
  return {
    title: `${card.name} · Aimi Go 分享站`,
    openGraph: { title: card.name, images: [img] },
    twitter: { card: 'summary_large_image', images: [img] },
  }
}

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const toolDetails: Record<string, {
  tags: string[]
  variant: 'rich' | 'light'
  trustStats?: Array<{ num: string; label: string }>
  notionTitle?: string
  articleLink?: { href: string; title: string; desc: string; urlLabel: string; emoji: string }
  rewardNum?: string
  rewardTitle?: string
  rewardDesc?: string
  howSteps?: Array<{ title: string; sub: string }>
  useCases?: Array<{ icon: string; text: string }>
  disclaimer: string
  ctaHref: string
  ctaLabel: string
  heroCta?: string
  lastUpdated: string
}> = {
  esim: {
    tags: ['長期合作', 'eSIM', '出國必備'],
    variant: 'rich',
    trustStats: [
      { num: '9+', label: '本人實測國家' },
      { num: '免會員', label: '直接購買不用註冊' },
      { num: 'EMAIL', label: '購買後直接寄送' },
    ],
    notionTitle: 'e心通方案紀錄 · 使用教學 · 常見問題',
    articleLink: {
      href: 'https://sometimesgrowth.com/esimconnect/',
      title: 'e心通的 eSIM 好用嗎？真心實測紀錄分享',
      desc: '曾經我也買過各種品牌的 eSIM，但我這次會特別推薦 e心通，是因為每次出國前都得花時間切換不同電商平台...',
      urlLabel: 'sometimesgrowth.com/esimconnect',
      emoji: '☁️',
    },
    disclaimer: '使用我的分潤連結購買不會讓你多付任何費用，但能支持我持續分享更多旅遊內容，謝謝你！',
    ctaHref: 'https://esimconnect.com.tw/#/access/esimbuy?referencecode=oigimia',
    ctaLabel: '用我的連結購買 e心通 eSIM',
    heroCta: '前往購買',
    lastUpdated: '2026/1/15',
  },
  shopback: {
    tags: ['購物回饋', '省錢技巧'],
    variant: 'light',
    rewardNum: '$100',
    rewardTitle: '透過我的連結註冊，你我各得 100 獎金',
    rewardDesc: '完成首次購物任務後即可領取，獎金可直接折抵下次消費或提領。開購網站前先開 Shopback，已經是我出門購物前的固定習慣。',
    howSteps: [
      { title: '點我的連結前往 Shopback 註冊', sub: '用 Email 或 Google 帳號都可以，幾秒完成' },
      { title: '購物前先開 Shopback，找到你要的商家', sub: '機票、飯店、網購幾乎都有合作，點進去再去買' },
      { title: '完成購買，等待回饋入帳', sub: '通常幾天內會顯示待確認，訂單完成後正式到帳' },
      { title: '累積獎金，提領或折抵', sub: '達到最低提領門檻後可轉帳到銀行帳戶' },
    ],
    useCases: [
      { icon: '✈', text: '機票（Expedia、Trip.com、各大航空）' },
      { icon: '🏨', text: '住宿（Booking.com、Agoda、Hotels.com）' },
      { icon: '🛍️', text: '網購（蝦皮、momo、ZALORA）' },
      { icon: '🍔', text: '外送（Foodpanda、Uber Eats）' },
    ],
    disclaimer: '透過我的連結註冊不會讓你多付任何費用，Shopback 的回饋是商家支付的行銷費用，和你的購買價格無關。',
    ctaHref: 'https://www.shopback.com.tw/',
    ctaLabel: '用我的連結註冊 Shopback，領 $100 獎金',
    heroCta: '前往註冊，領 100 獎金',
    lastUpdated: '2026/2/21',
  },
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const tool = tools.find((t) => t.id === id && !t.inviteCode && t.ctaHref !== '#')
  if (!tool || !toolDetails[id]) {
    const card = await getCardById(id)
    if (!card || card.type !== '好用工具') notFound()
    return <NotionDetailPage card={card} backHref="/?tab=tool" backLabel="好用工具" colorVar="--color-tool" variant="tool" />
  }

  const detail = toolDetails[id]

  return (
    <>
      <DetailNav title={tool.title} backHref="/?tab=tool" backLabel="好用工具" />

      <div className="hero" style={{ background: 'var(--color-tool)' }}>
        <div className="hero-bg">{tool.emoji}</div>
        <div className="hero-overlay">
          <div className="hero-title">{tool.title}</div>
          <div className="hero-cta-row">
            <a className="btn-hero-primary" href={detail.ctaHref} target="_blank" rel="noopener noreferrer">
              {detail.heroCta ?? tool.ctaText} <ExtIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">好用工具</span>
            {detail.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="last-updated">
            <div className="last-updated-dot" />
            最後更新 {detail.lastUpdated}
          </div>
        </div>

        {detail.variant === 'rich' && (
          <>
            {detail.trustStats && (
              <div className="trust-row">
                {detail.trustStats.map((s, i) => (
                  <div key={i} className="trust-card">
                    <div className="trust-num">{s.num}</div>
                    <div className="trust-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="section-title">我買過的方案 · 使用教學</div>
            <NotionEmbed
              title={detail.notionTitle ?? `${tool.title} 使用教學`}
              sub="實際部署時嵌入你的 Notion 頁面連結"
            />

            {detail.articleLink && (
              <>
                <div className="section-title">完整評測文章</div>
                <a className="article-card" href={detail.articleLink.href} target="_blank" rel="noopener noreferrer">
                  <div className="article-card-text">
                    <div className="article-card-title">{detail.articleLink.title}</div>
                    <div className="article-card-desc">{detail.articleLink.desc}</div>
                    <div className="article-card-url">
                      {detail.articleLink.urlLabel} <ExtIcon />
                    </div>
                  </div>
                  <div className="article-card-img">{detail.articleLink.emoji}</div>
                </a>
              </>
            )}
          </>
        )}

        {detail.variant === 'light' && (
          <>
            <div className="section-title">新用戶獎勵</div>
            <div className="reward-box">
              <div className="reward-num">{detail.rewardNum}</div>
              <div className="reward-text">
                <div className="reward-title">{detail.rewardTitle}</div>
                <div className="reward-desc">{detail.rewardDesc}</div>
              </div>
            </div>

            {detail.howSteps && (
              <>
                <div className="section-title">怎麼用？</div>
                <div className="how-box">
                  {detail.howSteps.map((step, i) => (
                    <div key={i} className="how-item">
                      <div className="how-num">{i + 1}</div>
                      <div className="how-content">
                        <div className="how-title">{step.title}</div>
                        <div className="how-sub">{step.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {detail.useCases && (
              <>
                <div className="section-title">我用來買什麼</div>
                <div className="use-cases">
                  {detail.useCases.map((u, i) => (
                    <div key={i} className="use-item">
                      <span className="use-icon">{u.icon}</span>
                      {u.text}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="section-title">真的有在賺 · 截圖證明</div>
            <div className="proof-grid">
              <div className="proof-card">
                <div className="proof-img">
                  <div className="proof-img-icon">📸</div>
                  <div className="proof-img-label">截圖由你提供</div>
                </div>
                <div className="proof-caption">累積回饋截圖</div>
              </div>
              <div className="proof-card">
                <div className="proof-img">
                  <div className="proof-img-icon">📸</div>
                  <div className="proof-img-label">截圖由你提供</div>
                </div>
                <div className="proof-caption">提領紀錄截圖</div>
              </div>
            </div>
          </>
        )}

        <div className="disclaimer">{detail.disclaimer}</div>
      </div>

      <BottomCta
        href={detail.ctaHref}
        label={detail.ctaLabel}
        variant="tool"
        external
        moreHref="/?tab=tool"
        moreLabel="看更多工具"
      />
    </>
  )
}
