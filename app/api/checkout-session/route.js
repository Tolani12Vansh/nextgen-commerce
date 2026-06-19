import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Yeh line automatic tumhari .env.local se asli secret key utha legi
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { cart, customerName, email, shippingAddress } = await request.json();

    // Data validation guard
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Cart items ko Stripe format ke hisaab se map karo
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // Agar product images hain toh array bhejo, varna empty
          images: item.images?.[0]?.url ? [item.images[0].url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents ($1 = 100 cents)
      },
      quantity: item.quantity || 1,
    }));

    // Stripe hosted checkout session create ho raha hai
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/checkout?status=success',
      cancel_url: 'http://localhost:3000/cart',
      // Metadata me customer info attach kar rahe hain future reference ke liye
      metadata: {
        customerName,
        email,
        shippingAddress
      }
    });

    // Frontend ko direct URL response bhej rahe hain redirect ke liye
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Session Backend Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}