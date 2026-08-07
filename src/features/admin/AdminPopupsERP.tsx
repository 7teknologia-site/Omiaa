import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Layers,
  MousePointer,
  Users,
  Tag,
  BarChart3,
  Mail,
  Zap,
  ChevronRight,
  TrendingUp,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import {
  Popup,
  PopupType,
  PopupPageTarget,
  PopupTriggerType,
  PopupAudience
} from '../../types/popup';
import {
  getSavedPopups,
  savePopups,
  getSavedLeads,
  exportLeadsToCSV
} from '../../utils/popupStorage';

const EMPTY_POPUP: Omit<Popup, 'id' | 'createdAt' | 'updatedAt' | 'stats'> = {
  name: '',
  type: 'promotion',
  active: true,
  priority: 1,
  displayOncePerVisitor: true,
  repeatAfterDays: 7,
  pageTarget: 'all',
  triggerType: 'delay_seconds',
  triggerValue: 3,
  targetAudience: 'all',
  content: {
    title: '',
    subtitle: 'OMIAÁ ALQUIMIA',
    description: '',
    imageUrl: '',
    videoUrl: '',
    bgColor: '#FCFAF7',
    textColor: '#14281D',
    buttonColor: '#C5A059',
    buttonTextColor: '#14281D',
    buttonText: 'Aproveitar Agora',
    buttonLink: 'products'
  },
  couponConfig: {
    code: '',
    discountValue: 10,
    discountType: 'percentage'
  }
};

