import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom arrow components for the carousel
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

const Home = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  
  // Trigger animations when sections come into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Carousel settings
  const carouselSettings = {
    dots: false, // Hide dots navigation
    arrows: true, // Show arrow buttons
    infinite: true,
    speed: 200, // Even faster animation speed
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Even faster autoplay
    pauseOnHover: true,
    fade: true,
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)', // Smoother animation
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Leather Jacket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$299.99",
      description: "Handcrafted genuine leather jacket",
      tag: "Bestseller",
      category: "Men's Fashion"
    },
    {
      id: 2,
      name: "Designer Silk Dress",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$189.99",
      description: "Elegant silk evening dress",
      tag: "New",
      category: "Women's Fashion"
    },
    {
      id: 3,
      name: "Smart Watch Pro",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$249.99",
      description: "Advanced smartwatch with health tracking",
      tag: "Limited",
      category: "Accessories"
    },
    {
      id: 4,
      name: "Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$129.99",
      description: "Premium noise-cancelling headphones",
      tag: "Sale",
      category: "Electronics"
    },
    {
      id: 5,
      name: "Handcrafted Backpack",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$89.99",
      description: "Durable canvas and leather backpack",
      tag: "Trending",
      category: "Accessories"
    },
    {
      id: 6,
      name: "Premium Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      price: "$159.99",
      description: "Comfortable athletic sneakers",
      tag: "Bestseller",
      category: "Footwear"
    }
  ];

  // Carousel slides
  const carouselSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Elevate Your Style",
      subtitle: "Curated collections for the modern lifestyle",
      cta: "Shop Now",
      link: "/shop",
      color: "from-black to-gray-800" // More minimal with black
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Premium Quality",
      subtitle: "Handpicked products from trusted brands",
      cta: "Shop Now",
      link: "/shop",
      color: "from-gray-900 to-black" // More minimal with black
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Discover New Arrivals",
      subtitle: "Be the first to shop our latest collections",
      cta: "Shop Now",
      link: "/shop",
      color: "from-gray-800 to-gray-900" // More minimal with black
    }
  ];

  // Categories
  const categories = [
    {
      id: 1,
      name: "Women's Fashion",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      link: "/category/women"
    },
    {
      id: 2,
      name: "Men's Fashion",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      link: "/category/men"
    },
    {
      id: 3,
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      link: "/category/accessories"
    },
    {
      id: 4,
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1518894781321-630e638d0742?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      link: "/category/footwear"
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Custom hook for carousel auto-scroll with pause on hover
  const useAutoScroll = (initialIndex = 0, interval = 5000) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPaused, setIsPaused] = useState(false);
    const totalItems = featuredProducts.length;

    useEffect(() => {
      if (!isPaused) {
        const timer = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
        }, interval);
        return () => clearTimeout(timer);
      }
    }, [currentIndex, isPaused, totalItems, interval]);

    return {
      currentIndex,
      setCurrentIndex,
      isPaused,
      setIsPaused
    };
  };

  // Use the custom hook
  const { currentIndex, setCurrentIndex, isPaused, setIsPaused } = useAutoScroll(0, 2000); // Even faster auto-scroll

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section className="relative w-full">
        <Slider {...carouselSettings} className="w-full">
          {carouselSlides.map((slide) => (
            <div key={slide.id} className="relative h-screen w-full"> /* Full screen height */
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-30`}></div> /* Minimal color with less opacity */
              </div>
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 md:px-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }} /* Faster animation */
                  className="text-center max-w-4xl mx-auto"
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl md:text-2xl">{slide.subtitle}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Scroll down indicator hidden */}
      </section>

      {/* Categories Section */}
      <section className="py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of products across various categories</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="relative rounded-xl overflow-hidden shadow-lg h-64 group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <Link
                    to={category.link}
                    className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section with Auto-Scrolling Cards */}
      <section className="py-16 bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of premium products</p>
          </motion.div>

          <div className="relative">
            <div 
              className="flex overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex space-x-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 320}px)` }}>
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-72 snap-center"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        {product.tag && (
                          <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded">
                            {product.tag}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2">{product.category}</div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">{product.price}</span>
                          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-rose-500 hover:text-white transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation dots and arrows hidden */}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Features Section */}
      <section className="py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy for all items</p>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;