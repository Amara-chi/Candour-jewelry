import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/SEOHead'
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, createUser, updateUser, deleteUser } from '../../features/user/userSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

      <SEOHead title="Manage Users - Admin" description="View, create, edit, and manage user accounts and permissions." />
const Users = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector((state) => state.user || state.users || { items: [] });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(createUser(formData));
    if (result.type === 'users/createUser/fulfilled') {
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUser({
      id: editingUser._id,
      userData: formData
    }));
    if (result.type === 'users/updateUser/fulfilled') {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId));
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't prefill password
      role: user.role
    });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 w-full min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-elegant">User Management</h1>
          <p className="text-gray-500 dark:text-dark-400 text-sm mt-1 sm:hidden">
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-dark-400 text-sm hidden sm:block">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </span>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex justify-center"
            size="sm"
          >
            <span className="sm:hidden">+ Add User</span>
            <span className="hidden sm:inline">+ New User</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 dark:bg-wine-500 border border-red-300 dark:border-wine-600 text-red-800 dark:text-white p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600 dark:text-white text-lg">Loading users...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-500 dark:text-dark-400 mb-6">Get started by creating your first user</p>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            Create First User
          </Button>
        </div>
      )}

      {/* Users Grid - Mobile: single column, Tablet: 2 columns, Desktop: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {users.map((user) => (
          <Card key={user._id} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600 transition-colors duration-200 shadow-sm dark:shadow-none">
            <div className="p-4 sm:p-6">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={user.name}>
                    {user.name}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 text-sm truncate" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  user.role === 'admin' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-300'
                }`}>
                  {user.role}
                </span>
              </div>
              
              {/* User Details */}
              <div className="text-sm text-gray-500 dark:text-dark-400 mb-4 space-y-1">
                <div className="flex justify-between">
                  <span>Joined:</span>
                  <span className="text-gray-700 dark:text-dark-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`${user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-wine-400'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditModal(user)}
                  className="flex-1 justify-center text-xs sm:text-sm"
                >
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex-1 justify-center text-xs sm:text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal - Mobile Responsive */}
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-dark-700 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                  setFormData({ name: '', email: '', password: '', role: 'user' });
                }}
                className="text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter full name"
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter email address"
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 justify-center order-2 sm:order-1"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                    setFormData({ name: '', email: '', password: '', role: 'user' });
                  }}
                  className="flex-1 justify-center order-1 sm:order-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;