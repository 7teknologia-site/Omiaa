import React, { useState, useEffect, useMemo } from 'react';
import {
  Flower2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Download,
  Globe,
  ShoppingBag,
  BookOpen,
  Check,
  Flame,
  Droplet,
  Tag,
  Eye,
  Info,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BotanicalEntry, BotanicalCategory, BlogPost } from '../../types';
import { fetchBotanicalEntries, fetchBlogPosts } from '../../services/supabaseService';
import { useShop } from '../../context/ShopContext';
import { ErpPagination } from './components/ErpPagination';
import { RichTextEditor } from './components/RichTextEditor';
import { generateBotanicalSEO, calculateSeoScore } from '../botanical/utils/seoGenerator';
import { exportToCSV } from './utils/csvExporter';

const FIXED_CATEGORIES: BotanicalCategory[] = [
  'Ervas',
  'Banhos',
  'Defumações',
  'Óleos',
  'Resinas',
  'Plantas'
];

export const AdminBotanicalERP: React.FC = () => {
  const { products, showToast } = useShop();

  const [entries, setEntries] = useState<BotanicalEntry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todas');
  const [elementFilter, setElementFilter] = useState<string>('todos');

  // Custom Categories state
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [isManagingCats, setIsManagingCats] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // CMS Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BotanicalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'conteudo' | 'seo' | 'relacionados'>('geral');

  // Form State
  const [formData, setFormData] = useState<Partial<BotanicalEntry>>({
    popularName: '',
    botanicalName: '',
    category: 'Ervas',
    element: 'Água',
    lunarPhase: 'Lua Cheia',
    chakra: 'Cardíaco',
    historicalOrigin: 'Tradição Ancestral Omiaá',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    medicinalProperties: ['Calmante', 'Digestivo'],
    spiritualProperties: ['Harmonização Áurica'],
    richContent: '',
    preparationMethod: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalSlug: ''
    },
    relatedProductIds: [],
    relatedArticleIds: []
  });

  // String helpers for medicinal & spiritual properties inputs
  const [medPropsInput, setMedPropsInput] = useState('');
  const [spirPropsInput, setSpirPropsInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');

  useEffect(() => {
    fetchBotanicalEntries().then((data) => {
      setEntries(data || []);
    });
    fetchBlogPosts().then((posts) => {
      setBlogPosts(posts || []);
    });
  }, []);

  const allCategories = useMemo(() => {
    return Array.from(new Set([...FIXED_CATEGORIES, ...customCategories]));
  }, [customCategories]);

  // Filtering Logic
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        e.popularName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.historicalOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategoryFilter === 'todas' ||
        e.category.toLowerCase() === activeCategoryFilter.toLowerCase();

      const matchesElem =
        elementFilter === 'todos' ||
        e.element.toLowerCase().includes(elementFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesElem;
    });
  }, [entries, searchQuery, activeCategoryFilter, elementFilter]);

  const totalPages = Math.ceil(filteredEntries.length / pageSize);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  // Open Modal Add
  const handleOpenAddModal = (catDefault: BotanicalCategory = 'Ervas') => {
    setEditingEntry(null);
    setActiveTab('geral');

    const initialData: Partial<BotanicalEntry> = {
      popularName: '',
      botanicalName: '',
      category: catDefault,
      element: 'Água',
      lunarPhase: 'Lua Cheia',
      chakra: 'Cardíaco',
      historicalOrigin: 'Tradição Herbal Ancestral',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      medicinalProperties: ['Calmante', 'Purificante'],
      spiritualProperties: ['Proteção Áurica'],
      richContent: '',
      preparationMethod: '',
      relatedProductIds: [],
      relatedArticleIds: []
    };

    const autoSeo = generateBotanicalSEO({
      popularName: 'Nova Entrada',
      category: catDefault,
      element: 'Água'
    });

    initialData.seo = autoSeo;

    setFormData(initialData);
    setMedPropsInput('Calmante, Purificante');
    setSpirPropsInput('Proteção Áurica');
    setKeywordsInput(autoSeo.keywords.join(', '));
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEditModal = (entry: BotanicalEntry) => {
    setEditingEntry(entry);
    setActiveTab('geral');
    setFormData({ ...entry });

    setMedPropsInput((entry.medicinalProperties || []).join(', '));
    setSpirPropsInput((entry.spiritualProperties || []).join(', '));
    setKeywordsInput((entry.seo?.keywords || []).join(', '));

    setIsModalOpen(true);
  };

  // Auto Generate SEO Button Action
  const handleAutoGenerateSEO = () => {
    const generated = generateBotanicalSEO({
      popularName: formData.popularName || 'Entrada Botânica',
      botanicalName: formData.botanicalName,
      category: formData.category,
      element: formData.element,
      chakra: formData.chakra,
      medicinalProperties: medPropsInput.split(',').map((s) => s.trim()).filter(Boolean),
      spiritualProperties: spirPropsInput.split(',').map((s) => s.trim()).filter(Boolean),
      historicalOrigin: formData.historicalOrigin
    });

    setFormData((prev) => ({ ...prev, seo: generated }));
    setKeywordsInput(generated.keywords.join(', '));

    showToast('SEO Gerado', 'Metadados e tags SEO gerados automaticamente com base na ficha técnica.', 'success');
  };

  // Save Record
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.popularName) {
      alert('Por favor, informe ao menos o Nome Popular.');
      return;
    }

    const medProps = medPropsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const spirProps = spirPropsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const kwList = keywordsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const updatedSeo = {
      metaTitle: formData.seo?.metaTitle || `${formData.popularName}: Guia de ${formData.category} | OMIAA`,
      metaDescription: formData.seo?.metaDescription || `Aprenda sobre ${formData.popularName} na categoria ${formData.category}.`,
      keywords: kwList.length > 0 ? kwList : [formData.popularName || 'Erva'],
      canonicalSlug: formData.seo?.canonicalSlug || `/botanica/${(formData.popularName || 'item').toLowerCase().replace(/\s+/g, '-')}`
    };

    if (editingEntry) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingEntry.id
            ? ({
                ...item,
                ...formData,
                medicinalProperties: medProps,
                spiritualProperties: spirProps,
                seo: updatedSeo
              } as BotanicalEntry)
            : item
        )
      );
      showToast('Registro Atualizado', `Ficha CMS de ${formData.popularName} salva com sucesso.`, 'success');
    } else {
      const newEntry: BotanicalEntry = {
        id: `bot-${Date.now()}`,
        slug: (formData.popularName || 'erva').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
        popularName: formData.popularName,
        botanicalName: formData.botanicalName || formData.popularName,
        category: formData.category || 'Ervas',
        element: formData.element || 'Água',
        lunarPhase: formData.lunarPhase || 'Lua Cheia',
        chakra: formData.chakra || 'Cardíaco',
        medicinalProperties: medProps,
        spiritualProperties: spirProps,
        historicalOrigin: formData.historicalOrigin || 'Tradição Alquimia Ancestral',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
        richContent: formData.richContent || '',
        preparationMethod: formData.preparationMethod || '',
        seo: updatedSeo,
        relatedProductIds: formData.relatedProductIds || [],
        relatedArticleIds: formData.relatedArticleIds || []
      };

      setEntries((prev) => [newEntry, ...prev]);
      showToast('Nova Entrada Publicada', `${newEntry.popularName} cadastrada na categoria ${newEntry.category}.`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Record
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir permanentemente "${name}" do Guia das Ervas?`)) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
      showToast('Registro Excluído', `"${name}" foi removido do CMS.`, 'info');
    }
  };

  // Add Custom Category
  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const formatted = newCatName.trim();

    if (allCategories.some((c) => c.toLowerCase() === formatted.toLowerCase())) {
      alert('Esta categoria já existe!');
      return;
    }

    setCustomCategories((prev) => [...prev, formatted]);
    setNewCatName('');
    showToast('Nova Categoria Criada', `Categoria "${formatted}" adicionada ao CMS.`, 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    exportToCSV(
      filteredEntries,
      [
        { key: 'popularName', label: 'Nome Popular' },
        { key: 'botanicalName', label: 'Nome Botânico' },
        { key: 'category', label: 'Categoria CMS' },
        { key: 'element', label: 'Elemento' },
        { key: 'lunarPhase', label: 'Fase Lunar' },
        { key: 'chakra', label: 'Chakra' },
        { key: 'historicalOrigin', label: 'Origem Histórica' }
      ],
      'Guia_das_Ervas_CMS_OMIAA'
    );
  };

  const seoEvaluation = calculateSeoScore(formData.seo);

  return (
    <div className="space-y-6 font-sans">
      
      {/* CMS Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Flower2 className="w-6 h-6 text-[#C5A059]" />
            <span>CMS - Guia das Ervas ({filteredEntries.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Gerenciamento completo de Ervas, Banhos, Defumações, Óleos, Resinas e Plantas com SEO e vinculações.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] px-3.5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setIsManagingCats(!isManagingCats)}
            className="border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] px-3.5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Tag className="w-4 h-4 text-[#C5A059]" />
            <span>Categorias ({allCategories.length})</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('Ervas')}
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Novo Registro CMS</span>
          </button>
        </div>
      </div>

      {/* Category Management Banner Drawer */}
      {isManagingCats && (
        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#14281D] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C5A059]" />
              <span>Gerenciador de Categorias do CMS Botânico</span>
            </h3>
            <button onClick={() => setIsManagingCats(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#718096]">
            Categorias oficiais registradas. Você pode adicionar novas categorias customizadas conforme a necessidade da linha alqúimica.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {allCategories.map((cat) => (
              <span key={cat} className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                <span>{cat}</span>
                {FIXED_CATEGORIES.includes(cat) && <span className="text-[9px] bg-[#C5A059]/20 text-[#14281D] px-1.5 py-0.2 rounded font-mono">Padrão</span>}
              </span>
            ))}
          </div>

          <form onSubmit={handleAddCustomCategory} className="flex gap-2 pt-2 max-w-md">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nome da Nova Categoria (Ex: Unguentos)..."
              className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] rounded-xl font-bold text-xs uppercase"
            >
              Criar
            </button>
          </form>
        </div>
      )}

      {/* Primary Category Quick Filters (Ervas, Banhos, Defumações, Óleos, Resinas, Plantas) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setActiveCategoryFilter('todas');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeCategoryFilter === 'todas'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:bg-[#FAF7F2]'
          }`}
        >
          Todas ({entries.length})
        </button>

        {allCategories.map((cat) => {
          const count = entries.filter((e) => e.category?.toLowerCase() === cat.toLowerCase()).length;
          const isActive = activeCategoryFilter.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
                  : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-[#C5A059] text-[#14281D]' : 'bg-[#FAF7F2] text-[#718096]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Element Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por nome popular, botânico, propriedade ou história..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <Sparkles className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={elementFilter}
            onChange={(e) => {
              setElementFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer text-xs"
          >
            <option value="todos">Todos os Elementos Alquímicos</option>
            <option value="água">Água</option>
            <option value="fogo">Fogo</option>
            <option value="terra">Terra</option>
            <option value="ar">Ar</option>
            <option value="éter">Éter</option>
          </select>
        </div>
      </div>

      {/* Botanical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEntries.map((entry) => {
          const relProdCount = (entry.relatedProductIds || []).length;
          const relArtCount = (entry.relatedArticleIds || []).length;

          return (
            <div key={entry.id} className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs space-y-3 p-5 flex flex-col justify-between hover:border-[#C5A059] transition-all">
              <div className="space-y-3 text-xs">
                
                {/* Badge Category & Element */}
                <div className="flex items-center justify-between">
                  <span className="bg-[#14281D] text-[#C5A059] font-bold px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                    {entry.category || 'Erva'}
                  </span>

                  <span className="bg-[#FAF7F2] border border-[#E2D9C8] font-bold text-[#14281D] px-2.5 py-0.5 rounded-md text-[10px]">
                    Elemento: {entry.element}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <img src={entry.imageUrl} alt={entry.popularName} className="w-16 h-16 rounded-2xl object-cover border border-[#E2D9C8]" />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#14281D] line-clamp-1">{entry.popularName}</h3>
                    <span className="italic text-[11px] text-[#8C7A5B] block line-clamp-1">{entry.botanicalName}</span>
                    <span className="text-[10px] text-[#718096] block mt-0.5">
                      Fase: {entry.lunarPhase || 'Lua Cheia'}
                    </span>
                  </div>
                </div>

                {/* Properties preview tags */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {(entry.medicinalProperties || []).slice(0, 3).map((p, i) => (
                    <span key={i} className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] px-2 py-0.5 rounded-md font-medium">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Association Counts */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E2D9C8]">
                  <div className="flex items-center gap-1.5 text-[#14281D]">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span><strong>{relProdCount}</strong> Produtos Lojistas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#14281D]">
                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span><strong>{relArtCount}</strong> Artigos Blog</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[10px] text-[#8C7A5B] font-mono">
                  {entry.seo?.metaTitle ? 'SEO Ok ✓' : 'Sem SEO'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(entry)}
                    className="p-1.5 text-[#14281D] hover:bg-[#FAF7F2] rounded-lg border border-[#E2D9C8]"
                    title="Editar Registro CMS"
                  >
                    <Edit2 className="w-4 h-4 text-[#C5A059]" />
                  </button>

                  <button
                    onClick={() => handleDelete(entry.id, entry.popularName)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ErpPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredEntries.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* FULL CMS DRAWER MODAL (4 TABS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-3xl w-full p-6 space-y-5 shadow-2xl font-sans text-xs my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                  Gestão de Conteúdo Botânico
                </span>
                <h3 className="font-serif font-bold text-lg text-[#14281D]">
                  {editingEntry ? `Editar: ${editingEntry.popularName}` : 'Cadastrar Nova Entrada no CMS'}
                </h3>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('geral')}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'geral' ? 'bg-[#14281D] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#14281D] hover:bg-gray-100'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>1. Dados Gerais & Categoria</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('conteudo')}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'conteudo' ? 'bg-[#14281D] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#14281D] hover:bg-gray-100'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>2. Editor Rico & Preparo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'seo' ? 'bg-[#14281D] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#14281D] hover:bg-gray-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>3. SEO Automático</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('relacionados')}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'relacionados' ? 'bg-[#14281D] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#14281D] hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>4. Produtos & Artigos</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* TAB 1: DADOS GERAIS */}
              {activeTab === 'geral' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Nome Popular *</label>
                      <input
                        type="text"
                        required
                        value={formData.popularName || ''}
                        onChange={(e) => setFormData({ ...formData, popularName: e.target.value })}
                        placeholder="Ex: Camomila Romana"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Nome Botânico (Científico)</label>
                      <input
                        type="text"
                        value={formData.botanicalName || ''}
                        onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                        placeholder="Ex: Matricaria recutita"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 italic focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Categoria CMS *</label>
                      <select
                        value={formData.category || 'Ervas'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 font-bold text-[#14281D] focus:outline-none cursor-pointer"
                      >
                        {allCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Elemento Alquímico</label>
                      <input
                        type="text"
                        value={formData.element || ''}
                        onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                        placeholder="Ex: Água / Fogo"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Fase Lunar</label>
                      <input
                        type="text"
                        value={formData.lunarPhase || ''}
                        onChange={(e) => setFormData({ ...formData, lunarPhase: e.target.value })}
                        placeholder="Ex: Lua Crescente / Cheia"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Chakra Correspondente</label>
                      <input
                        type="text"
                        value={formData.chakra || ''}
                        onChange={(e) => setFormData({ ...formData, chakra: e.target.value })}
                        placeholder="Ex: Cardíaco / Plexo Solar"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">URL da Imagem da Planta / Erva</label>
                      <input
                        type="text"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">Origem Histórica & Tradição</label>
                    <textarea
                      rows={2}
                      value={formData.historicalOrigin || ''}
                      onChange={(e) => setFormData({ ...formData, historicalOrigin: e.target.value })}
                      placeholder="Histórico ancestral, lendas e origem do cultivo..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Propriedades Medicinais (Separar por vírgula)</label>
                      <input
                        type="text"
                        value={medPropsInput}
                        onChange={(e) => setMedPropsInput(e.target.value)}
                        placeholder="Calmante, Digestivo, Ansiolítico"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#14281D] uppercase mb-1">Propriedades Espirituais (Separar por vírgula)</label>
                      <input
                        type="text"
                        value={spirPropsInput}
                        onChange={(e) => setSpirPropsInput(e.target.value)}
                        placeholder="Proteção, Amor-Próprio, Paz"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDITOR RICO & PREPARO */}
              {activeTab === 'conteudo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">Modo de Preparo Resumido / Posologia</label>
                    <input
                      type="text"
                      value={formData.preparationMethod || ''}
                      onChange={(e) => setFormData({ ...formData, preparationMethod: e.target.value })}
                      placeholder="Ex: Infusão de 8 a 10 min em 250ml de água / Banho do pescoço para baixo..."
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none font-bold text-[#14281D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">
                      Conteúdo Rico Completo (História, Rituais & Instruções Alquímicas)
                    </label>
                    <RichTextEditor
                      value={formData.richContent || ''}
                      onChange={(newHtml) => setFormData({ ...formData, richContent: newHtml })}
                      category={formData.category}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SEO AUTOMÁTICO */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#14281D]">Gerador de Meta-Tags & Indexação</h4>
                      <p className="text-[11px] text-[#718096]">
                        Crie metadados otimizados para mecanismos de busca (Google, Bing).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoGenerateSEO}
                      className="bg-[#14281D] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar SEO Automático</span>
                    </button>
                  </div>

                  {/* SERP Preview Card */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1 font-sans">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
                      Prévia do Resultado de Busca (Google)
                    </span>
                    <a href="#" className="text-blue-800 hover:underline font-serif text-base font-bold line-clamp-1 block">
                      {formData.seo?.metaTitle || 'Título da Página em Destaque no Google'}
                    </a>
                    <span className="text-emerald-700 text-[11px] font-mono block">
                      https://omiaa.com.br{formData.seo?.canonicalSlug || `/botanica/${(formData.popularName || 'item').toLowerCase().replace(/\s+/g, '-')}`}
                    </span>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {formData.seo?.metaDescription || 'Descrição resumida que aparecerá nos resultados de busca...'}
                    </p>
                  </div>

                  {/* SEO Score Evaluation */}
                  <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold font-mono text-xs ${
                        seoEvaluation.score >= 80 ? 'bg-emerald-100 text-emerald-900' :
                        seoEvaluation.score >= 50 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
                      }`}>
                        Pontuação SEO: {seoEvaluation.score}/100 ({seoEvaluation.level})
                      </span>
                    </div>
                    <ul className="text-[10px] text-[#718096] list-disc list-inside">
                      {seoEvaluation.feedback.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">Título SEO (Meta Title)</label>
                    <input
                      type="text"
                      value={formData.seo?.metaTitle || ''}
                      onChange={(e) => setFormData({ ...formData, seo: { ...(formData.seo || { keywords: [], metaDescription: '' }), metaTitle: e.target.value } })}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">Meta Descrição (Meta Description)</label>
                    <textarea
                      rows={2}
                      value={formData.seo?.metaDescription || ''}
                      onChange={(e) => setFormData({ ...formData, seo: { ...(formData.seo || { keywords: [], metaTitle: '' }), metaDescription: e.target.value } })}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14281D] uppercase mb-1">Palavras-chave SEO (Separar por vírgula)</label>
                    <input
                      type="text"
                      value={keywordsInput}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                      placeholder="Camomila, Ervas, Banhos, Fitoterapia"
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUTOS & ARTIGOS RELACIONADOS */}
              {activeTab === 'relacionados' && (
                <div className="space-y-5">
                  
                  {/* Related Products Selection */}
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#14281D] flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                      <span>Produtos Relacionados do Catálogo da Loja</span>
                    </h4>
                    <p className="text-[11px] text-[#718096]">
                      Selecione os produtos da Omiaá Alquimia Ancestral que serão recomendados na página desta erva/preparado.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-[#E2D9C8] rounded-2xl bg-[#FAF7F2]">
                      {products.map((prod) => {
                        const isSelected = (formData.relatedProductIds || []).includes(prod.id);
                        return (
                          <label
                            key={prod.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-[#E2D9C8] hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="text-xs truncate">{prod.name}</span>
                            </div>

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = formData.relatedProductIds || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, relatedProductIds: [...current, prod.id] });
                                } else {
                                  setFormData({ ...formData, relatedProductIds: current.filter((id) => id !== prod.id) });
                                }
                              }}
                              className="rounded text-[#14281D] focus:ring-0 cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Related Blog Posts Selection */}
                  <div className="space-y-2 pt-2 border-t border-[#E2D9C8]">
                    <h4 className="font-serif font-bold text-sm text-[#14281D] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>Artigos Relacionados do Diário Alquímico</span>
                    </h4>
                    <p className="text-[11px] text-[#718096]">
                      Vincule textos educativos e rituais do blog para leitura complementar do cliente.
                    </p>

                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-[#E2D9C8] rounded-2xl bg-[#FAF7F2]">
                      {blogPosts.map((post) => {
                        const isSelected = (formData.relatedArticleIds || []).includes(post.id);
                        return (
                          <label
                            key={post.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-white border-[#E2D9C8] hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0" />
                              <span className="text-xs truncate">{post.title}</span>
                            </div>

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = formData.relatedArticleIds || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, relatedArticleIds: [...current, post.id] });
                                } else {
                                  setFormData({ ...formData, relatedArticleIds: current.filter((id) => id !== post.id) });
                                }
                              }}
                              className="rounded text-[#14281D] focus:ring-0 cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Bottom Actions Bar */}
              <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2D9C8] rounded-xl font-bold uppercase text-[10px]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md"
                >
                  Salvar Registro no CMS
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
