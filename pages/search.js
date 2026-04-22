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
      <div className="mt-8 mb-4">
        <h1 className="font-h1 text-on-surface">Search Results</h1>
        {searchTerm && (
          <p className="text-outline font-body-md">Showing results for "{searchTerm}"</p>
        )}
      </div>

      <div className="relative mb-8 max-w-2xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline" data-icon="search">search</span>
        <input 
          className="w-full bg-white border border-outline-variant px-10 py-3 rounded-xl focus:ring-2 focus:ring-primary-container text-body-lg transition-all shadow-sm" 
          placeholder="What are you looking for?" 
          type="text"
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm text-outline font-medium">Searching...</p>
        </div>
      ) : (
        <div className="pb-20">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-dashed border-outline-variant">
              <span className="text-6xl">🔍</span>
              <h3 className="font-h2 text-on-surface">No products found for "{searchTerm}"</h3>
              <p className="text-outline max-w-xs">We couldn't find anything matching your search. Try different keywords or browse categories.</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 active:scale-95 transition-all mt-4"
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
