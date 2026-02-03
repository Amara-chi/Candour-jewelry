import { useAuth } from "../hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Gem,
  LayoutDashboard,
  LogOut,
  Package,
  Users
} from "lucide-react";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Gem },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: FileText },
    { path: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div
      className={`fixed pt-16 top-0 left-0 h-full z-40 transition-all duration-500 ease-in-out
        ${isOpen ? "w-64" : "md:w-[97px]"}
        bg-white dark:bg-dark-900 border-r border-primary-200  dark:border-dark-700
        shadow-md flex flex-col`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`absolute bg-primary-600  mt-[8px] hover:bg-primary-700 text-white p-2 rounded-r-full shadow-md transition-all duration-500 ease-in-out ${
          isOpen ? `left-64` : `left-24`
        }`}
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
           Admin's Section
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

      {/* Navigation */}
      <nav className={`flex-1 mt-4 space-y-2 px-2 ${isOpen ? ' ' : 'flex items-center flex-col'}`}>
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
            {(() => {
              const Icon = item.icon;
              return isOpen ? (
                <div className="whitespace-nowrap flex gap-4 items-center">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              ) : (
                <div className="whitespace-nowrap flex gap-4 items-center">
                  <Icon className="h-4 w-4" />
                </div>
              );
            })()}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-dark-200 hover:bg-wine-100 dark:hover:bg-wine-500 hover:text-wine-700 dark:hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
