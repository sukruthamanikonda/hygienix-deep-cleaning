import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, ChevronRight, Building2 } from 'lucide-react';
import logo from "../images/logoHygienix.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img width="40" height="40" src={logo} alt="HYGIENIX Logo" className="sm:w-12 sm:h-12" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-emerald-600">HYGIENIX</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${isActive(item.path)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
              >
                {item.label}
              </Link>
            ))}

            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                      ${isActive('/admin/dashboard')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    ${isActive('/my-orders')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600"
                >
                  Login
                </Link>
                <Link
                  to="/services"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-gray-100 transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(item.path)
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.label}
              <ChevronRight className={`w-4 h-4 ${isActive(item.path) ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Building2 className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-white bg-emerald-600 shadow-lg"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
