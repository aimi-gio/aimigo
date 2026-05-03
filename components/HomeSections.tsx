'use client'

import Link from 'next/link'
import { useState } from 'react'
import CopyButton from './CopyButton'
import type { NotionCard } from '@/lib/notion'

type Filter = 'all' | 'trip' | 'tool' | 'template' | 'inspo'

const TYPE_SLUG: Record<string, string> = {
  '旅遊行程': 'trip',
  '好用工具': 'tool',
  '通用模板': 'template',
  '靈感收藏': 'inspo',
}

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
function isExternalUrl(cta: string) {
  return cta.startsWith('http')
}
function isIgLimited(cta: string) {
  return cta.includes('領取 Notion 小書')
}
function isComingSoon(cta: string) {
  return cta === '佛系整理中'
}

function internalHref(card: NotionCard) {
  return `/${TYPE_SLUG[card.type]}/${card.id}`
}

export default function HomeSections({ cards }: { cards: NotionCard[] }) {
  const [active, setActive] = useState<Filter>('all')

  const tripCards = cards.filter(c => c.type === '旅遊行程')
  const toolCards = cards.filter(c => c.type === '好用工具')
  const templateCards = cards.filter(c => c.type === '通用模板')
  const inspoCards = cards.filter(c => c.type === '靈感收藏')

  const counts: Record<Filter, number> = {
    all: cards.length,
    trip: tripCards.length,
    tool: toolCards.length,
    template: templateCards.length,
    inspo: inspoCards.length,
  }

  const show = (section: Filter) => active === 'all' || active === section
  const showDivider = active === 'all'
  const showLabel = active === 'all'

  return (
    <div className="main">
      {/* Filter toolbar */}
      <div className="toolbar">
        <div className="filter-row">
          {(['all', 'trip', 'tool', 'template', 'inspo'] as Filter[]).map((f) => {
            const labels: Record<Filter, string> = {
              all: '全部', trip: '旅遊行程', tool: '好用工具',
              template: '通用模板', inspo: '靈感收藏',
            }
            return (
              <button
                key={f}
                className={`pill${active === f ? ' active' : ''}`}
                onClick={() => setActive(f)}
              >
                {labels[f]}
              </button>
            )
          })}
        </div>
        <span className="count">{counts[active]} 筆內容</span>
      </div>

      {/* Trip section */}
      {show('trip') && (
        <div id="section-trip">
          {showLabel && <div className="section-label">旅遊行程</div>}
          <div className="grid">
            {tripCards.map((card) => {
              const isIg = isIgLimited(card.cta) || card.cta.includes('Instagram')
              const disabled = isComingSoon(card.cta)
              const chips = card.tags.filter(t => !['IG 粉絲限定', '行程分享'].includes(t))

              const cardEl = (
                <div className="card-body">
                  <div className="card-title">{card.name}</div>
                  <div className="card-meta">{card.dateRange}{card.persons ? ` · ${card.persons}` : ''}</div>
                  {chips.length > 0 && (
                    <div className="card-chips">
                      {chips.map((c) => <span key={c} className="chip">{c}</span>)}
                    </div>
                  )}
                  <div className="card-footer">
                    <div className={`cta-btn ${disabled ? 'cta-btn-disabled' : isIg ? 'cta-btn-ig' : 'cta-btn-trip'}`}>
                      {disabled ? '整理中' : isIg ? 'IG 粉絲限定領取' : '直接開啟'}
                    </div>
                  </div>
                </div>
              )

              const imgEl = (
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-trip-light)' }}>
                    {card.icon}
                  </div>
                </div>
              )

              if (disabled) {
                return (
                  <div key={card.id} className="card card-trip card-disabled">
                    {imgEl}{cardEl}
                  </div>
                )
              }
              return (
                <Link key={card.id} href={internalHref(card)} className={`card card-trip${isIg ? ' ig-card' : ''}`}>
                  {imgEl}{cardEl}
                </Link>
              )
            })}
            {/* Placeholder */}
            <div className="card card-placeholder">
              <div className="card-placeholder-inner">
                <div className="card-placeholder-plus">+</div>
                <div className="card-placeholder-label">更多行程陸續更新</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDivider && <div className="divider" />}

      {/* Tool section */}
      {show('tool') && (
        <div id="section-tool">
          {showLabel && <div className="section-label">好用工具</div>}
          <div className="grid">
            {toolCards.map((card) => (
              <div key={card.id} className="card card-tool">
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-tool-light)' }}>
                    {card.icon || '🔧'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{card.name}</div>
                  <div className="card-desc">{card.desc}</div>
                  {isInviteCode(card.cta) ? (
                    <CopyButton label="複製邀請碼" code={card.cta} />
                  ) : isExternalUrl(card.cta) ? (
                    <a href={card.cta} target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-tool">
                      查看更多 <ExtIcon />
                    </a>
                  ) : (
                    <Link href={internalHref(card)} className="cta-btn cta-btn-tool">
                      {card.cta || '查看說明'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDivider && <div className="divider" />}

      {/* Template section */}
      {show('template') && (
        <div id="section-template">
          {showLabel && <div className="section-label">通用模板</div>}
          <div className="grid">
            {templateCards.map((card) => (
              <Link key={card.id} href={internalHref(card)} className="card card-template">
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-template-light)' }}>
                    {card.icon || '📋'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{card.name}</div>
                  <div className="card-desc">{card.desc}</div>
                  <div className="card-footer">
                    <div className="cta-btn cta-btn-template">查看說明</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showDivider && <div className="divider" />}

      {/* Inspo section */}
      {show('inspo') && (
        <div id="section-inspo">
          {showLabel && <div className="section-label">靈感收藏</div>}
          <div className="grid">
            {inspoCards.map((card) => {
              const isExt = isExternalUrl(card.cta)
              const commonInner = (
                <>
                  <div className="card-img">
                    <div className="card-img-bg" style={{ background: 'var(--color-inspo-light)' }}>
                      {card.icon || '✨'}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-title">{card.name}</div>
                    <div className="card-desc">{card.desc}</div>
                    <div className="card-footer">
                      <div className="cta-btn cta-btn-inspo">
                        {isExt ? '查看更多' : '閱讀更多'}
                      </div>
                    </div>
                  </div>
                </>
              )
              if (isExt) {
                return (
                  <a key={card.id} href={card.cta} target="_blank" rel="noopener noreferrer" className="card card-inspo">
                    {commonInner}
                  </a>
                )
              }
              return (
                <Link key={card.id} href={internalHref(card)} className="card card-inspo">
                  {commonInner}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
