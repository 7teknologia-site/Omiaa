import React, { useState } from 'react';
import { X, Star, ShoppingBag, Eye, Copy, Check, AlertCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import { ProductBadge } from '../../components/ui/ProductBadge';

export const ProductQuickView: React.FC = () => {
  const {
    products,
    quickViewProductId,
    setQuickViewProductId,
    setSelectedProductId,
    setViewMode,
    addToCart,
    showToast
  } = useShop();

  const [copiedSku, setCopiedSku] = useState(false);

  if (!quickViewProductId) return null;

  const product = products.find((p) => p.id === quickViewProductId);
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleCopySku = () => {
    if (product.sku) {
      navigator.clipboard.writeText(product.sku);
      setCopiedSku(true);
      showToast('SKU Copiado', `SKU ${product.sku} copiado!`, 'info');
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#E2D9C8] max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => setQuickViewProductId(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] text-[#14281D] hover:bg-[#14281D] hover:text-[#C5A059] transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          
          <div className="relative aspect-square bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E2D9C8]">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              {isOutOfStock ? (
                <ProductBadge badge="Esgotado" />
              ) : (
                product.badges && product.badges.map((badge, idx) => (
                  <ProductBadge key={idx} badge={badge} discountPercent={discountPercent} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#8C7A5B]">
                <span className="uppercase tracking-wider">{product.volumeOrWeight}</span>
                <button
                  onClick={handleCopySku}
                  className="inline-flex items-center gap-1 font-mono hover:text-[#14281D]"
                >
                  <span>SKU: {product.sku}</span>
                  {copiedSku ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#14281D] mt-1">{product.name}</h3>
              <p className="text-xs text-[#718096] mt-0.5">{product.subtitle}</p>
            </div>

            <div className="flex items-center gap-1 text-[#C5A059] text-xs">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-[#14281D]">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} avaliações)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#14281D]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock status tag */}
            <div className="text-xs font-semibold">
              {isOutOfStock ? (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Produto Esgotado
                </span>
              ) : product.stock <= 3 ? (
                <span className="text-amber-700 animate-pulse">Restam apenas {product.stock} unidades!</span>
              ) : (
                <span className="text-emerald-800">Em estoque ({product.stock} un.)</span>
              )}
            </div>

            <p className="text-xs text-[#4A5568] line-clamp-3 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="space-y-2 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    addToCart(product, 1);
                    setQuickViewProductId(null);
                  }
                }}
                className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : 'bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Esgotado' : 'Adicionar à Sacola'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedProductId(product.id);
                  setQuickViewProductId(null);
                  setViewMode('product-detail');
                }}
                className="w-full border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalhes Completos</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

