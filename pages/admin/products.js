import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getAllProducts, getCategories, updateProduct, deleteProduct, toggleStock } from "@/lib/products";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingPrice, setEditingPrice] = useState(null); // { id, value }

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, cats] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToggleStock = async (id, currentStatus) => {
    try {
      await toggleStock(id, !currentStatus);
      setProducts(products.map(p => p.id === id ? { ...p, inStock: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update stock status.");
    }
  };

  const handlePriceUpdate = async (id, newPrice) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price)) return;
      await updateProduct(id, { price });
      setProducts(products.map(p => p.id === id ? { ...p, price } : p));
      setEditingPrice(null);
    } catch (err) {
      alert("Failed to update price.");
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <AdminLayout activePage="products"><div>Loading products...</div></AdminLayout>;
  }

  return (
    <AdminLayout activePage="products">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
          <input 
            type="text" 
            placeholder="Search product name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-2xl px-12 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:w-64 bg-surface-container-low border-none rounded-2xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
          <Link href="/admin/add-product">
            <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all shrink-0">
              <span className="material-symbols-outlined">add</span>
              ADD PRODUCT
            </button>
          </Link>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white lg:rounded-3xl lg:shadow-sm lg:border lg:border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-gray-50">
                <th className="px-6 py-4 text-left text-label-caps text-outline">Product</th>
                <th className="px-6 py-4 text-left text-label-caps text-outline">Category</th>
                <th className="px-6 py-4 text-left text-label-caps text-outline">Price</th>
                <th className="px-6 py-4 text-left text-label-caps text-outline">Unit</th>
                <th className="px-6 py-4 text-center text-label-caps text-outline">Stock</th>
                <th className="px-6 py-4 text-right text-label-caps text-outline">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center">
                        {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-gray-400 capitalize">{p.name.charAt(0)}</span>}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-outline font-medium">#{p.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-body-sm font-semibold text-outline px-3 py-1 bg-surface-container-low rounded-lg">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingPrice?.id === p.id ? (
                      <input 
                        type="number"
                        autoFocus
                        className="w-20 border-b-2 border-primary outline-none font-bold text-primary bg-transparent"
                        value={editingPrice.value}
                        onChange={(e) => setEditingPrice({ ...editingPrice, value: e.target.value })}
                        onBlur={() => handlePriceUpdate(p.id, editingPrice.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePriceUpdate(p.id, editingPrice.value)}
                      />
                    ) : (
                      <div 
                        className="font-black text-on-surface cursor-pointer hover:text-primary transition-colors flex items-center gap-1 group"
                        onClick={() => setEditingPrice({ id: p.id, value: p.price })}
                      >
                        ₹{p.price}
                        <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100">edit</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-body-sm font-medium text-outline">{p.unit || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleStock(p.id, p.inStock)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.inStock ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/edit-product/${p.id}`}>
                        <button className="p-2 hover:bg-violet-50 text-violet-600 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
           {filteredProducts.map((p) => (
             <div key={p.id} className="p-4 flex flex-col gap-4">
               <div className="flex items-start justify-between gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center">
                     {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-gray-400 capitalize">{p.name.charAt(0)}</span>}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-bold text-on-surface line-clamp-2 leading-tight">{p.name}</span>
                     <span className="text-[10px] text-outline font-medium">{p.category}</span>
                   </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    {editingPrice?.id === p.id ? (
                      <input 
                        type="number"
                        autoFocus
                        className="w-16 text-right border-b-2 border-primary outline-none font-black text-primary bg-transparent"
                        value={editingPrice.value}
                        onChange={(e) => setEditingPrice({ ...editingPrice, value: e.target.value })}
                        onBlur={() => handlePriceUpdate(p.id, editingPrice.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePriceUpdate(p.id, editingPrice.value)}
                      />
                    ) : (
                      <span 
                        className="font-black text-on-surface text-lg"
                        onClick={() => setEditingPrice({ id: p.id, value: p.price })}
                      >
                        ₹{p.price}
                      </span>
                    )}
                    <span className="text-[10px] text-outline font-bold uppercase">{p.unit || "Unit"}</span>
                 </div>
               </div>

               <div className="flex items-center justify-between bg-surface-container-lowest p-3 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase ${p.inStock ? 'text-green-600' : 'text-gray-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button 
                      onClick={() => handleToggleStock(p.id, p.inStock)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${p.inStock ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${p.inStock ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/edit-product/${p.id}`}>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-bold uppercase">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Del
                    </button>
                  </div>
               </div>
             </div>
           ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
            <p className="text-outline font-bold">No products match your search or filter.</p>
            <button onClick={() => {setSearchTerm(""); setSelectedCategory("All")}} className="text-primary font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
