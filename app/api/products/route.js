import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    await dbConnect();
    
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    
    let query = {};

    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    
    if (category && category !== 'All') {
      query.category = category;
    }

    
    const products = await Product.find(query);
    
    
    if (!category || category === 'All') {
      const definedOrder = ["Food", "Electronics", "Workspace", "Apparel", "Fitness", "Lifestyle"];
      
      products.sort((a, b) => {
        const indexA = definedOrder.indexOf(a.category);
        const indexB = definedOrder.indexOf(b.category);
        
        
        if (indexA === indexB) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        
        
        return indexA - indexB;
      });
    } else {
      
      products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    
    
    const body = await request.json();
    
    
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ success: false, error: "Product array cannot be empty" }, { status: 400 });
      }
      
      const createdProducts = await Product.insertMany(body);
      
      return NextResponse.json(
        { 
          success: true, 
          message: `${createdProducts.length} products created successfully in bulk! 🎉`, 
          data: createdProducts 
        }, 
        { status: 201 }
      );
    }
    
    
    const newProduct = await Product.create(body);
    
    return NextResponse.json(
      { success: true, message: "Single product created successfully! 🎉", data: newProduct }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" }, 
      { status: 400 }
    );
  }
}