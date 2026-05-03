import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DS_ID = process.env.NOTION_DS_ID ?? '22b18206525680d982e8000ba2c9e5af'

export type CardType = '旅遊行程' | '好用工具' | '通用模板' | '靈感收藏'

export interface NotionCard {
  id: string       // page ID without dashes
  icon: string
  name: string
  type: CardType
  desc: string
  cta: string      // raw CTA field: URL | invite code | label | ''
  tags: string[]
  dateRange: string
  persons: string
}

function richText(field: unknown): string {
  const f = field as any
  return f?.rich_text?.[0]?.plain_text?.trim() ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCard(page: any): NotionCard {
  const p = page.properties
  return {
    id: page.id.replace(/-/g, ''),
    icon: page.icon?.emoji ?? '',
    name: p['名稱']?.title?.[0]?.plain_text?.trim() ?? '',
    type: p['類型']?.select?.name ?? '',
    desc: richText(p['說明']),
    cta: richText(p['CTA']),
    tags: p['標籤']?.multi_select?.map((t: any) => t.name) ?? [],
    dateRange: richText(p['日期/天數']),
    persons: richText(p['適用人數']),
  }
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

export async function getCardsByType(type: CardType): Promise<NotionCard[]> {
  const res = await notion.dataSources.query({
    data_source_id: DS_ID,
    filter: { property: '類型', select: { equals: type } },
    page_size: 100,
  } as Parameters<typeof notion.dataSources.query>[0])
  return (res.results as any[]).map(parseCard).filter(c => c.name)
}

export async function getCardById(id: string): Promise<NotionCard | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: toDashedId(id) }) as any
    return parseCard(page)
  } catch {
    return null
  }
}

export const revalidate = 60
