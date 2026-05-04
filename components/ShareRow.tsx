'use client'

import { useState, useEffect } from 'react'

export default function ShareRow() {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { setUrl(window.location.href) }, [])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const threadsHref = `https://www.threads.net/intent/post?url=${encodeURIComponent(url)}`

  return (
    <div className="share-row">
      <span className="share-label">分享</span>
      <a href={threadsHref} target="_blank" rel="noopener noreferrer" className="share-btn">
        Threads
      </a>
      <button onClick={copy} className="share-btn">
        {copied ? '已複製 ✓' : '複製連結'}
      </button>
    </div>
  )
}
