import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-red-100 text-gray-700 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold font-serif text-red-500 mb-4">MYRA</h2>
          <p>Your go-to store for stylish and affordable shopping.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-red-400 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-red-400 mb-2">Support</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-red-400 mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-red-500">Facebook</a>
            <a href="#" className="hover:text-red-500">Instagram</a>
            <a href="#" className="hover:text-red-500">Twitter</a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MYRA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
