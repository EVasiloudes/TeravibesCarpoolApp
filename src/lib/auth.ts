import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { AuthUser } from '@/types'

export const validateToken = async (magicToken: string): Promise<AuthUser | null> => {
  try {
    // For Phase 1, we'll do a simple validation
    // In production, this would use Magic SDK admin validation
    const decoded = jwt.decode(magicToken) as any
    
    if (!decoded || !decoded.email) {
      throw new Error('Invalid Magic token')
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: decoded.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decoded.email,
          name: decoded.email.split('@')[0], // Default name from email
        }
      })
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      phone: user.phone || undefined,
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return null
  }
}

export const generateJWT = (user: AuthUser): string => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '7d' }
  )
}

export const verifyJWT = (token: string): { userId: string; email: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    return {
      userId: decoded.userId,
      email: decoded.email
    }
  } catch (error) {
    return null
  }
}