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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {trip.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="font-medium">From:</span>
            <span className="ml-1">{trip.origin}</span>
            <span className="mx-2">→</span>
            <span className="font-medium">To:</span>
            <span className="ml-1">{trip.destination}</span>
          </div>
        </div>
        
        {trip.pricePerSeat && (
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              €{trip.pricePerSeat}
            </div>
            <div className="text-xs text-gray-500">per seat</div>
          </div>
        )}
      </div>

      {trip.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Date:</span>
          <div className="text-gray-600">{formatDate(trip.departureDate)}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Time:</span>
          <div className="text-gray-600">{formatTime(trip.departureTime)}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Driver:</span>
          <div className="text-gray-600">{trip.creator.name || trip.creator.email}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Available seats:</span>
          <div className={`${isFull ? 'text-red-600' : 'text-green-600'} font-medium`}>
            {availableSeats} / {trip.availableSeats}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link 
          href={`/trips/${trip.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>

        {showJoinButton && !isOwnTrip && (
          <div className="flex gap-2">
            {isFull ? (
              <div className="text-red-600 text-sm font-medium">
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
          <div className="text-blue-600 text-sm font-medium">
            Your trip
          </div>
        )}
      </div>
    </div>
  )
}