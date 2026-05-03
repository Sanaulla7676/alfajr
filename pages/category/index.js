import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getCategories } from "@/lib/products";
import Link from "next/link";

export default function CategoriesIndexPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout categories={categories}>
      <div className="mt-10 mb-8 px-2">
        <h1 className="text-4xl font-serif font-black text-[#2D004C] mb-2">Browse Categories</h1>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-[#E5B80B]"></span>
           <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{categories.length} departments available</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-4 border-[#2D004C] border-t-[#E5B80B] rounded-full animate-spin"></div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <div className="bg-white p-6 rounded-[32px] border-2 border-gray-50 hover:border-[#E5B80B] transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center gap-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                  {category.emoji || "🛒"}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black text-[#2D004C] mb-1 group-hover:text-[#E5B80B] transition-colors">
                    {category.name}
                  </h3>
                  <div className="h-1 w-8 bg-[#E5B80B]/20 rounded-full mx-auto group-hover:w-12 group-hover:bg-[#E5B80B] transition-all"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
