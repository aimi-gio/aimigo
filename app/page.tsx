import Nav from '@/components/Nav'
import HomeSections from '@/components/HomeSections'
import { getAllCards, getPagePhoto } from '@/lib/notion'

export const revalidate = 3600

const ABOUT_PAGE_ID = '34c18206525680369cb9dbe41b2be2f9'

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const [cards, photo] = await Promise.all([getAllCards(), getPagePhoto(ABOUT_PAGE_ID)])
  return (
    <>
      <Nav />
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="avatar">
            {photo
              ? <img src={photo} alt="Aimi" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50%' }} />
              : 'AG'
            }
          </div>
          <div className="home-hero-text">
            <h1>Aimi Go 分享站</h1>
            <p>
              這裡收集了一切能讓旅途更多靈感的東西<br />
              UIUX 設計師 ／ 最近患上旅遊照拍了就一定要做成貼文強迫症
            </p>
          </div>
        </div>
      </div>
      <HomeSections cards={cards} initialTab={tab} />
    </>
  )
}
