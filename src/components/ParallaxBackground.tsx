'use client'

interface ParallaxBackgroundProps {
  children?: React.ReactNode
  className?: string
  speed?: number
}

export default function ParallaxBackground({
  children,
  className = '',
}: ParallaxBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Static earthy gradient — forest green to warm clay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #2D3A2E 0%, #4A5A47 25%, #A67B4F 55%, #E07B54 80%, #C45934 100%)',
          zIndex: -1,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
