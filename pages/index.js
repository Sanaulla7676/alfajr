import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { getCategories, getAllProducts, getSettings } from "@/lib/products";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const handleBuyNow = () => {
    // Add first 3 products of the first category to cart as a "bundle"
    if (categories.length > 0) {
      const firstCat = categories[0];
      const bundleProducts = products.filter(p => p.categorySlug === firstCat.slug).slice(0, 3);
      bundleProducts.forEach(p => addToCart(p));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      // Scroll to categories or just show notification
      const firstSection = document.getElementById(firstCat.slug);
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          <span className="text-xs font-bold uppercase tracking-tight">Essential Bundle added to cart!</span>
        </div>
      )}

      {/* Hero Section / Banner Carousel */}
      <section className="bg-[#D1E9FF] pb-4">
        {settings?.banners?.length > 0 ? (
          <div className="relative overflow-hidden aspect-[21/10] md:aspect-[25/9]">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {settings.banners.map((banner, idx) => (
                <div key={idx} className="min-w-full h-full px-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={banner} 
                    alt={`Banner ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                  />
                  <div className="absolute bottom-6 left-10 z-10">
                    <button 
                      onClick={handleBuyNow}
                      className="bg-white text-black px-8 py-3 rounded-full font-black text-sm uppercase shadow-xl hover:scale-105 transition-all active:scale-95 border-2 border-black/5"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            {settings.banners.length > 1 && (
              <div className="absolute bottom-6 right-10 flex gap-2 z-20">
                {settings.banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentBanner === idx ? "bg-white w-6 shadow-md" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4">
            <div className="bg-[#0A4D3C] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-md aspect-[21/10] text-white">
              <div className="relative z-10 w-full md:w-1/2">
                <span className="text-amber-300 font-black text-sm uppercase tracking-widest mb-2 block">ROYAL MANGO FESTIVAL</span>
                <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Sweetest arrivals, delivered in 30 mins!</h2>
                <p className="text-white/70 text-xs mb-4">Freshness Guaranteed.</p>
                <button 
                  onClick={handleBuyNow}
                  className="bg-white text-[#0A4D3C] px-8 py-3 rounded-full font-black text-sm uppercase shadow-lg active:scale-95 transition-all hover:scale-105"
                >
                  Buy Now
                </button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80" alt="Mangoes" className="h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Row 1: Horizontal Scroll of 20 Category Names */}
      <nav className="sticky top-[152px] bg-white z-40 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 border-b border-gray-50 shadow-sm">
        {categories.slice(0, 20).map((cat) => (
          <Link key={cat.slug} href={`#${cat.slug}`}>
            <button className="whitespace-nowrap px-5 py-2 rounded-full bg-gray-50 text-gray-700 font-bold text-[11px] border border-gray-100 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-all active:scale-95">
              {cat.emoji} {cat.name}
            </button>
          </Link>
        ))}
      </nav>

      {/* Rows 2+: Categorized Product Sections (Horizontal Scrolling) */}
      <div className="mt-6 space-y-12 pb-20">
        {categories.slice(0, 20).map((cat) => {
          const catProducts = products.filter(p => p.categorySlug === cat.slug).slice(0, 10);
          if (catProducts.length === 0) return null;
          
          return (
            <section key={cat.slug} id={cat.slug} className="scroll-mt-40">
              <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{cat.emoji}</span>
                    )}
                  </div>
                  {cat.name}
                </h2>
                <Link href={`/category/${cat.slug}`}>
                  <span className="text-[#E91E63] font-bold text-xs cursor-pointer hover:underline bg-[#E91E63]/5 px-3 py-1 rounded-full">View All</span>
                </Link>
              </div>
              
              <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide px-4 pb-4">
                {catProducts.map((product) => (
                  <div key={product.id} className="min-w-[160px] max-w-[160px]">
                    <ProductCard product={product} />
                  </div>
                ))}
                {/* View More Card */}
                <Link href={`/category/${cat.slug}`}>
                   <div className="min-w-[140px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                         <span className="material-symbols-outlined text-[#E91E63]">arrow_forward</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">View More</span>
                   </div>
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <div className="pb-20"></div>
    </Layout>
  );
}
