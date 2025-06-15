'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TripWithCreator } from '@/types'
import Button from '@/components/ui/Button'
import TripForm from '@/components/TripForm'
import TripSearch, { SearchFilters } from '@/components/TripSearch'
import TripCard from '@/components/TripCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'

export default function TripsPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<TripWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchTrips()
      // Check if we should show create form from URL params
      if (searchParams.get('create') === 'true') {
        setShowCreateForm(true)
      }
    }
  }, [user, searchParams])

  const fetchTrips = async (filters?: SearchFilters) => {
    try {
      setSearchLoading(true)
      let url = '/api/trips'
      
      if (filters) {
        const params = new URLSearchParams()
        if (filters.origin) params.append('origin', filters.origin)
        if (filters.date) params.append('date', filters.date)
        if (params.toString()) {
          url += `?${params.toString()}`
        }
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }

      const data = await response.json()
      setTrips(data.trips)
    } catch (err) {
      setError('Failed to load trips')
      console.error('Fetch trips error:', err)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleJoinTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/join`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join trip')
      }

      // Refresh trips list
      fetchTrips()
      alert('Successfully joined trip!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to join trip')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner className="py-12" size="lg" />
      </div>
    )
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setShowCreateForm(false)
              router.push('/trips')
            }}
            className="mb-2 sm:mb-0 sm:mr-4"
            size="sm"
          >
            ← Back to Trips
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Trip</h1>
        </div>
        <TripForm onClose={() => {
          setShowCreateForm(false)
          router.push('/trips')
        }} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Available Trips</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="w-full sm:w-auto"
        >
          Create Trip
        </Button>
      </div>

      <TripSearch onSearch={fetchTrips} loading={searchLoading} />

      {error && (
        <ErrorMessage
          title="Failed to load trips"
          message={error}
          className="mb-6"
          action={
            <Button
              variant="outline"
              onClick={() => fetchTrips()}
              size="sm"
            >
              Try Again
            </Button>
          }
        />
      )}

      {loading ? (
        <LoadingSpinner className="py-12" size="lg" />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="No trips found"
          description="There are currently no trips matching your search criteria. Be the first to create one!"
          action={
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create the First Trip
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              currentUserId={user.id}
              onJoin={handleJoinTrip}
            />
          ))}
        </div>
      )}
    </div>
  )
}