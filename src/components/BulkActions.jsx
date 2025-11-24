// components/BulkActions.jsx
import React from 'react';
import Card from './Card';
import Button from './Button';

const BulkActions = ({
  selectedProducts,
  bulkAction,
  onBulkActionChange,
  onApplyBulkAction,
  onClearSelection
}) => {
  if (selectedProducts.length === 0) return null;

  return (
    <Card className="mb-6 p-4 bg-primary-900 border border-primary-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-dark-700 dark:text-white">
          <strong>{selectedProducts.length}</strong> product(s) selected
        </div>
        <div className="flex gap-3">
          <select
            value={bulkAction}
            onChange={(e) => onBulkActionChange(e.target.value)}
            className="px-3 py-2 dark:bg-dark-700 border border-dark-600 rounded text-dark-700 dark:text-white text-sm"
          >
            <option value="">Bulk Actions</option>
            <option value="activate">Activate</option>
            <option value="draft">Move to Draft</option>
            <option value="archive">Archive</option>
            <option value="delete">Delete</option>
            <option value="feature">Feature</option>
            <option value="unfeature">Unfeature</option>
          </select>
          <Button
            variant="primary"
            onClick={onApplyBulkAction}
            disabled={!bulkAction}
            size="sm"
          >
            Apply
          </Button>
          <Button
            variant="outline"
            onClick={onClearSelection}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BulkActions;