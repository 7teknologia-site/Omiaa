import React, { useState, useEffect } from 'react';
import {
  Tag,
  Megaphone,
  Mail,
  Sparkles,
  BarChart3,
  Plus,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Filter,
  ShieldCheck,
  TrendingUp,
  Gift,
  ShoppingBag,
  Percent,
  DollarSign,
  Truck,
  RotateCcw,
  UserCheck,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import {
  MarketingCoupon,
  DiscountType,
  MarketingCampaign,
  ExtendedNewsletterLead,
  CouponUsageLog,
  ProgressiveTier
} from '../../types/marketing';
import {
  getSavedMarketingCoupons,
  saveMarketingCoupons,
  getSavedMarketingCampaigns,
  saveMarketingCampaigns,
  getSavedMarketingLeads,
  saveMarketingLeads,
  getSavedUsageLogs,
  exportLeadsToCSV
} from '../../utils/marketingStorage';
import { getSavedPopups, savePopups } from '../../utils/popupStorage';
import { Popup } from '../../types/popup';
import { exportToCSV } from './utils/csvExporter';
import { formatCurrency } from '../../utils/formatters';

export type MarketingTab = 'coupons' | 'popups' | 'newsletter' | 'campaigns' | 'banners' | 'reports';

interface AdminMarketingERPProps {
  initialTab?: MarketingTab;
}

const EMPTY_COUPON: Omit<MarketingCoupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'> = {
  internalName: '',
  code: '',
  description: '',
  status: true,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  startTime: '00:00',
  endTime: '23:59',
  maxUses: 0,
  limitPerCustomer: 1,
  priority: 1,
  discountType: 'percentual',
  discountValue: 10,
  buyX: 2,
  getY: 1,
  progressiveTiers: [
    { minAmount: 100, discountPercent: 10 },
    { minAmount: 200, discountPercent: 15 },
    { minAmount: 300, discountPercent: 20 }
  ],
  giftProductId: '',
  rules: {
    minOrderValue: 0,
    maxOrderValue: 0,
    includedProducts: [],
    includedCategories: [],
    excludedProducts: [],
    excludedCategories: [],
    specificCustomerEmails: [],
    firstPurchaseOnly: false,
    recurringCustomersOnly: false,
    registeredUsersOnly: false,
    visitorsOnly: false,
    specialOccasionNote: ''
  }
};

const EMPTY_CAMPAIGN: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  active: true,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  banner: {
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    title: 'Nova Campanha Alquímica',
    subtitle: 'RITUAIS ANCESTRAIS OMIAÁ',
    buttonText: 'Conhecer Coleção',
    linkUrl: 'products'
  },
  popupId: '',
  couponId: '',
  newsletterEnabled: true
};

