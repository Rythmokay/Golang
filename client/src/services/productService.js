const API_URL = 'http://localhost:8081/api';

export const productService = {
    // Create a new product
    createProduct: async (productData) => {
        const response = await fetch(`${API_URL}/products/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error('Failed to create product');
        }
        return response.json();
    },

    // Get all products for a seller
    getSellerProducts: async (sellerId) => {
        const response = await fetch(`${API_URL}/products/seller?seller_id=${sellerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },

    // Update a product
    updateProduct: async (productData) => {
        const response = await fetch(`${API_URL}/products/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        return response.json();
    },

    // Delete a product
    deleteProduct: async (productId, sellerId) => {
        const response = await fetch(`${API_URL}/products/delete?product_id=${productId}&seller_id=${sellerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        return response.json();
    },
};
