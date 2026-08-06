import React from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ProductFilterBar } from './ProductFilterBar';
import { useProductFilter } from '../../hooks/useProductFilter';
import { SEOHead } from '../../components/seo/SEOHead';
import { Breadcrumb } from '../../components/navigation/Breadcrumb';

export const ProductGrid: React.FC = () => {
  const { products, filters, categories } = useShop();
  const {
    paginatedProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount
  } = useProductFilter(products, filters);

  const activeCategoryObj = categories.find((c) => c.id === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Dynamic SEO Head for Catalog / Home */}
      <SEOHead
        title={activeCategoryObj ? `${activeCategoryObj.name} - OMIAÁ Alquimia Ancestral` : 'Botânica & Elixires Ancestrais'}
        description={
          activeCategoryObj
            ? activeCategoryObj.description
            : 'Explore elixires botânicos macerados sob o ciclo lunar, séruns faciais, óleos corporais e velas rituais.'
        }
        canonicalUrl={activeCategoryObj ? `/catalogo?categoria=${activeCategoryObj.id}` : '/catalogo'}
        breadcrumbItems={[
          { name: 'Início', item: '/' },
          { name: 'Catálogo', item: '/catalogo' }
        ]}
      />

      <Breadcrumb items={[{ label: activeCategoryObj ? activeCategoryObj.name : 'Catálogo Principal', active: true }]} />

      {/* Category Hero / Title Header */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1B3527] border border-[#2C4837] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alquimia Cosmética Consciente</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : 'Sua Jornada Alquímica'}
          </h1>

          <p className="text-xs sm:text-sm text-[#A8B2A6] leading-relaxed">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Formulações botânicas concentradas com extratos puros de plantas ancestrais, resinas sagradas e óleos prensados a frio.'}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProductFilterBar />

      {/* Catalog Grid Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between text-xs text-[#8C7A5B] border-b border-[#E2D9C8] pb-4">
          <span className="font-medium">Mostrando <strong className="text-[#14281D] font-serif text-sm">{paginatedProducts.length}</strong> de <strong className="text-[#14281D] font-serif text-sm">{totalCount}</strong> alquimias encontradas</span>
          {filters.selectedBadge && (
            <span className="bg-[#C5A059]/20 text-[#14281D] font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-wider border border-[#C5A059]/30">
              Selo: {filters.selectedBadge}
            </span>
          )}
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#FDFBF7] p-12 sm:p-16 rounded-3xl border border-[#E2D9C8] text-center space-y-4 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#14281D]">Nenhuma alquimia encontrada</h3>
            <p className="text-xs text-[#5A6B5D] max-w-md mx-auto">Tente ajustar os critérios de busca ou redefinir os filtros para explorar nossas coleções botânicas.</p>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-[#E2D9C8] text-[#14281D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#14281D] hover:text-[#C5A059] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#14281D] text-[#C5A059] shadow-xs'
                      : 'border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/40'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-[#E2D9C8] text-[#14281D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#14281D] hover:text-[#C5A059] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
