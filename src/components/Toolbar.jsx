// components/Toolbar.jsx
import React from 'react';
import { Grid2x2, List } from 'lucide-react';

const Toolbar = ({
  filteredCount,
  totalCount,
  viewMode,
  sortBy,
  selectedProducts,
  onViewModeChange,
  onSortChange,
  onSelectAll
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        {/* Select All */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectedProducts.length === filteredCount && filteredCount > 0}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-dark-700 dark:text-white">Select All</span>
        </label>
        
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {filteredCount} of {totalCount} products
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* View Mode Toggle */}
        <div className="flex border border-primary-500 dark:border-dark-600 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-primary-500 text-dark-700 dark:text-white'
                : 'text-dark-900 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-dark-700'
            }`}
          >
            <Grid2x2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-primary-500 text-dark-700 dark:text-white'
                : 'text-dark-900 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-dark-700'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 dark:bg-dark-700 border border-primary-500 dark:border-dark-600 rounded text-dark-700 dark:text-white text-sm"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name: A to Z</option>
          <option value="-name">Name: Z to A</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;
