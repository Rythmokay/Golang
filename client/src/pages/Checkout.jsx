import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkout, initializeRazorpay } from '../services/orderService';
import { getUserCart } from '../services/cartService';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [processingOrder, setProcessingOrder] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getUserCart(userId);
        setCartItems(response);
        
        // Calculate total amount
        const total = response.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);
        setTotalAmount(total);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart items. Please try again.');
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, navigate]);

  const handleAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  const handleContactChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const validateForm = () => {
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return false;
    }
    if (!contactNumber.trim()) {
      setError('Please enter a contact number');
      return false;
    }
    // Basic phone number validation
    if (!/^\d{10}$/.test(contactNumber.trim())) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;

    try {
      setProcessingOrder(true);
      
      // Initialize Razorpay with the updated function
      const paymentId = await initializeRazorpay({
        amount: totalAmount * 100, // Convert to paisa
        name: 'Your Order',
        description: 'Purchase from our store',
        prefill: {
          name: localStorage.getItem('username') || '',
          email: localStorage.getItem('email') || '',
          contact: contactNumber
        }
      });
      
      // If we get here, payment was successful (otherwise an error would have been thrown)
      const checkoutData = {
        user_id: parseInt(userId),
        payment_method: 'razorpay',
        shipping_address: shippingAddress,
        contact_number: contactNumber,
        payment_id: paymentId
      };

      const response = await checkout(checkoutData);
      if (response.success) {
        // Clear the cart in local state
        window.dispatchEvent(new CustomEvent('cart-updated'));
        navigate(`/orders/${response.order_id}`);
      } else {
        setError('Failed to process order. Please try again.');
      }
    } catch (err) {
      // Handle payment cancellation or failure
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateForm()) return;

    try {
      setProcessingOrder(true);
      const checkoutData = {
        user_id: parseInt(userId),
        payment_method: 'cod',
        shipping_address: shippingAddress,
        contact_number: contactNumber
      };

      const response = await checkout(checkoutData);
      if (response.success) {
        // Clear the cart in local state
        window.dispatchEvent(new CustomEvent('cart-updated'));
        navigate(`/orders/${response.order_id}`);
      } else {
        setError('Failed to process order. Please try again.');
      }
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCashOnDelivery();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Your cart is empty. Please add items to your cart before checkout.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={shippingAddress}
                  onChange={handleAddressChange}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  className="w-full p-2 border rounded"
                  value={contactNumber}
                  onChange={handleContactChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">Pay with Razorpay</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={processingOrder}
              >
                {processingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
