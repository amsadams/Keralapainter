import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items with routes
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/' },
    { name: 'Policy Details', path: '/' },
    { name: 'Contact', path: '/' }
  ];

  // Check if current path matches the nav item
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-2xl' 
        : 'bg-black/10 backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:bg-white/15">
                <Shield className="w-6 h-6 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">Kerala Painters</h1>
              <p className="text-xs text-blue-200 group-hover:text-blue-100 transition-colors duration-300 font-medium">Protection Policy</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 group rounded-xl ${
                  isActive(item.path)
                    ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-300 rounded-full"></div>
                )}
                {/* Glassmorphism background on hover (only for non-active items) */}
                {!isActive(item.path) && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg"></div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button for Desktop */}
          <div className="hidden md:flex">
            <Link 
              to="/registration"
              className="group relative overflow-hidden px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-105 inline-block"
            >
              <span className="relative z-10">Apply For Insurance</span>
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="w-6 h-6 transform rotate-0 transition-transform duration-300" />
              ) : (
                <Menu className="w-6 h-6 transform rotate-0 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 space-y-2 border-t border-white/10">
            {/* Mobile Navigation Links */}
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-4 py-4 text-sm font-semibold transition-all duration-300 rounded-xl border backdrop-blur-sm group ${
                  isActive(item.path)
                    ? 'text-white bg-white/10 border-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: isMenuOpen ? 'slideInRight 0.4s ease-out forwards' : ''
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                    isActive(item.path) 
                      ? 'bg-blue-300 opacity-100' 
                      : 'bg-blue-300 opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            <div className="pt-4">
              <Link 
                to="/registration"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full group relative overflow-hidden px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-105 text-center"
                style={{ 
                  animationDelay: '0.4s',
                  animation: isMenuOpen ? 'slideInRight 0.4s ease-out forwards' : ''
                }}
              >
                <span className="relative z-10">Apply For Insurance Now</span>
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;