import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching single product:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}