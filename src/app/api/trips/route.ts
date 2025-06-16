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

    const body = await request.json()
    const {
      title,
      description,
      origin,
      destination,
      departureDate,
      departureTime,
      availableSeats,
      pricePerSeat
    } = body

    // Validation
    if (!title || !origin || !destination || !departureDate || !departureTime || !availableSeats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (availableSeats < 1 || availableSeats > 50) {
      return NextResponse.json(
        { error: 'Available seats must be between 1 and 50' },
        { status: 400 }
      )
    }

    if (pricePerSeat < 0) {
      return NextResponse.json(
        { error: 'Price per seat cannot be negative' },
        { status: 400 }
      )
    }

    // Parse departure date and time
    const departureDateTime = new Date(`${departureDate}T${departureTime}`)

    if (departureDateTime < new Date()) {
      return NextResponse.json(
        { error: 'Departure time cannot be in the past' },
        { status: 400 }
      )
    }

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        title,
        description: description || null,
        origin,
        destination,
        departureDate: departureDateTime,
        departureTime,
        availableSeats: parseInt(availableSeats),
        pricePerSeat: pricePerSeat ? parseFloat(pricePerSeat) : null,
        creatorId: decoded.userId,
      },
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

    return NextResponse.json({
      trip,
      message: 'Trip created successfully'
    })
  } catch (error) {
    console.error('Trip creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get('origin')
    const date = searchParams.get('date')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereClause: any = {
      status: 'ACTIVE',
      departureDate: {
        gte: new Date() // Only show future trips
      }
    }

    if (origin) {
      whereClause.origin = {
        contains: origin,
        mode: 'insensitive'
      }
    }

    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)

      whereClause.departureDate = {
        gte: searchDate,
        lt: nextDay
      }
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where: whereClause,
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
        },
        orderBy: {
          departureDate: 'asc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trip.count({ where: whereClause })
    ])

    return NextResponse.json({
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Trips fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}
