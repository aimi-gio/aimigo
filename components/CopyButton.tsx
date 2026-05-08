'use client'

import { useState } from 'react'

interface CopyButtonProps {
  label: string
  code: string
  className?: string
  style?: React.CSSProperties
}

export default function CopyButton({ label, code, className, style }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button className={className ?? 'cta-btn cta-btn-tool copy-btn'} style={style} onClick={handleCopy}>
      {label}{' '}
      <span className={`copy-badge${copied ? ' bounce' : ''}`}>
        {copied ? '已複製！' : code}
      </span>
    </button>
  )
}
