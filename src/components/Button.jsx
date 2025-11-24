import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-lg transition-all duration-300 group'

  const variants = {
    primary: 'text-primary-500 hover:text-white border border-primary-500 bg-transparent',
    secondary: 'text-wine-500 hover:text-white border border-wine-500 bg-transparent',
    outline: 'text-primary-500 hover:text-white border-2 border-primary-500 bg-transparent',
    ghost: 'text-dark-700 dark:text-dark-300 hover:text-white bg-transparent',
    major: 'text-white bg-primary-500 hover:bg-primary-600 border border-primary-500',
    
    // new reverse-fill variants
    'primaryreverse': 'text-white bg-primary-500 border border-primary-500 hover:text-primary-500 hover:bg-transparent',
    'secondaryreverse': 'text-white bg-wine-500 border border-wine-500 hover:text-wine-500 hover:bg-transparent'
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
      case 'primaryreverse': return 'bg-primary-500'
      case 'secondaryreverse': return 'bg-wine-500'
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
      `}
      {...props}
    >
      {/* Text */}
      <span className="relative z-20">
        {children}
      </span>

      {/* Animated overlay */}
      <div 
        className={`
          absolute inset-0 
          ${getHoverBackgroundColor()} 
          transform origin-bottom
          ${variant.includes('reverse') 
            ? 'scale-y-100 group-hover:scale-y-0'  // drain out
            : 'scale-y-0 group-hover:scale-y-100'} // fill up
          transition-transform duration-300 ease-in-out
          z-10
        `} 
      />
    </button>
  )
}

export default Button
