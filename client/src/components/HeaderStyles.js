// HeaderStyles.js - Dedicated styling for header components
const styles = {
  // Header container
  header: {
    base: "fixed w-full top-0 z-50 transition-all duration-300 bg-white",
    scrolled: "bg-white/95 backdrop-blur-md shadow-sm",
  },
  
  // Navigation
  nav: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2",
  navContainer: "flex justify-between h-16 items-center",
  
  // Logo
  logo: "text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-all duration-200",
  
  // Search
  searchContainer: "hidden md:block flex-1 max-w-md mx-8",
  searchInput: "w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 transition-all duration-200",
  searchIcon: "h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200",
  
  // Navigation links
  navLinks: "hidden md:flex md:items-center md:space-x-6",
  navLink: {
    base: "px-4 py-2 text-sm font-medium transition-all duration-200",
    active: "text-indigo-600",
    inactive: "text-gray-700 hover:text-indigo-600"
  },
  
  // User menu
  userMenu: "hidden md:flex md:items-center md:space-x-6",
  
  // Cart button
  cartButton: "bg-indigo-600 text-white p-2.5 rounded-none transition-all duration-200 relative hover:bg-indigo-700 w-10 h-10 flex items-center justify-center",
  cartIcon: "h-5 w-5",
  cartBadge: "absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-none h-5 w-5 flex items-center justify-center",
  
  // Auth buttons
  authContainer: "flex items-center space-x-6",
  loginButton: "text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200",
  signupButton: "bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
  
  // User profile
  userProfile: {
    container: "relative",
    avatarContainer: "flex items-center space-x-2 cursor-pointer py-2 px-3 rounded-full hover:bg-gray-100 transition-all duration-200",
    avatar: "h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600",
    avatarIcon: "h-5 w-5",
    userInfo: "flex flex-col",
    username: "text-sm font-medium text-gray-800",
    userRole: "text-xs text-gray-500 capitalize",
    dropdown: "absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 transform transition-all duration-200 origin-top-right",
    dropdownHeader: "px-4 py-2 border-b border-gray-100 mb-1",
    dropdownItem: "flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150",
    dropdownIcon: "mr-3 h-4 w-4 text-gray-500 group-hover:text-indigo-600",
    dropdownDivider: "my-1 border-t border-gray-100",
    logoutButton: "flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150",
    logoutIcon: "mr-3 h-4 w-4 text-red-500",
  },
  
  // Mobile menu
  mobileMenuButton: "md:hidden p-2 rounded-full text-gray-700 hover:text-indigo-600 transition-all duration-200 focus:outline-none",
  mobileMenuIcon: "h-5 w-5",
  mobileMenu: "md:hidden border-t border-gray-100 bg-white",
  mobileMenuContainer: "py-4 space-y-3 px-4",
  mobileCartButton: "flex items-center justify-center w-10 h-10 rounded-none bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200",
  
  // Cart sidebar
  cartSidebar: "fixed inset-y-0 right-0 w-96 bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out",
  cartHeader: "p-4 border-b border-gray-100",
  cartTitle: "text-lg font-medium text-gray-800 flex items-center",
  cartCloseButton: "text-gray-500 hover:text-indigo-600 p-2 transition-all duration-200",
  cartContent: "flex-1 overflow-y-auto p-4",
  cartEmptyState: "flex flex-col items-center justify-center h-full text-center py-8",
  cartItem: "flex items-center space-x-3 p-3 border-b border-gray-100",
  cartItemImage: "h-14 w-14 object-cover rounded-md",
  cartItemInfo: "flex-1",
  cartItemName: "font-medium text-gray-800",
  cartItemPrice: "text-indigo-600",
  cartQuantityControls: "flex items-center space-x-1",
  cartQuantityButton: "p-1 text-gray-500 hover:text-indigo-600 transition-all duration-200",
  cartFooter: "p-4 border-t border-gray-100",
  cartTotal: "flex justify-between mb-4 items-center",
  checkoutButton: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-center font-medium transition-all duration-200 flex items-center justify-center",
  continueShoppingButton: "w-full mt-2 py-2 text-gray-500 hover:text-indigo-600 text-sm transition-all duration-200 text-center"
};

export default styles;
