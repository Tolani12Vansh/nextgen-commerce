import dbConnect from '../../../lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect(); 
    
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