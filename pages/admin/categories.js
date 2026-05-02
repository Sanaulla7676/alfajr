import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getCategories, updateCategory } from "@/lib/products";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleRename = (id, newName) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    setCategories(newCategories);
  };

  const moveDown = (index) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index + 1], newCategories[index]] = [newCategories[index], newCategories[index + 1]];
    setCategories(newCategories);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const promises = categories.map((cat, index) => 
        updateCategory(cat.id, { name: cat.name, order: index })
      );
      await Promise.all(promises);
      alert("Categories updated successfully!");
    } catch (error) {
      console.error("Error saving categories:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout activePage="settings"><div>Loading categories...</div></AdminLayout>;
  }

  return (
    <AdminLayout activePage="settings">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-on-surface">Manage Categories</h1>
            <p className="text-outline text-body-sm">Rename and reorder categories for your store.</p>
          </div>
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined">save</span>}
            SAVE CHANGES
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {categories.map((cat, index) => (
              <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="text-outline hover:text-primary disabled:opacity-20">
                      <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
                    </button>
                    <button onClick={() => moveDown(index)} disabled={index === categories.length - 1} className="text-outline hover:text-primary disabled:opacity-20">
                      <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 overflow-hidden">
                     {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : cat.emoji}
                  </div>
                  <input 
                    type="text" 
                    value={cat.name}
                    onChange={(e) => handleRename(cat.id, e.target.value)}
                    className="flex-1 bg-transparent font-bold text-on-surface text-lg border-none focus:ring-0 outline-none p-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-outline uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded-md">Order: {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
