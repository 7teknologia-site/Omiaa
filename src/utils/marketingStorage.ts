import { MarketingCoupon, MarketingCampaign, ExtendedNewsletterLead, CouponUsageLog } from '../types/marketing';
import { Popup, PopupLead } from '../types/popup';
import { exportToCSV } from '../features/admin/utils/csvExporter';

const STORAGE_KEYS = {
  COUPONS: 'omiaa_marketing_coupons_v2',
  CAMPAIGNS: 'omiaa_marketing_campaigns_v2',
  LEADS: 'omiaa_marketing_leads_v2',
  POPUPS: 'omiaa_marketing_popups_v2',
  USAGE_LOGS: 'omiaa_marketing_usage_logs_v2'
};

export const INITIAL_MARKETING_COUPONS: MarketingCoupon[] = [
  {
    id: 'coup-1',
    internalName: 'Boas-Vindas 10% OFF',
    code: 'ALQUIMIA10',
    description: 'Desconto de 10% para novos visitantes da Omiaá Alquimia Ancestral',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    startTime: '00:00',
    endTime: '23:59',
    maxUses: 1000,
    limitPerCustomer: 1,
    usedCount: 42,
    priority: 1,
    discountType: 'percentual',
    discountValue: 10,
    rules: {
      minOrderValue: 0,
      firstPurchaseOnly: false
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coup-2',
    internalName: 'Primeira Compra Alquímica 15% OFF',
    code: 'PRIMEIRACOMPRA',
    description: 'Exclusivo para o primeiro pedido na loja',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 500,
    limitPerCustomer: 1,
    usedCount: 28,
    priority: 1,
    discountType: 'percentual',
    discountValue: 15,
    rules: {
      minOrderValue: 80,
      firstPurchaseOnly: true
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coup-3',
    internalName: 'Frete Grátis Especial',
    code: 'FRETEGRATIS',
    description: 'Frete Grátis para rituais acima de R$ 150,00',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 0,
    limitPerCustomer: 0,
    usedCount: 64,
    priority: 2,
    discountType: 'frete_gratis',
    discountValue: 0,
    rules: {
      minOrderValue: 150
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coup-4',
    internalName: 'Desconto Fixo de R$ 50',
    code: 'RITUAL50',
    description: 'R$ 50,00 de desconto em rituais completos acima de R$ 300,00',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 200,
    limitPerCustomer: 2,
    usedCount: 15,
    priority: 3,
    discountType: 'valor_fixo',
    discountValue: 50,
    rules: {
      minOrderValue: 300
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coup-5',
    internalName: 'Combo Botânico - Compre 3 Leve 4',
    code: 'COMBOBOTANICO',
    description: 'Compre 3 itens de ervas/banhos e o menor sai como brinde',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 100,
    limitPerCustomer: 1,
    usedCount: 8,
    priority: 4,
    discountType: 'compre_x_leve_y',
    discountValue: 0,
    buyX: 3,
    getY: 1,
    rules: {
      minOrderValue: 0
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coup-6',
    internalName: 'Desconto Progressivo Ancestral',
    code: 'PROGRESSIVO',
    description: '10% acima de R$100, 15% acima de R$200, 20% acima de R$300',
    status: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 0,
    limitPerCustomer: 0,
    usedCount: 35,
    priority: 2,
    discountType: 'desconto_progressivo',
    discountValue: 0,
    progressiveTiers: [
      { minAmount: 100, discountPercent: 10 },
      { minAmount: 200, discountPercent: 15 },
      { minAmount: 300, discountPercent: 20 }
    ],
    rules: {
      minOrderValue: 100
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    name: 'Ritual do Solstício & Ervas Sagradas',
    description: 'Campanha integrada de inverno trazendo desconto exclusivo de 15% e frete grátis.',
    active: true,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    banner: {
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      title: 'Solstício de Luz & Aromas',
      subtitle: 'CULTIVADO COM INTENÇÃO ANCESTRAL',
      buttonText: 'Explorar Ofertas',
      linkUrl: 'products'
    },
    popupId: 'popup-solsticio',
    couponId: 'coup-2',
    newsletterEnabled: true,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z'
  },
  {
    id: 'camp-2',
    name: 'Ateliê de Fragrâncias Vibracionais',
    description: 'Campanha de lançamento de perfumaria natural artesanal.',
    active: true,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    banner: {
      imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=80',
      title: 'Perfumes Botânicos Personalizados',
      subtitle: 'FORMULAÇÃO EXCLUSIVA DO SEU CHAKRA',
      buttonText: 'Criar Fragrância',
      linkUrl: 'fragrance-atelier'
    },
    couponId: 'coup-1',
    newsletterEnabled: true,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z'
  }
];

export const INITIAL_NEWSLETTER_LEADS: ExtendedNewsletterLead[] = [
  {
    id: 'lead-1',
    name: 'Mariana Silva',
    email: 'mariana.silva@exemplo.com.br',
    source: 'Pop-up Boas-Vindas 10%',
    segment: 'pop_up',
    couponCodeGenerated: 'ALQUIMIA10',
    createdAt: '2026-08-01T14:30:00.000Z'
  },
  {
    id: 'lead-2',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@exemplo.com.br',
    source: 'Rodapé do Site',
    segment: 'primeira_compra',
    couponCodeGenerated: 'PRIMEIRACOMPRA',
    createdAt: '2026-08-02T09:15:00.000Z'
  },
  {
    id: 'lead-3',
    name: 'Fernanda Rocha',
    email: 'fernanda.rocha@exemplo.com.br',
    source: 'Pop-up Frete Grátis',
    segment: 'vip',
    couponCodeGenerated: 'FRETEGRATIS',
    createdAt: '2026-08-03T18:45:00.000Z'
  }
];

export const INITIAL_USAGE_LOGS: CouponUsageLog[] = [
  {
    id: 'log-1',
    couponCode: 'ALQUIMIA10',
    couponId: 'coup-1',
    customerEmail: 'mariana.silva@exemplo.com.br',
    customerName: 'Mariana Silva',
    orderCode: 'OMIA-48291',
    orderId: 'ord-101',
    discountAmount: 18.50,
    usedAt: '2026-08-04T10:20:00.000Z'
  },
  {
    id: 'log-2',
    couponCode: 'FRETEGRATIS',
    couponId: 'coup-3',
    customerEmail: 'fernanda.rocha@exemplo.com.br',
    customerName: 'Fernanda Rocha',
    orderCode: 'OMIA-93821',
    orderId: 'ord-102',
    discountAmount: 24.90,
    usedAt: '2026-08-05T16:40:00.000Z'
  }
];

// Helper Storage Functions
export function getSavedMarketingCoupons(): MarketingCoupon[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_MARKETING_COUPONS;
  } catch {
    return INITIAL_MARKETING_COUPONS;
  }
}

export function saveMarketingCoupons(coupons: MarketingCoupon[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  } catch (err) {
    console.error('Error saving marketing coupons:', err);
  }
}

export function getSavedMarketingCampaigns(): MarketingCampaign[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  } catch {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveMarketingCampaigns(campaigns: MarketingCampaign[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Error saving marketing campaigns:', err);
  }
}

export function getSavedMarketingLeads(): ExtendedNewsletterLead[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : INITIAL_NEWSLETTER_LEADS;
  } catch {
    return INITIAL_NEWSLETTER_LEADS;
  }
}

export function saveMarketingLeads(leads: ExtendedNewsletterLead[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  } catch (err) {
    console.error('Error saving newsletter leads:', err);
  }
}

export function getSavedUsageLogs(): CouponUsageLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USAGE_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_USAGE_LOGS;
  } catch {
    return INITIAL_USAGE_LOGS;
  }
}

export function saveUsageLogs(logs: CouponUsageLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USAGE_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving usage logs:', err);
  }
}

export function recordCouponUsage(
  couponCode: string,
  customerEmail: string,
  customerName: string,
  orderCode: string,
  orderId: string,
  discountAmount: number
): void {
  const coupons = getSavedMarketingCoupons();
  const updatedCoupons = coupons.map((c) => {
    if (c.code.toUpperCase() === couponCode.toUpperCase()) {
      return {
        ...c,
        usedCount: (c.usedCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
    }
    return c;
  });
  saveMarketingCoupons(updatedCoupons);

  const logs = getSavedUsageLogs();
  const matchedCoupon = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());
  const newLog: CouponUsageLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    couponCode: couponCode.toUpperCase(),
    couponId: matchedCoupon?.id || 'unknown',
    customerEmail: customerEmail || 'cliente_anonimo@omiaa.com.br',
    customerName: customerName || 'Cliente Omiaá',
    orderCode,
    orderId,
    discountAmount,
    usedAt: new Date().toISOString()
  };

  saveUsageLogs([newLog, ...logs]);
}

export function exportLeadsToCSV(leads: ExtendedNewsletterLead[]): void {
  exportToCSV(
    leads,
    [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'E-mail' },
      { key: 'source', label: 'Origem' },
      { key: 'segment', label: 'Segmento' },
      { key: 'couponCodeGenerated', label: 'Cupom Gerado' },
      { key: 'createdAt', label: 'Data de Inscrição' }
    ],
    'Leads_Newsletter_OMIAA'
  );
}
