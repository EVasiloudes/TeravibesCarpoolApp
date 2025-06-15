'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TripWithCreator } from '@/types'
import TripCard from '@/components/TripCard'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface UserTripsData {
  createdTrips: TripWithCreator[]
  joinedTrips: (TripWithCreator & { booking: any })[]
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [tripsData, setTripsData] = useState<UserTripsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchUserTrips()
    }
  }, [user])

  const fetchUserTrips = async () => {
    try {
      const response = await fetch('/api/users/trips')
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }
      const data = await response.json()
      setTripsData(data)
    } catch (err) {
      setError('Failed to load your trips')
      console.error('Fetch user trips error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name || user.email}!</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/trips')}
        >
          Browse Trips
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading your trips...</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Created Trips */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Trips</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/trips')}
              >
                Create Trip
              </Button>
            </div>
            
            {tripsData?.createdTrips.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">You haven&apos;t created any trips yet</p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/trips')}
                >
                  Create Your First Trip
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tripsData?.createdTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    currentUserId={user.id}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Joined Trips */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trips You&apos;ve Joined</h2>
            
            {tripsData?.joinedTrips.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">You haven&apos;t joined any trips yet</p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/trips')}
                >
                  Find a Trip
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tripsData?.joinedTrips.map((trip) => (
                  <div key={trip.id} className="relative">
                    <TripCard
                      trip={trip}
                      currentUserId={user.id}
                      showJoinButton={false}
                    />
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Joined
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tripsData?.createdTrips.length || 0}
              </div>
              <div className="text-blue-800">Trips Created</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tripsData?.joinedTrips.length || 0}
              </div>
              <div className="text-green-800">Trips Joined</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(tripsData?.createdTrips.reduce((sum, trip) => sum + trip._count.bookings, 0) || 0)}
              </div>
              <div className="text-purple-800">Passengers Helped</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}