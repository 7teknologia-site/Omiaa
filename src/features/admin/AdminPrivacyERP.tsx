import React, { useState, useEffect } from 'react';
import {
  Shield,
  Save,
  RotateCcw,
  Download,
  Eye,
  CheckCircle2,
  FileText,
  Key,
  Database,
  BarChart2,
  Lock,
  Globe,
  Settings,
  AlertCircle,
  ExternalLink,
  Code
} from 'lucide-react';
import {
  getPrivacySettings,
  savePrivacySettings,
  getConsentAuditLogs,
  exportConsentLogsToCSV,
  DEFAULT_PRIVACY_SETTINGS
} from '../../utils/privacyStorage';
import { PrivacySettings, ConsentAuditLog } from '../../types/privacy';

export const AdminPrivacyERP: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>(getPrivacySettings());
  const [logs, setLogs] = useState<ConsentAuditLog[]>(getConsentAuditLogs());
  const [activeTab, setActiveTab] = useState<'banner' | 'tracking' | 'logs' | 'preview'>('banner');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getConsentAuditLogs());
  }, []);

  const handleSave = () => {
    savePrivacySettings(settings);
    showToast('Configurações de privacidade e LGPD salvas com sucesso!');
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações originais de privacidade?')) {
      setSettings(DEFAULT_PRIVACY_SETTINGS);
      savePrivacySettings(DEFAULT_PRIVACY_SETTINGS);
      showToast('Configurações restauradas para o padrão.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTriggerBannerInFrontend = () => {
    window.dispatchEvent(new CustomEvent('omiaa_open_privacy_settings'));
    showToast('Abrindo o painel de privacidade no site...');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2A2421] text-[#D4AF37] flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#2A2421]">
                Privacidade & Conformidade LGPD
              </h1>
              <span className="text-xs bg-[#EFE8DC] text-[#7A6251] px-2.5 py-0.5 rounded-full font-mono font-medium border border-[#D8C7B5]">
                v{settings.termVersion}
              </span>
            </div>
            <p className="text-xs text-[#6B5748] mt-0.5">
              Gestão automatizada de consentimentos de cookies, scripts de rastreamento e auditoria em conformidade com a LGPD.
            </p>
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5C4D42] bg-[#EFE8DC] hover:bg-[#E2D6C5] rounded-xl transition-all border border-[#D8C7B5]"
            title="Restaurar padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl transition-all shadow-md"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 bg-[#2A2421] text-[#FAF7F2] rounded-xl text-xs font-medium flex items-center justify-between shadow-lg animate-fade-in border border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex items-center border-b border-[#D8C7B5] gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'banner'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <FileText className="w-4 h-4 text-[#8B5A2B]" />
          Textos do Banner & Links
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'tracking'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Code className="w-4 h-4 text-[#8B5A2B]" />
          Integrações & Scripts
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Database className="w-4 h-4 text-[#8B5A2B]" />
          Registro de Consentimento ({logs.length})
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Eye className="w-4 h-4 text-[#8B5A2B]" />
          Pré-visualizar Banner
        </button>
      </div>

      {/* TAB 1: BANNER TEXTS & LINKS */}
      {activeTab === 'banner' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: BANNER MESSAGES */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2A2421] border-b border-[#E8DCCF] pb-2">
                Mensagens Principais
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Título do Banner
                </label>
                <input
                  type="text"
                  value={settings.bannerTitle}
                  onChange={(e) => setSettings({ ...settings, bannerTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Descrição Explicativa
                </label>
                <textarea
                  rows={4}
                  value={settings.bannerDescription}
                  onChange={(e) => setSettings({ ...settings, bannerDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Versão dos Termos de Consentimento
                </label>
                <input
                  type="text"
                  value={settings.termVersion}
                  onChange={(e) => setSettings({ ...settings, termVersion: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl font-mono focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                  placeholder="Ex: 1.0.0"
                />
                <p className="text-[11px] text-[#7A6251] mt-1">
                  Ao alterar a versão (ex: de 1.0.0 para 1.1.0), o banner será exibido novamente para todos os usuários solicitando novo consentimento.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: BUTTON TEXTS & LINKS */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2A2421] border-b border-[#E8DCCF] pb-2">
                Rótulos dos Botões & Links Legais
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Texto "Aceitar Todos"
                </label>
                <input
                  type="text"
                  value={settings.acceptAllButtonText}
                  onChange={(e) => setSettings({ ...settings, acceptAllButtonText: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Texto "Recusar Opcionais"
                </label>
                <input
                  type="text"
                  value={settings.rejectOptionalButtonText}
                  onChange={(e) => setSettings({ ...settings, rejectOptionalButtonText: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Texto "Personalizar Preferências"
                </label>
                <input
                  type="text"
                  value={settings.customizeButtonText}
                  onChange={(e) => setSettings({ ...settings, customizeButtonText: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Link da Política de Privacidade
                </label>
                <input
                  type="text"
                  value={settings.privacyPolicyUrl}
                  onChange={(e) => setSettings({ ...settings, privacyPolicyUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Link dos Termos de Uso
                </label>
                <input
                  type="text"
                  value={settings.termsOfUseUrl}
                  onChange={(e) => setSettings({ ...settings, termsOfUseUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8C7B5] rounded-xl focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACKING & SCRIPTS */}
      {activeTab === 'tracking' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="bg-[#EFE8DC] p-4 rounded-xl border border-[#D8C7B5] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#8B5A2B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#5C4D42] leading-relaxed">
              <strong>Mecanismo de Ativação Condicional (LGPD):</strong> Os scripts abaixo são injetados exclusivamente se o visitante conceder autorização para as categorias <em>Analíticos</em> ou <em>Marketing</em>. Nenhuma coleta não autorizada ocorre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GA4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#8B5A2B]">
                <BarChart2 className="w-5 h-5" />
                <h4 className="font-semibold text-sm text-[#2A2421]">Google Analytics 4</h4>
              </div>
              <p className="text-xs text-[#6B5748]">
                Disparado apenas com consentimento para <strong>Cookies Analíticos</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  ID de Medição GA4
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#D8C7B5] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>
            </div>

            {/* GTM */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#8B5A2B]">
                <Globe className="w-5 h-5" />
                <h4 className="font-semibold text-sm text-[#2A2421]">Google Tag Manager</h4>
              </div>
              <p className="text-xs text-[#6B5748]">
                Gerenciador de tags condicionado às regras de privacidade.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  ID do Contêiner GTM
                </label>
                <input
                  type="text"
                  value={settings.googleTagManagerId}
                  onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#D8C7B5] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>
            </div>

            {/* META PIXEL */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#8B5A2B]">
                <Key className="w-5 h-5" />
                <h4 className="font-semibold text-sm text-[#2A2421]">Meta Pixel / Ads</h4>
              </div>
              <p className="text-xs text-[#6B5748]">
                Disparado apenas com consentimento para <strong>Cookies de Marketing</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  ID do Meta Pixel
                </label>
                <input
                  type="text"
                  value={settings.metaPixelId}
                  onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#D8C7B5] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Registros de Auditoria de Consentimento
              </h3>
              <p className="text-xs text-[#6B5748] mt-0.5">
                Histórico imutável para comprovação de conformidade legal perante a ANPD / LGPD.
              </p>
            </div>

            <button
              type="button"
              onClick={() => exportConsentLogsToCSV(logs)}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              Exportar para CSV
            </button>
          </div>

          {/* TABLE OF LOGS */}
          <div className="overflow-x-auto rounded-xl border border-[#D8C7B5] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE8DC] text-[#423833] uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Versão</th>
                  <th className="p-3">Necessários</th>
                  <th className="p-3">Funcionais</th>
                  <th className="p-3">Analíticos</th>
                  <th className="p-3">Marketing</th>
                  <th className="p-3">Navegador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#7A6251]">
                      Nenhum consentimento registrado até o momento.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-mono text-[#2A2421]">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-mono text-[#8B5A2B] font-semibold">
                        v{log.termVersion}
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                          Sim
                        </span>
                      </td>
                      <td className="p-3">
                        {log.functional ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                            Sim
                          </span>
                        ) : (
                          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px]">
                            Não
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {log.analytics ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                            Sim
                          </span>
                        ) : (
                          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px]">
                            Não
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {log.marketing ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                            Sim
                          </span>
                        ) : (
                          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px]">
                            Não
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[10px] text-[#7A6251] max-w-xs truncate" title={log.userAgent}>
                        {log.userAgent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Pré-visualização do Banner
              </h3>
              <p className="text-xs text-[#6B5748]">
                Abaixo está uma simulação em tempo real da aparência do banner no e-commerce.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerBannerInFrontend}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#8B5A2B] bg-[#EFE8DC] hover:bg-[#E2D6C5] rounded-xl border border-[#D8C7B5] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir Banner na Loja
            </button>
          </div>

          {/* SIMULATED MOCKUP */}
          <div className="p-6 bg-[#EFE8DC]/50 rounded-2xl border border-[#D8C7B5] space-y-4">
            <div className="bg-[#FAF7F2] border border-[#D8C7B5] shadow-xl rounded-2xl p-5 text-[#2A2421] max-w-xl mx-auto">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#EFE8DC] border border-[#D8C7B5] flex items-center justify-center shrink-0 text-[#8B5A2B]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2A2421]">
                    {settings.bannerTitle}
                  </h4>
                  <p className="text-xs text-[#5C4D42] mt-1 leading-relaxed">
                    {settings.bannerDescription}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8DCCF] flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#8B5A2B] font-semibold underline cursor-pointer">
                  {settings.customizeButtonText}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C4D42] bg-[#EFE8DC] px-3 py-1.5 rounded-lg border border-[#D8C7B5]">
                    {settings.rejectOptionalButtonText}
                  </span>
                  <span className="text-xs font-semibold text-white bg-[#2A2421] px-4 py-1.5 rounded-lg shadow-sm">
                    {settings.acceptAllButtonText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
