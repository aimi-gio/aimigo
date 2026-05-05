import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

const TYPE_BG: Record<string, string> = {
  trip: '#615559', tool: '#633A3A', template: '#5B7FA6', inspo: '#A580BB',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Aimi Go 分享站'
  const emoji = searchParams.get('emoji') ?? '✨'
  const type = searchParams.get('type') ?? ''
  const bg = TYPE_BG[type] ?? '#1a1a1a'

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
        background: bg, padding: '64px 72px', justifyContent: 'flex-end',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500,
          }}>AG</div>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>Aimi Go 分享站</span>
        </div>
        <div style={{ fontSize: 52, marginBottom: 20, lineHeight: 1 }}>{emoji}</div>
        <div style={{
          fontSize: 52, fontWeight: 700, color: '#fff', lineHeight: 1.25,
          marginBottom: 24, maxWidth: 900,
        }}>{title}</div>
        <div style={{
          fontSize: 18, color: 'rgba(255,255,255,0.45)',
          borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20,
        }}>旅遊行程 · 好用工具 · 通用模板 · 靈感收藏</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
