import SmoothDetails from './SmoothDetails'
import RelatedCard from './RelatedCard'

// ─── Rich text helpers ────────────────────────────────────────────────────────

function renderRichText(rt: any[]): React.ReactNode {
  return (rt ?? []).map((span, i) => {
    const text = span.plain_text as string
    const a = span.annotations ?? {}
    const href = span.href as string | null

    let node: React.ReactNode = text
    if (a.code) node = <code key={`c${i}`}>{node}</code>
    if (a.bold) node = <strong key={`b${i}`}>{node}</strong>
    if (a.italic) node = <em key={`e${i}`}>{node}</em>
    if (a.strikethrough) node = <del key={`d${i}`}>{node}</del>
    if (href) return <a key={i} href={href} target="_blank" rel="noopener noreferrer">{node}</a>
    return <span key={i}>{node}</span>
  })
}

function plainText(rt: any[]): string {
  return (rt ?? []).map((s: any) => s.plain_text).join('')
}

// ─── Related-block detection ──────────────────────────────────────────────────

// Checks if a rich_text array is a "名稱｜URL" related link
function isRelatedRichText(rt: any[]): boolean {
  if (rt.length < 2) return false
  const first = rt[0].plain_text as string
  const last = rt[rt.length - 1]
  return (first.endsWith('｜') || first.endsWith(' | ') || first.endsWith('|')) && !!last.href
}

// Paragraph pattern: ["名稱｜", "https://..."] where last span has href
function isRelatedParagraph(block: any): boolean {
  return isRelatedRichText(block.paragraph?.rich_text ?? [])
}

function detectUrlType(url: string): string {
  if (url.includes('instagram.com')) return 'Instagram 貼文'
  if (url.includes('threads.com')) return 'Threads 貼文'
  if (url.includes('youtu')) return 'YouTube 影片'
  if (url.includes('maps.google') || url.includes('goo.gl') || url.includes('maps.app')) return 'Google Maps'
  if (url.includes('notion.so') || url.includes('notion.site')) return 'Notion 頁面'
  if (url.includes('docs.google')) return 'Google Docs'
  return '外部連結'
}

function RelatedItem({ block }: { block: any }) {
  let title = '', href = ''

  // Both callout and paragraph use: span[0]="名稱｜", span[-1]=href
  const rt: any[] = block.type === 'callout'
    ? (block.callout?.rich_text ?? [])
    : (block.paragraph?.rich_text ?? [])

  title = rt[0]?.plain_text?.replace(/[｜|]\s*$/, '').trim() ?? ''
  href = rt[rt.length - 1]?.href ?? '#'

  return <RelatedCard href={href} title={title} type={detectUrlType(href)} />
}

// ─── List grouping ────────────────────────────────────────────────────────────

type GroupedBlock =
  | { _g: 'ul'; items: any[] }
  | { _g: 'ol'; items: any[] }
  | any

function groupListItems(blocks: any[]): GroupedBlock[] {
  const out: GroupedBlock[] = []
  let i = 0
  while (i < blocks.length) {
    const t = blocks[i].type
    if (t === 'bulleted_list_item' || t === 'to_do') {
      const items: any[] = []
      while (i < blocks.length && (blocks[i].type === 'bulleted_list_item' || blocks[i].type === 'to_do')) {
        items.push(blocks[i])
        i++
      }
      out.push({ _g: 'ul', items })
    } else if (t === 'numbered_list_item') {
      const items: any[] = []
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blocks[i])
        i++
      }
      out.push({ _g: 'ol', items })
    } else {
      out.push(blocks[i])
      i++
    }
  }
  return out
}

// ─── Single block renderer ────────────────────────────────────────────────────

