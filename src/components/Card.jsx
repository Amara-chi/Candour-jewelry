import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}) => {
  return (
    <div className={`
      bg-white dark:bg-dark-800 
      rounded-xl shadow-lg 
      border border-dark-100 dark:border-dark-700
      ${padding}
      ${hover ? 'hover:shadow-xl transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card