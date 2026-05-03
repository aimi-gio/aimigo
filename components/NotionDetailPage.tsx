import type { NotionCard } from '@/lib/notion'
import DetailNav from './DetailNav'
import BottomCta from './BottomCta'
import CopyButton from './CopyButton'

interface Props {
  card: NotionCard
  backHref: string
  backLabel: string
  colorVar: string
  variant: 'trip' | 'tool' | 'template' | 'inspo'
}

const IG_GATE_TYPES = ['領取 Notion 小書']
const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

function isInviteCode(cta: string) {
  return /^[A-Z0-9]{6,10}$/.test(cta)
}

export default function NotionDetailPage({ card, backHref, backLabel, colorVar, variant }: Props) {
  const isIgGated = IG_GATE_TYPES.some(t => card.cta.includes(t))
  const isExternalUrl = card.cta.startsWith('http')
  const isCode = isInviteCode(card.cta)
  const isInstagram = card.cta.includes('Instagram')
  const isComingSoon = card.cta === '佛系整理中'

  const contentTags = card.tags.filter(t => !['IG 粉絲限定', '行程分享'].includes(t))

  return (
    <>
      <DetailNav title={card.name} backHref={backHref} backLabel={backLabel} />

      <div className="hero" style={{ background: `var(${colorVar})` }}>
        <div className="hero-emoji">{card.icon || '✨'}</div>
        <div className="hero-overlay">
          <div className="hero-title">{card.name}</div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">{card.type}</span>
            {contentTags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        {(card.dateRange || card.persons) && (
          <>
            <div className="section-title">基本資訊</div>
            <div className="info-box">
              {card.dateRange && (
                <div className="info-item">
                  <span className="info-label">日期</span>
                  <span className="info-value">{card.dateRange}</span>
                </div>
              )}
              {card.persons && (
                <div className="info-item">
                  <span className="info-label">人數</span>
                  <span className="info-value">{card.persons}</span>
                </div>
              )}
            </div>
          </>
        )}

        {card.desc && (
          <div className="article-body">
            {card.desc.split('\n').filter(Boolean).map((line, i) => (
              <p key={i}>{line.replace(/^✦ /, '')}</p>
            ))}
          </div>
        )}

        {isIgGated && (
          <div className="ig-box">
            <div className="ig-label">IG 粉絲限定</div>
            <div className="ig-title">這份行程是 Aimi 的 IG 粉絲限定小書</div>
            <div className="ig-desc">追蹤 IG @aimi.go_ 並傳送關鍵字，即可取得 Notion 行程連結。</div>
            <div className="ig-steps">
              <div className="ig-step"><div className="ig-step-num">1</div><div className="ig-step-sub">追蹤 Instagram @aimi.go_</div></div>
              <div className="ig-step"><div className="ig-step-num">2</div><div className="ig-step-sub">私訊 Aimi 說出行程名稱</div></div>
              <div className="ig-step"><div className="ig-step-num">3</div><div className="ig-step-sub">取得 Notion 行程連結</div></div>
            </div>
            <a className="ig-btn" href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer">
              前往 Instagram @aimi.go_
            </a>
          </div>
        )}

        {isInstagram && !isIgGated && (
          <div className="note-box">
            <p>這份行程分享在 Aimi 的 Instagram，點下方按鈕直接查看貼文。</p>
          </div>
        )}

        {isCode && (
          <div className="note-box">
            <p>複製下方邀請碼，於 App 安裝或註冊時輸入即可享有優惠。</p>
            <div style={{ marginTop: '1rem' }}>
              <CopyButton label="複製邀請碼" code={card.cta} />
            </div>
          </div>
        )}

        {isComingSoon && (
          <div className="locked-placeholder">
            <div className="locked-placeholder-inner">
              <div className="locked-placeholder-text">內容整理中，敬請期待</div>
            </div>
          </div>
        )}
      </div>

      {isIgGated && (
        <BottomCta
          href="https://www.instagram.com/aimi.go_/"
          label="前往 Instagram 領取行程"
          variant={variant}
          external
          moreHref={backHref}
          moreLabel={`看更多${backLabel}`}
        />
      )}
      {isExternalUrl && (
        <BottomCta
          href={card.cta}
          label="查看更多"
          variant={variant}
          external
          moreHref={backHref}
          moreLabel={`看更多${backLabel}`}
        />
      )}
      {isInstagram && !isIgGated && (
        <BottomCta
          href={`https://www.instagram.com/aimi.go_/`}
          label="前往 Instagram"
          variant={variant}
          external
          moreHref={backHref}
          moreLabel={`看更多${backLabel}`}
        />
      )}
      {(!isIgGated && !isExternalUrl && !isInstagram) && (
        <BottomCta
          href={backHref}
          label={`瀏覽更多${backLabel}`}
          variant={variant}
          moreHref={backHref}
          moreLabel={`看更多${backLabel}`}
        />
      )}
    </>
  )
}
