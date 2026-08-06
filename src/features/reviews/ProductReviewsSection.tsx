import React, { useState, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Filter,
  Plus,
  X,
  Upload,
  Sparkles,
  HeartHandshake,
  Image as ImageIcon,
  ChevronDown,
  Award,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Review, Product } from '../../types';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { getProductReviews, addReview, voteReviewHelpful, user, showToast } = useShop();

  const productReviews = getProductReviews(product.id);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState(user.name || '');
  const [location, setLocation] = useState('São Paulo, SP');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Sort state
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithImages, setOnlyWithImages] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Modal Image Preview
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  // Ratings calculation
  const totalReviews = productReviews.length;
  
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rounded as keyof typeof counts] = (counts[rounded as keyof typeof counts] || 0) + 1;
    });
    return counts;
  }, [productReviews]);

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return product.rating || 5.0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / totalReviews).toFixed(1));
  }, [productReviews, totalReviews, product.rating]);

  const recommendPercent = useMemo(() => {
    if (totalReviews === 0) return 100;
    const count = productReviews.filter((r) => r.recommends !== false).length;
    return Math.round((count / totalReviews) * 100);
  }, [productReviews, totalReviews]);

  // Filtered and Sorted Reviews list
  const filteredReviews = useMemo(() => {
    return productReviews
      .filter((r) => {
        if (starFilter !== 'all' && Math.round(r.rating) !== starFilter) return false;
        if (onlyVerified && !r.verifiedPurchase) return false;
        if (onlyWithImages && (!r.images || r.images.length === 0)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        if (sortBy === 'helpful') return (b.helpfulLikes || 0) - (a.helpfulLikes || 0);
        return 0;
      });
  }, [productReviews, starFilter, onlyVerified, onlyWithImages, sortBy]);

  // Handle image attachment from local file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Arquivo muito grande', 'Selecione uma imagem de até 5MB.', 'alert');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImages((prev) => [...prev, result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (!imageUrlInput.startsWith('http')) {
      showToast('URL Inválida', 'Insira uma URL de imagem válida (http/https).', 'alert');
      return;
    }
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      showToast('Campo Obrigatório', 'Informe o seu nome.', 'alert');
      return;
    }
    if (!comment.trim() || comment.length < 10) {
      showToast('Comentário muito curto', 'Escreva pelo menos 10 caracteres sobre sua experiência.', 'alert');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addReview({
        productId: product.id,
        author: authorName,
        title: title.trim() || 'Experiência Marcante',
        rating,
        comment,
        verifiedPurchase: true,
        location: location.trim() || 'São Paulo, SP',
        recommends,
        images: images.length > 0 ? images : undefined
      });

      // Reset form
      setTitle('');
      setComment('');
      setImages([]);
      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 600);
  };

  const starLabels: Record<number, string> = {
    1: 'Insatisfeito - Precisa melhorar',
    2: 'Regular - Dentro do esperado',
    3: 'Bom - Gostei da alquimia',
    4: 'Muito Bom - Excelente qualidade',
    5: 'Excepcional! - Experiência Inesquecível'
  };

  return (
    <section id="avaliacoes-secao" className="bg-[#FDFBF7] rounded-3xl border border-[#E2D9C8] p-6 sm:p-10 space-y-8 shadow-xs">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] mb-1">
            <Sparkles className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7A5B]">Alquimia Experiences</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14281D]">
            Avaliações e Comentários de Clientes
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Relatos autênticos de quem vivencia os rituais botânicos da Omiaá.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center justify-center gap-2 bg-[#14281D] hover:bg-[#C5A059] text-[#FAF7F2] hover:text-[#14281D] px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm shrink-0 cursor-pointer"
        >
          {isFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Fechar Formulário</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Escrever Avaliação</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Score & Distribution Bar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D9C8]">
        
        {/* Left: Overall Rating Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-4 bg-[#FDFBF7] rounded-2xl border border-[#E2D9C8]/80 shadow-2xs">
          <span className="font-serif text-5xl font-extrabold text-[#14281D]">
            {averageRating}
          </span>

          <div className="flex items-center gap-1 text-[#C5A059] my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-bold text-[#14281D]">
            Baseado em {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
          </span>

          <div className="mt-4 pt-4 border-t border-[#E2D9C8] w-full flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 py-2 rounded-xl">
            <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{recommendPercent}% recomendam este produto</span>
          </div>
        </div>

        {/* Right: Star Distribution Bars (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#14281D] mb-1 block">
            Distribuição por Nota:
          </span>

          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = ratingDistribution[starNum as keyof typeof ratingDistribution] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = starFilter === starNum;

            return (
              <button
                key={starNum}
                onClick={() => setStarFilter(starFilter === starNum ? 'all' : starNum)}
                className={`w-full flex items-center gap-3 text-xs text-left p-1.5 rounded-xl transition-all cursor-pointer ${
                  isSelected ? 'bg-[#14281D]/5 font-bold ring-1 ring-[#14281D]' : 'hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-1 w-16 text-[#14281D] font-bold shrink-0">
                  <span>{starNum}</span>
                  <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                </div>

                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A059] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right font-mono text-[11px] text-[#718096] shrink-0">
                  {count} ({percentage}%)
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Expandable Submission Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmitReview} className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-lg font-bold text-[#14281D]">
                Deixe seu Relato de Alquimia
              </h3>
            </div>
            <span className="text-xs font-bold text-[#8C7A5B] bg-white px-3 py-1 rounded-full border border-[#E2D9C8]">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interactive Rating Selection */}
            <div className="space-y-2 md:col-span-2 bg-white p-4 rounded-2xl border border-[#E2D9C8]">
              <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
                Sua Classificação Geral *
              </label>
              
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#C5A059] hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <span className="text-xs font-bold text-[#C5A059] ml-3 bg-[#FAF7F2] px-3 py-1 rounded-lg border border-[#E2D9C8]">
                  {starLabels[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="w-full bg-white border border-[#E2D9C8] rounded-xl px-4 py-2.5 text-xs text-[#14281D] font-medium focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                Cidade / Estado *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className="w-full bg-white border border-[#E2D9C8] rounded-xl px-4 py-2.5 text-xs text-[#14281D] font-medium focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Review Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                Título da Avaliação
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Sensação única e aroma relaxante no ritual noturno"
                className="w-full bg-white border border-[#E2D9C8] rounded-xl px-4 py-2.5 text-xs text-[#14281D] font-medium focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Review Comment Text */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-1">
                Seu Depoimento Detalhado *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sobre a textura, o aroma, os efeitos percebidos na pele e como este produto se integrou ao seu momento de cuidado..."
                className="w-full bg-white border border-[#E2D9C8] rounded-xl p-4 text-xs text-[#14281D] font-medium focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Product Recommendation Toggle */}
            <div className="md:col-span-2 flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E2D9C8]">
              <div>
                <span className="block text-xs font-bold text-[#14281D]">
                  Você recomenda esta criação Omiaá?
                </span>
                <span className="text-[11px] text-[#718096]">
                  Sua recomendação ajuda outros clientes na busca por autocuidado.
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecommends(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    recommends
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✓ Sim, recomendo
                </button>
                <button
                  type="button"
                  onClick={() => setRecommends(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    !recommends
                      ? 'bg-rose-800 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✕ Não recomendo
                </button>
              </div>
            </div>

            {/* Photo Attachment Section */}
            <div className="md:col-span-2 space-y-3 bg-white p-4 rounded-2xl border border-[#E2D9C8]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14281D] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                  <span>Anexar Fotos (Opcional)</span>
                </label>
                <span className="text-[10px] text-[#718096]">
                  {images.length}/3 fotos anexadas
                </span>
              </div>

              {/* Upload Dropzone + URL Option */}
              {images.length < 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <label className="border-2 border-dashed border-[#C5A059]/50 hover:border-[#C5A059] rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-[#14281D] bg-[#FAF7F2] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#C5A059]" />
                    <span>Carregar Arquivo de Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Ou cole URL da foto..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-[#14281D] text-[#FAF7F2] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#C5A059] transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {/* Attached Images Thumbnails */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E2D9C8] group">
                      <img src={img} alt={`Anexo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E2D9C8] pt-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-[#E2D9C8] text-xs font-bold text-[#8C7A5B] hover:text-[#14281D] hover:bg-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#14281D] hover:bg-[#C5A059] text-[#FAF7F2] hover:text-[#14281D] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Avaliação'}</span>
            </button>
          </div>

        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
        
        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[#14281D] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#C5A059]" /> Filtrar:
          </span>

          {/* Star Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2D9C8]">
            <button
              onClick={() => setStarFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                starFilter === 'all' ? 'bg-[#14281D] text-[#FAF7F2]' : 'text-[#718096] hover:text-[#14281D]'
              }`}
            >
              Todas ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(s)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-0.5 transition-colors ${
                  starFilter === s ? 'bg-[#14281D] text-[#FAF7F2]' : 'text-[#718096] hover:text-[#14281D]'
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>

          {/* Toggles */}
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              onlyVerified
                ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                : 'bg-white text-[#718096] border-[#E2D9C8] hover:text-[#14281D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Compra Verificada</span>
          </button>

          <button
            onClick={() => setOnlyWithImages(!onlyWithImages)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              onlyWithImages
                ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                : 'bg-white text-[#718096] border-[#E2D9C8] hover:text-[#14281D]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Com Fotos</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#14281D] whitespace-nowrap">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#E2D9C8] rounded-xl px-3 py-1.5 text-xs font-bold text-[#14281D] focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="newest">Mais Recentes</option>
            <option value="highest">Maior Avaliação</option>
            <option value="lowest">Menor Avaliação</option>
            <option value="helpful">Mais Úteis</option>
          </select>
        </div>

      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-3xl border border-[#E2D9C8] space-y-3">
            <MessageSquare className="w-10 h-10 text-[#C5A059] mx-auto opacity-70" />
            <h3 className="font-serif text-lg font-bold text-[#14281D]">
              Nenhuma avaliação encontrada para os filtros selecionados.
            </h3>
            <p className="text-xs text-[#718096] max-w-md mx-auto">
              Seja o primeiro a compartilhar sua vivência alquímica com esta criação da Omiaá.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-[#14281D] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Escrever Primeira Avaliação</span>
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FDFBF7] p-6 rounded-3xl border border-[#E2D9C8] space-y-4 hover:border-[#C5A059]/60 transition-all shadow-2xs"
            >
              
              {/* Review Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E2D9C8]/60 pb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Initials */}
                  <div className="w-10 h-10 rounded-full bg-[#14281D] text-[#FAF7F2] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs border border-[#C5A059]">
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
                    
                    <span className="text-[11px] text-[#718096] font-medium block">
                      {rev.location ? `${rev.location} • ` : ''}
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center gap-1 text-[#C5A059]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(rev.rating) ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#14281D] ml-1">{rev.rating}.0</span>
                </div>
              </div>

              {/* Review Title & Content */}
              <div className="space-y-2">
                {rev.title && (
                  <h4 className="font-serif font-bold text-[#14281D] text-base leading-snug">
                    "{rev.title}"
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Recommends Badge */}
              {rev.recommends !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold pt-1">
                  <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Recomenda este produto</span>
                </div>
              )}

              {/* Photos Gallery attached to Review */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {rev.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageModal(img)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#E2D9C8] hover:scale-105 transition-transform cursor-pointer relative group"
                    >
                      <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Official Brand Reply (Resposta da Marca) */}
              {rev.replyFromBrand && (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border-l-4 border-[#C5A059] text-xs space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-[#8C7A5B] font-bold">
                    <span className="flex items-center gap-1.5 text-[#14281D] font-serif">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      Resposta da Omiaá Alquimia Ancestral
                    </span>
                    <span className="text-[10px]">{rev.replyFromBrand.date}</span>
                  </div>
                  <p className="text-[#4A5568] leading-relaxed italic">
                    "{rev.replyFromBrand.text}"
                  </p>
                </div>
              )}

              {/* Helpful Vote Button */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E2D9C8]/40 text-xs">
                <span className="text-[#718096] text-[11px]">
                  Esta avaliação foi útil para o seu momento?
                </span>

                <button
                  type="button"
                  onClick={() => voteReviewHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2D9C8] text-[#14281D] font-bold hover:bg-[#FAF7F2] hover:border-[#C5A059] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Útil ({rev.helpfulLikes || 0})</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Image Modal Preview */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white p-2 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 bg-[#14281D] text-white p-2 rounded-full hover:bg-[#C5A059] transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImageModal}
              alt="Ampliada"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </section>
  );
};
