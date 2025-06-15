import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createMessageNotification } from '@/lib/notifications'

// Get messages for a trip
export async function GET(
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

    // Check if user is part of this trip (creator or passenger)
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: {
          where: { userId: decoded.userId }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const isCreator = trip.creatorId === decoded.userId
    const isPassenger = trip.bookings.length > 0

    if (!isCreator && !isPassenger) {
      return NextResponse.json(
        { error: 'You must be part of this trip to view messages' },
        { status: 403 }
      )
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// Send a message to trip chat
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
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Check if user is part of this trip
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: {
          where: { userId: decoded.userId }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const isCreator = trip.creatorId === decoded.userId
    const isPassenger = trip.bookings.length > 0

    if (!isCreator && !isPassenger) {
      return NextResponse.json(
        { error: 'You must be part of this trip to send messages' },
        { status: 403 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: decoded.userId,
        tripId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    })

    // Create notifications for other trip participants
    await createMessageNotification(tripId, message.user.email, message.user.name)

    return NextResponse.json({
      message,
      success: 'Message sent successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}