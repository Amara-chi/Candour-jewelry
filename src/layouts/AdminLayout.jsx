import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import Spinner from "../components/Spinner";

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size={52} />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex transition-all duration-500 ease-in-out">
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isOpen ? "ml-64" : "ml-[97px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
