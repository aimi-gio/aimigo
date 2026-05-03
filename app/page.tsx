import Nav from '@/components/Nav'
import HomeSections from '@/components/HomeSections'
import { getAllCards } from '@/lib/notion'

export const revalidate = 60

export default async function Home() {
  const cards = await getAllCards()
  return (
    <>
      <Nav />
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="avatar">AG</div>
          <div className="home-hero-text">
            <h1>Aimi Go 分享站</h1>
            <p>
              這裡收集了一切能讓旅途更多靈感的東西<br />
              UIUX 設計師 ／ 最近患上旅遊照拍了就一定要做成貼文強迫症
            </p>
          </div>
        </div>
      </div>
      <HomeSections cards={cards} />
    </>
  )
}
