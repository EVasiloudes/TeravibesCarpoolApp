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
    console.log('Find Ride clicked, user:', user)
    if (user) {
      console.log('Navigating to /trips')
      router.push('/trips')
    } else {
      console.log('Showing auth modal')
      setShowAuthModal(true)
    }
  }

  const handleOfferRide = () => {
    console.log('Offer Ride clicked, user:', user)
    if (user) {
      console.log('Navigating to /trips?create=true')
      router.push('/trips?create=true')
    } else {
      console.log('Showing auth modal')
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              TeraVibes Carpool
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Share rides to TeraVibes Festival
            </p>
            <p className="text-lg text-gray-500 mb-12">
              August 24th, 2024 • Fasli, Cyprus
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  How would you like to get to TeraVibes?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold mb-3">Find a Ride</h3>
                    <p className="text-gray-600 mb-4">
                      Join someone else&apos;s trip and share the journey
                    </p>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleFindRide}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      Find a Ride
                    </Button>
                  </div>

                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚙</div>
                    <h3 className="text-xl font-semibold mb-3">Offer a Ride</h3>
                    <p className="text-gray-600 mb-4">
                      Drive to the festival and take passengers
                    </p>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={handleOfferRide}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      Offer a Ride
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-500">
                <p className="mb-2">
                  🎵 Teravibes Festival - Where music brings us together
                </p>
                <p className="text-sm">
                  Join the community and make the journey part of the experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}