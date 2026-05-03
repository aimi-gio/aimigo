import Nav from '@/components/Nav'
import NotionBlocks, { splitBlocks, flattenBlocks } from '@/components/NotionBlocks'
import { getPageBlocks } from '@/lib/notion'

export const revalidate = 3600

export const metadata = {
  title: '關於我 · Aimi Go 分享站',
  description: 'UIUX 設計師 Aimi，透過 Instagram 分享旅遊行程、好用工具與生活靈感。',
}

const ABOUT_PAGE_ID = '34c18206525680369cb9dbe41b2be2f9'

export default async function AboutPage() {
  const rawBlocks = await getPageBlocks(ABOUT_PAGE_ID)
  const { content } = splitBlocks(flattenBlocks(rawBlocks))

  return (
    <>
      <Nav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: 'var(--color-accent)', margin: '0 auto 1.5rem', border: '0.5px solid var(--color-border)' }}>
          AG
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '0.75rem' }}>Hi，我是 Aimi！</h1>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
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

      {content.length > 0 && (
        <div className="content" style={{ paddingBottom: '4rem' }}>
          <div className="article-body">
            <NotionBlocks blocks={content} />
          </div>
        </div>
      )}
    </>
  )
}
