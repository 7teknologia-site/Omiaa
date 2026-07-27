import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Leaf, HeartHandshake, Moon, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Por favor insira um e-mail válido', undefined, 'alert');
      return;
    }
    showToast('Inscrição Confirmada!', 'Você agora faz parte do Círculo de Alquimistas.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#14281D] text-[#FAF7F2] pt-20 pb-12 border-t border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Guarantees Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-14 border-b border-[#C5A059]/20">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1B3B2B] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/35 shrink-0 shadow-sm">
              <Leaf className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">100% Botânico</h5>
              <p className="text-[11px] text-[#A8B2A6] mt-0.5">Ervas e extratos virgens puros</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1B3B2B] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/35 shrink-0 shadow-sm">
              <Moon className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Ritual Lunar</h5>
              <p className="text-[11px] text-[#A8B2A6] mt-0.5">Macerado nas fases astrológicas</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1B3B2B] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/35 shrink-0 shadow-sm">
              <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Comércio Ético</h5>
              <p className="text-[11px] text-[#A8B2A6] mt-0.5">Colheita sustentável com famílias</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1B3B2B] flex items-center justify-center text-[#C5A059] border border-[#C5A059]/35 shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">Compra Segura</h5>
              <p className="text-[11px] text-[#A8B2A6] mt-0.5">Pagamento criptografado Pix/Cartão</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 py-14 border-b border-[#C5A059]/20">
          
          {/* Brand Philosophy Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-[#14281D]" />
              </div>
              <span className="font-serif text-2xl tracking-[0.22em] font-semibold text-[#FAF7F2] uppercase">
                OMIAÁ
              </span>
            </div>
            <p className="text-xs text-[#EFE8DC]/80 leading-relaxed max-w-sm font-sans">
              OMIAÁ é o resgate da alta alquimia botânica e dos rituais ancestrais de cura. Formulamos elixires, séruns puros e preparados de regeneração combinando os mistérios das plantas nativas brasileiras com o rigor da cosmetologia sustentável.
            </p>
            <div className="text-[11px] text-[#C5A059] font-medium tracking-wide font-sans pt-1">
              Apotheca e Laboratório • Chapada dos Veadeiros / SP
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C5A059]">Apotheca</h5>
            <ul className="space-y-2.5 text-xs text-[#EFE8DC]/80 font-sans">
              <li><a href="#catalog" className="hover:text-[#C5A059] transition-colors">Elixires Concentrados</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A059] transition-colors">Séruns & Néctares Faciais</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A059] transition-colors">Chás & Infusões Solares</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A059] transition-colors">Velas de Cera Vegetal</a></li>
              <li><a href="#catalog" className="hover:text-[#C5A059] transition-colors">Rituais & Defumação</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C5A059]">
              Círculo de Alquimistas
            </h5>
            <p className="text-xs text-[#EFE8DC]/80 leading-relaxed font-sans">
              Receba convites para edições limitadas produzidas nas luas cheias e saberes da fitoterapia ancestral.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail ritualístico..."
                  className="w-full bg-[#1B3B2B] border border-[#C5A059]/40 rounded-full py-3 pl-4 pr-12 text-xs text-[#FAF7F2] placeholder-[#A8B2A6] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-9 h-9 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center hover:bg-[#D4AF37] transition-colors shadow-sm"
                  aria-label="Inscrever-se"
                >
                  <ArrowRight className="w-4 h-4 text-[#14281D]" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8B2A6] gap-4">
          <div>
            © 2026 OMIAÁ Alquimia Ancestral. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-[#EFE8DC]/70">
            <span>Pix Instantâneo</span>
            <span>•</span>
            <span>Cartão de Crédito até 6x</span>
            <span>•</span>
            <span>Boleto Bancário</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

