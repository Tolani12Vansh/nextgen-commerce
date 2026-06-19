import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';

// 1. GET: Fetch all products with strict Category Sequence
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get the search and category parameters from the URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Build a flexible query object
    let query = {};

    // If there is a search term, search by name or description (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If a category is selected, filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Database se saare filtered/unfiltered products uthao
    const products = await Product.find(query);
    
    // 🔥 CUSTOM SORTING JADOO: Agar "All" dekh rahe ho ya koi filter nahi laga, toh sequence enforce karo
    if (!category || category === 'All') {
      const definedOrder = ["Food", "Electronics", "Workspace", "Apparel", "Fitness", "Lifestyle"];
      
      products.sort((a, b) => {
        const indexA = definedOrder.indexOf(a.category);
        const indexB = definedOrder.indexOf(b.category);
        
        // Agar dono same category ke hain, toh unhe unke insertion time (Oldest First) ke hisaab se sort karo
        if (indexA === indexB) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        
        // Varna predefined sequence follow karo
        return indexA - indexB;
      });
    } else {
      // Agar single category selected hai (jaise sirf Electronics), toh use normal oldest first rakho
      products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Create product(s) in the database (Supports Single & Bulk Insert)
export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse the JSON data sent from the frontend or API client
    const body = await request.json();
    
    // SMART CHECK: Agar data ek Array hai, toh Bulk Insert (insertMany) karo
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
    
    // Standard Fallback: Agar single object hai, toh normal single create karo
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