import React from 'react';
import { Moon } from 'lucide-react';

export interface MoonPhaseInfo {
  name: string;
  illumination: number; // percentage
  energy: string;
  iconType: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'third-quarter' | 'waning-crescent';
}

export function getCurrentMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  // Reference known new moon: Jan 11, 2024 at 11:57 UTC
  const knownNewMoon = new Date(2024, 0, 11, 11, 57).getTime();
  const now = date.getTime();
  const synodicMonthMs = 29.53058770576 * 86400 * 1000;
  const diff = (now - knownNewMoon) % synodicMonthMs;
  const daysIntoCycle = (diff < 0 ? diff + synodicMonthMs : diff) / (86400 * 1000);
  const cycleFraction = daysIntoCycle / 29.53058770576;
  const illumination = Math.round((1 - Math.cos(cycleFraction * 2 * Math.PI)) / 2 * 100);

  if (daysIntoCycle < 1.845) {
    return { name: 'Lua Nova', illumination, energy: 'Intenções & Plantio Astral', iconType: 'new' };
  } else if (daysIntoCycle < 5.537) {
    return { name: 'Lua Crescente', illumination, energy: 'Nutrição & Expansão Botânica', iconType: 'waxing-crescent' };
  } else if (daysIntoCycle < 9.228) {
    return { name: 'Quarto Crescente', illumination, energy: 'Ação & Maceração Solar', iconType: 'first-quarter' };
  } else if (daysIntoCycle < 12.920) {
    return { name: 'Crescente Gibosa', illumination, energy: 'Absorção de Óleos Raros', iconType: 'waxing-gibbous' };
  } else if (daysIntoCycle < 16.611) {
    return { name: 'Lua Cheia', illumination, energy: 'Apogeu, Colheita & Alquimia Ancestral', iconType: 'full' };
  } else if (daysIntoCycle < 20.302) {
    return { name: 'Minguante Gibosa', illumination, energy: 'Gratidão & Infusões de Ervas', iconType: 'waning-gibbous' };
  } else if (daysIntoCycle < 23.994) {
    return { name: 'Quarto Minguante', illumination, energy: 'Limpeza, Purificação & Soluções', iconType: 'third-quarter' };
  } else {
    return { name: 'Lua Minguante', illumination, energy: 'Recolhimento & Descanso Botânico', iconType: 'waning-crescent' };
  }
}

interface MoonPhaseWidgetProps {
  variant?: 'compact' | 'detailed' | 'footer';
  className?: string;
}

export const MoonPhaseWidget: React.FC<MoonPhaseWidgetProps> = ({ variant = 'compact', className = '' }) => {
  const moonInfo = getCurrentMoonPhase();

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E2D9C8] text-[11px] font-sans text-[#14281D] shadow-2xs ${className}`}
        title={`Fase Lunar Hoje: ${moonInfo.name} (${moonInfo.illumination}% Iluminada) • ${moonInfo.energy}`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
        </span>
        <Moon className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
        <span className="font-serif font-bold text-[#14281D]">{moonInfo.name}</span>
        <span className="text-[#8C7A5B] hidden sm:inline">•</span>
        <span className="text-[#5A6B5D] font-light text-[10px] hidden sm:inline">{moonInfo.illumination}% iluminada</span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`bg-[#1B3527] p-5 rounded-2xl border border-[#2C4837] flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#14281D] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 shadow-xs">
            <Moon className="w-5 h-5 text-[#C5A059] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase">Fase Lunar Hoje</span>
              <span className="text-[10px] text-[#A8B2A6] bg-[#14281D] px-2 py-0.5 rounded-full border border-[#2C4837]">
                {moonInfo.illumination}% Iluminação
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-[#FAF7F2] tracking-wide mt-0.5">
              {moonInfo.name}
            </h4>
          </div>
        </div>

        <div className="text-right sm:text-right text-center">
          <span className="text-[11px] text-[#C3D0C6] font-light italic block">
            "{moonInfo.energy}"
          </span>
          <span className="text-[10px] text-[#8C7A5B] font-mono tracking-wider block mt-0.5">
            Maceração & Rituais sob influência lunar
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#FDFBF7] p-5 rounded-2xl border border-[#E2D9C8] shadow-xs flex items-center gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#14281D] flex items-center justify-center text-[#C5A059] shrink-0">
        <Moon className="w-6 h-6 text-[#C5A059]" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C7A5B]">Alquimia Lunar Ativa</span>
          <span className="text-[10px] text-[#C5A059] font-bold">{moonInfo.illumination}%</span>
        </div>
        <h3 className="font-serif font-bold text-lg text-[#14281D]">{moonInfo.name}</h3>
        <p className="text-xs text-[#5A6B5D] font-light mt-0.5">{moonInfo.energy}</p>
      </div>
    </div>
  );
};
