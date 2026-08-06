import React from 'react';
import { Leaf } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { MoonPhaseWidget } from '../../components/ui/MoonPhaseWidget';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings, freeShippingThreshold } = useShop();

  if (!storeSettings?.homepage?.promoBannerActive) {
    return null;
  }

  const customText = storeSettings.homepage?.promoBannerText;
  const bannerText = customText || `Frete Grátis acima de R$ ${freeShippingThreshold} • Até 6x Sem Juros • Botânica Ancestral 100% Natural`;

  return (
    <div className="bg-[#14281D] text-[#C5A059] py-2 px-4 text-[11px] font-medium tracking-wider uppercase border-b border-[#2C4837] flex flex-wrap justify-between items-center gap-2 max-w-full mx-auto">
      <div className="flex-1 flex justify-center items-center gap-2 text-center mx-auto">
        <Leaf className="w-3.5 h-3.5 text-[#C5A059] animate-pulse shrink-0 hidden sm:inline-block" />
        <span className="truncate">{bannerText}</span>
        <Leaf className="w-3.5 h-3.5 text-[#C5A059] animate-pulse shrink-0 hidden sm:inline-block" />
      </div>

      <div className="hidden lg:flex items-center shrink-0">
        <MoonPhaseWidget variant="compact" className="bg-[#1B3527] border-[#2C4837] text-[#FAF7F2] py-0.5 px-2.5" />
      </div>
    </div>
  );
};


