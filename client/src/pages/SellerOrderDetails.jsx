import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSellerOrderDetails, updateOrderStatus } from '../services/orderService';

const SellerOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const sellerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getSellerOrderDetails(orderId, sellerId);
        setOrderDetails(data || null);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please try again.');
        setOrderDetails(null);
        setLoading(false);
      }
    };

    if (orderId && sellerId) {
      fetchOrderDetails();
    } else {
      setOrderDetails(null);
      setLoading(false);
      setError('Missing order ID or seller ID');
    }
  }, [orderId, sellerId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(orderDetails.order.id, newStatus);
      
      // Update the local state
      setOrderDetails({
        ...orderDetails,
        order: {
          ...orderDetails.order,
          status: newStatus
        }
      });
      
      setUpdatingStatus(false);
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAvailableStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return ['processing', 'cancelled'];
      case 'paid':
        return ['processing', 'cancelled'];
      case 'processing':
        return ['shipped', 'cancelled'];
      case 'shipped':
        return ['delivered', 'cancelled'];
      case 'delivered':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error || 'Order not found or you do not have permission to view it.'}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/seller/orders')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">

        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Order #{orderDetails?.order?.id}</h1>
            <button 
              onClick={() => navigate('/seller/orders')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors duration-200"
            >
              Back to Orders
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold mb-4 border-l-4 border-blue-500 pl-3 text-gray-800">Order Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium text-gray-700">Order Date:</span> {formatDate(orderDetails.order.created_at)}</p>
              <p>
                <span className="font-medium text-gray-700">Status:</span> 
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(orderDetails.order.status)}`}>
                  {orderDetails.order.status.charAt(0).toUpperCase() + orderDetails.order.status.slice(1)}
                </span>
              </p>
              <p><span className="font-medium text-gray-700">Payment Method:</span> {orderDetails.order.payment_method === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</p>
              <p><span className="font-medium text-gray-700">Your Subtotal:</span> ₹{orderDetails.seller_subtotal.toFixed(2)}</p>
            </div>
          </div>
        
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold mb-4 border-l-4 border-green-500 pl-3 text-gray-800">Customer Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium text-gray-700">Name:</span> {orderDetails.user_name}</p>
              <p><span className="font-medium text-gray-700">Shipping Address:</span> {orderDetails.order.shipping_address}</p>
              <p><span className="font-medium text-gray-700">Contact Number:</span> {orderDetails.order.contact_number}</p>
            </div>
          </div>
        
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold mb-4 border-l-4 border-purple-500 pl-3 text-gray-800">Update Status</h2>
            {getAvailableStatusOptions(orderDetails.order.status).length > 0 ? (
              <div>
                <p className="mb-2">Current status: <span className="font-semibold">{orderDetails.order.status}</span></p>
                <div className="flex items-center space-x-2">
                  <select 
                    className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updatingStatus}
                    defaultValue=""
                  >
                    <option value="" disabled>Select new status</option>
                    {getAvailableStatusOptions(orderDetails.order.status).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && (
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">This order is in its final state and cannot be updated further.</p>
            )}
          </div>
        </div>
      
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <h2 className="text-lg font-semibold p-6 bg-gray-50 border-b border-l-4 border-indigo-500 pl-4">Your Products in This Order</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderDetails.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={item.product_image} alt={item.product_name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-medium">Your Subtotal:</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">₹{orderDetails.seller_subtotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;
