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
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black font-bold text-[24px]">bolt</span>
                <span className="text-xl font-black tracking-tight text-black">10 minutes</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-[11px] font-bold text-black/70 truncate max-w-[200px]">Other - 103, floor 2, 86, 18th Main Rd, J...</span>
                <span className="material-symbols-outlined text-[16px] text-black/70">keyboard_arrow_down</span>
              </div>
            </div>
            <Link href="/admin/login">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-black">person</span>
              </div>
            </Link>
          </div>

          {/* Row 2: Quick Tabs (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4">
            {[
              { name: "zepto", color: "text-[#8E24AA] bg-white" },
              { name: "Summer Store", color: "text-[#1E88E5] bg-white" },
              { name: "Super Mall.", color: "text-[#3949AB] bg-white" },
              { name: "cafe", color: "text-[#E64A19] bg-[#FFF3E0]", extra: "From ₹39" }
            ].map((tab, idx) => (
              <div key={idx} className={`flex-shrink-0 px-4 py-2.5 rounded-xl flex flex-col items-center justify-center min-w-[90px] shadow-sm ${tab.color}`}>
                <span className="font-black text-sm uppercase tracking-tight leading-none">{tab.name}</span>
                {tab.extra && <span className="text-[9px] font-bold mt-0.5">{tab.extra}</span>}
              </div>
            ))}
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
            <div className="hidden sm:flex bg-white p-1 rounded-xl items-center gap-2 shadow-sm min-w-[120px]">
              <div className="flex flex-col pl-2">
                <span className="text-[10px] font-bold leading-tight">Protein</span>
                <span className="text-[10px] font-bold leading-tight">Fest</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
            </div>
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
        <div className="flex flex-col items-center justify-center gap-0.5 text-gray-500 active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[10px] font-bold">Buy Again</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 text-gray-500 active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined text-[24px]">print</span>
          <span className="text-[10px] font-bold">Print Store</span>
        </div>
      </nav>

      {/* Floating Cart Button */}
      {cartCount > 0 && router.pathname !== '/cart' && (
        <div className="fixed bottom-[80px] left-4 right-4 z-40 lg:hidden">
          <Link href="/cart">
            <div className="bg-[#E91E63] text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-xl shadow-[#E91E63]/30 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">shopping_bag</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black">Cart</span>
                  <span className="text-[11px] font-bold opacity-80">{cartCount} items</span>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
