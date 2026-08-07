import React, { useState } from 'react';
import { BookOpen, Droplet, FlaskConical, FileText, Plus, Edit2, Sparkles } from 'lucide-react';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';
import { AdminBlogERP } from './AdminBlogERP';
import { AdminBotanicalERP } from './AdminBotanicalERP';
import { AdminFragrancesERP } from './AdminFragrancesERP';
import { useShop } from '../../context/ShopContext';

interface AdminContentERPProps {
  initialTab?: 'blog' | 'botanical' | 'fragrances' | 'pages';
}

export const AdminContentERP: React.FC<AdminContentERPProps> = ({ initialTab = 'blog' }) => {
  const [activeTab, setActiveTab] = useState<'blog' | 'botanical' | 'fragrances' | 'pages'>(initialTab);
  const { showToast } = useShop();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Conteúdo" subItemLabel="Gestão Editorial & Páginas" />

      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2D9C8] pb-2">
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'blog'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span>Blog Alquímico</span>
        </button>

        <button
          onClick={() => setActiveTab('botanical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'botanical'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Droplet className="w-4 h-4 text-[#C5A059]" />
          <span>Guia das Ervas</span>
        </button>

        <button
          onClick={() => setActiveTab('fragrances')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'fragrances'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-[#C5A059]" />
          <span>Fragrâncias Personalizadas</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C5A059]" />
          <span>Páginas Institucionais</span>
        </button>
      </div>

      {activeTab === 'blog' && <AdminBlogERP />}
      {activeTab === 'botanical' && <AdminBotanicalERP />}
      {activeTab === 'fragrances' && <AdminFragrancesERP />}
      {activeTab === 'pages' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Páginas Institucionais da Loja</h3>
              <p className="text-xs text-[#8C7A5B]">Sobre Nós, Nossa História, Alquimia Ancestral e Sustentabilidade.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Sobre a Omiaá Alquimia', slug: '/sobre', status: 'Publicada' },
              { title: 'Nossa Filosofia Ancestral', slug: '/filosofia', status: 'Publicada' },
              { title: 'Guia de Ritual de Uso', slug: '/rituais', status: 'Publicada' },
              { title: 'Compromisso de Sustentabilidade', slug: '/sustentabilidade', status: 'Publicada' }
            ].map((page, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#14281D] text-xs">{page.title}</p>
                  <p className="text-[10px] text-[#8C7A5B] font-mono">{page.slug}</p>
                </div>
                <button
                  onClick={() => showToast(`Editando conteúdo de ${page.title}`, 'info')}
                  className="px-3 py-1 bg-white border border-[#E2D9C8] rounded-xl text-xs font-bold text-[#14281D] hover:border-[#C5A059]"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
