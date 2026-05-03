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
    <div className="min-h-screen bg-background font-inter pb-24">
      {/* Search Header - Compact & Clean */}
      <header className="sticky top-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <h1 className="text-xl font-serif font-black tracking-tight text-secondary">Alfajr Supermart</h1>
          </Link>
          <form onSubmit={handleSearch} className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/60" data-icon="search">search</span>
            <input 
              className="w-full bg-surface-variant/50 border-none rounded-2xl px-12 py-3.5 text-body-md font-medium outline-none placeholder:text-on-surface-variant/60 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" 
              placeholder='Search groceries...' 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        {children}
      </main>

      {/* BottomNavBar - Simplified */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-4 pb-safe bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center gap-1 ${router.pathname === '/' ? 'text-primary' : 'text-on-surface-variant/60'} active:scale-95 transition-transform`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: router.pathname === '/' ? "'FILL' 1" : "" }}>home</span>
            <span className="text-[10px] font-bold">Home</span>
          </div>
        </Link>
        <Link href="/category">
          <div className={`flex flex-col items-center justify-center gap-1 ${router.pathname.startsWith('/category') ? 'text-primary' : 'text-on-surface-variant/60'} active:scale-95 transition-transform`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: router.pathname.startsWith('/category') ? "'FILL' 1" : "" }}>grid_view</span>
            <span className="text-[10px] font-bold">Categories</span>
          </div>
        </Link>
        <Link href="/search">
          <div className={`flex flex-col items-center justify-center gap-1 ${router.pathname === '/search' ? 'text-primary' : 'text-on-surface-variant/60'} active:scale-95 transition-transform`}>
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-[10px] font-bold">Search</span>
          </div>
        </Link>
        <Link href="/cart">
          <div className={`flex flex-col items-center justify-center gap-1 ${router.pathname === '/cart' ? 'text-primary' : 'text-on-surface-variant/60'} active:scale-95 transition-transform relative`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: router.pathname === '/cart' ? "'FILL' 1" : "" }}>shopping_cart</span>
            <span className="text-[10px] font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-0 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
      </nav>
    </div>
  );
}
