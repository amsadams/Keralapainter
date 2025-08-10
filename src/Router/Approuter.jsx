import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Contact from "../Pages/Contact";

import Registration from "../Pages/Registration";
import Header from "../Components/shared/Header";
import Footer from "../Components/shared/Footer";
import AdminDashboard from "../Components/admin/AdminDashboard";
import { AuthProvider } from '../Components/admin/AuthContext';
import ProtectedRoute from '../Components/admin/ProtectedRoute';

const AppRouter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registration" element={<Registration />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </AuthProvider>
  );
};

export default AppRouter;