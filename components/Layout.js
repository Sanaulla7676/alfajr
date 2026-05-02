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
    <div className="min-h-screen bg-surface-container-lowest font-inter">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full bg-white z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          {/* Row 1: Logo & Actions (Actions move to end on MD) */}
          <div className="flex items-center justify-between md:justify-start gap-6">
            <Link href="/">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-violet-600 cursor-pointer">{settings?.storeName || "Alfajr Super Mart"}</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-lg cursor-default">
              <span className="material-symbols-outlined text-primary text-[20px]" data-icon="location_on">location_on</span>
              <div className="flex flex-col leading-none">
                <span className="text-label-caps font-bold text-outline">Fast Delivery</span>
                <span className="text-body-sm font-semibold truncate max-w-[150px]">HSR Layout, Sector 7, Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Row 2 on mobile, Middle on Desktop: Search Bar */}
          <div className="w-full flex-1 order-3 md:order-2">
            <form onSubmit={handleSearch} className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline" data-icon="search">search</span>
              <input 
                className="w-full bg-surface-container-low border border-gray-100 px-10 py-2 md:py-2.5 rounded-xl focus:ring-2 focus:ring-primary-container text-sm md:text-body-md transition-all outline-none" 
                placeholder="Search for 'milk'" 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Actions / Mobile Actions (Right aligned) */}
          <div className="flex items-center gap-2 md:gap-4 order-2 md:order-3 absolute md:relative right-4 top-2 md:top-auto">
            <Link href="/admin/login">
              <button className="p-2 hover:bg-gray-50 transition-colors rounded-full active:opacity-80">
                <span className="material-symbols-outlined text-on-surface" data-icon="person">person</span>
              </button>
            </Link>
            <Link href="/cart">
              <button className="bg-primary px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2 text-white active:opacity-80 transition-opacity relative">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]" data-icon="shopping_cart" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                <span className="hidden sm:block font-bold text-xs md:text-body-md whitespace-nowrap">My Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-white/90 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center ${router.pathname === '/' ? 'text-violet-600' : 'text-gray-400'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
          </div>
        </Link>
        <Link href="/search">
          <div className={`flex flex-col items-center justify-center ${router.pathname === '/search' ? 'text-violet-600' : 'text-gray-400'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined">search</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Search</span>
          </div>
        </Link>
        <Link href="/cart">
          <div className={`flex flex-col items-center justify-center ${router.pathname === '/cart' ? 'text-violet-600' : 'text-gray-400'} active:scale-95 transition-transform cursor-pointer relative`}>
            <span className="material-symbols-outlined">shopping_basket</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
        <Link href="/admin/login">
          <div className={`flex flex-col items-center justify-center ${router.pathname.startsWith('/admin') ? 'text-violet-600' : 'text-gray-400'} active:scale-95 transition-transform cursor-pointer`}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">Profile</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
