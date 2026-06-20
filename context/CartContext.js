'use client'; 

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  
  useEffect(() => {
    const savedCart = localStorage.getItem('nextgen_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  
  const saveCartToLocalStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('nextgen_cart', JSON.stringify(newCart));
  };

  
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

  
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    saveCartToLocalStorage(updatedCart);
  };

  
  const clearCart = () => {
    saveCartToLocalStorage([]);
  };

  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}