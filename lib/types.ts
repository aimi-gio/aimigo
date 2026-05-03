export type TripType = 'ig' | 'direct' | 'placeholder'
export type ContentType = 'trip' | 'tool' | 'template' | 'inspo'

export interface RelatedLink {
  href: string
  emoji?: string
  type: string
  title: string
  desc?: string
}

export interface TripMeta {
  depart?: string
  arrive?: string
  days?: string
  people?: string
  cities?: string
}

export interface TripData {
  id: string
  emoji: string
  title: string
  meta: string
  chips: string[]
  type: TripType
  tripMeta?: TripMeta
  what?: string[]
  tips?: Array<{ icon: string; text: string }>
  igKeyword?: string
  igPostHref?: string
  notionTitle?: string
  relatedLinks?: RelatedLink[]
  ctaHref?: string
  ctaLabel?: string
}

export interface ToolData {
  id: string
  emoji: string
  title: string
  desc: string
  ctaText: string
  ctaHref?: string
  inviteCode?: string
  trustStats?: Array<{ num: string; label: string }>
  rewardNum?: string
  rewardTitle?: string
  rewardDesc?: string
  howSteps?: Array<{ title: string; sub: string }>
  useCases?: Array<{ icon: string; text: string }>
  notionTitle?: string
  articleLink?: { title: string; desc: string; url: string; urlLabel: string; emoji: string }
  disclaimer?: string
  relatedLinks?: RelatedLink[]
}

export interface TemplateData {
  id: string
  emoji: string
  title: string
  desc: string
  what?: string[]
  steps?: Array<{ title: string; desc: string; linkHref?: string; linkLabel?: string; linkExternal?: boolean }>
  relatedLinks?: RelatedLink[]
  disclaimer?: string
  ctaHref?: string
  ctaLabel?: string
}

export interface InspoData {
  id: string
  emoji: string
  title: string
  desc: string
  tags?: string[]
  body?: string[]
  highlight?: string
  infoItems?: Array<{ label: string; value: string }>
  relatedLinks?: RelatedLink[]
  moreItems?: Array<{ id: string; emoji: string; label: string; sub: string; bg: string }>
  ctaHref?: string
  ctaLabel?: string
}
