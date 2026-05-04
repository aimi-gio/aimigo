import { MetadataRoute } from 'next'
import { getAllCards } from '@/lib/notion'

const BASE = 'https://aimigo.vercel.app'

const TYPE_SLUG: Record<string, string> = {
  '旅遊行程': 'trip', '好用工具': 'tool', '通用模板': 'template', '靈感收藏': 'inspo',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getAllCards()

  const cardRoutes: MetadataRoute.Sitemap = cards.map(card => ({
    url: `${BASE}/${TYPE_SLUG[card.type]}/${card.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...cardRoutes,
  ]
}
