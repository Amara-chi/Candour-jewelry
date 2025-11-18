// components/ProductCard.jsx
import React from 'react';
import { useModal } from '../../../components/Modal';
import Button from '../../../components/Button';

const ProductCard = ({ 
  product, 
  isSelected, 
  onSelect,
  showCheckbox = true 
}) => {
  const { openModal } = useModal();

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="group relative bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-300">
      {/* Checkbox */}
      {showCheckbox && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(product._id, e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-700"
          />
        </div>
      )}

      {/* Admin Actions */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={() => openModal('product-form', { product, mode: 'edit' })}
          className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-colors"
          title="Edit Product"
        >
          ✏️
        </button>
        <button
          onClick={() => openModal('confirm-delete', { 
            type: 'product',
            id: product._id,
            name: product.name 
          })}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          title="Delete Product"
        >
          🗑️
        </button>
      </div>

      {/* Product content remains the same but with dark mode classes */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          ${product.price}
        </p>
        {/* Add more product details with proper dark mode classes */}
      </div>
    </div>
  );
};

export default ProductCard;