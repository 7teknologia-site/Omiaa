import React from 'react';
import { Sparkles, CheckCircle2, Calendar, Package } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const OrderSuccessView: React.FC = () => {
  const { latestOrder, setViewMode } = useShop();

  if (!latestOrder) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#14281D]">Nenhum pedido recente encontrado</h3>
        <button
          onClick={() => setViewMode('catalog')}
          className="bg-[#14281D] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors font-sans"
        >
          Ir para a Apotheca
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-[#C5A059]/40 p-8 sm:p-12 text-center shadow-xl space-y-6 relative overflow-hidden">
        
        <div className="w-20 h-20 rounded-full bg-[#14281D] text-[#C5A059] flex items-center justify-center mx-auto border-2 border-[#C5A059] shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] inline-flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            Preparação Alquímica Iniciada
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14281D] leading-tight">
            Pedido Consagrado com Sucesso!
          </h1>
          <p className="text-xs text-[#5A6578] leading-relaxed font-sans">
            Seus preparados botânicos já estão sendo manipulados artesanalmente com óleos virgens e resinas puras sob o ritual de embalagem sustentável.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D9C8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-left font-sans">
          <div>
            <span className="text-gray-400 text-[10px] uppercase block font-bold">Código do Pedido</span>
            <span className="font-bold text-[#14281D] text-sm font-mono">{latestOrder.code}</span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] uppercase block font-bold">Código de Rastreio</span>
            <span className="font-bold text-[#C5A059] text-sm font-mono">{latestOrder.trackingCode}</span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] uppercase block font-bold">Previsão de Chegada</span>
            <span className="font-bold text-[#14281D] text-sm flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              3 a 5 dias úteis
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="border-t border-[#E2D9C8] pt-6 space-y-3 text-left font-sans">
          <h4 className="text-xs font-bold text-[#14281D] uppercase tracking-wider">
            Itens do Pedido ({latestOrder.items.length})
          </h4>
          <div className="space-y-2">
            {latestOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E2D9C8]">
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white border border-[#E2D9C8]" />
                  <div>
                    <span className="font-bold text-[#14281D] block">{product.name}</span>
                    <span className="text-[10px] text-gray-500">Qtd: {quantity}</span>
                  </div>
                </div>
                <span className="font-serif font-bold text-[#14281D]">
                  R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-sans">
          <button
            onClick={() => setViewMode('account')}
            className="w-full sm:w-auto bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span>Ver Meus Pedidos na Conta</span>
          </button>

          <button
            onClick={() => setViewMode('catalog')}
            className="w-full sm:w-auto border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all"
          >
            Voltar para a Apotheca
          </button>
        </div>

      </div>

    </div>
  );
};

