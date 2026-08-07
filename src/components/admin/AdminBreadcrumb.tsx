import React from 'react';
import { ChevronRight, Home, Star } from 'lucide-react';

interface AdminBreadcrumbProps {
  moduleLabel: string;
  subItemLabel?: string;
  subItemId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({
  moduleLabel,
  subItemLabel,
  isFavorite = false,
  onToggleFavorite
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-[#E2D9C8]">
      <div className="flex items-center gap-2 text-xs text-[#8C7A5B]">
        <span className="flex items-center gap-1 font-medium text-[#14281D]">
          <Home className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Painel Admin</span>
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#8C7A5B]" />
        <span className="font-semibold text-[#14281D]">{moduleLabel}</span>
        {subItemLabel && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <span className="font-bold text-[#C5A059]">{subItemLabel}</span>
          </>
        )}
      </div>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isFavorite
              ? 'bg-[#C5A059] text-[#14281D] shadow-xs'
              : 'bg-white border border-[#E2D9C8] text-[#8C7A5B] hover:text-[#14281D] hover:border-[#C5A059]'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#14281D]' : ''}`} />
          <span>{isFavorite ? 'Favorito' : 'Favoritar'}</span>
        </button>
      )}
    </div>
  );
};
