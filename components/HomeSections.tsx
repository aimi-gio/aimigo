'use client'

import Link from 'next/link'
import { useState } from 'react'
import CopyButton from './CopyButton'
import type { NotionCard } from '@/lib/notion'
import { isCopyCode, extractCode, isIgLimited, isComingSoon } from '@/lib/cta'

type Filter = 'all' | 'trip' | 'tool' | 'template' | 'inspo'

const TYPE_SLUG: Record<string, string> = {
  '旅遊行程': 'trip',
  '好用工具': 'tool',
  '通用模板': 'template',
  '靈感收藏': 'inspo',
}

function tripDateKey(name: string): number {
  let m = name.match(/^(\d{6})/)
  if (m) return parseInt(m[1])
  m = name.match(/^(\d{4})-(\d{1,2})/)
  if (m) return parseInt(m[1]) * 100 + parseInt(m[2])
  m = name.match(/^(\d{4})/)
  if (m) return parseInt(m[1]) * 100
  return 0
}

function internalHref(card: NotionCard) {
  return `/${TYPE_SLUG[card.type]}/${card.slug || card.id}`
}

// Cover image with emoji fallback
function CardImg({ cover, icon, bg, fallback }: { cover: string; icon: string; bg: string; fallback: string }) {
  return (
    <div className="card-img">
      {cover
        ? <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div className="card-img-bg" style={{ background: bg }}>{icon || fallback}</div>
      }
    </div>
  )
}

const VALID_FILTERS: Filter[] = ['all', 'trip', 'tool', 'template', 'inspo']

export default function HomeSections({ cards, initialTab }: { cards: NotionCard[]; initialTab?: string }) {
  const [active, setActive] = useState<Filter>(
    VALID_FILTERS.includes(initialTab as Filter) ? (initialTab as Filter) : 'all'
  )

  const tripCards = cards
    .filter(c => c.type === '旅遊行程')
    .sort((a, b) => tripDateKey(b.name) - tripDateKey(a.name))
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
              const isIg = card.tags.includes('IG 粉絲限定') || isIgLimited(card.cta)
              const disabled = isComingSoon(card.cta)
              const chips = card.tags.filter(t => !['IG 粉絲限定', '行程分享'].includes(t))

              const imgEl = (
                <CardImg
                  cover={card.cover}
                  icon={card.icon}
                  bg="var(--color-trip-light)"
                  fallback="✈️"
                />
              )

              const bodyEl = (
                <div className="card-body">
                  <div className="card-title">{card.name}</div>
                  <div className="card-meta">{[card.dateRange || '—', card.persons || '—'].join(' · ')}</div>
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

              if (disabled) {
                return (
                  <div key={card.id} className="card card-trip card-disabled">
                    {imgEl}{bodyEl}
                  </div>
                )
              }
              return (
                <Link key={card.id} href={internalHref(card)} className={`card card-trip${isIg ? ' ig-card' : ''}`}>
                  {imgEl}{bodyEl}
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
            {toolCards.map((card) => {
              const copy = isCopyCode(card.cta)
              return (
                <Link key={card.id} href={internalHref(card)} className="card card-tool">
                  <CardImg cover={card.cover} icon={card.icon} bg="var(--color-tool-light)" fallback="🔧" />
                  <div className="card-body">
                    <div className="card-title">{card.name}</div>
                    <div className="card-desc">{card.desc}</div>
                    {copy
                      ? <CopyButton label="複製邀請碼" code={extractCode(card.cta)} />
                      : <div className="cta-btn cta-btn-tool">查看更多</div>
                    }
                  </div>
                </Link>
              )
            })}
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
                <CardImg
                  cover={card.cover}
                  icon={card.icon}
                  bg="var(--color-template-light)"
                  fallback="📋"
                />
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
            {inspoCards.map((card) => (
              <Link key={card.id} href={internalHref(card)} className="card card-inspo">
                <CardImg cover={card.cover} icon={card.icon} bg="var(--color-inspo-light)" fallback="✨" />
                <div className="card-body">
                  <div className="card-title">{card.name}</div>
                  <div className="card-desc">{card.desc}</div>
                  <div className="card-footer">
                    <div className="cta-btn cta-btn-inspo">查看更多</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
