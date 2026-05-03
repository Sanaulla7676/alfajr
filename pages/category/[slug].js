import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProductsByCategory } from "@/lib/products";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // All, In Stock, Under ₹50, Under ₹100
  const [sort, setSort] = useState("Relevance");

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProductsByCategory(slug)
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const currentCategory = categories.find(c => c.slug === slug);

  // Filter products
  const filteredProducts = products.filter(p => {
    if (filter === "In Stock") return p.inStock;
    if (filter === "Under ₹50") return p.price < 50;
    if (filter === "Under ₹100") return p.price < 100;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    if (sort === "Name: A-Z") return a.name.localeCompare(b.name);
    return 0; // Default: Relevance (Firestore order)
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm text-outline font-medium">Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout categories={categories}>
      {/* Category Hero */}
      <section className="mt-6 mb-4">
        <div className="bg-[#2D004C] border-2 border-[#E5B80B] rounded-[28px] p-6 lg:p-10 flex items-center justify-between overflow-hidden relative shadow-lg">
          <div className="relative z-10">
            <div className="text-[54px] leading-none mb-4 drop-shadow-md">{currentCategory?.emoji || "🛒"}</div>
            <h1 className="text-3xl lg:text-4xl font-serif font-black text-white mb-2">{currentCategory?.name}</h1>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#E5B80B] animate-pulse"></span>
               <p className="text-[#E5B80B] font-black text-xs uppercase tracking-widest">{products.length} products</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full opacity-10 flex items-center">
            <span className="material-symbols-outlined text-[200px] -rotate-12 translate-x-12 text-white">shopping_bag</span>
          </div>
        </div>
      </section>

      {/* Filter Bar (Sticky) */}
      <nav className="sticky top-[164px] bg-[#FDFCFE] z-40 py-4 flex items-center justify-between gap-4 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-1">
          {["All", "In Stock", "Under ₹50", "Under ₹100"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-5 py-2 rounded-full border-2 font-black text-[11px] uppercase tracking-wider transition-all ${
                filter === f ? 'border-[#E5B80B] bg-[#2D004C] text-[#E5B80B] shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:border-[#E5B80B]/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select 
            className="flex items-center gap-1 border-2 border-gray-100 rounded-xl px-4 py-2 bg-white font-black text-[11px] uppercase tracking-wider text-[#2D004C] focus:border-[#E5B80B] outline-none shadow-sm transition-all"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Name: A-Z</option>
          </select>
        </div>
      </nav>

      <div className="flex gap-8 mt-4 pb-20">
        {/* Left Sidebar Categories */}
        <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[240px] h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide pr-4">
          <h3 className="font-serif font-black text-xl text-[#2D004C] mb-6 px-2">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group border-2 ${
                  cat.slug === slug ? 'bg-[#2D004C] text-[#E5B80B] border-[#E5B80B] shadow-md font-black' : 'hover:bg-white hover:border-[#E5B80B]/20 border-transparent text-gray-500 font-bold'
                }`}>
                  <span className="text-xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <span className="text-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100 shadow-sm">
              <span className="text-7xl drop-shadow-sm">🔍</span>
              <div className="space-y-2 px-6">
                <h3 className="text-2xl font-serif font-black text-[#2D004C]">No products found</h3>
                <p className="text-gray-400 font-bold text-sm">Try changing your filters or browse other categories.</p>
              </div>
              <button 
                onClick={() => setFilter("All")}
                className="bg-[#2D004C] text-[#E5B80B] px-10 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
