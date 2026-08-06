import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ViewMode } from '../../types';

export interface BreadcrumbItem {
  label: string;
  viewMode?: ViewMode;
  onClick?: () => void;
  active?: boolean;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { setViewMode } = useShop();

  return (
    <nav aria-label="Navegação em migalhas de pão" className="py-3 px-1 font-sans text-xs">
      <ol className="flex items-center flex-wrap gap-1.5 text-[#718096]">
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('catalog')}
            className="flex items-center gap-1 text-[#14281D] hover:text-[#C5A059] font-medium transition-colors cursor-pointer"
            aria-label="Ir para a página inicial da Omiaá Alquimia Ancestral"
          >
            <Home className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Início</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-[#E2D9C8] shrink-0" />

              {isLast ? (
                <span
                  className="font-bold text-[#14281D] truncate max-w-[200px] sm:max-w-[320px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.viewMode) {
                      setViewMode(item.viewMode);
                    }
                  }}
                  className="text-[#718096] hover:text-[#14281D] transition-colors font-medium cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
