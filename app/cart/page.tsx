'use client'; 

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  // Calculate prices safely
  const subtotal = cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 15.0;
  const total = subtotal + shipping;

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Looks like you haven't added any premium tech to your bag yet.
        </p>
        <Link 
          href="/" 
          className="mt-8 inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Active Cart State
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: List of Items */}
        <div className="flex-1 space-y-6">
          {cart.map((item : any) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl p-6 shadow-sm gap-6"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-6 w-full sm:w-auto">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold mt-0.5">{item.category}</p>
                  <p className="text-gray-900 font-black mt-2">${item.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Actions: Quantity adjustments & Delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-8 border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <button 
                    onClick={() => removeFromCart(item._id)} 
                    className="text-gray-500 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="text-gray-900 font-bold px-2">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)} 
                    className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-400 font-medium">Total</p>
                  <p className="text-lg font-black text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors mt-4"
          >
            Clear entire bag
          </button>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 border-b border-gray-100 pb-6 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-gray-900">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-blue-600 font-medium bg-blue-50 p-2.5 rounded-xl">
                Add ${(300 - subtotal).toFixed(2)} more to unlock free shipping!
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 mb-8">
            <span className="text-base font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
          </div>

          {/* This link sends them to the checkout page we just built! */}
          <Link href="/checkout" className="block text-center w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300 active:scale-95">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}