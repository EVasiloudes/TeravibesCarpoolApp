'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleFindRide = () => {
    if (user) {
      router.push('/trips')
    } else {
      setShowAuthModal(true)
    }
  }

  const handleOfferRide = () => {
    if (user) {
      router.push('/trips?create=true')
    } else {
      setShowAuthModal(true)
    }
  }
  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-text-inverse mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Teravibes Carpool
            </h1>
            <p className="text-xl text-text-inverse mb-4">
              Share rides to Teravibes Festival
            </p>
            <p className="text-lg text-text-inverse mb-12" style={{ opacity: 0.85 }}>
              August 23th, 2025 • Fasli, Cyprus
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-surface rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  How would you like to get to Teravibes?
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-background-alt border border-divider rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold mb-3 text-text-primary">Find a Ride</h3>
                    <p className="text-text-secondary mb-4">
                      Join someone else&apos;s trip and share the journey
                    </p>
                    <button
                      onClick={handleFindRide}
                      className="w-full bg-accent text-text-inverse py-2 px-4 rounded-md hover:bg-accent-dark cursor-pointer transition-colors"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Find a Ride
                    </button>
                  </div>

                  <div className="text-center p-6 bg-background-alt border border-divider rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚙</div>
                    <h3 className="text-xl font-semibold mb-3 text-text-primary">Offer a Ride</h3>
                    <p className="text-text-secondary mb-4">
                      Drive to the festival and take passengers
                    </p>
                    <button
                      onClick={handleOfferRide}
                      className="w-full bg-secondary text-text-inverse py-2 px-4 rounded-md hover:bg-secondary-dark cursor-pointer transition-colors"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Offer a Ride
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <footer className="bg-primary text-text-inverse py-6 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © 2025 Teravibes Festival. All rights reserved.
          </p>
          <p className="text-sm">
            Vibed with ❤️ by <a href="https://elias.densetheory.cc" className="underline hover:text-accent-light">Ηλίας</a>.
          </p>
        </div>
      </footer>
    </>
  )
}
