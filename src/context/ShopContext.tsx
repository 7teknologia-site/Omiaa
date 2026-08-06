import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  Category,
  CartItem,
  FilterState,
  ViewMode,
  CustomerProfile,
  Order,
  Toast,
  Coupon,
  Review,
  StoreSettings
} from '../types';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import {
  DEFAULT_FILTERS,
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_BASE_COST
} from '../constants/shop';
import {
  calculateCartSubtotal,
  calculateCartItemCount,
  calculateDiscount,
  calculateShippingFee
} from '../utils/calculators';
import {
  fetchCategories,
  fetchProducts,
  createProduct,
  validateCoupon,
  createOrderWithItems,
  fetchCustomerOrders,
  fetchCustomerProfile,
  upsertCustomerProfile,
  fetchRemoteStoreSettings,
  upsertRemoteStoreSettings
} from '../services/supabaseService';
import {
  getSavedStoreSettings,
  saveStoreSettings,
  DEFAULT_STORE_SETTINGS
} from '../utils/storeSettings';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ShopContextType {
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: StoreSettings) => void;
  resetStoreSettings: () => void;
  importStoreSettings: (importedSettings: StoreSettings) => void;

  products: Product[];
  categories: Category[];
  cart: CartItem[];
  cartTotalCount: number;
  cartSubtotal: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;

  user: CustomerProfile;
  setUser: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  
  orders: Order[];
  latestOrder: Order | null;
  createOrder: (paymentMethod: Order['paymentMethod'], address: Order['deliveryAddress'], extraData?: Partial<Order>) => Promise<Order>;

  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  shippingCep: string;
  setShippingCep: (cep: string) => void;
  shippingCost: number;
  freeShippingThreshold: number;

  toasts: Toast[];
  showToast: (title: string, desc?: string, type?: 'success' | 'info' | 'alert') => void;

  addNewProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  
  // Reviews state & methods
  reviews: Review[];
  addReview: (newReview: Omit<Review, 'id' | 'date' | 'helpfulLikes'>) => void;
  voteReviewHelpful: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];
  deleteReview: (reviewId: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;

  // Auth state
  authSession: any;
  signOutAuth: () => Promise<void>;
  refreshCatalogData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getSavedStoreSettings);

  // Sync settings with remote database on load
  useEffect(() => {
    fetchRemoteStoreSettings().then((remoteData) => {
      if (remoteData) {
        setStoreSettings(remoteData);
        saveStoreSettings(remoteData);
      }
    });
  }, []);

  const updateStoreSettings = useCallback((newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    saveStoreSettings(newSettings);
    upsertRemoteStoreSettings(newSettings);
  }, []);

  const resetStoreSettings = useCallback(() => {
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    saveStoreSettings(DEFAULT_STORE_SETTINGS);
    upsertRemoteStoreSettings(DEFAULT_STORE_SETTINGS);
  }, []);

  const importStoreSettings = useCallback((importedSettings: StoreSettings) => {
    setStoreSettings(importedSettings);
    saveStoreSettings(importedSettings);
    upsertRemoteStoreSettings(importedSettings);
  }, []);

  // State loaded asynchronously from Supabase
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('omiaa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omiaa_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [user, setUser] = useState<CustomerProfile>({
    name: 'Iniciado Alquímico',
    email: 'cliente@omiaa.com.br',
    phone: '(11) 99887-6655',
    cpf: '123.456.789-00',
    loyaltyPoints: 150,
    tier: 'Iniciado',
    addresses: [
      {
        street: 'Alameda das Camomilas',
        number: '108',
        complement: 'Apto 42 - Bloco A',
        neighborhood: 'Jardim Botânico',
        city: 'São Paulo',
        state: 'SP',
        cep: '01420-001'
      }
    ]
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('omiaa_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [shippingCep, setShippingCep] = useState<string>(() => {
    try {
      return localStorage.getItem('omiaa_cep') || '';
    } catch {
      return '';
    }
  });

  const [shippingCost, setShippingCost] = useState(0);

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('omiaa_product_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('omiaa_product_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage:', e);
    }
  }, [reviews]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [authSession, setAuthSession] = useState<any>(null);

  // Load initial Categories and Products from Supabase
  const loadDataFromSupabase = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const [fetchedCats, fetchedProds] = await Promise.all([
        fetchCategories(),
        fetchProducts(filters)
      ]);
      setCategories(fetchedCats);
      setProducts(fetchedProds);
    } catch (err) {
      console.error('Error loading Supabase catalog:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDataFromSupabase();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadDataFromSupabase]);

  // Auth session listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
      if (session?.user) {
        fetchCustomerProfile(session.user.id).then((prof) => {
          if (prof) setUser(prof);
        });
        fetchCustomerOrders().then((ordList) => setOrders(ordList));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      if (session?.user) {
        fetchCustomerProfile(session.user.id).then((prof) => {
          if (prof) setUser(prof);
        });
        fetchCustomerOrders().then((ordList) => setOrders(ordList));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist local cart, wishlist, coupon, and CEP
  useEffect(() => {
    localStorage.setItem('omiaa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('omiaa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('omiaa_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('omiaa_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('omiaa_cep', shippingCep);
  }, [shippingCep]);

  // Toast Handler
  const showToast = useCallback((title: string, desc?: string, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Product Reviews Handlers
  const getProductReviews = useCallback((productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  }, [reviews]);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'date' | 'helpfulLikes'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      helpfulLikes: 0
    };

    setReviews((prev) => [newRev, ...prev]);

    // Dynamically update product rating average and reviewsCount in memory
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        if (p.id === reviewData.productId) {
          const productRevList = [...reviews.filter((r) => r.productId === p.id), newRev];
          const newCount = productRevList.length;
          const sumRating = productRevList.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating = Number((sumRating / newCount).toFixed(1));
          return {
            ...p,
            reviewsCount: newCount,
            rating: avgRating
          };
        }
        return p;
      });
    });

    showToast('Avaliação Enviada!', 'Sua experiência foi compartilhada com sucesso.', 'success');
  }, [reviews, showToast]);

  const voteReviewHelpful = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulLikes: (r.helpfulLikes || 0) + 1 } : r))
    );
    showToast('Obrigado pelo feedback!', 'Você marcou esta avaliação como útil.', 'info');
  }, [showToast]);

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Avaliação Removida', 'A avaliação foi excluída.', 'info');
  }, [showToast]);

  const replyToReview = useCallback((reviewId: string, replyText: string) => {
    const today = new Date().toLocaleDateString('pt-BR');
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replyFromBrand: {
                date: today,
                text: replyText
              }
            }
          : r
      )
    );
    showToast('Resposta Enviada!', 'Sua resposta oficial da marca foi publicada.', 'success');
  }, [showToast]);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    showToast('Adicionado ao Carrinho', `${product.name} foi adicionado com sucesso.`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist operations
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removido dos Favoritos', undefined, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Guardado nos Favoritos', 'Produto adicionado à sua lista de intenções.', 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Filter Reset
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Coupon Logic with Supabase Service
  const applyCoupon = useCallback(async (code: string) => {
    const couponData = await validateCoupon(code);
    if (couponData) {
      setAppliedCoupon(couponData);
      showToast('Cupom Aplicado!', `${couponData.discountPercent}% de desconto ativado para o seu ritual.`, 'success');
      return { success: true, message: `Cupom de ${couponData.discountPercent}% aplicado!` };
    }
    return { success: false, message: 'Cupom inválido ou expirado.' };
  }, [showToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Cupom removido', undefined, 'info');
  }, [showToast]);

  // Calculations derived
  const cartSubtotal = useMemo(() => calculateCartSubtotal(cart), [cart]);
  const cartTotalCount = useMemo(() => calculateCartItemCount(cart), [cart]);
  const discountAmount = useMemo(() => calculateDiscount(cartSubtotal, appliedCoupon), [cartSubtotal, appliedCoupon]);

  // Shipping Calculation
  useEffect(() => {
    if (shippingCep.replace(/\D/g, '').length === 8) {
      setShippingCost(calculateShippingFee(cartSubtotal, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_BASE_COST));
    } else {
      setShippingCost(0);
    }
  }, [shippingCep, cartSubtotal]);

  const finalShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + finalShipping);

  // Order creation with Supabase backend
  const createOrder = useCallback(async (
    paymentMethod: Order['paymentMethod'],
    address: Order['deliveryAddress'],
    extraData?: Partial<Order>
  ): Promise<Order> => {
    const codeNumber = Math.floor(10000 + Math.random() * 90000);
    const rawOrder: Omit<Order, 'id'> = {
      code: `OMIA-${codeNumber}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee: finalShipping,
      discount: discountAmount,
      total: extraData?.total !== undefined ? extraData.total : cartTotal,
      status: paymentMethod === 'pix' ? 'pendente' : 'pago',
      paymentMethod,
      deliveryAddress: address,
      trackingCode: `BR-ALQ-${Math.floor(1000000 + Math.random() * 9000000)}`,
      customerName: extraData?.customerName,
      customerEmail: extraData?.customerEmail,
      customerPhone: extraData?.customerPhone,
      customerCpf: extraData?.customerCpf,
      pixQrCodeUrl: extraData?.pixQrCodeUrl,
      pixPayload: extraData?.pixPayload,
      boletoBarcode: extraData?.boletoBarcode,
      mercadoPagoPaymentId: extraData?.mercadoPagoPaymentId
    };

    const created = await createOrderWithItems(rawOrder, cart);

    const finalOrder: Order = created || {
      ...rawOrder,
      id: `ord-${Date.now()}`
    };

    setOrders((prev) => [finalOrder, ...prev]);
    setLatestOrder(finalOrder);
    clearCart();
    setAppliedCoupon(null);

    const updatedUser = { ...user, loyaltyPoints: user.loyaltyPoints + Math.floor(finalOrder.total) };
    setUser(updatedUser);
    upsertCustomerProfile(updatedUser);

    showToast('Pedido Confirmado!', `Pedido #${finalOrder.code} gerado com sucesso.`, 'success');
    return finalOrder;
  }, [cart, cartSubtotal, finalShipping, discountAmount, cartTotal, clearCart, showToast, user]);

  // Admin action: Add Product to Supabase
  const addNewProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const created = await createProduct(productData);
    if (created) {
      setProducts((prev) => [created, ...prev]);
      showToast('Produto Adicionado!', `${created.name} cadastrado no Supabase.`, 'success');
    } else {
      const localProd: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts((prev) => [localProd, ...prev]);
      showToast('Produto Adicionado!', `${localProd.name} cadastrado na Omiaá Alquimia Ancestral.`, 'success');
    }
  }, [showToast]);

  const signOutAuth = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAuthSession(null);
    showToast('Sessão encerrada', 'Você saiu da sua conta.', 'info');
  }, [showToast]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    storeSettings,
    updateStoreSettings,
    resetStoreSettings,
    importStoreSettings,
    products,
    categories,
    cart,
    cartTotalCount,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    selectedProductId,
    setSelectedProductId,
    isCartOpen,
    setIsCartOpen,
    quickViewProductId,
    setQuickViewProductId,
    user,
    setUser,
    orders,
    latestOrder,
    createOrder,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCep,
    setShippingCep,
    shippingCost: finalShipping,
    freeShippingThreshold: storeSettings.store?.freeShippingThreshold || FREE_SHIPPING_THRESHOLD,
    toasts,
    showToast,
    addNewProduct,
    reviews,
    addReview,
    voteReviewHelpful,
    getProductReviews,
    deleteReview,
    replyToReview,
    authSession,
    signOutAuth,
    refreshCatalogData: loadDataFromSupabase
  }), [
    storeSettings,
    updateStoreSettings,
    resetStoreSettings,
    importStoreSettings,
    products,
    categories,
    cart,
    cartTotalCount,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    filters,
    resetFilters,
    viewMode,
    selectedProductId,
    isCartOpen,
    quickViewProductId,
    user,
    orders,
    latestOrder,
    createOrder,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingCep,
    finalShipping,
    toasts,
    showToast,
    addNewProduct,
    reviews,
    addReview,
    voteReviewHelpful,
    getProductReviews,
    deleteReview,
    replyToReview,
    authSession,
    signOutAuth,
    loadDataFromSupabase
  ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
