import { StoreSettings } from '../types/settings';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  brand: {
    name: 'Omiaá Alquimia Ancestral',
    corporateName: 'Omiaá Alquimia Botanica e Cosmeticos LTDA',
    tradingName: 'Omiaá Alquimia',
    slogan: 'Cosmética Ritualística & Fitoterapia Hermética',
    description: 'Unindo botânica sagrada, macerados lunares e saberes milenares para harmonização da pele, mente e espírito.',
    mission: 'Resgatar a conexão profunda com o reino vegetal através de elixires, séruns e produtos artesanais 100% puros e sustentáveis.',
    vision: 'Ser referência latino-americana em ecocosmética consciente, preservando o cerrado, a biodiversidade e os saberes ancestrais.',
    values: 'Sustentabilidade, Pureza Botânica, Ética Animal, Respeito ao Ciclo Lunar, Alquimia Consciente'
  },

  contact: {
    primaryEmail: 'contato@omiaa.com.br',
    supportEmail: 'atendimento@omiaa.com.br',
    phone: '(11) 3892-4100',
    whatsapp: '(11) 98765-4321',
    city: 'Alto Paraíso de Goiás',
    state: 'GO',
    address: 'Estrada Parque Chapada dos Veadeiros, km 12',
    cep: '73770-000',
    businessHours: 'Segunda a Sexta: 09h às 18h | Sábados: 09h às 13h'
  },

  social: {
    instagram: 'https://instagram.com/omiaa.alquimia',
    facebook: 'https://facebook.com/omiaa.alquimia',
    youtube: 'https://youtube.com/@omiaaalquimia',
    tiktok: 'https://tiktok.com/@omiaa.alquimia',
    pinterest: 'https://pinterest.com/omiaaalquimia',
    linkedin: 'https://linkedin.com/company/omiaa-alquimia',
    spotify: 'https://open.spotify.com/user/omiaa_rituais'
  },

  visualIdentity: {
    logoMainUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=300&auto=format&fit=crop',
    logoLightUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=300&auto=format&fit=crop',
    logoDarkUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=300&auto=format&fit=crop',
    faviconUrl: '/favicon.ico',
    shareImageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    primaryColor: '#14281D',
    secondaryColor: '#C5A059',
    accentColor: '#8C7A5B',
    blendMode: 'multiply',
    heightMd: 64,
    heightSm: 48,
    contrast: 100,
    brightness: 100
  },

  homepage: {
    heroBannerUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1600&auto=format&fit=crop',
    heroTitle: 'Omiaá Alquimia Ancestral',
    heroSubtitle: 'Elixires Botânicos, Séruns Lunares & Perfumaria Ritualística formulados sob a sabedoria da natureza.',
    heroCtaText: 'Explorar Coleção Alquímica',
    heroCtaLink: '#catalog',
    promoBannerActive: true,
    promoBannerText: '✨ Coleção Macerado Lunar de Primavera: Frete Grátis em compras acima de R$ 250',
    promoBannerLink: '/#catalog',
    promoBannerBgUrl: '',
    infoCards: [
      {
        id: 'card-1',
        icon: 'Truck',
        title: 'Frete Grátis Brasil',
        subtitle: 'Em compras acima de R$ 250'
      },
      {
        id: 'card-2',
        icon: 'ShieldCheck',
        title: 'Alquimia 100% Pura',
        subtitle: 'Sem parabenos, sulfatos ou fragrâncias sintéticas'
      },
      {
        id: 'card-3',
        icon: 'Leaf',
        title: 'Origem Orgânica',
        subtitle: 'Ativos colhidos de forma sustentável'
      },
      {
        id: 'card-4',
        icon: 'Headphones',
        title: 'Atendimento Ritual',
        subtitle: 'Suporte dedicado pelo WhatsApp'
      }
    ],
    sectionToggles: {
      hero: true,
      categories: true,
      featured: true,
      fragranceAtelier: true,
      botanical: true,
      reviews: true,
      blog: true,
      newsletter: true
    },
    sectionOrder: [
      'hero',
      'infoCards',
      'categories',
      'featured',
      'fragranceAtelier',
      'botanical',
      'reviews',
      'blog',
      'newsletter'
    ]
  },

  footer: {
    aboutTitle: 'Omiaá Alquimia',
    aboutText: 'Resgatando a ciência sacra do reino vegetal através de formulações artesanais sob o ciclo da lua.',
    quickLinksTitle: 'Navegação',
    supportTitle: 'Atendimento & Suporte',
    copyrightText: '© 2026 Omiaá Alquimia Ancestral. Todos os direitos reservados.',
    cnpjText: 'CNPJ: 48.912.384/0001-92 • Omiaá Alquimia Botânica LTDA',
    addressFooter: 'Alto Paraíso de Goiás - GO - Brasil',
    showPaymentIcons: true
  },

  seo: {
    defaultMetaTitle: 'Omiaá Alquimia Ancestral - Elixires, Séruns & Cosmética Ritualística',
    defaultMetaDescription: 'Descubra a cosmética alquímica ancestral. Elixires faciais, séruns botânicos, chás solares e velas maceradas no ciclo lunar.',
    defaultKeywords: [
      'Alquimia',
      'Fitoterapia',
      'Cosmética Natural',
      'Sérum Facial',
      'Elixir Lunar',
      'Velas Naturais',
      'Perfumaria Artesanal'
    ],
    ogTitle: 'Omiaá Alquimia Ancestral - Saberes da Terra & Fitoterapia Hermética',
    ogDescription: 'Compêndio de elixires, óleos botânicos e perfumes sob medida formulados artesanalmente.',
    ogImageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    twitterCardType: 'summary_large_image',
    sitemapUrl: 'https://omiaa.com.br/sitemap.xml',
    robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://omiaa.com.br/sitemap.xml',
    googleSearchConsoleId: 'gsc-omiaa-2026-verify-code',
    googleAnalyticsId: 'G-OMIAA2026',
    googleTagManagerId: 'GTM-OMIAA2026',
    metaPixelId: '123456789012345'
  },

  integrations: {
    mercadoPagoAccessToken: 'APP_USR-87391823910238-072710-18293710238-12345678',
    mercadoPagoPublicKey: 'APP_USR-71283910-1283-4211-1234-567890abcdef',
    mercadoPagoWebhookSecret: 'whsec_omiaa_alquimia_2026_secret',
    mercadoPagoEnvironment: 'simulation',
    pixKey: '7teknologia@gmail.com',
    pixMerchantName: 'OMIAA ALQUIMIA ANCESTRAL',
    pixCity: 'SAO PAULO',
    melhorEnvioToken: 'me_token_live_omiaa_2026',
    melhorEnvioCepOrigin: '73770-000',
    whatsappNumber: '5511987654321',
    whatsappDefaultMsg: 'Olá Omiaá! Gostaria de tirar uma dúvida sobre os elixires e rituais.',
    whatsappWidgetEnabled: true,
    smtpHost: 'smtp.omiaa.com.br',
    smtpPort: 587,
    smtpUser: 'contato@omiaa.com.br',
    smtpFromName: 'Atelier OMIAA Alquimia',
    smtpFromEmail: 'contato@omiaa.com.br',
    smtpSsl: true,
    googleMapsApiKey: '',
    webhookUrl: 'https://omiaa.com.br/api/webhooks/orders'
  },

  policies: {
    privacyPolicy: 'A Omiaá Alquimia Ancestral respeita a privacidade dos seus dados. As informações coletadas durante a compra são utilizadas estritamente para o processamento do pedido e comunicações do seu atendimento. Não compartilhamos suas informações pessoais com terceiros sem consentimento explícito.',
    termsOfUse: 'Ao navegar e realizar compras na Omiaá, você concorda com nossos termos de uso. Nossos produtos são cosméticos e fitoterápicos de uso tópico/ritualístico e não substituem tratamento médico formal. Mantenha os elixires e produtos ao abrigo de luz direta e calor excessivo.',
    shippingPolicy: 'Enviamos para todo o Brasil via Correios (PAC e SEDEX) ou transportadoras parceiras. O prazo de postagem de produtos em estoque é de até 2 dias úteis após a confirmação do pagamento. O código de rastreamento é enviado automaticamente para o e-mail do cliente.',
    exchangePolicy: 'Garantimos a troca ou devolução de qualquer item em até 7 dias corridos após o recebimento, desde que o produto esteja na embalagem original e sem violação do lacre de segurança. Em caso de defeito ou avaria no transporte, entre em contato imediatamente com o nosso suporte.',
    refundPolicy: 'Reembolsos são processados no mesmo método de pagamento utilizado na compra em até 5 dias úteis após o recebimento e análise dos itens em nosso centro de distribuição.'
  },

  store: {
    freeShippingThreshold: 250.00,
    defaultPacPrice: 14.90,
    defaultSedexPrice: 24.90,
    minOrderValue: 50.00,
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    lowStockThreshold: 5,
    featuredProductsCount: 6,
    relatedProductsCount: 4,
    productsPerPage: 12
  },

  appearance: {
    themeMode: 'light',
    fontHeading: 'Playfair Display',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: 'lg',
    shadowStyle: 'soft',
    enableAnimations: true,
    containerWidth: '1280px'
  },

  system: {
    maintenanceMode: false,
    maintenanceMessage: 'O Atelier da Omiaá está passando por uma atualização alquímica em nossos servidores. Voltaremos em breve com novos macerados e coleções rituais!',
    cacheDurationMinutes: 60,
    autoBackupEnabled: true,
    lastBackupDate: '2026-07-28'
  }
};

