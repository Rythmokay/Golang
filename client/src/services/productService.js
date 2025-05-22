import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Create a new product
export const createProduct = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/products/create`, productData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Get all products for a seller
export const getSellerProducts = async (sellerId) => {
    try {
        const response = await axios.get(`${API_URL}/products/seller?seller_id=${sellerId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seller products:', error);
        throw error;
    }
};

// Get a specific product by ID
export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

// Update a product
export const updateProduct = async (productData) => {
    try {
        const response = await axios.put(`${API_URL}/products/update`, productData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete a product
export const deleteProduct = async (productId, sellerId) => {
    try {
        const response = await axios.delete(`${API_URL}/products/delete?product_id=${productId}&seller_id=${sellerId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};
