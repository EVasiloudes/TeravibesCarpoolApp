import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createBookingNotification } from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { id: tripId } = await params

    // Check if trip exists and is active
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    if (trip.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Trip is no longer active' },
        { status: 400 }
      )
    }

    if (trip.creatorId === decoded.userId) {
      return NextResponse.json(
        { error: 'You cannot join your own trip' },
        { status: 400 }
      )
    }

    // Check if user already joined this trip
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_tripId: {
          userId: decoded.userId,
          tripId: tripId
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already joined this trip' },
        { status: 400 }
      )
    }

    // Check if trip has available seats
    const availableSeats = trip.availableSeats - trip._count.bookings
    if (availableSeats <= 0) {
      return NextResponse.json(
        { error: 'No available seats on this trip' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: decoded.userId,
        tripId: tripId,
        seats: 1,
        status: 'CONFIRMED'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        trip: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    // Update trip status to FULL if no more seats available
    const newAvailableSeats = availableSeats - 1
    if (newAvailableSeats === 0) {
      await prisma.trip.update({
        where: { id: tripId },
        data: { status: 'FULL' }
      })
    }

    // Create notification for trip creator
    await createBookingNotification(tripId, booking.user.email, booking.user.name)

    return NextResponse.json({
      booking,
      message: 'Successfully joined trip'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to join trip' },
      { status: 500 }
    )
  }
}