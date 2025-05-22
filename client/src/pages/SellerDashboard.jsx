import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, PlusCircle, Settings, BarChart2 } from 'lucide-react';

const SellerDashboard = () => {
  const username = localStorage.getItem('username');

  const cards = [
    {
      title: 'Products',
      description: 'Manage your product listings',
      icon: <Package className="h-6 w-6" />,
      link: '/seller/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Product',
      description: 'Create a new product listing',
      icon: <PlusCircle className="h-6 w-6" />,
      link: '/seller/products/add',
      color: 'bg-green-500'
    },
    {
      title: 'Orders',
      description: 'View and manage orders',
      icon: <ShoppingBag className="h-6 w-6" />,
      link: '/seller/orders',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View your sales analytics',
      icon: <BarChart2 className="h-6 w-6" />,
      link: '/seller/analytics',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <br/>
      <br/>
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-10">
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {username}!</h1>
          <p className="mt-3 text-md text-gray-600">Manage your store and products from your dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="relative group bg-white p-7 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute right-5 top-5 p-3 rounded-full ${card.color} bg-opacity-15 group-hover:bg-opacity-25 transition-colors duration-200`}>
                <div className={`${card.color.replace('bg-', 'text-')}`}>
                  {card.icon}
                </div>
              </div>
              <div className="pr-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pl-2 border-l-4 border-indigo-500">Quick Actions</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/seller/products/add" className="flex items-center justify-center px-6 py-4 border border-transparent rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-sm">
                <PlusCircle className="h-6 w-6 mr-3" />
                Add New Product
              </Link>
              <Link to="/seller/products" className="flex items-center justify-center px-6 py-4 border border-transparent rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                <Package className="h-6 w-6 mr-3" />
                View Products
              </Link>
              <Link to="/seller/orders" className="flex items-center justify-center px-6 py-4 border border-transparent rounded-lg text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 shadow-sm">
                <ShoppingBag className="h-6 w-6 mr-3" />
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