export const AdminPopupsERP: React.FC = () => {
  const { products, showToast } = useShop();
  const [popups, setPopups] = useState<Popup[]>(getSavedPopups);
  const [leads, setLeads] = useState(getSavedLeads);

  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'analytics'>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal Create/Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopupId, setEditingPopupId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Popup, 'id' | 'createdAt' | 'updatedAt' | 'stats'>>(EMPTY_POPUP);

  // Live Preview Modal State
  const [previewPopup, setPreviewPopup] = useState<Popup | null>(null);

  useEffect(() => {
    savePopups(popups);
  }, [popups]);

  // Overall statistics
  const totalPopups = popups.length;
  const activePopupsCount = popups.filter((p) => p.active).length;
  const totalViews = popups.reduce((acc, p) => acc + (p.stats?.views || 0), 0);
  const totalClicks = popups.reduce((acc, p) => acc + (p.stats?.clicks || 0), 0);
  const totalConversions = popups.reduce((acc, p) => acc + (p.stats?.conversions || 0), 0);
  const totalLeads = leads.length;
  const totalSalesAttributed = popups.reduce((acc, p) => acc + (p.stats?.attributedSales || 0), 0);
  const overallConversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : '0.0';

  // Filtered Popups
  const filteredPopups = popups.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? p.active : !p.active);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Leads
  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.popupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingPopupId(null);
    setFormData(EMPTY_POPUP);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (popup: Popup) => {
    setEditingPopupId(popup.id);
    const { id, createdAt, updatedAt, stats, ...rest } = popup;
    setFormData(rest);
    setIsModalOpen(true);
  };

  const handleSavePopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.title.trim()) {
      showToast('Atenção', 'Preencha o nome interno e o título do pop-up.', 'alert');
      return;
    }

    if (editingPopupId) {
      // Edit existing
      setPopups((prev) =>
        prev.map((p) => {
          if (p.id === editingPopupId) {
            return {
              ...p,
              ...formData,
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        })
      );
      showToast('Pop-up Atualizado!', `Campanha "${formData.name}" foi editada com sucesso.`, 'success');
    } else {
      // Create new
      const newPopup: Popup = {
        ...formData,
        id: 'popup-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        stats: {
          views: 0,
          clicks: 0,
          conversions: 0,
          leadsCaptured: 0,
          couponsUsed: 0,
          attributedSales: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPopups((prev) => [newPopup, ...prev]);
      showToast('Pop-up Criado!', `Campanha "${formData.name}" cadastrada com sucesso.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setPopups((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = !p.active;
          showToast('Status Alterado', `Pop-up ${newStatus ? 'ativado' : 'desativado'}.`, 'info');
          return { ...p, active: newStatus, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const handleDuplicate = (popup: Popup) => {
    const duplicated: Popup = {
      ...popup,
      id: 'popup-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: `${popup.name} (Cópia)`,
      stats: { views: 0, clicks: 0, conversions: 0, leadsCaptured: 0, couponsUsed: 0, attributedSales: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPopups((prev) => [duplicated, ...prev]);
    showToast('Campanha Duplicada!', `Cópia de "${popup.name}" criada.`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${name}"?`)) {
      setPopups((prev) => prev.filter((p) => p.id !== id));
      showToast('Pop-up Excluído', `Campanha "${name}" removida.`, 'info');
    }
  };

  const handleResetStats = (id: string) => {
    if (confirm('Zerar estatísticas desta campanha?')) {
      setPopups((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              stats: { views: 0, clicks: 0, conversions: 0, leadsCaptured: 0, couponsUsed: 0, attributedSales: 0 }
            };
          }
          return p;
        })
      );
      showToast('Métricas Zeradas', 'Estatísticas reiniciadas.', 'info');
    }
  };

  const getTypeBadgeLabel = (type: PopupType) => {
    switch (type) {
      case 'newsletter': return 'Newsletter Lead';
      case 'promotion': return 'Promoção Geral';
      case 'coupon': return 'Cupom de Desconto';
      case 'free_shipping': return 'Frete Grátis';
      case 'launch': return 'Lançamento';
      case 'featured_product': return 'Produto em Destaque';
      case 'notice': return 'Aviso / Notificação';
      case 'seasonal': return 'Campanha Sazonal';
      default: return type;
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#2C4837] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3527] border border-[#2C4837] text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Módulo de Marketing ERP</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-wide text-[#FAF7F2]">
            Gerenciador de Pop-ups & Campanhas
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B2A6] font-light leading-relaxed">
            Crie, agende e analise pop-ups promocionais, formulários de newsletter e gatilhos automatizados sem tocar em código.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={() => exportLeadsToCSV(leads)}
            className="px-4 py-2.5 rounded-2xl bg-[#1B3527] hover:bg-[#2C4837] text-[#C5A059] font-bold text-xs uppercase tracking-wider transition-all border border-[#2C4837] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Leads ({leads.length})</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-[#C5A059] hover:bg-[#d4b068] text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pop-up</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <Layers className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Campanhas Ativas
            </span>
            <span className="font-serif font-bold text-2xl text-[#14281D]">
              {activePopupsCount} <span className="text-xs text-[#8C7A5B] font-sans font-normal">/ {totalPopups}</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <Eye className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Visualizações Totais
            </span>
            <span className="font-serif font-bold text-2xl text-[#14281D]">
              {totalViews.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <Mail className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Leads Capturados
            </span>
            <span className="font-serif font-bold text-2xl text-[#14281D]">
              {totalLeads}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Taxa de Conversão
            </span>
            <span className="font-serif font-bold text-2xl text-[#14281D]">
              {overallConversionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] p-2 flex flex-wrap gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C5A059]" />
          <span>Campanhas ({popups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Mail className="w-4 h-4 text-[#C5A059]" />
          <span>Leads da Newsletter ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#C5A059]" />
          <span>Relatório de Conversões</span>
        </button>
      </div>

      {/* TAB 1: CAMPAIGNS LIST */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          
          {/* Controls & Search */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7A5B]" />
              <input
                type="text"
                placeholder="Buscar por nome ou título do pop-up..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#8C7A5B]">
                <Filter className="w-3.5 h-3.5" />
                <span>Tipo:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] focus:outline-none"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="promotion">Promoção</option>
                  <option value="coupon">Cupom</option>
                  <option value="free_shipping">Frete Grátis</option>
                  <option value="launch">Lançamento</option>
                  <option value="featured_product">Produto Destaque</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8C7A5B]">
                <span>Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="active">Apenas Ativos</option>
                  <option value="inactive">Apenas Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Popups */}
          <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
            {filteredPopups.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Layers className="w-12 h-12 text-[#E2D9C8] mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#14281D]">Nenhum pop-up encontrado</h3>
                <p className="text-xs text-[#8C7A5B]">Ajuste os filtros ou crie uma nova campanha promocional.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                      <th className="py-3.5 px-4">Status / Prioridade</th>
                      <th className="py-3.5 px-4">Campanha</th>
                      <th className="py-3.5 px-4">Gatilho & Local</th>
                      <th className="py-3.5 px-4">Visualizações</th>
                      <th className="py-3.5 px-4">Conversões</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9C8]/50 text-xs">
                    {filteredPopups.map((popup) => {
                      const convRate = popup.stats.views > 0 ? ((popup.stats.conversions / popup.stats.views) * 100).toFixed(1) : '0.0';

                      return (
                        <tr key={popup.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleActive(popup.id)}
                                title={popup.active ? 'Desativar Pop-up' : 'Ativar Pop-up'}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                  popup.active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {popup.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                              <span className="text-[10px] font-mono font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E2D9C8] text-[#8C7A5B]">
                                P{popup.priority}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#14281D] hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => handleOpenEditModal(popup)}>
                                  {popup.name}
                                </span>
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#14281D]/5 border border-[#C5A059]/30 text-[#C5A059]">
                                  {getTypeBadgeLabel(popup.type)}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#5A6B5D] truncate max-w-xs">{popup.content.title}</p>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-[11px] text-[#5A6B5D]">
                            <div className="space-y-0.5">
                              <span className="font-semibold block text-[#14281D]">
                                {popup.triggerType === 'delay_seconds' && `Tempo (${popup.triggerValue || 3}s)`}
                                {popup.triggerType === 'scroll_percent' && `Scroll (${popup.triggerValue || 30}%)`}
                                {popup.triggerType === 'exit_intent' && 'Exit Intent (Intenção de Saída)'}
                                {popup.triggerType === 'on_load' && 'Ao carregar'}
                                {popup.triggerType === 'page_views' && `${popup.triggerValue || 2} Páginas Vistas`}
                              </span>
                              <span className="text-[10px] text-[#8C7A5B] block">
                                Pág: {popup.pageTarget === 'all' ? 'Todo o Site' : popup.pageTarget}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono font-semibold text-[#14281D]">
                            {popup.stats.views.toLocaleString('pt-BR')}
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-emerald-700 block">
                                {popup.stats.conversions} <span className="text-[10px] font-normal font-sans text-[#8C7A5B]">({convRate}%)</span>
                              </span>
                              {popup.stats.attributedSales > 0 && (
                                <span className="text-[10px] text-[#C5A059] font-bold block">
                                  R$ {popup.stats.attributedSales.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewPopup(popup)}
                                title="Visualizar prévia ao vivo"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E2D9C8] text-[#14281D] transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(popup)}
                                title="Editar Campanha"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] text-[#14281D] transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDuplicate(popup)}
                                title="Duplicar Pop-up"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E2D9C8] text-[#14281D] transition-all"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleResetStats(popup.id)}
                                title="Zerar Estatísticas"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-amber-100 text-amber-800 transition-all"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(popup.id, popup.name)}
                                title="Excluir Pop-up"
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: NEWSLETTER LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs flex justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7A5B]" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou origem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none"
              />
            </div>

            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="px-4 py-2 rounded-2xl bg-[#C5A059] text-[#14281D] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Mail className="w-12 h-12 text-[#E2D9C8] mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#14281D]">Nenhum lead capturado ainda</h3>
                <p className="text-xs text-[#8C7A5B]">Ative uma campanha de Newsletter para começar a capturar e-mails de clientes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                      <th className="py-3.5 px-4">Nome</th>
                      <th className="py-3.5 px-4">E-mail</th>
                      <th className="py-3.5 px-4">Data de Inscrição</th>
                      <th className="py-3.5 px-4">Origem / Pop-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9C8]/50 text-xs">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-4 px-4 font-bold text-[#14281D]">{lead.name}</td>
                        <td className="py-4 px-4 font-mono text-[#5A6B5D]">{lead.email}</td>
                        <td className="py-4 px-4 text-[#8C7A5B]">
                          {new Date(lead.createdAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#14281D]/5 text-[#14281D] text-[10px] font-bold border border-[#E2D9C8]">
                            {lead.source}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS REPORT */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#14281D]">Desempenho por Pop-up</h3>
                <p className="text-xs text-[#8C7A5B]">Comparativo de eficiência, cliques e conversões de vendas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popups.map((p) => {
                const convRate = p.stats.views > 0 ? ((p.stats.conversions / p.stats.views) * 100).toFixed(1) : '0.0';
                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E2D9C8] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#C5A059] tracking-wider block">
                          {getTypeBadgeLabel(p.type)}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#14281D] mt-0.5">{p.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                        {p.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E2D9C8]">
                      <div className="p-2 bg-white rounded-xl border border-[#E2D9C8]">
                        <span className="text-[9px] text-[#8C7A5B] block uppercase">Vistas</span>
                        <span className="font-mono font-bold text-sm text-[#14281D]">{p.stats.views}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-[#E2D9C8]">
                        <span className="text-[9px] text-[#8C7A5B] block uppercase">Cliques</span>
                        <span className="font-mono font-bold text-sm text-[#14281D]">{p.stats.clicks}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-[#E2D9C8]">
                        <span className="text-[9px] text-[#8C7A5B] block uppercase">Conversão</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">{convRate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#14281D] text-[#FAF7F2] border-b border-[#2C4837] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-lg text-[#FAF7F2]">
                  {editingPopupId ? 'Editar Campanha de Pop-up' : 'Nova Campanha de Pop-up'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#2C4837] text-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePopup} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Basic Identifiers */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C5A059]" />
                  <span>1. Identificação da Campanha</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Nome Interno (Administrativo)</label>
                    <input
                      type="text"
                      placeholder="Ex: Newsletter Boas-Vindas 10% OFF"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Tipo de Pop-up</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as PopupType })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none"
                    >
                      <option value="newsletter">Newsletter (Captura de E-mail)</option>
                      <option value="promotion">Promoção Geral</option>
                      <option value="coupon">Cupom de Desconto</option>
                      <option value="free_shipping">Frete Grátis</option>
                      <option value="launch">Lançamento de Produto</option>
                      <option value="featured_product">Produto em Destaque</option>
                      <option value="notice">Aviso / Notificação</option>
                      <option value="seasonal">Campanha Sazonal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="popupActiveCheck"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-[#C5A059] rounded border-[#E2D9C8] focus:ring-[#C5A059]"
                    />
                    <label htmlFor="popupActiveCheck" className="text-xs font-bold text-[#14281D] cursor-pointer">
                      Ativar Campanha Imediatamente
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Prioridade de Exibição</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    >
                      <option value={1}>1 (Mais Alta)</option>
                      <option value={2}>2 (Alta)</option>
                      <option value={3}>3 (Média)</option>
                      <option value={5}>5 (Normal)</option>
                      <option value={10}>10 (Baixa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Repetir Após (Dias)</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.repeatAfterDays}
                      onChange={(e) => setFormData({ ...formData, repeatAfterDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Visual Content */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>2. Conteúdo Visual & Mensagem</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Título do Pop-up</label>
                    <input
                      type="text"
                      placeholder="Ex: Desperte Seu Ritual Ancestral"
                      value={formData.content.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, title: e.target.value }
                      })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Subtítulo Superior</label>
                    <input
                      type="text"
                      placeholder="Ex: PRIMEIRA COMPRA NA OMIAÁ"
                      value={formData.content.subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, subtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14281D] block mb-1">Descrição Promocional</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva o texto explicativo do benefício..."
                    value={formData.content.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content, description: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">URL da Imagem Ilustrativa (Opcional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.content.imageUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, imageUrl: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Texto do Botão de Ação</label>
                    <input
                      type="text"
                      placeholder="Ex: Garantir Desconto"
                      value={formData.content.buttonText}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, buttonText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Triggers & Location */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-[#C5A059]" />
                  <span>3. Regras de Exibição & Disparadores</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Onde Exibir</label>
                    <select
                      value={formData.pageTarget}
                      onChange={(e) => setFormData({ ...formData, pageTarget: e.target.value as PopupPageTarget })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    >
                      <option value="all">Todo o Site</option>
                      <option value="home">Apenas na Home</option>
                      <option value="products">Apenas em Produtos</option>
                      <option value="blog">Apenas no Blog</option>
                      <option value="botanical">Apenas no Guia das Ervas</option>
                      <option value="cart">Apenas no Carrinho</option>
                      <option value="checkout">Apenas no Checkout</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Gatilho de Disparo</label>
                    <select
                      value={formData.triggerType}
                      onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as PopupTriggerType })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    >
                      <option value="delay_seconds">Após X Segundos</option>
                      <option value="scroll_percent">Ao Rolar X% da Página</option>
                      <option value="exit_intent">Exit Intent (Tentativa de Saída)</option>
                      <option value="on_load">Ao Entrar no Site</option>
                      <option value="page_views">Após X Páginas Vistas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Valor do Gatilho</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.triggerValue || 3}
                      onChange={(e) => setFormData({ ...formData, triggerValue: Number(e.target.value) })}
                      placeholder="Ex: 3 (segundos ou %)"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Coupons config */}
              {(formData.type === 'coupon' || formData.type === 'promotion' || formData.type === 'newsletter') && (
                <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#C5A059]" />
                    <span>4. Cupom Promocional Integrado (Opcional)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#14281D] block mb-1">Código do Cupom</label>
                      <input
                        type="text"
                        placeholder="Ex: ALQUIMIA10"
                        value={formData.couponConfig?.code || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          couponConfig: {
                            code: e.target.value.toUpperCase(),
                            discountValue: formData.couponConfig?.discountValue || 10,
                            discountType: formData.couponConfig?.discountType || 'percentage'
                          }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono font-bold text-[#14281D]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#14281D] block mb-1">Valor do Desconto</label>
                      <input
                        type="number"
                        value={formData.couponConfig?.discountValue || 10}
                        onChange={(e) => setFormData({
                          ...formData,
                          couponConfig: {
                            code: formData.couponConfig?.code || '',
                            discountValue: Number(e.target.value),
                            discountType: formData.couponConfig?.discountType || 'percentage'
                          }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#14281D] block mb-1">Tipo de Desconto</label>
                      <select
                        value={formData.couponConfig?.discountType || 'percentage'}
                        onChange={(e) => setFormData({
                          ...formData,
                          couponConfig: {
                            code: formData.couponConfig?.code || '',
                            discountValue: formData.couponConfig?.discountValue || 10,
                            discountType: e.target.value as 'percentage' | 'fixed'
                          }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                      >
                        <option value="percentage">Porcentagem (%)</option>
                        <option value="fixed">Valor Fixo em Reais (R$)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2D9C8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#C5A059] text-[#14281D] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#d4b068]"
                >
                  Salvar Campanha
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden font-sans flex flex-col md:flex-row">
            
            <button
              onClick={() => setPreviewPopup(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 text-[#14281D] flex items-center justify-center border border-[#E2D9C8]"
            >
              <X className="w-4 h-4" />
            </button>

            {previewPopup.content.imageUrl && (
              <div className="md:w-5/12 relative h-48 md:h-auto bg-[#14281D] shrink-0">
                <img src={previewPopup.content.imageUrl} alt={previewPopup.content.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 md:p-8 flex-1 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                {previewPopup.content.subtitle || 'PRÉVIA DO POP-UP'}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#14281D]">{previewPopup.content.title}</h3>
              <p className="text-xs text-[#5A6B5D] leading-relaxed">{previewPopup.content.description}</p>

              {previewPopup.couponConfig?.code && (
                <div className="p-3 bg-[#14281D] text-[#FAF7F2] rounded-xl flex justify-between items-center text-xs font-mono font-bold">
                  <span>CUPOM: {previewPopup.couponConfig.code}</span>
                  <span className="text-[#C5A059]">COPIAR</span>
                </div>
              )}

              <button className="w-full py-3 rounded-xl bg-[#C5A059] text-[#14281D] font-bold text-xs uppercase tracking-wider">
                {previewPopup.content.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
