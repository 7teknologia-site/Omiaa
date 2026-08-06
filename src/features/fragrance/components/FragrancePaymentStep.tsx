import React, { useState } from 'react';
import { CreditCard, QrCode, FileText, CheckCircle2, ShieldCheck, Copy, Check, Lock, Sparkles } from 'lucide-react';
import { FragrancePayment, CustomFragrance } from '../../../types';

interface FragrancePaymentStepProps {
  fragranceData: Partial<CustomFragrance>;
  onCompletePayment: (payment: FragrancePayment) => Promise<void>;
  onBack: () => void;
}

export const FragrancePaymentStep: React.FC<FragrancePaymentStepProps> = ({
  fragranceData,
  onCompletePayment,
  onBack
}) => {
  const [method, setMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [installments, setInstallments] = useState('1');

  const amount = fragranceData.price || 340;
  const mockPixKey = `00020126580014BR.GOV.BCB.PIX0136omiaa-custom-fragrance-${Date.now()}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const paymentObj: FragrancePayment = {
      method,
      status: 'pago',
      amount,
      paidAt: new Date().toISOString(),
      pixQrCode: method === 'pix' ? 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=OMIAA' : undefined,
      pixCopyPaste: method === 'pix' ? mockPixKey : undefined,
      cardLast4: method === 'credit_card' ? (cardNumber.slice(-4) || '4821') : undefined
    };

    await onCompletePayment(paymentObj);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-2 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
          ETAPA 4 DE 10 • PAGAMENTO SEGURO
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#14281D]">
          Finalizar Encomenda da Fragrância Exclusiva
        </h2>
        <p className="text-xs text-[#718096]">
          Seu investimento cobre a consulta individual, fórmula artesanal, essências botânicas puras e maceração de 28 dias.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Escolha a Forma de Pagamento
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMethod('pix')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  method === 'pix'
                    ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                    : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#C5A059]" />
                <span className="text-xs font-bold">PIX (5% off)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('credit_card')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  method === 'credit_card'
                    ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                    : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#C5A059]" />
                <span className="text-xs font-bold">Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('boleto')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  method === 'boleto'
                    ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                    : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                }`}
              >
                <FileText className="w-5 h-5 text-[#C5A059]" />
                <span className="text-xs font-bold">Boleto</span>
              </button>
            </div>
          </div>

          {/* PIX Details */}
          {method === 'pix' && (
            <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Desconto de 5% Aplicado no PIX</span>
              </div>

              <div className="w-40 h-40 bg-[#FAF7F2] border-2 border-[#E2D9C8] rounded-2xl mx-auto flex items-center justify-center p-2 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    mockPixKey
                  )}`}
                  alt="QR Code PIX OMIAA"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-xs text-[#718096]">
                Escaneie o QR Code acima com o app do seu banco ou copie a chave abaixo.
              </p>

              <button
                type="button"
                onClick={handleCopyPix}
                className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/40 px-4 py-2.5 rounded-2xl text-xs font-bold w-full flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedPix ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#8C7A5B]" />}
                <span>{copiedPix ? 'Chave Copiada com Sucesso!' : 'Copiar Chave PIX Copia e Cola'}</span>
              </button>
            </div>
          )}

          {/* Credit Card Details */}
          {method === 'credit_card' && (
            <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
              <div>
                <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                  Nome Impresso no Cartão
                </label>
                <input
                  type="text"
                  placeholder="NOME COMO NO CARTÃO"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D] uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Validade (MM/AA)
                  </label>
                  <input
                    type="text"
                    placeholder="12/29"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                  Parcelamento Sem Juros
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs font-bold text-[#14281D]"
                >
                  <option value="1">1x de R$ {amount.toFixed(2)} sem juros</option>
                  <option value="2">2x de R$ {(amount / 2).toFixed(2)} sem juros</option>
                  <option value="3">3x de R$ {(amount / 3).toFixed(2)} sem juros</option>
                  <option value="6">6x de R$ {(amount / 6).toFixed(2)} sem juros</option>
                </select>
              </div>
            </div>
          )}

          {/* Boleto Details */}
          {method === 'boleto' && (
            <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs text-center">
              <FileText className="w-8 h-8 text-[#C5A059] mx-auto" />
              <h3 className="font-serif font-bold text-sm text-[#14281D]">Boleto Bancário OMIAA</h3>
              <p className="text-xs text-[#718096]">
                O boleto será gerado assim que confirmar. Vencimento em 3 dias úteis. A maceração inicia após compensação.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-[#718096] bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Pagamento 100% criptografado com garantia e certificado de segurança OMIAA.</span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-[#14281D] border-b pb-3">
            Resumo do Seu Pedido
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8C7A5B] font-bold">Fragrância</span>
              <span className="font-bold text-[#14281D]">{fragranceData.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8C7A5B] font-bold">Frasco</span>
              <span className="text-[#14281D]">{fragranceData.bottleSize}</span>
            </div>

            {fragranceData.appointment && (
              <div className="flex justify-between border-t border-[#E2D9C8] pt-2">
                <span className="text-[#8C7A5B] font-bold">Consulta</span>
                <span className="text-[#14281D]">
                  {fragranceData.appointment.date} às {fragranceData.appointment.time}
                </span>
              </div>
            )}

            <div className="flex justify-between border-t border-[#E2D9C8] pt-2 text-base font-serif font-bold">
              <span className="text-[#14281D]">Total do Investimento</span>
              <span className="text-[#C5A059]">R$ {amount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] p-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>{isProcessing ? 'Processando Pagamento...' : 'Confirmar & Iniciar Alquimia'}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-xs text-[#718096] hover:text-[#14281D] font-bold uppercase tracking-wider"
          >
            Voltar ao Agendamento
          </button>
        </div>

      </div>

    </div>
  );
};
