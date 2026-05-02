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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Products", value: stats.totalProducts, color: "bg-blue-500", icon: "inventory_2" },
          { label: "In Stock", value: stats.inStock, color: "bg-green-500", icon: "check_circle" },
          { label: "Out of Stock", value: stats.outOfStock, color: "bg-red-500", icon: "error" },
          { label: "Categories", value: stats.categories, color: "bg-amber-500", icon: "category" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-2xl text-white`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-body-sm font-bold text-outline uppercase">{stat.label}</p>
              <h3 className="text-2xl font-black text-on-surface">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-h3 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/add-product">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">add_circle</span>
                    <span className="font-bold text-on-surface">Add New Product</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </Link>
              <Link href="/admin/products">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-violet-500">list_alt</span>
                    <span className="font-bold text-on-surface">Manage Products</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </Link>
              <Link href="/admin/settings">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500">gallery_thumbnail</span>
                    <span className="font-bold text-on-surface">Manage Hero Banners</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-h3 mb-2">Store Settings</h4>
              <p className="text-white/80 text-body-sm mb-6">Manage your store details, WhatsApp number and contact info.</p>
              <button onClick={() => router.push('/admin/settings')} className="bg-white text-primary px-6 py-2 rounded-xl font-bold text-body-sm">
                Edit Settings
              </button>
            </div>
            <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[100px] opacity-10">settings</span>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-h3">Recently Added Products</h3>
              <Link href="/admin/products">
                <span className="text-primary font-bold text-body-sm hover:underline cursor-pointer">View All</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-lowest">
                    <th className="px-6 py-4 text-left text-label-caps text-outline">Product</th>
                    <th className="px-6 py-4 text-left text-label-caps text-outline">Category</th>
                    <th className="px-6 py-4 text-left text-label-caps text-outline">Price</th>
                    <th className="px-6 py-4 text-left text-label-caps text-outline">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">{p.name.charAt(0)}</div>}
                          </div>
                          <span className="font-bold text-on-surface line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-sm font-medium text-outline">{p.category}</td>
                      <td className="px-6 py-4 font-bold text-on-surface">₹{p.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
