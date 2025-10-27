import { Link } from '@tanstack/react-router'
import { useTheme } from '../hooks/useTheme'
import { useModal } from './Modal'
import Button from './Button'
import { useState } from 'react'
import logo from '../assets/cj_logo_circle.png'

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { openModal } = useModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleAuthClick = (modalType) => {
    openModal(modalType)
    closeMobileMenu()
  }

  return (
    <nav className="bg-white dark:bg-dark-900 shadow-lg border-b border-primary-200 dark:border-dark-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between sm:mr-[-30px] items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <div className='w-28 '>
              <img src={logo} alt="" />
            </div>
            <span className=" md:text-3xl sm:text-sm sm:text-nowrap ml-[-20px] font-parisienne font-bold text-wine-400 dark:text-primary-400 ">
              Candour's Jewelry
            </span>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Desktop Theme Toggle & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Auth Buttons */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleAuthClick('login')}
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAuthClick('register')}
            >
              Register
            </Button>

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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Cart Icon - Mobile */}
            <Link 
              to="/cart"
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              🛒 <span className="ml-1">0</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-dark-800 border-t border-dark-200 dark:border-dark-700 transition-colors duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <Link 
                to="/" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                activeProps={{
                  className: "text-primary-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                activeProps={{
                  className: "text-primary-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link 
                to="/cart" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                activeProps={{
                  className: "text-primary-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Cart
              </Link>
              <Link 
                to="/test-comp" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-wine-500 dark:hover:text-wine-400 transition-colors"
                activeProps={{
                  className: "text-wine-500 dark:text-wine-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Admin
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 space-y-2 border-t border-dark-200 dark:border-dark-700 pt-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleAuthClick('login')}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleAuthClick('register')}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar