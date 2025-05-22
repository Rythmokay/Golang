import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Signup from './components/SIgnup.jsx';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SellerDashboard from './pages/SellerDashboard';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import SellerOrders from './pages/SellerOrders';
import SellerOrderDetails from './pages/SellerOrderDetails';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Auth guard component for seller routes
const SellerRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated || userRole !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auth guard component for customer routes
const CustomerRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect sellers to their product management page
  if (userRole === 'seller') {
    return <Navigate to="/seller/products" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="w-full p-0 flex-grow">
          <Routes>
            <Route path="/" element={
              <CustomerRoute>
                <Home />
              </CustomerRoute>
            } />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/checkout"
              element={
                <CustomerRoute>
                  <Checkout />
                </CustomerRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <CustomerRoute>
                  <Orders />
                </CustomerRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <CustomerRoute>
                  <OrderDetails />
                </CustomerRoute>
              }
            />
            <Route
              path="/seller"
              element={
                <SellerRoute>
                  <SellerDashboard />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <SellerRoute>
                  <ProductList />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <SellerRoute>
                  <SellerOrders />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/order/:orderId"
              element={
                <SellerRoute>
                  <SellerOrderDetails />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/products/add"
              element={
                <SellerRoute>
                  <AddProduct />
                </SellerRoute>
              }
            />
            <Route
              path="/seller/products/edit/:id"
              element={
                <SellerRoute>
                  <EditProduct />
                </SellerRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
