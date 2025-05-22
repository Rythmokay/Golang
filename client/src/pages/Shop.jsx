import React, { useState, useEffect } from 'react';
import { AlertCircle, ShoppingCart, Plus } from 'lucide-react';
import ProductFilter from '../components/ProductFilter';

const Shop = () => {
  console.log('Shop component rendered');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userId = localStorage.getItem('userId');


  // Extract unique categories and count products per category
  const extractCategoriesAndCounts = (products) => {
    // Predefined list of categories to ensure they're always available
    const predefinedCategories = [
      'Electronics',
      'Clothing',
      'Books',
      'Home & Living',
      'Sports & Outdoors',
      'Beauty & Personal Care',
      'Others'
    ];
    
    const categoriesMap = {};
    const counts = { all: products.length };
    
    // Initialize predefined categories
    predefinedCategories.forEach(category => {
      categoriesMap[category] = false; // false means it's predefined but not in products yet
      counts[category] = 0;
    });
    
    // Process actual products
    products.forEach(product => {
      if (product.category && product.category.trim() !== '') {
        // Mark this category as existing in products
        categoriesMap[product.category] = true;
        
        // Count products per category
        counts[product.category] = (counts[product.category] || 0) + 1;
      }
    });
    
    // Get all categories (both predefined and from products)
    const allCategories = Object.keys(categoriesMap).sort();
    
    return {
      categories: allCategories,
      productCounts: counts
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching all products...');

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
        setAllProducts(data.products);
        // Extract categories and counts from products
        const { categories: extractedCategories, productCounts } = extractCategoriesAndCounts(data.products);
        setCategories(extractedCategories);
        setProductCounts(productCounts);
        
        // Apply initial filtering
        if (selectedCategory === 'all') {
          setProducts(data.products);
        } else {
          const filtered = data.products.filter(product => product.category === selectedCategory);
          setProducts(filtered);
        }
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

  // Custom event to notify Header component to refresh cart
  const triggerCartRefresh = () => {
    const event = new CustomEvent('refreshCart');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    console.log('Shop useEffect triggered');
    fetchProducts();
  }, []);
  
  // Effect to filter products when category changes
  useEffect(() => {
    if (!allProducts.length) return;
    
    if (selectedCategory === 'all') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => product.category === selectedCategory);
      setProducts(filtered);
    }
  }, [selectedCategory, allProducts]);
  
  const handleCategoryChange = (category) => {
    console.log(`Changing category to: ${category}`);
    setSelectedCategory(category);
  };

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
      
      // Trigger cart refresh in Header
      triggerCartRefresh();
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
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
        <br/>
        <br/>
        
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        </div>
        
        <ProductFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
          productCounts={productCounts}
        />

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <ShoppingCart className="h-12 w-12 mb-4" />
            <p className="text-lg">{selectedCategory === 'all' ? 'No products available' : `No products found in category "${selectedCategory}"`}</p>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => handleCategoryChange('all')} 
                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
              >
                View All Products
              </button>
            )}
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
                    <span className="text-lg font-semibold">₹{product.price.toFixed(2)}</span>
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
