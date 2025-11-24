import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import Input from './Input'
import { useAuth } from '../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { createProduct, updateProduct, deleteProduct } from '../features/product/productSlice'

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
      
      <div className={`relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        // Adjust width based on modal type
        modal.type === 'product-form' ? 'max-w-4xl w-full' : 'max-w-md w-full'
      }`}>
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
      case 'product-form':
        return <ProductFormModal data={data} />
      case 'confirm-delete':
        return <ConfirmDeleteModal data={data} />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 text-2xl z-10"
      >
        ×
      </button>
      {renderContent()}
    </div>
  )
}

// Product Form Modal
const ProductFormModal = ({ data }) => {
  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const { product, mode = 'create' } = data || {}
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    sku: '',
    quantity: '0',
    trackQuantity: true,
    categories: [],
    tags: '',
    status: 'draft',
    featured: false,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [images, setImages] = useState(product?.images || [])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        sku: product.sku || '',
        quantity: product.quantity?.toString() || '0',
        trackQuantity: product.trackQuantity ?? true,
        categories: product.categories?.map(cat => cat._id) || [],
        tags: product.tags?.join(', ') || '',
        status: product.status || 'draft',
        featured: product.featured || false,
      })
    }
  }, [product, mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        quantity: formData.trackQuantity ? Number(formData.quantity) : 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categories: formData.categories,
        images: images
      }

      if (mode === 'create') {
        await dispatch(createProduct(submitData)).unwrap()
      } else {
        await dispatch(updateProduct({ 
          id: product._id, 
          productData: submitData 
        })).unwrap()
      }

      closeModal()
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save product' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)

    try {
      for (const file of files) {
        const formDataForUpload = new FormData()
        formDataForUpload.append('file', file)
        formDataForUpload.append('upload_preset', 'candour_jewelry')

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'ditaw9w5x'}/image/upload`,
          {
            method: 'POST',
            body: formDataForUpload
          }
        )

        const data = await response.json()
        if (data.secure_url) {
          setImages(prev => [...prev, {
            url: data.secure_url,
            isPrimary: images.length === 0
          }])
        }
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      setErrors(prev => ({ ...prev, images: 'Failed to upload images' }))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
        {mode === 'create' ? 'Add New Product' : 'Edit Product'}
      </h2>

      {errors.submit && (
        <div className="bg-wine-100 border border-wine-400 text-wine-700 px-4 py-3 rounded text-sm">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </div>

        <Input
          label="Short Description"
          value={formData.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          as="textarea"
          rows={2}
          placeholder="Brief description for product cards..."
        />

        <Input
          label="Full Description *"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          as="textarea"
          rows={4}
          error={errors.description}
          required
          placeholder="Detailed product description..."
        />

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Price ($) *"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            error={errors.price}
            required
          />
          <Input
            label="Compare Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.comparePrice}
            onChange={(e) => handleChange('comparePrice', e.target.value)}
            placeholder="Original price for sales"
          />
          <Input
            label="Quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            disabled={!formData.trackQuantity}
          />
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="Separate tags with commas (e.g., gold, necklace, luxury)"
        />

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">Featured Product</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.trackQuantity}
                onChange={(e) => handleChange('trackQuantity', e.target.checked)}
                className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">Track Quantity</span>
            </label>
          </div>
        </div>

        {/* Image Upload Section (Placeholder for now) */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-dark-200 dark:border-dark-600 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-dark-600 dark:text-dark-300 mb-2">
              Drag & drop images or click to upload
            </p>
            <p className="text-sm text-dark-500 dark:text-dark-400">
              Supports JPG, PNG, WEBP • Max 5MB per image
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => {/* Implement file upload */}}
            >
              Select Images
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-dark-200 dark:border-dark-700">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : (mode === 'create' ? 'Create Product' : 'Update Product')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

// Confirm Delete Modal
const ConfirmDeleteModal = ({ data }) => {
  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const { type, id, name } = data || {}
  
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      if (type === 'product') {
        await dispatch(deleteProduct(id)).unwrap()
      }
      // Add other delete types as needed
      closeModal()
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModalText = () => {
    switch (type) {
      case 'product':
        return {
          title: 'Delete Product',
          message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
          confirmText: 'Delete Product'
        }
      default:
        return {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this item?',
          confirmText: 'Delete'
        }
    }
  }

  const { title, message, confirmText } = getModalText()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
        {title}
      </h2>
      
      <p className="text-dark-600 dark:text-dark-300">
        {message}
      </p>

      <div className="flex gap-3 pt-4">
        <Button
          variant="secondary"
          onClick={handleDelete}
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Deleting...' : confirmText}
        </Button>
        <Button
          variant="outline"
          onClick={closeModal}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Enhanced Product Details Modal
const ProductDetailsModal = ({ data }) => {
  const { product, isAdmin = false } = data
  const { closeModal, openModal } = useModal()
  const { addToCart } = useCart() // You'll need to create this hook
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openModal('login')
      return
    }

    try {
      await addToCart(product._id, 1)
      // Show success message (you can add toast notification)
      closeModal()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleEdit = () => {
    openModal('product-form', { product, mode: 'edit' })
  }

  const handleDelete = () => {
    openModal('confirm-delete', { 
      type: 'product',
      id: product._id,
      name: product.name 
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
        Product Details
      </h2>
      
      <div className="space-y-4">
        {/* Product Image */}
        <div className="w-full h-48 bg-gradient-to-br from-primary-200 to-wine-200 rounded-lg flex items-center justify-center">
          {product.images?.[0] ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-6xl">💎</span>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h3 className="text-xl font-semibold text-dark-900 dark:text-white">{product.name}</h3>
          <p className="text-2xl font-bold text-primary-500 mt-2">${product.price}</p>
          {product.comparePrice && (
            <p className="text-lg text-dark-500 dark:text-dark-400 line-through">
              ${product.comparePrice}
            </p>
          )}
          <p className="text-dark-600 dark:text-dark-300 mt-2">
            {product.shortDescription || product.description}
          </p>
          
          {/* Stock Status */}
          <div className="mt-3">
            {product.inStock ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wine-100 text-wine-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex space-x-3 pt-4 border-t border-dark-200 dark:border-dark-700">
            <Button variant="primary" className="flex-1" onClick={handleEdit}>
              Edit Product
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleDelete}>
              Delete Product
            </Button>
          </div>
        )}

        {/* User Actions */}
        {!isAdmin && (
          <div className="flex space-x-3 pt-4 border-t border-dark-200 dark:border-dark-700">
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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