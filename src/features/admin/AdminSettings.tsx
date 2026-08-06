import React, { useState } from 'react';
import {
  Building2,
  PhoneCall,
  Share2,
  Palette,
  LayoutTemplate,
  Footprints,
  Search,
  Zap,
  FileText,
  ShoppingBag,
  Sliders,
  Server,
  Save,
  CheckCircle,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Plus,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck,
  Globe,
  Lock,
  Mail,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StoreSettings } from '../../types/settings';
import { DEFAULT_STORE_SETTINGS } from '../../utils/storeSettings';
import { saveLogoSettings } from '../../utils/logoSettings';

export type SettingsTabId =
  | 'brand'
  | 'contact'
  | 'social'
  | 'visualIdentity'
  | 'homepage'
  | 'footer'
  | 'seo'
  | 'integrations'
  | 'policies'
  | 'store'
  | 'appearance'
  | 'system';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetStoreSettings, importStoreSettings, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<SettingsTabId>('brand');
  const [formData, setFormData] = useState<StoreSettings>(storeSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; time: string; type: string; msg: string }>>([
    { id: '1', time: '10:42:15', type: 'INFO', msg: 'Sistema de configurações da loja inicializado.' },
    { id: '2', time: '10:45:00', type: 'SUCCESS', msg: 'Cache de ativos estáticos sincronizado.' },
    { id: '3', time: '10:50:22', type: 'INFO', msg: 'Sincronização Supabase realizada com sucesso.' }
  ]);

  // Keep local form data in sync if storeSettings changes externally
  React.useEffect(() => {
    setFormData(storeSettings);
  }, [storeSettings]);

  const tabs = [
    { id: 'brand', label: 'Marca', icon: Building2, desc: 'Nome, missão, visão e slogan' },
    { id: 'contact', label: 'Contato', icon: PhoneCall, desc: 'E-mail, WhatsApp e endereço' },
    { id: 'social', label: 'Redes Sociais', icon: Share2, desc: 'Instagram, TikTok e perfis' },
    { id: 'visualIdentity', label: 'Identidade Visual', icon: Palette, desc: 'Logos, favicon e paleta' },
    { id: 'homepage', label: 'Página Inicial', icon: LayoutTemplate, desc: 'Hero, banners e seções' },
    { id: 'footer', label: 'Rodapé', icon: Footprints, desc: 'Links, copyright e CNPJ' },
    { id: 'seo', label: 'SEO & Analytics', icon: Search, desc: 'Meta tags, Pixel e GTM' },
    { id: 'integrations', label: 'Integrações', icon: Zap, desc: 'Mercado Pago, PIX e SMTP' },
    { id: 'policies', label: 'Políticas', icon: FileText, desc: 'Privacidade, trocas e termos' },
    { id: 'store', label: 'Regras da Loja', icon: ShoppingBag, desc: 'Frete, estoque e moedas' },
    { id: 'appearance', label: 'Aparência', icon: Sliders, desc: 'Fontes, bordas e tema' },
    { id: 'system', label: 'Sistema', icon: Server, desc: 'Manutenção, backup e logs' }
  ];

  // Helper to update deeply nested settings fields
  const handleNestedChange = (section: keyof StoreSettings, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
    setIsSaved(false);
  };

  const handleLogoFileUpload = (
    field: 'logoMainUrl' | 'logoLightUrl' | 'logoDarkUrl' | 'faviconUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Imagem Muito Grande', 'Selecione uma imagem de até 5MB.', 'alert');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleNestedChange('visualIdentity', field, result);
        saveLogoSettings({
          logoUrl: field === 'logoMainUrl' ? result : (formData.visualIdentity.logoMainUrl || '/logo.svg'),
          heightSm: formData.visualIdentity.heightSm || 48,
          heightMd: formData.visualIdentity.heightMd || 64,
          blendMode: formData.visualIdentity.blendMode || 'normal',
          opacity: 100,
          contrast: formData.visualIdentity.contrast || 100,
          brightness: formData.visualIdentity.brightness || 100,
          invertInDarkTheme: false
        });
        window.dispatchEvent(new Event('omiaa_logo_changed'));
        showToast('Imagem Carregada!', 'A imagem foi importada com sucesso.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateStoreSettings(formData);

    // Sync logo settings helper
    saveLogoSettings({
      logoUrl: formData.visualIdentity.logoMainUrl || '/logo.svg',
      heightSm: formData.visualIdentity.heightSm || 48,
      heightMd: formData.visualIdentity.heightMd || 64,
      blendMode: formData.visualIdentity.blendMode || 'normal',
      opacity: 100,
      contrast: formData.visualIdentity.contrast || 100,
      brightness: formData.visualIdentity.brightness || 100,
      invertInDarkTheme: false
    });
    window.dispatchEvent(new Event('omiaa_logo_changed'));

    setIsSaved(true);
    showToast('Configurações Salvas!', 'Todas as alterações foram refletidas imediatamente na loja.', 'success');
    
    // Add log
    setSystemLogs((prev) => [
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), type: 'SUCCESS', msg: 'Configurações e marca atualizadas via Painel Administrativo.' },
      ...prev
    ]);

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Deseja realmente restaurar todas as configurações para o padrão de fábrica?')) {
      resetStoreSettings();
      setFormData(DEFAULT_STORE_SETTINGS);
      showToast('Configurações Restauradas', 'As opções padrões da Omiaá foram reestabelecidas.', 'info');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `configuracoes_omiaa_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup Exportado!', 'Arquivo JSON baixado com sucesso.', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.brand) {
          importStoreSettings(parsed);
          setFormData(parsed);
          showToast('Configurações Importadas!', 'Sua loja foi atualizada a partir do arquivo JSON.', 'success');
        } else {
          showToast('Arquivo Inválido', 'O arquivo enviado não possui o formato de configurações.', 'alert');
        }
      } catch (err) {
        showToast('Erro ao Ler JSON', 'Não foi possível importar as configurações.', 'alert');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Painel de Controle Central</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#14281D]">
            Configurações da Loja
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Gerencie todos os aspectos operacionais, visuais, SEO, integrações e mensagens da Omiaá Alquimia Ancestral sem precisar editar código.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl border border-[#E2D9C8] text-xs font-semibold text-[#14281D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5"
            title="Exportar Backup em JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Exportar Backup</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl border border-[#E2D9C8] text-xs font-semibold text-[#14281D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Importar</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-98"
          >
            {isSaved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-[#C5A059]" />}
            <span>{isSaved ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Main Container Layout (Grid: Sidebar Navigation + Content Body) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-3 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1 sticky top-20">
          <div className="px-3 py-2 border-b border-[#E2D9C8]/60 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
              Seções de Configuração
            </span>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTabId)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
                      : 'hover:bg-[#FAF7F2] text-[#2D3748] hover:text-[#14281D]'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isActive ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#14281D]/5 text-[#8C7A5B]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-xs truncate">{tab.label}</span>
                    <span className={`block text-[10px] truncate ${isActive ? 'text-[#A8B2A6]' : 'text-[#718096]'}`}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2D9C8]/60 px-2">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões da Loja</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Panel (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <form onSubmit={handleSaveAll} className="space-y-6">
            
            {/* 1. INFORMAÇÕES DA MARCA */}
            {activeTab === 'brand' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Building2 className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Informações da Marca</h2>
                    <p className="text-xs text-[#718096]">Identificação institucional, valores e manifesto da Omiaá.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Nome da Marca</label>
                    <input
                      type="text"
                      value={formData.brand.name}
                      onChange={(e) => handleNestedChange('brand', 'name', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Nome Fantasia</label>
                    <input
                      type="text"
                      value={formData.brand.tradingName}
                      onChange={(e) => handleNestedChange('brand', 'tradingName', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Razão Social Oficial</label>
                    <input
                      type="text"
                      value={formData.brand.corporateName}
                      onChange={(e) => handleNestedChange('brand', 'corporateName', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Slogan Institucional</label>
                    <input
                      type="text"
                      value={formData.brand.slogan}
                      onChange={(e) => handleNestedChange('brand', 'slogan', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Descrição Institucional</label>
                    <textarea
                      rows={3}
                      value={formData.brand.description}
                      onChange={(e) => handleNestedChange('brand', 'description', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Missão</label>
                    <textarea
                      rows={3}
                      value={formData.brand.mission}
                      onChange={(e) => handleNestedChange('brand', 'mission', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Visão</label>
                    <textarea
                      rows={3}
                      value={formData.brand.vision}
                      onChange={(e) => handleNestedChange('brand', 'vision', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Valores Alquímicos</label>
                    <input
                      type="text"
                      value={formData.brand.values}
                      onChange={(e) => handleNestedChange('brand', 'values', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. INFORMAÇÕES DE CONTATO */}
            {activeTab === 'contact' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <PhoneCall className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Informações de Contato & Suporte</h2>
                    <p className="text-xs text-[#718096]">Canais diretos exibidos no cabeçalho, rodapé e e-mails aos clientes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">E-mail Principal</label>
                    <input
                      type="email"
                      value={formData.contact.primaryEmail}
                      onChange={(e) => handleNestedChange('contact', 'primaryEmail', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">E-mail de Suporte / Sac</label>
                    <input
                      type="email"
                      value={formData.contact.supportEmail}
                      onChange={(e) => handleNestedChange('contact', 'supportEmail', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Telefone Fixo / PABX</label>
                    <input
                      type="text"
                      value={formData.contact.phone}
                      onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">WhatsApp Atendimento</label>
                    <input
                      type="text"
                      value={formData.contact.whatsapp}
                      onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.contact.city}
                      onChange={(e) => handleNestedChange('contact', 'city', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      value={formData.contact.state}
                      onChange={(e) => handleNestedChange('contact', 'state', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Endereço Completo (Opcional)</label>
                    <input
                      type="text"
                      value={formData.contact.address || ''}
                      onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">CEP Sede / Origem</label>
                    <input
                      type="text"
                      value={formData.contact.cep || ''}
                      onChange={(e) => handleNestedChange('contact', 'cep', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Horário de Atendimento</label>
                    <input
                      type="text"
                      value={formData.contact.businessHours}
                      onChange={(e) => handleNestedChange('contact', 'businessHours', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. REDES SOCIAIS */}
            {activeTab === 'social' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Share2 className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Perfis de Redes Sociais</h2>
                    <p className="text-xs text-[#718096]">URLs dos perfis oficiais vinculados aos ícones no rodapé e menu.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Instagram</label>
                    <input
                      type="text"
                      value={formData.social.instagram}
                      onChange={(e) => handleNestedChange('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Facebook</label>
                    <input
                      type="text"
                      value={formData.social.facebook}
                      onChange={(e) => handleNestedChange('social', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">YouTube</label>
                    <input
                      type="text"
                      value={formData.social.youtube}
                      onChange={(e) => handleNestedChange('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">TikTok</label>
                    <input
                      type="text"
                      value={formData.social.tiktok}
                      onChange={(e) => handleNestedChange('social', 'tiktok', e.target.value)}
                      placeholder="https://tiktok.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Pinterest</label>
                    <input
                      type="text"
                      value={formData.social.pinterest}
                      onChange={(e) => handleNestedChange('social', 'pinterest', e.target.value)}
                      placeholder="https://pinterest.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={formData.social.linkedin}
                      onChange={(e) => handleNestedChange('social', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Spotify (Playlist Ritual Opcional)</label>
                    <input
                      type="text"
                      value={formData.social.spotify || ''}
                      onChange={(e) => handleNestedChange('social', 'spotify', e.target.value)}
                      placeholder="https://open.spotify.com/..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. IDENTIDADE VISUAL */}
            {activeTab === 'visualIdentity' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Palette className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Identidade Visual & Gestão do Logotipo</h2>
                    <p className="text-xs text-[#718096]">Faça upload das imagens de marca, ajuste o tamanho, contraste, brilho e pré-visualize o resultado em tempo real.</p>
                  </div>
                </div>

                {/* 1. UPLOADS DE LOGO */}
                <div className="space-y-4">
                  <h3 className="font-bold text-[#14281D] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#C5A059]" /> Arquivos de Imagem da Marca (Upload / URL)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Logo Principal */}
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#14281D] uppercase tracking-wider">Logo Principal (Oficial)</label>
                        <label htmlFor="upload-logo-main" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14281D] text-[#C5A059] rounded-xl text-[11px] font-bold hover:bg-[#1E3A2B] transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Upload Imagem
                        </label>
                        <input
                          id="upload-logo-main"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoFileUpload('logoMainUrl', e)}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.visualIdentity.logoMainUrl}
                        onChange={(e) => {
                          handleNestedChange('visualIdentity', 'logoMainUrl', e.target.value);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        placeholder="URL ou base64 da imagem..."
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    {/* Logo Versao Clara */}
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#14281D] uppercase tracking-wider">Logo Versão Clara (Cabeçalho)</label>
                        <label htmlFor="upload-logo-light" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14281D] text-[#C5A059] rounded-xl text-[11px] font-bold hover:bg-[#1E3A2B] transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Upload Imagem
                        </label>
                        <input
                          id="upload-logo-light"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoFileUpload('logoLightUrl', e)}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.visualIdentity.logoLightUrl}
                        onChange={(e) => handleNestedChange('visualIdentity', 'logoLightUrl', e.target.value)}
                        placeholder="URL ou base64 da imagem..."
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    {/* Logo Versao Escura */}
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#14281D] uppercase tracking-wider">Logo Versão Escura (Rodapé)</label>
                        <label htmlFor="upload-logo-dark" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14281D] text-[#C5A059] rounded-xl text-[11px] font-bold hover:bg-[#1E3A2B] transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Upload Imagem
                        </label>
                        <input
                          id="upload-logo-dark"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoFileUpload('logoDarkUrl', e)}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.visualIdentity.logoDarkUrl}
                        onChange={(e) => handleNestedChange('visualIdentity', 'logoDarkUrl', e.target.value)}
                        placeholder="URL ou base64 da imagem..."
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    {/* Favicon */}
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#14281D] uppercase tracking-wider">Favicon (.ico, .png, .svg)</label>
                        <label htmlFor="upload-favicon" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14281D] text-[#C5A059] rounded-xl text-[11px] font-bold hover:bg-[#1E3A2B] transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" /> Upload Imagem
                        </label>
                        <input
                          id="upload-favicon"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoFileUpload('faviconUrl', e)}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.visualIdentity.faviconUrl}
                        onChange={(e) => handleNestedChange('visualIdentity', 'faviconUrl', e.target.value)}
                        placeholder="URL do ícone da aba..."
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. AJUSTES DE TAMANHO E FILTROS DO LOGOTIPO */}
                <div className="space-y-4 pt-2 border-t border-[#E2D9C8]">
                  <h3 className="font-bold text-[#14281D] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C5A059]" /> Ajustes de Dimensão & Tratamento de Imagem
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs p-5 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8]">
                    {/* Altura Desktop */}
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-[#14281D]">
                        <span>Altura do Logo no Desktop (`heightMd`)</span>
                        <span className="text-[#C5A059]">{formData.visualIdentity.heightMd || 64} px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="160"
                        step="2"
                        value={formData.visualIdentity.heightMd || 64}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleNestedChange('visualIdentity', 'heightMd', val);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>

                    {/* Altura Mobile */}
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-[#14281D]">
                        <span>Altura do Logo no Mobile (`heightSm`)</span>
                        <span className="text-[#C5A059]">{formData.visualIdentity.heightSm || 48} px</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="2"
                        value={formData.visualIdentity.heightSm || 48}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleNestedChange('visualIdentity', 'heightSm', val);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>

                    {/* Modo de Mesclagem */}
                    <div className="space-y-2">
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider">Modo de Mesclagem (Mix Blend Mode)</label>
                      <select
                        value={formData.visualIdentity.blendMode || 'multiply'}
                        onChange={(e) => {
                          handleNestedChange('visualIdentity', 'blendMode', e.target.value);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="multiply">Multiply (Multiplicação Automática com Fundo)</option>
                        <option value="color-burn">Color Burn (Superposição de Cor Intensa)</option>
                        <option value="screen">Screen (Trama para Fundos Escuros)</option>
                        <option value="darken">Darken (Escurecer Fundo)</option>
                        <option value="normal">Normal (Sem Filtro de Mesclagem)</option>
                      </select>
                    </div>

                    {/* Contraste */}
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-[#14281D]">
                        <span>Ajuste de Contraste (`contrast`)</span>
                        <span className="text-[#C5A059]">{formData.visualIdentity.contrast || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        step="5"
                        value={formData.visualIdentity.contrast || 100}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleNestedChange('visualIdentity', 'contrast', val);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>

                    {/* Brilho */}
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex justify-between font-bold text-[#14281D]">
                        <span>Ajuste de Brilho (`brightness`)</span>
                        <span className="text-[#C5A059]">{formData.visualIdentity.brightness || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        step="5"
                        value={formData.visualIdentity.brightness || 100}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleNestedChange('visualIdentity', 'brightness', val);
                          window.dispatchEvent(new Event('omiaa_logo_changed'));
                        }}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PAINEL DE PRÉ-VISUALIZAÇÃO DO LOGOTIPO */}
                <div className="space-y-4 pt-2 border-t border-[#E2D9C8]">
                  <h3 className="font-bold text-[#14281D] text-xs uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#C5A059]" /> Pré-Visualização em Tempo Real do Logotipo
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Fundo Claro */}
                    <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] flex flex-col items-center justify-center space-y-3 text-center min-h-[140px]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#718096]">Aplicação em Fundo Claro</span>
                      <div className="flex items-center justify-center min-h-[64px]">
                        <img
                          src={formData.visualIdentity.logoMainUrl || '/logo.svg'}
                          alt="Pré-visualização do Logo"
                          style={{
                            height: `${formData.visualIdentity.heightMd || 64}px`,
                            mixBlendMode: (formData.visualIdentity.blendMode && formData.visualIdentity.blendMode !== 'normal' ? formData.visualIdentity.blendMode : 'multiply') as any,
                            filter: `contrast(${formData.visualIdentity.contrast || 100}%) brightness(${formData.visualIdentity.brightness || 100}%)`
                          }}
                          className="max-w-full object-contain transition-all"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.svg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Fundo Escuro */}
                    <div className="p-6 bg-[#14281D] rounded-2xl border border-[#2C4837] flex flex-col items-center justify-center space-y-3 text-center min-h-[140px]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">Aplicação em Fundo Escuro (Cabeçalho / Rodapé)</span>
                      <div className="flex items-center justify-center min-h-[64px]">
                        <img
                          src={formData.visualIdentity.logoLightUrl || formData.visualIdentity.logoMainUrl || '/logo.svg'}
                          alt="Pré-visualização do Logo Escuro"
                          style={{
                            height: `${formData.visualIdentity.heightMd || 64}px`,
                            mixBlendMode: (formData.visualIdentity.blendMode && formData.visualIdentity.blendMode !== 'normal' ? formData.visualIdentity.blendMode : 'screen') as any,
                            filter: `contrast(${formData.visualIdentity.contrast || 100}%) brightness(${formData.visualIdentity.brightness || 100}%)`
                          }}
                          className="max-w-full object-contain transition-all"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.svg';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PALETA DE CORES */}
                <div className="space-y-4 pt-2 border-t border-[#E2D9C8]">
                  <h3 className="font-bold text-[#14281D] text-xs uppercase tracking-wider">Paleta de Cores do Tema</h3>
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Cor Primária (Verde Floresta)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.visualIdentity.primaryColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'primaryColor', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-[#E2D9C8] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.visualIdentity.primaryColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'primaryColor', e.target.value)}
                          className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Cor Secundária (Ouro Nobre)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.visualIdentity.secondaryColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'secondaryColor', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-[#E2D9C8] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.visualIdentity.secondaryColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'secondaryColor', e.target.value)}
                          className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Cor de Destaque (Argila)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.visualIdentity.accentColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'accentColor', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-[#E2D9C8] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.visualIdentity.accentColor}
                          onChange={(e) => handleNestedChange('visualIdentity', 'accentColor', e.target.value)}
                          className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PÁGINA INICIAL */}
            {activeTab === 'homepage' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <LayoutTemplate className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Página Inicial (Home)</h2>
                    <p className="text-xs text-[#718096]">Configuração do Hero, banners promocionais e visibilidade das seções.</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Imagem de Fundo do Banner Principal (Hero)</label>
                      <input
                        type="text"
                        value={formData.homepage.heroBannerUrl}
                        onChange={(e) => handleNestedChange('homepage', 'heroBannerUrl', e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Título Principal</label>
                      <input
                        type="text"
                        value={formData.homepage.heroTitle}
                        onChange={(e) => handleNestedChange('homepage', 'heroTitle', e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Texto do Botão Principal CTA</label>
                      <input
                        type="text"
                        value={formData.homepage.heroCtaText}
                        onChange={(e) => handleNestedChange('homepage', 'heroCtaText', e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Subtítulo Hero</label>
                      <textarea
                        rows={2}
                        value={formData.homepage.heroSubtitle}
                        onChange={(e) => handleNestedChange('homepage', 'heroSubtitle', e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Banner Promocional no Topo */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#14281D] uppercase tracking-wider">
                        Barra Promocional Superior (Announcement Bar)
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.homepage.promoBannerActive}
                          onChange={(e) => handleNestedChange('homepage', 'promoBannerActive', e.target.checked)}
                          className="accent-[#14281D] w-4 h-4"
                        />
                        <span className="font-semibold text-[#14281D]">Ativa no Site</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={formData.homepage.promoBannerText}
                      onChange={(e) => handleNestedChange('homepage', 'promoBannerText', e.target.value)}
                      placeholder="Texto da barra de topo"
                      className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D]"
                    />
                  </div>

                  {/* Seções Exibidas */}
                  <div className="space-y-2">
                    <span className="block font-bold text-[#14281D] uppercase tracking-wider">
                      Seções Visíveis na Home
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(formData.homepage.sectionToggles).map(([secKey, isEnabled]) => (
                        <label key={secKey} className="p-3 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                          <span className="font-semibold text-[#14281D] capitalize">{secKey}</span>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                homepage: {
                                  ...prev.homepage,
                                  sectionToggles: {
                                    ...prev.homepage.sectionToggles,
                                    [secKey]: e.target.checked
                                  }
                                }
                              }))
                            }
                            className="accent-[#14281D] w-4 h-4"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. RODAPÉ */}
            {activeTab === 'footer' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Footprints className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Conteúdo do Rodapé (Footer)</h2>
                    <p className="text-xs text-[#718096]">Títulos das colunas, dados fiscais, endereço legal e copyright.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Título Coluna Sobre</label>
                    <input
                      type="text"
                      value={formData.footer.aboutTitle}
                      onChange={(e) => handleNestedChange('footer', 'aboutTitle', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Título Coluna Suporte</label>
                    <input
                      type="text"
                      value={formData.footer.supportTitle}
                      onChange={(e) => handleNestedChange('footer', 'supportTitle', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Texto Institucional do Rodapé</label>
                    <textarea
                      rows={2}
                      value={formData.footer.aboutText}
                      onChange={(e) => handleNestedChange('footer', 'aboutText', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Texto de Copyright</label>
                    <input
                      type="text"
                      value={formData.footer.copyrightText}
                      onChange={(e) => handleNestedChange('footer', 'copyrightText', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Informações Fiscais (CNPJ / Endereço Legal)</label>
                    <input
                      type="text"
                      value={formData.footer.cnpjText}
                      onChange={(e) => handleNestedChange('footer', 'cnpjText', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. SEO */}
            {activeTab === 'seo' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Search className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">SEO & Analytics</h2>
                    <p className="text-xs text-[#718096]">Configurações de robôs, Meta Tags, Open Graph, Google Tag Manager e Meta Pixel.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Meta Title Padrão</label>
                    <input
                      type="text"
                      value={formData.seo.defaultMetaTitle}
                      onChange={(e) => handleNestedChange('seo', 'defaultMetaTitle', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Meta Description Padrão</label>
                    <textarea
                      rows={2}
                      value={formData.seo.defaultMetaDescription}
                      onChange={(e) => handleNestedChange('seo', 'defaultMetaDescription', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Google Tag Manager ID (GTM)</label>
                    <input
                      type="text"
                      value={formData.seo.googleTagManagerId}
                      onChange={(e) => handleNestedChange('seo', 'googleTagManagerId', e.target.value)}
                      placeholder="GTM-XXXXXX"
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs font-mono text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Meta Pixel ID (Facebook)</label>
                    <input
                      type="text"
                      value={formData.seo.metaPixelId}
                      onChange={(e) => handleNestedChange('seo', 'metaPixelId', e.target.value)}
                      placeholder="123456789012345"
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs font-mono text-[#14281D]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Conteúdo do Robots.txt</label>
                    <textarea
                      rows={3}
                      value={formData.seo.robotsTxt}
                      onChange={(e) => handleNestedChange('seo', 'robotsTxt', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono text-[#14281D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. INTEGRAÇÕES */}
            {activeTab === 'integrations' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Zap className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Integrações & APIs</h2>
                    <p className="text-xs text-[#718096]">Credenciais do Mercado Pago, PIX, Melhor Envio e Servidor de E-mail SMTP.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                    <span className="font-bold text-[#14281D] uppercase tracking-wider block">Mercado Pago</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Access Token</label>
                        <input
                          type="password"
                          value={formData.integrations.mercadoPagoAccessToken}
                          onChange={(e) => handleNestedChange('integrations', 'mercadoPagoAccessToken', e.target.value)}
                          className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Public Key</label>
                        <input
                          type="text"
                          value={formData.integrations.mercadoPagoPublicKey}
                          onChange={(e) => handleNestedChange('integrations', 'mercadoPagoPublicKey', e.target.value)}
                          className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                    <span className="font-bold text-[#14281D] uppercase tracking-wider block">PIX Direto</span>
                    <div>
                      <label className="block font-semibold mb-1">Chave PIX</label>
                      <input
                        type="text"
                        value={formData.integrations.pixKey}
                        onChange={(e) => handleNestedChange('integrations', 'pixKey', e.target.value)}
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                    <span className="font-bold text-[#14281D] uppercase tracking-wider block">Melhor Envio</span>
                    <div>
                      <label className="block font-semibold mb-1">Token da API</label>
                      <input
                        type="password"
                        value={formData.integrations.melhorEnvioToken}
                        onChange={(e) => handleNestedChange('integrations', 'melhorEnvioToken', e.target.value)}
                        className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. POLÍTICAS */}
            {activeTab === 'policies' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <FileText className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Políticas Legais da Loja</h2>
                    <p className="text-xs text-[#718096]">Textos exibidos nos modais de Checkout, Privacidade e Trocas.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Política de Privacidade</label>
                    <textarea
                      rows={3}
                      value={formData.policies.privacyPolicy}
                      onChange={(e) => handleNestedChange('policies', 'privacyPolicy', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Termos de Uso</label>
                    <textarea
                      rows={3}
                      value={formData.policies.termsOfUse}
                      onChange={(e) => handleNestedChange('policies', 'termsOfUse', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Política de Trocas & Devoluções</label>
                    <textarea
                      rows={3}
                      value={formData.policies.exchangePolicy}
                      onChange={(e) => handleNestedChange('policies', 'exchangePolicy', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. LOJA & REGRAS */}
            {activeTab === 'store' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Regras de Negócio & Loja</h2>
                    <p className="text-xs text-[#718096]">Limiares de frete grátis, pedido mínimo, estoque e paginação.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Mínimo para Frete Grátis (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.store.freeShippingThreshold}
                      onChange={(e) => handleNestedChange('store', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs font-mono text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Valor Mínimo de Pedido (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.store.minOrderValue}
                      onChange={(e) => handleNestedChange('store', 'minOrderValue', parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs font-mono text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Alerta de Estoque Mínimo</label>
                    <input
                      type="number"
                      value={formData.store.lowStockThreshold}
                      onChange={(e) => handleNestedChange('store', 'lowStockThreshold', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs font-mono text-[#14281D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. APARÊNCIA */}
            {activeTab === 'appearance' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Sliders className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Aparência & Estilização</h2>
                    <p className="text-xs text-[#718096]">Fontes, temas, raios de borda e largura do container.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Fonte dos Títulos</label>
                    <select
                      value={formData.appearance.fontHeading}
                      onChange={(e) => handleNestedChange('appearance', 'fontHeading', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    >
                      <option value="Playfair Display">Playfair Display (Clássico Alquímico)</option>
                      <option value="Cinzel">Cinzel (Imperial / Ritualístico)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond (Elegante)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Fonte do Corpo</label>
                    <select
                      value={formData.appearance.fontBody}
                      onChange={(e) => handleNestedChange('appearance', 'fontBody', e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2.5 text-xs text-[#14281D]"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Moderno e Limpo)</option>
                      <option value="Inter">Inter</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 12. SISTEMA */}
            {activeTab === 'system' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
                  <div className="p-2.5 bg-[#14281D]/5 rounded-2xl text-[#14281D]">
                    <Server className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#14281D]">Manutenção & Diagnóstico do Sistema</h2>
                    <p className="text-xs text-[#718096]">Modo manutenção, limpeza de cache e registros de log em tempo real.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Modo Manutenção */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-[#14281D] uppercase tracking-wider">Modo Manutenção</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.system.maintenanceMode}
                          onChange={(e) => handleNestedChange('system', 'maintenanceMode', e.target.checked)}
                          className="accent-[#14281D] w-4 h-4"
                        />
                        <span className="font-bold text-red-700">Ativar Tela de Manutenção</span>
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      value={formData.system.maintenanceMessage}
                      onChange={(e) => handleNestedChange('system', 'maintenanceMessage', e.target.value)}
                      placeholder="Mensagem exibida aos visitantes durante a manutenção"
                      className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D]"
                    />
                  </div>

                  {/* Logs do Sistema */}
                  <div className="space-y-2">
                    <span className="block font-bold text-[#14281D] uppercase tracking-wider">Logs de Execução Recentes</span>
                    <div className="bg-[#14281D] text-[#A8B2A6] p-4 rounded-2xl font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
                      {systemLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-2">
                          <span className="text-[#C5A059]">[{log.time}]</span>
                          <span className="font-bold text-white">[{log.type}]</span>
                          <span>{log.msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Action Bar */}
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs">
              <span className="text-xs text-[#718096]">
                Todas as alterações são sincronizadas com o banco de dados Supabase e o cache local do navegador.
              </span>

              <button
                type="submit"
                className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Salvar Configurações</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;
