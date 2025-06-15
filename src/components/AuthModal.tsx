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
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
      </ParallaxBackground>
      
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl border border-white border-opacity-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white bg-opacity-90 backdrop-blur-sm"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 bg-opacity-90 backdrop-blur-sm p-3 rounded-md border border-red-200 border-opacity-50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center opacity-80">
            We&apos;ll send you a secure link to sign in without a password.
          </p>
        </form>
      </div>
    </div>
  )
}