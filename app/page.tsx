import Nav from '@/components/Nav'
import HomeSections from '@/components/HomeSections'
import { getAllCards, getAboutRecords } from '@/lib/notion'

export const revalidate = 3600

const ABOUT_PAGE_ID = process.env.NOTION_ABOUT_PAGE_ID ?? '34c18206525680369cb9dbe41b2be2f9'

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const [cards, aboutRecords] = await Promise.all([
    getAllCards(),
    getAboutRecords().catch(() => []),
  ])
  const siteDesc = (aboutRecords as any[]).find((r: any) => r.item === '全網簡介')?.desc ?? ''

  return (
    <>
      <Nav />
      <div className="home-hero">
        <div className="home-hero-inner">
          <img src="/site-icon.png" alt="Aimi" className="avatar" />
          <div className="home-hero-text">
            <h1>Aimi Go 分享站</h1>
            {siteDesc && <p>{siteDesc}</p>}
          </div>
        </div>
      </div>
      <HomeSections cards={cards} initialTab={tab} />
    </>
  )
}
