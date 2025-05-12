import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, Package, PlusCircle, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const navigation = userRole === 'seller' ? [
    { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
    { name: 'Products', href: '/seller/products', icon: Package },
    { name: 'Add Product', href: '/seller/products/add', icon: PlusCircle },
  ] : [
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Categories', href: '/categories', icon: Package },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-transparent bg-clip-text">
                ShopEase
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                      ${location.pathname === item.href
                        ? 'text-rose-600 bg-rose-50'
                        : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'}`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-rose-500 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-rose-500 text-white hover:bg-rose-600 px-4 py-2 rounded-md font-medium transition-colors duration-150"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{username}</span>
                    <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-rose-500 font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            {isLoggedIn && (
              <div className="space-y-2 pb-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                        ${location.pathname === item.href
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-gray-600 hover:text-rose-500 hover:bg-rose-50'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
            {!isLoggedIn ? (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-rose-500 hover:bg-rose-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-rose-500 hover:bg-rose-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-rose-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{username}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{userRole}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-rose-500 hover:bg-rose-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;