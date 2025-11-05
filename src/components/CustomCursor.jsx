import React, { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const { isDark } = useTheme()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (isMobile) return

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('resize', checkMobile)
      document.body.style.cursor = 'default'
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Main dot */}
      <div
        className="fixed pointer-events-none transition-transform duration-75 ease-out"
        style={{
          left: `${position.x - 16}px`,
          top: `${position.y - 16}px`,
          width: isClicking ? '5px' : '17px',
          height: isClicking ? '5px' : '17px',
          borderRadius: '50%',
          background: isDark ? 'rgba(234,179,8,0.9)' : '#A9343F',
          zIndex: 9999,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Outline ring */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: `${position.x - 24}px`,
          top: `${position.y - 24}px`,
          width: '33px',
          height: '33px',
          borderRadius: '50%',
          border: isDark ? '2px solid rgba(234,179,8,0.6)' : '2px solid #A9343F',
          opacity: 0.4,
          zIndex: 9998,
          animation: 'pulse 2s infinite ease-in-out',
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </>
  )
}

export default CustomCursor
