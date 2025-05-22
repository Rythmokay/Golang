import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Component to redirect users based on their role
const RoleBasedRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('RoleBasedRedirect - User role:', role);
    
    if (!token) {
      // Not logged in, redirect to login
      setRedirectPath('/login');
    } else if (role === 'seller') {
      // Seller should go to product management
      setRedirectPath('/seller/products');
    } else {
      // Customers go to shop
      setRedirectPath('/shop');
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <Navigate to={redirectPath} replace />;
};

export default RoleBasedRedirect;
