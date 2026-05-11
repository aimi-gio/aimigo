const DS_ID = process.env.NOTION_DS_ID ?? '22b18206525680d982e8000ba2c9e5af'
const REVALIDATE = 3600

export type CardType = '旅遊行程' | '好用工具' | '通用模板' | '靈感收藏'

export interface NotionCard {
  id: string       // page ID without dashes
  slug: string     // human-readable slug; empty string if not set
  icon: string
  cover: string    // cover image URL, empty string if none
  name: string
  type: CardType
  desc: string
  cta: string      // raw CTA field: 'https://...' | 'ig:keyword' | '複製:code' | text
  ctaUrl: string   // resolved URL from CTA (URL property or rich_text hyperlink)
  tags: string[]
  dateRange: string
  persons: string
  lastUpdated: string  // formatted as YYYY/M/D
  relatedUrl: string   // 相關入口 field URL
}

export interface ExternalLink {
  id: string
  name: string
  url: string
  thumbnail: string
  source: string   // Instagram | YouTube | 外部網站 | 部落格
  desc: string
  tags: string[]
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  }
}

async function nPost(path: string, body: object, revalidate = REVALIDATE): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
    next: { revalidate },
  })
  return res.json()
}

async function nGet(path: string, revalidate = REVALIDATE): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    headers: headers(),
    next: { revalidate },
  })
  return res.json()
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function richText(field: unknown): string {
  const f = field as any
  return f?.rich_text?.[0]?.plain_text?.trim() ?? ''
}

function parseFileUrl(f: any): string {
  if (!f) return ''
  if (f.type === 'external') return f.external?.url ?? ''
  if (f.type === 'file') return f.file?.url ?? ''
  return ''
}

function parseCover(page: any): string {
  const url = parseFileUrl(page.cover)
  if (url) return url
  const prop = page.properties?.['封面']
  if (prop?.type === 'files' && prop.files?.length > 0) {
    return parseFileUrl(prop.files[0])
  }
  return ''
}

function parseCard(page: any): NotionCard {
  const p = page.properties
  return {
    id: page.id.replace(/-/g, ''),
    slug: p['slug']?.rich_text?.[0]?.plain_text?.trim() ?? '',
    icon: page.icon?.emoji ?? '',
    cover: parseCover(page),
    name: p['名稱']?.title?.[0]?.plain_text?.trim() ?? '',
    type: p['類型']?.select?.name ?? '',
    desc: richText(p['說明']),
    cta: p['CTA']?.url ?? richText(p['CTA']),
    ctaUrl: p['CTA']?.url ?? p['CTA']?.rich_text?.[0]?.text?.link?.url ?? '',
    tags: p['標籤']?.multi_select?.map((t: any) => t.name) ?? [],
    dateRange: richText(p['日期/天數']),
    persons: richText(p['適用人數']),
    lastUpdated: formatDate(page.last_edited_time ?? ''),
    relatedUrl: p['相關入口']?.url ?? richText(p['相關入口']),
  }
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function toDashedId(id: string): string {
  if (id.includes('-')) return id
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
}

// ─── Card queries ─────────────────────────────────────────────────────────────

export async function getAllCards(): Promise<NotionCard[]> {
  const res = await nPost(`data_sources/${DS_ID}/query`, {
    filter: { property: '類型', select: { does_not_equal: 'Tag' } },
    page_size: 100,
  })
  return ((res.results ?? []) as any[]).map(parseCard).filter(c => c.name)
}

export async function getCardsByType(type: CardType, excludeId?: string): Promise<NotionCard[]> {
  const res = await nPost(`data_sources/${DS_ID}/query`, {
    filter: { property: '類型', select: { equals: type } },
    page_size: 4,
  })
  const cards = ((res.results ?? []) as any[]).map(parseCard).filter(c => c.name)
  return excludeId ? cards.filter(c => c.id !== excludeId) : cards
}

export async function getCardById(id: string): Promise<NotionCard | null> {
  try {
    const page = await nGet(`pages/${toDashedId(id)}`)
    if (!page?.id) return null
    return parseCard(page)
  } catch {
    return null
  }
}

function isNotionId(str: string): boolean {
  return /^[0-9a-f]{32}$/.test(str)
}

export async function resolveCard(slugOrId: string): Promise<NotionCard | null> {
  if (isNotionId(slugOrId)) return getCardById(slugOrId)
  try {
    const res = await nPost(`data_sources/${DS_ID}/query`, {
      filter: { property: 'slug', rich_text: { equals: slugOrId } },
      page_size: 1,
    })
    const card = ((res.results ?? []) as any[]).map(parseCard).find((c: any) => c.name)
    if (card) return card
  } catch {}
  return getCardById(slugOrId)
}

// ─── Block fetching (recursive, each level cached independently) ───────────────

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const data = await nGet(`blocks/${toDashedId(pageId)}/children?page_size=100`)
  return Promise.all(
    (data.results as any[]).map(async (block: any) => {
      if (block.has_children) {
        block.children = await getPageBlocks(block.id.replace(/-/g, ''))
      }
      return block
    })
  )
}

