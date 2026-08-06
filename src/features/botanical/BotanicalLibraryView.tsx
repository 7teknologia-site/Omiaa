import React, { useEffect, useState, useMemo } from 'react';
import {
  Flower2,
  ArrowLeft,
  Sparkles,
  Moon,
  Sun,
  Search,
  BookOpen,
  ShoppingBag,
  X,
  Plus
} from 'lucide-react';
import { BotanicalEntry, BlogPost } from '../../types';
import { fetchBotanicalEntries, fetchBlogPosts } from '../../services/supabaseService';
import { useShop } from '../../context/ShopContext';
import { SEOHead } from '../../components/seo/SEOHead';
import { Breadcrumb } from '../../components/navigation/Breadcrumb';

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Ervas', value: 'ervas' },
  { label: 'Banhos', value: 'banhos' },
  { label: 'Defumações', value: 'defumações' },
  { label: 'Óleos', value: 'óleos' },
  { label: 'Resinas', value: 'resinas' },
  { label: 'Plantas', value: 'plantas' }
];

export const BotanicalLibraryView: React.FC = () => {
  const { setViewMode, products, addToCart, showToast } = useShop();

  const [entries, setEntries] = useState<BotanicalEntry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeElement, setActiveElement] = useState('todos');

  // Detail Modal State
  const [selectedEntry, setSelectedEntry] = useState<BotanicalEntry | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchBotanicalEntries(), fetchBlogPosts()]).then(([botData, postsData]) => {
      if (isMounted) {
        setEntries(botData || []);
        setBlogPosts(postsData || []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch =
        item.popularName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.historicalOrigin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.medicinalProperties || []).some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.spiritualProperties || []).some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        activeCategory === 'todas' ||
        (item.category || 'Ervas').toLowerCase() === activeCategory.toLowerCase();

      const matchesElem =
        activeElement === 'todos' ||
        (item.element || '').toLowerCase().includes(activeElement.toLowerCase());

      return matchesSearch && matchesCat && matchesElem;
    });
  }, [entries, searchQuery, activeCategory, activeElement]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center font-serif text-[#14281D]">
        <Flower2 className="w-10 h-10 text-[#C5A059] mx-auto animate-spin mb-3" />
        <p className="animate-pulse text-lg">Consultando Guia das Ervas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Dynamic SEO Meta Tags & Schema.org */}
      <SEOHead
        title={
          selectedEntry
            ? `${selectedEntry.popularName} (${selectedEntry.botanicalName}) - Guia das Ervas`
            : 'Guia das Ervas - Compêndio de Ervas & Fitoterapia'
        }
        description={
          selectedEntry
            ? selectedEntry.historicalOrigin
            : 'Compêndio ancestral de ervas sagradas, banhos, defumações, óleos rituais e resinas da alquimia ancestral.'
        }
        keywords={['Guia das Ervas', 'Fitoterapia', 'Ervas', 'Banhos', 'Defumações', 'Óleos', 'Resinas']}
        canonicalUrl={selectedEntry ? `/botanica/${selectedEntry.slug}` : '/botanica'}
        botanical={selectedEntry || undefined}
        breadcrumbItems={[
          { name: 'Início', item: '/' },
          { name: 'Guia das Ervas', item: '/botanica' },
          ...(selectedEntry ? [{ name: selectedEntry.popularName, item: `/botanica/${selectedEntry.slug}` }] : [])
        ]}
      />

      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-6">
        <Breadcrumb items={[{ label: 'Guia das Ervas', active: true }]} />

        <div className="flex items-center gap-3">
          <Flower2 className="w-7 h-7 text-[#C5A059]" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#14281D]">
              Guia das Ervas
            </h1>
            <p className="text-xs text-[#718096]">
              Central de conhecimento sobre Ervas, Banhos, Defumações, Óleos, Resinas e Saberes Ancestrais
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.value;
          const count =
            tab.value === 'todas'
              ? entries.length
              : entries.filter((e) => (e.category || 'Ervas').toLowerCase() === tab.value.toLowerCase()).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#14281D] text-[#FAF7F2] shadow-md scale-102'
                  : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-[#C5A059] text-[#14281D]' : 'bg-[#FAF7F2] text-[#718096]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Element Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome popular, botânico, propriedade ou história da planta..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Element Filter Dropdown */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2 text-xs">
          <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
          <select
            value={activeElement}
            onChange={(e) => setActiveElement(e.target.value)}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Elementos Alquímicos</option>
            <option value="água">Elemento Água</option>
            <option value="fogo">Elemento Fogo</option>
            <option value="terra">Elemento Terra</option>
            <option value="ar">Elemento Ar</option>
            <option value="éter">Elemento Éter</option>
          </select>
        </div>

      </div>

      {/* Results Count Indicator */}
      <div className="flex items-center justify-between text-xs text-[#718096] px-1">
        <span>Exibindo <strong>{filteredEntries.length}</strong> entradas cadastradas no compêndio</span>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-[#C5A059] underline hover:text-[#14281D]">
            Limpar Busca
          </button>
        )}
      </div>

      {/* Grid of Botanical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden hover:border-[#C5A059] transition-all flex flex-col justify-between group"
          >
            <div className="p-6 space-y-4">
              
              {/* Category Pill & Element */}
              <div className="flex items-center justify-between">
                <span className="bg-[#14281D] text-[#C5A059] font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                  {item.category || 'Ervas'}
                </span>

                <span className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] font-bold px-3 py-1 rounded-full text-[10px] uppercase">
                  {item.element}
                </span>
              </div>

              {/* Names */}
              <div>
                <span className="text-[11px] font-mono italic text-[#C5A059] block">{item.botanicalName}</span>
                <h3 className="font-serif text-xl font-bold text-[#14281D] group-hover:text-[#C5A059] transition-colors">
                  {item.popularName}
                </h3>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl border border-[#E2D9C8] h-48">
                <img
                  src={item.imageUrl}
                  alt={item.popularName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Lunar Phase & Chakra Tags */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]">
                <div className="flex items-center gap-1.5 text-[#14281D]">
                  <Moon className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span><strong>Fase:</strong> {item.lunarPhase || 'Todas'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#14281D]">
                  <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span><strong>Chakra:</strong> {item.chakra || 'Geral'}</span>
                </div>
              </div>

              {/* Properties */}
              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-[#14281D] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Medicinal
                  </h4>
                  <ul className="list-disc list-inside text-[#718096] space-y-0.5 pl-1">
                    {(item.medicinalProperties || []).slice(0, 3).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Card Footer Button */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E2D9C8] flex items-center justify-between">
              <span className="text-[10px] italic text-[#8C7A5B] line-clamp-1 max-w-[180px]">
                {item.historicalOrigin}
              </span>

              <button
                onClick={() => setSelectedEntry(item)}
                className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Ver Guia
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RICH BOTANICAL DETAIL MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl font-sans text-xs my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E2D9C8] pb-4">
              <div className="space-y-1">
                <span className="bg-[#14281D] text-[#C5A059] font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                  {selectedEntry.category || 'Erva Sagrada'}
                </span>

                <h2 className="font-serif text-2xl font-bold text-[#14281D] pt-1">
                  {selectedEntry.popularName}
                </h2>
                <p className="font-mono italic text-xs text-[#C5A059]">
                  {selectedEntry.botanicalName}
                </p>
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image & Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <img
                src={selectedEntry.imageUrl}
                alt={selectedEntry.popularName}
                className="w-full h-56 object-cover rounded-2xl border border-[#E2D9C8]"
              />

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A5B] block">Elemento</span>
                    <span className="font-bold text-[#14281D]">{selectedEntry.element}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A5B] block">Fase Lunar</span>
                    <span className="font-bold text-[#14281D]">{selectedEntry.lunarPhase || 'Geral'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A5B] block">Chakra</span>
                    <span className="font-bold text-[#14281D]">{selectedEntry.chakra || 'Geral'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2D9C8]">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A5B] block mb-1">Origem & Tradição</span>
                  <p className="text-xs text-[#718096] italic">{selectedEntry.historicalOrigin}</p>
                </div>
              </div>
            </div>

            {/* Preparation Method */}
            {selectedEntry.preparationMethod && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">
                  Modo de Preparo & Posologia Sugerida:
                </span>
                <p className="text-xs font-bold text-amber-950">{selectedEntry.preparationMethod}</p>
              </div>
            )}

            {/* Rich Content Render */}
            {selectedEntry.richContent ? (
              <div className="space-y-3 bg-[#FAF7F2]/40 p-5 rounded-2xl border border-[#E2D9C8]">
                <h3 className="font-serif font-bold text-base text-[#14281D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Guia Ritualístico & Propriedades Alquímicas</span>
                </h3>

                <div
                  className="prose prose-sm max-w-none text-[#14281D] leading-relaxed [&_h3]:font-serif [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#14281D] [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-[#C5A059] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C5A059] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[#718096]"
                  dangerouslySetInnerHTML={{ __html: selectedEntry.richContent }}
                />
              </div>
            ) : null}

            {/* RELATED PRODUCTS FROM ALQUIMIA ANCESTRAL CATALOG */}
            {(selectedEntry.relatedProductIds || []).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E2D9C8]">
                <h3 className="font-serif font-bold text-base text-[#14281D] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>Produtos Relacionados da Alquimia Ancestral</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products
                    .filter((p) => (selectedEntry.relatedProductIds || []).includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="p-3 bg-white border border-[#E2D9C8] rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-xs text-[#14281D] line-clamp-1">{p.name}</h4>
                            <span className="text-[#C5A059] font-bold text-xs block">
                              R$ {p.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p);
                            showToast('Adicionado ao Carrinho', `${p.name} foi adicionado.`, 'success');
                          }}
                          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] p-2 rounded-xl text-xs font-bold transition-colors shrink-0"
                          title="Comprar"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* RELATED BLOG ARTICLES */}
            {(selectedEntry.relatedArticleIds || []).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E2D9C8]">
                <h3 className="font-serif font-bold text-base text-[#14281D] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Artigos Relacionados no Diário Alquímico</span>
                </h3>

                <div className="space-y-2">
                  {blogPosts
                    .filter((post) => (selectedEntry.relatedArticleIds || []).includes(post.id))
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          setSelectedEntry(null);
                          setViewMode('blog');
                        }}
                        className="p-3 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl flex items-center justify-between hover:border-[#C5A059] cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="font-serif font-bold text-xs text-[#14281D]">{post.title}</h4>
                          <p className="text-[10px] text-[#718096] line-clamp-1">{post.excerpt}</p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-[#C5A059] rotate-180 shrink-0 ml-2" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#E2D9C8] flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all"
              >
                Fechar Guia
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
