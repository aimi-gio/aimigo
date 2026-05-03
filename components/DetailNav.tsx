'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface DetailNavProps {
  title: string
  backHref: string
  backLabel: string
}

export default function DetailNav({ title, backHref, backLabel }: DetailNavProps) {
  const titleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = document.querySelector('.hero')
    const titleEl = titleRef.current
    if (!hero || !titleEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        titleEl.classList.toggle('visible', !entries[0].isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">Aimi Go</Link>
      <span className="nav-title" ref={titleRef}>{title}</span>
      <Link href={backHref} className="nav-back">← {backLabel}</Link>
    </nav>
  )
}
