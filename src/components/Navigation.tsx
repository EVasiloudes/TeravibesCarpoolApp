'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import Button from './ui/Button'
import AuthModal from './AuthModal'
import NotificationDropdown from './NotificationDropdown'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide navigation on trip details pages
  const shouldHideNavigation = pathname?.startsWith('/trips/') && pathname !== '/trips'

  if (shouldHideNavigation) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    )
  }


  return (
    <>
      <nav className="bg-surface shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/teravibes-logo.png"
                alt="Teravibes Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h1 className="text-xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Teravibes Carpool
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-text-secondary hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/trips"
                    className="text-text-secondary hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Trips
                  </Link>
                  <Link
                    href="/profile"
                    className="text-text-secondary hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  <NotificationDropdown />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowAuthModal(true)
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {user && <NotificationDropdown />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-text-secondary hover:text-accent p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-divider bg-surface">
              <div className="px-2 py-3 space-y-1">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-text-secondary hover:text-accent hover:bg-background-alt rounded-md text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/trips"
                      className="block px-3 py-2 text-text-secondary hover:text-accent hover:bg-background-alt rounded-md text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Trips
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-text-secondary hover:text-accent hover:bg-background-alt rounded-md text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-text-secondary hover:text-accent hover:bg-background-alt rounded-md text-sm font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-accent hover:bg-background-alt rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
