import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/SEOHead';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { SimpleModal } from '../../components/Modal';
import { categoryAPI } from '../../features/categories/CategoryAPI';
import Spinner from '../../components/Spinner';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    featured: false,
    status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories({ limit: 100, status: 'all' });
      setCategories(response || []);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category._id);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        featured: category.featured || false,
        status: category.status || 'active'
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        featured: false,
        status: 'active'
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editingId) {
        await categoryAPI.updateCategory(editingId, formData);
        setSuccess('Category updated successfully');
      } else {
        await categoryAPI.createCategory(formData);
        setSuccess('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryAPI.deleteCategory(id);
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Manage Categories - Admin"
        description="Manage product categories"
      />

      <div className="w-full px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white">
            Manage Categories
          </h1>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
          >
            Add Category
          </Button>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <Spinner className="py-12" size={52} />
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden">
            {filteredCategories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-dark-600 dark:text-dark-300">No categories found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Featured</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="border-t border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <td className="px-6 py-4 text-sm font-medium text-dark-900 dark:text-white">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300">
                        {category.description || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {category.featured ? (
                          <span className="text-wine-600">★</span>
                        ) : (
                          <span className="text-gray-400">☆</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SimpleModal onClose={handleCloseModal}>
          <h2 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white mb-6">
            {editingId ? 'Edit Category' : 'Add Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Category Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Rings, Necklaces"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief category description"
                rows="3"
                className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-dark-300"
                id="featured"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-dark-700 dark:text-dark-300">
                Mark as featured
              </label>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                {editingId ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </SimpleModal>
      )}
    </>
  );
};

export default ManageCategories;
