export function isCopyCode(cta: string) { return /^複製[：:]/.test(cta) }
export function extractCode(cta: string) { return cta.replace(/^複製[：:]/, '') }
export function isExternalUrl(cta: string) { return cta.startsWith('http') }
export function isIgLimited(cta: string) { return cta.startsWith('ig:') }
export function isComingSoon(cta: string) { return cta === '佛系整理中' }
