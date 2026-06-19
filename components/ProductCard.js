'use client'; // Essential for click events!

// ... existing imports
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); 

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      
      {/* Clicking the image takes you to the details page */}
      <Link href={`/product/${product._id}`} className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer block">
        <img 
  src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12'} 
  alt={product.name} 
  className="w-full h-full object-cover"
/>
        {product.stockCount <= 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        
        {/* Clicking the title also takes you to the details page */}
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-5 flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button 
            disabled={product.stockCount <= 0}
            onClick={() => addToCart(product)} 
            className="bg-gray-900 text-white hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}