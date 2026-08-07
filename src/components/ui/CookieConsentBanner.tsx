import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cookie, Check, X, Settings2, Lock, ExternalLink, Info, FileText } from 'lucide-react';
import {
  getPrivacySettings,
  getUserConsent,
  saveUserConsent,
  applyConditionalScripts
} from '../../utils/privacyStorage';
import { PrivacySettings, UserCookieConsent } from '../../types/privacy';

export const CookieConsentBanner: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>(getPrivacySettings());
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  // Preference selections state
  const [functional, setFunctional] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  useEffect(() => {
    const currentSettings = getPrivacySettings();
    setSettings(currentSettings);

    const consent = getUserConsent();

    // Check if consent needs to be prompted (either missing or version mismatch)
    if (!consent || consent.version !== currentSettings.termVersion) {
      setShowBanner(true);
    } else {
      // Apply saved script rules
      applyConditionalScripts(consent, currentSettings);
    }

    // Event listener to open modal from footer link or admin preview
    const handleOpenModal = () => {
      const activeConsent = getUserConsent();
      if (activeConsent) {
        setFunctional(activeConsent.functional);
        setAnalytics(activeConsent.analytics);
        setMarketing(activeConsent.marketing);
      } else {
        setFunctional(true);
        setAnalytics(false);
        setMarketing(false);
      }
      setShowPreferences(true);
    };

    window.addEventListener('omiaa_open_privacy_settings', handleOpenModal);
    return () => {
      window.removeEventListener('omiaa_open_privacy_settings', handleOpenModal);
    };
  }, []);

  const handleAcceptAll = () => {
    saveUserConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectOptional = () => {
    saveUserConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    saveUserConsent({
      necessary: true,
      functional,
      analytics,
      marketing
    });
    setShowBanner(false);
    setShowPreferences(false);
  };

  return (
    <>
      {/* BOTTOM FLOATING BANNER */}
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            id="omiaa-cookie-banner"
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-2xl z-[9990] bg-[#FAF7F2] border border-[#D8C7B5] shadow-2xl rounded-2xl p-5 md:p-6 text-[#2A2421]"
          >
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#EFE8DC] border border-[#D8C7B5] flex items-center justify-center shrink-0 text-[#8B5A2B]">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#2A2421] tracking-wide flex items-center gap-2">
                    {settings.bannerTitle}
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#EFE8DC] text-[#7A6251] px-2 py-0.5 rounded border border-[#D8C7B5]">
                    LGPD
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#5C4D42] mt-1 leading-relaxed">
                  {settings.bannerDescription}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 pt-3 border-t border-[#E8DCCF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8B5A2B] hover:text-[#5E3B1B] transition-colors py-2 px-3 rounded-lg hover:bg-[#EFE8DC]/60"
              >
                <Settings2 className="w-4 h-4" />
                {settings.customizeButtonText}
              </button>

              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="flex-1 sm:flex-none text-xs font-medium text-[#5C4D42] bg-[#EFE8DC] hover:bg-[#E2D6C5] border border-[#D8C7B5] transition-all px-3.5 py-2 rounded-xl"
                >
                  {settings.rejectOptionalButtonText}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] transition-all px-4 py-2 rounded-xl shadow-md flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {settings.acceptAllButtonText}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREFERENCES CENTER MODAL */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF7F2] border border-[#D8C7B5] shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col text-[#2A2421] overflow-hidden"
            >
              {/* MODAL HEADER */}
              <div className="p-5 md:p-6 bg-[#EFE8DC]/80 border-b border-[#D8C7B5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D8C7B5] flex items-center justify-center text-[#8B5A2B] shadow-sm">
                    <Shield className="w-5 h-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#2A2421] tracking-wide">
                      Centro de Preferências de Privacidade
                    </h2>
                    <p className="text-xs text-[#6B5748]">
                      Omiaá Alquimia Ancestral • LGPD Compliance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-1.5 rounded-full hover:bg-[#D8C7B5]/40 text-[#5C4D42] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 text-sm text-[#423833]">
                <p className="text-xs md:text-sm text-[#5C4D42] leading-relaxed bg-[#F4EDE2] p-3.5 rounded-xl border border-[#E5D7C5]">
                  Respeitamos sua privacidade e autonomia digital. Escolha quais categorias de cookies deseja autorizar para navegar no universo alchemical da Omiaá.
                </p>

                {/* CATEGORIES LIST */}
                <div className="space-y-4">
                  {/* NECESSARY */}
                  <div className="p-4 rounded-xl bg-[#F5EFE6] border border-[#D8C7B5] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#8B5A2B]" />
                        <h4 className="font-semibold text-sm text-[#2A2421]">
                          Cookies Necessários
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-[#8B5A2B] bg-[#E5D7C5] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sempre Ativos
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5748] leading-relaxed">
                      Estratégicos para a operação segura do site, incluindo autenticação do ritual, manutenção da sacola de compras e conformidade legal.
                    </p>
                  </div>

                  {/* FUNCTIONAL */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] hover:border-[#C4B29F] transition-all flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#2A2421]">
                        Cookies Funcionais
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={functional}
                          onChange={(e) => setFunctional(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#D8C7B5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5A2B]"></div>
                      </label>
                    </div>
                    <p className="text-xs text-[#6B5748] leading-relaxed">
                      Guardam preferências de interface, personalização de fragrâncias e itens favoritos.
                    </p>
                  </div>

                  {/* ANALYTICS */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] hover:border-[#C4B29F] transition-all flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#2A2421]">
                        Cookies Analíticos (Google Analytics & GTM)
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={analytics}
                          onChange={(e) => setAnalytics(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#D8C7B5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5A2B]"></div>
                      </label>
                    </div>
                    <p className="text-xs text-[#6B5748] leading-relaxed">
                      Coletam dados anônimos sobre visitação, duração de sessões e páginas populares para aprimorar o atendimento.
                    </p>
                  </div>

                  {/* MARKETING */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D3C5] hover:border-[#C4B29F] transition-all flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#2A2421]">
                        Cookies de Marketing (Meta Pixel & Google Ads)
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketing}
                          onChange={(e) => setMarketing(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#D8C7B5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5A2B]"></div>
                      </label>
                    </div>
                    <p className="text-xs text-[#6B5748] leading-relaxed">
                      Permitem apresentar anúncios e ofertas personalizadas nas redes sociais com base em suas preferências alquímicas.
                    </p>
                  </div>
                </div>

                {/* PRIVACY POLICY LINKS */}
                <div className="flex flex-wrap items-center justify-between text-xs text-[#7A6251] pt-3 border-t border-[#E8DCCF] gap-2">
                  <div className="flex items-center gap-4">
                    {settings.privacyPolicyUrl && (
                      <a
                        href={settings.privacyPolicyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#8B5A2B] font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Política de Privacidade
                      </a>
                    )}
                    {settings.termsOfUseUrl && (
                      <a
                        href={settings.termsOfUseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#8B5A2B] font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Termos de Uso
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#8C7A6B]">
                    Termos v{settings.termVersion}
                  </span>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-4 md:p-5 bg-[#EFE8DC] border-t border-[#D8C7B5] flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D8C7B5] bg-[#FAF7F2] hover:bg-[#FFF] text-[#2A2421] text-xs font-semibold transition-all shadow-sm"
                >
                  Salvar Minhas Preferências
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2A2421] hover:bg-[#423833] text-[#FAF7F2] text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Aceitar Todos os Cookies
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
