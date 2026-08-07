import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  RotateCcw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/formatters';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';
import { AdminReportsERP } from './AdminReportsERP';

interface AdminFinanceERPProps {
  initialTab?: 'payments' | 'refunds' | 'reports';
}

export const AdminFinanceERP: React.FC<AdminFinanceERPProps> = ({ initialTab = 'payments' }) => {
  const { orders, products, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'payments' | 'refunds' | 'reports'>(initialTab);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const paidOrders = orders.filter((o) => o.status === 'pago' || o.status === 'enviado' || o.status === 'entregue');
  const totalPaidRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Financeiro" subItemLabel="Pagamentos, Reembolsos & Relatórios" />

      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 rounded-3xl border border-[#2C4837] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif font-bold text-lg">Módulo Financeiro & Fluxo de Caixa</h2>
          </div>
          <p className="text-xs text-[#A8B2A6] mt-1">
            Gestão de gateways de pagamento, reembolsos, conciliação e análises de rentabilidade.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-[#A8B2A6] block font-semibold">Faturamento Faturado</span>
            <span className="font-serif font-bold text-base text-[#C5A059]">{formatCurrency(totalPaidRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#C5A059]" />
          <span>Gateway de Pagamentos</span>
        </button>

        <button
          onClick={() => setActiveTab('refunds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'refunds'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-[#C5A059]" />
          <span>Reembolsos & Estornos</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#C5A059]" />
          <span>Relatórios Financeiros</span>
        </button>
      </div>

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">Gateway Principal</span>
              <p className="text-base font-bold text-[#14281D] font-serif mt-1">Mercado Pago Pix / Cartão</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Operacional (Taxa 0.99%)
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">Conversão no Pix</span>
              <p className="text-base font-bold text-[#14281D] font-serif mt-1">94.2% Aprovados</p>
              <span className="text-[10px] text-emerald-700 font-bold mt-2 block">+3.1% em relação ao mês anterior</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">Ticket Médio</span>
              <p className="text-base font-bold text-[#14281D] font-serif mt-1">
                {formatCurrency(totalRevenue / (orders.length || 1))}
              </p>
              <span className="text-[10px] text-[#8C7A5B] mt-2 block">Base de {orders.length} pedidos</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#14281D]">Transações Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                    <th className="p-3">Código</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Método</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D9C8]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF7F2]/60 font-medium">
                      <td className="p-3 font-mono font-bold text-[#14281D]">{o.code || o.id}</td>
                      <td className="p-3 text-[#14281D]">{o.customerName}</td>
                      <td className="p-3 font-bold text-[#C5A059]">{o.paymentMethod || 'Pix com Desconto'}</td>
                      <td className="p-3 font-bold text-[#14281D]">{formatCurrency(o.total)}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'refunds' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Solicitações de Reembolso & Devoluções</h3>
              <p className="text-xs text-[#8C7A5B]">Nenhum estorno de chargeback pendente no momento.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Taxa de Devolução &lt; 0.1%
            </span>
          </div>

          <div className="p-8 text-center text-[#8C7A5B] space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-[#C5A059]" />
            <p className="text-xs font-bold text-[#14281D]">Todas as solicitações financeiras foram processadas.</p>
            <p className="text-[11px]">Reembolsos são sincronizados automaticamente via Webhook Mercado Pago.</p>
          </div>
        </div>
      )}

      {activeTab === 'reports' && <AdminReportsERP products={products} orders={orders} />}
    </div>
  );
};
