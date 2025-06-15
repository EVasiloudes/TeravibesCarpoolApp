'use client'

import { useScrollPosition } from '@/hooks/useScrollPosition'

interface ParallaxBackgroundProps {
  children?: React.ReactNode
  className?: string
  speed?: number
}

export default function ParallaxBackground({
  children,
  className = '',
  speed = 0.5
}: ParallaxBackgroundProps) {
  const { y: scrollY } = useScrollPosition({ throttle: 8 })

  // Calculate the transform value for reverse parallax
  // Negative value creates reverse effect (background moves opposite to scroll)
  const transform = `translateY(${scrollY * -speed}px)`

  // Dynamic gradient based on scroll position for extra visual interest
  const scrollProgress = Math.min(scrollY / 1000, 1) // Normalize scroll to 0-1
  const gradientOpacity = 0.8 + (scrollProgress * 0.2) // Subtle opacity change

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Layer with Parallax Effect */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform,
          zIndex: -1,
        }}
      >
        {/* Dynamic Teravibes Gradient Background */}
        <div className="relative w-full h-[120%] min-h-screen">
          {/* Main gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg,
                rgba(102, 126, 234, ${gradientOpacity}) 0%,
                rgba(118, 75, 162, ${gradientOpacity * 0.9}) 25%,
                rgba(240, 147, 251, ${gradientOpacity * 0.8}) 50%,
                rgba(245, 87, 108, ${gradientOpacity * 0.9}) 75%,
                rgba(255, 154, 0, ${gradientOpacity}) 100%)`,
            }}
          />

          {/* Overlay gradient for depth */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                rgba(0, 0, 0, 0.1) 100%)`,
            }}
          />

          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(${45 + scrollProgress * 90}deg,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 30%,
                transparent 70%,
                rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />

          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              transform: `translateX(${scrollY * 0.1}px)`, // Subtle horizontal movement
            }}
          />

          {/* Road/Path themed pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Crect x='40' y='8' width='20' height='4' rx='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 20px',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'center bottom',
              transform: `translateX(${-scrollY * 0.2}px)`, // Reverse horizontal movement
            }}
          />

          {/* Festival vibes sparkle effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at ${20 + scrollProgress * 60}% ${30 + scrollProgress * 40}%,
                rgba(255, 223, 0, 0.3) 0%,
                transparent 2%),
                radial-gradient(circle at ${80 - scrollProgress * 30}% ${70 - scrollProgress * 20}%,
                rgba(255, 105, 180, 0.3) 0%,
                transparent 2%),
                radial-gradient(circle at ${50 + scrollProgress * 20}% ${20 + scrollProgress * 60}%,
                rgba(0, 255, 255, 0.3) 0%,
                transparent 2%)`,
            }}
          />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
