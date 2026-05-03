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
    const banner = settings?.banners?.[currentBanner];
    const bannerObj = typeof banner === 'string' ? null : banner;

    if (bannerObj?.name && bannerObj?.price) {
      // Add the specific Hero Package for THIS banner to cart
      const heroPackage = {
        id: `hero-package-${currentBanner}`, // Unique ID per banner
        name: bannerObj.name,
        price: parseFloat(bannerObj.price),
        imageUrl: bannerObj.url,
        unit: "PACKAGE",
        quantity: 1
      };
      addToCart(heroPackage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Fallback if no specific banner package is set
    if (categories.length > 0) {
      const firstCat = categories[0];
      const bundleProducts = products.filter(p => p.categorySlug === firstCat.slug).slice(0, 3);
      bundleProducts.forEach(p => addToCart(p));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
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

      {/* Hero Section / Banner Carousel - 21:9 Aspect Ratio */}
      <section className="bg-white py-4">
        {settings?.banners?.length > 0 ? (
          <div className="relative overflow-hidden aspect-[21/10] md:aspect-[25/9] px-4">
            <div 
              className="flex transition-transform duration-700 h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {settings.banners.map((banner, idx) => {
                const bannerObj = typeof banner === 'string' ? { url: banner, name: '', price: '' } : banner;
                return (
                  <div key={idx} className="min-w-full h-full relative">
                    <div className="w-full h-full relative rounded-[32px] overflow-hidden bg-[#F2F2F2]">
                      <img 
                        src={bannerObj.url} 
                        alt={bannerObj.name || "Banner"} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent"></div>
                      <div className="absolute top-0 left-0 h-full flex flex-col justify-center p-8 w-1/2">
                        <span className="font-label-caps text-on-surface-variant mb-1">Vegetable Offers</span>
                        <h2 className="text-2xl font-h1 text-on-surface mb-2">{bannerObj.name || "20% OFF"}</h2>
                        <p className="text-[10px] text-on-surface-variant font-bold mb-4">10 October, 2025</p>
                        <button 
                          onClick={handleBuyNow}
                          className="bg-primary text-white px-6 py-2.5 rounded-full font-black text-xs uppercase shadow-lg shadow-primary/20 active:scale-95 transition-all w-fit"
                        >
                          Get Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {settings.banners.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${currentBanner === idx ? 'bg-primary w-4' : 'bg-on-surface-variant/20'}`}></div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Category Icons - Horizontal Scroll */}
      <section className="bg-white py-4 px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <div className="flex flex-col items-center gap-2 min-w-[70px]">
                <div className="w-14 h-14 rounded-2xl bg-surface-variant/30 flex items-center justify-center border border-outline-variant transition-all hover:border-primary/30 active:scale-90">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-2xl">{cat.emoji}</span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-on-surface text-center line-clamp-1">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary/5 text-primary font-bold text-[11px] active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          View More Categories
        </button>
      </section>

      {/* Top Grocery Stores */}
      <section className="bg-white py-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="font-h2 text-on-surface">Top Grocery Stores</h2>
          <span className="text-on-surface-variant/60 font-bold text-xs">View all</span>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {["Walmart", "Carrefour", "Lulu", "Nesto", "VIVA", "Al Maya"].map((store) => (
            <div key={store} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-3">
                 <img src={`https://www.google.com/s2/favicons?sz=64&domain=${store.toLowerCase()}.com`} alt={store} className="w-full h-full object-contain opacity-70" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant">{store}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categorized Product Sections - 2 Column Grid */}
      <div className="space-y-10 pb-20">
        {categories.slice(0, 5).map((cat) => {
          const catProducts = products.filter(p => p.categorySlug === cat.slug).slice(0, 4);
          if (catProducts.length === 0) return null;
          
          return (
            <section key={cat.slug}>
              <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="font-h2 text-on-surface">Top {cat.name} 2025</h2>
                <Link href={`/category/${cat.slug}`}>
                  <span className="text-on-surface-variant/60 font-bold text-xs">View all</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-3 px-4">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="pb-20"></div>
    </Layout>
  );
}
