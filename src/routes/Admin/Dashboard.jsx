import React from 'react'
import { useSelector } from 'react-redux'
import { getUsers } from '../../features/user/userSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'


const Dashboard = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user || state.users)
  const users = userState?.items || []
  const loading = userState?.loading || false
  const error = userState?.error || null
  const regularUsers = users.filter(user => user.role === 'user')
  const adminUsers = users.filter(user => user.role === 'admin')


  console.log('Redux State:', userState)
  console.log('Users:', users)
  console.log('Loading:', loading)
  console.log('Error:', error)

  useEffect(() => {
    // Fetch users when component mounts
    dispatch(getUsers())
  }, [dispatch])

  const stats = [
    { label: 'Total Products', value: '24', color: 'primary' },
    { label: 'Orders Today', value: '8', color: 'wine' },
    { label: 'Revenue', value: '$2,847', color: 'green' },
    { label: 'Customers', value: `${regularUsers.length}`, color: 'blue' },
    { label: 'Admins', value: `${adminUsers.length}`, color: 'blue' },
  ]

  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm shadow-primary-500 border-l-2 border-b-2 border-primary-500">
              <p className="text-dark-500 dark:text-dark-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-dark-900 dark:text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Add Product
            </button>
            <button className="bg-wine-500 hover:bg-wine-600 text-white py-3 rounded-lg font-semibold transition-colors">
              View Orders
            </button>
            <button className="bg-dark-500 hover:bg-dark-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Analytics
            </button>
          </div>
        </div>
      </div>
  )
}

export default Dashboard