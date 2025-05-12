import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Signup from './components/SIgnup.jsx';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SellerDashboard from './pages/SellerDashboard';
import Shop from './pages/Shop';
import './App.css';
import Header from './components/Header.jsx';

// Auth guard component for seller routes
const SellerRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated || userRole !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
      </div>
    </Router>
  );
}

export default App;
