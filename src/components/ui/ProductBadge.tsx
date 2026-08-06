import React from 'react';
import { Sparkles, Tag, Flame, Crown, Feather, AlertCircle, Clock } from 'lucide-react';

interface ProductBadgeProps {
  badge: string;
  discountPercent?: number;
  size?: 'sm' | 'md';
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({ badge, discountPercent, size = 'sm' }) => {
  const normalized = badge.toLowerCase().trim();
  const textSize = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';

  if (normalized.includes('novo')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-600/50 shadow-xs backdrop-blur-xs ${textSize}`}>
        <Sparkles className="w-3 h-3 text-emerald-400" />
        Novo
      </span>
    );
  }

  if (normalized.includes('promo') || normalized.includes('desconto')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-rose-950/90 text-rose-200 border border-rose-600/50 shadow-xs backdrop-blur-xs ${textSize}`}>
        <Tag className="w-3 h-3 text-rose-400" />
        {discountPercent ? `-${discountPercent}% OFF` : 'Promoção'}
      </span>
    );
  }

  if (normalized.includes('exclusiv')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-[#181124]/95 text-[#E0A96D] border border-[#E0A96D]/40 shadow-xs backdrop-blur-xs ${textSize}`}>
        <Crown className="w-3 h-3 text-[#E0A96D]" />
        Exclusivo
      </span>
    );
  }

  if (normalized.includes('artesanal') || normalized.includes('atado') || normalized.includes('manual')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-[#3E2516]/95 text-[#F3E5AB] border border-[#A67B5B]/50 shadow-xs backdrop-blur-xs ${textSize}`}>
        <Feather className="w-3 h-3 text-[#F3E5AB]" />
        {badge}
      </span>
    );
  }

  if (normalized.includes('mais vendido') || normalized.includes('destaque') || normalized.includes('popular')) {
    return (
      <span className={`inline-flex items-center gap-1 font-black uppercase tracking-wider rounded-full bg-[#C5A059] text-[#14281D] shadow-xs ${textSize}`}>
        <Flame className="w-3 h-3 fill-current" />
        {badge}
      </span>
    );
  }

  if (normalized.includes('esgotado') || normalized.includes('indispon')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-gray-900/90 text-gray-300 border border-gray-700 shadow-xs ${textSize}`}>
        <AlertCircle className="w-3 h-3 text-red-400" />
        Esgotado
      </span>
    );
  }

  if (normalized.includes('poucas') || normalized.includes('últimas')) {
    return (
      <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-amber-950/90 text-amber-200 border border-amber-600/50 shadow-xs ${textSize}`}>
        <Clock className="w-3 h-3 text-amber-400" />
        {badge}
      </span>
    );
  }

  // Fallback for custom badges
  return (
    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-[#14281D] border border-[#E2D9C8] shadow-xs ${textSize}`}>
      {badge}
    </span>
  );
};
