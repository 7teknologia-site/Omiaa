import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';
import { Logo } from '../../components/ui/Logo';
import { MoonPhaseWidget } from '../../components/ui/MoonPhaseWidget';

export const Header: React.FC = () => {
  const {
    categories,
    cartTotalCount,
    wishlist,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    setIsCartOpen
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  useEffect(() => {
    // Ensure standard light parchment theme is active
    document.documentElement.classList.remove('dark');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
    if (viewMode !== 'catalog') {
      setViewMode('catalog');
    }
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setFilters((prev) => ({ ...prev, category: catId }));
    if (viewMode !== 'catalog') {
      setViewMode('catalog');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E2D9C8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#14281D] hover:bg-[#E2D9C8]/40 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <Logo onClick={() => setViewMode('catalog')} size="md" />

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar elixires, séruns, chás ancestrais..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-full py-2.5 pl-10 pr-4 text-xs font-medium text-[#14281D] placeholder-[#8C7A5B] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="hidden lg:block mr-1">
              <MoonPhaseWidget variant="compact" />
            </div>

            <button
              onClick={() => setViewMode('account')}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                viewMode === 'account'
                  ? 'bg-[#14281D] text-[#C5A059] border-[#14281D]'
                  : 'border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/30'
              }`}
              title="Sua Conta Alquímica"
            >
              <User className="w-4 h-4" />
              <span className="hidden xl:inline">Conta</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                viewMode === 'admin'
                  ? 'bg-[#14281D] text-[#C5A059] border-[#14281D]'
                  : 'border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/30'
              }`}
              title="Painel de Gestão"
            >
              <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
              <span className="hidden xl:inline">Painel</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, selectedBadge: 'favoritos' }));
                setViewMode('catalog');
              }}
              className="p-2.5 rounded-full border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/30 transition-all relative"
              title="Lista de Desejos"
            >
              <Heart className="w-4 h-4 text-[#14281D]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-[#14281D] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] transition-all relative flex items-center gap-2 px-4 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Sacola</span>
              <span className="bg-[#C5A059] text-[#14281D] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartTotalCount}
              </span>
            </button>

          </div>

        </div>

        {/* Categories & Specialized Views Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-6 py-3 border-t border-[#E2D9C8]/60 text-xs font-bold uppercase tracking-widest text-[#14281D]">
          <button
            onClick={() => handleCategorySelect('todos')}
            className={`transition-colors hover:text-[#C5A059] pb-1 border-b-2 ${
              filters.category === 'todos' && viewMode === 'catalog' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Todos os Rituais
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`transition-colors hover:text-[#C5A059] pb-1 border-b-2 ${
                filters.category === cat.id && viewMode === 'catalog' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <span className="text-[#E2D9C8]">|</span>
          <button
            onClick={() => { setViewMode('fragrance-atelier'); setIsMobileMenuOpen(false); }}
            className={`transition-colors hover:text-[#C5A059] pb-1 border-b-2 ${
              viewMode === 'fragrance-atelier' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Fragrâncias Personalizadas
          </button>
          <button
            onClick={() => { setViewMode('botanical'); setIsMobileMenuOpen(false); }}
            className={`transition-colors hover:text-[#C5A059] pb-1 border-b-2 ${
              viewMode === 'botanical' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Guia das Ervas
          </button>
          <button
            onClick={() => { setViewMode('blog'); setIsMobileMenuOpen(false); }}
            className={`transition-colors hover:text-[#C5A059] pb-1 border-b-2 ${
              viewMode === 'blog' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent'
            }`}
          >
            Blog
          </button>
        </nav>


      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2D9C8] bg-[#FAF7F2] px-4 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Buscar rituais..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-[#E2D9C8] rounded-full py-2 pl-9 pr-4 text-xs"
            />
            <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider text-[#14281D]">
            <button
              onClick={() => handleCategorySelect('todos')}
              className="text-left py-2 border-b border-[#E2D9C8]/50"
            >
              Todos os Rituais
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="text-left py-2 border-b border-[#E2D9C8]/50"
              >
                {cat.name}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E2D9C8]/80 flex flex-col space-y-2">
              <button
                onClick={() => { setViewMode('fragrance-atelier'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 border-b border-[#E2D9C8]/50 text-[#C5A059]"
              >
                Fragrâncias Personalizadas
              </button>
              <button
                onClick={() => { setViewMode('botanical'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 border-b border-[#E2D9C8]/50 text-[#C5A059]"
              >
                Guia das Ervas
              </button>
              <button
                onClick={() => { setViewMode('blog'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 border-b border-[#E2D9C8]/50 text-[#C5A059]"
              >
                Blog
              </button>
              <button
                onClick={() => { setViewMode('account'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 text-[#C5A059]"
              >
                Minha Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
