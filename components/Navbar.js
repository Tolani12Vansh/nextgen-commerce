'use client'; 

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cartCount } = useCart(); 
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tight text-gray-900">
              NEXTGEN<span className="text-blue-600">.</span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search premium tech..."
                defaultValue={searchParams.get('search') || ''}
                onChange={handleSearchChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <Heart className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center scale-90 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="pl-4 border-l border-gray-200 flex items-center">
              {status === 'loading' ? (
                
                <div className="animate-pulse bg-gray-200 h-9 w-24 rounded-xl"></div>
              ) : session?.user ? (
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 hidden sm:block">
                    Hi, {session.user.name?.split(' ')[0]} 👋
                  </span>
                  <button 
                    onClick={() => signOut()} 
                    className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                
                <Link 
                  href="/login" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  Login
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}