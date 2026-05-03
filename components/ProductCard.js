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

  return (
    <div className="card-modern group h-full flex flex-col p-3 transition-all hover:shadow-lg relative">
      {/* Product Image */}
      <div className="relative aspect-square mb-4">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl text-gray-200 text-4xl">
            {product.name ? product.name.charAt(0) : '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="font-price text-on-surface">
              {product.price > 0 ? `₹${product.price}` : "Enquire"}
            </span>
            <h3 className="font-body-md text-on-surface line-clamp-1 mt-0.5">
              {product.name}
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              {product.unit || "Per Pack"}
            </p>
          </div>
          
          <div className="relative">
            {quantity > 0 ? (
              <div className="flex flex-col items-center bg-primary/10 rounded-full py-1">
                <button 
                  onClick={handleRemove}
                  className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-sm border border-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="font-bold text-xs my-1 text-primary">{quantity}</span>
                <button 
                  onClick={handleAdd}
                  className="btn-add"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAdd}
                disabled={product.price <= 0}
                className="btn-add"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
