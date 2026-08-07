import { PrivacySettings, UserCookieConsent, ConsentAuditLog } from '../types/privacy';

const SETTINGS_KEY = 'omiaa_privacy_settings_v1';
const CONSENT_KEY = 'omiaa_user_cookie_consent_v1';
const LOGS_KEY = 'omiaa_consent_audit_logs_v1';

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  bannerTitle: 'Sua privacidade é importante para nós.',
  bannerDescription: 'Utilizamos cookies para melhorar sua experiência, personalizar conteúdos, analisar o desempenho do site e oferecer funcionalidades essenciais. Você pode escolher quais categorias deseja permitir.',
  acceptAllButtonText: 'Aceitar Todos',
  rejectOptionalButtonText: 'Recusar Opcionais',
  customizeButtonText: 'Personalizar Preferências',
  privacyPolicyUrl: '#politica-privacidade',
  termsOfUseUrl: '#termos-uso',
  termVersion: '1.0.0',
  googleAnalyticsId: 'G-OMIAA2026',
  googleTagManagerId: 'GTM-OMIAA01',
  metaPixelId: '123456789012345',
  categories: [
    {
      id: 'necessary',
      title: 'Cookies Necessários',
      description: 'Estes cookies são essenciais para o funcionamento do site, permitindo navegação básica, segurança do checkout, carrinho de compras e autenticação do cliente. Não podem ser desativados.',
      required: true,
      enabledByDefault: true
    },
    {
      id: 'functional',
      title: 'Cookies Funcionais',
      description: 'Permitem lembrar de suas preferências, idioma, itens na lista de desejos e customizações das fragrâncias botânicas.',
      required: false,
      enabledByDefault: true
    },
    {
      id: 'analytics',
      title: 'Cookies Analíticos',
      description: 'Ajudam-nos a compreender como os visitantes interagem com o site através de métricas anônimas do Google Analytics, páginas mais visitadas e fluxo de navegação.',
      required: false,
      enabledByDefault: false
    },
    {
      id: 'marketing',
      title: 'Cookies de Marketing',
      description: 'Utilizados para rastrear visitantes nas redes sociais (Meta Pixel / Facebook) e exibir anúncios relevantes aos seus rituais de interesse.',
      required: false,
      enabledByDefault: false
    }
  ]
};

export function getPrivacySettings(): PrivacySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_PRIVACY_SETTINGS));
      return DEFAULT_PRIVACY_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_PRIVACY_SETTINGS;
  }
}

export function savePrivacySettings(settings: PrivacySettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save privacy settings:', err);
  }
}

export function getUserConsent(): UserCookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function saveUserConsent(consent: Omit<UserCookieConsent, 'timestamp' | 'version'>): UserCookieConsent {
  const settings = getPrivacySettings();
  const fullConsent: UserCookieConsent = {
    ...consent,
    necessary: true,
    timestamp: new Date().toISOString(),
    version: settings.termVersion
  };

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullConsent));
    recordConsentAuditLog(fullConsent);
    applyConditionalScripts(fullConsent, settings);
    window.dispatchEvent(new CustomEvent('omiaa_privacy_consent_updated', { detail: fullConsent }));
  } catch (err) {
    console.error('Failed to save user consent:', err);
  }

  return fullConsent;
}

export function recordConsentAuditLog(consent: UserCookieConsent): void {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    const logs: ConsentAuditLog[] = raw ? JSON.parse(raw) : [];

    const newLog: ConsentAuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: consent.timestamp,
      termVersion: consent.version,
      necessary: true,
      functional: consent.functional,
      analytics: consent.analytics,
      marketing: consent.marketing,
      userAgent: navigator.userAgent
    };

    logs.unshift(newLog);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 500))); // Keep last 500 logs
  } catch (err) {
    console.error('Failed to record consent log:', err);
  }
}

export function getConsentAuditLogs(): ConsentAuditLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function applyConditionalScripts(consent: UserCookieConsent, settings: PrivacySettings): void {
  if (typeof window === 'undefined') return;

  // Google Analytics / GTM
  if (consent.analytics && settings.googleAnalyticsId) {
    // Simulate or trigger GA if consented
    (window as any)['ga_consented'] = true;
  } else {
    (window as any)['ga_consented'] = false;
  }

  // Meta Pixel
  if (consent.marketing && settings.metaPixelId) {
    (window as any)['meta_pixel_consented'] = true;
  } else {
    (window as any)['meta_pixel_consented'] = false;
  }
}

export function exportConsentLogsToCSV(logs: ConsentAuditLog[]): void {
  if (!logs || logs.length === 0) return;

  const headers = ['ID', 'Data/Hora', 'Versão do Termo', 'Necessários', 'Funcionais', 'Analíticos', 'Marketing', 'User Agent'];
  const rows = logs.map((l) => [
    l.id,
    new Date(l.timestamp).toLocaleString('pt-BR'),
    l.termVersion,
    'Sim',
    l.functional ? 'Sim' : 'Não',
    l.analytics ? 'Sim' : 'Não',
    l.marketing ? 'Sim' : 'Não',
    `"${l.userAgent.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OMIAA_Consent_Logs_LGPD_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
