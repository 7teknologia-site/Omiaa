import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, Calendar, User, Eye, X } from 'lucide-react';
import { BlogPost } from '../../types';
import { fetchBlogPosts } from '../../services/supabaseService';
import { useShop } from '../../context/ShopContext';
import { ErpPagination } from './components/ErpPagination';

export const AdminBlogERP: React.FC = () => {
  const { showToast } = useShop();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Filosofia Alquímica',
    readTime: '5 min',
    author: 'Mestre Alquimista OMIAA',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    tags: ['Fitoterapia', 'Alquimia']
  });

  useEffect(() => {
    fetchBlogPosts().then((data) => {
      setPosts(data || []);
    });
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: 'Filosofia Alquímica',
      readTime: '5 min',
      author: 'Atelier OMIAA',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      tags: ['Sabedoria', 'Botânica']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: BlogPost) => {
    setEditingPost(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? ({ ...p, ...formData } as BlogPost) : p))
      );
      showToast('Artigo Atualizado', `Artigo "${formData.title}" salvo com sucesso.`, 'success');
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: (formData.title || 'artigo').toLowerCase().replace(/\s+/g, '-'),
        title: formData.title,
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        author: formData.author || 'Atelier OMIAA',
        category: formData.category || 'Filosofia Alquímica',
        readTime: formData.readTime || '5 min',
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
        tags: formData.tags || ['Alquimia'],
        publishedAt: new Date().toISOString().slice(0, 10)
      };

      setPosts((prev) => [newPost, ...prev]);
      showToast('Artigo Publicado', `O artigo "${newPost.title}" foi postado.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este artigo do Diário Alquímico?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Artigo Excluído', 'Post removido do blog.', 'info');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#C5A059]" />
            <span>Diário Alquímico & Blog ({filteredPosts.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Publique artigos, rituais sazonais e conteúdos educativos sobre botânica ancestral.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Novo Artigo</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs relative">
        <Search className="w-4 h-4 text-[#8C7A5B] absolute left-7 top-7" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Pesquisar por título, categoria ou resumo..."
          className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-5 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                  {post.category} • {post.readTime}
                </span>
                <h3 className="font-serif font-bold text-base text-[#14281D] line-clamp-2">{post.title}</h3>
                <p className="text-[#718096] line-clamp-3">{post.excerpt}</p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#E2D9C8] flex items-center justify-between text-[11px] text-[#718096]">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#C5A059]" /> {post.author}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEditModal(post)} className="p-1 hover:text-[#14281D]">
                  <Edit2 className="w-4 h-4 text-[#C5A059]" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-1 hover:text-red-600">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ErpPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPosts.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-xl w-full p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <h3 className="font-serif font-bold text-base text-[#14281D]">
                {editingPost ? 'Editar Artigo' : 'Criar Artigo no Blog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold text-[#14281D] uppercase mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#14281D] uppercase mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#14281D] uppercase mb-1">Autor</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#14281D] uppercase mb-1">Resumo (Excerpt)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14281D] uppercase mb-1">Conteúdo Completo</label>
                <textarea
                  rows={5}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2D9C8] rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] rounded-xl font-bold uppercase"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
