'use client';

import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button 
      disabled={product.stockCount <= 0}
      onClick={() => addToCart(product)}
      className="w-full md:w-auto bg-gray-900 text-white hover:bg-blue-600 disabled:bg-gray-300 text-lg font-bold px-8 py-4 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
    >
      Add to Cart
    </button>
  );
}