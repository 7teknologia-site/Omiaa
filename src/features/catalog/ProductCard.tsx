import React, { useState, memo } from 'react';
import { Star, Eye, Heart, ShoppingBag, Copy, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import { ProductBadge } from '../../components/ui/ProductBadge';
import { getOptimizedImageUrl, getImageSrcSet } from '../../utils/imageOptimizer';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const {
    setSelectedProductId,
    setQuickViewProductId,
    setViewMode,
    addToCart,
    toggleWishlist,
    isWishlisted,
    showToast
  } = useShop();

  const [copiedSku, setCopiedSku] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleCopySku = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sku) {
      navigator.clipboard.writeText(product.sku);
      setCopiedSku(true);
      showToast('SKU Copiado', `SKU ${product.sku} copiado para a área de transferência.`, 'info');
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  const optimizedImgUrl = getOptimizedImageUrl(product.images[0], 600, 80);
  const srcSetVal = getImageSrcSet(product.images[0], 80);

  return (
    <div className={`group luxury-card animate-card-fade-in bg-[#FDFBF7] rounded-3xl border overflow-hidden shadow-xs flex flex-col font-sans relative transition-all duration-300 ${
      isOutOfStock ? 'border-[#E2D9C8] bg-gray-50/50 opacity-90' : 'border-[#E2D9C8] hover:border-[#C5A059]'
    }`}>
      
      {/* Product Image & Badges Container */}
      <div
        className="relative aspect-4/5 bg-[#FAF7F2] overflow-hidden cursor-pointer"
        onClick={() => {
          setSelectedProductId(product.id);
          setViewMode('product-detail');
        }}
      >
        <img
          src={optimizedImgUrl}
          srcSet={srcSetVal || undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isOutOfStock ? 'grayscale-25 group-hover:scale-102' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 max-w-[80%]">
          {isOutOfStock ? (
            <ProductBadge badge="Esgotado" />
          ) : (
            <>
              {product.stock <= 3 && <ProductBadge badge={`Apenas ${product.stock} un.`} />}
              {product.featured && <ProductBadge badge="Mais Vendido" />}
              {product.badges && product.badges.map((badge, idx) => (
                <ProductBadge key={idx} badge={badge} discountPercent={discountPercent} />
              ))}
            </>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xs hover:scale-110 active:scale-95 ${
              wishlisted
                ? 'bg-rose-700 text-white'
                : 'bg-[#FDFBF7]/90 text-[#14281D] hover:bg-[#14281D] hover:text-[#C5A059]'
            }`}
            title={wishlisted ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current text-white' : 'fill-none'}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProductId(product.id);
            }}
            className="p-2.5 rounded-full bg-[#FDFBF7]/90 text-[#14281D] hover:bg-[#14281D] hover:text-[#C5A059] hover:scale-110 active:scale-95 backdrop-blur-md transition-all duration-300 shadow-sm"
            title="Espiar Ritual"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#8C7A5B] font-semibold">
            <span className="uppercase tracking-widest bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E2D9C8]">{product.volumeOrWeight}</span>
            <div className="flex items-center gap-1 text-[#C5A059]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-[#8C7A5B]/70">({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => {
              setSelectedProductId(product.id);
              setViewMode('product-detail');
            }}
            className="font-serif text-xl font-bold text-[#14281D] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1 tracking-tight"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#5A6B5D] font-light tracking-wide line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* SKU & Stock Row */}
          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#8C7A5B]">
            <button
              onClick={handleCopySku}
              className="inline-flex items-center gap-1 text-[#8C7A5B] hover:text-[#14281D] transition-colors"
              title="Clique para copiar o SKU"
            >
              <span>SKU: {product.sku}</span>
              {copiedSku ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#8C7A5B]/60" />}
            </button>

            {isOutOfStock ? (
              <span className="text-rose-800 font-sans font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Esgotado
              </span>
            ) : product.stock <= 3 ? (
              <span className="text-amber-800 font-sans font-bold animate-pulse">
                Restam {product.stock} un.
              </span>
            ) : (
              <span className="text-emerald-800 font-sans font-bold">
                Em estoque ({product.stock})
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-4 border-t border-[#E2D9C8] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-[#14281D]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#8C7A5B]/70 line-through font-normal">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
              3x de {formatCurrency(product.price / 3)} sem juros
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => {
              if (isOutOfStock) {
                showToast('Produto Indisponível', 'Este item está indisponível no momento.', 'alert');
              } else {
                addToCart(product, 1);
              }
            }}
            className={`p-3.5 rounded-2xl transition-all duration-300 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                : 'bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D]'
            }`}
            title={isOutOfStock ? 'Produto Esgotado' : 'Adicionar à Sacola'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
});

