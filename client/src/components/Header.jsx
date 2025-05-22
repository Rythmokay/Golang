import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import styles from './HeaderStyles';

const Header = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Fetch cart items when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
    
    // Add event listener for cart refresh
    const handleCartRefresh = () => {
      if (userId) {
        fetchCartItems();
      }
    };
    
    // Listen for both refreshCart and cart-updated events
    window.addEventListener('refreshCart', handleCartRefresh);
    window.addEventListener('cart-updated', handleCartRefresh);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('refreshCart', handleCartRefresh);
      window.removeEventListener('cart-updated', handleCartRefresh);
    };
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      if (!userId) {
        setCartItems([]);
        return;
      }
      const response = await fetch(`http://localhost:8081/api/cart?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      setCartItems(data || []);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setCartItems([]);
    }
  };
  
  const updateCartItem = async (itemId, newQuantity) => {
    try {
      // Ensure quantity is not negative
      if (newQuantity < 0) {
        newQuantity = 0;
      }
      
      const response = await fetch('http://localhost:8081/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: itemId,
          quantity: newQuantity
        })
      });

      if (!response.ok) throw new Error('Failed to update cart');
      
      // Refresh cart items
      fetchCartItems();
    } catch (err) {
      console.error('Error updating cart:', err);
      alert('Failed to update cart');
    }
  };
  
  const removeCartItem = async (itemId) => {
    try {
      console.log('Removing item from cart:', itemId);
      const response = await fetch('http://localhost:8081/api/cart/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: itemId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to remove item from cart');
      }
      
      // Refresh cart items
      fetchCartItems();
    } catch (err) {
      console.error('Error removing item from cart:', err);
      alert('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const navigation = userRole === 'seller' ? [
    { name: 'Dashboard', href: '/seller' },
    { name: 'Products', href: '/seller/products' },
    { name: 'Orders', href: '/seller/orders' },
    { name: 'Add Product', href: '/seller/products/add' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Orders', href: '/orders' },
  ];

  return (
    <header className={`${styles.header.base} ${isScrolled ? styles.header.scrolled : ''}`}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className={styles.logo}>
              <span style={{color: '#4f46e5'}}>Ecommerce</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className={styles.searchIcon} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className={styles.navLinks}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${styles.navLink.base} ${location.pathname === item.href ? styles.navLink.active : styles.navLink.inactive}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className={styles.userMenu}>
            {userRole !== 'seller' && isLoggedIn && (
              <div className="relative">
                <div 
                  onClick={() => setCartOpen(!cartOpen)}
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center rounded-full"
                >
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                {Array.isArray(cartItems) && cartItems.length > 0 && (
                  <div 
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full"
                    style={{ width: '18px', height: '18px' }}
                  >
                    {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
                  </div>
                )}
              </div>
            )}
            {!isLoggedIn ? (
              <div className={styles.authContainer}>
                <Link
                  to="/login"
                  className={styles.loginButton}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={styles.signupButton}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className={styles.userProfile.container}>
                <div 
                  className={styles.userProfile.avatarContainer}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className={styles.userProfile.avatar}>
                    <FiUser className={styles.userProfile.avatarIcon} />
                  </div>
                  <div className={styles.userProfile.userInfo}>
                    <span className={styles.userProfile.username}>{username}</span>
                    <span className={styles.userProfile.userRole}>{userRole}</span>
                  </div>
                </div>
                
                {/* User dropdown menu */}
                {profileDropdownOpen && (
                  <div className={styles.userProfile.dropdown}>
                    <div className={styles.userProfile.dropdownHeader}>
                      <div className="font-medium text-gray-800">{username}</div>
                      <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                    </div>
                  
                  <Link to="/profile" className={styles.userProfile.dropdownItem}>
                    <FiUser className={styles.userProfile.dropdownIcon} /> 
                    <span>Profile</span>
                  </Link>
                  
                  {userRole === 'seller' && (
                    <Link to="/seller" className={styles.userProfile.dropdownItem}>
                      <FiSettings className={styles.userProfile.dropdownIcon} /> 
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  <Link to="/orders" className={styles.userProfile.dropdownItem}>
                    <FiShoppingBag className={styles.userProfile.dropdownIcon} /> 
                    <span>Orders</span>
                  </Link>
                  
                  <Link to="/wishlist" className={styles.userProfile.dropdownItem}>
                    <FiHeart className={styles.userProfile.dropdownIcon} /> 
                    <span>Wishlist</span>
                  </Link>
                  
                  <div className={styles.userProfile.dropdownDivider}></div>
                  
                  <button
                    onClick={handleLogout}
                    className={styles.userProfile.logoutButton}
                  >
                    <FiLogOut className={styles.userProfile.logoutIcon} /> 
                    <span>Logout</span>
                  </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.mobileMenuButton}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? 
                <FiX className={styles.mobileMenuIcon} /> : 
                <FiMenu className={styles.mobileMenuIcon} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContainer}>
              {/* Mobile search */}
              <div className="px-4 pt-2 pb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className={styles.searchIcon} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={styles.searchInput}
                  />
                </div>
              </div>
              
              {isLoggedIn && (
                <div className="space-y-1 px-2 pb-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-4 py-2 text-sm font-medium transition-all duration-200 ${location.pathname === item.href ? styles.navLink.active : styles.navLink.inactive}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
              
              {userRole !== 'seller' && isLoggedIn && (
                <div className="px-2 flex items-center space-x-2">
                  <div className="relative">
                    <div 
                      onClick={() => {
                        setCartOpen(!cartOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center rounded-full"
                    >
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    {Array.isArray(cartItems) && cartItems.length > 0 && (
                      <div 
                        className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full"
                        style={{ width: '18px', height: '18px' }}
                      >
                        {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium">Cart</span>
                </div>
              )}
              
              {!isLoggedIn ? (
                <div className="space-y-2 pt-3 border-t border-gray-100 px-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="inline mr-2" /> Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-200 flex items-center justify-center mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200">
                  <div className="px-4 py-3 flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{username}</div>
                      <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                    </div>
                  </div>
                  <div className="space-y-1 px-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200">
                      <FiUser className="inline mr-2" /> Profile
                    </Link>
                    {userRole === 'seller' && (
                      <Link to="/seller" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200">
                        <FiSettings className="inline mr-2" /> Dashboard
                      </Link>
                    )}
                    <Link to="/orders" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200">
                      <FiShoppingBag className="inline mr-2" /> Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200">
                      <FiHeart className="inline mr-2" /> Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200 mt-2"
                    >
                      <FiLogOut className="inline mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Cart Sidebar */}
      {cartOpen && (
        <div className={styles.cartSidebar}>
          <div className="h-full flex flex-col">
            <div className={styles.cartHeader}>
              <div className="flex items-center justify-between">
                <h2 className={styles.cartTitle}>
                  <ShoppingCart className="h-5 w-5 mr-2 text-indigo-600" />
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className={styles.cartCloseButton}
                  aria-label="Close cart"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className={styles.cartContent}>
              {!cartItems?.length ? (
                <div className={styles.cartEmptyState}>
                  <ShoppingCart className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link to="/shop" className="mt-4 text-indigo-600 text-sm hover:text-indigo-700 transition-all duration-200">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className={styles.cartItemImage}
                        />
                      )}
                      <div className={styles.cartItemInfo}>
                        <h3 className={styles.cartItemName}>{item.product.name}</h3>
                        <p className={styles.cartItemPrice}>${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className={styles.cartQuantityControls}>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          className={styles.cartQuantityButton}
                          title="Decrease quantity"
                          disabled={item.quantity <= 0}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className={styles.cartQuantityButton}
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems?.length > 0 && (
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className={styles.checkoutButton}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Checkout
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className={styles.continueShoppingButton}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;