import React from 'react';
import { Sparkles, Calendar, ShieldCheck, Flame, Droplet, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface FragranceRequestStepProps {
  onStartQuestionnaire: () => void;
  onGoToAppointment: () => void;
  onViewStatus: () => void;
}

export const FragranceRequestStep: React.FC<FragranceRequestStepProps> = ({
  onStartQuestionnaire,
  onGoToAppointment,
  onViewStatus
}) => {
  return (
    <div className="space-y-10 font-sans">
      
      {/* Main Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#14281D] text-[#FAF7F2] p-8 sm:p-12 border border-[#2C4837] shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 border border-[#C5A059]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alquimia Botânica Exclusiva</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
            Criador de Fragrâncias Personalizadas
          </h1>

          <p className="text-sm sm:text-base text-[#D0C8B6] font-light leading-relaxed">
            Uma experiência olfativa única onde o Mestre Perfumista alinha suas memórias, intenções rituais e botânicas raras para formular um perfume artesanal sob medida.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartQuestionnaire}
              className="bg-[#C5A059] text-[#14281D] hover:bg-[#FAF7F2] hover:text-[#14281D] px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <span>Iniciar Questionário Olfativo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToAppointment}
              className="bg-[#2C4837] text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#14281D] border border-[#3E634D] px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Agendar Consulta Olfativa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Process Flow Overview (10 Steps Grid) */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
            DO CONCEITO AO FRASCO
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#14281D]">
            O Ritual Alquímico em 10 Etapas
          </h2>
          <p className="text-xs text-[#718096]">
            Processo transparente com acompanhamento em tempo real, maceração de 28 dias e suporte direto via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
          {[
            { num: '01', title: 'Solicitação', desc: 'Início da jornada e escolha do volume.' },
            { num: '02', title: 'Questionário', desc: 'Mapeamento das notas e intenções.' },
            { num: '03', title: 'Agendamento', desc: 'Sessão 1-a-1 com o perfumista.' },
            { num: '04', title: 'Pagamento', desc: 'Reserva do lote e extratos botânicos.' },
            { num: '05', title: 'Painel Admin', desc: 'Criação da fórmula pelo mestre.' },
            { num: '06', title: 'Status', desc: 'Rastreio da maceração de 28 dias.' },
            { num: '07', title: 'Histórico', desc: 'Registro permanente da pirâmide.' },
            { num: '08', title: 'WhatsApp', desc: 'Alertas em tempo real direto na sua conversa.' },
            { num: '09', title: 'E-mail', desc: 'Resumo da fórmula e certificado.' },
            { num: '10', title: 'Área do Cliente', desc: 'Gestão completa e reordenação fácil.' }
          ].map((item) => (
            <div
              key={item.num}
              className="bg-white p-4 rounded-2xl border border-[#E2D9C8] hover:border-[#C5A059] transition-all shadow-xs space-y-1.5"
            >
              <span className="text-xs font-bold font-serif text-[#C5A059]">{item.num}.</span>
              <h3 className="font-serif font-bold text-xs text-[#14281D]">{item.title}</h3>
              <p className="text-[10px] text-[#718096] leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-[#FAF7F2] text-[#C5A059] border border-[#E2D9C8] rounded-2xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#14281D]">
            Maceração Alquímica de 28 Dias
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            As notas olfativas repousam durante um ciclo lunar completo de 28 dias em frascos de vidro violeta miron para harmonizar moléculas aromáticas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-[#FAF7F2] text-[#C5A059] border border-[#E2D9C8] rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#14281D]">
            Óleos Essenciais 100% Puros
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            Nenhuma essência sintética ou ftalato. Formulados exclusivamente com extratos CO2, resinas sagradas e óleos prensados a frio.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-[#FAF7F2] text-[#C5A059] border border-[#E2D9C8] rounded-2xl flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#14281D]">
            Registro Permanente de Fórmula
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            Sua fórmula artesanal é arquivada em nosso livro sagrado. Você pode encomendar um novo frasco a qualquer momento com 1 clique.
          </p>
        </div>
      </div>

    </div>
  );
};
