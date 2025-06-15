import { NextRequest, NextResponse } from 'next/server'
import { validateMagicToken } from '@/lib/magic-admin'
import { generateJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { didToken } = await request.json()

    if (!didToken) {
      return NextResponse.json(
        { error: 'DID token is required' },
        { status: 400 }
      )
    }

    // Validate the Magic token and get user info
    const magicUser = await validateMagicToken(didToken)

    if (!magicUser || !magicUser.email) {
      return NextResponse.json(
        { error: 'Invalid Magic token' },
        { status: 401 }
      )
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: magicUser.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: magicUser.email,
          name: magicUser.email.split('@')[0], // Default name from email
        }
      })
    }

    // Generate JWT
    const jwtToken = generateJWT({
      id: user.id,
      email: user.email,
    })

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      message: 'Login successful'
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: false, // Allow in development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}