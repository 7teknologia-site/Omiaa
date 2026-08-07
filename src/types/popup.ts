export type PopupType =
  | 'promotion'
  | 'newsletter'
  | 'launch'
  | 'coupon'
  | 'free_shipping'
  | 'notice'
  | 'featured_product'
  | 'seasonal';

export type PopupPageTarget =
  | 'all'
  | 'home'
  | 'products'
  | 'categories'
  | 'blog'
  | 'botanical'
  | 'cart'
  | 'checkout';

export type PopupTriggerType =
  | 'on_load'
  | 'delay_seconds'
  | 'scroll_percent'
  | 'click_element'
  | 'exit_intent'
  | 'page_views'
  | 'time_on_site';

export type PopupAudience =
  | 'all'
  | 'visitors_only'
  | 'customers_only'
  | 'logged_in'
  | 'new_visitors'
  | 'returning_visitors';

export interface PopupCouponConfig {
  code: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  validUntil?: string;
}

export interface PopupContent {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonText: string;
  buttonLink?: string;
  featuredProductId?: string;
}

export interface PopupStats {
  views: number;
  clicks: number;
  conversions: number;
  leadsCaptured: number;
  couponsUsed: number;
  attributedSales: number;
}

export interface Popup {
  id: string;
  name: string; // Internal name
  type: PopupType;
  active: boolean;
  priority: number; // 1 (highest) to 10
  
  // Schedule
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  
  // Frequency
  displayOncePerVisitor: boolean;
  repeatAfterDays: number; // Days to wait before showing again to same user
  
  // Target & Triggers
  pageTarget: PopupPageTarget;
  triggerType: PopupTriggerType;
  triggerValue?: number; // e.g. 5 seconds, 50% scroll, 3 page views
  targetAudience: PopupAudience;

  // Content & Features
  content: PopupContent;
  couponConfig?: PopupCouponConfig;
  
  // Stats
  stats: PopupStats;
  
  createdAt: string;
  updatedAt: string;
}

export interface PopupLead {
  id: string;
  popupId: string;
  popupName: string;
  name: string;
  email: string;
  createdAt: string;
  source: string; // e.g., "Popup Newsletter - Bem-Vinda"
}
