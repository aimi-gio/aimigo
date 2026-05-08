'use client'

import { useState } from 'react'

interface SmoothDetailsProps {
  summary: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

const Chevron = () => (
  <svg className="sd-chevron" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SmoothDetails({ summary, children, defaultOpen = false, className = '' }: SmoothDetailsProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`smooth-details${open ? ' is-open' : ''} ${className}`}>
      <div className="sd-trigger" onClick={() => setOpen(!open)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}>
        <Chevron />
        <span>{summary}</span>
      </div>
      <div className="sd-body">
        <div className="sd-body-inner">{children}</div>
      </div>
    </div>
  )
}
