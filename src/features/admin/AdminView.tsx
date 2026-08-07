import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Menu,
  X,
  Search,
  Star,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Download
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import {
  ADMIN_NAVIGATION_MODULES,
  AdminModuleId,
  AdminSubModuleId,
  AdminNavigationSubItem
} from '../../types/adminNav';
import {
  getStoredUserRole,
  setStoredUserRole,
  hasPermission,
  ROLE_LABELS,
  AdminUserRole
} from '../../utils/adminRbac';
import {
  getFavoriteSubModuleIds,
  toggleFavoriteSubModule,
  isSubModuleFavorite
} from '../../utils/adminFavorites';
import { AdminGlobalSearchModal } from '../../components/admin/AdminGlobalSearchModal';

// Feature Modules
import { AdminDashboardERP } from './AdminDashboardERP';
import { AdminProductsERP } from './AdminProductsERP';
import { AdminCategoriesERP } from './AdminCategoriesERP';
import { AdminOrdersERP } from './AdminOrdersERP';
import { AdminCustomersERP } from './AdminCustomersERP';
import { AdminCouponsERP } from './AdminCouponsERP';
import { AdminPopupsERP } from './AdminPopupsERP';
import { AdminBlogERP } from './AdminBlogERP';
import { AdminBotanicalERP } from './AdminBotanicalERP';
import { AdminFragrancesERP } from './AdminFragrancesERP';
import { AdminInventoryERP } from './AdminInventoryERP';
import { AdminReportsERP } from './AdminReportsERP';
import { AdminReviewsERP } from './AdminReviewsERP';
import { AdminSettings } from './AdminSettings';
import { AdminComplianceERP, ComplianceSubTab } from './AdminComplianceERP';
import { AdminMarketingERP, MarketingTab } from './AdminMarketingERP';
import { AdminUsersRBAC } from './AdminUsersRBAC';
import { AdminHealthERP } from './AdminHealthERP';
import { AdminToolsERP } from './AdminToolsERP';
import { AdminFinanceERP } from './AdminFinanceERP';
import { AdminLogisticsERP } from './AdminLogisticsERP';
import { AdminContentERP } from './AdminContentERP';
import { AdminStoreConfigERP } from './AdminStoreConfigERP';
import { SettingsTabId } from './AdminSettings';
import { exportToCSV } from './utils/csvExporter';

