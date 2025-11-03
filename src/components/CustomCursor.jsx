import React, { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'


const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const { theme, toggleTheme, isDark } = useTheme()
  

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

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('resize', checkMobile)
      document.body.style.cursor = 'default'
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Main cursor with invert effect */}
      <div
        className="fixed pointer-events-none z-90 transition-all ease-in-out duration-200"
        style={{
          left: `${position.x - 16}px`,
          top: `${position.y - 16}px`,
          opacity: isVisible ? 1 : 0,
          width: isClicking ? '20px' : '32px',
          height: isClicking ? '20px' : '32px',
          padding: '4px',
          borderRadius: '50%',
        //   background: isDark ? '#A9343F' : 'rgba(234, 179, 8)',
          filter: 'invert(1)',
          mixBlendMode: 'difference',
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
          boxShadow: isDark ? '0 0 0 2px #A9313F' : '0 0 0 2px rgba(234, 179, 8)',
        }}
      />
      
      {/* Pulsing ring effect */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: `${position.x - 24}px`,
          top: `${position.y - 24}px`,
          opacity: isVisible ? 0.6 : 0,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: isDark ? '5px solid rgba(234, 179, 8)' : '5px solid #A9343F',
          animation: 'pulse 2s infinite'
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