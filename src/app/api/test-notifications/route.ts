import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    // Create sample notifications for testing
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: decoded.userId,
          type: 'NEW_BOOKING',
          title: 'New booking on your trip',
          message: 'John Doe joined your trip "Drive to Teravibes from Limassol"',
        }
      }),
      prisma.notification.create({
        data: {
          userId: decoded.userId,
          type: 'NEW_MESSAGE',
          title: 'New message in trip chat',
          message: 'Jane Smith sent a message in "Drive to Teravibes from Paphos"',
        }
      }),
      prisma.notification.create({
        data: {
          userId: decoded.userId,
          type: 'TRIP_UPDATE',
          title: 'Trip update',
          message: 'Your trip departure time has been changed to 10:00 AM',
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: `Created ${notifications.length} test notifications`,
      notifications
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create test notifications' },
      { status: 500 }
    )
  }
}
