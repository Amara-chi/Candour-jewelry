import { useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import Navbar from '../components/Navbar'
import CustomCursor from '../components/CustomCursor'

const MainLayout = ({ children }) => {
  const { theme } = useTheme()

  // Apply dark mode class to HTML element
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
      < CustomCursor />
      <Navbar />
      <main className="transition-colors duration-300">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-dark-800 dark:bg-dark-950 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="text-xl font-elegant font-bold">Candour Jewelry</span>
          </div>
          <p className="text-dark-200 mb-2">Crafted with elegance and precision</p>
          <p className="text-dark-300 text-sm">
            &copy; 2024 Candour Jewelry. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout