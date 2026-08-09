import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  Printer,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import { verifyInfinitePayPayment } from '../../services/infinitepayService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ObrigadoView: React.FC = () => {
  const { setViewMode, latestOrder } = useShop();
  const [order, setOrder] = useState<Order | null>(latestOrder);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'pendente' | 'cancelado' | 'desconhecido'>('pendente');
  const [params, setParams] = useState<{
    orderNsu?: string;
    receiptUrl?: string;
    transactionNsu?: string;
    slug?: string;
    captureMethod?: string;
    isSimulated?: boolean;
  }>({});

  const checkStatus = async (nsu: string, silent = false) => {
    if (!silent) setIsLoading(true);
    const res = await verifyInfinitePayPayment(nsu);
    if (res.success) {
      if (res.order) {
        setOrder(res.order);
      }
      if (res.status === 'pago') {
        setPaymentStatus('pago');
      } else if (res.status === 'cancelado') {
        setPaymentStatus('cancelado');
      } else {
        setPaymentStatus('pendente');
      }
    } else {
      setPaymentStatus('pendente');
    }
    if (!silent) setIsLoading(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNsu = urlParams.get('order_nsu') || urlParams.get('order_id') || latestOrder?.code || latestOrder?.id;
    const receiptUrl = urlParams.get('receipt_url') || undefined;
    const transactionNsu = urlParams.get('transaction_nsu') || urlParams.get('nsu') || undefined;
    const slug = urlParams.get('slug') || undefined;
    const captureMethod = urlParams.get('capture_method') || undefined;
    const isSimulated = urlParams.get('simulated') === 'true';

    setParams({
      orderNsu: orderNsu || undefined,
      receiptUrl,
      transactionNsu,
      slug,
      captureMethod,
      isSimulated
    });

    if (orderNsu) {
      checkStatus(orderNsu, false);
    } else if (latestOrder) {
      setPaymentStatus(latestOrder.status === 'pago' ? 'pago' : 'pendente');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [latestOrder]);

  // Automatic polling every 5s for the first 30s while status is pending
  useEffect(() => {
    if (paymentStatus !== 'pendente' || !params.orderNsu) return;

    let checkCount = 0;
    const maxChecks = 6; // 6 * 5s = 30 seconds max

    const interval = setInterval(() => {
      checkCount += 1;
      if (checkCount > maxChecks) {
        clearInterval(interval);
        return;
      }
      if (params.orderNsu) {
        checkStatus(params.orderNsu, true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentStatus, params.orderNsu]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <div className="relative inline-block">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
          <Sparkles className="w-5 h-5 text-[#C5A059] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#8C7A5B] animate-pulse">
          Verificando confirmação do pagamento junto à InfinitePay...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-sans">
      
      {/* Header Banner - Pago */}
      {paymentStatus === 'pago' && (
        <div className="bg-[#14281D] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl text-center space-y-4 border border-[#2C4837] shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Pagamento Aprovado • InfinitePay</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">
              Pedido #{order?.code || params.orderNsu || 'Alquímico'}
            </h1>
            <p className="text-xs text-[#A8B2A6] max-w-md mx-auto">
              Seu pagamento foi confirmado com sucesso. O ritual de preparação dos seus elixires já foi iniciado.
            </p>
          </div>

          {params.receiptUrl && (
            <a
              href={params.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C5A059] text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold hover:bg-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Comprovante Oficial InfinitePay</span>
            </a>
          )}
        </div>
      )}

      {/* Header Banner - Pendente */}
      {paymentStatus === 'pendente' && (
        <div className="bg-[#1B2A38] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl text-center space-y-4 border border-[#2C4258] shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-10 h-10 animate-spin" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
              <span>Processamento em Andamento</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">
              Estamos Confirmando seu Pagamento
            </h1>
            <p className="text-xs text-[#A8B2A6] max-w-md mx-auto">
              Pedido #{order?.code || params.orderNsu || ''}. Aguardando a notificação final da InfinitePay. Se você acabou de concluir o pagamento, a atualização pode levar alguns segundos.
            </p>
          </div>

          {params.orderNsu && (
            <button
              onClick={() => checkStatus(params.orderNsu!)}
              className="inline-flex items-center gap-2 bg-[#C5A059] text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verificar Status Novamente</span>
            </button>
          )}
        </div>
      )}

      {/* Header Banner - Cancelado / Não Confirmado */}
      {paymentStatus === 'cancelado' && (
        <div className="bg-red-950 text-[#FAF7F2] p-8 sm:p-10 rounded-3xl text-center space-y-4 border border-red-800 shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-md">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">
              Pagamento Não Confirmado
            </h1>
            <p className="text-xs text-red-200 max-w-md mx-auto">
              Não recebemos a aprovação da operadora para o pedido #{order?.code || params.orderNsu || ''}.
            </p>
          </div>

          <button
            onClick={() => setViewMode('checkout')}
            className="inline-flex items-center gap-2 bg-white text-red-950 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <span>Tentar Novamente no Checkout</span>
          </button>
        </div>
      )}

      {/* Order Details (if order loaded) */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#E2D9C8] text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Data do Pedido</span>
              <span className="font-bold text-[#14281D]">{formatDate(order.date || new Date().toISOString())}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Gateway de Pagamento</span>
              <span className="font-bold text-[#14281D] uppercase flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>InfinitePay {params.captureMethod ? `(${params.captureMethod})` : ''}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-wider block">Status Atual</span>
              <span className={`font-bold font-mono text-xs uppercase ${paymentStatus === 'pago' ? 'text-emerald-700' : 'text-amber-600'}`}>
                {paymentStatus === 'pago' ? 'Aprovado / Pago' : 'Pendente de Pagamento'}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#14281D] uppercase tracking-wider">
              Itens do seu Pedido
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] text-xs">
                  <div className="flex items-center gap-3">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl bg-white border" />
                    )}
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
          {order.deliveryAddress && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#14281D] mb-1">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Endereço de Entrega</span>
              </div>
              <p className="text-[#4A5568]">
                {order.deliveryAddress.street}, {order.deliveryAddress.number}
                {order.deliveryAddress.complement ? ` - ${order.deliveryAddress.complement}` : ''}
              </p>
              <p className="text-[#4A5568]">
                {order.deliveryAddress.neighborhood} • {order.deliveryAddress.city}/{order.deliveryAddress.state} - CEP: {order.deliveryAddress.cep}
              </p>
            </div>
          )}

          {/* Total Summary */}
          <div className="border-t border-[#E2D9C8] pt-4 flex justify-between items-center text-sm">
            <span className="font-bold text-[#14281D]">Valor Total</span>
            <span className="font-serif font-bold text-lg text-[#14281D]">{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setViewMode('account')}
          className="flex-1 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Acompanhar Meus Pedidos</span>
        </button>

        <button
          onClick={handlePrintReceipt}
          className="bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#8C7A5B]" />
          <span>Imprimir Comprovante</span>
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className="flex-1 border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
          <span>Continuar Comprando</span>
        </button>
      </div>

    </div>
  );
};
