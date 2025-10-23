import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-lg transition-all duration-300'
  
  const variants = {
    primary: 'text-primary-500 hover:text-white border border-primary-500',
    secondary: 'text-wine-500 hover:text-white border border-wine-500',
    outline: 'text-primary-500 hover:text-white border-2 border-primary-500',
    ghost: 'text-dark-700 dark:text-dark-300 hover:text-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const getHoverBackgroundColor = () => {
    switch (variant) {
      case 'primary': return 'bg-primary-500'
      case 'secondary': return 'bg-wine-500'
      case 'outline': return 'bg-primary-500'
      case 'ghost': return 'bg-primary-500'
      default: return 'bg-primary-500'
    }
  }
  

  return (
    <button 
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        group
        bg-transparent
      `}
      {...props}
    >
      {/* Text content - always on top */}
      <span className="relative z-20">
        {children}
      </span>
      
      {/* Animated fill background - starts from bottom */}
      <div 
        className={`
          absolute inset-0 
          ${getHoverBackgroundColor()} 
          transform origin-bottom scale-y-0 
          group-hover:scale-y-100 
          transition-transform duration-300 ease-out
          z-10
        `} 
      />
    </button>
  )
}

export default Button