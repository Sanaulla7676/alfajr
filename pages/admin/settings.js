import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getSettings, updateSettings } from "@/lib/products";
import { useRouter } from "next/router";

export default function AdminSettings() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: "",
    whatsappNumber: "",
    adminEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await getSettings();
        if (settings) {
          setFormData(settings);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSettings(formData);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Failed to update settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <AdminLayout activePage="settings"><div>Loading settings...</div></AdminLayout>;

  return (
    <AdminLayout activePage="settings">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-h3 mb-6">Store Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Store Name</label>
              <input 
                type="text" 
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">WhatsApp Number (Orders)</label>
              <input 
                type="text" 
                name="whatsappNumber"
                required
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="+91..."
                className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <p className="text-[11px] text-outline mt-1.5 ml-1">Include country code without spaces or dashes.</p>
            </div>

            <div>
              <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Admin Contact Email</label>
              <input 
                type="email" 
                name="adminEmail"
                required
                value={formData.adminEmail}
                onChange={handleInputChange}
                className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  UPDATE SETTINGS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
