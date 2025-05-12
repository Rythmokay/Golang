import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, AlertCircle } from 'lucide-react';

const Shop = () => {
  console.log('Shop component rendered');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  
  const userId = localStorage.getItem('userId');


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching products...');

      const response = await fetch('http://localhost:8081/api/shop/products', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(errorText || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log('Received response:', data);
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    console.log('Shop useEffect triggered');
    fetchProducts();
    if (userId) {
      fetchCartItems();
    }
  }, []);

  // Separate useEffect for cart items
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const addToCart = async (productId) => {
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          product_id: productId,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');
      
      // Refresh cart items
      fetchCartItems();
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {
    try {
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

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Cart Icon */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="bg-rose-500 text-white p-3 rounded-full shadow-lg hover:bg-rose-600 transition-colors duration-200"
        >
          <ShoppingCart className="h-6 w-6" />
          {(cartItems || []).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {(cartItems || []).reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!cartItems?.length ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {(cartItems || []).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(cartItems || []).length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                </div>
                <button className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition-colors duration-200">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <ShoppingCart className="h-12 w-12 mb-4" />
            <p>No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex items-center space-x-1 bg-rose-500 text-white px-3 py-1 rounded-md hover:bg-rose-600 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Seller: {product.seller_name}</span>
                    <span className="mx-2">•</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