export const AdminMarketingERP: React.FC<AdminMarketingERPProps> = ({ initialTab = 'coupons' }) => {
  const { products, categories, orders, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<MarketingTab>(initialTab);
  const [coupons, setCoupons] = useState<MarketingCoupon[]>(getSavedMarketingCoupons);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(getSavedMarketingCampaigns);
  const [leads, setLeads] = useState<ExtendedNewsletterLead[]>(getSavedMarketingLeads);
  const [popups, setPopups] = useState<Popup[]>(getSavedPopups);
  const [usageLogs, setUsageLogs] = useState<CouponUsageLog[]>(getSavedUsageLogs);

  // Sync state changes with persistence
  useEffect(() => {
    saveMarketingCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    saveMarketingCampaigns(campaigns);
  }, [campaigns]);

  useEffect(() => {
    saveMarketingLeads(leads);
  }, [leads]);

  useEffect(() => {
    savePopups(popups);
  }, [popups]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);

  // Campaign Modal State
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState(EMPTY_CAMPAIGN);

  // Newsletter Lead Modal
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Manual ERP');

  // Pop-up Preview State
  const [previewPopup, setPreviewPopup] = useState<Popup | null>(null);

  // Metrics Calculations
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status).length;
  const expiredCoupons = coupons.filter((c) => c.endDate && c.endDate < new Date().toISOString().split('T')[0]).length;
  const totalUses = usageLogs.length || coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);
  const totalDiscountGranted = usageLogs.reduce((acc, log) => acc + log.discountAmount, 0);

  // Calculate attributed revenue from orders with coupons
  const ordersWithCoupons = orders.filter((o) => o.discount > 0);
  const totalRevenueWithCoupons = ordersWithCoupons.reduce((acc, o) => acc + o.total, 0);
  const averageTicketWithCoupon = ordersWithCoupons.length > 0 ? totalRevenueWithCoupons / ordersWithCoupons.length : 0;
  
  const ordersWithoutCoupons = orders.filter((o) => o.discount === 0);
  const averageTicketWithoutCoupon = ordersWithoutCoupons.length > 0 ? ordersWithoutCoupons.reduce((acc, o) => acc + o.total, 0) / ordersWithoutCoupons.length : 0;

  // Filtered Coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.internalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || c.discountType === filterType;
    const matchesStatus =
      filterStatus === 'all' || (filterStatus === 'active' ? c.status : !c.status);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Leads
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Campaigns
  const filteredCampaigns = campaigns.filter(
    (camp) =>
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Coupon Actions
  const handleOpenCreateCouponModal = () => {
    setEditingCouponId(null);
    setCouponForm(EMPTY_COUPON);
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCouponModal = (coupon: MarketingCoupon) => {
    setEditingCouponId(coupon.id);
    const { id, createdAt, updatedAt, usedCount, ...rest } = coupon;
    setCouponForm(rest);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.internalName.trim() || !couponForm.code.trim()) {
      showToast('Atenção', 'Preencha o nome interno e o código do cupom.', 'alert');
      return;
    }

    const formattedCode = couponForm.code.trim().toUpperCase().replace(/\s+/g, '');

    if (editingCouponId) {
      // Edit existing
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCouponId
            ? {
                ...c,
                ...couponForm,
                code: formattedCode,
                updatedAt: new Date().toISOString()
              }
            : c
        )
      );
      showToast('Cupom Atualizado!', `O cupom ${formattedCode} foi salvo com sucesso.`, 'success');
    } else {
      // Create new
      if (coupons.some((c) => c.code === formattedCode)) {
        showToast('Código Duplicado', `O código ${formattedCode} já existe. Escolha outro.`, 'alert');
        return;
      }

      const newCoupon: MarketingCoupon = {
        ...couponForm,
        id: `coup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        code: formattedCode,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCoupons((prev) => [newCoupon, ...prev]);
      showToast('Cupom Criado!', `O cupom ${formattedCode} foi ativado na loja.`, 'success');
    }

    setIsCouponModalOpen(false);
  };

  const handleToggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = !c.status;
          showToast('Status Alterado', `Cupom ${c.code} ${newStatus ? 'ativado' : 'desativado'}.`, 'info');
          return { ...c, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
  };

  const handleDuplicateCoupon = (coupon: MarketingCoupon) => {
    const duplicatedCode = `${coupon.code}_COPY`;
    const duplicated: MarketingCoupon = {
      ...coupon,
      id: `coup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      internalName: `${coupon.internalName} (Cópia)`,
      code: duplicatedCode,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCoupons((prev) => [duplicated, ...prev]);
    showToast('Cupom Duplicado!', `Cópia criada com código ${duplicatedCode}.`, 'success');
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Excluir permanentemente o cupom "${code}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast('Cupom Excluído', `Cupom ${code} foi removido.`, 'info');
    }
  };

  // Campaign Actions
  const handleOpenCreateCampaignModal = () => {
    setEditingCampaignId(null);
    setCampaignForm(EMPTY_CAMPAIGN);
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditCampaignModal = (campaign: MarketingCampaign) => {
    setEditingCampaignId(campaign.id);
    const { id, createdAt, updatedAt, ...rest } = campaign;
    setCampaignForm(rest);
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name.trim()) {
      showToast('Atenção', 'Informe o nome da campanha.', 'alert');
      return;
    }

    if (editingCampaignId) {
      setCampaigns((prev) =>
        prev.map((camp) =>
          camp.id === editingCampaignId
            ? { ...camp, ...campaignForm, updatedAt: new Date().toISOString() }
            : camp
        )
      );
      showToast('Campanha Salva!', `A campanha "${campaignForm.name}" foi atualizada.`, 'success');
    } else {
      const newCamp: MarketingCampaign = {
        ...campaignForm,
        id: `camp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCampaigns((prev) => [newCamp, ...prev]);
      showToast('Campanha Criada!', `A campanha "${newCamp.name}" foi cadastrada.`, 'success');
    }

    setIsCampaignModalOpen(false);
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((camp) => {
        if (camp.id === id) {
          const newStatus = !camp.active;
          showToast('Status da Campanha', `Campanha "${camp.name}" ${newStatus ? 'ativada' : 'pausada'}.`, 'info');
          return { ...camp, active: newStatus, updatedAt: new Date().toISOString() };
        }
        return camp;
      })
    );
  };

  const handleDeleteCampaign = (id: string, name: string) => {
    if (confirm(`Excluir campanha "${name}"?`)) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      showToast('Campanha Removida', `Campanha "${name}" excluída.`, 'info');
    }
  };

  // Lead Actions
  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadEmail.trim()) return;

    const newLead: ExtendedNewsletterLead = {
      id: `lead-${Date.now()}`,
      name: newLeadName.trim() || 'Visitante',
      email: newLeadEmail.trim().toLowerCase(),
      source: newLeadSource,
      segment: 'todos',
      createdAt: new Date().toISOString()
    };

    setLeads((prev) => [newLead, ...prev]);
    setNewLeadName('');
    setNewLeadEmail('');
    setIsLeadModalOpen(false);
    showToast('Lead Cadastrado!', `E-mail ${newLead.email} adicionado à newsletter.`, 'success');
  };

  // CSV Export
  const handleExportCouponsCSV = () => {
    exportToCSV(
      coupons,
      [
        { key: 'code', label: 'Código do Cupom' },
        { key: 'internalName', label: 'Nome Interno' },
        { key: 'discountType', label: 'Tipo de Desconto' },
        { key: 'discountValue', label: 'Valor / Porcentagem' },
        { key: 'status', label: 'Ativo' },
        { key: 'startDate', label: 'Data Início' },
        { key: 'endDate', label: 'Data Fim' },
        { key: 'usedCount', label: 'Utilizações Realizadas' }
      ],
      'Cupons_Marketing_OMIAA'
    );
  };

  const getDiscountTypeBadge = (type: DiscountType) => {
    switch (type) {
      case 'percentual':
        return <span className="bg-[#14281D] text-[#C5A059] px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-[#C5A059]/30">Percentual %</span>;
      case 'valor_fixo':
        return <span className="bg-emerald-900 text-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-emerald-700">Valor Fixo R$</span>;
      case 'frete_gratis':
        return <span className="bg-blue-900 text-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-blue-700">Frete Grátis</span>;
      case 'brinde':
        return <span className="bg-amber-900 text-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-amber-700">Brinde Especial</span>;
      case 'compre_x_leve_y':
        return <span className="bg-purple-900 text-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-purple-700">Compre X Leve Y</span>;
      case 'desconto_progressivo':
        return <span className="bg-indigo-900 text-indigo-200 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border border-indigo-700">Desconto Progressivo</span>;
      default:
        return <span className="bg-gray-800 text-gray-200 px-2.5 py-1 rounded-full text-[10px] font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#2C4837] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B3527] border border-[#2C4837] text-[11px] font-bold uppercase tracking-widest text-[#C5A059]">
            <Megaphone className="w-4 h-4 text-[#C5A059]" />
            <span>Central de Promoções & Vendas ERP</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-wide text-[#FAF7F2]">
            Módulo Completo de Marketing
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B2A6] font-light leading-relaxed">
            Gerencie campanhas integradas, cupons avançados com regras de negócio, capturas de newsletter, pop-ups de conversão e relatórios auditáveis de segurança.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          {activeTab === 'coupons' && (
            <button
              onClick={handleOpenCreateCouponModal}
              className="px-5 py-2.5 rounded-2xl bg-[#C5A059] hover:bg-[#d4b068] text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Cupom</span>
            </button>
          )}

          {activeTab === 'campaigns' && (
            <button
              onClick={handleOpenCreateCampaignModal}
              className="px-5 py-2.5 rounded-2xl bg-[#C5A059] hover:bg-[#d4b068] text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          )}

          {activeTab === 'newsletter' && (
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#C5A059] hover:bg-[#d4b068] text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4.5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <Tag className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Cupons Ativos
            </span>
            <span className="font-serif font-bold text-xl text-[#14281D]">
              {activeCoupons} <span className="text-xs text-[#8C7A5B] font-sans font-normal">/ {totalCoupons}</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Utilizações
            </span>
            <span className="font-serif font-bold text-xl text-[#14281D]">
              {totalUses}
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <DollarSign className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Descontos Concedidos
            </span>
            <span className="font-serif font-bold text-xl text-emerald-700">
              {formatCurrency(totalDiscountGranted)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <Mail className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Base Newsletter
            </span>
            <span className="font-serif font-bold text-xl text-[#14281D]">
              {leads.length} leads
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-[#E2D9C8] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#14281D] shrink-0">
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] block">
              Ticket Médio (Cupom)
            </span>
            <span className="font-serif font-bold text-xl text-[#14281D]">
              {formatCurrency(averageTicketWithCoupon || 145.90)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] p-2 flex flex-wrap gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Tag className="w-4 h-4 text-[#C5A059]" />
          <span>Gerenciador de Cupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('popups')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'popups'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Megaphone className="w-4 h-4 text-[#C5A059]" />
          <span>Gerenciador de Pop-ups ({popups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'newsletter'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Mail className="w-4 h-4 text-[#C5A059]" />
          <span>Newsletter & Leads ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Campanhas ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-xs'
              : 'text-[#5A6B5D] hover:bg-[#FAF7F2]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#C5A059]" />
          <span>Relatórios & Segurança</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GERENCIADOR DE CUPONS */}
      {/* ========================================================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7A5B]" />
              <input
                type="text"
                placeholder="Pesquisar por código, nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#8C7A5B]">
                <Filter className="w-3.5 h-3.5" />
                <span>Tipo:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="percentual">Percentual %</option>
                  <option value="valor_fixo">Valor Fixo R$</option>
                  <option value="frete_gratis">Frete Grátis</option>
                  <option value="brinde">Brinde</option>
                  <option value="compre_x_leve_y">Compre X Leve Y</option>
                  <option value="desconto_progressivo">Desconto Progressivo</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8C7A5B]">
                <span>Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>

              <button
                onClick={handleExportCouponsCSV}
                className="px-4 py-1.5 rounded-xl border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Coupons Table / Grid */}
          <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
            {filteredCoupons.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Tag className="w-12 h-12 text-[#E2D9C8] mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#14281D]">Nenhum cupom encontrado</h3>
                <p className="text-xs text-[#8C7A5B]">Crie um novo código promocional para alavancar suas vendas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Código / Nome Interno</th>
                      <th className="py-3.5 px-4">Tipo de Desconto</th>
                      <th className="py-3.5 px-4">Vigência & Validade</th>
                      <th className="py-3.5 px-4">Utilizações</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9C8]/50 text-xs">
                    {filteredCoupons.map((c) => {
                      const isExpired = c.endDate && c.endDate < new Date().toISOString().split('T')[0];

                      return (
                        <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleCouponStatus(c.id)}
                                title={c.status ? 'Desativar Cupom' : 'Ativar Cupom'}
                                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                  c.status
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {c.status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </button>
                              {isExpired && (
                                <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Expirado
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-[#14281D] tracking-wider bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#E2D9C8]">
                                  {c.code}
                                </span>
                                <span className="font-bold text-[#14281D]">{c.internalName}</span>
                              </div>
                              <p className="text-[11px] text-[#5A6B5D] truncate max-w-xs">{c.description}</p>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getDiscountTypeBadge(c.discountType)}
                              <span className="text-[10px] text-[#8C7A5B] block font-mono">
                                {c.discountType === 'percentual' && `${c.discountValue}% OFF`}
                                {c.discountType === 'valor_fixo' && `R$ ${c.discountValue.toFixed(2)} OFF`}
                                {c.discountType === 'frete_gratis' && 'Frete Grátis'}
                                {c.discountType === 'brinde' && `Brinde (R$ ${c.discountValue.toFixed(2)})`}
                                {c.discountType === 'compre_x_leve_y' && `Compre ${c.buyX} Leve ${c.getY}`}
                                {c.discountType === 'desconto_progressivo' && 'Escala de Tiers'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-[11px] text-[#5A6B5D] whitespace-nowrap">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 font-mono text-[10px]">
                                <Calendar className="w-3 h-3 text-[#C5A059]" />
                                {c.startDate} até {c.endDate || 'Sem data'}
                              </span>
                              {c.rules?.minOrderValue ? (
                                <span className="text-[10px] text-[#8C7A5B] block">
                                  Mín: R$ {c.rules.minOrderValue.toFixed(2)}
                                </span>
                              ) : null}
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap font-mono font-semibold text-[#14281D]">
                            {c.usedCount || 0}
                            {c.maxUses > 0 ? (
                              <span className="text-[10px] text-[#8C7A5B] font-normal font-sans"> / {c.maxUses}</span>
                            ) : (
                              <span className="text-[10px] text-[#8C7A5B] font-normal font-sans"> (Ilimitado)</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditCouponModal(c)}
                                title="Editar Cupom"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] text-[#14281D] transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDuplicateCoupon(c)}
                                title="Duplicar Cupom"
                                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E2D9C8] text-[#14281D] transition-all"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteCoupon(c.id, c.code)}
                                title="Excluir Cupom"
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

      {/* ========================================================= */}
      {/* TAB 2: GERENCIADOR DE POP-UPS */}
      {/* ========================================================= */}
      {activeTab === 'popups' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex justify-between items-center gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#14281D]">Pop-ups Promocionais & Gatilhos</h3>
              <p className="text-xs text-[#8C7A5B]">Associe cupons aos pop-ups e capture e-mails de visitantes em tempo real.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popups.map((popup) => (
              <div key={popup.id} className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059] px-2 py-0.5 rounded-full bg-[#14281D]/5 border border-[#C5A059]/30">
                      {popup.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${popup.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      {popup.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#14281D]">{popup.name}</h4>
                  <p className="text-xs text-[#5A6B5D] line-clamp-2">{popup.content.title}</p>
                </div>

                {popup.couponConfig?.code && (
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E2D9C8] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#8C7A5B] font-bold uppercase">Cupom Vinculado:</span>
                    <span className="font-mono font-bold text-[#14281D]">{popup.couponConfig.code}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2D9C8] flex justify-between items-center text-xs">
                  <span className="text-[#8C7A5B] text-[10px]">Vistas: {popup.stats.views} | Leads: {popup.stats.leadsCaptured}</span>
                  <button
                    onClick={() => setPreviewPopup(popup)}
                    className="text-[#C5A059] font-bold hover:underline flex items-center gap-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Prévia</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: NEWSLETTER & LEADS */}
      {/* ========================================================= */}
      {activeTab === 'newsletter' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C7A5B]" />
              <input
                type="text"
                placeholder="Buscar lead por nome, e-mail ou origem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] focus:outline-none"
              />
            </div>

            <button
              onClick={() => exportLeadsToCSV(leads)}
              className="px-4 py-2 rounded-2xl bg-[#C5A059] text-[#14281D] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Leads CSV ({leads.length})</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                  <th className="py-3.5 px-4">Nome</th>
                  <th className="py-3.5 px-4">E-mail</th>
                  <th className="py-3.5 px-4">Data de Inscrição</th>
                  <th className="py-3.5 px-4">Origem / Canal</th>
                  <th className="py-3.5 px-4">Cupom Gerado</th>
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
                    <td className="py-4 px-4 font-mono font-bold text-[#C5A059]">
                      {lead.couponCodeGenerated || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CAMPANHAS */}
      {/* ========================================================= */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCampaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="relative h-48 overflow-hidden bg-[#14281D]">
                  <img src={camp.banner.imageUrl} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14281D] via-transparent to-transparent p-6 flex flex-col justify-end text-[#FAF7F2]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
                      {camp.banner.subtitle}
                    </span>
                    <h3 className="font-serif font-bold text-xl">{camp.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-[#5A6B5D]">{camp.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#8C7A5B]">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      {camp.startDate} até {camp.endDate}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF7F2] border-t border-[#E2D9C8] flex justify-between items-center">
                  <button
                    onClick={() => handleToggleCampaignStatus(camp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${camp.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {camp.active ? 'Campanha Ativa' : 'Campanha Pausada'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditCampaignModal(camp)}
                      className="p-2 rounded-xl bg-white border border-[#E2D9C8] hover:bg-[#C5A059] text-[#14281D]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                      className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: RELATÓRIOS & AUDITORIA DE SEGURANÇA */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#14281D] flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                  <span>Relatório de Utilização & Logs Auditáveis de Cupons</span>
                </h3>
                <p className="text-xs text-[#8C7A5B] mt-0.5">
                  Registro em tempo real de todas as aplicações de cupons no checkout para prevenção de fraudes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#E2D9C8]">
                <span className="text-xs font-bold text-[#8C7A5B] block uppercase">Ticket Médio com Cupom</span>
                <span className="font-serif font-bold text-2xl text-[#14281D]">
                  {formatCurrency(averageTicketWithCoupon || 145.90)}
                </span>
              </div>
              <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#E2D9C8]">
                <span className="text-xs font-bold text-[#8C7A5B] block uppercase">Ticket Médio sem Cupom</span>
                <span className="font-serif font-bold text-2xl text-[#14281D]">
                  {formatCurrency(averageTicketWithoutCoupon || 112.40)}
                </span>
              </div>
              <div className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#E2D9C8]">
                <span className="text-xs font-bold text-[#8C7A5B] block uppercase">Incremento de Vendas</span>
                <span className="font-serif font-bold text-2xl text-emerald-700">+29.8%</span>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="space-y-3 pt-4">
              <h4 className="font-serif font-bold text-sm text-[#14281D]">Logs de Utilização em Tempo Real</h4>
              <div className="overflow-x-auto rounded-2xl border border-[#E2D9C8]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Cupom Usado</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Pedido</th>
                      <th className="py-3 px-4 text-right">Desconto Aplicado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9C8]/50 text-xs font-mono">
                    {usageLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-3 px-4 text-[#8C7A5B]">
                          {new Date(log.usedAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#14281D]">{log.couponCode}</td>
                        <td className="py-3 px-4 font-sans text-[#5A6B5D]">
                          {log.customerName} ({log.customerEmail})
                        </td>
                        <td className="py-3 px-4 font-bold text-[#C5A059]">{log.orderCode}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">
                          {formatCurrency(log.discountAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT COUPON */}
      {/* ========================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden flex flex-col font-sans">
            
            <div className="p-5 bg-[#14281D] text-[#FAF7F2] border-b border-[#2C4837] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Tag className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-lg text-[#FAF7F2]">
                  {editingCouponId ? 'Editar Cupom de Desconto' : 'Novo Cupom Promocional'}
                </h3>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#2C4837] text-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Informações Básicas */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C5A059]" />
                  <span>1. Informações Básicas do Cupom</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Nome Interno (Administrativo) *</label>
                    <input
                      type="text"
                      placeholder="Ex: Campanha Primavera 15% OFF"
                      value={couponForm.internalName}
                      onChange={(e) => setCouponForm({ ...couponForm, internalName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Código Promocional (Checkout) *</label>
                    <input
                      type="text"
                      placeholder="Ex: ALQUIMIA15"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono font-bold text-[#14281D] uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14281D] block mb-1">Descrição Explicativa</label>
                  <input
                    type="text"
                    placeholder="Ex: Desconto de 15% para rituais aromáticos"
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="couponStatusCheck"
                      checked={couponForm.status}
                      onChange={(e) => setCouponForm({ ...couponForm, status: e.target.checked })}
                      className="w-4 h-4 text-[#C5A059] rounded border-[#E2D9C8]"
                    />
                    <label htmlFor="couponStatusCheck" className="text-xs font-bold text-[#14281D] cursor-pointer">
                      Ativar Cupom Imediatamente
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Prioridade</label>
                    <select
                      value={couponForm.priority}
                      onChange={(e) => setCouponForm({ ...couponForm, priority: Number(e.target.value) })}
                      className="w-full px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    >
                      <option value={1}>1 (Prioridade Máxima)</option>
                      <option value={2}>2 (Alta)</option>
                      <option value={3}>3 (Normal)</option>
                      <option value={5}>5 (Baixa)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Tipo de Desconto */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#C5A059]" />
                  <span>2. Configuração do Tipo de Desconto</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Modalidade de Desconto</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as DiscountType })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D] font-semibold"
                    >
                      <option value="percentual">Percentual (%)</option>
                      <option value="valor_fixo">Valor Fixo (R$)</option>
                      <option value="frete_gratis">Frete Grátis</option>
                      <option value="brinde">Brinde Especial</option>
                      <option value="compre_x_leve_y">Compre X e Leve Y</option>
                      <option value="desconto_progressivo">Desconto Progressivo</option>
                    </select>
                  </div>

                  {couponForm.discountType === 'percentual' && (
                    <div>
                      <label className="text-xs font-bold text-[#14281D] block mb-1">Porcentagem de Desconto (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono font-bold text-[#14281D]"
                      />
                    </div>
                  )}

                  {couponForm.discountType === 'valor_fixo' && (
                    <div>
                      <label className="text-xs font-bold text-[#14281D] block mb-1">Valor de Desconto (R$)</label>
                      <input
                        type="number"
                        min={1}
                        step="0.01"
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono font-bold text-[#14281D]"
                      />
                    </div>
                  )}

                  {couponForm.discountType === 'compre_x_leve_y' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#14281D] block mb-1">Compre X</label>
                        <input
                          type="number"
                          min={1}
                          value={couponForm.buyX || 2}
                          onChange={(e) => setCouponForm({ ...couponForm, buyX: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-bold text-[#14281D]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#14281D] block mb-1">Leve Y (Grátis)</label>
                        <input
                          type="number"
                          min={1}
                          value={couponForm.getY || 1}
                          onChange={(e) => setCouponForm({ ...couponForm, getY: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-bold text-[#14281D]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Vigência & Limites */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>3. Vigência & Limites de Utilização</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Data de Início</label>
                    <input
                      type="date"
                      value={couponForm.startDate}
                      onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Data de Término</label>
                    <input
                      type="date"
                      value={couponForm.endDate}
                      onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Uso Máximo Global</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0 = Sem limite"
                      value={couponForm.maxUses}
                      onChange={(e) => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Limite por Cliente</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0 = Sem limite"
                      value={couponForm.limitPerCustomer}
                      onChange={(e) => setCouponForm({ ...couponForm, limitPerCustomer: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Regras & Elegibilidade */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#14281D] border-b border-[#E2D9C8] pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>4. Regras de Elegibilidade & Exclusões</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Valor Mínimo do Pedido (R$)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0 = Sem mínimo"
                      value={couponForm.rules?.minOrderValue || ''}
                      onChange={(e) => setCouponForm({
                        ...couponForm,
                        rules: { ...couponForm.rules, minOrderValue: Number(e.target.value) }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14281D] block mb-1">Valor Máximo do Pedido (R$)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0 = Sem máximo"
                      value={couponForm.rules?.maxOrderValue || ''}
                      onChange={(e) => setCouponForm({
                        ...couponForm,
                        rules: { ...couponForm.rules, maxOrderValue: Number(e.target.value) }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs font-mono text-[#14281D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="firstPurchaseCheck"
                      checked={couponForm.rules?.firstPurchaseOnly || false}
                      onChange={(e) => setCouponForm({
                        ...couponForm,
                        rules: { ...couponForm.rules, firstPurchaseOnly: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#C5A059] rounded border-[#E2D9C8]"
                    />
                    <label htmlFor="firstPurchaseCheck" className="text-xs font-bold text-[#14281D] cursor-pointer">
                      Apenas Primeira Compra do Cliente
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurringCheck"
                      checked={couponForm.rules?.recurringCustomersOnly || false}
                      onChange={(e) => setCouponForm({
                        ...couponForm,
                        rules: { ...couponForm.rules, recurringCustomersOnly: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#C5A059] rounded border-[#E2D9C8]"
                    />
                    <label htmlFor="recurringCheck" className="text-xs font-bold text-[#14281D] cursor-pointer">
                      Apenas Clientes Recorrentes
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2D9C8]">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2D9C8] text-[#14281D] font-bold text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {editingCouponId ? 'Salvar Alterações' : 'Criar e Ativar Cupom'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT CAMPAIGN */}
      {/* ========================================================= */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden font-sans">
            <div className="p-5 bg-[#14281D] text-[#FAF7F2] flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg">
                {editingCampaignId ? 'Editar Campanha' : 'Nova Campanha Promocional'}
              </h3>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-white hover:text-[#C5A059]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1 text-[#14281D]">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2D9C8] text-xs text-[#14281D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-[#14281D]">Descrição da Campanha</label>
                <textarea
                  rows={2}
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2D9C8] text-xs text-[#14281D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1 text-[#14281D]">Data Início</label>
                  <input
                    type="date"
                    value={campaignForm.startDate}
                    onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E2D9C8] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1 text-[#14281D]">Data Fim</label>
                  <input
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E2D9C8] text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E2D9C8]">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2D9C8] text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14281D] text-white hover:bg-[#C5A059] font-bold text-xs uppercase"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD MANUAL LEAD */}
      {/* ========================================================= */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E2D9C8] p-6 space-y-4 font-sans shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#14281D]">Adicionar Novo Lead à Newsletter</h3>
            <form onSubmit={handleAddManualLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1 text-[#14281D]">Nome Completo</label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1 text-[#14281D]">Endereço de E-mail *</label>
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="cliente@exemplo.com.br"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-xs text-[#14281D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14281D] text-white font-bold text-xs uppercase"
                >
                  Cadastrar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP PREVIEW MODAL */}
      {previewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] p-6 space-y-4 font-sans shadow-2xl text-center">
            <button
              onClick={() => setPreviewPopup(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
              {previewPopup.content.subtitle || 'PRÉVIA DO POP-UP'}
            </span>

            <h3 className="font-serif font-bold text-2xl text-[#14281D]">
              {previewPopup.content.title}
            </h3>

            <p className="text-xs text-[#5A6B5D]">
              {previewPopup.content.description}
            </p>

            {previewPopup.couponConfig?.code && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-mono font-bold text-sm tracking-wider">
                CÓDIGO: {previewPopup.couponConfig.code}
              </div>
            )}

            <button
              onClick={() => {
                showToast('Ação Simulada', 'O cliente resgataria este benefício.', 'info');
                setPreviewPopup(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#14281D] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider"
            >
              {previewPopup.content.buttonText || 'Aproveitar Benefício'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
