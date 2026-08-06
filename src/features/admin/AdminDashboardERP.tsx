import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
  Droplet
} from 'lucide-react';
import { Product, Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AdminDashboardERPProps {
  products: Product[];
  orders: Order[];
  onNavigate: (tab: string) => void;
  onOpenNewProductModal: () => void;
  onExportOrdersCSV: () => void;
}

export const AdminDashboardERP: React.FC<AdminDashboardERPProps> = ({
  products,
  orders,
  onNavigate,
  onOpenNewProductModal,
  onExportOrdersCSV
}) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pendente' || o.status === 'pago');
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Revenue calculation for chart mock representation
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#2C4837] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2C4837] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ERP OMIAA Alquimia v2.5</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Painel de Controle e Gestão da Omiaá Alquimia Ancestral
          </h1>
          <p className="text-xs text-[#A8B2A6] leading-relaxed">
            Acompanhe o faturamento em tempo real, pedidos pendentes de expedição, alertas de estoque e métricas de desempenho dos seus rituais botânicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onOpenNewProductModal}
            className="bg-[#C5A059] hover:bg-white text-[#14281D] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>

          <button
            onClick={onExportOrdersCSV}
            className="bg-[#2C4837] hover:bg-[#3D5E4A] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-2xl flex items-center gap-2 border border-[#C5A059]/30 transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Exportar Pedidos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#8C7A5B] tracking-wider">
              Faturamento Total
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">
            {formatCurrency(totalRevenue)}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% em relação ao mês anterior</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-3 cursor-pointer hover:border-[#C5A059] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#8C7A5B] tracking-wider">
              Total de Pedidos
            </span>
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] text-[#14281D] border border-[#E2D9C8]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">
            {orders.length}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-[#718096]">
            <span>{pendingOrders.length} aguardando envio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-3 cursor-pointer hover:border-[#C5A059] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#8C7A5B] tracking-wider">
              Produtos Ativos
            </span>
            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] text-[#C5A059] border border-[#E2D9C8]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">
            {products.length}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-[#718096]">
            <span>Alquimia e Rituais</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-3 cursor-pointer hover:border-amber-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
              Estoque Crítico
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-amber-900">
            {lowStockProducts.length} itens
          </h3>
          <div className="flex items-center justify-between text-[11px] text-amber-800 font-bold">
            <span>Reposição necessária</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14281D]">Últimos Pedidos Recebidos</h3>
              <p className="text-xs text-[#718096]">Acompanhe as transações mais recentes da loja</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#C5A059] hover:underline flex items-center gap-1"
            >
              Ver Todos ({orders.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2D9C8] text-[#8C7A5B] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Código</th>
                  <th className="py-3 px-2">Cliente</th>
                  <th className="py-3 px-2">Data</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9C8]/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-[#14281D]">
                      #{order.code}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-[#14281D]">
                      {order.customerName || 'Cliente Neófito'}
                    </td>
                    <td className="py-3.5 px-2 text-[#718096]">
                      {formatDate(order.date)}
                    </td>
                    <td className="py-3.5 px-2 font-bold font-mono text-[#14281D]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'pago' ? 'bg-emerald-100 text-emerald-900' :
                        order.status === 'enviado' ? 'bg-sky-100 text-sky-900' :
                        order.status === 'entregue' ? 'bg-purple-100 text-purple-900' :
                        order.status === 'cancelado' ? 'bg-red-100 text-red-900' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Widget & Quick Shortcuts (1 col) */}
        <div className="space-y-6">
          
          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-sm text-[#14281D]">Alerta de Estoque</h3>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-[11px] font-bold text-amber-800 hover:underline"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs text-center font-bold">
                  Todos os produtos possuem estoque suficiente!
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
                    <div className="truncate pr-2">
                      <p className="font-bold text-[#14281D] truncate">{p.name}</p>
                      <span className="text-[10px] text-[#8C7A5B] font-mono">{p.sku}</span>
                    </div>
                    <span className="px-2 py-1 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold font-mono shrink-0">
                      {p.stock} un.
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick ERP Navigation Shortcuts */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D9C8] space-y-3">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#14281D]">Atalhos Rápidos ERP</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('categories')}
                className="p-3 bg-white rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059] font-bold text-[#14281D] text-left flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4 text-[#C5A059]" />
                <span>Categorias</span>
              </button>

              <button
                onClick={() => onNavigate('customers')}
                className="p-3 bg-white rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059] font-bold text-[#14281D] text-left flex items-center gap-2 transition-all"
              >
                <Users className="w-4 h-4 text-[#C5A059]" />
                <span>Clientes CRM</span>
              </button>

              <button
                onClick={() => onNavigate('blog')}
                className="p-3 bg-white rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059] font-bold text-[#14281D] text-left flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>Blog Alquímico</span>
              </button>

              <button
                onClick={() => onNavigate('botanical')}
                className="p-3 bg-white rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059] font-bold text-[#14281D] text-left flex items-center gap-2 transition-all"
              >
                <Droplet className="w-4 h-4 text-[#C5A059]" />
                <span>Ervas Botânicas</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
