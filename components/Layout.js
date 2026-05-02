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
    <div className="min-h-screen bg-white font-inter">
      {/* TopAppBar - Mobile First */}
      <header className="sticky top-0 w-full bg-[#D1E9FF] z-50">
        <div className="max-w-[1400px] mx-auto px-4 pt-3 pb-2">
          {/* Row 1: Delivery Status & Profile */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black font-bold text-[20px]">bolt</span>
                <span className="text-lg font-black tracking-tight text-black">Super hygenic</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-[11px] font-bold text-black/70 truncate max-w-[200px]">RML Nagar 2 nd stage opposite taiba super mart</span>
                <span className="material-symbols-outlined text-[16px] text-black/70">keyboard_arrow_down</span>
              </div>
            </div>
            <Link href="/admin/login">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-black">person</span>
              </div>
            </Link>
          </div>

          {/* Row 2: Store Branding */}
          <div className="mb-4">
             <h1 className="text-3xl font-black tracking-tighter text-black italic">Alfajr Super <span className="font-medium">mart</span></h1>
          </div>

          {/* Row 3: Search Bar */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-black" data-icon="search">search</span>
              <input 
                className="w-full bg-white border-none px-10 py-3 rounded-xl text-sm font-medium shadow-sm outline-none" 
                placeholder='Search for "Milk"' 
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
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-white border-t border-gray-100">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/' ? 'text-[#E91E63]' : 'text-gray-500'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: router.pathname === '/' ? "'FILL' 1" : "" }}>home</span>
            <span className="text-[10px] font-bold">Home</span>
          </div>
        </Link>
        <Link href="/category">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/category' ? 'text-[#E91E63]' : 'text-gray-500'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="text-[10px] font-bold">Categories</span>
          </div>
        </Link>
        <Link href="/cart">
          <div className={`flex flex-col items-center justify-center gap-0.5 ${router.pathname === '/cart' ? 'text-[#E91E63]' : 'text-gray-500'} active:scale-95 transition-transform cursor-pointer relative`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: router.pathname === '/cart' ? "'FILL' 1" : "" }}>shopping_basket</span>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
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
