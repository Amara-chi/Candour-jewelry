import React from 'react'
import Button from '../../components/Button' 
import { useModal } from '../../components/Modal' 

const ProductCard = ({ product, isAdmin = false }) => {
  const { openModal } = useModal()

  const handleViewDetails = () => {
    openModal('product-details', { 
      product, 
      isAdmin 
    })
  }

  const handleCardClick = (e) => {
    // Only trigger if the click wasn't on the button
    if (!e.target.closest('button')) {
      handleViewDetails()
    }
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-dark-100 dark:border-dark-700">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-dark-600 cursor-pointer" onClick={handleCardClick}>
        <div className="w-full h-64 bg-gradient-to-br from-primary-200 to-wine-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <span className="text-4xl">💎</span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            New
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
          Elegant Gold Necklace
        </h3>
        <p className="text-dark-600 dark:text-dark-300 text-sm mb-4 line-clamp-2">
          Beautiful handcrafted jewelry with premium materials
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-500 dark:text-primary-400">
            ₦199.99
          </span>
          <button className='text-wine-700 border p-2 rounded-lg border-wine-700 hover:text-white hover:bg-wine-700'>View Details</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard