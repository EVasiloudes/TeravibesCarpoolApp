'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ParallaxBackground from './ParallaxBackground'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      await login(email)
      onClose()
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <ParallaxBackground className="absolute inset-0" speed={0.3}>
        <div className="absolute inset-0 bg-overlay backdrop-blur-sm" />
      </ParallaxBackground>

      <div className="relative z-10 bg-surface rounded-lg p-8 w-full max-w-md mx-4 shadow-xl border border-divider">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-divider rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-text-primary bg-surface"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 text-error text-sm bg-error/10 p-3 rounded-md border border-error/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-accent text-text-inverse py-2 px-4 rounded-md hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </button>

          <p className="text-xs text-text-muted mt-4 text-center">
            We&apos;ll send you a secure link to sign in without a password.
          </p>
        </form>
      </div>
    </div>
  )
}
