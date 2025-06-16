import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTripUpdateNotification } from '@/lib/notifications'

// Get single trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              }
            }
          }
        },
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

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Trip fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

// Update trip
export async function PUT(
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
    const body = await request.json()

    // Check if trip exists and user owns it
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    if (existingTrip.creatorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own trips' },
        { status: 403 }
      )
    }

    // Don't allow reducing seats below current bookings
    if (body.availableSeats && body.availableSeats < existingTrip._count.bookings) {
      return NextResponse.json(
        { error: `Cannot reduce seats below ${existingTrip._count.bookings} (current bookings)` },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      origin,
      destination,
      departureDate,
      departureTime,
      availableSeats,
      pricePerSeat,
      status
    } = body

    let updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (origin !== undefined) updateData.origin = origin
    if (destination !== undefined) updateData.destination = destination
    if (departureTime !== undefined) updateData.departureTime = departureTime
    if (pricePerSeat !== undefined) updateData.pricePerSeat = pricePerSeat ? parseFloat(pricePerSeat) : null
    if (status !== undefined) updateData.status = status

    if (departureDate && departureTime) {
      const departureDateTime = new Date(`${departureDate}T${departureTime}`)
      if (departureDateTime < new Date()) {
        return NextResponse.json(
          { error: 'Departure time cannot be in the past' },
          { status: 400 }
        )
      }
      updateData.departureDate = departureDateTime
    }

    if (availableSeats !== undefined) {
      updateData.availableSeats = parseInt(availableSeats)
      // Update status based on availability
      if (updateData.availableSeats <= existingTrip._count.bookings) {
        updateData.status = 'FULL'
      } else if (existingTrip.status === 'FULL') {
        updateData.status = 'ACTIVE'
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    // Send notifications to all trip participants (excluding status-only updates)
    const isSignificantUpdate = title !== undefined || 
                               description !== undefined || 
                               origin !== undefined || 
                               destination !== undefined || 
                               departureDate !== undefined || 
                               departureTime !== undefined || 
                               availableSeats !== undefined || 
                               pricePerSeat !== undefined

    if (isSignificantUpdate) {
      await createTripUpdateNotification(tripId, decoded.userId)
    }

    return NextResponse.json({
      trip: updatedTrip,
      message: 'Trip updated successfully'
    })
  } catch (error) {
    console.error('Trip update error:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}

// Delete trip
export async function DELETE(
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

    // Check if trip exists and user owns it
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    if (existingTrip.creatorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own trips' },
        { status: 403 }
      )
    }

    // Don't allow deletion if there are bookings
    if (existingTrip._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete trip with existing bookings. Cancel the trip instead.' },
        { status: 400 }
      )
    }

    await prisma.trip.delete({
      where: { id: tripId }
    })

    return NextResponse.json({
      message: 'Trip deleted successfully'
    })
  } catch (error) {
    console.error('Trip deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    )
  }
}