import type { NotionCard } from '@/lib/notion'
import { getPageBlocks } from '@/lib/notion'
import DetailNav from './DetailNav'
import BottomCta from './BottomCta'
import CopyButton from './CopyButton'
import NotionBlocks, { flattenBlocks, splitBlocks, NotionRelated } from './NotionBlocks'

interface Props {
  card: NotionCard
  backHref: string
  backLabel: string
  colorVar: string
  variant: 'trip' | 'tool' | 'template' | 'inspo'
}

function isInviteCode(cta: string) { return /^[A-Z0-9]{6,10}$/.test(cta) }
function isExternalUrl(cta: string) { return cta.startsWith('http') }
function isIgGated(cta: string) { return cta.includes('領取 Notion 小書') }
function isInstagram(cta: string) { return cta.includes('Instagram') && !isIgGated(cta) }

export default async function NotionDetailPage({ card, backHref, backLabel, colorVar, variant }: Props) {
  const rawBlocks = await getPageBlocks(card.id)
  const { content, related } = splitBlocks(flattenBlocks(rawBlocks))

  const igGated = isIgGated(card.cta)
  const extUrl = isExternalUrl(card.cta)
  const code = isInviteCode(card.cta)
  const ig = isInstagram(card.cta)
  const contentTags = card.tags.filter(t => !['IG 粉絲限定', '行程分享'].includes(t))

  return (
    <>
      <DetailNav title={card.name} backHref={backHref} backLabel={backLabel} />

      <div className="hero" style={card.cover ? {} : { background: `var(${colorVar})` }}>
        {card.cover
          ? <img src={card.cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div className="hero-emoji">{card.icon || '✨'}</div>
        }
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

        {/* Block 內容（所有頁面都顯示，包含 IG 限定） */}
        {content.length > 0 ? (
          <div className="article-body">
            <NotionBlocks blocks={content} />
          </div>
        ) : card.desc ? (
          <div className="article-body">
            {card.desc.split('\n').filter(Boolean).map((line, i) => (
              <p key={i}>{line.replace(/^✦ /, '')}</p>
            ))}
          </div>
        ) : null}

        {/* IG 粉絲限定引導（顯示在 block 內容下方） */}
        {igGated && (
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

        {code && (
          <div className="note-box" style={{ marginTop: '1.25rem' }}>
            <p>複製下方邀請碼，於 App 安裝或註冊時輸入即可享有優惠。</p>
            <div style={{ marginTop: '1rem' }}>
              <CopyButton label="複製邀請碼" code={card.cta} />
            </div>
          </div>
        )}

        <NotionRelated blocks={related} />
      </div>

      {igGated && (
        <BottomCta href="https://www.instagram.com/aimi.go_/" label="前往 Instagram 領取行程"
          variant={variant} external moreHref={backHref} moreLabel={`看更多${backLabel}`} />
      )}
      {extUrl && (
        <BottomCta href={card.cta} label="查看更多"
          variant={variant} external moreHref={backHref} moreLabel={`看更多${backLabel}`} />
      )}
      {ig && (
        <BottomCta href="https://www.instagram.com/aimi.go_/" label="前往 Instagram"
          variant={variant} external moreHref={backHref} moreLabel={`看更多${backLabel}`} />
      )}
      {!igGated && !extUrl && !ig && (
        <BottomCta href={backHref} label={`瀏覽更多${backLabel}`}
          variant={variant} moreHref={backHref} moreLabel={`看更多${backLabel}`} />
      )}
    </>
  )
}
