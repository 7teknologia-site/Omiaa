import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Truck,
  Minus,
  Plus,
  Check,
  Copy,
  AlertCircle,
  Bell,
  Layers,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import { Breadcrumb } from '../../components/navigation/Breadcrumb';
import { SEOHead } from '../../components/seo/SEOHead';
import { ImageZoomGallery } from '../../components/ui/ImageZoomGallery';
import { ProductCard } from './ProductCard';
import { ProductReviewsSection } from '../reviews/ProductReviewsSection';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setViewMode,
    addToCart,
    toggleWishlist,
    isWishlisted,
    shippingCep,
    setShippingCep,
    showToast
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'origin'>('details');
  const [copiedSku, setCopiedSku] = useState(false);
  const [restockEmail, setRestockEmail] = useState('');
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  // Related products: Same category, excluding current product
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Similar products: Different category or similar price, excluding current & related
  const similarProducts = products
    .filter((p) => p.id !== product.id && !relatedProducts.some((rp) => rp.id === p.id))
    .slice(0, 4);

  const handleCopySku = () => {
    if (product.sku) {
      navigator.clipboard.writeText(product.sku);
      setCopiedSku(true);
      showToast('SKU Copiado', `SKU ${product.sku} copiado com sucesso!`, 'info');
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingCep.replace(/\D/g, '').length === 8) {
      showToast('Frete Calculado', 'SEDEX (1-2 dias) R$ 24,90 | PAC (4-6 dias) R$ 14,90', 'info');
    } else {
      showToast('CEP Inválido', 'Digite um CEP com 8 números.', 'alert');
    }
  };

  const handleRestockNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockEmail.includes('@')) {
      setIsNotifySubmitted(true);
      showToast('Alerta Ativado!', 'Avisaremos por e-mail assim que esta alquimia for reposta.', 'success');
    } else {
      showToast('E-mail Inválido', 'Informe um e-mail válido.', 'alert');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      
      {/* Dynamic SEO Meta & Schema.org JSON-LD */}
      <SEOHead
        title={`${product.name} - ${product.subtitle}`}
        description={product.shortDescription || product.fullDescription}
        keywords={product.ingredients || ['Alquimia', 'OMIAÁ', 'Sérum', 'Elixir']}
        canonicalUrl={`/produto/${product.slug}`}
        ogImage={product.images?.[0]}
        ogType="product"
        product={product}
        breadcrumbItems={[
          { name: 'Início', item: '/' },
          { name: 'Catálogo', item: '/catalogo' },
          { name: product.name, item: `/produto/${product.slug}` }
        ]}
      />

      {/* Top Header Row with Breadcrumb & Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <Breadcrumb
          items={[
            { label: 'Catálogo', viewMode: 'catalog' },
            { label: product.name, active: true }
          ]}
        />

        <button
          onClick={() => setViewMode('catalog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>Voltar para o Catálogo</span>
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Interactive Image Zoom Gallery */}
        <div className="lg:col-span-6">
          <ImageZoomGallery
            images={product.images}
            productName={product.name}
            badges={product.badges}
            discountPercent={discountPercent}
            stock={product.stock}
          />
        </div>

        {/* Right: Product Purchase Info & Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-3 border-b border-[#E2D9C8] pb-6">
            
            {/* Volume, SKU & Stock Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#8C7A5B]">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E2D9C8]">
                  {product.volumeOrWeight}
                </span>
                <button
                  onClick={handleCopySku}
                  className="inline-flex items-center gap-1 uppercase font-mono text-[#C5A059] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E2D9C8] hover:bg-[#E2D9C8]/40 transition-colors"
                  title="Clique para copiar SKU"
                >
                  <span>SKU: {product.sku}</span>
                  {copiedSku ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
                </button>
              </div>

              {isOutOfStock ? (
                <span className="text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full font-bold flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> Esgotado
                </span>
              ) : product.stock <= 3 ? (
                <span className="text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold text-[11px] animate-pulse">
                  Restam apenas {product.stock} unidades!
                </span>
              ) : (
                <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold text-[11px]">
                  Em estoque ({product.stock} un.)
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14281D] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-[#718096]">
              {product.subtitle}
            </p>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('avaliacoes-secao');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 pt-1 hover:opacity-80 transition-opacity text-left cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-[#C5A059]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-[#14281D] ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-[#8C7A5B] group-hover:underline">
                ({product.reviewsCount} {product.reviewsCount === 1 ? 'avaliação de cliente' : 'avaliações de clientes'})
              </span>
            </button>
          </div>

          {/* Price Box */}
          <div className="space-y-1 bg-[#FAF7F2] p-5 rounded-3xl border border-[#E2D9C8]">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#14281D]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="bg-rose-900 text-rose-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-emerald-800 pt-1">
              Ou até 6x de {formatCurrency(product.price / 6)} sem juros no cartão
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quantity Selector & Add Buttons or Restock Alert */}
          {isOutOfStock ? (
            <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Bell className="w-4 h-4 text-amber-700" />
                <span>Alquimia temporariamente esgotada</span>
              </div>
              <p className="text-xs text-amber-800">
                Cadastre seu e-mail para receber um aviso imediato assim que os lotes artesanais forem recompostos.
              </p>
              {isNotifySubmitted ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>E-mail cadastrado! Avisaremos em breve.</span>
                </div>
              ) : (
                <form onSubmit={handleRestockNotify} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail..."
                    value={restockEmail}
                    onChange={(e) => setRestockEmail(e.target.value)}
                    required
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Avise-me
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center border border-[#E2D9C8] bg-[#FAF7F2] rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#14281D] hover:bg-[#E2D9C8]/50 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-[#14281D]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-[#14281D] hover:bg-[#E2D9C8]/50 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:scale-101"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Sacola</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    wishlisted
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2]'
                  }`}
                  title="Lista de Desejos"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>

              </div>
            </div>
          )}

          {/* Shipping Simulator */}
          <form onSubmit={handleSimulateShipping} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] space-y-3">
            <label className="text-[11px] font-bold text-[#14281D] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Simular Frete & Entrega</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="00000-000"
                value={shippingCep}
                onChange={(e) => setShippingCep(e.target.value)}
                className="flex-1 bg-[#FDFBF7] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="bg-[#14281D] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
              >
                Calcular
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* Tabs Section: Description, Ingredients, Ancestral Origin */}
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#E2D9C8] p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-6 border-b border-[#E2D9C8] pb-4 overflow-x-auto text-xs font-bold uppercase tracking-widest scrollbar-none">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'details' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
            }`}
          >
            Descrição Completa
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ingredients' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
            }`}
          >
            Ativos & Ingredientes
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'origin' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
            }`}
          >
            Origem Ancestral
          </button>
        </div>

        <div className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.fullDescription}</p>
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] space-y-2">
                <strong className="text-[#14281D] text-sm block font-serif">Modo de Uso Alquímico:</strong>
                <p>{product.usageInstructions}</p>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <span className="font-bold text-[#14281D] text-sm block font-serif">Composição Botânica Pura:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2.5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-medium text-[#14281D]">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'origin' && (
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D9C8] space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#14281D] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                Sabedoria de Cultivo & Tradição
              </h4>
              <p>{product.ancestralOrigin}</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Reviews & Rating System */}
      <ProductReviewsSection product={product} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-[#E2D9C8]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif text-2xl font-bold text-[#14281D]">
              Produtos Relacionados (Sinergia Complementar)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-[#E2D9C8]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif text-2xl font-bold text-[#14281D]">
              Produtos Semelhantes
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

