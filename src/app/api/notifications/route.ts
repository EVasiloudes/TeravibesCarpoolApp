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

    // Get recent trip activity for user
    const notifications = []

    // Get trips user created that have new bookings
    const createdTrips = await prisma.trip.findMany({
      where: {
        creatorId: decoded.userId,
        bookings: {
          some: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        }
      },
      include: {
        bookings: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    for (const trip of createdTrips) {
      if (trip.bookings.length > 0) {
        const booking = trip.bookings[0]
        notifications.push({
          id: `booking-${booking.id}`,
          type: 'new_booking',
          title: 'New booking on your trip',
          message: `${booking.user.name || booking.user.email} joined your trip "${trip.title}"`,
          createdAt: booking.createdAt,
          tripId: trip.id
        })
      }
    }

    // Get trips user joined that have new messages
    const joinedTrips = await prisma.booking.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        trip: {
          include: {
            messages: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                },
                NOT: {
                  userId: decoded.userId // Exclude user's own messages
                }
              },
              include: {
                user: {
                  select: { name: true, email: true }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    })

    for (const booking of joinedTrips) {
      if (booking.trip.messages.length > 0) {
        const message = booking.trip.messages[0]
        notifications.push({
          id: `message-${message.id}`,
          type: 'new_message',
          title: 'New message in trip chat',
          message: `${message.user.name || message.user.email} sent a message in "${booking.trip.title}"`,
          createdAt: message.createdAt,
          tripId: booking.trip.id
        })
      }
    }

    // Sort by creation date
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      notifications: notifications.slice(0, 10) // Limit to 10 most recent
    })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}