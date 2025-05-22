import React from 'react';
import { Filter, Tag } from 'lucide-react';

const ProductFilter = ({ categories, selectedCategory, onCategoryChange, productCounts = {} }) => {
  return (
    <div className="flex flex-col w-full mb-6">
      <div className="flex items-center mb-3">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-600">Filter by Category</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center ${
            selectedCategory === 'all'
              ? 'bg-rose-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Tag className="h-3.5 w-3.5 mr-1" />
          All Products
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800">
            {productCounts.all || 0}
          </span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center ${
              selectedCategory === category
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Tag className="h-3.5 w-3.5 mr-1" />
            {category}
            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
              selectedCategory === category
                ? 'bg-rose-300 text-rose-800'
                : 'bg-gray-200 text-gray-800'
            }`}>
              {productCounts[category] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
