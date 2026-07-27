import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Feather,
  Leaf,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { MOCK_REVIEWS } from '../../data/mockData';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setViewMode,
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useShop();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [subscriptionMode, setSubscriptionMode] = useState<'once' | 'monthly'>('once');

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const wishlisted = isWishlisted(product.id);

  // Reviews for this product or general mock reviews
  const productReviews = MOCK_REVIEWS.filter((r) => r.productId === product.id);

  const unitPrice = subscriptionMode === 'monthly' ? product.price * 0.9 : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => setViewMode('catalog')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
        Voltar para a Apotheca
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-[#F4EFE6] border border-[#E2D9C8] shadow-md">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
                wishlisted
                  ? 'bg-[#B85B3A] text-white'
                  : 'bg-white/80 text-[#14281D] hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#C5A059] scale-105 shadow-md'
                      : 'border-[#E2D9C8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Ancestral Origins Box */}
          <div className="bg-[#14281D] text-[#FAF7F2] p-6.5 rounded-3xl border border-[#C5A059]/40 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] font-sans">
              <Feather className="w-4 h-4" />
              Linhagem & Sabedoria Ancestral
            </div>
            <p className="text-xs text-[#EFE8DC]/85 leading-relaxed font-sans">
              {product.ancestralOrigin}
            </p>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] mb-2 font-sans">
              <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E2D9C8]">{product.category.toUpperCase()}</span>
              <span>•</span>
              <span>{product.volumeOrWeight}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14281D] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6578] font-medium mt-1 leading-relaxed font-sans">
              {product.subtitle}
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3 font-sans">
              <div className="flex items-center text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#14281D]">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewsCount} avaliações verificadas)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#FAF7F2] p-5.5 rounded-3xl border border-[#E2D9C8] space-y-4 font-sans">
            
            {/* Subscription toggle */}
            <div className="space-y-2.5">
              <label
                onClick={() => setSubscriptionMode('once')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  subscriptionMode === 'once'
                    ? 'bg-white border-[#14281D] shadow-xs'
                    : 'bg-transparent border-transparent text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subscriptionMode === 'once' ? 'border-[#14281D] bg-[#14281D]' : 'border-gray-300'}`}>
                    {subscriptionMode === 'once' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs font-bold text-[#14281D]">Compra Única Ritualística</span>
                </div>
                <span className="text-base font-serif font-bold text-[#14281D]">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </label>

              <label
                onClick={() => setSubscriptionMode('monthly')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  subscriptionMode === 'monthly'
                    ? 'bg-white border-[#C5A059] ring-1 ring-[#C5A059] shadow-xs'
                    : 'bg-transparent border-transparent text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subscriptionMode === 'monthly' ? 'border-[#C5A059] bg-[#C5A059]' : 'border-gray-300'}`}>
                    {subscriptionMode === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#14281D] block">Clube da Lua (Assinatura Mensal)</span>
                    <span className="text-[10px] text-[#C5A059] font-bold">Economize 10% em cada renovação</span>
                  </div>
                </div>
                <span className="text-base font-serif font-bold text-[#C5A059]">
                  R$ {(product.price * 0.9).toFixed(2).replace('.', ',')}
                </span>
              </label>
            </div>

            {/* Quantity and Main CTA */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[#E2D9C8] rounded-full bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[#14281D] hover:bg-[#FAF7F2]"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#14281D]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[#14281D] hover:bg-[#FAF7F2]"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                }}
                className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>Adicionar • R$ {(unitPrice * quantity).toFixed(2).replace('.', ',')}</span>
              </button>
            </div>

          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#4A5568] font-sans">
            <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-[#E2D9C8]">
              <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Envio em até 24h</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-[#E2D9C8]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Garantia de Pureza</span>
            </div>
          </div>

          {/* Composition & Ingredients */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#C5A059]" />
              Composição Botânica Ativa
            </h3>
            <ul className="space-y-2 text-xs text-[#4A5568] font-sans">
              {product.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Instructions */}
          <div className="bg-[#F4EFE6] p-6 rounded-3xl border border-[#E2D9C8] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14281D] font-sans">
              Ritual de Aplicação & Consagração
            </h4>
            <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
              {product.usageInstructions}
            </p>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <div className="bg-white p-8 rounded-3xl border border-[#E2D9C8] space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#14281D]">
          Depoimentos do Círculo de Alquimistas
        </h3>

        {productReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] space-y-2 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#14281D]">{rev.author}</span>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex text-[#C5A059]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic font-sans">
            Seja a primeira pessoa a consagrar e avaliar este produto alquímico.
          </p>
        )}
      </div>

    </div>
  );
};

