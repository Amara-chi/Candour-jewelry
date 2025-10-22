import MainLayout from '../../layouts/MainLayout'

const Dashboard = () => {
  const stats = [
    { label: 'Total Products', value: '24', color: 'primary' },
    { label: 'Orders Today', value: '8', color: 'wine' },
    { label: 'Revenue', value: '$2,847', color: 'green' },
    { label: 'Customers', value: '156', color: 'blue' },
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border-l-4 border-primary-500">
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
    </MainLayout>
  )
}

export default Dashboard