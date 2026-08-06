import React from 'react';
import { FlaskConical, Clock, CheckCircle2, MessageCircle, Mail, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { CustomFragrance } from '../../../types';

interface FragranceStatusTrackerProps {
  fragrances: CustomFragrance[];
  onOpenWhatsApp: (fragrance: CustomFragrance) => void;
  onOpenEmail: (fragrance: CustomFragrance) => void;
  onReorder?: (fragrance: CustomFragrance) => void;
}

export const FragranceStatusTracker: React.FC<FragranceStatusTrackerProps> = ({
  fragrances,
  onOpenWhatsApp,
  onOpenEmail,
  onReorder
}) => {
  if (!fragrances || fragrances.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E2D9C8] text-center space-y-4 max-w-lg mx-auto shadow-xs">
        <FlaskConical className="w-12 h-12 text-[#C5A059] mx-auto opacity-60" />
        <h3 className="font-serif font-bold text-xl text-[#14281D]">
          Nenhuma Fragrância em Andamento
        </h3>
        <p className="text-xs text-[#718096]">
          Você ainda não solicitou um perfume artesanal sob medida. Inicie seu questionário olfativo para criar sua primeira alquimia exclusiva.
        </p>
      </div>
    );
  }

  const STAGES = [
    { key: 'solicitado', label: 'Solicitado' },
    { key: 'agendado', label: 'Agendado' },
    { key: 'analise_olfativa', label: 'Análise Olfativa' },
    { key: 'macerando', label: 'Maceração (28d)' },
    { key: 'envasado', label: 'Envasado' },
    { key: 'enviado', label: 'Enviado' }
  ];

  const getStageIndex = (status?: string) => {
    if (!status) return 0;
    if (status === 'encomedado') return 3;
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 1;
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#C5A059]" />
            <span>Acompanhamento das Suas Fragrâncias Exclusivas</span>
          </h2>
          <p className="text-xs text-[#718096]">
            Acompanhe o ciclo lunar de maceração de 28 dias e receba atualizações do Mestre Perfumista.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {fragrances.map((item, index) => {
          const currentStageIndex = getStageIndex(item.status);
          const totalDays = item.macerationDaysTotal || 28;
          const daysLeft = item.macerationDaysRemaining ?? 11;
          const progressPercent = Math.max(0, Math.min(100, Math.round(((totalDays - daysLeft) / totalDays) * 100)));

          return (
            <div
              key={item.id || index}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6"
            >
              {/* Top Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full">
                      Lote: {item.batchNumber || `OMIAA-00${index + 1}`}
                    </span>
                    <span className="text-xs text-[#718096]">Frasco: {item.bottleSize}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#14281D] mt-1">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWhatsApp(item)}
                    className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onOpenEmail(item)}
                    className="bg-[#FAF7F2] text-[#14281D] hover:bg-[#E2D9C8]/40 border border-[#E2D9C8] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#8C7A5B]" />
                    <span>E-mail</span>
                  </button>

                  {item.status === 'envasado' || item.status === 'enviado' || item.status === 'concluido' ? (
                    onReorder && (
                      <button
                        onClick={() => onReorder(item)}
                        className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Reordenar</span>
                      </button>
                    )
                  ) : null}
                </div>
              </div>

              {/* Maceration Progress Countdown Bar */}
              {(item.status === 'macerando' || item.status === 'encomedado') && (
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-serif font-bold text-[#14281D] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>Ciclo de Maceração Alquímica (28 Dias)</span>
                    </span>
                    <span className="font-bold text-[#C5A059]">
                      {daysLeft === 0 ? 'Maceração Concluída!' : `${daysLeft} dias restantes (${progressPercent}% concluído)`}
                    </span>
                  </div>

                  <div className="w-full bg-[#E2D9C8] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#14281D] via-[#2C4837] to-[#C5A059] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Timeline Steps */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A5B] block">
                  Linha do Tempo da Formulação
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                  {STAGES.map((s, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={s.key}
                        className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                          isCurrent
                            ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-[#FAF7F2] text-[#A0AEC0] border-[#E2D9C8]'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isCurrent ? (
                            <Sparkles className="w-4 h-4 text-[#C5A059]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-[#CBD5E0]" />
                          )}
                        </div>
                        <p className="text-[10px] font-bold leading-tight">{s.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pyramid & Intention Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-[#8C7A5B] uppercase text-[10px] block">
                    Intenção Ritual
                  </span>
                  <p className="text-[#14281D] italic">"{item.intention}"</p>
                  {item.appointment && (
                    <p className="text-[11px] text-[#718096] pt-1">
                      📅 Consulta: {item.appointment.date} às {item.appointment.time} ({item.appointment.perfumer})
                    </p>
                  )}
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#E2D9C8] pt-2 sm:pt-0 sm:pl-4">
                  <span className="font-bold text-[#8C7A5B] uppercase text-[10px] block">
                    Composição da Pirâmide Olfativa
                  </span>
                  <p><strong>Saída:</strong> {item.topNotes?.join(', ') || 'Não informada'}</p>
                  <p><strong>Coração:</strong> {item.heartNotes?.join(', ') || 'Não informada'}</p>
                  <p><strong>Fundo:</strong> {item.baseNotes?.join(', ') || 'Não informada'}</p>
                </div>
              </div>

              {item.alchemistNotes && (
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-0.5">
                  <span className="font-bold uppercase text-[10px] text-amber-800 block">
                    Diário do Mestre Perfumista:
                  </span>
                  <p className="italic">"{item.alchemistNotes}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
