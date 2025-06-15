'use client'

import { Magic } from 'magic-sdk'

const createMagic = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const publishableKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    return null
  }

  try {
    return new Magic(publishableKey)
  } catch (error) {
    return null
  }
}

export const magic = createMagic()