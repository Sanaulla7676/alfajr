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
      {/* Category Hero - Clean Light Style */}
      <section className="mt-4 px-4">
        <div className="bg-surface-variant/30 rounded-[32px] p-6 flex items-center justify-between overflow-hidden relative border border-outline-variant">
          <div className="relative z-10">
            <h1 className="text-3xl font-h1 text-on-surface mb-1">{currentCategory?.name}</h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               <p className="text-on-surface-variant font-bold text-[11px] uppercase tracking-widest">{products.length} Products Found</p>
            </div>
          </div>
          <div className="text-[64px] opacity-20 -rotate-12 translate-x-4">
            {currentCategory?.emoji || "🛒"}
          </div>
        </div>
      </section>

      {/* Filter Bar - Clean & Sticky */}
      <nav className="sticky top-[72px] bg-white z-40 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 border-b border-gray-50 mb-6">
        {["All", "In Stock", "Under ₹50", "Under ₹100"].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold text-[11px] border transition-all ${
              filter === f ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface-variant/50 text-on-surface-variant border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <select 
            className="bg-surface-variant/50 border-none rounded-2xl px-4 py-2.5 font-bold text-[11px] text-on-surface outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Sort By</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Name: A-Z</option>
          </select>
        </div>
      </nav>

      <div className="px-4 pb-24">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-6xl">🔍</span>
            <div className="space-y-1">
              <h3 className="text-xl font-h2 text-on-surface">No products found</h3>
              <p className="text-on-surface-variant/60 font-bold text-xs">Try changing your filters or browse other categories.</p>
            </div>
            <button 
              onClick={() => setFilter("All")}
              className="bg-primary text-white px-8 py-3 rounded-full font-black text-xs uppercase shadow-xl active:scale-95 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
