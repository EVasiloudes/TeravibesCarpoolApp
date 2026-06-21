import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3, Space_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ParallaxBackground from '@/components/ParallaxBackground'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

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
    <html lang="en" data-theme="light" className={`${playfair.variable} ${sourceSans.variable} ${spaceMono.variable}`}>
      <body>
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
