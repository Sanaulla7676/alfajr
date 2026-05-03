import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const prods = await getAllProducts();
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (q) {
      setSearchTerm(q);
    }
  }, [q]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, products]);

  return (
    <Layout>
      <div className="mt-8 mb-4 px-4">
        <h1 className="text-2xl font-h1 text-on-surface mb-1">Search Results</h1>
        {searchTerm && (
          <p className="text-on-surface-variant/60 font-bold text-[10px] uppercase tracking-widest">Showing results for "{searchTerm}"</p>
        )}
      </div>

      <div className="px-4 mb-10">
        <div className="relative group max-w-2xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/60" data-icon="search">search</span>
          <input 
            className="w-full bg-surface-variant/50 border-none rounded-2xl px-12 py-4 text-body-md font-bold text-on-surface outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" 
            placeholder="What are you looking for?" 
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm text-on-surface-variant/60 font-bold">Searching...</p>
        </div>
      ) : (
        <div className="px-4 pb-24">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-6xl">🔍</span>
              <div className="space-y-1">
                <h3 className="text-xl font-h2 text-on-surface">No results found for "{searchTerm}"</h3>
                <p className="text-on-surface-variant/60 font-bold text-[11px] max-w-xs mx-auto">We couldn't find anything matching your search. Try different keywords or browse categories.</p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="bg-primary text-white px-8 py-3 rounded-full font-black text-xs uppercase shadow-xl active:scale-95 transition-all"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