export const AdminView: React.FC = () => {
  const { products, categories, orders, reviews, setViewMode } = useShop();

  // Navigation state
  const [activeModuleId, setActiveModuleId] = useState<AdminModuleId>('dashboard');
  const [activeSubModuleId, setActiveSubModuleId] = useState<string>('dashboard-overview');
  
  // Accordion state for side menu modules
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    dashboard: true,
    orders: true,
    products: true
  });

  // Mobile sidebar drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // RBAC Role State
  const [userRole, setUserRole] = useState<AdminUserRole>(getStoredUserRole());

  // Favorites state
  const [favoriteSubModuleIds, setFavoriteSubModuleIds] = useState<string[]>(getFavoriteSubModuleIds());

  // Modal triggers from dashboard
  const [isOpenNewProdModalFromDash, setIsOpenNewProdModalFromDash] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update RBAC role
  const handleRoleChange = (role: AdminUserRole) => {
    setUserRole(role);
    setStoredUserRole(role);
  };

  // Toggle favorite page
  const handleToggleFavorite = (subId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleFavoriteSubModule(subId);
    setFavoriteSubModuleIds(updated);
  };

  // Toggle module accordion expand/collapse
  const toggleModuleAccordion = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Select module and submodule
  const navigateToSubModule = (modId: AdminModuleId, subId: string) => {
    setActiveModuleId(modId);
    setActiveSubModuleId(subId);
    setOpenModules((prev) => ({ ...prev, [modId]: true }));
    setIsMobileSidebarOpen(false);
  };

  // Compatibility shortcut handler for legacy tab strings
  const handleLegacyNavigate = (tab: string) => {
    switch (tab) {
      case 'orders':
        navigateToSubModule('orders', 'orders-list');
        break;
      case 'products':
        navigateToSubModule('products', 'products-list');
        break;
      case 'categories':
        navigateToSubModule('products', 'products-categories');
        break;
      case 'inventory':
        navigateToSubModule('products', 'products-inventory');
        break;
      case 'customers':
        navigateToSubModule('customers', 'customers-list');
        break;
      case 'coupons':
        navigateToSubModule('marketing', 'marketing-coupons');
        break;
      case 'popups':
        navigateToSubModule('marketing', 'marketing-popups');
        break;
      case 'blog':
        navigateToSubModule('content', 'content-blog');
        break;
      case 'botanical':
        navigateToSubModule('content', 'content-botanical');
        break;
      case 'fragrances':
        navigateToSubModule('content', 'content-fragrances');
        break;
      case 'compliance':
      case 'privacy':
        navigateToSubModule('compliance', 'compliance-privacy');
        break;
      case 'settings':
        navigateToSubModule('settings', 'settings-brand');
        break;
      default:
        navigateToSubModule('dashboard', 'dashboard-overview');
    }
  };

  // Export CSV helper
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
      'Pedidos_OMIAA_Alquimia'
    );
  };

  // Calculate dynamic badges
  const getSubItemBadge = (subId: string): number | null => {
    if (subId === 'orders-list') return orders.length;
    if (subId === 'products-list') return products.length;
    if (subId === 'products-categories') return categories.length;
    if (subId === 'products-inventory') return products.filter((p) => p.stock <= 5).length || null;
    if (subId === 'products-reviews') return reviews.length;
    return null;
  };

  // Flattened list of subitems for favorites resolving
  const allSubItems = ADMIN_NAVIGATION_MODULES.flatMap((m) =>
    m.subItems.map((s) => ({ ...s, parentModule: m }))
  );
  const favoriteItems = allSubItems.filter((s) => favoriteSubModuleIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      
      {/* Top Header Navigation Bar */}
      <header className="bg-[#14281D] text-[#FAF7F2] border-b border-[#2C4837] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-[#FAF7F2] hover:bg-[#2C4837] rounded-xl"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A059] flex items-center justify-center text-[#14281D] shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-wider text-[#FAF7F2] block leading-tight">
                  OMIAA ERP
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] block font-semibold">
                  Gestão Alquímica Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Center Search Trigger */}
          <div className="hidden md:flex flex-1 max-w-md items-center justify-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-[#2C4837]/80 hover:bg-[#2C4837] text-[#A8B2A6] hover:text-[#FAF7F2] px-4 py-2 rounded-2xl border border-[#C5A059]/20 flex items-center justify-between text-xs transition-all shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Buscar pedidos, produtos, clientes ou conformidade...</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#14281D] text-[10px] font-mono text-[#C5A059] border border-[#C5A059]/30">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right Controls: Role Switcher & Store Button */}
          <div className="flex items-center gap-3">
            
            {/* RBAC Role Selector Dropdown */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#2C4837] px-3 py-1.5 rounded-xl border border-[#C5A059]/30 text-xs text-[#FAF7F2]">
              <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <select
                value={userRole}
                onChange={(e) => handleRoleChange(e.target.value as AdminUserRole)}
                className="bg-transparent text-xs font-bold text-[#FAF7F2] focus:outline-none cursor-pointer"
              >
                {Object.entries(ROLE_LABELS).map(([roleKey, label]) => (
                  <option key={roleKey} value={roleKey} className="bg-[#14281D] text-[#FAF7F2]">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-[#C5A059] hover:bg-[#2C4837] rounded-xl"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setViewMode('catalog')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14281D] bg-[#C5A059] hover:bg-white px-3.5 py-2 rounded-xl transition-all shadow-md shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Loja</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main ERP Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hierarchical Sidebar Navigation (Desktop 3 cols / Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 lg:block ${
            isMobileSidebarOpen
              ? 'block fixed inset-x-0 top-16 bottom-0 bg-[#FAF7F2] z-30 p-4 overflow-y-auto shadow-2xl border-b border-[#E2D9C8]'
              : 'hidden'
          }`}
        >
          <div className="bg-white rounded-3xl border border-[#E2D9C8] p-3 shadow-xs space-y-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            
            {/* User Role Indicator Badge */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8C7A5B] block font-bold">Perfil RBAC</span>
                  <span className="text-xs font-bold text-[#14281D]">{ROLE_LABELS[userRole]}</span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Pinned Favorites Section */}
            {favoriteItems.length > 0 && (
              <div className="space-y-1.5 border-b border-[#E2D9C8] pb-3">
                <div className="px-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#C5A059]" />
                    Favoritos ({favoriteItems.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {favoriteItems.map((fav) => {
                    const FavIcon = fav.icon;
                    const isActive = activeSubModuleId === fav.id;
                    return (
                      <button
                        key={fav.id}
                        onClick={() => navigateToSubModule(fav.parentModule.id, fav.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#14281D] text-[#FAF7F2]'
                            : 'text-[#14281D] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FavIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                          <span className="truncate">{fav.label}</span>
                        </div>
                        <Star
                          onClick={(e) => handleToggleFavorite(fav.id, e)}
                          className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059] hover:opacity-75 shrink-0"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Navigation Modules Accordion */}
            <div className="space-y-1">
              <div className="px-3 py-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                  Módulos do Sistema
                </span>
              </div>

              {ADMIN_NAVIGATION_MODULES.map((module) => {
                const ModuleIcon = module.icon;
                const isAuthorized = hasPermission(userRole, module.id);
                if (!isAuthorized) return null;

                const isOpen = openModules[module.id] ?? false;
                const isModuleActive = activeModuleId === module.id;

                return (
                  <div key={module.id} className="rounded-2xl overflow-hidden transition-all">
                    
                    {/* Module Accordion Header */}
                    <button
                      onClick={() => toggleModuleAccordion(module.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isModuleActive
                          ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
                          : 'text-[#14281D] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ModuleIcon className={`w-4 h-4 ${isModuleActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                        <span>{module.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isOpen ? (
                          <ChevronDown className={`w-3.5 h-3.5 ${isModuleActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                        ) : (
                          <ChevronRight className={`w-3.5 h-3.5 ${isModuleActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                        )}
                      </div>
                    </button>

                    {/* Sub-Items List */}
                    {isOpen && (
                      <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#E2D9C8] ml-5 my-1">
                        {module.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeSubModuleId === subItem.id;
                          const badge = getSubItemBadge(subItem.id);
                          const isFav = isSubModuleFavorite(subItem.id);

                          return (
                            <div
                              key={subItem.id}
                              onClick={() => navigateToSubModule(module.id, subItem.id)}
                              className={`group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
                                isSubActive
                                  ? 'bg-[#C5A059] text-[#14281D] font-bold shadow-xs'
                                  : 'text-[#2C4837] hover:bg-[#FAF7F2] hover:text-[#14281D]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-1">
                                <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#14281D]' : 'text-[#8C7A5B]'}`} />
                                <span className="truncate">{subItem.label}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {badge !== null && badge > 0 && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                                      isSubActive
                                        ? 'bg-[#14281D] text-[#FAF7F2]'
                                        : 'bg-[#FAF7F2] text-[#14281D] border border-[#E2D9C8]'
                                    }`}
                                  >
                                    {badge}
                                  </span>
                                )}

                                <Star
                                  onClick={(e) => handleToggleFavorite(subItem.id, e)}
                                  className={`w-3.5 h-3.5 transition-all ${
                                    isFav
                                      ? 'text-[#C5A059] fill-[#C5A059]'
                                      : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-[#C5A059]'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>
        </aside>

        {/* ERP Main Active Module Area (Desktop 9 cols) */}
        <main className="lg:col-span-9 min-h-[600px] space-y-6">
          
          {/* Dashboard Module */}
          {activeModuleId === 'dashboard' && (
            <AdminDashboardERP
              products={products}
              orders={orders}
              onNavigate={handleLegacyNavigate}
              onOpenNewProductModal={() => {
                navigateToSubModule('products', 'products-list');
                setIsOpenNewProdModalFromDash(true);
              }}
              onExportOrdersCSV={handleExportOrdersCSV}
            />
          )}

          {/* Orders Module */}
          {activeModuleId === 'orders' && (
            <AdminOrdersERP orders={orders} />
          )}

          {/* Products Module */}
          {activeModuleId === 'products' && (
            <>
              {activeSubModuleId === 'products-list' && (
                <AdminProductsERP
                  products={products}
                  categories={categories}
                  isOpenCreateModalFromDash={isOpenNewProdModalFromDash}
                  onCloseCreateModalFromDash={() => setIsOpenNewProdModalFromDash(false)}
                />
              )}
              {activeSubModuleId === 'products-categories' && (
                <AdminCategoriesERP categories={categories} />
              )}
              {activeSubModuleId === 'products-inventory' && (
                <AdminInventoryERP products={products} />
              )}
              {activeSubModuleId === 'products-reviews' && (
                <AdminReviewsERP />
              )}
              {(activeSubModuleId === 'products-collections' || activeSubModuleId === 'products-brands') && (
                <AdminProductsERP products={products} categories={categories} />
              )}
            </>
          )}

          {/* Customers Module */}
          {activeModuleId === 'customers' && (
            <AdminCustomersERP orders={orders} />
          )}

          {/* Marketing Module */}
          {activeModuleId === 'marketing' && (
            <AdminMarketingERP
              initialTab={
                activeSubModuleId === 'marketing-coupons'
                  ? 'coupons'
                  : activeSubModuleId === 'marketing-popups'
                  ? 'popups'
                  : activeSubModuleId === 'marketing-newsletter'
                  ? 'newsletter'
                  : activeSubModuleId === 'marketing-banners'
                  ? 'banners'
                  : 'campaigns'
              }
            />
          )}

          {/* Content Module */}
          {activeModuleId === 'content' && (
            <AdminContentERP
              initialTab={
                activeSubModuleId === 'content-blog'
                  ? 'blog'
                  : activeSubModuleId === 'content-botanical'
                  ? 'botanical'
                  : activeSubModuleId === 'content-fragrances'
                  ? 'fragrances'
                  : 'pages'
              }
            />
          )}

          {/* Financial Module */}
          {activeModuleId === 'financial' && (
            <AdminFinanceERP
              initialTab={
                activeSubModuleId === 'financial-payments'
                  ? 'payments'
                  : activeSubModuleId === 'financial-refunds'
                  ? 'refunds'
                  : 'reports'
              }
            />
          )}

          {/* Logistics Module */}
          {activeModuleId === 'logistics' && (
            <AdminLogisticsERP
              initialTab={
                activeSubModuleId === 'logistics-freight'
                  ? 'freight'
                  : activeSubModuleId === 'logistics-carriers'
                  ? 'carriers'
                  : 'tracking'
              }
            />
          )}

          {/* Store Settings Module */}
          {activeModuleId === 'settings' && (
            <AdminStoreConfigERP
              initialTab={
                (activeSubModuleId.replace('settings-', '') as SettingsTabId) || 'brand'
              }
            />
          )}

          {/* Compliance Center Module */}
          {activeModuleId === 'compliance' && (
            <AdminComplianceERP
              initialTab={
                (activeSubModuleId.replace('compliance-', '') as ComplianceSubTab) || 'privacy-policy'
              }
            />
          )}

          {/* Health System Module */}
          {activeModuleId === 'health' && (
            <AdminHealthERP />
          )}

          {/* Users & RBAC Module */}
          {activeModuleId === 'users' && (
            <AdminUsersRBAC />
          )}

          {/* System Tools Module */}
          {activeModuleId === 'tools' && (
            <AdminToolsERP />
          )}

        </main>

      </div>

      {/* Global Search Modal */}
      <AdminGlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(modId, subId) => {
          navigateToSubModule(modId as AdminModuleId, subId);
        }}
      />

    </div>
  );
};
