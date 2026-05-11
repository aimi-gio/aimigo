import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DS_ID = process.env.NOTION_DS_ID ?? '22b18206525680d982e8000ba2c9e5af'

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
  // 優先：頁面頂部 cover
  const url = parseFileUrl(page.cover)
  if (url) return url
  // Fallback：資料庫「封面」欄位（Files 屬性）
  const prop = page.properties?.['封面']
  if (prop?.type === 'files' && prop.files?.length > 0) {
    return parseFileUrl(prop.files[0])
  }
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function getAllCards(): Promise<NotionCard[]> {
  const res = await notion.dataSources.query({
    data_source_id: DS_ID,
    filter: { property: '類型', select: { does_not_equal: 'Tag' } },
    page_size: 100,
  } as Parameters<typeof notion.dataSources.query>[0])
  return (res.results as any[]).map(parseCard).filter(c => c.name)
}

export async function getCardsByType(type: CardType, excludeId?: string): Promise<NotionCard[]> {
  const res = await notion.dataSources.query({
    data_source_id: DS_ID,
    filter: { property: '類型', select: { equals: type } },
    page_size: 4,
  } as Parameters<typeof notion.dataSources.query>[0])
  const cards = (res.results as any[]).map(parseCard).filter(c => c.name)
  return excludeId ? cards.filter(c => c.id !== excludeId) : cards
}

export async function getCardById(id: string): Promise<NotionCard | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: toDashedId(id) }) as any
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
    const res = await notion.dataSources.query({
      data_source_id: DS_ID,
      filter: { property: 'slug', rich_text: { equals: slugOrId } },
      page_size: 1,
    } as Parameters<typeof notion.dataSources.query>[0])
    const card = (res.results as any[]).map(parseCard).find(c => c.name)
    if (card) return card
  } catch {}
  return getCardById(slugOrId)
}

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const res = await notion.blocks.children.list({
    block_id: toDashedId(pageId),
    page_size: 100,
  })
  return Promise.all(
    (res.results as any[]).map(async (block) => {
      if (block.has_children) {
        block.children = await getPageBlocks(block.id.replace(/-/g, ''))
      }
      return block
    })
  )
}

export async function getPagePhoto(pageId: string): Promise<string> {
  try {
    const page = await notion.pages.retrieve({ page_id: toDashedId(pageId) }) as any
    if (page.icon?.type === 'external') return page.icon.external?.url ?? ''
    if (page.icon?.type === 'file') return page.icon.file?.url ?? ''
    return parseCover(page)
  } catch {
    return ''
  }
}

export interface AboutRecord {
  item: string   // 項目（標題欄位）
  desc: string   // 說明
  note: string   // 補充（選填）
  type: string   // 類型 select：簡介 | 數字 | 連結
}

export async function getAboutRecords(): Promise<AboutRecord[]> {
  const dbId = toDashedId(process.env.NOTION_ABOUT_DB_ID ?? '358182065256808a8115d100847be973')

  const resp = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
    next: { revalidate: 3600 },
  })
  const res = await resp.json()

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

export const revalidate = 3600

export async function getInlineLinks(blocks: any[]): Promise<ExternalLink[]> {
  // Find child_database block named "link"
  const linkDb = blocks.find(
    b => b.type === 'child_database' && b.child_database?.title?.toLowerCase().trim() === 'link'
  )
  if (!linkDb) return []

  // Query the inline database
  const dbResp = await fetch(`https://api.notion.com/v1/databases/${linkDb.id}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 20 }),
    next: { revalidate: 3600 },
  })
  const dbData = await dbResp.json()

  // Collect all relation IDs across all entries and relation properties
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

  // Fetch each linked external link page in parallel (with ISR cache)
  const links = await Promise.all(
    relationIds.map(async (id) => {
      try {
        const resp = await fetch(`https://api.notion.com/v1/pages/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
          },
          next: { revalidate: 3600 },
        })
        const page = await resp.json()
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
