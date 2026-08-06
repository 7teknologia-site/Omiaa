import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Eye, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Category, CategoryId } from '../../types';
import { useShop } from '../../context/ShopContext';

interface AdminCategoriesERPProps {
  categories: Category[];
}

export const AdminCategoriesERP: React.FC<AdminCategoriesERPProps> = ({ categories: initialCategories }) => {
  const { showToast } = useShop();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    id: 'elixires',
    name: '',
    description: '',
    iconName: 'Droplet',
    bannerImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop'
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      id: `cat-${Date.now()}` as CategoryId,
      name: '',
      description: '',
      iconName: 'Sparkles',
      bannerImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...formData } as Category) : c))
      );
      showToast('Categoria Atualizada', `Categoria ${formData.name} salva com sucesso.`, 'success');
    } else {
      const newCat: Category = {
        id: (formData.name.toLowerCase().replace(/\s+/g, '-') as CategoryId) || 'elixires',
        name: formData.name,
        description: formData.description || '',
        iconName: formData.iconName || 'Sparkles',
        bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop'
      };
      setCategories((prev) => [...prev, newCat]);
      showToast('Categoria Criada', `A categoria ${newCat.name} foi adicionada.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta categoria do catálogo?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Categoria Excluída', 'Registro removido.', 'info');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#C5A059]" />
            <span>Gestão de Categorias ({categories.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Organize os rituais, elixires e coleções da sua loja alquímica.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs space-y-3 relative group hover:border-[#C5A059] transition-all"
          >
            {/* Banner preview */}
            <div className="h-32 w-full overflow-hidden relative">
              <img
                src={cat.bannerImage}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="font-serif font-bold text-white text-lg">{cat.name}</span>
              </div>
            </div>

            {/* Description & Controls */}
            <div className="p-4 space-y-3 text-xs">
              <p className="text-[#718096] line-clamp-2 min-h-[32px]">
                {cat.description || 'Sem descrição informada.'}
              </p>

              <div className="pt-2 border-t border-[#E2D9C8]/60 flex items-center justify-between text-[11px]">
                <span className="font-mono text-[#8C7A5B] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2D9C8]">
                  ID: {cat.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#14281D]"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4 text-[#C5A059]" />
                  </button>
                  {cat.id !== 'todos' && (
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#14281D]">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Óleos Anscestrais"
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a intenção e benefícios dos produtos desta categoria..."
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">URL da Imagem do Banner</label>
                <input
                  type="text"
                  value={formData.bannerImage || ''}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs text-[#14281D] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E2D9C8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2D9C8] text-[#14281D] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