export async function getPagePhoto(pageId: string): Promise<string> {
  try {
    const page = await nGet(`pages/${toDashedId(pageId)}`)
    if (page.icon?.type === 'external') return page.icon.external?.url ?? ''
    if (page.icon?.type === 'file') return page.icon.file?.url ?? ''
    return parseCover(page)
  } catch {
    return ''
  }
}

// ─── About page ───────────────────────────────────────────────────────────────

export interface AboutRecord {
  item: string
  desc: string
  note: string
  type: string
}

export async function getAboutRecords(): Promise<AboutRecord[]> {
  const dbId = toDashedId(process.env.NOTION_ABOUT_DB_ID ?? '358182065256808a8115d100847be973')
  const res = await nPost(`databases/${dbId}/query`, { page_size: 100 })

  const txt = (field: any): string =>
    (field?.rich_text ?? []).map((r: any) => r.plain_text).join('').trim()
  const ttl = (field: any): string =>
    (field?.title ?? []).map((r: any) => r.plain_text).join('').trim()

  return (res.results as any[])
    .map((page: any) => ({
      item: ttl(page.properties['項目']),
      desc: txt(page.properties['說明']),
      note: txt(page.properties['補充']),
      type: page.properties['類型']?.select?.name ?? '',
    }))
    .filter(r => r.item)
}

export const revalidate = REVALIDATE

// ─── Inline external links ────────────────────────────────────────────────────

export async function getInlineLinks(blocks: any[]): Promise<ExternalLink[]> {
  const linkDb = blocks.find(
    b => b.type === 'child_database' && b.child_database?.title?.toLowerCase().trim() === 'link'
  )
  if (!linkDb) return []

  const dbData = await nPost(`databases/${linkDb.id}/query`, { page_size: 20 })

  const relationIds: string[] = []
  for (const page of dbData.results ?? []) {
    for (const val of Object.values(page.properties ?? {})) {
      const v = val as any
      if (v.type === 'relation') {
        for (const rel of v.relation ?? []) {
          if (rel.id && !relationIds.includes(rel.id)) relationIds.push(rel.id)
        }
      }
    }
  }
  if (relationIds.length === 0) return []

  const links = await Promise.all(
    relationIds.map(async (id) => {
      try {
        const page = await nGet(`pages/${id}`)
        const p = page.properties
        const files = p['縮圖']?.files ?? []
        return {
          id: page.id.replace(/-/g, ''),
          name: p['名稱']?.title?.[0]?.plain_text?.trim() ?? '',
          url: p['網址']?.url ?? '',
          thumbnail: files[0] ? parseFileUrl(files[0]) : '',
          source: p['來源']?.select?.name ?? '外部網站',
          desc: p['簡介']?.rich_text?.[0]?.plain_text?.trim() ?? '',
          tags: [],
        } as ExternalLink
      } catch { return null }
    })
  )

  return links.filter((l): l is ExternalLink => l !== null && !!l.name && !!l.url)
}
