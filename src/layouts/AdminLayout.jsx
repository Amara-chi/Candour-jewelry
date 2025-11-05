import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import AdminSidebar from '../components/AdminSidebar'

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if not admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isAdmin, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Access Denied</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64"> 
        <div className="">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout