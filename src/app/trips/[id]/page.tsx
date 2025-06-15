'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TripWithCreator } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'
import Button from '@/components/ui/Button'
import TripChat from '@/components/TripChat'

interface TripDetailData extends Omit<TripWithCreator, 'bookings'> {
  bookings: Array<{
    id: string
    seats: number
    status: string
    createdAt: Date
    updatedAt: Date
    userId: string
    tripId: string
    user: {
      id: string
      email: string
      name: string | null
    }
  }>
}

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [trip, setTrip] = useState<TripDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const tripId = params.id as string

  useEffect(() => {
    if (tripId) {
      fetchTrip()
    }
  }, [tripId])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Trip not found')
        } else {
          throw new Error('Failed to fetch trip')
        }
        return
      }
      const data = await response.json()
      setTrip(data.trip)
    } catch (err) {
      setError('Failed to load trip details')
      console.error('Fetch trip error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTrip = async () => {
    if (!user || !trip) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/trips/${tripId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join trip')
      }

      // Refresh trip data
      await fetchTrip()
      alert('Successfully joined trip!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to join trip')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (!trip) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update trip')
      }

      await fetchTrip()
      alert(`Trip ${status.toLowerCase()} successfully!`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update trip')
    } finally {
      setActionLoading(false)
    }
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading trip details...</div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error || 'Trip not found'}</div>
          <Button onClick={() => router.push('/trips')}>
            Back to Trips
          </Button>
        </div>
      </div>
    )
  }

  const isCreator = trip.creatorId === user.id
  const userBooking = trip.bookings.find(booking => booking.user.id === user.id)
  const isParticipant = isCreator || !!userBooking
  const availableSeats = trip.availableSeats - trip._count.bookings
  const canJoin = !isCreator && !userBooking && availableSeats > 0 && trip.status === 'ACTIVE'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/trips')}
          className="mb-4"
        >
          ← Back to Trips
        </Button>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Route</h3>
                <div className="text-lg">
                  <span className="font-semibold">{trip.origin}</span>
                  <span className="mx-2 text-gray-500">→</span>
                  <span className="font-semibold">{trip.destination}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Date & Time</h3>
                <div>
                  <div className="font-semibold">{formatDate(trip.departureDate)}</div>
                  <div className="text-gray-600">{formatTime(trip.departureTime)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Driver</h3>
                <div className="font-semibold">
                  {trip.creator.name || trip.creator.email}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Seats</h3>
                <div>
                  <span className={`font-semibold ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {availableSeats} available
                  </span>
                  <span className="text-gray-600"> / {trip.availableSeats} total</span>
                </div>
              </div>

              {trip.pricePerSeat && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                  <div className="text-lg font-semibold text-green-600">
                    €{trip.pricePerSeat} per seat
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Status</h3>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  trip.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  trip.status === 'FULL' ? 'bg-blue-100 text-blue-800' :
                  trip.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trip.status}
                </span>
              </div>
            </div>

            {trip.description && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{trip.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {canJoin && (
                <Button
                  onClick={handleJoinTrip}
                  disabled={actionLoading}
                  variant="primary"
                >
                  {actionLoading ? 'Joining...' : 'Join Trip'}
                </Button>
              )}

              {isCreator && trip.status === 'ACTIVE' && (
                <>
                  <Button
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    disabled={actionLoading}
                    variant="outline"
                  >
                    Cancel Trip
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    disabled={actionLoading}
                    variant="secondary"
                  >
                    Mark Complete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Participants ({trip.bookings.length + 1})
            </h2>
            
            <div className="space-y-3">
              {/* Driver */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">
                    {trip.creator.name || trip.creator.email}
                  </div>
                  <div className="text-sm text-gray-600">Driver</div>
                </div>
              </div>

              {/* Passengers */}
              {trip.bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">
                      {booking.user.name || booking.user.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      Passenger • {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-1">
          {isParticipant ? (
            <TripChat tripId={tripId} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Trip Chat</h3>
              <div className="text-center text-gray-500 py-8">
                Join this trip to access the chat
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}