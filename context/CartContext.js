'use client'; // This must be a client component to hold state

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from local storage when the app loads so items persist
  useEffect(() => {
    const savedCart = localStorage.getItem('nextgen_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  const saveCartToLocalStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('nextgen_cart', JSON.stringify(newCart));
  };

  // 1. Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToLocalStorage(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      saveCartToLocalStorage(updatedCart);
    }
  };

  // 2. Remove item from cart completely
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    saveCartToLocalStorage(updatedCart);
  };

  // 3. Clear entire cart
  const clearCart = () => {
    saveCartToLocalStorage([]);
  };

  // Calculate total items in cart for the navbar badge
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to make utilizing this context super clean in other files
export function useCart() {
  return useContext(CartContext);
}