import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Search,
  Trash2,
  Reply,
  CheckCircle2,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  Send,
  X,
  Award
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const AdminReviewsERP: React.FC = () => {
  const { reviews, products, deleteReview, replyToReview, showToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');

  // Reply modal state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Stats
  const totalReviews = reviews.length;
  const avgStoreRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';
  const reviewsWithPhotos = reviews.filter((r) => r.images && r.images.length > 0).length;
  const repliedReviewsCount = reviews.filter((r) => r.replyFromBrand).length;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (selectedProductId !== 'all' && r.productId !== selectedProductId) return false;
    if (selectedRating !== 'all' && Math.round(r.rating) !== Number(selectedRating)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAuthor = r.author.toLowerCase().includes(q);
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      if (!matchAuthor && !matchComment && !matchTitle) return false;
    }
    return true;
  });

  const handleOpenReply = (reviewId: string, existingText?: string) => {
    setReplyingReviewId(reviewId);
    setReplyText(existingText || '');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReviewId) return;
    if (!replyText.trim()) {
      showToast('Resposta Vazia', 'Digite o texto da resposta oficial.', 'alert');
      return;
    }

    replyToReview(replyingReviewId, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
  };

  const handleDelete = (reviewId: string) => {
    if (window.confirm('Tem certeza de que deseja remover esta avaliação permanentemente?')) {
      deleteReview(reviewId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2D9C8]">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] mb-1">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7A5B]">
              Gestão de Depoimentos
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D]">
            Avaliações e Comentários dos Clientes
          </h2>
          <p className="text-xs text-[#718096]">
            Monitore, responda e modere os depoimentos deixados na loja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#FAF7F2] px-4 py-2 rounded-2xl border border-[#E2D9C8] text-xs font-bold text-[#14281D] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
            Média Geral: {avgStoreRating} / 5.0
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1">
          <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
            Total de Avaliações
          </span>
          <span className="font-serif text-3xl font-bold text-[#14281D] block">
            {totalReviews}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">100% visíveis no site</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1">
          <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
            Média de Satisfação
          </span>
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-bold text-[#14281D]">
              {avgStoreRating}
            </span>
            <div className="flex text-[#C5A059]">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
          <span className="text-[10px] text-[#8C7A5B] font-medium">Excelente reputação</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1">
          <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
            Com Fotos Anexadas
          </span>
          <span className="font-serif text-3xl font-bold text-[#14281D] block">
            {reviewsWithPhotos}
          </span>
          <span className="text-[10px] text-[#8C7A5B] font-medium">Provas visuais de uso</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] space-y-1">
          <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
            Respondidas pela Marca
          </span>
          <span className="font-serif text-3xl font-bold text-[#14281D] block">
            {repliedReviewsCount}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Atendimento humanizado</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2D9C8] flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, título ou comentário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Select Product */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs">
            <span className="text-[#8C7A5B] font-bold">Produto:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="bg-transparent font-bold text-[#14281D] focus:outline-none cursor-pointer"
            >
              <option value="all">Todos os Produtos</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Rating */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs">
            <span className="text-[#8C7A5B] font-bold">Nota:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-transparent font-bold text-[#14281D] focus:outline-none cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="5">5 Estrelas</option>
              <option value="4">4 Estrelas</option>
              <option value="3">3 Estrelas</option>
              <option value="2">2 Estrelas</option>
              <option value="1">1 Estrela</option>
            </select>
          </div>
        </div>

      </div>

      {/* Reviews Table / Card List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E2D9C8] text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-[#C5A059] mx-auto opacity-60" />
            <h3 className="font-serif font-bold text-lg text-[#14281D]">
              Nenhuma avaliação encontrada
            </h3>
            <p className="text-xs text-[#718096]">
              Ajuste os filtros de busca para visualizar outros registros.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const product = products.find((p) => p.id === rev.productId);

            return (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-2xs hover:border-[#C5A059] transition-colors"
              >
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D9C8]/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#14281D] text-[#FAF7F2] font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-[#C5A059]">
                      {rev.author.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#14281D] text-sm">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Compra Verificada</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#718096] block">
                        {rev.location ? `${rev.location} • ` : ''}
                        Data: {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Target Product Badge */}
                    <span className="text-xs font-bold text-[#8C7A5B] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E2D9C8]">
                      {product ? product.name : 'Produto Desconhecido'}
                    </span>

                    {/* Star Badge */}
                    <div className="flex items-center gap-1 text-[#C5A059] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#E2D9C8]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-[#14281D]">{rev.rating}.0</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-2">
                  {rev.title && (
                    <h4 className="font-serif font-bold text-[#14281D] text-base">
                      "{rev.title}"
                    </h4>
                  )}
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                {/* Images if attached */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Anexo"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E2D9C8]"
                      />
                    ))}
                  </div>
                )}

                {/* Existing Reply if any */}
                {rev.replyFromBrand && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border-l-4 border-[#C5A059] text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#14281D]">
                      <span className="flex items-center gap-1.5 font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        Resposta Oficial da Marca ({rev.replyFromBrand.date})
                      </span>
                    </div>
                    <p className="text-[#4A5568] italic">
                      "{rev.replyFromBrand.text}"
                    </p>
                  </div>
                )}

                {/* Inline Reply Form if opening */}
                {replyingReviewId === rev.id && (
                  <form onSubmit={handleSendReply} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C5A059] space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#14281D] flex items-center gap-1.5">
                        <Reply className="w-4 h-4 text-[#C5A059]" />
                        Responder ao cliente como Omiaá Alquimia Ancestral:
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingReviewId(null)}
                        className="p-1 text-[#718096] hover:text-[#14281D]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escreva uma mensagem calorosa e profissional agradecendo o feedback..."
                      className="w-full bg-white border border-[#E2D9C8] rounded-xl p-3 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingReviewId(null)}
                        className="px-3 py-1.5 rounded-xl border border-[#E2D9C8] text-xs font-bold text-[#718096]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publicar Resposta</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2D9C8]/40 text-xs">
                  <span className="text-[#718096] text-[11px]">
                    Marcado como útil por {rev.helpfulLikes || 0} pessoa(s)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReply(rev.id, rev.replyFromBrand?.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] font-bold hover:border-[#C5A059] transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{rev.replyFromBrand ? 'Editar Resposta' : 'Responder'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
