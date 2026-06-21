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
  const transform = `translateY(${scrollY * -speed}px)`

  // Subtle opacity shift for depth as the user scrolls
  const scrollProgress = Math.min(scrollY / 1000, 1)
  const gradientOpacity = 0.85 + (scrollProgress * 0.15)

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
        <div className="relative w-full h-[120%] min-h-screen">
          {/* Main earthy gradient — forest green to warm clay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg,
                rgba(45, 58, 46, ${gradientOpacity}) 0%,
                rgba(74, 90, 71, ${gradientOpacity * 0.95}) 25%,
                rgba(166, 123, 79, ${gradientOpacity * 0.9}) 55%,
                rgba(224, 123, 84, ${gradientOpacity * 0.95}) 80%,
                rgba(196, 89, 52, ${gradientOpacity}) 100%)`,
            }}
          />

          {/* Soft radial overlay for depth */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(245, 241, 235, 0.08) 0%,
                rgba(245, 241, 235, 0.03) 40%,
                rgba(26, 35, 27, 0.15) 100%)`,
            }}
          />

          {/* Animated warm light sweep */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `linear-gradient(${45 + scrollProgress * 90}deg,
                rgba(244, 165, 130, 0.25) 0%,
                transparent 30%,
                transparent 70%,
                rgba(196, 149, 106, 0.15) 100%)`,
            }}
          />

          {/* Decorative dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F1EB' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              transform: `translateX(${scrollY * 0.1}px)`,
            }}
          />

          {/* Road/Path themed pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5F1EB' fill-opacity='0.4'%3E%3Crect x='40' y='8' width='20' height='4' rx='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 20px',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'center bottom',
              transform: `translateX(${-scrollY * 0.2}px)`,
            }}
          />

          {/* Festival sparkle accents in warm tones */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at ${20 + scrollProgress * 60}% ${30 + scrollProgress * 40}%,
                rgba(244, 165, 130, 0.35) 0%,
                transparent 2%),
                radial-gradient(circle at ${80 - scrollProgress * 30}% ${70 - scrollProgress * 20}%,
                rgba(196, 149, 106, 0.3) 0%,
                transparent 2%),
                radial-gradient(circle at ${50 + scrollProgress * 20}% ${20 + scrollProgress * 60}%,
                rgba(212, 176, 138, 0.3) 0%,
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
