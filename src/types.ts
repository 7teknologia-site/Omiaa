export type CategoryId = 'elixires' | 'seruns' | 'chass' | 'velas' | 'rituais' | 'todos';

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
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
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
  total: number;
  status: 'pendente' | 'pago' | 'em_preparo' | 'enviado' | 'entregue';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  deliveryAddress: Address;
  trackingCode?: string;
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

export type ViewMode = 'catalog' | 'product-detail' | 'checkout' | 'account' | 'admin' | 'order-success';
