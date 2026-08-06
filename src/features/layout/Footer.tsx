import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Mail, MapPin, Phone } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';
import { Logo } from '../../components/ui/Logo';
import { MoonPhaseWidget } from '../../components/ui/MoonPhaseWidget';

export const Footer: React.FC = () => {
  const { setViewMode, setFilters, storeSettings } = useShop();

  const handleCategoryClick = (catId?: CategoryId) => {
    setFilters(prev => ({
      ...prev,
      category: catId ?? null,
      searchQuery: ''
    }));
    setViewMode('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (mode: any) => {
    setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactEmail = storeSettings.contact?.primaryEmail || 'contato@omiaa.com.br';
  const contactPhone = storeSettings.contact?.whatsapp || storeSettings.contact?.phone || '(11) 98765-4321';
  const contactAddress = storeSettings.contact?.address
    ? `${storeSettings.contact.address} • ${storeSettings.contact.city} - ${storeSettings.contact.state}`
    : `Alameda das Camomilas, 108 • ${storeSettings.contact?.city || 'São Paulo'} - ${storeSettings.contact?.state || 'SP'}`;
  const aboutText = storeSettings.footer?.aboutText || storeSettings.brand?.description || 'Resgatando a sabedoria das plantas e dos rituais ancestrais em formulações cosméticas botânicas de alta potência.';
  const copyright = storeSettings.footer?.copyrightText || `© 2026 ${storeSettings.brand?.corporateName || 'Omiaá Alquimia Ancestral Ltda'}. Todos os direitos reservados.`;
  const cnpj = storeSettings.footer?.cnpjText || 'CNPJ: 12.345.678/0001-90';

  return (
    <footer className="bg-[#14281D] text-[#FAF7F2] pt-16 pb-8 border-t border-[#2C4837] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-[#2C4837] pb-12">
          <div className="flex items-center gap-4 bg-[#1B3527] p-5 rounded-2xl border border-[#2C4837]">
            <div className="w-12 h-12 rounded-xl bg-[#14281D] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#C5A059]">Frete Seguro & Rastreado</h4>
              <p className="text-xs text-[#A8B2A6] mt-0.5">Envio para todo o Brasil com rastreamento em cada pedido.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#1B3527] p-5 rounded-2xl border border-[#2C4837]">
            <div className="w-12 h-12 rounded-xl bg-[#14281D] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#C5A059]">Ingredientes Naturais</h4>
              <p className="text-xs text-[#A8B2A6] mt-0.5">Produtos elaborados com ingredientes naturais e seleção cuidadosa.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#1B3527] p-5 rounded-2xl border border-[#2C4837]">
            <div className="w-12 h-12 rounded-xl bg-[#14281D] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#C5A059]">Suporte Especializado</h4>
              <p className="text-xs text-[#A8B2A6] mt-0.5">Tire suas dúvidas e receba orientações sobre o uso dos produtos.</p>
            </div>
          </div>
        </div>

        {/* Current Astronomical Moon Phase Banner */}
        <MoonPhaseWidget variant="footer" />

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-1">
            <Logo
              onClick={() => handleNavigation('catalog')}
              colorScheme="light"
              size="md"
            />
            <p className="text-xs text-[#A8B2A6] leading-relaxed">
              {aboutText}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              {storeSettings.footer?.aboutTitle || 'Alquimia Ancestral'}
            </h4>
            <ul className="space-y-2 text-xs text-[#A8B2A6]">
              <li onClick={() => handleCategoryClick('elixires')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Elixires Faciais</li>
              <li onClick={() => handleCategoryClick('seruns')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Séruns & Óleos</li>
              <li onClick={() => handleCategoryClick('chass')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Infusões & Chás</li>
              <li onClick={() => handleCategoryClick('velas')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Velas & Defumadores</li>
              <li onClick={() => handleCategoryClick('rituais')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Kits de Ritual</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">Descubra</h4>
            <ul className="space-y-2 text-xs text-[#A8B2A6]">
              <li onClick={() => handleNavigation('fragrance-atelier')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Fragrâncias Personalizadas</li>
              <li onClick={() => handleNavigation('botanical')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Guia das Ervas</li>
              <li onClick={() => handleNavigation('blog')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Blog</li>
              <li onClick={() => handleNavigation('account')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Minha Conta</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">
              {storeSettings.footer?.supportTitle || 'Atendimento & Rituais'}
            </h4>
            <div className="space-y-3 text-xs text-[#A8B2A6]">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>{contactEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>{contactPhone}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{contactAddress}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2C4837] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7A5B] gap-4">
          <div>
            <p>{copyright}</p>
            <p className="text-[10px] text-[#A8B2A6] mt-0.5">{cnpj}</p>
          </div>
          <div className="flex items-center gap-4">
            <span>Mercado Pago SSL 256-Bit</span>
            <span>•</span>
            <span>Melhor Envio Correios</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
