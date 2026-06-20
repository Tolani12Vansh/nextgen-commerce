import AuthProvider from '../components/AuthProvider'; 
// Path check kar lena apne folder structure ke hisaab se
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import Navbar from "../components/Navbar";
// Import our new Provider
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextGen Commerce",
  description: "Premium E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
  {/* AuthProvider sabse upar taaki poori app ko login state pata chale */}
  <AuthProvider>
    <CartProvider>
      <Suspense fallback={<div className="p-4 text-center text-sm text-gray-500">Loading Navigation...</div>}>
      <Navbar />
      </Suspense>
      <main className="flex-grow">{children}</main>
    </CartProvider>
  </AuthProvider>
</body>
    </html>
  );
}