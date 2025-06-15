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
            <h1 className="text-5xl font-bold text-white-900 mb-6">
              Teravibes Carpool
            </h1>
            <p className="text-xl text-white-600 mb-4">
              Share rides to Teravibes Festival
            </p>
            <p className="text-lg text-white-500 mb-12">
              August 23th, 2025 • Fasli, Cyprus
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  How would you like to get to Teravibes?
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold mb-3">Find a Ride</h3>
                    <p className="text-gray-600 mb-4">
                      Join someone else&apos;s trip and share the journey
                    </p>
                    <button
                      onClick={handleFindRide}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Find a Ride
                    </button>
                  </div>

                  <div className="text-center p-6 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚙</div>
                    <h3 className="text-xl font-semibold mb-3">Offer a Ride</h3>
                    <p className="text-gray-600 mb-4">
                      Drive to the festival and take passengers
                    </p>
                    <button
                      onClick={handleOfferRide}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 cursor-pointer"
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
      <footer className="bg-gray-800 bg-opacity-95 backdrop-blur-sm text-white py-6 relative z-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © 2025 Teravibes Festival. All rights reserved.
          </p>
          <p className="text-sm">
            Vibed with ❤️ by <a href="https://elias.densetheory.cc">Ηλίας</a>.
          </p>
        </div>
      </footer>
    </>
  )
}
