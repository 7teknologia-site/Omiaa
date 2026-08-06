import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  Gift,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types';

interface ShippingOption {
  id: 'pac' | 'sedex' | 'pickup';
  name: string;
  days: string;
  price: number;
}

export const CartDrawer: React.FC = () => {
  const {
    products,
    cart,
    cartTotalCount,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setViewMode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCep,
    setShippingCep,
    shippingCost,
    freeShippingThreshold,
    showToast
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<'pac' | 'sedex' | 'pickup'>('pac');
  const [isShippingExpanded, setIsShippingExpanded] = useState(false);

  if (!isCartOpen) return null;

  // Mask CEP formatting (#####-###)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    setShippingCep(formatted);
  };

  const handleApplyCouponForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleQuickCouponClick = async (code: string) => {
    setCouponInput(code);
    setIsApplyingCoupon(true);
    await applyCoupon(code);
    setIsApplyingCoupon(false);
  };

  // Free shipping progress calculation
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Available shipping options calculated dynamically
  const shippingOptions: ShippingOption[] = [
    {
      id: 'pac',
      name: 'PAC (Correios Ecológico)',
      days: '4-6 dias úteis',
      price: isFreeShipping ? 0 : 14.90
    },
    {
      id: 'sedex',
      name: 'SEDEX Express',
      days: '1-2 dias úteis',
      price: isFreeShipping ? 10.00 : 24.90
    },
    {
      id: 'pickup',
      name: 'Retirada no Atelier OMIAA (SP)',
      days: 'Pronta Entrega',
      price: 0
    }
  ];

  const currentSelectedShipping = shippingOptions.find((s) => s.id === selectedShippingOptionId) || shippingOptions[0];
  const activeShippingFee = currentSelectedShipping.price;

  // Calculate final total taking active shipping fee selection into account
  const couponDiscountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const calculatedCartTotal = Math.max(0, cartSubtotal - couponDiscountAmount + activeShippingFee);

  // Cross-sell recommended products (products not currently in cart)
  const cartProductIds = new Set(cart.map((i) => i.product.id));
  const recommendedProducts = products
    .filter((p) => !cartProductIds.has(p.id) && p.stock > 0)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md sm:max-w-md bg-[#FAF9F6] border-l border-[#E2D9C8] shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#FDFBF7] border-b border-[#E2D9C8] flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E2D9C8]">
                <ShoppingBag className="w-5 h-5 text-[#14281D]" />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#14281D] flex items-center gap-2">
                  <span>Sacola Alquímica</span>
                  <span className="bg-[#14281D] text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cartTotalCount}
                  </span>
                </h2>
                <p className="text-[10px] text-[#8C7A5B]">Sua seleção de rituais e elixires</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja esvaziar sua sacola?')) {
                      clearCart();
                      showToast('Sacola Esvaziada', undefined, 'info');
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full"
                  title="Esvaziar Sacola"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-[#14281D] hover:bg-[#FAF7F2] transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Indicador de Frete Grátis Progress Bar */}
          <div className="bg-[#14281D] text-[#FAF7F2] px-5 py-3 text-xs space-y-1.5 shrink-0 relative overflow-hidden border-b border-[#2C4837]">
            <div className="flex justify-between items-center font-medium text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                {isFreeShipping ? (
                  <strong className="text-[#C5A059]">🎉 Você conquistou FRETE GRÁTIS!</strong>
                ) : (
                  <span>
                    Faltam <strong className="text-[#C5A059] font-bold">{formatCurrency(amountToFreeShipping)}</strong> para Frete Grátis
                  </span>
                )}
              </span>
              <span className="font-bold text-[#C5A059] font-mono text-[10px]">{Math.round(progressPercent)}%</span>
            </div>

            <div className="w-full h-2 bg-[#2C4837] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#A67B5B] via-[#C5A059] to-[#F3E5AB] transition-all duration-500 rounded-full shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Scrollable Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">
            
            {/* Empty Cart State */}
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full border border-[#E2D9C8] flex items-center justify-center mx-auto text-[#C5A059] shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#14281D]">Sua sacola está vazia</h3>
                  <p className="text-xs text-[#718096] max-w-xs mx-auto">
                    Explore a loja e adicione elixires, séruns e rituais ao seu carrinho.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewMode('catalog');
                  }}
                  className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8C7A5B] uppercase tracking-wider">
                    <span>Itens Selecionados</span>
                    <span>Subtotal: {formatCurrency(cartSubtotal)}</span>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E2D9C8] flex items-center gap-3.5 shadow-xs hover:border-[#C5A059] transition-all"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] shrink-0"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#14281D] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors shrink-0"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-serif font-bold text-[#14281D]">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <span className="text-[10px] text-[#8C7A5B] font-mono">
                            {formatCurrency(item.product.price)} un.
                          </span>
                        </div>

                        {/* Mobile Touch-friendly Quantity controls */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-[#E2D9C8] rounded-xl bg-[#FAF7F2] overflow-hidden">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-[#E2D9C8]/50 text-[#14281D] transition-colors min-w-[32px] flex items-center justify-center"
                              title="Diminuir"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#14281D]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                              className="p-1.5 hover:bg-[#E2D9C8]/50 text-[#14281D] transition-colors min-w-[32px] flex items-center justify-center"
                              title="Aumentar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {item.product.stock <= 3 && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Últimas {item.product.stock} un.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping CEP Calculation Card */}
                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E2D9C8] space-y-3 shadow-xs">
                  <div
                    onClick={() => setIsShippingExpanded(!isShippingExpanded)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#14281D]">
                      <Truck className="w-4 h-4 text-[#C5A059]" />
                      <span>Calcular Frete por CEP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#14281D]">
                        {activeShippingFee === 0 ? (
                          <span className="text-emerald-800 font-black">GRÁTIS</span>
                        ) : (
                          formatCurrency(activeShippingFee)
                        )}
                      </span>
                      {isShippingExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* CEP Input Row */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={shippingCep}
                      onChange={handleCepChange}
                      maxLength={9}
                      className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (shippingCep.replace(/\D/g, '').length === 8) {
                          setIsShippingExpanded(true);
                          showToast('Frete Calculado', 'Opções de envio atualizadas.', 'info');
                        } else {
                          showToast('CEP Inválido', 'Digite 8 dígitos numéricos.', 'alert');
                        }
                      }}
                      className="bg-[#14281D] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
                    >
                      Calcular
                    </button>
                  </div>

                  {/* Shipping Options Accordion */}
                  {(isShippingExpanded || shippingCep.replace(/\D/g, '').length === 8) && (
                    <div className="space-y-2 pt-2 border-t border-[#E2D9C8] animate-fade-in">
                      {shippingOptions.map((opt) => (
                        <label
                          key={opt.id}
                          onClick={() => setSelectedShippingOptionId(opt.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedShippingOptionId === opt.id
                              ? 'border-[#14281D] bg-[#FAF7F2] ring-1 ring-[#14281D]'
                              : 'border-[#E2D9C8] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shippingOption"
                              checked={selectedShippingOptionId === opt.id}
                              onChange={() => setSelectedShippingOptionId(opt.id)}
                              className="accent-[#14281D]"
                            />
                            <div>
                              <span className="font-bold text-[#14281D] block">{opt.name}</span>
                              <span className="text-[10px] text-[#8C7A5B]">{opt.days}</span>
                            </div>
                          </div>
                          <span className="font-bold text-[#14281D]">
                            {opt.price === 0 ? <span className="text-emerald-800">GRÁTIS</span> : formatCurrency(opt.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Coupon Code Section */}
                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E2D9C8] space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#14281D]">
                    <Tag className="w-4 h-4 text-[#C5A059]" />
                    <span>Cupom de Desconto</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <div>
                          <span className="font-bold uppercase tracking-wider block">{appliedCoupon.code}</span>
                          <span className="text-[10px] text-emerald-700">
                            -{appliedCoupon.discountPercent}% no subtotal ({formatCurrency(couponDiscountAmount)})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-700 hover:text-red-900 font-bold text-[11px] bg-white px-2 py-1 rounded-lg border border-red-200"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <form onSubmit={handleApplyCouponForm} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Digite seu cupom..."
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#C5A059]"
                        />
                        <button
                          type="submit"
                          disabled={isApplyingCoupon}
                          className="bg-[#14281D] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
                        >
                          {isApplyingCoupon ? 'Validando...' : 'Aplicar'}
                        </button>
                      </form>

                      {/* Quick Coupon Suggestions */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-[#8C7A5B] font-semibold">Sugeridos:</span>
                        {['ALQUIMIA10', 'ANCESTRAL20', 'FRETEGRATIS'].map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleQuickCouponClick(code)}
                            className="text-[10px] font-mono font-bold bg-[#FAF7F2] text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059] px-2 py-0.5 rounded-md transition-colors"
                          >
                            +{code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommended Products Carousel (Cross-Sell) */}
                {recommendedProducts.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#14281D]">
                      <Gift className="w-4 h-4 text-[#C5A059]" />
                      <span>Complemente seu Ritual Alquímico</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {recommendedProducts.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-white p-3 rounded-2xl border border-[#E2D9C8] w-40 shrink-0 flex flex-col justify-between shadow-2xs hover:border-[#C5A059] transition-all"
                        >
                          <div className="space-y-2">
                            <img
                              src={rec.images[0]}
                              alt={rec.name}
                              className="w-full aspect-square object-cover rounded-xl bg-[#FAF7F2]"
                            />
                            <div>
                              <h5 className="font-serif font-bold text-xs text-[#14281D] line-clamp-1">
                                {rec.name}
                              </h5>
                              <span className="text-[10px] text-[#8C7A5B] block">{rec.volumeOrWeight}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="font-serif font-bold text-xs text-[#14281D]">
                              {formatCurrency(rec.price)}
                            </span>
                            <button
                              onClick={() => addToCart(rec, 1)}
                              className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] p-1.5 rounded-xl transition-colors"
                              title="Adicionar à Sacola"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Resumo Fixo (Fixed Footer Order Summary Panel) */}
          {cart.length > 0 && (
            <div className="bg-[#FDFBF7] p-4 sm:p-5 border-t border-[#E2D9C8] space-y-3 shadow-lg shrink-0">
              
              {/* Order Calculations Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#718096]">
                  <span>Subtotal ({cartTotalCount} itens)</span>
                  <span className="font-medium text-[#14281D]">{formatCurrency(cartSubtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Cupom ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(couponDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#718096]">
                  <span>Frete ({currentSelectedShipping.name.split(' ')[0]})</span>
                  <span>
                    {activeShippingFee === 0 ? (
                      <span className="text-emerald-800 font-bold">GRÁTIS</span>
                    ) : (
                      formatCurrency(activeShippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-[#14281D] pt-2 border-t border-[#E2D9C8]">
                  <span>Total</span>
                  <span className="text-lg font-bold text-[#14281D]">
                    {formatCurrency(calculatedCartTotal)}
                  </span>
                </div>
              </div>

              {/* Fixed CTA Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setViewMode('checkout');
                }}
                className="w-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 sm:py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-101 active:scale-99 min-h-[48px]"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Finalizar Pedido</span>
                <span className="bg-[#C5A059] text-[#14281D] text-[11px] font-mono px-2 py-0.5 rounded-full ml-1">
                  {formatCurrency(calculatedCartTotal)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#8C7A5B] flex items-center justify-center gap-1">
                <span>🔒 Compra 100% segura & Criptografada</span>
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
