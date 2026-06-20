'use client'; 

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard'; 


function HomePageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${search}&category=${category}`);
        const result = await res.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [search, category]); 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 bg-gray-900/50 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {search ? (
            <span>Search results for <span className="text-blue-500">"{search}"</span></span>
          ) : category !== 'All' ? (
            <span>{category} <span className="text-blue-500">Collection</span></span>
          ) : (
            <span>Explore <span className="text-blue-500">Premium Tech</span></span>
          )}
        </h1>
        <p className="text-gray-300 font-semibold text-sm sm:text-base mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          {products.length} live {products.length === 1 ? 'item' : 'items'} available to buy
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <p className="text-xl font-bold text-blue-500 animate-pulse tracking-wide">Filtering live inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            We couldn't find any premium tech matching your selection. Try checking your spelling or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 max-w-7xl mx-auto px-4">
        <p className="text-xl font-bold text-gray-500 animate-pulse tracking-wide">Loading NextGen Marketplace...</p>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}