import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Process checkout
export const checkout = async (checkoutData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/checkout`, checkoutData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    // Log request details for debugging
    console.log('Fetching orders for user:', userId);
    console.log('Token:', token ? 'Token exists' : 'No token');
    
    const response = await axios.get(`${API_URL}/orders/user?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Orders response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/details?order_id=${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Get seller order details - only shows products from this seller
export const getSellerOrderDetails = async (orderId, sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/seller-details?order_id=${orderId}&seller_id=${sellerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seller order details:', error);
    throw error;
  }
};

// Get seller orders
export const getSellerOrders = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/orders/seller?seller_id=${sellerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/orders/update-status`, 
      { order_id: orderId, status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Initialize Razorpay payment
export const initializeRazorpay = async (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        reject(new Error('Razorpay can only be initialized in a browser environment'));
        return;
      }
      
      // Make sure Razorpay is loaded
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK is not loaded'));
        return;
      }
      
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
        amount: paymentData.amount, // Amount should already be in paisa (multiply by 100 before passing)
        currency: 'INR',
        name: paymentData.name || 'E-Commerce Store',
        description: paymentData.description || 'Purchase from E-Commerce Store',
        handler: function(response) {
          resolve(response.razorpay_payment_id);
        },
        prefill: {
          name: paymentData.prefill?.name || localStorage.getItem('name') || '',
          email: paymentData.prefill?.email || localStorage.getItem('email') || '',
          contact: paymentData.prefill?.contact || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      reject(error);
    }
  });
};
