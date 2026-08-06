import React from 'react';
import { ShieldCheck, Truck, MapPin, User, CheckCircle2 } from 'lucide-react';
import { Address, Order, ShippingOption } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface StepReviewProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  selectedShipping: ShippingOption;
  paymentMethod: Order['paymentMethod'];
  installments: number;
  calculatedTotal: number;
  isSubmitting: boolean;
  handleFinishCheckout: (e: React.FormEvent) => void;
  handlePrevStep: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  address,
  selectedShipping,
  paymentMethod,
  installments,
  calculatedTotal,
  isSubmitting,
  handleFinishCheckout,
  handlePrevStep
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs font-sans">
      <div className="border-b border-[#E2D9C8] pb-4">
        <h2 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
          <span>Passo 5: Revisão Final do Pedido</span>
        </h2>
        <p className="text-xs text-[#718096] mt-1">
          Confira todos os dados antes de concluir seu ritual alquímico.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Customer Data */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14281D] mb-1">
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>Cliente</span>
          </div>
          <p className="font-bold">{customerName}</p>
          <p className="text-[#718096]">{customerEmail}</p>
          <p className="text-[#718096]">{customerPhone}</p>
        </div>

        {/* Address */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14281D] mb-1">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>Endereço de Entrega</span>
          </div>
          <p>{address.street}, {address.number}</p>
          <p className="text-[#718096]">{address.neighborhood} • {address.city}/{address.state}</p>
          <p className="text-[#718096]">CEP: {address.cep}</p>
        </div>

        {/* Shipping */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14281D] mb-1">
            <Truck className="w-4 h-4 text-[#C5A059]" />
            <span>Modalidade de Envio</span>
          </div>
          <p className="font-bold">{selectedShipping.name}</p>
          <p className="text-[#718096]">{selectedShipping.days}</p>
        </div>

        {/* Payment */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14281D] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Pagamento</span>
          </div>
          <p className="font-bold uppercase">{paymentMethod}</p>
          {paymentMethod === 'credit_card' && (
            <p className="text-[#718096]">
              {installments}x de {formatCurrency(calculatedTotal / installments)}
            </p>
          )}
        </div>

      </div>

      <div className="pt-4 border-t border-[#E2D9C8] flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevStep}
          className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={handleFinishCheckout}
          disabled={isSubmitting}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
        >
          {isSubmitting ? (
            <span>Processando Ritual...</span>
          ) : (
            <span>Concluir Pedido • {formatCurrency(calculatedTotal)}</span>
          )}
        </button>
      </div>
    </div>
  );
};
