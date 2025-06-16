import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ParallaxBackground from '@/components/ParallaxBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Teravibes Carpool',
  description: 'Share rides to Teravibes Festival',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ParallaxBackground className="min-h-screen">
            <Navigation />
            <main>{children}</main>
          </ParallaxBackground>
        </AuthProvider>
      </body>
    </html>
  )
}
