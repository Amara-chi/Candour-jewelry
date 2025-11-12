import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { categories } = useCategories();
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 1000]);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-dark-100 dark:border-dark-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search products..."
          className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            className="w-20 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
            placeholder="Min"
          />
          <span className="self-center text-dark-500">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="w-20 px-2 py-1 border border-dark-200 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          Categories
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 border border-dark-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">In Stock Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => onFilterChange({ featured: e.target.checked })}
            className="rounded border-dark-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-dark-700 dark:text-dark-300">Featured Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;