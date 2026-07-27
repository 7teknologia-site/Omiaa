import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#14281D] text-[#FAF7F2] py-2.5 px-4 text-[11px] font-medium tracking-widest uppercase border-b border-[#C5A059]/25">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#C5A059]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="font-sans font-semibold">Fórmula 100% Botânica & Ancestral</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 w-full md:w-auto text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse shrink-0" />
          <span className="text-[#FAF7F2]/90">
            Frete Grátis acima de <strong className="text-[#C5A059] font-bold">R$ 250</strong> • Cupom <strong className="text-[#C5A059] font-bold">ALQUIMIA10</strong> para 10% OFF
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[#EFE8DC]">
          <Truck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span className="font-sans">Entrega Ritualística para todo o Brasil</span>
        </div>
      </div>
    </div>
  );
};

