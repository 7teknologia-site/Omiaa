import React from 'react';
import { SlidersHorizontal, RotateCcw, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';

export const ProductGrid: React.FC = () => {
  const { products, categories, filters, setFilters, resetFilters } = useShop();

  // Filter products based on category, search, stock, price
  const filteredProducts = products.filter((product) => {
    if (filters.category !== 'todos' && product.category !== filters.category) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSub = product.subtitle.toLowerCase().includes(q);
      const matchIng = product.ingredients.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchSub && !matchIng) return false;
    }
    if (filters.onlyInStock && product.stock <= 0) {
      return false;
    }
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const activeCategory = categories.find((c) => c.id === filters.category) || categories[0];

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Category Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#14281D] text-[#FAF7F2] p-8 sm:p-14 border border-[#C5A059]/40 shadow-xl">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src={activeCategory.bannerImage}
            alt={activeCategory.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#C5A059] px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest border border-[#C5A059]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Coleção Apotheca OMIAÁ
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
            {activeCategory.name}
          </h1>
          <p className="text-sm sm:text-base text-[#EFE8DC]/85 leading-relaxed font-sans max-w-xl">
            {activeCategory.description}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id as CategoryId }))}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border font-sans ${
                isActive
                  ? 'bg-[#14281D] text-[#C5A059] border-[#C5A059] shadow-sm'
                  : 'bg-white text-[#4A5568] border-[#E2D9C8] hover:border-[#14281D] hover:text-[#14281D]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Sort & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2D9C8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Count & Active filters tag */}
        <div className="flex items-center gap-3 text-xs text-[#4A5568] font-sans">
          <span className="font-bold text-[#14281D] text-sm">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'Produto Alquímico' : 'Produtos Alquímicos'}
          </span>
          {filters.searchQuery && (
            <span className="bg-[#EFE8DC] text-[#14281D] px-2.5 py-1 rounded-full font-semibold">
              Busca: "{filters.searchQuery}"
            </span>
          )}
        </div>

        {/* Controls: Sort Dropdown & Stock Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end font-sans">
          
          <label className="flex items-center gap-2 text-xs font-semibold text-[#4A5568] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => setFilters((p) => ({ ...p, onlyInStock: e.target.checked }))}
              className="rounded border-gray-300 text-[#14281D] focus:ring-[#C5A059]"
            />
            <span>Apenas em Estoque</span>
          </label>

          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-full px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value as any }))}
              className="bg-transparent text-xs font-semibold text-[#14281D] focus:outline-none cursor-pointer"
            >
              <option value="popular">Mais Relevantes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Lançamentos</option>
            </select>
          </div>

          {(filters.category !== 'todos' || filters.searchQuery || filters.onlyInStock) && (
            <button
              onClick={resetFilters}
              className="p-2 text-xs text-[#B85B3A] hover:text-red-700 font-bold flex items-center gap-1"
              title="Limpar Filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Limpar</span>
            </button>
          )}

        </div>

      </div>

      {/* Grid of Products */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2D9C8] p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#8C7A5B] flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">
            Nenhum elixir encontrado
          </h3>
          <p className="text-xs text-[#718096] font-sans">
            Não encontramos preparados botânicos correspondentes aos filtros selecionados. Tente buscar por outros termos ou reiniciar a busca.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-[#14281D] text-[#FAF7F2] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors shadow-sm font-sans"
          >
            Ver Toda a Apotheca
          </button>
        </div>
      )}

    </section>
  );
};

