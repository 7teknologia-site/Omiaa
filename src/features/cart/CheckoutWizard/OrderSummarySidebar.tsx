import React, { useState } from 'react';
import { ShoppingBag, Tag, ShieldCheck, Lock } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { formatCurrency } from '../../../utils/formatters';

interface OrderSummarySidebarProps {
  currentShippingFee: number;
  pixDiscount: number;
  calculatedTotal: number;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  currentShippingFee,
  pixDiscount,
  calculatedTotal
}) => {
  const { cart, cartSubtotal, appliedCoupon, applyCoupon, removeCoupon } = useShop();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const couponDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs font-sans">
      
      <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-4">
        <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
        <h3 className="font-serif font-bold text-lg text-[#14281D]">
          Resumo do Pedido ({cart.length})
        </h3>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between text-xs pb-3 border-b border-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border" />
              <div>
                <h4 className="font-serif font-bold text-[#14281D] line-clamp-1">{item.product.name}</h4>
                <span className="text-[10px] text-[#8C7A5B]">Qtd: {item.quantity}</span>
              </div>
            </div>
            <span className="font-serif font-bold text-[#14281D]">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon Form */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="font-bold uppercase">{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
          </div>
          <button onClick={removeCoupon} className="text-red-600 hover:underline font-bold text-[10px]">
            Remover
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            placeholder="Cupom"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-semibold uppercase focus:outline-none focus:border-[#C5A059]"
          />
          <button
            type="submit"
            className="bg-[#14281D] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
          >
            Aplicar
          </button>
        </form>
      )}

      {/* Pricing breakdown */}
      <div className="space-y-2 text-xs border-t border-[#E2D9C8] pt-4">
        <div className="flex justify-between text-[#718096]">
          <span>Subtotal</span>
          <span>{formatCurrency(cartSubtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Desconto Cupom</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}

        {pixDiscount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Desconto PIX (5%)</span>
            <span>-{formatCurrency(pixDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#718096]">
          <span>Frete</span>
          <span>{currentShippingFee === 0 ? 'GRÁTIS' : formatCurrency(currentShippingFee)}</span>
        </div>

        <div className="flex justify-between text-base font-serif font-bold text-[#14281D] pt-3 border-t border-[#E2D9C8]">
          <span>Total a Pagar</span>
          <span>{formatCurrency(calculatedTotal)}</span>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8] flex items-center gap-2 text-[10px] text-[#8C7A5B]">
        <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>Pagamento 100% Criptografado & Protegido</span>
      </div>

    </div>
  );
};
