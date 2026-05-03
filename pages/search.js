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
      <div className="mt-10 mb-8">
        <h1 className="font-serif font-black text-4xl text-[#2D004C] mb-2">Search Results</h1>
        {searchTerm && (
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Showing results for "{searchTerm}"</p>
        )}
      </div>

      <div className="relative mb-12 max-w-2xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400" data-icon="search">search</span>
        <input 
          className="w-full bg-white border-2 border-[#E5B80B] px-12 py-4 rounded-2xl focus:ring-4 focus:ring-[#E5B80B]/10 text-lg font-bold text-[#2D004C] transition-all shadow-sm outline-none placeholder:text-gray-300" 
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
            <div className="grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100 shadow-sm">
              <span className="text-7xl drop-shadow-sm">🔍</span>
              <div className="space-y-2 px-6">
                <h3 className="text-2xl font-serif font-black text-[#2D004C]">No results found for "{searchTerm}"</h3>
                <p className="text-gray-400 font-bold text-sm max-w-xs">We couldn't find anything matching your search. Try different keywords or browse categories.</p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="bg-[#2D004C] text-[#E5B80B] px-10 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
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
