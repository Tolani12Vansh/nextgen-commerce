'use client';

import { useState } from 'react';
import { PackagePlus, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stockCount: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          category: productData.category,
          stockCount: Number(productData.stockCount),
          images: [{ url: productData.imageUrl }]
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      setStatus('success');
      setMessage(`Successfully added ${productData.name}!`);
      
      setProductData({
        name: '', description: '', price: '', category: 'Electronics', stockCount: '', imageUrl: ''
      });

      setTimeout(() => setStatus('idle'), 3000);

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">Manage your store inventory and products</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <PackagePlus className="h-5 w-5 text-blue-600" /> Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input 
                required 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={productData.name}
                onChange={(e) => setProductData({...productData, name: e.target.value})}
                placeholder="e.g. Sony WH-1000XM5 Headphones"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                required 
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                placeholder="Industry leading noise canceling headphones..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={productData.price}
                onChange={(e) => setProductData({...productData, price: e.target.value})}
                placeholder="399.99"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Count</label>
              <input 
                required 
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={productData.stockCount}
                onChange={(e) => setProductData({...productData, stockCount: e.target.value})}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Computers">Computers</option>
                  <option value="Gaming">Gaming</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
              <input 
                required 
                type="url" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={productData.imageUrl}
                onChange={(e) => setProductData({...productData, imageUrl: e.target.value})}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-200">
              {message}
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/10 transition-colors disabled:bg-gray-400"
          >
            {status === 'loading' ? 'Adding Product...' : 'Add Product to Database'}
          </button>
        </form>
      </div>
    </div>
  );
}