import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, ShoppingBag } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const userToken = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!userToken);
      setUsername(storedUsername || 'User');
    };

    checkLoginStatus(); // Initial check

    // Update on login/logout in other tabs or app parts
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close dropdown if open
    if (dropdownOpen) setDropdownOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setDropdownOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-red-500 font-bold text-2xl md:text-3xl font-serif">MYRA</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-gray-700 hover:text-red-500 font-medium ${location.pathname === '/' ? 'text-red-500' : ''}`}>Home</Link>
            <Link to="/shop" className={`text-gray-700 hover:text-red-500 font-medium ${location.pathname === '/shop' ? 'text-red-500' : ''}`}>Shop</Link>
            <Link to="/collections" className={`text-gray-700 hover:text-red-500 font-medium ${location.pathname === '/collections' ? 'text-red-500' : ''}`}>Collections</Link>
            <Link to="/sale" className={`text-gray-700 hover:text-red-500 font-medium ${location.pathname === '/sale' ? 'text-red-500' : ''}`}>Sale</Link>
          </nav>

          {/* Desktop Icons & User Area */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="p-2 text-gray-700 hover:text-red-500 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {isLoggedIn ? (
              <div className="relative user-dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700 font-medium hidden lg:inline-block">{username}</span>
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    <User size={16} />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-800 truncate">{username}</p>
                    </div>
                    
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} className="mr-2 text-gray-500" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <ShoppingBag size={16} className="mr-2 text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50 border-t border-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${location.pathname === '/login' ? 'bg-red-500 text-white' : 'text-gray-700 hover:text-red-500'}`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${location.pathname === '/signup' ? 'bg-red-500 text-white' : 'text-gray-700 border border-red-500 hover:bg-red-500 hover:text-white'}`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <Link to="/cart" className="p-1 text-gray-700 hover:text-red-500 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isLoggedIn && (
              <button className="p-1">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <User size={16} />
                </div>
              </button>
            )}
            
            <button 
              onClick={toggleMenu} 
              className="p-1 text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-red-500 font-medium py-3 ${location.pathname === '/' ? 'text-red-500' : ''}`} 
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className={`text-gray-700 hover:text-red-500 font-medium py-3 border-t border-gray-100 ${location.pathname === '/shop' ? 'text-red-500' : ''}`} 
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link 
                to="/collections" 
                className={`text-gray-700 hover:text-red-500 font-medium py-3 border-t border-gray-100 ${location.pathname === '/collections' ? 'text-red-500' : ''}`} 
                onClick={toggleMenu}
              >
                Collections
              </Link>
              <Link 
                to="/sale" 
                className={`text-gray-700 hover:text-red-500 font-medium py-3 border-t border-gray-100 ${location.pathname === '/sale' ? 'text-red-500' : ''}`} 
                onClick={toggleMenu}
              >
                Sale
              </Link>

              {isLoggedIn ? (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center py-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 mr-2">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-800">{username}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center text-gray-700 hover:text-red-500 font-medium py-3 border-t border-gray-100" 
                    onClick={toggleMenu}
                  >
                    <User size={16} className="mr-2" />
                    <span>My Profile</span>
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="flex items-center text-gray-700 hover:text-red-500 font-medium py-3 border-t border-gray-100" 
                    onClick={toggleMenu}
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    <span>My Orders</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }} 
                    className="flex items-center w-full text-red-500 font-medium py-3 border-t border-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 py-3 border-t border-gray-100">
                  <Link 
                    to="/login" 
                    className={`px-4 py-2 text-center font-medium rounded transition-colors ${location.pathname === '/login' ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`px-4 py-2 text-center font-medium rounded transition-colors ${location.pathname === '/signup' ? 'bg-red-500 text-white' : 'border border-red-500 text-gray-700 hover:bg-red-500 hover:text-white'}`}
                    onClick={toggleMenu}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;