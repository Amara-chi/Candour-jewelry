import React, { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (isMobile) return // Don't setup cursor effects on mobile

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Add event listeners
    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', checkMobile)
    }
  }, [isMobile])

  // Don't render on mobile devices
  if (isMobile) return null

  return (
    <>
      {/* Custom cursor dot */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 bg-transparent border-2 border-primary-500 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-50 transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)'
        }}
      />
      
      {/* CSS for the invert effect */}
      <style jsx>{`
        .mix-blend-difference {
          mix-blend-mode: difference;
        }
      `}</style>
    </>
  )
}

export default CustomCursor