import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  Settings
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';

export const Header: React.FC = () => {
  const {
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    categories,
    user
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCategoryClick = (catId: CategoryId) => {
    setFilters((prev) => ({ ...prev, category: catId }));
    if (viewMode !== 'catalog') {
      setViewMode('catalog');
    }
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
    if (viewMode !== 'catalog') {
      setViewMode('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E2D9C8] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#14281D] hover:text-[#C5A059] transition-colors rounded-lg"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Brand */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setViewMode('catalog')}>
            <div className="w-10 h-10 rounded-full bg-[#14281D] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/50 shadow-md group-hover:border-[#C5A059] group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-[0.22em] font-semibold text-[#14281D] uppercase block leading-none">
                OMIAÁ
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#C5A059] font-semibold uppercase block mt-1">
                Alquimia Ancestral
              </span>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleCategoryClick('todos')}
              className={`text-xs font-semibold tracking-widest uppercase transition-colors relative py-1.5 ${
                filters.category === 'todos' && viewMode === 'catalog'
                  ? 'text-[#14281D]'
                  : 'text-[#4A5568] hover:text-[#14281D]'
              }`}
            >
              Todos
              {filters.category === 'todos' && viewMode === 'catalog' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A059] rounded-full shadow-xs" />
              )}
            </button>

            {categories.slice(1, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors relative py-1.5 ${
                  filters.category === cat.id && viewMode === 'catalog'
                    ? 'text-[#14281D]'
                    : 'text-[#4A5568] hover:text-[#14281D]'
                }`}
              >
                {cat.name.split(' ')[0]}
                {filters.category === cat.id && viewMode === 'catalog' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A059] rounded-full shadow-xs" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Search Input inline or expandable */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center bg-[#EFE8DC]/80 rounded-full border border-[#D8CFA7] transition-all overflow-hidden ${
                  searchOpen ? 'w-48 sm:w-64 px-3 py-1.5 ring-1 ring-[#C5A059]' : 'w-10 h-10 justify-center cursor-pointer hover:border-[#C5A059]'
                }`}
                onClick={() => !searchOpen && setSearchOpen(true)}
              >
                <Search className="w-4 h-4 text-[#14281D] shrink-0" />
                {searchOpen && (
                  <>
                    <input
                      type="text"
                      placeholder="Buscar elixires, óleos..."
                      value={filters.searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                      className="w-full bg-transparent text-xs text-[#14281D] placeholder-[#718096] focus:outline-none ml-2 font-medium"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchOpen(false);
                        setFilters((p) => ({ ...p, searchQuery: '' }));
                      }}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Admin Management Toggle button */}
            <button
              onClick={() => setViewMode(viewMode === 'admin' ? 'catalog' : 'admin')}
              title="Painel de Gestão da Apotheca"
              className={`p-2.5 rounded-full border transition-all ${
                viewMode === 'admin'
                  ? 'bg-[#14281D] text-[#C5A059] border-[#C5A059] shadow-sm'
                  : 'bg-white/70 text-[#4A5568] border-[#E2D9C8] hover:text-[#14281D] hover:border-[#C5A059]'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Account Portal Button */}
            <button
              onClick={() => setViewMode('account')}
              className={`p-2.5 rounded-full border transition-all relative ${
                viewMode === 'account'
                  ? 'bg-[#14281D] text-[#C5A059] border-[#C5A059] shadow-sm'
                  : 'bg-white/70 text-[#4A5568] border-[#E2D9C8] hover:text-[#14281D] hover:border-[#C5A059]'
              }`}
              title="Minha Conta"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setViewMode('account');
              }}
              className="p-2.5 rounded-full bg-white/70 border border-[#E2D9C8] text-[#4A5568] hover:text-[#14281D] hover:border-[#C5A059] transition-all relative"
              title="Lista de Desejos"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B85B3A] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#14281D] text-[#FAF7F2] px-4 py-2.5 rounded-full border border-[#C5A059]/40 hover:bg-[#1B3B2B] hover:border-[#C5A059] transition-all shadow-sm group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#B85B3A] text-white text-[9px] font-bold flex items-center justify-center">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-[#FAF7F2]">
                Sacola
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E2D9C8] px-6 py-5 space-y-3.5 shadow-lg">
          <div className="text-[10px] font-bold text-[#8C7A5B] uppercase tracking-widest mb-1">
            Categorias da Apotheca
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full text-left py-2.5 text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-between border-b border-[#E2D9C8]/40 ${
                filters.category === cat.id ? 'text-[#14281D] font-bold text-[#C5A059]' : 'text-[#4A5568]'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[#C5A059]">›</span>
            </button>
          ))}
          <div className="pt-3 flex items-center justify-between text-xs text-[#4A5568]">
            <span>Olá, <strong className="text-[#14281D]">{user.name}</strong></span>
            <button
              onClick={() => {
                setViewMode('account');
                setMobileMenuOpen(false);
              }}
              className="text-[#C5A059] font-bold underline hover:text-[#14281D]"
            >
              Ver Minha Conta
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

