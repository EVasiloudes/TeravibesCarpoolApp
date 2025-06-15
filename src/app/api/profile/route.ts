import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
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
    const { name, phone } = body

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      )
    }

    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone must be a string' },
        { status: 400 }
      )
    }

    // Validate phone format if provided
    if (phone && phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)\.]/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: name?.trim() || null,
        phone: phone?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}