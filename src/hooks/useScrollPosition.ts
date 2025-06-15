import { useEffect, useState, useCallback } from 'react'

interface ScrollPosition {
  x: number
  y: number
}

interface UseScrollPositionOptions {
  throttle?: number
  element?: Element | null
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { throttle = 16, element } = options // Default to ~60fps
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 })

  const handleScroll = useCallback(() => {
    if (element) {
      setScrollPosition({
        x: element.scrollLeft,
        y: element.scrollTop,
      })
    } else {
      setScrollPosition({
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop,
      })
    }
  }, [element])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: NodeJS.Timeout | null = null
    let ticking = false

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    const debouncedHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(throttledHandleScroll, throttle)
    }

    const target = element || window
    target.addEventListener('scroll', debouncedHandleScroll, { passive: true })

    // Get initial position
    handleScroll()

    return () => {
      target.removeEventListener('scroll', debouncedHandleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [element, throttle, handleScroll])

  return scrollPosition
}

export default useScrollPosition