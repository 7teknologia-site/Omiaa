import { Popup, PopupLead } from '../types/popup';

const POPUPS_STORAGE_KEY = 'omiaa_popups_v1';
const LEADS_STORAGE_KEY = 'omiaa_popup_leads_v1';
const DISMISSED_POPUPS_KEY = 'omiaa_dismissed_popups_v1';

export const INITIAL_DEFAULT_POPUPS: Popup[] = [
  {
    id: 'popup-newsletter-welcome',
    name: 'Newsletter - Boas-Vindas 10% OFF',
    type: 'newsletter',
    active: true,
    priority: 1,
    displayOncePerVisitor: false,
    repeatAfterDays: 7,
    pageTarget: 'all',
    triggerType: 'delay_seconds',
    triggerValue: 4,
    targetAudience: 'visitors_only',
    content: {
      title: 'Desperte Seu Ritual Ancestral',
      subtitle: 'PRIMEIRA COMPRA NA OMIAÁ',
      description: 'Inscreva-se em nossa newsletter de sabedoria botânica e receba 10% de desconto no seu primeiro elixir ou vela artesanal.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      bgColor: '#FCFAF7',
      textColor: '#14281D',
      buttonColor: '#C5A059',
      buttonTextColor: '#14281D',
      buttonText: 'Garantir 10% de Desconto'
    },
    couponConfig: {
      code: 'ALQUIMIA10',
      discountValue: 10,
      discountType: 'percentage'
    },
    stats: {
      views: 1420,
      clicks: 310,
      conversions: 184,
      leadsCaptured: 184,
      couponsUsed: 92,
      attributedSales: 14720
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'popup-frete-gratis-inverno',
    name: 'Promoção - Frete Grátis Acima de R$199',
    type: 'free_shipping',
    active: true,
    priority: 2,
    displayOncePerVisitor: true,
    repeatAfterDays: 14,
    pageTarget: 'products',
    triggerType: 'scroll_percent',
    triggerValue: 40,
    targetAudience: 'all',
    content: {
      title: 'Entrega Consagrada Sem Custo',
      subtitle: 'OFERTA POR TEMPO LIMITADO',
      description: 'Garanta Frete Grátis para todo o Brasil em compras acima de R$ 199. Seus elixires embalados artesanalmente até você.',
      imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      bgColor: '#14281D',
      textColor: '#FAF7F2',
      buttonColor: '#C5A059',
      buttonTextColor: '#14281D',
      buttonText: 'Ver Produtos Elegíveis',
      buttonLink: 'products'
    },
    stats: {
      views: 980,
      clicks: 420,
      conversions: 156,
      leadsCaptured: 0,
      couponsUsed: 156,
      attributedSales: 35100
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'popup-exit-intent-cupom',
    name: 'Exit Intent - Não Vá Sem Seu Elixir',
    type: 'coupon',
    active: true,
    priority: 1,
    displayOncePerVisitor: true,
    repeatAfterDays: 3,
    pageTarget: 'cart',
    triggerType: 'exit_intent',
    targetAudience: 'all',
    content: {
      title: 'Um Presente Alquímico Para Você',
      subtitle: 'ANTES DE IR EMBORA...',
      description: 'Use o cupom EXCLUSIVO5 no carrinho e receba R$ 25 OFF em qualquer pedido acima de R$ 150 hoje.',
      imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
      bgColor: '#FDFBF7',
      textColor: '#14281D',
      buttonColor: '#14281D',
      buttonTextColor: '#FAF7F2',
      buttonText: 'Copiar Cupom & Finalizar'
    },
    couponConfig: {
      code: 'EXCLUSIVO5',
      discountValue: 25,
      discountType: 'fixed'
    },
    stats: {
      views: 530,
      clicks: 210,
      conversions: 89,
      leadsCaptured: 0,
      couponsUsed: 89,
      attributedSales: 17800
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DEFAULT_LEADS: PopupLead[] = [
  {
    id: 'lead-1',
    popupId: 'popup-newsletter-welcome',
    popupName: 'Newsletter - Boas-Vindas 10% OFF',
    name: 'Helena Alencastro',
    email: 'helena.alquimia@gmail.com',
    createdAt: '2026-08-01T14:32:00.000Z',
    source: 'Popup Newsletter - Boas-Vindas'
  },
  {
    id: 'lead-2',
    popupId: 'popup-newsletter-welcome',
    popupName: 'Newsletter - Boas-Vindas 10% OFF',
    name: 'Mateus Silveira',
    email: 'mateus.silveira@outlook.com',
    createdAt: '2026-08-03T09:15:00.000Z',
    source: 'Popup Newsletter - Boas-Vindas'
  },
  {
    id: 'lead-3',
    popupId: 'popup-newsletter-welcome',
    popupName: 'Newsletter - Boas-Vindas 10% OFF',
    name: 'Clarice Lisboa',
    email: 'clarice.botanica@yahoo.com.br',
    createdAt: '2026-08-05T18:20:00.000Z',
    source: 'Popup Newsletter - Boas-Vindas'
  }
];

export function getSavedPopups(): Popup[] {
  try {
    const raw = localStorage.getItem(POPUPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_POPUPS));
      return INITIAL_DEFAULT_POPUPS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading popups from localStorage:', err);
    return INITIAL_DEFAULT_POPUPS;
  }
}

export function savePopups(popups: Popup[]): void {
  try {
    localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popups));
  } catch (err) {
    console.error('Error saving popups to localStorage:', err);
  }
}

export function getSavedLeads(): PopupLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_LEADS));
      return INITIAL_DEFAULT_LEADS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leads from localStorage:', err);
    return INITIAL_DEFAULT_LEADS;
  }
}

