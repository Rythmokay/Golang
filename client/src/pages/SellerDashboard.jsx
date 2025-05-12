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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {username}!</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your store and products from your dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`absolute right-4 top-4 p-2 rounded-full ${card.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors duration-200`}>
                <div className={`${card.color.replace('bg-', 'text-')}`}>
                  {card.icon}
                </div>
              </div>
              <div className="pr-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <PlusCircle className="h-5 w-5 mr-2 text-gray-500" />
                Add New Product
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Package className="h-5 w-5 mr-2 text-gray-500" />
                View Products
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                Store Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
