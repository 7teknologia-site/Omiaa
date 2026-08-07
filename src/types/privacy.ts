export interface CookieCategoryConfig {
  id: 'necessary' | 'functional' | 'analytics' | 'marketing';
  title: string;
  description: string;
  required: boolean;
  enabledByDefault: boolean;
}

export interface UserCookieConsent {
  necessary: true; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface PrivacySettings {
  bannerTitle: string;
  bannerDescription: string;
  acceptAllButtonText: string;
  rejectOptionalButtonText: string;
  customizeButtonText: string;
  privacyPolicyUrl: string;
  termsOfUseUrl: string;
  termVersion: string;
  
  // Analytics & Pixel Integration Controls
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  
  categories: CookieCategoryConfig[];
}

export interface ConsentAuditLog {
  id: string;
  timestamp: string;
  termVersion: string;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  userAgent: string;
}
