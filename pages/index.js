import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { getCategories, getAllProducts } from "@/lib/products";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getAllProducts()
        ]);
        setCategories(cats);
        // On homepage, we might want to group products by category or just show some featured ones
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      {/* Category Hero / Billboard */}
      <section className="mt-6 mb-4">
        <div className="bg-gradient-to-r from-primary to-violet-400 rounded-2xl p-6 lg:p-8 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[48px] leading-none mb-3">🛒</div>
            <h1 className="font-h1 text-white mb-1">Welcome to Alfajr Super Mart</h1>
            <p className="text-white/80 font-body-md">Quality groceries delivered fast to your doorstep.</p>
          </div>
          <div className="absolute right-0 top-0 h-full opacity-20 flex items-center">
            <span className="material-symbols-outlined text-[180px] -rotate-12 translate-x-12">shopping_bag</span>
          </div>
        </div>
      </section>

      {/* Category Pills (Horizontal Scroll) */}
      <nav className="sticky top-[60px] bg-surface-container-lowest z-40 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button className="whitespace-nowrap px-4 py-2 rounded-full border border-primary bg-primary-fixed text-on-primary-fixed-variant font-bold text-body-sm">
          All
        </button>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <button className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant bg-white text-on-surface-variant font-medium text-body-sm hover:bg-surface-container transition-colors">
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
