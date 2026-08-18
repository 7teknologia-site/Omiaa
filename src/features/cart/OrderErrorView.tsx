import React from 'react';
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useCheckout } from '../../hooks/useCheckout';

interface OrderErrorViewProps {
  errorMessage?: string;
}

export const OrderErrorView: React.FC<OrderErrorViewProps> = ({ errorMessage }) => {
  const { setViewMode } = useShop();
  const checkout = useCheckout();
  const displayMessage = errorMessage || checkout.lastPaymentError;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-sans">
      
      {/* Header Error Card */}
      <div className="bg-red-900 text-[#FAF7F2] p-8 rounded-3xl text-center space-y-4 border border-red-800 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-200 block">
            Transação Não Concluída
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Falha no Pagamento</h1>
          <p className="text-xs text-red-100 max-w-md mx-auto">
            {displayMessage || 'Sua tentativa de pagamento não pôde ser processada pela operadora neste momento.'}
          </p>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-3 text-[#14281D]">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h3 className="font-serif font-bold text-base">O que pode ter acontecido?</h3>
        </div>

        <ul className="text-xs text-[#5A6B5D] space-y-3 list-disc pl-5">
          <li>
            <strong>Cartão Recusado:</strong> Verifique se os dados digitados (número, validade e CVV) estão corretos ou se há limite disponível.
          </li>
          <li>
            <strong>Bloqueio de Segurança do Banco:</strong> Algumas instituições financeiras exigem confirmação pelo app do banco.
          </li>
          <li>
            <strong>Instabilidade Temporária no Gateway ou PIX:</strong> Se utilizou PIX, certifique-se de realizar a leitura do QR Code antes da expiração da chave.
          </li>
        </ul>

        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] flex items-center gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-[#C5A059] shrink-0" />
          <span className="text-[#14281D] font-medium">
            Não se preocupe! Seus itens continuam salvos com segurança na sua sacola de rituais.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setViewMode('checkout')}
          className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar Novamente / Alterar Forma</span>
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className="flex-1 border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>Voltar para o Catálogo</span>
        </button>
      </div>

    </div>
  );
};
