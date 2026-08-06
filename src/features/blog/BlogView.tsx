import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../../types';
import { fetchBlogPosts } from '../../services/supabaseService';
import { useShop } from '../../context/ShopContext';
import { SEOHead } from '../../components/seo/SEOHead';
import { Breadcrumb } from '../../components/navigation/Breadcrumb';

export const BlogView: React.FC = () => {
  const { setViewMode } = useShop();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchBlogPosts().then((data) => {
      if (isMounted) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-serif text-[#14281D]">
        <p className="animate-pulse text-lg">Carregando Diário Alquímico do Supabase...</p>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 font-sans">
        <SEOHead
          title={`${selectedPost.title} - Diário de Alquimia`}
          description={selectedPost.excerpt}
          keywords={selectedPost.tags || ['Alquimia', 'Botânica', 'Ritual']}
          canonicalUrl={`/blog/${selectedPost.slug}`}
          ogImage={selectedPost.coverImage}
          ogType="article"
          article={selectedPost}
          breadcrumbItems={[
            { name: 'Início', item: '/' },
            { name: 'Blog', item: '/blog' },
            { name: selectedPost.title, item: `/blog/${selectedPost.slug}` }
          ]}
        />

        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
          <Breadcrumb
            items={[
              { label: 'Blog', onClick: () => setSelectedPost(null) },
              { label: selectedPost.title, active: true }
            ]}
          />

          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>Voltar para os Artigos</span>
          </button>
        </div>

        <div className="space-y-4 bg-white p-8 rounded-3xl border border-[#E2D9C8] shadow-xs">
          <div className="flex items-center gap-3 text-xs text-[#8C7A5B] font-bold uppercase tracking-wider">
            <span>{selectedPost.category}</span>
            <span>•</span>
            <span>{selectedPost.readTime} de leitura</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#14281D]">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[#718096] pb-4 border-b border-[#E2D9C8]">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#C5A059]" /> {selectedPost.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> {selectedPost.publishedAt}</span>
          </div>

          <img
            src={selectedPost.coverImage}
            alt={selectedPost.title}
            className="w-full h-80 object-cover rounded-2xl border border-[#E2D9C8]"
            loading="lazy"
            decoding="async"
          />

          <div className="prose max-w-none text-sm text-[#2D3748] leading-relaxed pt-4 whitespace-pre-line">
            {selectedPost.content}
          </div>

          <div className="pt-6 border-t border-[#E2D9C8] flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-[#C5A059]" />
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="bg-[#FAF7F2] text-[#14281D] px-3 py-1 rounded-full text-[10px] font-bold border border-[#E2D9C8]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <SEOHead
        title="Diário de Alquimia Botânica - Saberes Ancestrais"
        description="Artigos, rituais e estudos de fitoterapia clássica, maceração lunar e cosmetologia ancestral."
        canonicalUrl="/blog"
        breadcrumbItems={[
          { name: 'Início', item: '/' },
          { name: 'Blog', item: '/blog' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2D9C8] pb-4 gap-4">
        <Breadcrumb items={[{ label: 'Blog', active: true }]} />

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#C5A059]" />
          <h1 className="font-serif text-2xl font-bold text-[#14281D]">
            Diário de Alquimia Botânica
          </h1>
        </div>
      </div>

      <p className="text-xs text-[#718096] max-w-2xl">
        Artigos e rituais conectados diretamente ao banco de dados Supabase (`blog_posts`), registrando saberes ancestrais e fitoterapia clássica.
      </p>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs hover:border-[#C5A059] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#14281D] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[10px] text-[#8C7A5B]">
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.publishedAt}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#14281D] group-hover:text-[#C5A059] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-[#718096] line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 text-xs font-bold text-[#C5A059] group-hover:underline">
              Ler artigo completo →
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
