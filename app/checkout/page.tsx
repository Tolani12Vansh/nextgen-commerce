'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import { CheckCircle, Package, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session, status: authStatus } = useSession(); 
  const router = useRouter();
  
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // 🔥 Loop aur repeat success ko rokne ke liye master switch
  const hasProcessed = useRef(false);

  const subtotal = cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 15.0;
  const totalAmount = subtotal + shipping;

  // 🔒 AUTH GUARD (FIXED: Ab success hone par bahar nahi phekega)
  useEffect(() => {
    // Check karte hain ki user payment karke toh nahi lauta hai
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('status') === 'success';

    if (authStatus === 'unauthenticated' && !isSuccess) {
      router.push('/login');
    }
  }, [authStatus, router]);

  // SUCCESS EMAIL & CLEANUP TRIGGER (FIXED: Ab baar-baar success screen nahi aayegi)
  // 🎉 SUCCESS EMAIL TRIGGER (BULLETPROOF VERSION)
  useEffect(() => {
    // Jab tak next-auth session check kar raha hai, tab tak ruko
    if (authStatus === 'loading') return; 

    const searchParams = new URLSearchParams(window.location.search);
    
    if (searchParams.get('status') === 'success' && !hasProcessed.current) {
      hasProcessed.current = true; // Lock laga diya
      
      setCheckoutStatus('success');
      
      const generatedOrderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setOrderId(generatedOrderId);

      // Local storage check karo
      const savedData = localStorage.getItem('tempCheckoutData');
      localStorage.removeItem('tempCheckoutData'); // Clean up instantly
      
      // 🔥 BULLETPROOF DATA: Agar local storage dhokha de, toh direct Session se data uthao!
      let finalEmail = session?.user?.email;
      let finalName = session?.user?.name || 'Vansh Tolani';
      let finalTotal = totalAmount.toFixed(2);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.email) finalEmail = parsed.email;
        if (parsed.customerName) finalName = parsed.customerName;
        if (parsed.total) finalTotal = parsed.total;
      }

      // 🔥 GUARANTEED API CALL
      if (finalEmail) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: finalEmail,
            customerName: finalName,
            orderId: generatedOrderId,
            totalAmount: finalTotal
          })
        })
        .then(async (res) => {
          if (!res.ok) console.error("🚨 Server ne email reject kiya:", await res.text());
          else console.log("✅ Email successfully Vercel par bheja gaya!");
        })
        .catch(err => console.error("🚨 Fetch network error:", err));
      } else {
        console.error("⚠️ Email hi nahi mila (Na session mein, na local storage mein)");
      }
      
      // URL clean karo aur Cart empty karo
      window.history.replaceState(null, '', window.location.pathname);
      clearCart();
    }
  }, [authStatus, session, clearCart, totalAmount]); 
  // Dependency array update ki hai taaki session milne ke baad hi code aage badhe

  // 🔥 DIRECT PAYMENT HANDLER
  const handlePayment = async () => {
    setCheckoutStatus('loading');
    setErrorMessage('');

    // Session data (Agar login glitch kare toh fallback naam use hoga)
    const customerName = session?.user?.name || 'Vansh Tolani';
    const email = session?.user?.email || '';

    try {
      localStorage.setItem('tempCheckoutData', JSON.stringify({ 
        customerName, 
        email, 
        total: totalAmount.toFixed(2) 
      }));

      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cart, 
          customerName, 
          email, 
          shippingAddress: 'Provided at Payment Gateway'
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Stripe Session failed.');

      if (data.url) {
        window.location.href = data.url; 
      } else {
        throw new Error("Stripe URL missing.");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setCheckoutStatus('error');
    }
  };

  // ⏳ LOADING STATE (Auth load ho raha ho, ya checkout processing chal rahi ho)
  if (authStatus === 'loading' || checkoutStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">
          {checkoutStatus === 'loading' ? "Securing your checkout..." : "Verifying account..."}
        </p>
      </div>
    );
  }

  // 🎉 SUCCESS SCREEN (Sabse upar priority par, bina kisi overlap ke)
  if (checkoutStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-10 py-16 mt-12 text-center bg-white rounded-3xl shadow-xl border border-gray-100">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Payment successful! Your order <span className="font-mono text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg font-bold">{orderId}</span> is confirmed. 
          <br/><br/>
          <span className="text-sm font-semibold bg-green-50 text-green-700 px-4 py-2 rounded-full">
            We've sent a receipt to {session?.user?.email || 'your email'}.
          </span>
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
          Return to Store
        </Link>
      </div>
    );
  }

  // 💳 STANDARD CHECKOUT UI
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Express Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Account Review */}
        <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Account Details
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                <p className="font-bold text-gray-900">{session?.user?.name || 'Vansh Tolani'}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="font-bold text-gray-900">{session?.user?.email}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            
            <p className="text-sm text-gray-500 italic mt-4">
              * Any necessary shipping details will be collected securely at the Stripe payment gateway.
            </p>
          </div>

          {checkoutStatus === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 mb-6">
              {errorMessage}
            </div>
          )}

          <button 
            onClick={handlePayment}
            disabled={checkoutStatus === 'loading' || cart.length === 0}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {checkoutStatus === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              `Proceed to Pay $${totalAmount.toFixed(2)}`
            )}
          </button>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 border border-gray-100 rounded-3xl p-8 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" /> Order Summary
          </h2>
          <div className="space-y-4 mb-6">
            {cart.map((item:any) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}