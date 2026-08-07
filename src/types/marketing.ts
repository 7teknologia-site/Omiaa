import { Popup } from './popup';

export type DiscountType =
  | 'valor_fixo'
  | 'percentual'
  | 'frete_gratis'
  | 'brinde'
  | 'compre_x_leve_y'
  | 'desconto_progressivo';

export interface ProgressiveTier {
  minAmount: number;
  discountPercent: number;
}

export interface CouponRules {
  minOrderValue?: number;
  maxOrderValue?: number;
  includedProducts?: string[];
  includedCategories?: string[];
  includedBrands?: string[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  specificCustomerEmails?: string[];
  firstPurchaseOnly?: boolean;
  recurringCustomersOnly?: boolean;
  registeredUsersOnly?: boolean;
  visitorsOnly?: boolean;
  specialOccasionNote?: string;
}

export interface MarketingCoupon {
  id: string;
  internalName: string;
  code: string;
  description: string;
  status: boolean; // active/inactive
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  maxUses: number; // 0 = sem limite
  limitPerCustomer: number; // 0 = sem limite
  usedCount: number;
  priority: number; // 1 (alta) a 10 (baixa)
  
  discountType: DiscountType;
  discountValue: number; // Valor R$ ou Percentual % ou 0 se frete grátis/brinde
  
  // Regras específicas por tipo
  buyX?: number; // Para Compre X e Leve Y
  getY?: number; // Para Compre X e Leve Y
  progressiveTiers?: ProgressiveTier[]; // Para Desconto Progressivo
  giftProductId?: string; // Para Brinde
  
  // Regras de elegibilidade
  rules: CouponRules;
  
  createdAt: string;
  updatedAt: string;
}

export interface CouponUsageLog {
  id: string;
  couponCode: string;
  couponId: string;
  customerEmail: string;
  customerName: string;
  orderCode: string;
  orderId: string;
  discountAmount: number;
  usedAt: string;
}

export interface CampaignBanner {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkUrl: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  active: boolean;
  startDate: string;
  endDate: string;
  banner: CampaignBanner;
  popupId?: string;
  couponId?: string;
  newsletterEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedNewsletterLead {
  id: string;
  name: string;
  email: string;
  source: string; // ex: "Pop-up Boas-Vindas", "Rodapé do Site", "Checkout"
  segment: 'todos' | 'pop_up' | 'primeira_compra' | 'vip' | 'visitantes';
  popupId?: string;
  couponCodeGenerated?: string;
  createdAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  discountAmount: number;
  isFreeShipping: boolean;
  message: string;
  coupon?: MarketingCoupon;
}
