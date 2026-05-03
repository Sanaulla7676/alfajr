import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Layout({ children, categories = [] }) {
  const { cartCount, settings } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] font-inter">
      {/* TopAppBar - Mobile First */}
      <header className="sticky top-0 w-full bg-[#2D004C] z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 pb-4">
          {/* Row 1: Logo & Profile */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <h1 className="text-2xl font-serif font-black tracking-tight text-[#E5B80B]">Alfajr Supermart</h1>
            </Link>
            <Link href="/admin/login">
              <div className="w-10 h-10 border-2 border-[#E5B80B]/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#E5B80B]">person</span>
              </div>
            </Link>
          </div>

          {/* Row 2: Search Bar */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400" data-icon="search">search</span>
              <input 
                className="w-full bg-white border-2 border-[#E5B80B] px-11 py-3 rounded-2xl text-sm font-medium shadow-inner outline-none placeholder:text-gray-400" 
                placeholder='Search for Groceries' 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {children}
      </main>

      {/* BottomNavBar - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-[#2D004C] border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/' ? 'text-[#E5B80B]' : 'text-white/60'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: router.pathname === '/' ? "'FILL' 1" : "" }}>home</span>
            <span className="text-[10px] font-bold">Home</span>
          </div>
        </Link>
        <Link href="/category">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/category' ? 'text-[#E5B80B]' : 'text-white/60'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined text-[26px]">grid_view</span>
            <span className="text-[10px] font-bold">Categories</span>
          </div>
        </Link>
        <Link href="/download-app">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/download-app' ? 'text-[#E5B80B]' : 'text-white/60'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined text-[26px]">install_mobile</span>
            <span className="text-[10px] font-bold">App</span>
          </div>
        </Link>
        <Link href="/cart">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/cart' ? 'text-[#E5B80B]' : 'text-white/60'} active:scale-95 transition-transform cursor-pointer relative`}>
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: router.pathname === '/cart' ? "'FILL' 1" : "" }}>shopping_cart</span>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4757] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
      </nav>

      {/* Floating Cart Button (Desktop only, or optional) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Link href="/cart">
           <button className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-1 group active:scale-95 transition-all">
             <div className="relative">
                <span className="material-symbols-outlined text-black text-[32px]">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
             </div>
             <span className="text-xs font-bold text-gray-500">Cart</span>
           </button>
        </Link>
      </div>
    </div>
  );
}
