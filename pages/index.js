import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { getCategories, getAllProducts, getSettings } from "@/lib/products";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prods, storeSettings] = await Promise.all([
          getCategories(),
          getAllProducts(),
          getSettings()
        ]);
        setCategories(cats);
        setProducts(prods);
        setSettings(storeSettings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (settings?.banners?.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % settings.banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [settings?.banners]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm text-outline font-medium">Loading Alfajr Super Mart...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout categories={categories}>
      {/* Hero Section / Banner Carousel */}
      <section className="bg-[#D1E9FF] pb-4">
        {settings?.banners?.length > 0 ? (
          <div className="relative overflow-hidden aspect-[21/10] md:aspect-[25/9]">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {settings.banners.map((banner, idx) => (
                <div key={idx} className="min-w-full h-full px-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={banner} 
                    alt={`Banner ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4">
            <div className="bg-gradient-to-r from-primary to-violet-400 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative shadow-md aspect-[21/10]">
              <div className="relative z-10">
                <div className="text-[32px] leading-none mb-2">🛒</div>
                <h1 className="font-h1 text-white mb-1 text-xl">{settings?.storeName || "Alfajr Super Mart"}</h1>
                <p className="text-white/80 font-body-md text-xs">Quality groceries delivered fast.</p>
              </div>
              <div className="absolute right-0 top-0 h-full opacity-20 flex items-center">
                <span className="material-symbols-outlined text-[100px] -rotate-12 translate-x-8">shopping_bag</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Navigation Icons */}
      <section className="bg-white py-4 px-4 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        {[
          { name: "All", emoji: "🛍️", active: true },
          { name: "Night Store", emoji: "🍦" },
          { name: "Fresh", emoji: "🍎" },
          { name: "Fashion", emoji: "🏷️" },
          { name: "Electronics", emoji: "🎧" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[70px]">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gray-50 border-b-2 ${item.active ? 'border-black' : 'border-transparent'}`}>
              {item.emoji}
            </div>
            <span className={`text-[10px] font-bold text-center ${item.active ? 'text-black' : 'text-gray-500'}`}>{item.name}</span>
          </div>
        ))}
      </section>

      {/* Offer Banners (2 Columns) */}
      <section className="bg-[#D1E9FF]/30 py-4 px-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 shadow-sm border border-blue-50/50">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
             <span className="material-symbols-outlined text-blue-500">shopping_bag</span>
          </div>
          <span className="text-2xl font-black text-blue-600">₹0 FEES</span>
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-1">
               <span className="material-symbols-outlined text-[12px] text-green-600 font-bold">check_circle</span>
               <span className="text-[9px] font-bold text-gray-600">₹0 Handling Fee</span>
             </div>
             <div className="flex items-center gap-1">
               <span className="material-symbols-outlined text-[12px] text-green-600 font-bold">check_circle</span>
               <span className="text-[9px] font-bold text-gray-600">₹0 Delivery Fee*</span>
             </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 shadow-sm border border-blue-50/50">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
             <span className="material-symbols-outlined text-blue-500">trending_down</span>
          </div>
          <span className="text-sm font-black text-blue-600 leading-tight uppercase">Everyday Lowest Prices</span>
          <div className="mt-auto">
             <div className="flex items-center gap-1">
               <span className="material-symbols-outlined text-[12px] text-green-600 font-bold">check_circle</span>
               <span className="text-[9px] font-bold text-gray-600">₹0 Rain & Surge Fee</span>
             </div>
          </div>
        </div>
      </section>

      {/* Fresh @ ₹9 Section */}
      <section className="py-6 px-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">Fresh</h2>
          <span className="bg-[#FFFF00] px-2 py-0.5 rounded-lg text-sm font-black text-[#1B5E20]">@ ₹9</span>
        </div>
        <p className="text-gray-500 text-sm font-bold mb-6">Handpicked daily essentials</p>
        
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2">
          {[
            { name: "₹9 Zone", icon: "⭐", color: "bg-[#E91E63]" },
            { name: "Veggies", icon: "🥬" },
            { name: "Fruits", icon: "🍎" },
            { name: "New Launches", icon: "🍐" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 min-w-[70px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                {item.color && (
                  <div className={`absolute -top-1 -left-1 ${item.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white rotate-[-15deg] shadow-md`}>
                    ₹9
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-center leading-tight">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Pills (Horizontal Scroll) */}
      <nav className="sticky top-[168px] bg-white z-40 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 border-b border-gray-50">
        <button className="whitespace-nowrap px-5 py-2 rounded-xl bg-black text-white font-bold text-xs">
          All
        </button>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <button className="whitespace-nowrap px-5 py-2 rounded-xl bg-gray-50 text-gray-600 font-bold text-xs border border-gray-100 hover:bg-gray-100 transition-colors">
              {cat.name}
            </button>
          </Link>
        ))}
      </nav>

      {/* Categories Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-h2 text-on-surface">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-3">
          {categories.slice(0, 20).map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary transition-all cursor-pointer group">
                <div className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <span className="text-[11px] font-bold text-center leading-tight line-clamp-2">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Category Sections */}
      {categories.slice(0, 5).map((cat) => {
        const catProducts = products.filter(p => p.categorySlug === cat.slug).slice(0, 4);
        if (catProducts.length === 0) return null;
        
        return (
          <section key={cat.slug} className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-h2 text-on-surface flex items-center gap-2">
                <span>{cat.emoji}</span> {cat.name}
              </h2>
              <Link href={`/category/${cat.slug}`}>
                <span className="text-primary font-bold text-body-sm cursor-pointer hover:underline">View All</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="pb-20"></div>
    </Layout>
  );
}
