import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Category, CategoryId } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from './utils/csvExporter';
import { ErpPagination } from './components/ErpPagination';
import { useShop } from '../../context/ShopContext';

interface AdminProductsERPProps {
  products: Product[];
  categories: Category[];
  isOpenCreateModalFromDash?: boolean;
  onCloseCreateModalFromDash?: () => void;
}

export const AdminProductsERP: React.FC<AdminProductsERPProps> = ({
  products: initialProducts,
  categories,
  isOpenCreateModalFromDash,
  onCloseCreateModalFromDash
}) => {
  const { addNewProduct, updateExistingProduct, deleteExistingProduct, products: shopProducts, showToast } = useShop();

  const [productsList, setProductsList] = useState<Product[]>(shopProducts.length ? shopProducts : initialProducts);

  useEffect(() => {
    if (shopProducts && shopProducts.length > 0) {
      setProductsList(shopProducts);
    }
  }, [shopProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [stockFilter, setStockFilter] = useState<'todos' | 'em_estoque' | 'baixo' | 'sem_estoque'>('todos');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(Boolean(isOpenCreateModalFromDash));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'elixires',
    price: 150,
    originalPrice: 180,
    stock: 20,
    volumeOrWeight: '50ml',
    shortDescription: '',
    fullDescription: '',
    ingredients: ['Camomila', 'Lavanda'],
    ancestralOrigin: 'Saber Tradicional Botânico',
    usageInstructions: 'Aplicar diariamente.',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'],
    sku: `OMIA-${Math.floor(1000 + Math.random() * 9000)}`,
    featured: false,
    badges: ['Artesanal']
  });

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'em_estoque') matchesStock = p.stock > 5;
      if (stockFilter === 'baixo') matchesStock = p.stock > 0 && p.stock <= 5;
      if (stockFilter === 'sem_estoque') matchesStock = p.stock === 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [productsList, searchQuery, selectedCategory, stockFilter]);

  // Pagination Slicing
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      category: 'elixires',
      price: 150,
      originalPrice: 180,
      stock: 20,
      volumeOrWeight: '50ml',
      shortDescription: '',
      fullDescription: '',
      ingredients: ['Camomila', 'Lavanda'],
      ancestralOrigin: 'Saber Tradicional Botânico',
      usageInstructions: 'Aplicar diariamente.',
      images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'],
      sku: `OMIA-${Math.floor(1000 + Math.random() * 9000)}`,
      featured: false,
      badges: ['Artesanal']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const parsePriceInput = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined || formData.price === null || String(formData.price).trim() === '') {
      alert('Preencha o nome e o preço do produto.');
      return;
    }

    const priceVal = parsePriceInput(formData.price);
    const origPriceVal = formData.originalPrice ? parsePriceInput(formData.originalPrice) : priceVal;

    if (editingProduct) {
      // Update existing product in Supabase and ShopContext
      const updated = await updateExistingProduct(editingProduct.id, {
        ...formData,
        price: priceVal,
        originalPrice: origPriceVal,
        stock: Number(formData.stock || 0)
      });
      if (updated) {
        setIsModalOpen(false);
        if (onCloseCreateModalFromDash) onCloseCreateModalFromDash();
      }
    } else {
      // Create new product in Supabase and ShopContext
      const newProdData: Omit<Product, 'id' | 'createdAt'> = {
        slug: (formData.name || 'produto').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        name: formData.name || 'Novo Produto',
        subtitle: formData.subtitle || '',
        category: (formData.category as CategoryId) || 'elixires',
        price: priceVal,
        originalPrice: origPriceVal,
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(formData.stock || 10),
        featured: Boolean(formData.featured),
        badges: formData.badges && formData.badges.length ? formData.badges : ['Novo'],
        volumeOrWeight: formData.volumeOrWeight || '50ml',
        shortDescription: formData.shortDescription || '',
        fullDescription: formData.fullDescription || '',
        ingredients: Array.isArray(formData.ingredients) ? formData.ingredients : ['Ervas'],
        ancestralOrigin: formData.ancestralOrigin || 'Tradição Alquímica',
        usageInstructions: formData.usageInstructions || 'Uso diário',
        images: formData.images && formData.images.length ? formData.images : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'],
        sku: formData.sku || `OMIA-${Math.floor(1000 + Math.random() * 9000)}`
      };

      const created = await addNewProduct(newProdData);
      if (created) {
        setIsModalOpen(false);
        if (onCloseCreateModalFromDash) onCloseCreateModalFromDash();
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto da loja?')) {
      await deleteExistingProduct(id);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredProducts,
      [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Nome do Produto' },
        { key: 'category', label: 'Categoria' },
        { key: 'price', label: 'Preço (R$)' },
        { key: 'stock', label: 'Estoque Atual' },
        { key: 'volumeOrWeight', label: 'Volume' },
        { key: 'ancestralOrigin', label: 'Origem Ancestral' }
      ],
      'Produtos_OMIAA_Alquimia_Ancestral'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C5A059]" />
            <span>Gestão de Produtos ({filteredProducts.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Cadastre, edite e gerencie o catálogo de elixires, óleos e preparados artesanais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por nome, SKU ou ingrediente..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <Filter className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter Select */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <Package className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Níveis de Estoque</option>
            <option value="em_estoque">Em Estoque (&gt; 5 un)</option>
            <option value="baixo">Estoque Baixo (&le; 5 un)</option>
            <option value="sem_estoque">Esgotado (0 un)</option>
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[#8C7A5B] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Produto / SKU</th>
                <th className="py-3.5 px-3">Categoria</th>
                <th className="py-3.5 px-3">Preço</th>
                <th className="py-3.5 px-3">Estoque</th>
                <th className="py-3.5 px-3">Volume</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9C8]/60">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#718096]">
                    Nenhum produto localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2D9C8] bg-gray-50 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <span className="font-bold text-[#14281D] block truncate">{p.name}</span>
                          <span className="text-[10px] text-[#8C7A5B] font-mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-[#14281D]">
                      <span className="bg-[#FAF7F2] border border-[#E2D9C8] px-2.5 py-1 rounded-lg text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold font-mono text-[#14281D]">
                      {formatCurrency(p.price)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        p.stock === 0 ? 'bg-red-100 text-red-900' :
                        p.stock <= 5 ? 'bg-amber-100 text-amber-900' :
                        'bg-emerald-100 text-emerald-900'
                      }`}>
                        {p.stock} un.
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[#718096]">
                      {p.volumeOrWeight}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#14281D] transition-colors"
                          title="Editar Produto"
                        >
                          <Edit2 className="w-4 h-4 text-[#C5A059]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-2">
          <ErpPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 font-sans">
            
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#14281D]">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto na Alquimia Ancestral'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Elixir Lunar de Serenidade"
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Subtítulo / Descrição Curta
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Macerado Noturno com Camomila & Ametista"
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category || 'elixires'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] font-bold focus:outline-none"
                  >
                    {categories.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    SKU (Código)
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="OMIA-ELI-001"
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono text-[#14281D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono text-[#14281D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Estoque Inicial (Unidades) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs font-mono text-[#14281D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Volume / Peso
                  </label>
                  <input
                    type="text"
                    value={formData.volumeOrWeight || '50ml'}
                    onChange={(e) => setFormData({ ...formData, volumeOrWeight: e.target.value })}
                    placeholder="Ex: 50ml, 100g, 200g"
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Origem Ancestral
                  </label>
                  <input
                    type="text"
                    value={formData.ancestralOrigin || ''}
                    onChange={(e) => setFormData({ ...formData, ancestralOrigin: e.target.value })}
                    placeholder="Ex: Saber Tradicional Kalunga"
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    URL da Imagem Principal
                  </label>
                  <input
                    type="text"
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
                    Descrição Detalhada do Ritual
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription || ''}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Descreva as propriedades medicinais e energéticas..."
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D] focus:outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-[#E2D9C8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2D9C8] text-[#14281D] hover:bg-gray-50 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Salvar Produto
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
