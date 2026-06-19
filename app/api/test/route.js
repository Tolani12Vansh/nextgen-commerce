import dbConnect from '../../../lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This line actually attempts to connect to your MongoDB
    await dbConnect(); 
    
    // If it succeeds, it sends this message back to your browser
    return NextResponse.json(
      { message: "Database connected successfully! 🚀 Your backend is alive." }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("DB Connection Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the database. Check your password in .env.local!" }, 
      { status: 500 }
    );
  }
}