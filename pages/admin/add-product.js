import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { getCategories, addProduct } from "@/lib/products";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    unit: "",
    inStock: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0].name }));
      }
      setFetchingCats(false);
    }
    fetchCats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const selectedCat = categories.find(c => c.name === formData.category);

      await addProduct({
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        imageUrl,
        categorySlug: selectedCat?.slug || ""
      });

      alert("Product added successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout activePage="add-product">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Upload */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-[100px]">
              <h3 className="font-h3 mb-4">Product Image</h3>
              <div 
                className="aspect-square bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-surface-container transition-all relative overflow-hidden"
                onClick={() => document.getElementById('image-upload').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-outline mb-2">add_a_photo</span>
                    <p className="text-[12px] font-bold text-outline uppercase">Click to upload</p>
                  </>
                )}
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-[11px] text-outline mt-3 leading-relaxed">
                Tip: Use high quality JPG/PNG images with a white background for best results.
              </p>
            </div>
          </div>

          {/* Form Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-h3 mb-6">Product Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Product Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. MTR Chilli Powder"
                    className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Category</label>
                    <select 
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      {categories.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Unit / Size</label>
                    <input 
                      type="text" 
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="e.g. 500g, 1kg, 1 unit"
                      className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">Selling Price (₹)</label>
                    <input 
                      type="number" 
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-bold text-outline uppercase mb-1.5 ml-1">MRP / Old Price (₹)</label>
                    <input 
                      type="number" 
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-3.5 text-body-md focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-100 text-primary focus:ring-primary"
                    />
                    <span className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">Product is currently in stock</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-8 py-4 rounded-2xl font-bold text-outline bg-white border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
              >
                DISCARD
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    SAVE PRODUCT
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
