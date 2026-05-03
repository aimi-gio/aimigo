export type TripType = 'ig' | 'direct' | 'placeholder'

export interface Trip {
  id: string
  emoji: string
  title: string
  meta: string
  chips: string[]
  type: TripType
}

export interface Tool {
  id: string
  emoji: string
  title: string
  desc: string
  ctaText: string
  ctaHref?: string
  inviteCode?: string
}

export interface Template {
  id: string
  emoji: string
  title: string
  desc: string
}

export interface Inspo {
  id: string
  emoji: string
  title: string
  desc: string
}

export const trips: Trip[] = [
  {
    id: 'turkey',
    emoji: '🇹🇷',
    title: '土耳其 16 Days in Türkiye',
    meta: '2026/3/27–4/8 · 12 天 · 4 人',
    chips: ['棉堡', '熱氣球', '伊斯坦堡'],
    type: 'ig',
  },
  {
    id: 'shanghai',
    emoji: '🇨🇳',
    title: '上海找朋友',
    meta: '2026/1/23–28 · 6 天 · 3–4 人',
    chips: ['迪士尼', '浮誇妝髮', '烏鎮'],
    type: 'direct',
  },
  {
    id: 'setouchi',
    emoji: '🇯🇵',
    title: '瀨戶內藝術祭',
    meta: '2025/10 · 10 天 · 2 人',
    chips: ['犬島', '直島', '大阪'],
    type: 'ig',
  },
  {
    id: 'tokyo',
    emoji: '🇯🇵',
    title: '東京孝親',
    meta: '2025/9/19–23 · 5 天 · 3 人',
    chips: ['帶父母', '輕鬆行程'],
    type: 'direct',
  },
  {
    id: 'okinawa',
    emoji: '🏝️',
    title: '沖繩團體快閃',
    meta: '2025 · 4 天 · 4 人',
    chips: ['海灘', '浮潛'],
    type: 'direct',
  },
  {
    id: 'placeholder',
    emoji: '',
    title: '',
    meta: '',
    chips: [],
    type: 'placeholder',
  },
]

export const tools: Tool[] = [
  {
    id: 'esim',
    emoji: '📡',
    title: 'e心通 eSIM',
    desc: '購買流程超輕鬆，免註冊會員，本人實測網速順暢！',
    ctaText: '前往購買',
    ctaHref: '/tool/esim',
  },
  {
    id: 'shopback',
    emoji: '💰',
    title: 'Shopback',
    desc: '透過我的連結可得 100 獎金，不拿白不拿！',
    ctaText: '前往註冊',
    ctaHref: '/tool/shopback',
  },
  {
    id: 'cube',
    emoji: '💳',
    title: '國泰 Cube 卡',
    desc: '出國刷「趣旅行」無腦 3% 回饋無上限',
    ctaText: '點我申辦',
    ctaHref: '#',
  },
  {
    id: 'wowpass',
    emoji: '🔑',
    title: 'WOWPASS',
    desc: '多享 0.5% 換匯回饋，複製邀請碼使用',
    ctaText: '複製邀請碼',
    inviteCode: 'Y55KQ873',
  },
]

export const templates: Template[] = [
  {
    id: 'itinerary',
    emoji: '📋',
    title: '10 日內行程簡易模板',
    desc: '裡面的行程、金額可以自行更改咻！',
  },
  {
    id: 'destination',
    emoji: '🗺️',
    title: '選地點模板',
    desc: '不知道要去哪裡玩嗎？',
  },
  {
    id: 'figma',
    emoji: '👗',
    title: 'Figma 紙娃娃說明書',
    desc: '適合多天數的服裝行李準備',
  },
  {
    id: 'ai-outfit',
    emoji: '🤖',
    title: 'AI 旅遊穿搭建議指令',
    desc: '輕鬆決定行李箱要帶哪些可以互相搭配的衣服',
  },
]

export const inspo: Inspo[] = [
  {
    id: 'taoyuan-costume',
    emoji: '🎭',
    title: '桃園換裝 — 玉飲翡翠文化城',
    desc: '換裝體驗 · 桃園',
  },
  {
    id: 'jeju-nyeok',
    emoji: '🏠',
    title: '濟州島住宿 NYEOK',
    desc: '韓國訂房 Stayfolio',
  },
  {
    id: 'mudan-villa',
    emoji: '🌿',
    title: '牡丹 小山溪',
    desc: '週末近郊兩人包棟',
  },
  {
    id: 'google-map-labels',
    emoji: '🗺️',
    title: 'Google Map 標籤功能',
    desc: '分類中的分類',
  },
]
