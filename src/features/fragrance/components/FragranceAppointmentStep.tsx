import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, User, ArrowRight, CheckCircle } from 'lucide-react';
import { FragranceAppointment } from '../../../types';

interface FragranceAppointmentStepProps {
  onComplete: (appointment: FragranceAppointment) => void;
  onBack: () => void;
}

const AVAILABLE_PERFUMERS = [
  {
    name: 'Gabriel Alquimista',
    role: 'Mestre Perfumista Ancestral',
    specialty: 'Alquimia Vegetal & Óleos Raros',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
  },
  {
    name: 'Sofia Perfumista',
    role: 'Especialista em Aromaterapia Sagrada',
    specialty: 'Harmonização de Chakras & Botânicas',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
  }
];

const TIME_SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00'];

export const FragranceAppointmentStep: React.FC<FragranceAppointmentStepProps> = ({
  onComplete,
  onBack
}) => {
  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('14:00');
  const [type, setType] = useState<'virtual' | 'presencial'>('virtual');
  const [perfumer, setPerfumer] = useState('Gabriel Alquimista');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      date,
      time,
      type,
      perfumer,
      locationOrLink:
        type === 'presencial'
          ? 'Atelier OMIAA - Alameda das Magnólias, 420 - São Paulo / SP'
          : 'Link de vídeo enviado por e-mail e WhatsApp 1h antes da consulta',
      confirmed: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-2 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
          ETAPA 3 DE 10 • SESSÃO INDIVIDUAL
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#14281D]">
          Agendamento da Consulta Olfativa
        </h2>
        <p className="text-xs text-[#718096]">
          Escolha a data, horário e especialista para alinhar a pirâmide de aromas e a intenção ritual do seu perfume.
        </p>
      </div>

      {/* Select Modality */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
          Modalidade da Consulta
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('virtual')}
            className={`p-5 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
              type === 'virtual'
                ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
            }`}
          >
            <Video className={`w-5 h-5 ${type === 'virtual' ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
            <div className="font-serif font-bold text-sm">Sessão Virtual via Vídeo</div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Consulta online ao vivo no conforto da sua casa. Enviamos kit de tiras olfativas demonstrativas por sedex.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setType('presencial')}
            className={`p-5 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
              type === 'presencial'
                ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
            }`}
          >
            <MapPin className={`w-5 h-5 ${type === 'presencial' ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
            <div className="font-serif font-bold text-sm">Presencial no Atelier OMIAA</div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Atendimento VIP exclusivo em nosso atelier de São Paulo. Degustação presencial de mais de 80 resinas e óleos raros.
            </p>
          </button>
        </div>
      </div>

      {/* Perfumer Selection */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
          Selecione o Perfumista
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVAILABLE_PERFUMERS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPerfumer(p.name)}
              className={`p-4 rounded-2xl border flex items-center gap-4 text-left transition-all cursor-pointer ${
                perfumer === p.name
                  ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                  : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#C5A059]/40"
              />
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-sm">{p.name}</div>
                <div className="text-[10px] text-[#C5A059] font-bold">{p.role}</div>
                <p className="text-[10px] opacity-80">{p.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-2">
            Data da Consulta
          </label>
          <input
            type="date"
            required
            value={date}
            min="2026-07-28"
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl p-3.5 text-xs text-[#14281D] font-bold focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider mb-2">
            Horário Disponível
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  time === slot
                    ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                    : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={onBack}
          className="bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/40 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Voltar para o Questionário
        </button>

        <button
          type="submit"
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Confirmar e Ir para Pagamento</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </button>
      </div>

    </form>
  );
};
