// Phase 2: Notion API integration
// @notionhq/client v5 has breaking changes — update when connecting to Notion

export async function getAllItems(): Promise<unknown[]> {
  throw new Error('Notion API not configured. Set NOTION_API_KEY and NOTION_DATABASE_ID in .env.local')
}

export async function getItemsByType(_type: string): Promise<unknown[]> {
  throw new Error('Notion API not configured.')
}

export async function getPageBlocks(_pageId: string): Promise<unknown[]> {
  throw new Error('Notion API not configured.')
}

export const revalidate = 60
