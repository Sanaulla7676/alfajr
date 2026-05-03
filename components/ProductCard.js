import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    removeFromCart(product.id);
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className={`bg-white rounded-[24px] p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border-2 transition-all flex flex-col group ${quantity > 0 ? 'border-[#E5B80B]' : 'border-gray-50 hover:border-[#E5B80B]/30'}`}>
      <div className="relative mb-4 aspect-square rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#2D004C] text-[#E5B80B] text-[10px] font-black px-2 py-1 rounded-lg uppercase z-10 shadow-sm">
            {discount}% OFF
          </span>
        )}
        
        {product.imageUrl ? (
          <img 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            src={product.imageUrl} 
            alt={product.name} 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-4xl font-serif">
              {product.name ? product.name.charAt(0) : '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="mb-3">
           <div className="flex items-baseline gap-1 mb-1">
              {product.price > 0 ? (
                <>
                  <span className="text-lg font-black text-[#2D004C]">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </>
              ) : (
                <span className="text-xs font-bold text-[#2D004C] italic">Price on Request</span>
              )}
           </div>
           <h4 className="font-bold text-[#2D004C] text-[13px] line-clamp-2 leading-tight min-h-[32px]">{product.name}</h4>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{product.unit || "1 unit"}</p>
        </div>
        
        <div className="mt-auto">
          {quantity > 0 ? (
            <div className="h-10 flex items-center justify-between bg-[#2D004C] rounded-xl text-white px-1 shadow-md">
              <button onClick={handleRemove} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="font-black text-sm">{quantity}</span>
              <button onClick={handleAdd} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              disabled={product.price <= 0}
              className={`w-full h-10 rounded-xl border-2 font-black text-[11px] uppercase tracking-widest transition-all ${
                product.price > 0 
                ? 'border-[#E5B80B] text-[#2D004C] bg-white hover:bg-[#E5B80B] active:scale-95 shadow-sm' 
                : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
