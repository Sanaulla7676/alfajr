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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all flex flex-col group h-full overflow-hidden ${quantity > 0 ? 'border-[#E5B80B]' : 'hover:border-[#E5B80B]/30'}`}>
      {/* Product Image */}
      <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden group">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#2D004C] text-[#E5B80B] text-[8px] font-black px-1.5 py-0.5 rounded uppercase z-10">
            {discount}% OFF
          </span>
        )}
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif text-3xl">
            {product.name ? product.name.charAt(0) : '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 lg:p-3 flex flex-col flex-1 gap-1">
        <h3 className="text-[10px] lg:text-xs font-bold text-[#2D004C] line-clamp-2 leading-tight min-h-[2.5em]">
          {product.name}
        </h3>
        <p className="text-[9px] text-gray-400 uppercase tracking-wider">{product.unit || "1 unit"}</p>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-1 mb-2">
            {product.price > 0 ? (
              <>
                <span className="text-xs lg:text-sm font-black text-[#2D004C]">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[8px] lg:text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </>
            ) : (
              <span className="text-[9px] font-bold text-[#2D004C] italic">Price on Request</span>
            )}
          </div>
          
          {quantity > 0 ? (
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
