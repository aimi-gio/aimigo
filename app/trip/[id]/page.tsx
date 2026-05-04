import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { trips } from '@/lib/data'
import { getCardById } from '@/lib/notion'
import NotionDetailPage from '@/components/NotionDetailPage'
import DetailNav from '@/components/DetailNav'
import SmoothDetails from '@/components/SmoothDetails'
import RelatedCard from '@/components/RelatedCard'
import BottomCta from '@/components/BottomCta'
import NotionEmbed from '@/components/NotionEmbed'

const BASE = 'https://aimigo.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const trip = trips.find(t => t.id === id && t.type !== 'placeholder')
  if (trip) {
    const img = `${BASE}/og?title=${encodeURIComponent(trip.title)}&emoji=${encodeURIComponent(trip.emoji)}&type=trip`
    return {
      title: `${trip.title} · Aimi Go 分享站`,
      openGraph: { title: trip.title, images: [img] },
      twitter: { card: 'summary_large_image', images: [img] },
    }
  }
  const card = await getCardById(id)
  if (!card) return {}
  const img = `${BASE}/og?title=${encodeURIComponent(card.name)}&emoji=${encodeURIComponent(card.icon)}&type=trip`
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

const tripDetails: Record<string, {
  tags: string[]
  tripMeta: Array<{ label: string; value: string }>
  what: string[]
  note?: string
  tips: Array<{ icon: string; text: string }>
  notionTitle?: string
  igKeyword?: string
  igPostHref?: string
  days?: Array<{ num: string; name: string; date: string; color?: string; timeline: Array<{ time: string; place: string; note?: string; chip?: string }> }>
  related: Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>
  ctaHref: string
  ctaLabel: string
  lastUpdated: string
}> = {
  turkey: {
    tags: ['土耳其', '歐洲'],
    tripMeta: [
      { label: '出發', value: '2026/3/27' },
      { label: '回程', value: '2026/4/8' },
      { label: '天數', value: '12 天 11 夜' },
      { label: '人數', value: '4 人' },
      { label: '主要城市', value: '棉堡・卡帕・伊斯坦堡' },
    ],
    what: [
      '不同景點之間的交通方式與注意事項',
      '全程景點、餐廳地點資訊、踩雷心得',
      '航班資訊與行李準備清單',
      '待辦事項清單 + eSIM 推薦',
      '每個景點對應的 Instagram 貼文、影片、Threads 筆記',
      '不定時更新中',
    ],
    tips: [
      { icon: '✈', text: '土耳其航空台北直飛伊斯坦堡，約 13 小時' },
      { icon: '💳', text: '當地刷卡普遍，建議備少量里拉換小費' },
      { icon: '📱', text: '推薦 e心通 eSIM，本人實測全程順暢' },
      { icon: '🌡', text: '3–4 月早晚溫差大，薄外套必備' },
      { icon: '👟', text: '棉堡需脫鞋入場，穿好脫的鞋' },
    ],
    igKeyword: '土耳其行程',
    igPostHref: 'https://www.instagram.com/aimi.go_/',
    days: [
      {
        num: 'D1', name: '抵達伊斯坦堡', date: '3/27',
        timeline: [
          { time: '14:00', place: '桃園機場出發', note: '土耳其航空 TK24' },
          { time: '20:30', place: '抵達伊斯坦堡機場', note: '入住 Sultanahmet 區' },
          { time: '晚上', place: 'Grand Bazaar 覓食', chip: '推薦餐廳' },
        ],
      },
      {
        num: 'D4', name: '棉堡 Pamukkale', date: '3/30', color: '#c8a86a',
        timeline: [
          { time: '07:00', place: '搭夜巴抵達棉堡', note: '約 8 小時車程' },
          { time: '09:00', place: '棉堡石灰棚', note: '早去人少，記得脫鞋', chip: '必去' },
          { time: '14:00', place: 'Hierapolis 古城遺跡' },
        ],
      },
      {
        num: 'D7', name: '卡帕多奇亞熱氣球', date: '4/2', color: 'var(--color-ig)',
        timeline: [
          { time: '05:00', place: '熱氣球起飛', note: '提前 3 個月預訂', chip: '必體驗' },
          { time: '09:00', place: '地下城 Derinkuyu', note: '深達 85 公尺，穿薄外套' },
        ],
      },
    ],
    related: [
      { href: 'https://www.instagram.com/aimi.go_/', emoji: '🇹🇷', type: 'Instagram 貼文', title: '棉堡石灰棚攻略', desc: '入場時間、拍照技巧、周邊景點安排' },
      { href: 'https://www.instagram.com/aimi.go_/', emoji: '🇹🇷', type: 'Instagram 貼文', title: '熱氣球預訂教學', desc: '提前多久訂、哪家好、天氣取消怎麼辦' },
      { href: 'https://www.instagram.com/aimi.go_/', emoji: '🇹🇷', type: 'Instagram 貼文', title: '大巴扎買什麼', desc: '必買清單、殺價技巧、避開觀光陷阱' },
    ],
    ctaHref: 'https://www.instagram.com/aimi.go_/',
    ctaLabel: '前往指定貼文領取行程',
    lastUpdated: '2026/4/8',
  },
  shanghai: {
    tags: ['中國', '行程分享'],
    tripMeta: [
      { label: '出發', value: '2026/1/23' },
      { label: '回程', value: '2026/1/28' },
      { label: '天數', value: '6 天 5 夜' },
      { label: '人數', value: '3–4 人' },
      { label: '主要景點', value: '迪士尼 · 浮誇妝髮 · 烏鎮' },
    ],
    what: [
      '上海迪士尼一日遊完整攻略',
      '浮誇妝髮漢服體驗預約資訊',
      '烏鎮南潯一日遊交通與行程',
      '出發前待辦事項清單',
      '各景點對應 IG 貼文連結',
    ],
    note: '朋友 @kida.fantasy 在上海工作，我們一群朋友去找他玩的紀錄。因此這篇不會有住宿或很行軍的資訊，可參考性可能不高～～',
    tips: [
      { icon: '👗', text: '漢服預約（需提前 1–2 週）' },
      { icon: '📱', text: '網卡 / eSIM 需有內建翻牆功能' },
      { icon: '🛍️', text: '買淘寶可抓最多三天，回程前三天下單都還來得及' },
      { icon: '🚇', text: '搭地鐵可用支付寶手機碼出行，不用另外買交通卡' },
      { icon: '🛡️', text: '旅遊保險記得買' },
      { icon: '📷', text: '開 iOS 共享相簿方便大家一起存照片' },
    ],
    notionTitle: '202601 上海找朋友行程（年後慢慢整理）',
    related: [
      { href: 'https://www.instagram.com/p/DVgKaztiZMT/', emoji: '🇨🇳', type: 'Instagram 貼文', title: '南潯古鎮記錄', desc: '古鎮漫步、水鄉風景、拍照景點' },
      { href: 'https://www.instagram.com/p/DVn8x3akz6F/', emoji: '🇨🇳', type: 'Instagram 貼文', title: '上海迪士尼攻略', desc: '入園時機、必玩項目、餐廳推薦' },
      { href: 'https://www.instagram.com/p/DWEWOK_lCKG/', emoji: '🇨🇳', type: 'Instagram 貼文', title: '上海逛街地圖', desc: '必去商圈、選物店、咖啡廳推薦' },
      { href: 'https://www.instagram.com/p/DWOuRNWCZmc/', emoji: '🇨🇳', type: 'Instagram 貼文', title: '豫園漢服體驗', desc: '竹簡墨預約、價位、拍照心得' },
      { href: 'https://www.instagram.com/p/DWWRb3AFDDL/', emoji: '🇨🇳', type: 'Instagram 貼文', title: '烏鎮散步相簿', desc: '交通方式、必拍景點、時間安排' },
    ],
    ctaHref: '#',
    ctaLabel: '開啟完整行程',
    lastUpdated: '2026/4/19',
  },
}

