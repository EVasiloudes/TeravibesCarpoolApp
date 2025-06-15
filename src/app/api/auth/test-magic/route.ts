import { NextResponse } from 'next/server'
import { magicAdmin } from '@/lib/magic-admin'

export async function GET() {
  try {
    console.log('Testing Magic Admin SDK configuration...')
    console.log('MAGIC_SECRET_KEY exists:', !!process.env.MAGIC_SECRET_KEY)
    console.log('MAGIC_SECRET_KEY starts with:', process.env.MAGIC_SECRET_KEY?.substring(0, 8))
    console.log('NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY exists:', !!process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
    console.log('NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY starts with:', process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY?.substring(0, 8))
    
    // Try to create a simple test
    const testResult = {
      adminSDKInitialized: !!magicAdmin,
      secretKeyConfigured: !!process.env.MAGIC_SECRET_KEY,
      publishableKeyConfigured: !!process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY,
      secretKeyPrefix: process.env.MAGIC_SECRET_KEY?.substring(0, 8),
      publishableKeyPrefix: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY?.substring(0, 8),
    }
    
    return NextResponse.json(testResult)
  } catch (error) {
    console.error('Magic test failed:', error)
    return NextResponse.json({ error: 'Magic test failed', details: error }, { status: 500 })
  }
}