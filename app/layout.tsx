import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Aimi Go 分享站',
  description: '這裡收集了一切能讓旅途更多靈感的東西。UIUX 設計師 Aimi 的旅遊行程、好用工具、通用模板與靈感收藏。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
