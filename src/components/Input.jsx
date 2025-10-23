import React from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-dark-700  dark:text-dark-300">
          {label}
        </label>
      )}
      
      <input
        type={type}
        className={`
          w-full px-4 py-3 border border-dark-300 dark:border-dark-600 
          rounded-lg bg-white dark:bg-dark-800 
          text-dark-900 dark:text-white
          placeholder-dark-500 dark:placeholder-dark-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-wine-500 focus:ring-wine-500' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-wine-500 text-sm">{error}</p>
      )}
    </div>
  )
}

export default Input