import React from 'react';
import { Sparkles, Compass, Flame, Crown, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { CustomerProfile } from '../../types';

interface AccountJourneyProps {
  user: CustomerProfile;
}

interface JourneyTierInfo {
  id: 'Neófito' | 'Iniciado' | 'Mestre Alquimista';
  title: string;
  subtitle: string;
  minPoints: number;
  maxPoints: number | null;
  element: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  perks: string[];
  ritualQuote: string;
}

const TIERS: JourneyTierInfo[] = [
  {
    id: 'Neófito',
    title: 'Neófito',
    subtitle: 'O Despertar dos Sentidos',
    minPoints: 0,
    maxPoints: 199,
    element: 'Terra & Orvalho',
    icon: Compass,
    description:
      'O primeiro passo na senda ancestral. O neófito desperta sua sensibilidade para as essências puras, botânicas sagradas e os ciclos naturais.',
    perks: [
      'Acúmulo de pontos a cada alquimia adquirida',
      'Acesso ao Diário Alquímico e saberes botânicos',
      'Recebimento de novidades e lançamentos em primeira mão'
    ],
    ritualQuote: '“Toda grande transmutação tem início na escuta sutil da semente que germina.”'
  },
  {
    id: 'Iniciado',
    title: 'Iniciado',
    subtitle: 'A Transmutação da Essência',
    minPoints: 200,
    maxPoints: 499,
    element: 'Fogo Sutil & Resinas',
    icon: Flame,
    description:
      'Aquele que já provou dos rituais e compreendeu a harmonia dos aromas. Suas escolhas refletem maior conexão com o equilíbrio e o bem-estar.',
    perks: [
      'Multiplicador de pontos especiais em ciclos lunares',
      'Cupons sazonais e mimos botânicos selecionados',
      'Prioridade na criação de Fragrâncias Personalizadas'
    ],
    ritualQuote: '“O fogo que purifica é o mesmo que eleva a fumaça aos céus em agradecimento.”'
  },
  {
    id: 'Mestre Alquimista',
    title: 'Mestre Alquimista',
    subtitle: 'A Grande Obra & Plenitude',
    minPoints: 500,
    maxPoints: null,
    element: 'Éter & Quinta-Essência',
    icon: Crown,
    description:
      'O ápice da jornada OMIAÁ. Guardião do equilíbrio e profundo conhecedor das frequências aromáticas e rituais de autocuidado.',
    perks: [
      'Frete cortesia em seleções especiais de rituais',
      'Acesso prioritário a elixires e lotes de tiragem limitada',
      'Consultoria olfativa exclusiva com nossos alquimistas',
      'Descontos progressivos automáticos e presentes de aniversário'
    ],
    ritualQuote: '“Na harmonia do invisível habita a chave de toda a cura e beleza imutável.”'
  }
];

export const AccountJourney: React.FC<AccountJourneyProps> = ({ user }) => {
  const currentTier = user.tier || 'Neófito';
  const currentPoints = user.loyaltyPoints || 0;

  const currentTierIndex = TIERS.findIndex((t) => t.id === currentTier);
  const activeTierIndex = currentTierIndex >= 0 ? currentTierIndex : 0;
  const nextTier = TIERS[activeTierIndex + 1] || null;

  // Calculate progress to next tier
  let progressPercent = 100;
  let pointsNeeded = 0;

  if (nextTier) {
    const currentTierMin = TIERS[activeTierIndex].minPoints;
    const nextTierMin = nextTier.minPoints;
    const tierRange = nextTierMin - currentTierMin;
    const pointsInTier = Math.max(0, currentPoints - currentTierMin);
    progressPercent = Math.min(100, Math.max(0, Math.round((pointsInTier / tierRange) * 100)));
    pointsNeeded = Math.max(0, nextTierMin - currentPoints);
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Hero Journey Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14281D] via-[#1B3627] to-[#0D1B13] text-[#FAF7F2] p-8 rounded-3xl border border-[#2C4837] shadow-md">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Senda dos Elementos & Fidelidade</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2]">
                Sua Jornada Alquímica
              </h2>
              <p className="text-xs sm:text-sm text-[#D1DCD0] max-w-xl leading-relaxed">
                Cada ritual realizado e alquimia adquirida acumula Pontos em sua caminhada de autodescoberta e reconexão ancestral.
              </p>
            </div>

            <div className="bg-[#14281D]/80 border border-[#C5A059]/30 p-4 rounded-2xl flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B2A6] block">
                  Pontos Acumulados
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C5A059]">
                  {currentPoints} <span className="text-xs font-sans text-[#FAF7F2]/80">pts</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-[#14281D] flex items-center justify-center font-bold shadow-inner">
                {React.createElement(TIERS[activeTierIndex].icon, { className: 'w-6 h-6' })}
              </div>
            </div>
          </div>

          {/* Progress to Next Tier Bar */}
          <div className="bg-[#0D1B13]/80 p-5 rounded-2xl border border-[#2C4837] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#A8B2A6]">Nível Atual:</span>
                <span className="font-bold text-[#FAF7F2]">{currentTier}</span>
              </div>
              {nextTier ? (
                <div className="text-[#C5A059] font-medium">
                  Faltam <span className="font-bold text-[#FAF7F2]">{pointsNeeded}</span> pontos para atingir <span className="font-bold">{nextTier.title}</span>
                </div>
              ) : (
                <div className="text-[#C5A059] font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4" /> Nível Supremo Alcançado
                </div>
              )}
            </div>

            <div className="w-full bg-[#1F3A2B] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C7A5B] via-[#C5A059] to-[#E5C989] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-[#A8B2A6] font-mono">
              <span>0 pts</span>
              <span>200 pts (Iniciado)</span>
              <span>500+ pts (Mestre)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TIERS.map((tierItem, idx) => {
          const IconComponent = tierItem.icon;
          const isCurrent = tierItem.id === currentTier;
          const isUnlocked = currentPoints >= tierItem.minPoints;

          return (
            <div
              key={tierItem.id}
              className={`relative flex flex-col justify-between p-6 rounded-3xl border transition-all ${
                isCurrent
                  ? 'bg-white border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/20'
                  : isUnlocked
                  ? 'bg-[#FAF7F2] border-[#E2D9C8]'
                  : 'bg-white/60 border-[#E2D9C8]/60 opacity-80'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#14281D] text-[#C5A059]'
                      : isUnlocked
                      ? 'bg-[#E2D9C8] text-[#14281D]'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#14281D] text-[#C5A059] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Seu Grau Atual
                  </span>
                ) : isUnlocked ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Desbloqueado
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {tierItem.minPoints} pts
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-3">
                <span className="text-[10px] uppercase font-bold text-[#8C7A5B] tracking-widest block">
                  Elemento: {tierItem.element}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#14281D]">
                  {tierItem.title}
                </h3>
                <p className="text-xs font-serif italic text-[#C5A059]">
                  {tierItem.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-[#556358] leading-relaxed mb-4">
                {tierItem.description}
              </p>

              {/* Quote */}
              <blockquote className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9C8]/60 text-[11px] font-serif italic text-[#14281D] mb-4">
                {tierItem.ritualQuote}
              </blockquote>

              {/* Perks */}
              <div className="pt-4 border-t border-[#E2D9C8] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14281D] block">
                  Privilégios do Grau
                </span>
                <ul className="space-y-1.5 text-xs text-[#556358]">
                  {tierItem.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#C5A059] mt-0.5">•</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Points Range */}
              <div className="mt-5 pt-3 border-t border-[#E2D9C8]/60 flex items-center justify-between text-[11px] text-[#8C7A5B]">
                <span>Pontuação necessária:</span>
                <span className="font-bold text-[#14281D]">
                  {tierItem.maxPoints ? `${tierItem.minPoints} a ${tierItem.maxPoints} pts` : `A partir de ${tierItem.minPoints} pts`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Earn Points Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#14281D] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C5A059]" />
          Como Consagrar Seus Pontos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-1">
            <span className="font-bold text-[#14281D] block">1. Aquisição de Alquimias</span>
            <p className="text-[#718096]">Cada R$ 1,00 em pedidos finalizados é convertido em 1 Ponto na sua conta.</p>
          </div>
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-1">
            <span className="font-bold text-[#14281D] block">2. Avaliações & Relatos</span>
            <p className="text-[#718096]">Compartilhe suas sensações nas páginas dos produtos para acumular pontos bônus.</p>
          </div>
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] space-y-1">
            <span className="font-bold text-[#14281D] block">3. Resgate & Transmutação</span>
            <p className="text-[#718096]">Conforme ascende de grau, seus pontos desbloqueiam mimos e vantagens exclusivas.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
