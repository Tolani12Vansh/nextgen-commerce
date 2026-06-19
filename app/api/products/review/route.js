import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, username, rating, comment } = body;

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Push new review object into array
    product.reviews.push({ username, rating, comment });
    await product.save();

    return NextResponse.json({ success: true, message: 'Review added live! ⭐', data: product.reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}