'use client'

import { useState } from 'react'

interface CopyButtonProps {
  label: string
  code: string
}

export default function CopyButton({ label, code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
    }
  }

  return (
    <button className="cta-btn cta-btn-tool copy-btn" onClick={handleCopy}>
      {label}{' '}
      <span className={`copy-badge${copied ? ' bounce' : ''}`}>
        {copied ? '已複製！' : code}
      </span>
    </button>
  )
}