function Block({ block }: { block: any }) {
  const { type } = block

  switch (type) {
    case 'paragraph': {
      const rt: any[] = block.paragraph?.rich_text ?? []
      if (!rt.length) return <br />
      return <p>{renderRichText(rt)}</p>
    }
    case 'heading_1':
      return <h2 style={{ fontSize: 17, fontWeight: 600, margin: '1.5rem 0 0.5rem' }}>{renderRichText(block.heading_1?.rich_text)}</h2>
    case 'heading_2':
      return <h3 style={{ fontSize: 15, fontWeight: 600, margin: '1.25rem 0 0.4rem' }}>{renderRichText(block.heading_2?.rich_text)}</h3>
    case 'heading_3':
      return <h4 style={{ fontSize: 14, fontWeight: 600, margin: '1rem 0 0.3rem', color: 'var(--color-text-secondary)' }}>{renderRichText(block.heading_3?.rich_text)}</h4>

    case 'callout': {
      const emoji = block.callout?.icon?.emoji ?? ''
      if (emoji === '🎀') return null           // internal note → skip
      if (emoji === '🔗') return null           // handled in related section
      const rt: any[] = block.callout?.rich_text ?? []
      return <div className="disclaimer">{renderRichText(rt)}</div>
    }

    case 'toggle': {
      const summary = plainText(block.toggle?.rich_text ?? [])
      return (
        <SmoothDetails summary={summary} className="qa-item">
          <NotionBlocks blocks={block.children ?? []} />
        </SmoothDetails>
      )
    }

    case 'embed': {
      const raw = block.embed?.url
      if (!raw) return null
      // Google Docs/Sheets/Slides edit URLs can't be iframed; convert to /preview
      const url = raw.replace(
        /^(https:\/\/docs\.google\.com\/(?:spreadsheets|document|presentation)\/d\/[^/]+)\/(?:edit|view)[^"]*/,
        '$1/preview'
      )
      return (
        <div style={{ margin: '1.25rem 0', borderRadius: 8, overflow: 'hidden', border: '0.5px solid var(--color-border)' }}>
          <iframe src={url} width="100%" height="500" frameBorder="0" style={{ display: 'block' }} />
        </div>
      )
    }

    case 'divider':
      return <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '1.5rem 0' }} />

    case 'synced_block':
      return <NotionBlocks blocks={block.children ?? []} />

    // skip types with no visual output
    case 'child_database':
    case 'child_page':
    case 'image':
    case 'file':
      return null

    default:
      return null
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function splitBlocks(blocks: any[]): { content: any[]; related: any[] } {
  const content: any[] = []
  const related: any[] = []

  for (const block of blocks) {
    const t = block.type
    const emoji = block[t]?.icon?.emoji ?? ''

    if (t === 'synced_block') {
      // Transparent wrapper — recurse into children
      const { content: c, related: r } = splitBlocks(block.children ?? [])
      content.push(...c)
      related.push(...r)

    } else if (t === 'callout' && emoji === '🎀') {
      // Internal note — skip entirely

    } else if (t === 'callout' && emoji === '🔗') {
      // Related-links container:
      // 1. The callout's own rich_text may itself be a related link
      if (isRelatedRichText(block.callout?.rich_text ?? [])) {
        related.push(block)
      }
      // 2. Its children are individual related-link paragraphs
      for (const child of block.children ?? []) {
        if (child.type === 'paragraph' && isRelatedParagraph(child)) {
          related.push(child)
        }
      }

    } else if (t === 'callout') {
      // Regular callout → disclaimer for own text + flatten children into content
      if ((block.callout?.rich_text ?? []).length > 0) {
        content.push({ ...block, _childrenStripped: true })
      }
      const { content: c, related: r } = splitBlocks(block.children ?? [])
      content.push(...c)
      related.push(...r)

    } else if (t === 'paragraph' && isRelatedParagraph(block)) {
      related.push(block)

    } else {
      content.push(block)
    }
  }
  return { content, related }
}

// For legacy callers that still pass flattenBlocks — kept as no-op passthrough
export function flattenBlocks(blocks: any[]): any[] { return blocks }

export function NotionRelated({ blocks }: { blocks: any[] }) {
  if (!blocks.length) return null
  return (
    <>
      <div className="section-title">相關內容 · 網址</div>
      <div className="related">
        {blocks.map((block, i) => <RelatedItem key={i} block={block} />)}
      </div>
    </>
  )
}

export default function NotionBlocks({ blocks }: { blocks: any[] }) {
  const grouped = groupListItems(blocks)
  return (
    <>
      {grouped.map((item, i) => {
        if (item._g === 'ul') {
          return (
            <ul key={i} style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', lineHeight: 1.8 }}>
              {item.items.map((b: any, j: number) => (
                <li key={j} style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  {renderRichText(b[b.type]?.rich_text ?? [])}
                </li>
              ))}
            </ul>
          )
        }
        if (item._g === 'ol') {
          return (
            <ol key={i} style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', lineHeight: 1.8 }}>
              {item.items.map((b: any, j: number) => (
                <li key={j} style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  {renderRichText(b[b.type]?.rich_text ?? [])}
                </li>
              ))}
            </ol>
          )
        }
        return <Block key={i} block={item} />
      })}
    </>
  )
}
