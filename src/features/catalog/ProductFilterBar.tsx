import React from 'react';
import { Filter, RotateCcw, Search, X, Sparkles, Tag, Crown, Feather, Flame } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryId, FilterState } from '../../types';

export const ProductFilterBar: React.FC = () => {
  const { categories, filters, setFilters, resetFilters } = useShop();

  const BADGE_OPTIONS = [
    { label: 'Todos os Selos', value: '' },
    { label: 'Novo', value: 'Novo', icon: Sparkles },
    { label: 'Promoção', value: 'Promoção', icon: Tag },
    { label: 'Exclusivo', value: 'Exclusivo', icon: Crown },
    { label: 'Artesanal', value: 'Artesanal', icon: Feather },
    { label: 'Mais Vendido', value: 'Mais Vendido', icon: Flame }
  ];

  const hasActiveFilters =
    filters.category !== 'todos' ||
    filters.searchQuery.trim() !== '' ||
    filters.maxPrice < 500 ||
    filters.onlyInStock ||
    Boolean(filters.selectedBadge);

  return (
    <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6 font-sans">
      
      {/* Top Header & Search Bar Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-lg font-bold text-[#14281D]">Filtrar Alquimia Ancestral</h2>
        </div>

        {/* Instant Search Bar Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Busca instantânea por produto, SKU, erva ou ingrediente..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] focus:border-[#C5A059] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#14281D] font-medium placeholder-[#718096] focus:outline-none transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#14281D] p-1"
              title="Limpar Busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1.5 transition-colors uppercase tracking-wider bg-rose-50 px-3 py-2 rounded-xl border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        )}

      </div>

      {/* Badges Filter Bar */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
          Filtrar por Selo & Badge
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {BADGE_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = (filters.selectedBadge || '') === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, selectedBadge: item.value || undefined }))}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#14281D] text-[#C5A059] ring-2 ring-[#C5A059] shadow-xs scale-102'
                    : 'bg-[#FAF7F2] text-[#14281D] border border-[#E2D9C8] hover:bg-[#E2D9C8]/40'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Dropdowns & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Category Selector */}
        <div>
          <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider mb-1">
            Categoria Ritual
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as CategoryId }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-2.5 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          >
            <option value="todos">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order By */}
        <div>
          <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider mb-1">
            Ordenar Por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-2.5 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          >
            <option value="popular">Mais Populares</option>
            <option value="newest">Lançamentos (Novo)</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>

        {/* Price Range Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
            <span>Preço Máximo</span>
            <span className="text-[#14281D]">Até R$ {filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-[#14281D] cursor-pointer"
          />
        </div>

        {/* Checkbox Stock */}
        <div className="flex items-center pt-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#14281D] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E2D9C8] w-full">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => setFilters((prev) => ({ ...prev, onlyInStock: e.target.checked }))}
              className="w-4 h-4 rounded border-[#E2D9C8] text-[#14281D] focus:ring-[#C5A059]"
            />
            <span>Apenas itens em estoque</span>
          </label>
        </div>

      </div>
    </div>
  );
};

