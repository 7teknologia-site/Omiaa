import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProductGrid } from './components/store/ProductGrid';
import { ProductQuickView } from './components/store/ProductQuickView';
import { ProductDetailView } from './components/store/ProductDetailView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutView } from './components/cart/CheckoutView';
import { OrderSuccessView } from './components/cart/OrderSuccessView';
import { AccountView } from './components/account/AccountView';
import { AdminView } from './components/admin/AdminView';
import { ToastContainer } from './components/ui/ToastContainer';

function MainAppContent() {
  const { viewMode } = useShop();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B3B2B] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#1B3B2B]">
      
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Main Header Nav */}
      <Header />

      {/* Dynamic Main View */}
      <main className="flex-1">
        {viewMode === 'catalog' && <ProductGrid />}
        {viewMode === 'product-detail' && <ProductDetailView />}
        {viewMode === 'checkout' && <CheckoutView />}
        {viewMode === 'order-success' && <OrderSuccessView />}
        {viewMode === 'account' && <AccountView />}
        {viewMode === 'admin' && <AdminView />}
      </main>

      {/* Drawers & Modals */}
      <CartDrawer />
      <ProductQuickView />
      <ToastContainer />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
