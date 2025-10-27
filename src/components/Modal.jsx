import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import Input from './Input'

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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    
    // Validation
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    try {
      // TODO: Replace with actual API call
      console.log('Login data:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      closeModal()
      // Show success message or redirect
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
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

        {errors.submit && (
          <p className="text-wine-500 text-sm text-center">{errors.submit}</p>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    
    // Validation
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    try {
      // TODO: Replace with actual API call
      console.log('Registration data:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      closeModal()
      // Show success message or redirect to login
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          
          <Input
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
        
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

        {errors.submit && (
          <p className="text-wine-500 text-sm text-center">{errors.submit}</p>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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