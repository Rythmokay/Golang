import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Get user cart
export const getUserCart = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/cart?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/cart/add`, 
      { user_id: userId, product_id: productId, quantity },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/cart/update`, 
      { id: cartItemId, quantity },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart (by setting quantity to 0)
export const removeFromCart = async (cartItemId) => {
  return updateCartItem(cartItemId, 0);
};
