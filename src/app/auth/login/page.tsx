// app/auth/login/page.tsx - Login page
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, KeyRound, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 text-primary-navy font-sans bg-primary-warm">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto pt-12 safe-area-top">
        <h2 className="text-4xl font-bold font-sans text-primary-navy">Welcome Back</h2>
        <p className="text-base font-sans text-neutral mt-2">Let&apos;s continue the adventure.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-primary-navy">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={20} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-primary-navy">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={20} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-error font-medium font-sans">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Log In'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="w-full max-w-sm mx-auto pb-8 safe-area-bottom">
        <p className="text-center text-sm text-neutral">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-primary-blue hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}