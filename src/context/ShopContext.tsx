import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  FilterState,
  ViewMode,
  CustomerProfile,
  Order,
  CategoryId
} from '../types';
import {
  INITIAL_PRODUCTS,
  CATEGORIES,
  INITIAL_USER_PROFILE,
  INITIAL_ORDERS
} from '../data/mockData';

interface Toast {
  id: string;
  title: string;
  desc?: string;
  type?: 'success' | 'info' | 'alert';
}

interface ShopContextType {
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
  createOrder: (paymentMethod: Order['paymentMethod'], address: Order['deliveryAddress']) => Order;

  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  shippingCep: string;
  setShippingCep: (cep: string) => void;
  shippingCost: number;
  freeShippingThreshold: number;

  toasts: Toast[];
  showToast: (title: string, desc?: string, type?: 'success' | 'info' | 'alert') => void;

  addNewProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'todos',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 500,
  sortBy: 'popular',
  onlyInStock: false
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state initialized with local storage persistence if available
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('omiaa_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('omiaa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('omiaa_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [user, setUser] = useState<CustomerProfile>(INITIAL_USER_PROFILE);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('omiaa_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [shippingCep, setShippingCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const freeShippingThreshold = 250.00;

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist key states
  useEffect(() => {
    localStorage.setItem('omiaa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omiaa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('omiaa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('omiaa_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast Handler
  const showToast = (title: string, desc?: string, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
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
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
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
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Filter Reset
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Coupon Logic
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ALQUIMIA10' || normalized === 'OMIAA10') {
      setAppliedCoupon({ code: normalized, discountPercent: 10 });
      showToast('Cupom Aplicado!', '10% de desconto ativado para o seu ritual.', 'success');
      return { success: true, message: 'Cupom de 10% aplicado!' };
    } else if (normalized === 'LUNAR15' || normalized === 'PRIMEIRACOMPRA') {
      setAppliedCoupon({ code: normalized, discountPercent: 15 });
      showToast('Cupom Especial Aplicado!', '15% de desconto concedido.', 'success');
      return { success: true, message: 'Cupom de 15% aplicado!' };
    }
    return { success: false, message: 'Cupom inválido ou expirado.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido', undefined, 'info');
  };

  // Shipping Calculation
  useEffect(() => {
    if (shippingCep.replace(/\D/g, '').length === 8) {
      // Simulate shipping check
      const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      if (subtotal >= freeShippingThreshold) {
        setShippingCost(0);
      } else {
        setShippingCost(22.90);
      }
    } else {
      setShippingCost(0);
    }
  }, [shippingCep, cart]);

  // Totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const finalShipping = cartSubtotal >= freeShippingThreshold ? 0 : shippingCost;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + finalShipping);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order creation
  const createOrder = (paymentMethod: Order['paymentMethod'], address: Order['deliveryAddress']): Order => {
    const codeNumber = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: `OMIA-${codeNumber}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee: finalShipping,
      discount: discountAmount,
      total: cartTotal,
      status: 'pago',
      paymentMethod,
      deliveryAddress: address,
      trackingCode: `BR-ALQ-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setUser((prev) => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + Math.floor(newOrder.total) }));
    showToast('Pedido Confirmado!', `Pedido #${newOrder.code} gerado com sucesso.`, 'success');
    return newOrder;
  };

  // Admin action
  const addNewProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('Produto Adicionado!', `${newProd.name} cadastrado na apotheca.`, 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories: CATEGORIES,
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
        freeShippingThreshold,
        toasts,
        showToast,
        addNewProduct
      }}
    >
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
