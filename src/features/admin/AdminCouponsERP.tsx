import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import { VALID_COUPONS } from '../../constants/shop';
import { useShop } from '../../context/ShopContext';
import { exportToCSV } from './utils/csvExporter';

interface CouponItem {
  code: string;
  percent: number;
  active: boolean;
  minOrderValue?: number;
}

export const AdminCouponsERP: React.FC = () => {
  const { showToast } = useShop();

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    return Object.entries(VALID_COUPONS).map(([code, percent]) => ({
      code,
      percent,
      active: true,
      minOrderValue: 100
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(10);
  const [isAdding, setIsAdding] = useState(false);

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const formattedCode = newCode.trim().toUpperCase().replace(/\s+/g, '');
    if (coupons.some((c) => c.code === formattedCode)) {
      alert('Cupom já existe!');
      return;
    }

    const item: CouponItem = {
      code: formattedCode,
      percent: Number(newPercent),
      active: true,
      minOrderValue: 0
    };

    setCoupons((prev) => [item, ...prev]);
    setNewCode('');
    setIsAdding(false);
    showToast('Cupom Criado', `O cupom ${formattedCode} de ${newPercent}% OFF está ativo.`, 'success');
  };

  const handleToggleActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleDelete = (code: string) => {
    if (confirm(`Excluir cupom ${code}?`)) {
      setCoupons((prev) => prev.filter((c) => c.code !== code));
      showToast('Cupom Removido', `O cupom ${code} foi desativado e removido.`, 'info');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      coupons,
      [
        { key: 'code', label: 'Código do Cupom' },
        { key: 'percent', label: 'Desconto (%)' },
        { key: 'active', label: 'Ativo' },
        { key: 'minOrderValue', label: 'Pedido Mínimo (R$)' }
      ],
      'Cupons_Desconto_OMIAA'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#C5A059]" />
            <span>Gestão de Cupons & Promoções ({coupons.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Crie códigos promocionais e regras de desconto para o checkout da loja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>{isAdding ? 'Cancelar' : 'Criar Novo Cupom'}</span>
          </button>
        </div>
      </div>

      {/* Add New Form */}
      {isAdding && (
        <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-sm text-[#14281D]">Adicionar Novo Código Promocional</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Código do Cupom *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="EX: LUNAR20"
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#14281D] focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Porcentagem de Desconto (%) *</label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={newPercent}
                onChange={(e) => setNewPercent(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#14281D] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Ativar Cupom
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs relative">
        <Search className="w-4 h-4 text-[#8C7A5B] absolute left-7 top-7" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar cupom..."
          className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Coupon List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((c) => (
          <div
            key={c.code}
            className="bg-white p-5 rounded-3xl border border-[#E2D9C8] flex items-center justify-between shadow-xs relative"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl border ${c.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-[#14281D] block">{c.code}</span>
                <span className="text-[10px] text-[#718096]">
                  {c.active ? 'Disponível no Checkout' : 'Inativo'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#14281D] text-[#C5A059] font-bold text-xs px-3 py-1 rounded-full font-mono">
                {c.percent}% OFF
              </span>

              <button
                onClick={() => handleToggleActive(c.code)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#14281D]"
                title={c.active ? 'Desativar' : 'Ativar'}
              >
                {c.active ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
              </button>

              <button
                onClick={() => handleDelete(c.code)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
