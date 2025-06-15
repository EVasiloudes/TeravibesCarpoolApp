import { User, Trip, Booking, Message, TripStatus, BookingStatus } from '@prisma/client'

export type { User, Trip, Booking, Message, TripStatus, BookingStatus }

export interface TripWithCreator extends Trip {
  creator: User
  bookings: (Booking & { user: User })[]
  _count: {
    bookings: number
  }
}

export interface BookingWithDetails extends Booking {
  user: User
  trip: Trip & { creator: User }
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  phone?: string
  createdAt: string
  updatedAt: string
}