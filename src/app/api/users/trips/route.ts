import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    // Get trips created by user
    const createdTrips = await prisma.trip.findMany({
      where: {
        creatorId: decoded.userId
      },
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
      },
      orderBy: {
        departureDate: 'asc'
      }
    })

    // Get trips user has joined
    const joinedBookings = await prisma.booking.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        trip: {
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
        }
      },
      orderBy: {
        trip: {
          departureDate: 'asc'
        }
      }
    })

    const joinedTrips = joinedBookings.map(booking => ({
      ...booking.trip,
      booking: {
        id: booking.id,
        seats: booking.seats,
        status: booking.status,
        createdAt: booking.createdAt
      }
    }))

    return NextResponse.json({
      createdTrips,
      joinedTrips
    })
  } catch (error) {
    console.error('User trips fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user trips' },
      { status: 500 }
    )
  }
}