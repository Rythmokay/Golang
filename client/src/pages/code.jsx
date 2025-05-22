// In Shop.jsx
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('all');
const [categories, setCategories] = useState([]);

// Fetch products and categories on component mount
useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);

// Filter products when category selection changes
useEffect(() => {
  if (selectedCategory === 'all') {
    setFilteredProducts(products);
  } else {
    setFilteredProducts(
      products.filter(product => product.category === selectedCategory)
    );
  }
}, [selectedCategory, products]);

// Render category filters
return (
  <div className="shop-container">
    <div className="category-filters">
      <button 
        className={selectedCategory === 'all' ? 'active' : ''}
        onClick={() => setSelectedCategory('all')}
      >
        All Products
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={selectedCategory === category ? 'active' : ''}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
    
    <div className="product-grid">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);