import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { inspo } from '@/lib/data'
import { getCardById } from '@/lib/notion'
import NotionDetailPage from '@/components/NotionDetailPage'
import DetailNav from '@/components/DetailNav'
import RelatedCard from '@/components/RelatedCard'
import BottomCta from '@/components/BottomCta'

const BASE = 'https://aimigo.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = inspo.find(i => i.id === id)
  if (item) {
    const img = `${BASE}/og?title=${encodeURIComponent(item.title)}&emoji=${encodeURIComponent(item.emoji)}&type=inspo`
    return {
      title: `${item.title} · Aimi Go 分享站`,
      openGraph: { title: item.title, images: [img] },
      twitter: { card: 'summary_large_image', images: [img] },
    }
  }
  const card = await getCardById(id)
  if (!card) return {}
  const img = `${BASE}/og?title=${encodeURIComponent(card.name)}&emoji=${encodeURIComponent(card.icon)}&type=inspo`
  return {
    title: `${card.name} · Aimi Go 分享站`,
    openGraph: { title: card.name, images: [img] },
    twitter: { card: 'summary_large_image', images: [img] },
  }
}

const inspoDetails: Record<string, {
  tags: string[]
  body: string[]
  highlight?: string
  infoItems?: Array<{ label: string; value: string }>
  related: Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>
  moreItems?: Array<{ id: string; emoji: string; label: string; sub: string; bg: string }>
  ctaHref: string
  ctaLabel: string
  lastUpdated: string
}> = {
  'taoyuan-costume': {
    tags: ['桃園', '換裝體驗', '出國前必做'],
    body: [
      '意外挖到可以試穿超多民族服裝的餐廳！在台灣先穿穿看，出國體驗的時候不用煩惱。門口就是小型停車場，餐點也很平價。',
      '這間店的服裝種類很多，從東南亞到中東、東亞的民族服飾都有，換裝費用包含在餐點裡，不用額外付費。適合出發前來熟悉一下怎麼穿搭，拍照角度也可以先練習。',
      '餐廳本身是融合料理，餐點品質不錯而且價格親民，算是意外的驚喜。用餐期間可以自由換裝，工作人員也很親切會幫你整理服裝細節。',
    ],
    highlight: '出國前想穿民族服裝但怕不適合自己？來這裡先試試看，找到最適合自己的款式再去，省時又省錢。',
    infoItems: [
      { label: '地點', value: '桃園市，近桃園車站' },
      { label: '費用', value: '換裝費用含在餐費內，不另收費' },
      { label: '停車', value: '門口小型停車場，假日建議搭捷運' },
    ],
    related: [
      { href: '#', emoji: '🎭', type: 'YouTube 影片', title: '桃園玉飲翡翠文化城換裝體驗', desc: '完整體驗紀錄，包含服裝種類介紹和拍照技巧' },
      { href: '#', emoji: '🎭', type: 'Instagram 貼文', title: '換裝現場照片 + 心得', desc: '實際試穿各國民族服裝的照片分享' },
    ],
    moreItems: [
      { id: 'jeju-nyeok', emoji: '🏠', label: '濟州島住宿 NYEOK', sub: '韓國訂房 Stayfolio', bg: '#d8e8f8' },
      { id: 'mudan-villa', emoji: '🌿', label: '牡丹 小山溪', sub: '週末近郊兩人包棟', bg: '#e8f0e0' },
      { id: 'google-map-labels', emoji: '🗺️', label: 'Google Map 標籤', sub: '分類中的分類功能', bg: '#f0e8d8' },
    ],
    ctaHref: '/?tab=inspo',
    ctaLabel: '瀏覽更多靈感收藏',
    lastUpdated: '2026/2/11',
  },
}

const defaultDetail = {
  tags: [] as string[],
  body: ['內容整理中，敬請期待。'] as string[],
  related: [] as Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>,
  ctaHref: '/?tab=inspo',
  ctaLabel: '瀏覽更多靈感收藏',
  lastUpdated: '更新中',
}

export default async function InspoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const item = inspo.find((i) => i.id === id)
  if (!item) {
    const card = await getCardById(id)
    if (!card || card.type !== '靈感收藏') notFound()
    return <NotionDetailPage card={card} backHref="/?tab=inspo" backLabel="靈感收藏" colorVar="--color-inspo" variant="inspo" />
  }

  const detail = inspoDetails[id] ?? defaultDetail

  return (
    <>
      <DetailNav title={item.title} backHref="/?tab=inspo" backLabel="靈感收藏" />

      <div className="hero" style={{ background: 'var(--color-inspo)' }}>
        <div className="hero-emoji">{item.emoji}</div>
        <div className="hero-overlay">
          <div className="hero-title">{item.title}</div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">靈感收藏</span>
            {detail.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="last-updated">
            <div className="last-updated-dot" />
            最後更新 {detail.lastUpdated}
          </div>
        </div>

        <div className="article-body">
          {detail.body.map((p, i) => (
            <p key={i}>
              {p}
              {detail.highlight && i === 0 && (
                <div className="highlight" style={{ display: 'block', marginTop: '1.25rem' }}>
                  {detail.highlight}
                </div>
              )}
            </p>
          ))}
        </div>

        {detail.infoItems && detail.infoItems.length > 0 && (
          <>
            <div className="section-title">基本資訊</div>
            <div className="info-box">
              {detail.infoItems.map((item, i) => (
                <div key={i} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
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

        {detail.moreItems && detail.moreItems.length > 0 && (
          <>
            <div className="section-title">更多靈感收藏</div>
            <div className="more-grid">
              {detail.moreItems.map((m) => (
                <a key={m.id} className="more-card" href={`/inspo/${m.id}`}>
                  <div className="more-img" style={{ background: m.bg }}>{m.emoji}</div>
                  <div className="more-label">{m.label}</div>
                  <div className="more-sub">{m.sub}</div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomCta
        href={detail.ctaHref}
        label={detail.ctaLabel}
        variant="inspo"
        moreHref="/?tab=inspo"
        moreLabel="看更多靈感收藏"
      />
    </>
  )
}
