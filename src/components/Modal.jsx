import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import Input from './Input'
import { useAuth } from '../hooks/useAuth'

// Modal Context
const ModalContext = React.createContext()

// Modal Provider
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)

  const openModal = (type, data = {}) => {
    setModal({ type, data })
  }

  const closeModal = () => {
    setModal(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modal }}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  )
}

// Hook to use modal
export const useModal = () => {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

// Modal Container (Portal)
const ModalContainer = () => {
  const { modal, closeModal } = useModal()

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [modal])

  if (!modal) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={closeModal}
      />
      
      <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <ModalContent type={modal.type} data={modal.data} />
      </div>
    </div>,
    document.body
  )
}

// Modal Content based on type
const ModalContent = ({ type, data }) => {
  const { closeModal } = useModal()

  const renderContent = () => {
    switch (type) {
      case 'product-details':
        return <ProductDetailsModal data={data} />
      case 'login':
        return <LoginModal data={data} />
      case 'register':
        return <RegisterModal data={data} />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 text-2xl"
      >
        ×
      </button>
      {renderContent()}
    </div>
  )
}

// Product Details Modal (used by both user and admin)
const ProductDetailsModal = ({ data }) => {
  const { product, isAdmin = false } = data
  const { closeModal } = useModal()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
        Product Details
      </h2>
      
      <div className="space-y-4">
        <div className="w-full h-48 bg-gradient-to-br from-primary-200 to-wine-200 rounded-lg flex items-center justify-center">
          <span className="text-6xl">💎</span>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-dark-900 dark:text-white">Elegant Gold Necklace</h3>
          <p className="text-2xl font-bold text-primary-500 mt-2">$199.99</p>
          <p className="text-dark-600 dark:text-dark-300 mt-2">
            Beautiful handcrafted jewelry with premium materials and exquisite design.
          </p>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex space-x-3 pt-4 border-t border-dark-200 dark:border-dark-700">
            <Button variant="primary" className="flex-1">
              Edit Product
            </Button>
            <Button variant="secondary" className="flex-1">
              Delete Product
            </Button>
          </div>
        )}

        {/* User Actions */}
        {!isAdmin && (
          <div className="flex space-x-3 pt-4 border-t border-dark-200 dark:border-dark-700">
            <Button variant="primary" className="flex-1">
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              Add to Wishlist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Login Modal
const LoginModal = ({ data }) => {
  const { closeModal, openModal } = useModal()
  const { login, loading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    return () => clearError()
  }, [clearError])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const result = await login(formData)
    if (result.type === 'auth/login/fulfilled') {
      closeModal()
      // You can add a success toast here if needed
    }
  }

  const switchToRegister = () => {
    closeModal()
    openModal('register')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white text-center">
        Welcome Back
      </h2>
      
      {/* Show backend error */}
      {error && (
        <div className="bg-wine-100 border border-wine-400 text-wine-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-dark-200 dark:border-dark-700">
        <p className="text-dark-600 dark:text-dark-300">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}


// Register Modal
const RegisterModal = ({ data }) => {
  const { closeModal, openModal } = useModal()
  const { register, loading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    return () => clearError()
  }, [clearError])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    if (result.type === 'auth/register/fulfilled') {
      closeModal()
      // You can add a success toast here if needed
    }
  }

  const switchToLogin = () => {
    closeModal()
    openModal('login')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white text-center">
        Create Account
      </h2>
      
      {/* Show backend error */}
      {error && (
        <div className="bg-wine-100 border border-wine-400 text-wine-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-dark-200 dark:border-dark-700">
        <p className="text-dark-600 dark:text-dark-300">
          Already have an account?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default ModalContainer