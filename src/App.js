import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './component/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Service';
import About from './pages/About';
import Contact from './pages/Contact';
import BookNow from './pages/BookNow';
import CustomerAuth from './pages/CustomerAuth';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import Success from './pages/Success';

export default function App() {
  React.useEffect(() => {
    document.title = 'Deep Cleaning Kamalanagar Bengaluru | HYGIENIX';
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-secondary bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booknow" element={<BookNow />} />
              <Route path="/success" element={<Success />} />

              {/* Customer Auth (Login/Signup/Forgot Password) */}
              <Route path="/login" element={<CustomerAuth />} />

              {/* Admin Auth (Login Only) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Legacy routes for backward compatibility */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Customer Dashboard */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Legacy admin route redirect */}
              <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
