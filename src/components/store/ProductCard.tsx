import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductId,
    setViewMode,
    setQuickViewProductId
  } = useShop();

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group bg-[#FFFFFF] rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-4/5 overflow-hidden bg-[#F4EFE6] cursor-pointer" onClick={() => {
        setSelectedProductId(product.id);
        setViewMode('product-detail');
      }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Secondary image hover effect if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alt`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            loading="lazy"
          />
        )}

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badges?.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#14281D]/90 text-[#FAF7F2] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md shadow-xs uppercase tracking-wider font-sans"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            wishlisted
              ? 'bg-[#B85B3A] text-white'
              : 'bg-white/80 text-[#14281D] hover:bg-white hover:text-[#B85B3A]'
          }`}
          title={wishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProductId(product.id);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#14281D]/90 text-[#FAF7F2] hover:bg-[#14281D] text-xs font-semibold px-4 py-2 rounded-full border border-[#C5A059]/50 flex items-center gap-1.5 shadow-lg backdrop-blur-md whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
          Visualização Rápida
        </button>
      </div>

      {/* Product Content info */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Volume */}
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-[#8C7A5B] mb-2 font-sans">
            <span className="bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2D9C8]">{product.volumeOrWeight}</span>
            <div className="flex items-center gap-1 text-[#C5A059]">
              <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
              <span className="font-bold text-[#14281D]">{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3
            onClick={() => {
              setSelectedProductId(product.id);
              setViewMode('product-detail');
            }}
            className="font-serif text-xl font-bold text-[#14281D] group-hover:text-[#C5A059] transition-colors line-clamp-1 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#5A6578] line-clamp-2 mt-1 mb-3 leading-relaxed font-sans">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#E2D9C8]/60 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-[10px] text-[#718096] uppercase font-semibold tracking-wider font-sans">Investimento</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-serif text-[#14281D]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-sans">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all font-sans ${
              product.stock > 0
                ? 'bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] shadow-xs'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Adicionar' : 'Esgotado'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

