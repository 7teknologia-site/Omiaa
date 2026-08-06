import React from 'react';
import { CreditCard, Copy, Check, ShieldCheck, QrCode } from 'lucide-react';
import { Order } from '../../../types';
import { MOCK_PIX_PAYLOAD } from '../../../constants/shop';
import { formatCurrency } from '../../../utils/formatters';

interface StepPaymentProps {
  paymentMethod: Order['paymentMethod'];
  setPaymentMethod: (m: Order['paymentMethod']) => void;
  installments: number;
  setInstallments: (n: number) => void;
  cardHolder: string;
  setCardHolder: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvc: string;
  setCardCvc: (v: string) => void;
  pixCopied: boolean;
  handleCopyPix: (payload: string) => void;
  calculatedTotal: number;
  errors: Record<string, string>;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  paymentMethod,
  setPaymentMethod,
  installments,
  setInstallments,
  cardHolder,
  setCardHolder,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  pixCopied,
  handleCopyPix,
  calculatedTotal,
  errors,
  handleNextStep,
  handlePrevStep
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs font-sans">
      <div className="border-b border-[#E2D9C8] pb-4">
        <h2 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#C5A059]" />
          <span>Passo 4: Forma de Pagamento</span>
        </h2>
        <p className="text-xs text-[#718096] mt-1">
          Ambiente seguro criptografado Mercado Pago SSL.
        </p>
      </div>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod('pix')}
          className={`p-3 rounded-2xl border-2 text-center transition-all ${
            paymentMethod === 'pix'
              ? 'border-[#14281D] bg-[#FAF7F2] font-bold text-[#14281D]'
              : 'border-[#E2D9C8] text-[#8C7A5B] hover:border-[#C5A059]'
          }`}
        >
          <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
          <span className="text-xs block">PIX (-5%)</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('credit_card')}
          className={`p-3 rounded-2xl border-2 text-center transition-all ${
            paymentMethod === 'credit_card'
              ? 'border-[#14281D] bg-[#FAF7F2] font-bold text-[#14281D]'
              : 'border-[#E2D9C8] text-[#8C7A5B] hover:border-[#C5A059]'
          }`}
        >
          <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#14281D]" />
          <span className="text-xs block">Cartão</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('boleto')}
          className={`p-3 rounded-2xl border-2 text-center transition-all ${
            paymentMethod === 'boleto'
              ? 'border-[#14281D] bg-[#FAF7F2] font-bold text-[#14281D]'
              : 'border-[#E2D9C8] text-[#8C7A5B] hover:border-[#C5A059]'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-amber-700" />
          <span className="text-xs block">Boleto</span>
        </button>
      </div>

      {/* PIX Option Panel */}
      {paymentMethod === 'pix' && (
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] text-center space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full inline-block">
            Desconto de 5% Aplicado
          </span>
          <p className="text-xs text-[#14281D] font-semibold">
            O código PIX e QR Code serão gerados após a confirmação.
          </p>
          <button
            type="button"
            onClick={() => handleCopyPix(MOCK_PIX_PAYLOAD)}
            className="inline-flex items-center gap-2 bg-[#14281D] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
          >
            {pixCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{pixCopied ? 'Chave Copiada!' : 'Copiar Chave PIX de Teste'}</span>
          </button>
        </div>
      )}

      {/* Credit Card Form */}
      {paymentMethod === 'credit_card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
              Nome do Titular *
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            {errors.cardHolder && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardHolder}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
              Número do Cartão *
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            {errors.cardNumber && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
              Validade (MM/AA) *
            </label>
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            {errors.cardExpiry && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardExpiry}</p>}
          </div>

          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
              CVV *
            </label>
            <input
              type="text"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            {errors.cardCvc && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardCvc}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
              Parcelamento
            </label>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <option key={i} value={i}>
                  {i}x de {formatCurrency(calculatedTotal / i)} sem juros
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Boleto Panel */}
      {paymentMethod === 'boleto' && (
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] text-xs text-[#4A5568] space-y-2">
          <p className="font-bold text-[#14281D]">Informações sobre o Boleto Bancário:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Vencimento em 3 dias úteis.</li>
            <li>A confirmação do pagamento é processada em até 24 a 48h úteis.</li>
          </ul>
        </div>
      )}

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
          Revisar Pedido
        </button>
      </div>
    </div>
  );
};
