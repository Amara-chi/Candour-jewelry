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
      <CustomCursor />
      <Navbar />
      <main className="transition-colors duration-300 mt-16">
        {children}
      </main>
      {/* <Footer />    */}
    </div>
  )
}

export default MainLayout