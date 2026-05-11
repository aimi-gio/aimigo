import Link from 'next/link'
import type { NotionCard, ExternalLink } from '@/lib/notion'
import { getPageBlocks, getCardsByType, getInlineLinks } from '@/lib/notion'
import { isCopyCode, extractCode, isExternalUrl } from '@/lib/cta'
import DetailNav from './DetailNav'
import BottomCta from './BottomCta'
import CopyButton from './CopyButton'
import RelatedCard from './RelatedCard'
import NotionBlocks, { flattenBlocks, splitBlocks, NotionRelated } from './NotionBlocks'

interface Props {
  card: NotionCard
  backHref: string
  backLabel: string
  colorVar: string
  variant: 'trip' | 'tool' | 'template' | 'inspo'
}

const TYPE_SLUG: Record<string, string> = {
  '旅遊行程': 'trip', '好用工具': 'tool', '通用模板': 'template', '靈感收藏': 'inspo',
}

const VARIANT_CTA: Record<string, string> = {
  trip: '查看完整行程安排(๑•̀ㅂ•́)و✧ 🎁',
  tool: '用我的連結薅羊毛 (ﾉ>ω<)ﾉ 💰',
  template: '免費複製這份模板٩(◕‿◕)۶📋',
  inspo: '看完整靈感筆記(◍•ᴗ•◍)✨',
}

function sourceEmoji(source: string): string {
  if (source === 'Instagram') return '📸'
  if (source === 'YouTube') return '▶️'
  if (source === '部落格') return '📝'
  return '🔗'
}

export default async function NotionDetailPage({ card, backHref, backLabel, colorVar, variant }: Props) {
  const [rawBlocks, sameTypeCards] = await Promise.all([
    getPageBlocks(card.id),
    getCardsByType(card.type, card.id),
  ])
  const externalLinks = await getInlineLinks(rawBlocks)
  const { content, related } = splitBlocks(flattenBlocks(rawBlocks))
  const typeSlug = TYPE_SLUG[card.type] ?? variant

  const igGated = card.tags.includes('IG 粉絲限定') || card.cta.startsWith('ig:')
  const igCtaHref = (() => {
    if (card.cta.startsWith('ig:')) {
      const rest = card.cta.slice(3)
      if (rest.startsWith('http')) return rest
    } else if (isExternalUrl(card.cta)) {
      return card.cta
    }
    return card.relatedUrl || 'https://www.instagram.com/aimi.go_/'
  })()
  const resolvedCtaUrl = isExternalUrl(card.cta) ? card.cta : card.ctaUrl
  const extUrl = !igGated && !!resolvedCtaUrl
  const ctaLabel = VARIANT_CTA[variant] || '查看更多'
  const code = isCopyCode(card.cta)
  const contentTags = card.tags.filter(t => !['IG 粉絲限定', '行程分享'].includes(t))

  return (
    <>
      <DetailNav title={card.name} backHref={backHref} backLabel={backLabel} />

      <div className="hero" style={card.cover ? {} : igGated ? { background: 'var(--gradient-ig)' } : { background: `var(${colorVar})` }}>
        {card.cover
          ? <img src={card.cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div className="hero-emoji">{card.icon || '✨'}</div>
        }
        <div className="hero-overlay">
          <nav className="hero-crumb" aria-label="breadcrumb">
            <Link href="/" className="hero-crumb-link">首頁</Link>
            <span className="hero-crumb-sep">›</span>
            <Link href={backHref} className="hero-crumb-link">{backLabel}</Link>
          </nav>
          <div className="hero-title">{card.name}</div>
        </div>
      </div>

      <div className="content">
        <div className="post-header">
          <div className="tag-row">
            <span className="tag tag-category">{card.type}</span>
            {contentTags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          {card.lastUpdated && (
            <div className="last-updated">
              <div className="last-updated-dot" />
              最後更新 {card.lastUpdated}
            </div>
          )}
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
            <a className="ig-btn" href={igCtaHref} target="_blank" rel="noopener noreferrer">
              前往指定貼文領取行程 📩
            </a>
          </div>
        )}

        {(igGated || code || extUrl) && (
          <div className="inline-cta">
            {igGated && (
              <a className="bottom-cta bottom-cta-ig" href={igCtaHref} target="_blank" rel="noopener noreferrer">
                <span>前往指定貼文領取行程 📩</span>
              </a>
            )}
            {code && (
              <CopyButton label="複製邀請碼" code={extractCode(card.cta)}
                className={`bottom-cta bottom-cta-${variant}`}
                style={{ background: `var(--color-${variant})` }} />
            )}
            {!igGated && extUrl && (
              <a className={`bottom-cta bottom-cta-${variant}`} href={resolvedCtaUrl}
                style={{ background: `var(--color-${variant})` }}
                target="_blank" rel="noopener noreferrer">
                <span>{ctaLabel}</span>
              </a>
            )}
          </div>
        )}

        {externalLinks.length > 0 ? (
          <>
            <div className="section-title">相關內容 · 網址</div>
            <div className="related">
              {externalLinks.map((l: ExternalLink) => (
                <RelatedCard
                  key={l.id}
                  href={l.url}
                  title={l.name}
                  type={l.source}
                  emoji={sourceEmoji(l.source)}
                  thumbnail={l.thumbnail}
                  desc={l.desc || undefined}
                  colorVar={colorVar}
                />
              ))}
            </div>
          </>
        ) : (
          <NotionRelated blocks={related} />
        )}

        {sameTypeCards.length > 0 && (
          <>
            <div className="section-sep" />
            <div className="section-title">更多{card.type}</div>
            <div className="related-notion-cards">
              {sameTypeCards.slice(0, 3).map(c => (
                <Link key={c.id} href={`/${typeSlug}/${c.slug || c.id}`} className="related-notion-card">
                  <span className="related-notion-card-emoji">{c.icon || '✨'}</span>
                  <span className="related-notion-card-name">{c.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomCta href={backHref} label="" hideButton
        variant={variant} moreHref={backHref} moreLabel={`看更多${backLabel}`} />
    </>
  )
}
