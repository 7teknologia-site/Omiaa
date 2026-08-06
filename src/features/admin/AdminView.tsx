import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  BookOpen,
  Droplet,
  FlaskConical,
  BarChart3,
  Settings,
  ArrowLeft,
  Sparkles,
  Menu,
  X,
  Search,
  Download,
  MessageSquare
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AdminDashboardERP } from './AdminDashboardERP';
import { AdminProductsERP } from './AdminProductsERP';
import { AdminCategoriesERP } from './AdminCategoriesERP';
import { AdminOrdersERP } from './AdminOrdersERP';
import { AdminCustomersERP } from './AdminCustomersERP';
import { AdminCouponsERP } from './AdminCouponsERP';
import { AdminBlogERP } from './AdminBlogERP';
import { AdminBotanicalERP } from './AdminBotanicalERP';
import { AdminFragrancesERP } from './AdminFragrancesERP';
import { AdminInventoryERP } from './AdminInventoryERP';
import { AdminReportsERP } from './AdminReportsERP';
import { AdminReviewsERP } from './AdminReviewsERP';
import { AdminSettings } from './AdminSettings';
import { exportToCSV } from './utils/csvExporter';

export type ErpTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'blog'
  | 'botanical'
  | 'fragrances'
  | 'inventory'
  | 'reports'
  | 'reviews'
  | 'settings';

export const AdminView: React.FC = () => {
  const { products, categories, orders, reviews, setViewMode } = useShop();
  const [activeTab, setActiveTab] = useState<ErpTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOpenNewProdModalFromDash, setIsOpenNewProdModalFromDash] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Produtos', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categorias', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: orders.length },
    { id: 'customers', label: 'Clientes', icon: Users, badge: null },
    { id: 'coupons', label: 'Cupons', icon: Tag, badge: null },
    { id: 'blog', label: 'Blog Alquímico', icon: BookOpen, badge: null },
    { id: 'botanical', label: 'Guia das Ervas', icon: Droplet, badge: null },
    { id: 'fragrances', label: 'Fragrâncias', icon: FlaskConical, badge: null },
    { id: 'inventory', label: 'Estoque', icon: Package, badge: products.filter((p) => p.stock <= 5).length || null },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, badge: null },
    { id: 'reviews', label: 'Avaliações', icon: MessageSquare, badge: reviews.length },
    { id: 'settings', label: 'Configurações da Loja', icon: Settings, badge: null }
  ];

  const handleExportOrdersCSV = () => {
    exportToCSV(
      orders,
      [
        { key: 'code', label: 'Código' },
        { key: 'customerName', label: 'Cliente' },
        { key: 'total', label: 'Total (R$)' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Data' }
      ],
      'Pedidos_OMIAA'
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      
      {/* Top Header Navigation */}
      <header className="bg-[#14281D] text-[#FAF7F2] border-b border-[#2C4837] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-[#FAF7F2] hover:bg-[#2C4837] rounded-xl"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C5A059] flex items-center justify-center text-[#14281D]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-wider text-[#FAF7F2] block leading-tight">
                  OMIAA ERP
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] block font-semibold">
                  Gestão Alquímica
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setViewMode('catalog')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#2C4837] transition-all border border-[#C5A059]/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Loja</span>
          </button>

        </div>
      </header>

      {/* Main ERP Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ERP Sidebar Navigation (Desktop 3 cols / Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 lg:block ${
            isMobileSidebarOpen ? 'block fixed inset-x-0 top-16 bg-[#FAF7F2] z-30 p-4 shadow-xl border-b border-[#E2D9C8]' : 'hidden'
          }`}
        >
          <div className="bg-white rounded-3xl border border-[#E2D9C8] p-3 shadow-xs space-y-1 sticky top-24">
            
            <div className="px-3 py-2 border-b border-[#E2D9C8] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                Módulos do Sistema ERP
              </span>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ErpTab);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
                      : 'text-[#14281D] hover:bg-[#FAF7F2] hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-[#C5A059] text-[#14281D]'
                          : 'bg-[#FAF7F2] text-[#14281D] border border-[#E2D9C8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

          </div>
        </aside>

        {/* ERP Active Content Area (Desktop 9 cols) */}
        <main className="lg:col-span-9 min-h-[600px]">
          {activeTab === 'dashboard' && (
            <AdminDashboardERP
              products={products}
              orders={orders}
              onNavigate={(tab) => setActiveTab(tab as ErpTab)}
              onOpenNewProductModal={() => {
                setActiveTab('products');
                setIsOpenNewProdModalFromDash(true);
              }}
              onExportOrdersCSV={handleExportOrdersCSV}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsERP
              products={products}
              categories={categories}
              isOpenCreateModalFromDash={isOpenNewProdModalFromDash}
              onCloseCreateModalFromDash={() => setIsOpenNewProdModalFromDash(false)}
            />
          )}

          {activeTab === 'categories' && <AdminCategoriesERP categories={categories} />}

          {activeTab === 'orders' && <AdminOrdersERP orders={orders} />}

          {activeTab === 'customers' && <AdminCustomersERP orders={orders} />}

          {activeTab === 'coupons' && <AdminCouponsERP />}

          {activeTab === 'blog' && <AdminBlogERP />}

          {activeTab === 'botanical' && <AdminBotanicalERP />}

          {activeTab === 'fragrances' && <AdminFragrancesERP />}

          {activeTab === 'inventory' && <AdminInventoryERP products={products} />}

          {activeTab === 'reports' && <AdminReportsERP products={products} orders={orders} />}

          {activeTab === 'reviews' && <AdminReviewsERP />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>

      </div>

    </div>
  );
};
