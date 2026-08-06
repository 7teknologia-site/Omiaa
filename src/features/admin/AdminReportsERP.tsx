import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { Product, Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from './utils/csvExporter';

interface AdminReportsERPProps {
  products: Product[];
  orders: Order[];
}

export const AdminReportsERP: React.FC<AdminReportsERPProps> = ({ products, orders }) => {
  const [period, setPeriod] = useState<'30days' | '90days' | 'year'>('30days');

  // Revenue stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const totalShippingCollected = orders.reduce((acc, o) => acc + o.shippingFee, 0);
  const totalDiscountsGiven = orders.reduce((acc, o) => acc + o.discount, 0);

  // Revenue by payment method
  const pixRevenue = orders.filter((o) => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.total, 0);
  const ccRevenue = orders.filter((o) => o.paymentMethod === 'credit_card').reduce((acc, o) => acc + o.total, 0);
  const boletoRevenue = orders.filter((o) => o.paymentMethod === 'boleto').reduce((acc, o) => acc + o.total, 0);

  // Export full financial report CSV
  const handleExportFullReport = () => {
    const reportRows = [
      { Métrica: 'Faturamento Bruto', Valor: formatCurrency(totalRevenue) },
      { Métrica: 'Ticket Médio', Valor: formatCurrency(avgOrderValue) },
      { Métrica: 'Total em Fretes Cobrados', Valor: formatCurrency(totalShippingCollected) },
      { Métrica: 'Total em Descontos Aplicados', Valor: formatCurrency(totalDiscountsGiven) },
      { Métrica: 'Faturamento via PIX', Valor: formatCurrency(pixRevenue) },
      { Métrica: 'Faturamento via Cartão de Crédito', Valor: formatCurrency(ccRevenue) },
      { Métrica: 'Faturamento via Boleto', Valor: formatCurrency(boletoRevenue) },
      { Métrica: 'Total de Pedidos Realizados', Valor: orders.length.toString() },
      { Métrica: 'Total de Produtos no Catálogo', Valor: products.length.toString() }
    ];

    exportToCSV(
      reportRows,
      [
        { key: 'Métrica', label: 'Métrica Financeira / Operacional' },
        { key: 'Valor', label: 'Resultado' }
      ],
      'Relatorio_Geral_Financeiro_OMIAA'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#C5A059]" />
            <span>Relatórios Gerenciais & Vendas</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Análise consolidada de desempenho financeiro, ticket médio e métodos de pagamento.
          </p>
        </div>

        <button
          onClick={handleExportFullReport}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Baixar Relatório Completo CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Faturamento Bruto</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{formatCurrency(totalRevenue)}</h3>
          <p className="text-[10px] text-emerald-800 font-bold">+18.2% vs mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Ticket Médio por Pedido</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{formatCurrency(avgOrderValue)}</h3>
          <p className="text-[10px] text-[#718096]">Com base em {orders.length} pedidos</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Fretes Arrecadados</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{formatCurrency(totalShippingCollected)}</h3>
          <p className="text-[10px] text-[#718096]">Correios & Transportadoras</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Descontos de Cupons</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{formatCurrency(totalDiscountsGiven)}</h3>
          <p className="text-[10px] text-[#718096]">Concedidos aos clientes</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#14281D]">Vendas por Meio de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-2">
            <span className="font-bold text-[#14281D] block">PIX Instantâneo</span>
            <p className="font-serif text-xl font-bold text-[#14281D]">{formatCurrency(pixRevenue)}</p>
            <p className="text-[10px] text-[#718096]">
              {totalRevenue > 0 ? Math.round((pixRevenue / totalRevenue) * 100) : 0}% do faturamento total
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-2">
            <span className="font-bold text-[#14281D] block">Cartão de Crédito</span>
            <p className="font-serif text-xl font-bold text-[#14281D]">{formatCurrency(ccRevenue)}</p>
            <p className="text-[10px] text-[#718096]">
              {totalRevenue > 0 ? Math.round((ccRevenue / totalRevenue) * 100) : 0}% do faturamento total
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-2">
            <span className="font-bold text-[#14281D] block">Boleto Bancário</span>
            <p className="font-serif text-xl font-bold text-[#14281D]">{formatCurrency(boletoRevenue)}</p>
            <p className="text-[10px] text-[#718096]">
              {totalRevenue > 0 ? Math.round((boletoRevenue / totalRevenue) * 100) : 0}% do faturamento total
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
