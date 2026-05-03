import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getSettings, updateSettings } from "@/lib/products";
import { useRouter } from "next/router";

export default function AdminSettings() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: "",
    whatsappNumber: "",
    adminEmail: "",
    banners: []
  });
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await getSettings();
        if (settings) {
          setFormData({
            ...settings,
            banners: settings.banners || []
          });
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

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingBanner(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: reader.result }),
        });

        if (!response.ok) throw new Error("Upload failed");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          banners: [...(prev.banners || []), data.url]
        }));
      };
    } catch (err) {
      console.error("Error uploading banner:", err);
      alert("Failed to upload banner: " + err.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const removeBanner = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      banners: prev.banners.filter((_, index) => index !== indexToRemove)
    }));
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
      <div className="max-w-2xl mx-auto pb-24">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 space-y-6">
          <h3 className="font-h2 mb-4">Store Configuration</h3>
          
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

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h4 className="font-h4">Hero Section Banners</h4>
            <p className="text-body-sm text-outline">Upload banners to display in the sliding carousel on the homepage.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.banners && formData.banners.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-surface-container-low aspect-[21/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeBanner(idx)}
                    className="absolute top-2 right-2 bg-error text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
              
              <label className="border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center aspect-[21/9] cursor-pointer hover:bg-primary/5 transition-colors group">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="hidden" 
                />
                {uploadingBanner ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-primary/50 group-hover:text-primary transition-colors mb-2">add_photo_alternate</span>
                    <span className="text-body-sm font-bold text-primary">Upload Banner</span>
                    <span className="text-[10px] text-outline mt-1">Aspect ratio ~ 21:9 (e.g. 1200x500)</span>
                  </>
                )}
              </label>
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
