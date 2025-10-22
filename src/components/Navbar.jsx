import { Link } from '@tanstack/react-router'
import { useTheme } from '../hooks/useTheme'

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <nav className="bg-white dark:bg-dark-900 shadow-lg border-b border-primary-200 dark:border-dark-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-elegant font-bold text-lg">CJ</span>
            </div>
            <span className="ml-3 text-xl font-elegant font-bold text-dark-900 dark:text-white">
              Candour Jewelry
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-primary-500 dark:text-primary-400 font-semibold"
              }}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-primary-500 dark:text-primary-400 font-semibold"
              }}
            >
              Shop
            </Link>
            <Link 
              to="/cart" 
              className="text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-primary-500 dark:text-primary-400 font-semibold"
              }}
            >
              Cart
            </Link>
            <Link 
              to="/admin" 
              className="text-dark-700 dark:text-dark-200 hover:text-wine-500 dark:hover:text-wine-400 transition-colors"
              activeProps={{
                className: "text-wine-500 dark:text-wine-400 font-semibold"
              }}
            >
              Admin
            </Link>
          </div>

          {/* Theme Toggle & Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              🛒 <span className="ml-1">0</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar