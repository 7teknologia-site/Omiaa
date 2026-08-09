import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Clock, CheckCircle2, FlaskConical, Download } from 'lucide-react';
import { CustomFragrance } from '../../types';
import { fetchCustomFragrances } from '../../services/supabaseService';
import { useShop } from '../../context/ShopContext';
import { exportToCSV } from './utils/csvExporter';

export const AdminFragrancesERP: React.FC = () => {
  const { showToast } = useShop();
  const [fragrances, setFragrances] = useState<CustomFragrance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomFragrances().then((data) => {
      setFragrances(data || []);
    });
  }, []);

  const handleUpdateStatus = (id: string | undefined, newStatus: CustomFragrance['status']) => {
    if (!id) return;
    setFragrances((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    showToast('Atelier de Fragrâncias', `Fórmula atualizada para o status "${newStatus}".`, 'success');
  };

  const filteredFragrances = fragrances.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.intention.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    exportToCSV(
      filteredFragrances,
      [
        { key: 'name', label: 'Nome da Fragrância' },
        { key: 'customerEmail', label: 'E-mail do Cliente' },
        { key: 'topNotes', label: 'Notas de Saída' },
        { key: 'heartNotes', label: 'Notas de Coração' },
        { key: 'baseNotes', label: 'Notas de Fundo' },
        { key: 'intention', label: 'Intenção Alquímica' },
        { key: 'bottleSize', label: 'Frasco' },
        { key: 'status', label: 'Status' }
      ],
      'Fragrancias_Customizadas_Atelier'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#C5A059]" />
            <span>Atelier de Fragrâncias Personalizadas ({filteredFragrances.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Acompanhe o processo de maceração, mistura olfativa e envase de perfumes sob medida.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Exportar Fórmulas CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs relative">
        <Search className="w-4 h-4 text-[#8C7A5B] absolute left-7 top-7" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por perfume, e-mail do cliente ou intenção..."
          className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFragrances.map((f, i) => (
          <div key={f.id || i} className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-[#E2D9C8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                  {f.customerEmail || 'Atelier Particular'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#14281D]">{f.name}</h3>
              </div>

              <select
                value={f.status || 'macerando'}
                onChange={(e) => handleUpdateStatus(f.id, e.target.value as any)}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                  f.status === 'concluido' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                  f.status === 'macerando' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                  'bg-sky-50 text-sky-900 border-sky-300'
                }`}
              >
                <option value="encomendado">Encomendado</option>
                <option value="macerando">Em Maceração (28 dias)</option>
                <option value="concluido">Pronto / Envasado</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#14281D] bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]/80 italic">
                "{f.intention}"
              </p>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2">
                <div>
                  <span className="font-bold text-[#8C7A5B] block uppercase text-[9px]">Notas de Saída</span>
                  <p className="text-[#14281D]">{f.topNotes?.join(', ') || 'Sem notas'}</p>
                </div>
                <div>
                  <span className="font-bold text-[#8C7A5B] block uppercase text-[9px]">Notas de Coração</span>
                  <p className="text-[#14281D]">{f.heartNotes?.join(', ') || 'Sem notas'}</p>
                </div>
                <div>
                  <span className="font-bold text-[#8C7A5B] block uppercase text-[9px]">Notas de Fundo</span>
                  <p className="text-[#14281D]">{f.baseNotes?.join(', ') || 'Sem notas'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2D9C8] flex justify-between items-center text-[10px] text-[#718096]">
              <span>Frasco: {f.bottleSize}</span>
              <span>Criado em: {f.createdAt || '2026-07-27'}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
