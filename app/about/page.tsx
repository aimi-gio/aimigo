import Nav from '@/components/Nav'

export const metadata = {
  title: '關於我 · Aimi Go 分享站',
  description: 'UIUX 設計師 Aimi，透過 Instagram 分享旅遊行程、好用工具與生活靈感。',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: 'var(--color-accent)', margin: '0 auto 1.5rem', border: '0.5px solid var(--color-border)' }}>
          AG
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '0.75rem' }}>Hi，我是 Aimi！</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 2rem' }}>
          UIUX 設計師，業餘時間是 Instagram 旅遊照片圖文創作者。<br />
          這個網站收集了一切能讓旅途更有靈感的東西。<br />
          行程、工具、模板，都是本人親身使用過的推薦。
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.instagram.com/aimi.go_/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, padding: '8px 20px', borderRadius: 8, background: 'var(--color-primary)', color: '#fff' }}>
            Instagram @aimi.go_
          </a>
          <a href="https://www.threads.com/@aimi.go_" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, padding: '8px 20px', borderRadius: 8, background: 'var(--color-primary-light)', color: 'var(--color-text-primary)', border: '0.5px solid var(--color-border)' }}>
            Threads @aimi.go_
          </a>
        </div>
      </div>
    </>
  )
}
