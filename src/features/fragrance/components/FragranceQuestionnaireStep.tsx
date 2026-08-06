import React, { useState } from 'react';
import { Sparkles, Droplet, ArrowRight, Shield, Heart, Sun, Feather, Check, AlertCircle } from 'lucide-react';
import { FragranceQuestionnaire } from '../../../types';

interface FragranceQuestionnaireStepProps {
  onComplete: (data: {
    name: string;
    intention: string;
    topNotes: string[];
    heartNotes: string[];
    baseNotes: string[];
    bottleSize: string;
    price: number;
    questionnaire: FragranceQuestionnaire;
  }) => void;
  onBack: () => void;
}

const AVAILABLE_TOP_NOTES = [
  'Bergamota Calábria',
  'Laranja Doce',
  'Sálvia Esclaréia',
  'Grapefruit Rosa',
  'Lavanda Francesa',
  'Alecrim do Campo'
];

const AVAILABLE_HEART_NOTES = [
  'Rosa Damascena',
  'Jasmim Real',
  'Néroli Flor',
  'Gerânio Egípcio',
  'Íris Imperial',
  'Ylang-Ylang Comores'
];

const AVAILABLE_BASE_NOTES = [
  'Breu Branco',
  'Palo Santo',
  'Cedro do Atlas',
  'Sândalo Mysore',
  'Vetiver de Comores',
  'Mirra Sagrada',
  'Copal Dourado'
];

const INTENTIONS = [
  { id: 'prosperidade', label: 'Prosperidade & Abundância', icon: Sun, element: 'Fogo', chakra: 'Plexo Solar' },
  { id: 'paz', label: 'Paz Interior & Tranquilidade', icon: Feather, element: 'Ar', chakra: 'Anahata / Coração' },
  { id: 'magnetismo', label: 'Magnetismo & Amor Próprio', icon: Heart, element: 'Água', chakra: 'Sacral' },
  { id: 'protecao', label: 'Proteção & Limpeza Energética', icon: Shield, element: 'Terra', chakra: 'Básico' },
  { id: 'intuicao', label: 'Intuição & Conexão Divina', icon: Sparkles, element: 'Éter', chakra: 'Terceiro Olho' }
];

const FAMILIES = [
  'Amadeirado Terroso',
  'Oriental & Resinoso',
  'Floral Sagrado',
  'Cítrico Energizante',
  'Herbal & Místico'
];

