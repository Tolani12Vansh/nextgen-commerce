'use client';

import { useState } from 'react';

export default function ReviewForm({ productId }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/products/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          username: formData.get('username'),
          rating: Number(formData.get('rating')),
          comment: formData.get('comment'),
        })
      });
      
      if (res.ok) {
        window.location.reload(); // Refresh to display the new review instantly
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-10 space-y-4 shadow-xl">
      <h3 className="text-sm font-bold text-gray-200">Share your hardware experience</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required name="username" type="text" placeholder="Your name" className="bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500" />
        <select required name="rating" className="bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer text-gray-200">
          <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
          <option value="4">⭐⭐⭐⭐ (4/5)</option>
          <option value="3">⭐⭐⭐ (3/5)</option>
          <option value="2">⭐⭐ (2/5)</option>
          <option value="1">⭐ (1/5)</option>
        </select>
      </div>
      <textarea required name="comment" rows={3} placeholder="Write your premium feedback here..." className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"></textarea>
      <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-600/10 disabled:bg-gray-700">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}