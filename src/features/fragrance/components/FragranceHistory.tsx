import React from 'react';
import { BookOpen, RefreshCw, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';
import { CustomFragrance } from '../../../types';

interface FragranceHistoryProps {
  fragrances: CustomFragrance[];
  onReorder: (fragrance: CustomFragrance) => void;
}

export const FragranceHistory: React.FC<FragranceHistoryProps> = ({
  fragrances,
  onReorder
}) => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#C5A059]" />
            <span>Histórico de Fórmulas Alquímicas</span>
          </h2>
          <p className="text-xs text-[#718096]">
            Registro permanente de todas as pirâmides olfativas criadas exclusivamente para você no Atelier OMIAA.
          </p>
        </div>
      </div>

      {fragrances.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E2D9C8] text-center space-y-3">
          <p className="text-xs text-[#718096]">Ainda não há registros no seu histórico de perfumaria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fragrances.map((f, i) => (
            <div
              key={f.id || i}
              className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                      {f.batchNumber || `OMIAA-BATCH-${i + 1}`}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#14281D]">{f.name}</h3>
                  </div>

                  <span className="bg-[#FAF7F2] border border-[#E2D9C8] text-[#14281D] text-[10px] font-bold px-2.5 py-1 rounded-xl">
                    {f.bottleSize}
                  </span>
                </div>

                <p className="text-xs text-[#14281D] bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]/80 italic">
                  "{f.intention}"
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-[#E2D9C8]/60 pb-1">
                    <span className="text-[#8C7A5B] font-bold">Saída:</span>
                    <span className="text-[#14281D] font-medium">{f.topNotes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E2D9C8]/60 pb-1">
                    <span className="text-[#8C7A5B] font-bold">Coração:</span>
                    <span className="text-[#14281D] font-medium">{f.heartNotes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-[#8C7A5B] font-bold">Fundo:</span>
                    <span className="text-[#14281D] font-medium">{f.baseNotes.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between">
                <span className="text-[10px] text-[#718096]">
                  Criado em: {f.createdAt ? new Date(f.createdAt).toLocaleDateString('pt-BR') : '2026-07-10'}
                </span>

                <button
                  onClick={() => onReorder(f)}
                  className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Reordenar Esta Fórmula</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
