import React, { lazy, Suspense, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './features/layout/AnnouncementBar';
import { Header } from './features/layout/Header';
import { Footer } from './features/layout/Footer';
import { ProductGrid } from './features/catalog/ProductGrid';
import { ProductQuickView } from './features/catalog/ProductQuickView';
import { CartDrawer } from './features/cart/CartDrawer';
import { ToastContainer } from './components/ui/ToastContainer';
import { ClientPopupManager } from './components/ui/ClientPopupManager';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { LegalDocumentModal } from './components/ui/LegalDocumentModal';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Sparkles } from 'lucide-react';

// Lazy Loaded Components for Code Splitting
const ProductDetailView = lazy(() => import('./features/catalog/ProductDetailView').then(m => ({ default: m.ProductDetailView })));
const CheckoutView = lazy(() => import('./features/cart/CheckoutView').then(m => ({ default: m.CheckoutView })));
const OrderSuccessView = lazy(() => import('./features/cart/OrderSuccessView').then(m => ({ default: m.OrderSuccessView })));
const OrderErrorView = lazy(() => import('./features/cart/OrderErrorView').then(m => ({ default: m.OrderErrorView })));
const AccountView = lazy(() => import('./features/account/AccountView').then(m => ({ default: m.AccountView })));
const AdminView = lazy(() => import('./features/admin/AdminView').then(m => ({ default: m.AdminView })));
const BlogView = lazy(() => import('./features/blog/BlogView').then(m => ({ default: m.BlogView })));
const BotanicalLibraryView = lazy(() => import('./features/botanical/BotanicalLibraryView').then(m => ({ default: m.BotanicalLibraryView })));
const CustomFragranceView = lazy(() => import('./features/fragrance/CustomFragranceView').then(m => ({ default: m.CustomFragranceView })));
const ObrigadoView = lazy(() => import('./features/cart/ObrigadoView').then(m => ({ default: m.ObrigadoView })));

const ViewLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-16">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      <Sparkles className="w-5 h-5 text-[#C5A059] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="text-xs font-bold uppercase tracking-widest text-[#8C7A5B] animate-pulse">
      Carregando Elixires Alquímicos...
    </p>
  </div>
);

function MainAppContent() {
  const { viewMode, setViewMode } = useShop();

  useEffect(() => {
    const pathname = window.location.pathname;
    const search = window.location.search;
    if (pathname === '/obrigado' || search.includes('order_nsu=')) {
      setViewMode('obrigado');
    }
  }, [setViewMode]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1B3B2B] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#1B3B2B]">
      
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Main Header Nav */}
      <Header />

      {/* Dynamic Main View */}
      <main className="flex-1">
        <Suspense fallback={<ViewLoadingFallback />}>
          {viewMode === 'catalog' && <ProductGrid />}
          {viewMode === 'product-detail' && <ProductDetailView />}
          {viewMode === 'checkout' && <CheckoutView />}
          {viewMode === 'order-success' && <OrderSuccessView />}
          {viewMode === 'order-error' && <OrderErrorView />}
          {viewMode === 'account' && <AccountView />}
          {viewMode === 'admin' && <AdminView />}
          {viewMode === 'blog' && <BlogView />}
          {viewMode === 'botanical' && <BotanicalLibraryView />}
          {viewMode === 'fragrance-atelier' && <CustomFragranceView />}
          {viewMode === 'obrigado' && <ObrigadoView />}
        </Suspense>
      </main>

      {/* Drawers & Modals */}
      <CartDrawer />
      <ProductQuickView />
      <ClientPopupManager />
      <CookieConsentBanner />
      <LegalDocumentModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <MainAppContent />
      </ShopProvider>
    </ErrorBoundary>
  );
}
