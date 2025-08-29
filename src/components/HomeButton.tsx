// src/components/HomeButton.tsx
// Global Home Button Component - Available on all screens

'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

export function HomeButton() {
  return (
    <Link 
      href="/" 
      className="home-button"
      aria-label="Go to home"
      title="Go to home"
    >
      <Home size={20} />
    </Link>
  )
}
