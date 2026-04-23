import { useState } from "react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart, cartTotal, settings } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [isOrdered, setIsOrdered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all delivery details.");
      return;
    }

    const whatsappNumber = settings.whatsappNumber || "+919449546882";
    
    let message = `🛒 *New Order — ${settings.storeName || "Alfajr Super Mart"}*\n━━━━━━━━━━━━━━━━\n`;
    cart.forEach(item => {
      message += `- ${item.name} (${item.unit || "1 unit"}) × ${item.quantity} = ₹${(item.price * item.quantity)}\n`;
    });
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `🧾 *Subtotal: ₹${cartTotal}*\n`;
    message += `🚚 *Delivery: Free*\n`;
    message += `💰 *Total: ₹${cartTotal}*\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `👤 *Name:* ${formData.name}\n`;
    message += `📞 *Phone:* ${formData.phone}\n`;
    message += `📍 *Address:* ${formData.address}\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `_Sent from ${settings.storeName || "Alfajr Super Mart"}_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
          <div className="text-8xl">🎉</div>
          <h1 className="font-h1 text-on-surface">Order sent!</h1>
          <p className="text-outline max-w-sm">We have received your order details via WhatsApp. We will contact you soon for confirmation and delivery.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
          <div className="text-8xl">🛒</div>
          <h1 className="font-h1 text-on-surface">Your cart is empty</h1>
          <p className="text-outline">Add some items from our fresh collection to get started!</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-all"
          >
            Go Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mt-8 mb-4">
        <h1 className="font-h1 text-on-surface">My Cart</h1>
        <p className="text-outline font-body-md">{cart.length} unique items in your cart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-20">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.map((item, index) => (
              <div key={item.id} className={`p-4 flex items-center gap-4 ${index !== cart.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-16 h-16 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#e5e7eb] flex items-center justify-center">
                      <span className="text-[#6b7280] font-bold">{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-h3 text-on-surface leading-tight mb-0.5">{item.name}</h4>
                  <p className="text-body-sm text-outline">{item.unit || "1 unit"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-price-lg">₹{item.price * item.quantity}</span>
                  <div className="h-8 flex items-center bg-[#2ED573] rounded-lg text-white px-1 shadow-sm shrink-0">
                    <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-white/10 rounded">
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="px-2 font-bold text-body-sm min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1 hover:bg-white/10 rounded">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-[100px]">
            <h3 className="font-h3 text-on-surface mb-6">Delivery Details</h3>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-body-sm font-bold text-outline uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>
              <div>
                <label className="block text-body-sm font-bold text-outline uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>
              <div>
                <label className="block text-body-sm font-bold text-outline uppercase mb-1">Full Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter your complete address"
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary-container outline-none resize-none"
                ></textarea>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-body-md">
                  <span className="text-outline">Subtotal</span>
                  <span className="font-bold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-outline">Delivery</span>
                  <span className="text-[#2ED573] font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-h2 text-on-surface">Total</span>
                  <span className="font-h1 text-primary">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                PLACE ORDER ON WHATSAPP
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