export function saveLead(leadData: { name: string; email: string; popupId: string; popupName: string }): { success: boolean; message: string } {
  try {
    const emailSanitized = leadData.email.trim().toLowerCase();
    const nameSanitized = leadData.name.trim();

    if (!emailSanitized || !emailSanitized.includes('@')) {
      return { success: false, message: 'Insira um e-mail válido.' };
    }

    const leads = getSavedLeads();
    const duplicate = leads.find((l) => l.email.toLowerCase() === emailSanitized);
    if (duplicate) {
      return { success: false, message: 'Este e-mail já está cadastrado em nossa newsletter!' };
    }

    const newLead: PopupLead = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      popupId: leadData.popupId,
      popupName: leadData.popupName,
      name: nameSanitized || 'Visitante',
      email: emailSanitized,
      createdAt: new Date().toISOString(),
      source: `Popup: ${leadData.popupName}`
    };

    leads.unshift(newLead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));

    // Increment stats in popup
    recordPopupConversion(leadData.popupId, true);

    return { success: true, message: 'Cadastro realizado com sucesso! Verifique seu e-mail com a bênção alquímica.' };
  } catch (err) {
    console.error('Error saving lead:', err);
    return { success: false, message: 'Ocorreu um erro ao cadastrar. Tente novamente.' };
  }
}

export function recordPopupImpression(popupId: string): void {
  try {
    const popups = getSavedPopups();
    const updated = popups.map((p) => {
      if (p.id === popupId) {
        return {
          ...p,
          stats: {
            ...p.stats,
            views: p.stats.views + 1
          }
        };
      }
      return p;
    });
    savePopups(updated);
  } catch (e) {
    // Ignore
  }
}

export function recordPopupClick(popupId: string): void {
  try {
    const popups = getSavedPopups();
    const updated = popups.map((p) => {
      if (p.id === popupId) {
        return {
          ...p,
          stats: {
            ...p.stats,
            clicks: p.stats.clicks + 1
          }
        };
      }
      return p;
    });
    savePopups(updated);
  } catch (e) {
    // Ignore
  }
}

export function recordPopupConversion(popupId: string, isLead: boolean = false): void {
  try {
    const popups = getSavedPopups();
    const updated = popups.map((p) => {
      if (p.id === popupId) {
        return {
          ...p,
          stats: {
            ...p.stats,
            conversions: p.stats.conversions + 1,
            leadsCaptured: isLead ? p.stats.leadsCaptured + 1 : p.stats.leadsCaptured
          }
        };
      }
      return p;
    });
    savePopups(updated);
  } catch (e) {
    // Ignore
  }
}

export function isPopupDismissedForVisitor(popup: Popup): boolean {
  try {
    const raw = localStorage.getItem(DISMISSED_POPUPS_KEY);
    if (!raw) return false;
    const records: Record<string, number> = JSON.parse(raw);
    const lastDismissedAt = records[popup.id];
    if (!lastDismissedAt) return false;

    if (popup.displayOncePerVisitor) return true;

    const daysPassed = (Date.now() - lastDismissedAt) / (1000 * 60 * 60 * 24);
    return daysPassed < (popup.repeatAfterDays || 1);
  } catch (e) {
    return false;
  }
}

export function markPopupDismissedForVisitor(popupId: string): void {
  try {
    const raw = localStorage.getItem(DISMISSED_POPUPS_KEY);
    const records: Record<string, number> = raw ? JSON.parse(raw) : {};
    records[popupId] = Date.now();
    localStorage.setItem(DISMISSED_POPUPS_KEY, JSON.stringify(records));
  } catch (e) {
    // Ignore
  }
}

export function exportLeadsToCSV(leads: PopupLead[]): void {
  if (!leads || leads.length === 0) return;

  const headers = ['ID', 'Nome', 'E-mail', 'Data de Cadastro', 'Origem', 'ID do Popup'];
  const rows = leads.map((l) => [
    l.id,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    new Date(l.createdAt).toLocaleString('pt-BR'),
    `"${l.source.replace(/"/g, '""')}"`,
    l.popupId
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OMIAA_Leads_Newsletter_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
