import React, { useState, useEffect } from 'react';
import { FlaskConical, Search, Download, Clock, CheckCircle2, MessageCircle, Mail, Edit3, Plus, Minus, Filter, Sparkles } from 'lucide-react';
import { CustomFragrance } from '../../../types';
import { fetchCustomFragrances, updateCustomFragranceStatus } from '../../../services/supabaseService';
import { WhatsAppNotifierModal } from './WhatsAppNotifierModal';
import { EmailNotifierModal } from './EmailNotifierModal';
import { exportToCSV } from '../../admin/utils/csvExporter';

interface FragranceAdminPanelProps {
  onSendToast?: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const FragranceAdminPanel: React.FC<FragranceAdminPanelProps> = ({ onSendToast }) => {
  const [fragrances, setFragrances] = useState<CustomFragrance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

  // Modals
  const [whatsappFragrance, setWhatsappFragrance] = useState<CustomFragrance | null>(null);
  const [emailFragrance, setEmailFragrance] = useState<CustomFragrance | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    fetchCustomFragrances().then((data) => {
      setFragrances(data || []);
    });
  }, []);

  const handleUpdateStatus = async (id: string | undefined, newStatus: string) => {
    if (!id) return;
    setFragrances((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus as any } : f))
    );
    await updateCustomFragranceStatus(id, newStatus);
    if (onSendToast) {
      onSendToast('ERP Atelier OMIAA', `Status da fórmula atualizado para "${newStatus}".`, 'success');
    }
  };

  const handleAdjustMacerationDays = async (id: string | undefined, delta: number) => {
    if (!id) return;
    setFragrances((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const current = f.macerationDaysRemaining ?? 28;
          const updated = Math.max(0, current + delta);
          updateCustomFragranceStatus(id, f.status || 'macerando', f.alchemistNotes, updated);
          return { ...f, macerationDaysRemaining: updated };
        }
        return f;
      })
    );
  };

  const handleSaveNotes = async (id: string | undefined) => {
    if (!id) return;
    setFragrances((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          updateCustomFragranceStatus(id, f.status || 'macerando', notesText, f.macerationDaysRemaining);
          return { ...f, alchemistNotes: notesText };
        }
        return f;
      })
    );
    setEditingNotesId(null);
    if (onSendToast) {
      onSendToast('Anotações Salvas', 'Diário do Mestre Perfumista gravado com sucesso.', 'success');
    }
  };

  const filteredFragrances = fragrances.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.intention.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedStatusFilter === 'todos' || f.status === selectedStatusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    exportToCSV(
      filteredFragrances,
      [
        { key: 'batchNumber', label: 'Código do Lote' },
        { key: 'name', label: 'Nome da Fragrância' },
        { key: 'customerName', label: 'Cliente' },
        { key: 'customerEmail', label: 'E-mail' },
        { key: 'customerPhone', label: 'WhatsApp' },
        { key: 'bottleSize', label: 'Volume' },
        { key: 'price', label: 'Valor (R$)' },
        { key: 'status', label: 'Status' },
        { key: 'topNotes', label: 'Notas de Saída' },
        { key: 'heartNotes', label: 'Notas de Coração' },
        { key: 'baseNotes', label: 'Notas de Fundo' },
        { key: 'intention', label: 'Intenção' }
      ],
      'Relatorio_Atelier_Fragrancias_OMIAA'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#C5A059]" />
            <span>Painel ERP • Atelier de Fragrâncias Personalizadas</span>
          </h2>
          <p className="text-xs text-[#718096]">
            Gestão total das solicitações, status de maceração, diário alquímico e notificações via WhatsApp e E-mail.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Total de Fórmulas</span>
          <div className="font-serif text-2xl font-bold text-[#14281D]">{fragrances.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase block">Em Maceração</span>
          <div className="font-serif text-2xl font-bold text-amber-900">
            {fragrances.filter((f) => f.status === 'macerando' || f.status === 'encomendado').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Prontas / Envasadas</span>
          <div className="font-serif text-2xl font-bold text-emerald-900">
            {fragrances.filter((f) => f.status === 'envasado' || f.status === 'concluido').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-[#C5A059] uppercase block">Faturamento em Bespoke</span>
          <div className="font-serif text-2xl font-bold text-[#14281D]">
            R$ {fragrances.reduce((sum, f) => sum + (f.price || 340), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código do lote, nome da fragrância, cliente ou e-mail..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8C7A5B]" />
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2.5 text-xs text-[#14281D] font-bold focus:outline-none focus:border-[#C5A059]"
          >
            <option value="todos">Todos os Status</option>
            <option value="solicitado">Solicitado</option>
            <option value="agendado">Agendado</option>
            <option value="analise_olfativa">Análise Olfativa</option>
            <option value="macerando">Em Maceração</option>
            <option value="envasado">Envasado</option>
            <option value="enviado">Enviado</option>
          </select>
        </div>
      </div>

      {/* Main ERP Fragrances Cards List */}
      <div className="space-y-6">
        {filteredFragrances.map((f, index) => (
          <div
            key={f.id || index}
            className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D9C8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full">
                    {f.batchNumber || `OMIAA-00${index + 1}`}
                  </span>
                  <span className="text-xs font-bold text-[#14281D]">{f.customerName || 'Cliente Atelier'}</span>
                  <span className="text-xs text-[#718096]">({f.customerEmail})</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#14281D] mt-1">{f.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8C7A5B]">Status:</span>
                <select
                  value={f.status || 'macerando'}
                  onChange={(e) => handleUpdateStatus(f.id, e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="solicitado">1. Solicitado</option>
                  <option value="agendado">2. Agendado</option>
                  <option value="analise_olfativa">3. Análise Olfativa</option>
                  <option value="macerando">4. Em Maceração (28d)</option>
                  <option value="envasado">5. Envasado</option>
                  <option value="enviado">6. Enviado</option>
                </select>

                <button
                  onClick={() => setWhatsappFragrance(f)}
                  className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                  title="Notificar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                </button>

                <button
                  onClick={() => setEmailFragrance(f)}
                  className="bg-[#FAF7F2] text-[#14281D] hover:bg-[#E2D9C8]/40 p-2 rounded-xl border border-[#E2D9C8] transition-all cursor-pointer"
                  title="Disparar E-mail"
                >
                  <Mail className="w-4 h-4 text-[#8C7A5B]" />
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
                <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Pirâmide de Notas</span>
                <p><strong>Saída:</strong> {f.topNotes.join(', ')}</p>
                <p><strong>Coração:</strong> {f.heartNotes.join(', ')}</p>
                <p><strong>Fundo:</strong> {f.baseNotes.join(', ')}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-1">
                <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Consulta & Frasco</span>
                <p><strong>Frasco:</strong> {f.bottleSize} (R$ {(f.price || 340).toFixed(2)})</p>
                {f.appointment && (
                  <p><strong>Consulta:</strong> {f.appointment.date} às {f.appointment.time} ({f.appointment.perfumer})</p>
                )}
                {f.payment && (
                  <p><strong>Pagamento:</strong> {f.payment.method.toUpperCase()} ({f.payment.status})</p>
                )}
              </div>

              {/* Maceration Days Counter Adjuster */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-2">
                <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Contador de Maceração</span>
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#E2D9C8]">
                  <button
                    onClick={() => handleAdjustMacerationDays(f.id, -1)}
                    className="p-1 rounded-lg hover:bg-[#E2D9C8] text-[#14281D] cursor-pointer"
                    title="Diminuir 1 dia restante"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-xs text-[#14281D]">
                    {f.macerationDaysRemaining ?? 28} dias restantes
                  </span>

                  <button
                    onClick={() => handleAdjustMacerationDays(f.id, 1)}
                    className="p-1 rounded-lg hover:bg-[#E2D9C8] text-[#14281D] cursor-pointer"
                    title="Aumentar 1 dia restante"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Diário Alquímico Notes */}
            <div className="pt-2">
              {editingNotesId === f.id ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D]"
                    placeholder="Adicione observações de macerado ou mistura..."
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="text-xs text-[#718096] font-bold px-3 py-1.5"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveNotes(f.id)}
                      className="bg-[#14281D] text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                    >
                      Salvar Diário
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="italic">
                    {f.alchemistNotes ? `Diário: "${f.alchemistNotes}"` : 'Nenhuma anotação de diário inserida.'}
                  </span>
                  <button
                    onClick={() => {
                      setEditingNotesId(f.id || null);
                      setNotesText(f.alchemistNotes || '');
                    }}
                    className="text-[#C5A059] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Diário</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {whatsappFragrance && (
        <WhatsAppNotifierModal
          fragrance={whatsappFragrance}
          isOpen={!!whatsappFragrance}
          onClose={() => setWhatsappFragrance(null)}
          onSendToast={(msg) => onSendToast && onSendToast('WhatsApp', msg, 'success')}
        />
      )}

      {emailFragrance && (
        <EmailNotifierModal
          fragrance={emailFragrance}
          isOpen={!!emailFragrance}
          onClose={() => setEmailFragrance(null)}
          onSendToast={onSendToast}
        />
      )}

    </div>
  );
};
