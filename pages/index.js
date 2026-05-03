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
      <section className="bg-[#2D004C] pb-6 pt-2">
        {settings?.banners?.length > 0 ? (
          <div className="relative overflow-hidden aspect-[21/11] md:aspect-[25/9]">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {settings.banners.map((banner, idx) => (
                <div key={idx} className="min-w-full h-full px-4 relative">
                  <div className="w-full h-full relative rounded-[28px] overflow-hidden border-2 border-[#E5B80B]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={banner} 
                      alt={`Banner ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-8 z-10">
                      <button 
                        onClick={handleBuyNow}
                        className="bg-[#E5B80B] text-[#2D004C] px-8 py-3 rounded-full font-black text-sm uppercase shadow-2xl active:scale-95 transition-all"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4">
            <div className="bg-[#2D004C] rounded-[28px] p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative border-2 border-[#E5B80B] aspect-[21/11] text-white">
              <div className="relative z-10 w-full md:w-3/5">
                <span className="text-[#E5B80B] font-black text-xs uppercase tracking-[0.2em] mb-3 block">ALFAJR PREMIUM</span>
                <h2 className="text-2xl md:text-4xl font-serif font-black mb-3 leading-tight text-white">Grocery Plan - <span className="text-[#E5B80B]">₹2250</span></h2>
                <p className="text-white/60 text-[11px] mb-6 font-medium italic">"ALL 22 ESSENTIAL ITEMS IN ONE BOX"</p>
                <button 
                  onClick={handleBuyNow}
                  className="bg-[#E5B80B] text-[#2D004C] px-10 py-3.5 rounded-full font-black text-sm uppercase shadow-xl active:scale-95 transition-all"
                >
                  Buy Now
                </button>
              </div>
              <div className="absolute right-0 top-0 h-full w-2/5 flex items-center justify-end opacity-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" alt="Groceries" className="h-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Row 1: Horizontal Scroll of Category Names */}
      <nav className="sticky top-[164px] bg-[#FDFCFE] z-40 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide px-4 border-b border-gray-100">
        {categories.slice(0, 20).map((cat) => (
          <Link key={cat.slug} href={`#${cat.slug}`}>
            <button className="whitespace-nowrap px-6 py-2.5 rounded-full bg-white text-[#2D004C] font-bold text-[12px] border-2 border-[#E5B80B]/40 hover:border-[#E5B80B] shadow-sm transition-all active:scale-95 flex items-center gap-2">
              <span className="text-lg leading-none">{cat.emoji}</span>
              {cat.name}
            </button>
          </Link>
        ))}
      </nav>

      {/* Rows 2+: Categorized Product Sections (Horizontal Scrolling) */}
      <div className="mt-8 space-y-12 pb-20">
        {categories.slice(0, 20).map((cat) => {
          const catProducts = products.filter(p => p.categorySlug === cat.slug).slice(0, 10);
          if (catProducts.length === 0) return null;
          
          return (
            <section key={cat.slug} id={cat.slug} className="scroll-mt-48">
              <div className="flex items-center justify-between px-4 mb-5">
                <h2 className="text-xl font-serif font-black text-[#2D004C] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-[#E5B80B]/20 shadow-sm">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{cat.emoji}</span>
                    )}
                  </div>
                  {cat.name}
                </h2>
                <Link href={`/category/${cat.slug}`}>
                  <span className="text-[#2D004C] font-black text-[11px] uppercase tracking-wider cursor-pointer hover:underline bg-[#E5B80B] px-4 py-1.5 rounded-full shadow-sm">View All</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 px-4 pb-4">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {/* View More Card */}
                <Link href={`/category/${cat.slug}`}>
                   <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-[#E5B80B]/40 cursor-pointer hover:bg-[#E5B80B]/5 transition-colors aspect-square">
                      <div className="w-8 h-8 rounded-full bg-[#2D004C] flex items-center justify-center shadow-md mb-1">
                         <span className="material-symbols-outlined text-[#E5B80B] text-sm">arrow_forward</span>
                      </div>
                      <span className="text-[8px] font-black text-[#2D004C] uppercase tracking-wider">More</span>
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