const SETTINGS_STORAGE_KEY = 'omiaa_store_settings_v2';

export function getSavedStoreSettings(): StoreSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return DEFAULT_STORE_SETTINGS;
    
    const parsed = JSON.parse(saved);
    // Deep merge with defaults to ensure any new setting fields are present
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...parsed,
      brand: { ...DEFAULT_STORE_SETTINGS.brand, ...(parsed.brand || {}) },
      contact: { ...DEFAULT_STORE_SETTINGS.contact, ...(parsed.contact || {}) },
      social: { ...DEFAULT_STORE_SETTINGS.social, ...(parsed.social || {}) },
      visualIdentity: { ...DEFAULT_STORE_SETTINGS.visualIdentity, ...(parsed.visualIdentity || {}) },
      homepage: {
        ...DEFAULT_STORE_SETTINGS.homepage,
        ...(parsed.homepage || {}),
        sectionToggles: {
          ...DEFAULT_STORE_SETTINGS.homepage.sectionToggles,
          ...(parsed.homepage?.sectionToggles || {})
        }
      },
      footer: { ...DEFAULT_STORE_SETTINGS.footer, ...(parsed.footer || {}) },
      seo: { ...DEFAULT_STORE_SETTINGS.seo, ...(parsed.seo || {}) },
      integrations: { ...DEFAULT_STORE_SETTINGS.integrations, ...(parsed.integrations || {}) },
      policies: { ...DEFAULT_STORE_SETTINGS.policies, ...(parsed.policies || {}) },
      store: { ...DEFAULT_STORE_SETTINGS.store, ...(parsed.store || {}) },
      appearance: { ...DEFAULT_STORE_SETTINGS.appearance, ...(parsed.appearance || {}) },
      system: { ...DEFAULT_STORE_SETTINGS.system, ...(parsed.system || {}) }
    };
  } catch (err) {
    console.error('Error loading store settings from localStorage:', err);
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving store settings to localStorage:', err);
  }
}
