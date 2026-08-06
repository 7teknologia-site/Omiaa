import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ErpPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const ErpPagination: React.FC<ErpPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs font-sans border-t border-[#E2D9C8]/60 mt-4">
      {/* Item count summary */}
      <div className="text-[#718096]">
        Exibindo <span className="font-bold text-[#14281D]">{startItem}</span> a{' '}
        <span className="font-bold text-[#14281D]">{endItem}</span> de{' '}
        <span className="font-bold text-[#14281D]">{totalItems}</span> registros
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-[#718096]">
            <span>Itens por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl px-2 py-1 text-xs text-[#14281D] font-bold focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-xl border border-[#E2D9C8] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-[#14281D]"
            title="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl font-bold text-[#14281D]">
            {currentPage} / {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-xl border border-[#E2D9C8] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-[#14281D]"
            title="Próxima Página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
