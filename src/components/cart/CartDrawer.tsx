import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCost,
    freeShippingThreshold,
    setViewMode
  } = useShop();

  const [couponCode, setCouponCode] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    applyCoupon(couponCode);
    setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setViewMode('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#0F1E16]/70 backdrop-blur-xs"
        />

        {/* Slide-over Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between z-10 border-l border-[#C5A059]/40"
        >
          
          {/* Header */}
          <div className="p-6 bg-[#14281D] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-xl font-bold tracking-tight text-[#FAF7F2]">
                Sua Sacola Alquímica ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F4EFE6] p-4 border-b border-[#E2D9C8] space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between text-[#14281D] font-semibold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                {remainingForFreeShipping <= 0 ? (
                  <strong className="text-[#14281D]">Você ganhou FRETE GRÁTIS!</strong>
                ) : (
                  <span>
                    Faltam <strong>R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para Frete Grátis
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-[#E2D9C8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A059] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
            {cart.length > 0 ? (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#E2D9C8] shadow-xs items-center"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-[#F4EFE6] shrink-0 border border-[#E2D9C8]"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#14281D] truncate">{product.name}</h4>
                    <p className="text-[10px] text-[#8C7A5B] font-semibold">{product.volumeOrWeight}</p>
                    <div className="text-xs font-serif font-bold text-[#14281D]">
                      R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-[#E2D9C8] rounded-full bg-[#FAF7F2] px-2 py-0.5 text-xs">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center font-bold text-[#14281D]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-[#14281D]">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center font-bold text-[#14281D]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-gray-400 hover:text-[#B85B3A] p-1 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#8C7A5B] flex items-center justify-center mx-auto border border-[#E2D9C8]">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#14281D]">
                  Sua sacola está vazia
                </h4>
                <p className="text-xs text-[#718096] max-w-xs mx-auto">
                  Explore os elixires e preparados botânicos para iniciar o seu ritual de harmonização.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#14281D] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors shadow-xs"
                >
                  Explorar Apotheca
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E2D9C8] space-y-4 shadow-lg font-sans">
              
              {/* Coupon Bar */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cupom (ex: ALQUIMIA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl py-2 pl-9 pr-3 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059] uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#14281D] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 font-semibold">
                  <span>Cupom {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                  <button onClick={removeCoupon} className="text-xs text-red-600 underline">
                    Remover
                  </button>
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-[#4A5568]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span>- R$ {((cartSubtotal * appliedCoupon.discountPercent) / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete Estipulado</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-800">GRÁTIS</strong> : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
                </div>

                <div className="flex justify-between text-sm font-serif font-bold text-[#14281D] pt-2 border-t border-[#E2D9C8]">
                  <span>Total Alquímico</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Ir para o Checkout Alquímico</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

            </div>
          )}

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

