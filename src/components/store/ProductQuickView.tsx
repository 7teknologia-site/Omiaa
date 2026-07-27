import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ProductQuickView: React.FC = () => {
  const {
    products,
    quickViewProductId,
    setQuickViewProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductId,
    setViewMode
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage'>('desc');

  if (!quickViewProductId) return null;

  const product = products.find((p) => p.id === quickViewProductId);
  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleClose = () => {
    setQuickViewProductId(null);
    setQuantity(1);
  };

  const handleGoToDetail = () => {
    setSelectedProductId(product.id);
    setViewMode('product-detail');
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#0F1E16]/75 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 border border-[#C5A059]/50 my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-auto bg-[#F4EFE6] overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="bg-[#14281D]/90 text-[#FAF7F2] text-[10px] font-semibold px-3 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md shadow-xs uppercase tracking-wider font-sans"
                  >
                    <Sparkles className="w-2.5 h-2.5 inline mr-1 text-[#C5A059]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#8C7A5B] mb-2 font-sans">
                  <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E2D9C8]">{product.volumeOrWeight}</span>
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    <span className="font-bold text-[#14281D]">{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount} avaliações)</span>
                  </div>
                </div>

                <h2 className="font-serif text-3xl font-bold text-[#14281D] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs font-medium text-[#718096] mt-1 mb-4 font-sans">
                  {product.subtitle}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2D9C8]">
                  <span className="text-2xl font-serif font-bold text-[#14281D]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-sans">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-[#14281D] font-bold bg-[#E2D9C8] px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                    Em estoque: {product.stock} un.
                  </span>
                </div>

                {/* Tabs */}
                <div className="space-y-3 mb-6 font-sans">
                  <div className="flex border-b border-[#E2D9C8] text-xs font-bold uppercase tracking-wider">
                    <button
                      onClick={() => setActiveTab('desc')}
                      className={`pb-2 pr-4 transition-colors ${
                        activeTab === 'desc' ? 'border-b-2 border-[#C5A059] text-[#14281D]' : 'text-gray-400'
                      }`}
                    >
                      Propriedades
                    </button>
                    <button
                      onClick={() => setActiveTab('ingredients')}
                      className={`pb-2 px-4 transition-colors ${
                        activeTab === 'ingredients' ? 'border-b-2 border-[#C5A059] text-[#14281D]' : 'text-gray-400'
                      }`}
                    >
                      Ingredientes
                    </button>
                    <button
                      onClick={() => setActiveTab('usage')}
                      className={`pb-2 px-4 transition-colors ${
                        activeTab === 'usage' ? 'border-b-2 border-[#C5A059] text-[#14281D]' : 'text-gray-400'
                      }`}
                    >
                      Ritual de Uso
                    </button>
                  </div>

                  <div className="text-xs text-[#4A5568] leading-relaxed min-h-[80px]">
                    {activeTab === 'desc' && <p>{product.shortDescription}</p>}
                    {activeTab === 'ingredients' && (
                      <ul className="space-y-1 list-disc pl-4">
                        {product.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'usage' && <p>{product.usageInstructions}</p>}
                  </div>
                </div>

              </div>

              {/* Quantity & CTA */}
              <div className="space-y-3 pt-4 border-t border-[#E2D9C8] font-sans">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E2D9C8] rounded-full bg-[#FAF7F2] p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#14281D] hover:bg-[#E2D9C8] transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#14281D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#14281D] hover:bg-[#E2D9C8] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      handleClose();
                    }}
                    className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    <span>Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-full border transition-all ${
                      wishlisted
                        ? 'bg-[#B85B3A] text-white border-[#B85B3A]'
                        : 'border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleGoToDetail}
                  className="w-full text-center text-xs font-semibold text-[#8C7A5B] hover:text-[#14281D] underline pt-1"
                >
                  Ver Página Detalhada do Produto Alquímico →
                </button>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};

