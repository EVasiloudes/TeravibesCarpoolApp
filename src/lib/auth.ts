import jwt from 'jsonwebtoken'
import { AuthUser } from '@/types'

export const generateJWT = (user: { id: string; email: string }): string => {
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