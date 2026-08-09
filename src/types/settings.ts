export interface BrandSettings {
  name: string;
  corporateName: string;
  tradingName: string;
  slogan: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
}

export interface ContactSettings {
  primaryEmail: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  city: string;
  state: string;
  address?: string;
  cep?: string;
  businessHours: string;
}

export interface SocialSettings {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  pinterest: string;
  linkedin: string;
  spotify?: string;
}

export interface VisualIdentitySettings {
  logoMainUrl: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  shareImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  blendMode: 'normal' | 'multiply' | 'color-burn' | 'screen' | 'darken';
  heightMd: number;
  heightSm: number;
  contrast: number;
  brightness: number;
}

export interface InfoCardSetting {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface HomepageSettings {
  heroBannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  promoBannerActive: boolean;
  promoBannerText: string;
  promoBannerLink: string;
  promoBannerBgUrl?: string;
  infoCards: InfoCardSetting[];
  sectionToggles: {
    hero: boolean;
    categories: boolean;
    featured: boolean;
    fragranceAtelier: boolean;
    botanical: boolean;
    reviews: boolean;
    blog: boolean;
    newsletter: boolean;
  };
  sectionOrder: string[];
}

export interface FooterSettings {
  aboutTitle: string;
  aboutText: string;
  quickLinksTitle: string;
  supportTitle: string;
  copyrightText: string;
  cnpjText: string;
  addressFooter: string;
  showPaymentIcons: boolean;
  customHtmlFooter?: string;
}

export interface SeoSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCardType: 'summary_large_image' | 'summary';
  sitemapUrl: string;
  robotsTxt: string;
  googleSearchConsoleId: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
}

export interface IntegrationsSettings {
  activeGateway?: 'infinitepay' | 'mercadopago';
  infinitePayHandle?: string;
  infinitePayEnabled?: boolean;
  mercadoPagoAccessToken: string;
  mercadoPagoPublicKey: string;
  mercadoPagoWebhookSecret: string;
  mercadoPagoEnvironment: 'simulation' | 'sandbox' | 'production';
  mercadoPagoEnabled?: boolean;
  pixKey: string;
  pixMerchantName: string;
  pixCity: string;
  melhorEnvioToken: string;
  melhorEnvioCepOrigin: string;
  whatsappNumber: string;
  whatsappDefaultMsg: string;
  whatsappWidgetEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  smtpFromName: string;
  smtpFromEmail: string;
  smtpSsl: boolean;
  googleMapsApiKey?: string;
  webhookUrl?: string;
  webhookAuthToken?: string;
}

export interface PoliciesSettings {
  privacyPolicy: string;
  termsOfUse: string;
  shippingPolicy: string;
  exchangePolicy: string;
  refundPolicy: string;
}

export interface StoreRulesSettings {
  freeShippingThreshold: number;
  defaultPacPrice: number;
  defaultSedexPrice: number;
  minOrderValue: number;
  currencySymbol: string;
  currencyCode: string;
  lowStockThreshold: number;
  featuredProductsCount: number;
  relatedProductsCount: number;
  productsPerPage: number;
}

export interface AppearanceSettings {
  themeMode: 'light' | 'dark' | 'system';
  fontHeading: string;
  fontBody: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadowStyle: 'none' | 'soft' | 'medium' | 'strong';
  enableAnimations: boolean;
  containerWidth: '1280px' | '1440px' | '100%';
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  cacheDurationMinutes: number;
  autoBackupEnabled: boolean;
  lastBackupDate?: string;
}

export interface StoreSettings {
  brand: BrandSettings;
  contact: ContactSettings;
  social: SocialSettings;
  visualIdentity: VisualIdentitySettings;
  homepage: HomepageSettings;
  footer: FooterSettings;
  seo: SeoSettings;
  integrations: IntegrationsSettings;
  policies: PoliciesSettings;
  store: StoreRulesSettings;
  appearance: AppearanceSettings;
  system: SystemSettings;
}