const defaultDetail = {
  tags: [] as string[],
  tripMeta: [] as Array<{ label: string; value: string }>,
  what: ['行程內容整理中，敬請期待'] as string[],
  tips: [] as Array<{ icon: string; text: string }>,
  related: [] as Array<{ href: string; emoji?: string; type: string; title: string; desc?: string }>,
  ctaHref: '/?tab=trip',
  ctaLabel: '返回首頁',
  lastUpdated: '更新中',
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Static content takes priority for known IDs
  const trip = trips.find((t) => t.id === id && t.type !== 'placeholder')
  if (!trip) {
    const card = await getCardById(id)
    if (!card || card.type !== '旅遊行程') notFound()
    return <NotionDetailPage card={card} backHref="/?tab=trip" backLabel="旅遊行程" colorVar="--color-trip" variant="trip" />
  }

  const detail = tripDetails[id] ?? defaultDetail
  const isIg = trip.type === 'ig'
  const heroStyle = isIg
    ? { background: 'linear-gradient(135deg, #471E57 0%, #DB497B 60%, #FFAFBF 100%)' }
    : { background: 'var(--color-trip)' }

  return (
    <>
      <DetailNav title={trip.title} backHref="/?tab=trip" backLabel="旅遊行程" />

      <div className="hero" style={heroStyle}>
        <div className="hero-emoji">{trip.emoji}</div>
        <div className="hero-overlay">
          <div className="hero-title">{trip.title}</div>
          <div className="hero-cta-row">
            {isIg ? (
              <>
                <a className="btn-ig-hero" href={detail.ctaHref} target="_blank" rel="noopener noreferrer">
                  前往指定貼文領取 <ExtIcon />
                </a>
                <a className="btn-hero-ghost" href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">
                  ▶ 相關影片 <ExtIcon />
                </a>
              </>
            ) : (
              <>
                <a className="btn-hero-primary" href={detail.ctaHref} target="_blank" rel="noopener noreferrer">直接開啟行程</a>
                <a className="btn-hero-ghost" href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">
                  ▶ IG 相關貼文 <ExtIcon />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">旅遊行程</span>
            {isIg && <span className="tag tag-ig">IG 粉絲限定</span>}
            {detail.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="last-updated">
            <div className="last-updated-dot" />
            最後更新 {detail.lastUpdated}
          </div>
        </div>

        {detail.tripMeta.length > 0 && (
          <div className="meta-row">
            {detail.tripMeta.map((m) => (
              <div key={m.label} className="meta-item">
                <span className="meta-label">{m.label}</span>
                <span className="meta-value">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="section-title">行程包含什麼</div>
        <div className="what-box">
          <div className="what-list">
            {detail.what.map((item, i) => (
              <div key={i} className="what-item">
                <div className={`what-dot ${isIg ? 'what-dot-ig' : 'what-dot-trip'}`} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {isIg && (
          <>
            <div className="section-title">免費領取行程包</div>
            <div className="ig-box">
              <span className="ig-label">IG 粉絲限定</span>
              <div className="ig-title">追蹤 + 留言，機器人自動傳連結給你</div>
              <div className="ig-desc">
                為了分享更多實用的資訊，我會公開實際行程表，回國後也持續補充更新。只要遵循這些簡單的小步驟，就能給予我很大的支持，讓我有動力繼續分享！
              </div>
              <div className="ig-steps">
                <div className="ig-step">
                  <div className="ig-step-num">1</div>
                  <div>
                    <div>追蹤 @aimi.go_</div>
                    <div className="ig-step-sub">只需追蹤一次，之後其他行程包都可以直接留言領取</div>
                  </div>
                </div>
                <div className="ig-step">
                  <div className="ig-step-num">2</div>
                  <div>
                    <div>到指定貼文留言「{detail.igKeyword ?? trip.title}」</div>
                    <div className="ig-step-sub">盡量不要拆開或改詞，免得機器人沒觸發</div>
                  </div>
                </div>
                <div className="ig-step">
                  <div className="ig-step-num">3</div>
                  <div>
                    <div>等幾秒，機器人會自動私訊 Notion 連結給你</div>
                    <div className="ig-step-sub">點擊私訊中的白色按鈕或網址即可開啟</div>
                  </div>
                </div>
              </div>
              <a className="ig-btn" href={detail.ctaHref} target="_blank" rel="noopener noreferrer">
                前往指定貼文 <ExtIcon />
              </a>
            </div>

            <div className="qa-accordion">
              <SmoothDetails summary="要準備什麼才能開始看？" className="qa-item">
                <div className="qa-a">瀏覽器就可以打開！不用安裝任何軟體、不用任何額外花費。建議用電腦打開閱讀體驗比較順暢，手機版是旅遊途中方便看的形式。</div>
              </SmoothDetails>
              <SmoothDetails summary="我也想自己做行程表" className="qa-item">
                <div className="qa-a">免費註冊一個 Notion 帳號，建立新文件或複製我的模板！也可以參考<a href="/"> 通用模板區</a>，偶爾會有 Notion 操作小教學。</div>
              </SmoothDetails>
              <SmoothDetails summary="只想要模板，不想要行程" className="qa-item">
                <div className="qa-a">前往模板原作者 @cynthia_decolife 部落格搜尋「notion」可找到詳細說明文章。我分享的版本有依照分類習慣調整區塊、算錢公式，紀錄更清楚！</div>
              </SmoothDetails>
            </div>
          </>
        )}

        {detail.note && (
          <div className="note-box">{detail.note}</div>
        )}

        {detail.tips.length > 0 && (
          <>
            <div className="section-title">{isIg ? '實用備註' : '出發前待辦'}</div>
            <div className="tips-box">
              {detail.tips.map((tip, i) => (
                <div key={i} className="tip-item">
                  <span className="tip-icon">{tip.icon}</span>
                  {tip.text}
                </div>
              ))}
            </div>
          </>
        )}

        {detail.notionTitle && (
          <>
            <div className="section-title">行程概覽</div>
            <NotionEmbed title={detail.notionTitle} sub="實際部署時嵌入 Notion database 連結" />
          </>
        )}

        {detail.days && detail.days.length > 0 && (
          <>
            <div className="section-title">行程概覽</div>
            <div className="days-grid">
              {detail.days.map((day) => (
                <div key={day.num} className="day-card">
                  <div className="day-header">
                    <div className="day-num" style={day.color ? { background: day.color } : {}}>{day.num}</div>
                    <div className="day-name">{day.name}</div>
                    <div className="day-date">{day.date}</div>
                  </div>
                  <div className="day-body">
                    <div className="timeline">
                      {day.timeline.map((tl, i) => (
                        <div key={i} className="tl-item">
                          <div className="tl-time">{tl.time}</div>
                          <div className="tl-line">
                            <div className="tl-dot tl-dot-active" />
                            {i < day.timeline.length - 1 && <div className="tl-connector" />}
                          </div>
                          <div className="tl-content">
                            <div className="tl-place">{tl.place}</div>
                            {tl.note && <div className="tl-note">{tl.note}</div>}
                            {tl.chip && <span className="tl-chip">{tl.chip}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="locked-placeholder">
              <div className="locked-placeholder-inner">
                <div className="locked-placeholder-text">
                  完整行程 ·{' '}
                  <a href={detail.ctaHref} style={{ color: 'var(--color-ig)', fontWeight: 500 }}
                    target="_blank" rel="noopener noreferrer">前往領取</a>
                </div>
              </div>
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
      </div>

      <BottomCta
        href={detail.ctaHref}
        label={detail.ctaLabel}
        variant={isIg ? 'ig' : 'trip'}
        external
        moreHref="/?tab=trip"
        moreLabel="看更多行程"
      />
    </>
  )
}
