export * from './settings';
export * from './popup';
export * from './privacy';
export * from './marketing';

export type CategoryId = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  featured?: boolean;
  badges?: string[];
  volumeOrWeight: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  ancestralOrigin: string;
  usageInstructions: string;
  images: string[];
  sku: string;
  createdAt: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  bannerImage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  title?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  location?: string;
  recommends?: boolean;
  images?: string[];
  helpfulLikes?: number;
  replyFromBrand?: {
    date: string;
    text: string;
  };
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface Order {
  id: string;
  code: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pendente' | 'pago' | 'em_preparo' | 'enviado' | 'entregue' | 'cancelado';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  deliveryAddress: Address;
  trackingCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCpf?: string;
  pixQrCodeUrl?: string;
  pixPayload?: string;
  boletoBarcode?: string;
  mercadoPagoPaymentId?: string;
  infinitepayUrl?: string;
  transactionNsu?: string;
  receiptUrl?: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses: Address[];
  loyaltyPoints: number;
  tier: 'Neófito' | 'Iniciado' | 'Mestre Alquimista';
}

export interface FilterState {
  category: CategoryId;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
  onlyInStock: boolean;
  selectedBadge?: string;
}

export type ViewMode = 'catalog' | 'product-detail' | 'checkout' | 'account' | 'admin' | 'order-success' | 'order-error' | 'blog' | 'botanical' | 'fragrance-atelier' | 'obrigado';

export interface Toast {
  id: string;
  title: string;
  desc?: string;
  type?: 'success' | 'info' | 'alert';
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent: number;
  active?: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
}

export type BotanicalCategory = 'Ervas' | 'Banhos' | 'Defumações' | 'Óleos' | 'Resinas' | 'Plantas' | string;

export interface BotanicalSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalSlug?: string;
}

export interface BotanicalEntry {
  id: string;
  slug: string;
  botanicalName: string;
  popularName: string;
  category: BotanicalCategory;
  element: string;
  lunarPhase?: string;
  chakra?: string;
  medicinalProperties: string[];
  spiritualProperties: string[];
  historicalOrigin: string;
  imageUrl: string;
  richContent?: string;
  preparationMethod?: string;
  seo?: BotanicalSEO;
  relatedProductIds?: string[];
  relatedArticleIds?: string[];
  published?: boolean;
  featured?: boolean;
  createdAt?: string;
}

export type FragranceStatus =
  | 'solicitado'
  | 'agendado'
  | 'analise_olfativa'
  | 'macerando'
  | 'envasado'
  | 'enviado'
  | 'concluido'
  | 'encomendado'
  | 'rascunho';

export interface FragranceQuestionnaire {
  intention: string;
  olfactiveFamily: string;
  intensity: 'Suave' | 'Moderada' | 'Marcante' | string;
  concentration: 'Eau de Parfum (20%)' | 'Extrait de Parfum (30%)' | 'Névoa Áurica (15%)' | string;
  bottleEngraving?: string;
  avoidedNotes?: string[];
  preferredElement?: string;
  moodOrChakra?: string;
}

export interface FragranceAppointment {
  date: string;
  time: string;
  type: 'presencial' | 'virtual';
  perfumer: string;
  locationOrLink?: string;
  confirmed?: boolean;
}

export interface FragrancePayment {
  method: 'pix' | 'credit_card' | 'boleto';
  status: 'pendente' | 'pago' | 'processando';
  amount: number;
  paidAt?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  cardLast4?: string;
}

export interface CustomFragrance {
  id?: string;
  batchNumber?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  name: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  intention: string;
  bottleSize: string;
  price?: number;
  questionnaire?: FragranceQuestionnaire;
  appointment?: FragranceAppointment;
  payment?: FragrancePayment;
  status?: FragranceStatus;
  macerationStartDate?: string;
  macerationDaysTotal?: number;
  macerationDaysRemaining?: number;
  alchemistNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

