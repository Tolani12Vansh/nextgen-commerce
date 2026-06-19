import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { customerName, email, shippingAddress, items, totalAmount } = body;

    // 1. INVENTORY TRACKING: Loop through each item and deduct stock
    for (const item of items) {
      const product = await Product.findById(item._id);
      
      if (!product) {
        return NextResponse.json({ success: false, error: `Product ${item.name} not found.` }, { status: 404 });
      }

      if (product.stockCount < item.quantity) {
        return NextResponse.json({ 
          success: false, 
          error: `Not enough stock for ${item.name}. Only ${product.stockCount} left.` 
        }, { status: 400 });
      }

      // Deduct the stock count safely
      product.stockCount -= item.quantity;
      await product.save();
    }

    // 2. Save the order to the database
    const newOrder = await Order.create({
      customerName,
      email,
      shippingAddress,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount
    });

    // NOTE: We will hook up the automated Resend email step right here in the next step!

    return NextResponse.json({ 
      success: true, 
      message: "Order placed successfully! Stock updated. 📦", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Checkout failed" }, { status: 500 });
  }
}