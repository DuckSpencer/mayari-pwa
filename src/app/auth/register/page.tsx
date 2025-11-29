// app/auth/register/page.tsx - Registration page
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, KeyRound, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Registration successful! Please check your email to confirm your account.')
        // Optionally redirect to login or home
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 text-primary-navy font-sans bg-primary-warm">
      {/* Header */}
      <div className="w-full max-w-sm mx-auto pt-12 safe-area-top">
        <h2 className="text-4xl font-bold font-sans text-primary-navy">Create Account</h2>
        <p className="text-base font-sans text-neutral mt-2">Start your magical journey with us.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="w-full max-w-sm mx-auto flex flex-col gap-4">
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
              minLength={6}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-medium text-primary-navy">Confirm Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={20} />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-10"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-error font-medium font-sans">{error}</p>
        )}

        {success && (
          <p className="text-sm text-success font-medium font-sans">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-4"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="w-full max-w-sm mx-auto pb-8 safe-area-bottom">
        <p className="text-center text-sm text-neutral">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary-blue hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}