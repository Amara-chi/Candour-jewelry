import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const menuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/orders", label: "Orders" },
    { path: "/admin/categories", label: "Categories" },
    { path: "/admin/users", label: "Users" },
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-500 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
        bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700
        shadow-md flex flex-col`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-md transition-all"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Logo */}
      <div className="flex items-center p-5 border-b border-gray-200 dark:border-dark-700">
        <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          CJ
        </div>
        {isOpen && (
          <span className="text-lg font-semibold text-dark-800 dark:text-white whitespace-nowrap">
            Candour Admin
          </span>
        )}
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <p className="text-sm text-gray-500 dark:text-dark-300">Logged in as</p>
          <p className="font-medium text-dark-800 dark:text-white">{user?.name}</p>
          <p className="text-xs text-primary-600 dark:text-primary-400">{user?.email}</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 space-y-2 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors
              text-gray-600 dark:text-dark-200 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400`}
            activeProps={{
              className:
                "bg-primary-500 text-white dark:bg-primary-600 dark:text-white",
            }}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-dark-200 hover:bg-wine-100 dark:hover:bg-wine-500 hover:text-wine-700 dark:hover:text-white transition-colors"
        >
          <span className="mr-3">🚪</span>
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
