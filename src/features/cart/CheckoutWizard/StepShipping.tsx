import React from 'react';
import { Truck, Check } from 'lucide-react';
import { ShippingOption } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface StepShippingProps {
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption;
  setSelectedShipping: (s: ShippingOption) => void;
  cartSubtotal: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

export const StepShipping: React.FC<StepShippingProps> = ({
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
  cartSubtotal,
  handleNextStep,
  handlePrevStep
}) => {
  const isFreeShipping = cartSubtotal >= 250;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs font-sans">
      <div className="border-b border-[#E2D9C8] pb-4">
        <h2 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#C5A059]" />
          <span>Passo 3: Escolha do Frete</span>
        </h2>
        <p className="text-xs text-[#718096] mt-1">
          Selecione a modalidade de envio ideal para os seus rituais.
        </p>
      </div>

      {isFreeShipping && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Seu pedido se qualifica para Frete Grátis em compras acima de R$ 250!</span>
        </div>
      )}

      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const actualPrice = isFreeShipping ? 0 : option.price;
          const isSelected = selectedShipping.id === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedShipping({ ...option, price: actualPrice })}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-[#14281D] bg-[#FAF7F2] shadow-xs'
                  : 'border-[#E2D9C8] bg-white hover:border-[#C5A059]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#14281D] bg-[#14281D]' : 'border-[#E2D9C8]'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#C5A059]" />}
                </div>

                <div>
                  <h4 className="font-serif font-bold text-xs text-[#14281D]">{option.name}</h4>
                  <span className="text-[10px] text-[#8C7A5B] block">Prazo estimado: {option.days}</span>
                </div>
              </div>

              <span className="font-serif font-bold text-xs text-[#14281D]">
                {actualPrice === 0 ? 'GRÁTIS' : formatCurrency(actualPrice)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
        <button
          onClick={handlePrevStep}
          className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider"
        >
          Voltar
        </button>

        <button
          onClick={handleNextStep}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
        >
          Avançar para Pagamento
        </button>
      </div>
    </div>
  );
};
