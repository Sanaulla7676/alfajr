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
    <div className={`bg-white rounded-xl p-3 shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border transition-all flex flex-col group ${quantity > 0 ? 'border-primary-container' : 'border-transparent hover:border-primary-container'}`}>
      <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#FF4757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase z-10">
            {discount}% OFF
          </span>
        )}
        
        {product.imageUrl ? (
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            src={product.imageUrl} 
            alt={product.name} 
          />
        ) : (
          <div className="w-full h-full bg-[#e5e7eb] flex items-center justify-center rounded-[8px]">
            <span className="text-[#6b7280] text-[36px] font-bold uppercase">
              {product.name ? product.name.charAt(0) : '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h4 className="font-h3 text-on-surface line-clamp-2 mb-0.5">{product.name}</h4>
        <p className="text-body-sm text-outline mb-3">{product.unit || "1 unit"}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-price-lg text-on-surface">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-price-sm text-outline line-through">₹{product.originalPrice}</span>
            )}
          </div>

          {quantity > 0 ? (
            <div className="h-9 flex items-center bg-[#2ED573] rounded-lg text-white px-1 shadow-sm">
              <button onClick={handleRemove} className="p-1 hover:bg-white/10 rounded">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="px-2 font-bold text-body-md min-w-[20px] text-center">{quantity}</span>
              <button onClick={handleAdd} className="p-1 hover:bg-white/10 rounded">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="h-9 px-4 rounded-lg border border-[#2ED573] text-[#2ED573] font-bold text-body-md bg-white hover:bg-[#2ED573]/5 active:scale-95 transition-all"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
