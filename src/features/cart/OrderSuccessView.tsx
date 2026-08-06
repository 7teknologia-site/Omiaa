import React, { useState } from 'react';
import {
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  Copy,
  Check,
  QrCode,
  FileText,
  Mail,
  Printer,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderSuccessView: React.FC = () => {
  const { latestOrder, setViewMode, showToast } = useShop();
  const [copiedKey, setCopiedKey] = useState(false);

  if (!latestOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <p className="text-xs text-[#718096]">Nenhum pedido recente encontrado.</p>
        <button
          onClick={() => setViewMode('catalog')}
          className="bg-[#14281D] text-[#FAF7F2] px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider"
        >
          Voltar para a Loja
        </button>
      </div>
    );
  }

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    showToast(`${label} Copiado!`, 'Copiado para a área de transferência.', 'success');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl text-center space-y-4 border border-[#2C4837] shadow-lg relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Ritual Confirmado com Sucesso</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">Pedido #{latestOrder.code}</h1>
          <p className="text-xs text-[#A8B2A6] max-w-md mx-auto">
            Sua solicitação foi registrada com sucesso. Enviamos todos os detalhes do seu pedido para o seu e-mail.
          </p>
        </div>

        {/* Email Confirmation Status Alert */}
        <div className="bg-[#2C4837]/80 backdrop-blur-xs p-3 rounded-2xl border border-[#C5A059]/30 text-xs text-[#E2D9C8] inline-flex items-center gap-2 mt-2">
          <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>
            E-mail de confirmação enviado para <strong>{latestOrder.customerEmail || 'seu e-mail de cadastro'}</strong>
          </span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <h3 className="font-serif font-bold text-sm text-[#14281D] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C5A059]" />
          <span>Status do Envio e Produção</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold">
            <span className="block text-emerald-700 font-mono text-[9px] uppercase">Passo 1</span>
            Pedido Realizado
          </div>

          <div className={`p-3 border rounded-2xl font-bold ${
            latestOrder.status === 'pago' || latestOrder.status === 'em_preparo' || latestOrder.status === 'enviado' || latestOrder.status === 'entregue'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#FAF7F2] border-[#E2D9C8] text-[#8C7A5B]'
          }`}>
            <span className="block font-mono text-[9px] uppercase opacity-75">Passo 2</span>
            Pagamento {latestOrder.status === 'pendente' ? 'Pendente' : 'Aprovado'}
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl text-[#8C7A5B]">
            <span className="block font-mono text-[9px] uppercase opacity-75">Passo 3</span>
            Em Preparação
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl text-[#8C7A5B]">
            <span className="block font-mono text-[9px] uppercase opacity-75">Passo 4</span>
            Enviado ao Correio
          </div>
        </div>
      </div>

      {/* PIX Payment Section (if PIX selected) */}
      {latestOrder.paymentMethod === 'pix' && latestOrder.pixPayload && (
        <div className="bg-emerald-950 text-[#FAF7F2] p-6 rounded-3xl border border-emerald-800 space-y-4 shadow-md text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            <span>Pagamento via PIX • QR Code & Copia e Cola</span>
          </div>

          <p className="text-xs text-[#A8B2A6]">
            Abra o app do seu banco, escolha a opção PIX e escaneie a imagem abaixo ou copie o código payload.
          </p>

          {latestOrder.pixQrCodeUrl && (
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md mx-auto">
              <img src={latestOrder.pixQrCodeUrl} alt="QR Code PIX Mercado Pago" className="w-48 h-48 mx-auto" />
            </div>
          )}

          <div className="bg-[#14281D] p-3 rounded-xl border border-[#2C4837] flex items-center justify-between gap-2 text-xs font-mono">
            <span className="truncate text-gray-300 text-[11px] max-w-xs sm:max-w-md">{latestOrder.pixPayload}</span>
            <button
              onClick={() => handleCopyCode(latestOrder.pixPayload!, 'Código PIX')}
              className="bg-[#C5A059] text-[#14281D] px-3 py-1.5 rounded-lg font-sans font-bold hover:bg-white transition-colors shrink-0 flex items-center gap-1.5 text-[11px]"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copiado!' : 'Copiar PIX'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Boleto Payment Section */}
      {latestOrder.paymentMethod === 'boleto' && latestOrder.boletoBarcode && (
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D9C8] space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#14281D] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#C5A059]" />
            <span>Linha Digitável do Boleto</span>
          </div>
          <p className="text-xs text-[#718096]">
            Utilize o código de barras abaixo para pagar pelo seu internet banking.
          </p>
          <div className="bg-white p-3 rounded-xl border border-[#E2D9C8] font-mono text-xs text-[#14281D] flex items-center justify-between gap-2">
            <span className="font-bold">{latestOrder.boletoBarcode}</span>
            <button
              onClick={() => handleCopyCode(latestOrder.boletoBarcode!, 'Código do Boleto')}
              className="bg-[#14281D] text-[#FAF7F2] px-3 py-1.5 rounded-lg font-sans font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors shrink-0 text-[11px]"
            >
              Copiar
            </button>
          </div>
        </div>
      )}

      {/* Order Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#E2D9C8] text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Data do Pedido</span>
            <span className="font-bold text-[#14281D]">{formatDate(latestOrder.date)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Método de Pagamento</span>
            <span className="font-bold text-[#14281D] uppercase flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{latestOrder.paymentMethod}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Código de Rastreio</span>
            <span className="font-bold text-emerald-800 font-mono">{latestOrder.trackingCode}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-sm text-[#14281D] uppercase tracking-wider">
            Itens do seu Pedido
          </h3>
          <div className="space-y-2">
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl bg-white border" />
                  <div>
                    <h4 className="font-serif font-bold text-[#14281D]">{item.product.name}</h4>
                    <span className="text-[10px] text-[#718096]">Qtd: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-serif font-bold text-[#14281D]">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#14281D] mb-1">
            <Truck className="w-4 h-4 text-[#C5A059]" />
            <span>Endereço de Entrega</span>
          </div>
          <p className="text-[#4A5568]">
            {latestOrder.deliveryAddress.street}, {latestOrder.deliveryAddress.number}
            {latestOrder.deliveryAddress.complement ? ` - ${latestOrder.deliveryAddress.complement}` : ''}
          </p>
          <p className="text-[#4A5568]">
            {latestOrder.deliveryAddress.neighborhood} • {latestOrder.deliveryAddress.city}/{latestOrder.deliveryAddress.state} - CEP: {latestOrder.deliveryAddress.cep}
          </p>
        </div>

        {/* Total Summary */}
        <div className="border-t border-[#E2D9C8] pt-4 flex justify-between items-center text-sm">
          <span className="font-bold text-[#14281D]">Valor Total Pago</span>
          <span className="font-serif font-bold text-lg text-[#14281D]">{formatCurrency(latestOrder.total)}</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setViewMode('account')}
          className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Acompanhar Meus Pedidos</span>
        </button>

        <button
          onClick={handlePrintReceipt}
          className="bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4 text-[#8C7A5B]" />
          <span>Imprimir Comprovante</span>
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className="flex-1 border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
          <span>Continuar Comprando</span>
        </button>
      </div>

    </div>
  );
};

