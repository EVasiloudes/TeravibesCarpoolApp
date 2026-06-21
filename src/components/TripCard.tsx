'use client'

import Link from 'next/link'
import { TripWithCreator } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'
import Button from './ui/Button'

interface TripCardProps {
  trip: TripWithCreator
  onJoin?: (tripId: string) => void
  currentUserId?: string
  showJoinButton?: boolean
}

export default function TripCard({ trip, onJoin, currentUserId, showJoinButton = true }: TripCardProps) {
  const availableSeats = trip.availableSeats - trip._count.bookings
  const isOwnTrip = currentUserId === trip.creatorId
  const isFull = availableSeats <= 0

  return (
    <div className="bg-surface rounded-lg shadow-md border border-divider p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {trip.title}
          </h3>
          <div className="flex items-center text-sm text-text-secondary mb-2">
            <span className="font-medium">From:</span>
            <span className="ml-1">{trip.origin}</span>
            <span className="mx-2">→</span>
            <span className="font-medium">To:</span>
            <span className="ml-1">{trip.destination}</span>
          </div>
        </div>

        {trip.pricePerSeat && (
          <div className="text-right">
            <div className="text-lg font-bold text-secondary-dark">
              €{trip.pricePerSeat}
            </div>
            <div className="text-xs text-text-muted">per seat</div>
          </div>
        )}
      </div>

      {trip.description && (
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-text-primary">Date:</span>
          <div className="text-text-secondary">{formatDate(trip.departureDate)}</div>
        </div>
        <div>
          <span className="font-medium text-text-primary">Time:</span>
          <div className="text-text-secondary">{formatTime(trip.departureTime)}</div>
        </div>
        <div>
          <span className="font-medium text-text-primary">Driver:</span>
          <div className="text-text-secondary">{trip.creator.name || trip.creator.email}</div>
        </div>
        <div>
          <span className="font-medium text-text-primary">Available seats:</span>
          <div className={`${isFull ? 'text-error' : 'text-success'} font-medium`}>
            {availableSeats} / {trip.availableSeats}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/trips/${trip.id}`}
          className="text-accent hover:text-accent-dark text-sm font-medium transition-colors"
        >
          View Details
        </Link>

        {showJoinButton && !isOwnTrip && (
          <div className="flex gap-2">
            {isFull ? (
              <div className="text-error text-sm font-medium">
                Trip is full
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onJoin?.(trip.id)}
              >
                Join Trip
              </Button>
            )}
          </div>
        )}

        {isOwnTrip && (
          <div className="text-secondary-dark text-sm font-medium">
            Your trip
          </div>
        )}
      </div>
    </div>
  )
}
