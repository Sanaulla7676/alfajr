import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getAllProducts, getCategories } from "@/lib/products";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    categories: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, categories] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);

        setStats({
          totalProducts: products.length,
          inStock: products.filter(p => p.inStock).length,
          outOfStock: products.filter(p => !p.inStock).length,
          categories: categories.length
        });

        setRecentProducts(products.slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <AdminLayout activePage="dashboard"><div className="animate-pulse">Loading stats...</div></AdminLayout>;
  }

  return (
    <AdminLayout activePage="dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Products", value: stats.totalProducts, color: "text-blue-600", bg: "bg-blue-50", icon: "inbox" },
          { label: "In Stock", value: stats.inStock, color: "text-green-600", bg: "bg-green-50", icon: "check_circle" },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600", bg: "bg-red-50", icon: "error" },
          { label: "Categories", value: stats.categories, color: "text-orange-600", bg: "bg-orange-50", icon: "category" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-2">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase leading-none mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-on-surface">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <h3 className="font-h2">Recently Added Products</h3>
              <Link href="/admin/products">
                <span className="text-primary font-bold text-body-sm hover:underline cursor-pointer">View All</span>
              </Link>
            </div>
            
            <div className="divide-y divide-gray-50">
              {recentProducts.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between group active:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center">
                      {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-gray-400 capitalize">{p.name.charAt(0)}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface line-clamp-1 leading-tight">{p.name}</span>
                      <span className="text-[10px] text-outline font-medium">{p.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-on-surface">₹{p.price}</span>
                    <span className={`text-[9px] font-black uppercase ${p.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Store Settings */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="font-h2 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/add-product">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-violet-50/50 group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    <span className="font-bold text-on-surface text-body-md">Add New Product</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </Link>
              <Link href="/admin/products">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-violet-50/50 group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-violet-500 text-[24px]">list_alt</span>
                    <span className="font-bold text-on-surface text-body-md">Manage Products</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </Link>
              <Link href="/admin/settings">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/50 group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-400 text-[24px]">gallery_thumbnail</span>
                    <span className="font-bold text-on-surface text-body-md">Manage Hero Banners</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-primary text-white p-6 rounded-[24px] shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-h2 mb-1">Store Settings</h4>
              <p className="text-white/70 text-[11px] font-medium mb-5 leading-relaxed">Manage your store details, WhatsApp number and contact info.</p>
              <Link href="/admin/settings">
                <button className="bg-white text-primary px-5 py-2 rounded-xl font-black text-body-sm active:scale-95 transition-all">
                  Edit Settings
                </button>
              </Link>
            </div>
            <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[100px] opacity-10">settings</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
  );
}
