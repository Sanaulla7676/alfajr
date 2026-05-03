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
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-violet-50/50 border border-violet-100 rounded-[18px] px-11 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none font-medium"
          />
        </div>
        <button className="w-12 h-12 flex items-center justify-center bg-violet-50/50 border border-violet-100 rounded-[18px] text-primary active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[24px]">filter_list</span>
        </button>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 gap-3 pb-24">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-gray-400 capitalize">{p.name.charAt(0)}</span>}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-on-surface leading-tight text-body-lg">{p.name}</h3>
                  <span className="text-[10px] text-outline font-medium mb-1">#{p.id.slice(0, 8)}</span>
                  <div className="inline-flex">
                    <span className="text-[10px] font-bold text-violet-600 px-2.5 py-1 bg-violet-50 rounded-full">{p.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => handleToggleStock(p.id, p.inStock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.inStock ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${p.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/edit-product/${p.id}`}>
                    <button className="p-2 text-violet-600 active:scale-90 transition-all">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-red-500 active:scale-90 transition-all">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-1 border-t border-gray-50 mt-1">
              {editingPrice?.id === p.id ? (
                <div className="flex items-center gap-1">
                  <span className="font-black text-xl text-primary">₹</span>
                  <input 
                    type="number"
                    autoFocus
                    className="w-24 border-b-2 border-primary outline-none font-black text-xl text-primary bg-transparent"
                    value={editingPrice.value}
                    onChange={(e) => setEditingPrice({ ...editingPrice, value: e.target.value })}
                    onBlur={() => handlePriceUpdate(p.id, editingPrice.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePriceUpdate(p.id, editingPrice.value)}
                  />
                </div>
              ) : (
                <div 
                  className="flex items-baseline gap-2 cursor-pointer group"
                  onClick={() => setEditingPrice({ id: p.id, value: p.price })}
                >
                  <span className="font-black text-on-surface text-xl">₹{p.price}</span>
                  <span className="text-[11px] text-outline font-bold uppercase tracking-wide">Unit {p.unit || "-"}</span>
                  <span className="material-symbols-outlined text-[14px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
            <p className="text-outline font-bold">No products found.</p>
            <button onClick={() => {setSearchTerm(""); setSelectedCategory("All")}} className="text-primary font-bold">Clear filters</button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/admin/add-product">
        <button className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 z-[70] active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </Link>
    </AdminLayout>
  );
}
