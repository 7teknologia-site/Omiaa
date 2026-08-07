import React, { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Search,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';
import { formatCurrency } from '../../utils/formatters';

interface AdminLogisticsERPProps {
  initialTab?: 'tracking' | 'rates' | 'carriers' | 'freight';
}

export const AdminLogisticsERP: React.FC<AdminLogisticsERPProps> = ({ initialTab = 'tracking' }) => {
  const { orders, showToast } = useShop();
  const resolvedTab = initialTab === 'freight' ? 'rates' : initialTab;
  const [activeTab, setActiveTab] = useState<'tracking' | 'rates' | 'carriers'>(resolvedTab);

  const [carriers, setCarriers] = useState([
    { id: '1', name: 'Correios SEDEX', status: 'Ativo', time: '1 - 3 dias úteis', type: 'Expresso' },
    { id: '2', name: 'Correios PAC', status: 'Ativo', time: '4 - 8 dias úteis', type: 'Econômico' },
    { id: '3', name: 'Melhor Envio (Jadlog / Latam Cargo)', status: 'Ativo', time: '2 - 5 dias úteis', type: 'Integrado' },
    { id: '4', name: 'Frete Grátis Alquímico (Compras > R$ 250)', status: 'Ativo', time: '3 - 7 dias úteis', type: 'Promocional' }
  ]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Logística" subItemLabel="Expedição, Fretes & Transportadoras" />

      {/* Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 rounded-3xl border border-[#2C4837] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif font-bold text-lg">Central de Logística & Rastreamento</h2>
          </div>
          <p className="text-xs text-[#A8B2A6] mt-1">
            Gestão de tabelas de frete, regras de frete grátis, integração com transportadoras e despacho de pacotes.
          </p>
        </div>

        <button
          onClick={() => showToast('Cálculo de frete em tempo real revalidado!', 'success')}
          className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-[#14281D] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#E8D4A8]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sincronizar Rastreios</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-2">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tracking'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Package className="w-4 h-4 text-[#C5A059]" />
          <span>Painel de Rastreamento ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('carriers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'carriers'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#C5A059]" />
          <span>Transportadoras Conectadas</span>
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rates'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#C5A059]" />
          <span>Regras de Frete & Zonas</span>
        </button>
      </div>

      {activeTab === 'tracking' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#14281D]">Despachos & Rastreios em Andamento</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Destinatário</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">Transportadora</th>
                  <th className="p-3">Código Rastreio</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9C8]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF7F2]/60 font-medium">
                    <td className="p-3 font-mono font-bold text-[#14281D]">{o.code || o.id}</td>
                    <td className="p-3 text-[#14281D]">{o.customerName}</td>
                    <td className="p-3 text-[#8C7A5B]">{(o as any).shippingAddress?.city || 'São Paulo - SP'}</td>
                    <td className="p-3 font-bold text-[#C5A059]">Correios SEDEX</td>
                    <td className="p-3 font-mono text-[11px] font-bold text-[#14281D]">
                      {`OM${o.id.substring(0, 8).toUpperCase()}BR`}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'carriers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carriers.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-bold text-base text-[#14281D]">{c.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-[#8C7A5B]">Prazo estimado médio: {c.time}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-[#C5A059] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2D9C8]">
                  Modalidade {c.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#14281D]">Regras de Frete Grátis & CEPs Atendidos</h3>
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-2 text-xs">
            <p className="font-bold text-[#14281D]">Frete Grátis Alquímico Brasil</p>
            <p className="text-[#8C7A5B]">Aplicado automaticamente no carrinho quando a soma dos produtos ultrapassa R$ 250,00.</p>
          </div>
        </div>
      )}
    </div>
  );
};
