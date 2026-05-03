'use client'

import Link from 'next/link'
import { useState } from 'react'
import CopyButton from './CopyButton'
import { trips, tools, templates, inspo } from '@/lib/data'

type Filter = 'all' | 'trip' | 'tool' | 'template' | 'inspo'

const ExtIcon = () => (
  <svg className="ext-icon" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6.5 1.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5 2.5H2C1.72 2.5 1.5 2.72 1.5 3V10C1.5 10.28 1.72 10.5 2 10.5H9C9.28 10.5 9.5 10.28 9.5 10V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const realTrips = trips.filter(t => t.type !== 'placeholder')
const counts: Record<Filter, number> = {
  all: realTrips.length + tools.length + templates.length + inspo.length,
  trip: trips.length,
  tool: tools.length,
  template: templates.length,
  inspo: inspo.length,
}

export default function HomeSections() {
  const [active, setActive] = useState<Filter>('all')

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
            {trips.map((trip) => {
              if (trip.type === 'placeholder') {
                return (
                  <div key="placeholder" className="card card-placeholder">
                    <div className="card-placeholder-inner">
                      <div className="card-placeholder-plus">+</div>
                      <div className="card-placeholder-label">更多行程陸續更新</div>
                    </div>
                  </div>
                )
              }

              const isIg = trip.type === 'ig'
              return (
                <Link
                  key={trip.id}
                  href={`/trip/${trip.id}`}
                  className={`card card-trip${isIg ? ' ig-card' : ''}`}
                >
                  <div className="card-img">
                    <div className="card-img-bg" style={{ background: 'var(--color-trip-light)' }}>
                      {trip.emoji}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-title">{trip.title}</div>
                    <div className="card-meta">{trip.meta}</div>
                    <div className="card-chips">
                      {trip.chips.map((chip) => (
                        <span key={chip} className="chip">{chip}</span>
                      ))}
                    </div>
                    <div className="card-footer">
                      <div className={`cta-btn ${isIg ? 'cta-btn-ig' : 'cta-btn-trip'}`}>
                        {isIg ? 'IG 粉絲限定領取' : '直接開啟'}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {showDivider && <div className="divider" />}

      {/* Tool section */}
      {show('tool') && (
        <div id="section-tool">
          {showLabel && <div className="section-label">好用工具</div>}
          <div className="grid">
            {tools.map((tool) => (
              <div key={tool.id} className="card card-tool">
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-tool-light)' }}>
                    {tool.emoji}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{tool.title}</div>
                  <div className="card-desc">{tool.desc}</div>
                  {tool.inviteCode ? (
                    <CopyButton label={tool.ctaText} code={tool.inviteCode} />
                  ) : (
                    <Link
                      href={tool.ctaHref ?? '#'}
                      className="cta-btn cta-btn-tool"
                      target={tool.ctaHref?.startsWith('http') ? '_blank' : undefined}
                      rel={tool.ctaHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {tool.ctaText} {tool.ctaHref?.startsWith('http') && <ExtIcon />}
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
            {templates.map((tmpl) => (
              <Link key={tmpl.id} href={`/template/${tmpl.id}`} className="card card-template">
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-template-light)' }}>
                    {tmpl.emoji}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{tmpl.title}</div>
                  <div className="card-desc">{tmpl.desc}</div>
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
            {inspo.map((item) => (
              <Link key={item.id} href={`/inspo/${item.id}`} className="card card-inspo">
                <div className="card-img">
                  <div className="card-img-bg" style={{ background: 'var(--color-inspo-light)' }}>
                    {item.emoji}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{item.title}</div>
                  <div className="card-desc">{item.desc}</div>
                  <div className="card-footer">
                    <div className="cta-btn cta-btn-inspo">閱讀更多</div>
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
