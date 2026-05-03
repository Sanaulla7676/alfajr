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
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    const whatsappNumber = settings.whatsappNumber || "+919449546882";
    
    let message = `🛒 *New Order — ${settings.storeName || "Alfajr Super Mart"}*\n━━━━━━━━━━━━━━━━\n`;
    message += `🏪 *TYPE: STORE PICKUP*\n━━━━━━━━━━━━━━━━\n`;
    cart.forEach(item => {
      message += `- ${item.name} (${item.unit || "1 unit"}) × ${item.quantity} = ₹${(item.price * item.quantity)}\n`;
    });
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `🧾 *Subtotal: ₹${cartTotal}*\n`;
    message += `💰 *Total: ₹${cartTotal}*\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `👤 *Customer:* ${formData.name}\n`;
    message += `📞 *Phone:* ${formData.phone}\n`;
    if (formData.address) message += `📝 *Note:* ${formData.address}\n`;
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
        <div className="flex flex-col items-center justify-center py-24 gap-8 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-sm mt-8">
          <div className="text-8xl drop-shadow-lg">🎉</div>
          <div className="space-y-3 px-6">
            <h1 className="text-3xl font-serif font-black text-[#2D004C]">Order sent!</h1>
            <p className="text-gray-400 font-bold text-sm max-w-sm">We have received your order details via WhatsApp. Please visit our store for pickup at your convenience.</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#2D004C] text-[#E5B80B] px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
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
        <div className="flex flex-col items-center justify-center py-24 gap-8 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-sm mt-8">
          <div className="text-8xl drop-shadow-lg">🛒</div>
          <div className="space-y-3 px-6">
            <h1 className="text-3xl font-serif font-black text-[#2D004C]">Your cart is empty</h1>
            <p className="text-gray-400 font-bold text-sm">Add some items from our fresh collection to get started!</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#2D004C] text-[#E5B80B] px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Go Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mt-10 mb-6 px-2">
        <h1 className="text-4xl font-serif font-black text-[#2D004C] mb-2">My Cart</h1>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-[#E5B80B]"></span>
           <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{cart.length} unique items</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 pb-24">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
            {cart.map((item, index) => (
              <div key={item.id} className={`p-6 flex items-center gap-5 ${index !== cart.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-20 h-20 bg-gray-50 rounded-[20px] overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-300 font-serif text-2xl">{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#2D004C] leading-tight mb-1">{item.name}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.unit || "1 unit"}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-lg font-black text-[#2D004C]">₹{item.price * item.quantity}</span>
                  <div className="h-10 flex items-center bg-[#2D004C] rounded-xl text-white px-1 shadow-md shrink-0">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg">
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="px-3 font-black text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:w-[420px]">
          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-50 p-8 sticky top-[100px]">
            <div className="flex items-center gap-3 mb-6 bg-[#E5B80B]/10 p-3 rounded-2xl border border-[#E5B80B]/20">
               <span className="material-symbols-outlined text-[#2D004C]">store</span>
               <span className="text-[10px] font-black text-[#2D004C] uppercase tracking-widest">Store Pickup Only</span>
            </div>
            <h3 className="text-2xl font-serif font-black text-[#2D004C] mb-8">Pickup Details</h3>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#E5B80B] rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2D004C] outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#E5B80B] rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2D004C] outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-2">Note (Optional)</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any instructions for store pickup?"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#E5B80B] rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2D004C] outline-none resize-none transition-all"
                ></textarea>
              </div>

              <div className="bg-[#2D004C]/5 rounded-[24px] p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-[#2D004C]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Pickup</span>
                  <span className="text-[#E5B80B] font-black uppercase tracking-widest text-[10px]">Store Pickup</span>
                </div>
                <div className="h-px bg-[#2D004C]/10"></div>
                <div className="flex justify-between items-center">
                  <span className="font-serif font-black text-xl text-[#2D004C]">Total</span>
                  <span className="text-3xl font-black text-[#2D004C] tracking-tight">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#25D366] text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                Order on WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
