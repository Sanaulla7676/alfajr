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
        <div className="bg-gradient-to-r from-primary to-violet-400 rounded-2xl p-6 lg:p-8 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[48px] leading-none mb-3">{currentCategory?.emoji || "🛒"}</div>
            <h1 className="font-h1 text-white mb-1">{currentCategory?.name}</h1>
            <p className="text-white/80 font-body-md">{products.length} products available</p>
          </div>
          <div className="absolute right-0 top-0 h-full opacity-20 flex items-center">
            <span className="material-symbols-outlined text-[180px] -rotate-12 translate-x-12">eco</span>
          </div>
        </div>
      </section>

      {/* Filter Bar (Sticky) */}
      <nav className="sticky top-[60px] bg-surface-container-lowest z-40 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {["All", "In Stock", "Under ₹50", "Under ₹100"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full border font-bold text-body-sm transition-colors ${
                filter === f ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant' : 'border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-body-sm text-outline hidden md:block">Sort by:</span>
          <select 
            className="flex items-center gap-1 border border-outline-variant rounded-lg px-3 py-2 bg-white font-semibold text-body-sm focus:outline-none"
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
        <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[136px] h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide pr-2">
          <h3 className="font-h3 text-on-surface mb-4">All Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                  cat.slug === slug ? 'bg-primary-fixed text-primary font-bold border-r-4 border-primary' : 'hover:bg-surface-container text-on-surface-variant font-medium'
                }`}>
                  <span className="text-lg group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <span className="text-body-md whitespace-nowrap overflow-hidden text-ellipsis">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-6xl">🔍</span>
              <h3 className="font-h2">No products found</h3>
              <p className="text-outline">Try changing your filters or browse other categories.</p>
              <button 
                onClick={() => setFilter("All")}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
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