export const FragranceQuestionnaireStep: React.FC<FragranceQuestionnaireStepProps> = ({
  onComplete,
  onBack
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('Perfume Ritual de Prosperidade');
  const [selectedIntentionObj, setSelectedIntentionObj] = useState(INTENTIONS[0]);
  const [customIntentionText, setCustomIntentionText] = useState(
    'Abertura de caminhos profissionais, clareza e fortalecimento da presença.'
  );
  const [selectedFamily, setSelectedFamily] = useState('Cítrico Energizante');
  const [selectedTop, setSelectedTop] = useState<string[]>(['Bergamota Calábria']);
  const [selectedHeart, setSelectedHeart] = useState<string[]>(['Néroli Flor', 'Rosa Damascena']);
  const [selectedBase, setSelectedBase] = useState<string[]>(['Breu Branco', 'Cedro do Atlas']);
  const [intensity, setIntensity] = useState<'Suave' | 'Moderada' | 'Marcante'>('Marcante');
  const [concentration, setConcentration] = useState<'Eau de Parfum (20%)' | 'Extrait de Parfum (30%)' | 'Névoa Áurica (15%)'>('Eau de Parfum (20%)');
  const [bottleSize, setBottleSize] = useState<'30ml' | '50ml' | '100ml'>('50ml');
  const [bottleEngraving, setBottleEngraving] = useState('OMIAA - Abundância');

  const priceMap = { '30ml': 220, '50ml': 340, '100ml': 580 };

  const toggleTopNote = (note: string) => {
    if (selectedTop.includes(note)) {
      if (selectedTop.length > 1) setSelectedTop(selectedTop.filter((n) => n !== note));
    } else {
      if (selectedTop.length < 3) setSelectedTop([...selectedTop, note]);
    }
  };

  const toggleHeartNote = (note: string) => {
    if (selectedHeart.includes(note)) {
      if (selectedHeart.length > 1) setSelectedHeart(selectedHeart.filter((n) => n !== note));
    } else {
      if (selectedHeart.length < 3) setSelectedHeart([...selectedHeart, note]);
    }
  };

  const toggleBaseNote = (note: string) => {
    if (selectedBase.includes(note)) {
      if (selectedBase.length > 1) setSelectedBase(selectedBase.filter((n) => n !== note));
    } else {
      if (selectedBase.length < 3) setSelectedBase([...selectedBase, note]);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        intention: customIntentionText,
        topNotes: selectedTop,
        heartNotes: selectedHeart,
        baseNotes: selectedBase,
        bottleSize,
        price: priceMap[bottleSize],
        questionnaire: {
          intention: selectedIntentionObj.label,
          olfactiveFamily: selectedFamily,
          intensity,
          concentration,
          bottleEngraving,
          preferredElement: selectedIntentionObj.element,
          moodOrChakra: selectedIntentionObj.chakra
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Questionnaire Progress Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
              ETAPA {step} DE 3 DO QUESTIONÁRIO
            </span>
            <h2 className="font-serif text-xl font-bold text-[#14281D]">
              {step === 1 && '1. Intenção Alquímica & Propósito'}
              {step === 2 && '2. Seleção de Pirâmide Olfativa'}
              {step === 3 && '3. Concentração & Personalização do Frasco'}
            </h2>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all ${
                  s === step ? 'bg-[#C5A059] w-12' : s < step ? 'bg-[#14281D]' : 'bg-[#E2D9C8]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: Intenção & Família */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Nome Desejado para o Perfume
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Perfume Sol de Gaia"
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl p-3.5 text-xs text-[#14281D] font-bold focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Qual a principal intenção ritual?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INTENTIONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedIntentionObj.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIntentionObj(item)}
                    className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                        : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
                    <div className="font-serif font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-80">Elemento: {item.element} • {item.chakra}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Descreva com suas palavras o objetivo/sentimento desejado
            </label>
            <textarea
              rows={3}
              value={customIntentionText}
              onChange={(e) => setCustomIntentionText(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl p-3.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Família Olfativa Predominante
            </label>
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map((fam) => (
                <button
                  key={fam}
                  type="button"
                  onClick={() => setSelectedFamily(fam)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedFamily === fam
                      ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                      : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Pirâmide Olfativa */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Top Notes */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-sm text-[#14281D]">
                  Notas de Saída (Topo - Frescor Inicial)
                </h3>
              </div>
              <span className="text-[10px] text-[#8C7A5B] font-bold">Selecione até 3 notas</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_TOP_NOTES.map((note) => {
                const selected = selectedTop.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleTopNote(note)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                        : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                    }`}
                  >
                    {note} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-sm text-[#14281D]">
                  Notas de Coração (Corpo - Alma do Perfume)
                </h3>
              </div>
              <span className="text-[10px] text-[#8C7A5B] font-bold">Selecione até 3 notas</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_HEART_NOTES.map((note) => {
                const selected = selectedHeart.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleHeartNote(note)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                        : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                    }`}
                  >
                    {note} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Base Notes */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-sm text-[#14281D]">
                  Notas de Fundo (Fixação - Ancoramento Terroso)
                </h3>
              </div>
              <span className="text-[10px] text-[#8C7A5B] font-bold">Selecione até 3 notas</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_BASE_NOTES.map((note) => {
                const selected = selectedBase.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleBaseNote(note)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                        : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                    }`}
                  >
                    {note} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Concentração, Frasco e Gravação */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Volume do Frasco & Preço
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { size: '30ml', price: 'R$ 220,00', desc: 'Frasco de Alquimia Compacto.' },
                { size: '50ml', price: 'R$ 340,00', desc: 'Volume Padrão Recomendado.', recommended: true },
                { size: '100ml', price: 'R$ 580,00', desc: 'Edição Mestre com Caixa em Madeira.' }
              ].map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => setBottleSize(item.size as any)}
                  className={`p-5 rounded-2xl border text-left relative space-y-1 transition-all cursor-pointer ${
                    bottleSize === item.size
                      ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D] shadow-md'
                      : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                  }`}
                >
                  {item.recommended && (
                    <span className="absolute -top-2.5 right-4 bg-[#C5A059] text-[#14281D] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Mais Escolhido
                    </span>
                  )}
                  <div className="font-serif font-bold text-lg">{item.size}</div>
                  <div className="font-bold text-[#C5A059] text-sm">{item.price}</div>
                  <p className="text-[10px] opacity-80">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Concentração Alquímica
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                'Eau de Parfum (20%)',
                'Extrait de Parfum (30%)',
                'Névoa Áurica (15%)'
              ].map((conc) => (
                <button
                  key={conc}
                  type="button"
                  onClick={() => setConcentration(conc as any)}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    concentration === conc
                      ? 'bg-[#14281D] text-[#FAF7F2] border-[#14281D]'
                      : 'bg-[#FAF7F2] text-[#14281D] border-[#E2D9C8] hover:border-[#C5A059]'
                  }`}
                >
                  {conc}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
            <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
              Gravação Personalizada no Frasco (Lacre Dourado)
            </label>
            <input
              type="text"
              value={bottleEngraving}
              onChange={(e) => setBottleEngraving(e.target.value)}
              placeholder="Ex: Seu Nome ou Mantra Exclusivo"
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl p-3.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
          className="bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/40 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>{step === 3 ? 'Avançar para Agendamento' : 'Próxima Etapa'}</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </button>
      </div>

    </div>
  );
};
