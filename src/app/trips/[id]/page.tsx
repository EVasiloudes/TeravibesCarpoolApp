'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TripWithCreator } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'
import Button from '@/components/ui/Button'
import TripChat from '@/components/TripChat'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'

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

const CYPRUS_CITIES = [
  { value: '', label: 'Select origin city...' },
  { value: 'Nicosia', label: 'Nicosia' },
  { value: 'Limassol', label: 'Limassol' },
  { value: 'Larnaca', label: 'Larnaca' },
  { value: 'Paphos', label: 'Paphos' },
  { value: 'Famagusta', label: 'Famagusta' },
  { value: 'Kyrenia', label: 'Kyrenia' },
  { value: 'Protaras', label: 'Protaras' },
  { value: 'Ayia Napa', label: 'Ayia Napa' },
  { value: 'Polis', label: 'Polis' },
  { value: 'Other', label: 'Other' },
]

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [trip, setTrip] = useState<TripDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: 0,
  })

  const tripId = params.id as string

  const fetchTrip = useCallback(async () => {
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

      // Populate edit form data
      const tripDate = new Date(data.trip.departureDate)
      setEditData({
        title: data.trip.title,
        description: data.trip.description || '',
        origin: data.trip.origin,
        destination: data.trip.destination,
        departureDate: tripDate.toISOString().split('T')[0],
        departureTime: data.trip.departureTime,
        availableSeats: data.trip.availableSeats,
        pricePerSeat: data.trip.pricePerSeat || 0,
      })
    } catch (err) {
      setError('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    if (tripId) {
      fetchTrip()
    }
  }, [tripId, fetchTrip])

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
      // Successfully joined trip
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join trip')
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
      // Trip updated successfully
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trip')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trip) return

    setActionLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update trip')
      }

      await fetchTrip()
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trip')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditChange = (field: string, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleDeleteTrip = async () => {
    if (!trip || !confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return

    setActionLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete trip')
      }

      // Redirect to trips page after successful deletion
      router.push('/trips')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trip')
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
        <h1 className="text-3xl font-bold text-gray-600">{trip.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-600">Trip Details</h2>
              {isCreator && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Edit Trip
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <Input
                  label="Trip Title"
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  required
                />

                <Textarea
                  label="Description (Optional)"
                  value={editData.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  rows={3}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="Origin City"
                    value={editData.origin}
                    onChange={(e) => handleEditChange('origin', e.target.value)}
                    options={CYPRUS_CITIES}
                    required
                  />

                  <Input
                    label="Destination"
                    type="text"
                    value={editData.destination}
                    onChange={(e) => handleEditChange('destination', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Departure Date"
                    type="date"
                    value={editData.departureDate}
                    onChange={(e) => handleEditChange('departureDate', e.target.value)}
                    required
                  />

                  <Input
                    label="Departure Time"
                    type="time"
                    value={editData.departureTime}
                    onChange={(e) => handleEditChange('departureTime', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Available Seats"
                    type="number"
                    min={Math.max(1, trip._count.bookings)}
                    max="50"
                    value={editData.availableSeats}
                    onChange={(e) => handleEditChange('availableSeats', parseInt(e.target.value))}
                    required
                  />

                  <Input
                    label="Price per Seat (€)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editData.pricePerSeat}
                    onChange={(e) => handleEditChange('pricePerSeat', parseFloat(e.target.value))}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setError('')
                      }}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  {trip._count.bookings === 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteTrip}
                      disabled={actionLoading}
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                    >
                      Delete Trip
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Route</h3>
                    <div className="text-lg text-gray-600">
                      <span className="font-semibold text-gray-600">{trip.origin}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="font-semibold text-gray-600">{trip.destination}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Date & Time</h3>
                    <div>
                      <div className="font-semibold text-gray-600">{formatDate(trip.departureDate)}</div>
                      <div className="text-gray-500">{formatTime(trip.departureTime)}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Driver</h3>
                    <div className="font-semibold text-gray-600">
                      {trip.creator.name || trip.creator.email}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Seats</h3>
                    <div>
                      <span className="font-semibold text-gray-600">
                        {availableSeats} available
                      </span>
                      <span className="text-gray-500"> / {trip.availableSeats} total</span>
                    </div>
                  </div>

                  {trip.pricePerSeat && (
                    <div>
                      <h3 className="font-medium text-gray-500 mb-2">Price</h3>
                      <div className="text-lg font-semibold text-gray-600">
                        €{trip.pricePerSeat} per seat
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-500 mb-2">Status</h3>
                    <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600">
                      {trip.status}
                    </span>
                  </div>
                </div>

                {trip.description && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-500 mb-2">Description</h3>
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
              </>
            )}
          </div>

          {/* Participants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Participants ({trip.bookings.length + 1})
            </h2>

            <div className="space-y-3">
              {/* Driver */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-600">
                    {trip.creator.name || trip.creator.email}
                  </div>
                  <div className="text-sm text-gray-500">Driver</div>
                </div>
              </div>

              {/* Passengers */}
              {trip.bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div>
                    <div className="font-medium text-gray-600">
                      {booking.user.name || booking.user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Passenger • {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
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
              <h3 className="text-lg font-semibold text-gray-600 mb-4">Trip Chat</h3>
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
