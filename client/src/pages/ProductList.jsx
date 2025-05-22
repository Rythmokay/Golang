import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import services with error handling
const API_URL = 'http://localhost:8081/api';

// Safe version of getSellerProducts that handles errors gracefully
const safeGetSellerProducts = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/products/seller?seller_id=${sellerId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

// Safe version of deleteProduct that handles errors gracefully
const safeDeleteProduct = async (productId, sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/products/delete?product_id=${productId}&seller_id=${sellerId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isSeller, setIsSeller] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    
    if (userRole !== 'seller') {
      setIsSeller(false);
      return false;
    }
    
    return true;
  };
  
  const fetchProducts = async () => {
    try {
      // Check authentication first
      if (!checkAuth()) {
        setLoading(false);
        return;
      }
      
      const sellerId = localStorage.getItem('userId');
      if (!sellerId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      const data = await safeGetSellerProducts(sellerId);
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleteId(productId);
    try {
      const sellerId = localStorage.getItem('userId');
      if (!sellerId) {
        throw new Error('User ID not found');
      }
      
      await safeDeleteProduct(productId, sellerId);

      // Refresh the product list
      await fetchProducts();
    } catch (err) {
      console.error('Error in handleDelete:', err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setDeleteId(null);
    }
  };

  // Render authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Please login to view your products</h2>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  // Render role check
  if (!isSeller) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Only sellers can access this page</h2>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Product
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No products found. Start by adding a new product!</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-md mr-4"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {product.category}</span>
                            <span>Price: ₹{product.price.toFixed(2)}</span>
                            <span>Stock: {product.stock}</span>
                          </div>
                          {product.description && (
                            <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/seller/products/edit/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteId === product.id}
                          className={`text-red-600 hover:text-red-900 font-medium ${
                            deleteId === product.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deleteId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
