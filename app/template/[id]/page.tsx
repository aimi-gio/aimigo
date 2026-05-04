import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { templates } from '@/lib/data'
import { getCardById } from '@/lib/notion'
import NotionDetailPage from '@/components/NotionDetailPage'
import DetailNav from '@/components/DetailNav'
import RelatedCard from '@/components/RelatedCard'
import BottomCta from '@/components/BottomCta'

const BASE = 'https://aimigo.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const template = templates.find(t => t.id === id)
  if (template) {
    const img = `${BASE}/og?title=${encodeURIComponent(template.title)}&emoji=${encodeURIComponent(template.emoji)}&type=template`
    return {
      title: `${template.title} · Aimi Go 分享站`,
      openGraph: { title: template.title, images: [img] },
      twitter: { card: 'summary_large_image', images: [img] },
    }
  }
  const card = await getCardById(id)
  if (!card) return {}
  const img = `${BASE}/og?title=${encodeURIComponent(card.name)}&emoji=${encodeURIComponent(card.icon)}&type=template`
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

const IntIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const templateDetails: Record<string, {
  tags: string[]
  previewCaption: string
  what: string[]
  steps: Array<{ title: string; desc: string; linkHref?: string; linkLabel?: string; linkExternal?: boolean }>
  related: Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>
  disclaimer?: string
  ctaHref: string
  ctaLabel: string
  lastUpdated: string
}> = {
  figma: {
    tags: ['Figma', '穿搭', '行李準備'],
    previewCaption: 'Figma 紙娃娃模板，把每件衣服拍照上傳，拖拉組合成每日穿搭，一眼確認行李清單。',
    what: [
      '把每件備選衣服拍照上傳，視覺化管理行李',
      '拖拉組合每天的上下身搭配，確認互相搭配',
      '避免帶了一堆衣服卻沒有搭好的問題',
      '旅途中也可以用手機開 Figma 隨時查看',
    ],
    steps: [
      { title: '開啟 Figma，登入或免費註冊', desc: 'Figma 免費版就夠用，不需要付費方案。用 Google 帳號登入最快。' },
      { title: '複製我的模板到你的帳號', desc: '點上方「開啟 Figma 檔案」，進去後點右上角「Duplicate to your drafts」就複製完成了。' },
      {
        title: '把備選衣服拍照，上傳到 Figma',
        desc: '建議拍攝時放在白色或淺色背景，去背更方便。也可以直接用購物網站的商品圖。',
        linkHref: '#', linkLabel: '這個步驟看影片更清楚', linkExternal: true,
      },
      { title: '拖拉衣服組合每天的穿搭', desc: '每一天一個 frame，把上衣、下身、外套、鞋子拖進去排列，確認搭配後就是你的行李清單。' },
      {
        title: '出發！旅途中用手機 Figma App 查看',
        desc: '下載 Figma App，登入後就能看到你的穿搭計劃，每天對著它打包就不會忘記。',
        linkHref: '/template/ai-outfit', linkLabel: '搭配 AI 穿搭建議指令效果更好', linkExternal: false,
      },
    ],
    related: [
      { href: '#', emoji: '👗', type: 'YouTube 影片', title: '用 Figma 做旅遊穿搭紙娃娃', desc: '完整操作示範，從上傳衣服到排列每日穿搭' },
      { href: '#', emoji: '👗', type: 'Instagram 貼文', title: '旅遊行李準備心法', desc: '搭配紙娃娃模板使用，三人同行不需要托運的打包方式' },
    ],
    disclaimer: '這份模板免費開放使用，歡迎複製後自行調整。如果覺得有幫助，歡迎分享給朋友或標記 @aimi.go_ 讓我看看你的使用心得！',
    ctaHref: '#',
    ctaLabel: '開啟 Figma 模板',
    lastUpdated: '2025/11/17',
  },
}

const defaultDetail = {
  tags: [] as string[],
  previewCaption: '模板預覽截圖',
  what: ['模板說明整理中，敬請期待'] as string[],
  steps: [] as Array<{ title: string; desc: string; linkHref?: string; linkLabel?: string; linkExternal?: boolean }>,
  related: [] as Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>,
  ctaHref: '/',
  ctaLabel: '返回首頁',
  lastUpdated: '更新中',
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const template = templates.find((t) => t.id === id)
  if (!template) {
    const card = await getCardById(id)
    if (!card || card.type !== '通用模板') notFound()
    return <NotionDetailPage card={card} backHref="/?tab=template" backLabel="通用模板" colorVar="--color-template" variant="template" />
  }

  const detail = templateDetails[id] ?? defaultDetail

  return (
    <>
      <DetailNav title={template.title} backHref="/?tab=template" backLabel="通用模板" />

      <div className="hero" style={{ background: 'var(--color-template)' }}>
        <div className="hero-bg">{template.emoji}</div>
        <div className="hero-overlay">
          <div className="hero-title">{template.title}</div>
          <div className="hero-cta-row">
            <a className="btn-hero-primary" href={detail.ctaHref} target="_blank" rel="noopener noreferrer">
              開啟模板 <ExtIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">通用模板</span>
            {detail.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="last-updated">
            <div className="last-updated-dot" />
            最後更新 {detail.lastUpdated}
          </div>
        </div>

        <div className="section-title">模板預覽</div>
        <div className="preview-box">
          <div className="preview-img">
            <div className="preview-img-icon">{template.emoji}</div>
            <div className="preview-img-label">預覽截圖由你提供</div>
          </div>
          <div className="preview-caption">{detail.previewCaption}</div>
        </div>

        <div className="section-title">這個模板能幫你做什麼</div>
        <div className="what-box">
          <div className="what-list">
            {detail.what.map((item, i) => (
              <div key={i} className="what-item">
                <div className="what-dot" style={{ background: 'var(--color-template)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {detail.steps.length > 0 && (
          <>
            <div className="section-title">怎麼使用？</div>
            <div className="steps">
              {detail.steps.map((step, i) => (
                <div key={i} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                    {step.linkHref && step.linkLabel && (
                      <a
                        className={`step-link${step.linkExternal === false ? ' step-link-internal' : ''}`}
                        href={step.linkHref}
                        target={step.linkExternal !== false ? '_blank' : undefined}
                        rel={step.linkExternal !== false ? 'noopener noreferrer' : undefined}
                      >
                        {step.linkLabel}
                        {step.linkExternal !== false ? <ExtIcon /> : <IntIcon />}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {detail.related.length > 0 && (
          <>
            <div className="section-title">相關內容 · 網址</div>
            <div className="related">
              {detail.related.map((r, i) => (
                <RelatedCard key={i} {...r} />
              ))}
            </div>
          </>
        )}

        {detail.disclaimer && (
          <div className="disclaimer">{detail.disclaimer}</div>
        )}
      </div>

      <BottomCta
        href={detail.ctaHref}
        label={detail.ctaLabel}
        variant="template"
        external
        moreHref="/?tab=template"
        moreLabel="看更多模板"
      />
    </>
  )
}
