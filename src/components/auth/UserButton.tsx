// src/components/auth/UserButton.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { User, LogOut, Library } from 'lucide-react'
import { useState } from 'react'

export function UserButton() {
  const { user, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) {
    return (
      <button className="p-2 rounded-full bg-secondary-cream border-2 border-primary-blue/30 opacity-60" aria-label="Loading" />
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="p-2 rounded-full bg-secondary-cream border-2 border-primary-blue/30 hover:border-primary-blue transition-all"
        aria-label="Log in"
      >
        <User className="text-primary-navy" size={20} />
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full bg-secondary-cream border-2 border-primary-blue/30 hover:border-primary-blue transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <User className="text-primary-navy" size={20} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[180px] rounded-xl bg-white shadow-lg border border-primary-blue/20 p-2 z-10">
          <Link
            href="/stories"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-cream text-primary-navy"
            onClick={() => setOpen(false)}
          >
            <Library size={18} /> My Stories
          </Link>
          <button
            onClick={async () => { await signOut(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-cream text-primary-navy"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}


