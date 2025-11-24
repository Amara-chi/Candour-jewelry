import { Link } from '@tanstack/react-router'
import { useTheme } from '../hooks/useTheme'
import Button from './Button'
import { useState, useEffect } from 'react'
import logo from '../assets/cj_logo_circle.png'
import { useAuth } from '../hooks/useAuth'
import { useModal } from '../components/Modal'
import { useCart } from '../hooks/useCart'

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { openModal } = useModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { cart, getCart } = useCart()

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCart().catch(err => {
        // Silently handle error - user might not have a cart yet
        console.log('Cart fetch skipped or failed:', err);
      });
    }
  }, [isAuthenticated, getCart]);


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

  const handleLogin = () => {
    openModal('login')
  }

  const handleRegister = () => {
    openModal('register')
  }

  const handleLogout = () => {
    logout()
  }

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-dark-900 shadow-lg border-b border-primary-200 dark:border-dark-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="ml-[-30px] flex items-center" onClick={closeMobileMenu}>
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
              className="text-dark-700 dark:text-dark-200 hover:text-wine-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-wine-500 dark:text-primary-400 font-semibold"
              }}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-dark-700 dark:text-dark-200 hover:text-wine-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-wine-500 dark:text-primary-400 font-semibold"
              }}
            >
              Shop
            </Link>
            <Link 
              to="/cart" 
              className="relative text-dark-700 dark:text-dark-200 hover:text-wine-500 dark:hover:text-primary-400 transition-colors"
              activeProps={{
                className: "text-wine-500 dark:text-primary-400 font-semibold"
              }}
            >
              Cart
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-wine-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          
            {isAuthenticated && isAdmin && (
              <a href="/admin/dashboard" className="text-dark-700 dark:text-dark-300 hover:text-primary-500 transition-colors">
                Admin
              </a>
            )}
          </div>

          {/* Desktop Theme Toggle & Actions */}
            <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleRegister}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-dark-700 dark:text-dark-300">
                  Welcome, {user?.name}
                </span>
                {isAdmin && (
                  <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs">
                    Admin
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}

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
  className="relative p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
>
  {/* Cart icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 2.25h2.386a.75.75 0 0 1 .728.546l.797 2.907m0 0L7.5 14.25h9.75m-11.089-8.547h12.064a.75.75 0 0 1 .728.954l-1.5 5.25a.75.75 0 0 1-.728.546H7.5m0 0L6 6.75m1.5 7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
    />
  </svg>

  {/* Badge (dot with count) */}
  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-primary-500 text-white">
    0
  </span>
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
  className="relative p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
>
  {/* Cart icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 2.25h2.386a.75.75 0 0 1 .728.546l.797 2.907m0 0L7.5 14.25h9.75m-11.089-8.547h12.064a.75.75 0 0 1 .728.954l-1.5 5.25a.75.75 0 0 1-.728.546H7.5m0 0L6 6.75m1.5 7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
    />
  </svg>

  {/* Badge (dot with count) */}
  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-primary-500 text-white">
    0
  </span>
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
                  className: "text-wine-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                activeProps={{
                  className: "text-wine-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
              <Link 
                to="/cart" 
                className="block px-3 py-2 text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                activeProps={{
                  className: "text-wine-500 dark:text-primary-400 font-semibold"
                }}
                onClick={closeMobileMenu}
              >
                Cart
              </Link>

              {isAuthenticated && isAdmin && (
                <a href="/admin/dashboard" className="text-dark-700 dark:text-dark-300 hover:text-primary-500 transition-colors">
                  Admin
                </a>
              )}

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