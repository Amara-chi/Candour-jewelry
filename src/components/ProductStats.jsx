// components/ProductStats.jsx
import React, { useMemo } from 'react';
import Card from '../../components/Card';

const ProductStats = ({ products }) => {
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const draft = products.filter(p => p.status === 'draft').length;
    const outOfStock = products.filter(p => p.trackQuantity && p.quantity === 0).length;
    const featured = products.filter(p => p.featured).length;

    return { total, active, draft, outOfStock, featured };
  }, [products]);

  const statCards = [
    { label: 'Total', value: stats.total, color: 'border-primary-500' },
    { label: 'Active', value: stats.active, color: 'border-green-500' },
    { label: 'Draft', value: stats.draft, color: 'border-yellow-500' },
    { label: 'Out of Stock', value: stats.outOfStock, color: 'border-red-500' },
    { label: 'Featured', value: stats.featured, color: 'border-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className={`text-center p-4 bg-dark-800 border-l-4 ${stat.color}`}>
          <div className="text-2xl font-bold text-dark-600 dark:text-white">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};

export default ProductStats;