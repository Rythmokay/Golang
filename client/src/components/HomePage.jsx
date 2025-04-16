import React, { useEffect, useState } from 'react';

// Carousel Images Data
const carouselImages = [
  "https://via.placeholder.com/1200x500?text=Sale+1",
  "https://via.placeholder.com/1200x500?text=Sale+2",
  "https://via.placeholder.com/1200x500?text=Sale+3"
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic carousel image transition every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* Hero Section (Carousel) */}
      <section className="relative w-full h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center px-4 md:px-12">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Discover Our Latest Collection
            </h2>
            <p className="text-lg md:text-xl mb-6">
              Unique styles, exclusive deals, and fresh arrivals just for you
            </p>
            <button className="px-8 py-3 bg-white text-red-600 font-semibold text-lg rounded-full shadow-md hover:bg-red-600 hover:text-white transition duration-300 ease-in-out">
              Shop Now
            </button>
          </div>
        </div>
        <div className="absolute inset-0">
          <img
            src={carouselImages[currentIndex]}
            alt="Carousel Image"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Search Filters Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Find Your Perfect Product</h3>
          <div className="flex justify-center gap-4">
            <input
              type="text"
              placeholder="Search for products"
              className="px-6 py-3 w-full sm:w-80 rounded-lg border border-gray-300"
            />
            <select className="px-6 py-3 rounded-lg border border-gray-300">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home Decor</option>
            </select>
            <select className="px-6 py-3 rounded-lg border border-gray-300">
              <option>Price</option>
              <option>$0 - $50</option>
              <option>$50 - $100</option>
              <option>$100+</option>
            </select>
            <button className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-center text-3xl font-semibold mb-8 text-gray-800">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Product Card 1 */}
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="Product 1"
              className="w-full h-64 object-cover rounded-t-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Product 1</h4>
            <p className="text-gray-600 text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-red-500">$99.99</span>
              <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
          {/* Repeat for other products... */}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-3xl font-semibold text-gray-800 mb-8">Best Sellers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Best Seller Product Card */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <img
                src="https://via.placeholder.com/300"
                alt="Best Seller 1"
                className="w-full h-64 object-cover rounded-t-lg mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Best Seller 1</h4>
              <p className="text-gray-600 text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-red-500">$199.99</span>
                <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Repeat for other best sellers... */}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-center text-3xl font-semibold mb-8 text-gray-800">New Arrivals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Product Card for New Arrivals */}
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <img
              src="https://via.placeholder.com/300"
              alt="New Arrival"
              className="w-full h-64 object-cover rounded-t-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">New Product 1</h4>
            <p className="text-gray-600 text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-red-500">$79.99</span>
              <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
          {/* Repeat for other new arrivals... */}
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="bg-red-500 py-12 text-white text-center">
        <h3 className="text-3xl font-semibold mb-4">Stay Updated with Our Latest Offers!</h3>
        <p className="mb-6">Sign up for our newsletter to get the latest updates and exclusive discounts.</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 rounded-l-full w-1/3 text-gray-700"
          />
          <button className="px-6 py-3 bg-white text-red-500 rounded-r-full">Subscribe</button>
        </div>
      </section> */}

      {/* Footer Section */}
      
    </div>
  );
}

export default Home;
