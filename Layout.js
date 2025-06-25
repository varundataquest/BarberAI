import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActivePage = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          :root {
            --primary-blue: #1e3a8a;
            --secondary-gold: #d4af37;
            --accent-gray: #f8f9fa;
            --success-green: #22c55e;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .barber-gradient {
            background: linear-gradient(135deg, var(--primary-blue) 0%, #3b82f6 100%);
          }
          
          .luxury-shadow {
            box-shadow: 0 20px 40px rgba(30, 58, 138, 0.1);
          }
          
          .premium-glow {
            box-shadow: 0 0 30px rgba(30, 58, 138, 0.3);
          }
        `}
      </style>

      {/* Navigation Header */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 barber-gradient rounded-xl flex items-center justify-center group-hover:premium-glow transition-all duration-300 overflow-hidden">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                  alt="BarberAI Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">BarberAI</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link
                to={createPageUrl('Home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                  isActivePage('Home')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to={createPageUrl('Recommend')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                  isActivePage('Recommend')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                  alt="BarberAI"
                  className="w-4 h-4 object-contain"
                />
                <span>Get Recommendations</span>
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link to={createPageUrl('Recommend')}>
                <Button
                  size="sm"
                  className="barber-gradient text-white hover:opacity-90 transition-opacity"
                >
                  Try Now - Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
              <Link
                to={createPageUrl('Home')}
                onClick={closeMenu}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePage('Home')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to={createPageUrl('Recommend')}
                onClick={closeMenu}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActivePage('Recommend')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                  alt="BarberAI"
                  className="w-4 h-4 object-contain"
                />
                <span>Get Recommendations</span>
              </Link>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link to={createPageUrl('Recommend')}>
                  <Button
                    className="w-full barber-gradient text-white"
                    onClick={closeMenu}
                  >
                    Try Now - Free
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 barber-gradient rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/52e9d0af4_Screenshot2025-06-20at113022AM.png"
                  alt="BarberAI Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">BarberAI</span>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 text-center">
              © 2024 BarberAI. Powered by advanced AI technology.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
