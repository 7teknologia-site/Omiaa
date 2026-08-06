import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Sparkles,
  Eye,
  Edit3,
  Link as LinkIcon,
  Image as ImageIcon,
  Flame,
  Droplet,
  Feather,
  BookOpen
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  category?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  category = 'Ervas',
  placeholder = 'Escreva a história ancestral, modo de preparo, propriedades e rituais...'
}) => {
  const [activeMode, setActiveMode] = useState<'editor' | 'preview'>('editor');

  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('rich-text-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      onChange((value || '') + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = prefix + (selectedText || 'texto') + suffix;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 5));
    }, 50);
  };

  const handleInsertTemplate = (type: 'banho' | 'defumacao' | 'oleo' | 'resina' | 'erva') => {
    let template = '';

    if (type === 'banho') {
      template = `
<h3>Ritual de Banho Sagrado</h3>
<p><strong>Fase Lunar Recomendada:</strong> Lua Crescente ou Cheia</p>
<p><strong>Horário Alquímico:</strong> Ao pôr do sol ou antes de recolher-se</p>

<h4>Ingredientes:</h4>
<ul>
  <li>1 punhado de Ervas Frescas/Secas</li>
  <li>2 litros de água de fonte ou mineral</li>
  <li>1 pitada de sal marinho grosso</li>
</ul>

<h4>Modo de Preparo:</h4>
<ol>
  <li>Aqueça a água até levantar fervura e desligue o fogo.</li>
  <li>Adicione as ervas enquanto profere suas intenções e preces.</li>
  <li>Abafe o recipiente por 15 minutos até a água atingir temperatura agradável.</li>
  <li>Coar e despejar do pescoço para baixo após o banho higiênico habitual.</li>
</ol>
<blockquote>"Que as águas e as folhas levem toda vibração densa e restaurem o brilho da aura."</blockquote>
`.trim();
    } else if (type === 'defumacao') {
      template = `
<h3>Ritual de Defumação & Purificação Áurica</h3>
<p><strong>Elemento Ativador:</strong> Ar & Fogo</p>

<h4>Passos para Limpeza de Ambientes:</h4>
<ol>
  <li>Acenda a ponta do bastão de ervas ou resina sobre a chama de uma vela natural.</li>
  <li>Deixe que a brasa se firme e assopre suavemente até surgir a fumaça sagrada.</li>
  <li>Percorra os cômodos do fundo da casa em direção à porta de entrada.</li>
  <li>Mantenha janelas abertas para que a energia estagnada circule e saia.</li>
</ol>
<blockquote>"Fumaça sagrada eleva a oração, purifica o espaço e consagra a paz."</blockquote>
`.trim();
    } else if (type === 'oleo') {
      template = `
<h3>Processo de Infusão & Extração do Óleo Botânico</h3>
<p><strong>Método:</strong> Maceração a frio por 28 dias em óleo vegetal carreador (Jojoba / Rosa Mosqueta).</p>

<h4>Consagração & Uso Tópico:</h4>
<ul>
  <li><strong>Aplicação:</strong> 3 a 5 gotas na palma das mãos aquecidas.</li>
  <li><strong>Centros Energéticos:</strong> Pulso, têmporas e chakra cardíaco.</li>
  <li><strong>Ação epidérmica:</strong> Nutrição profunda, maciez e regeneração celular.</li>
</ul>
`.trim();
    } else {
      template = `
<h3>Propriedades Alquímicas & Tradição Ancestral</h3>
<p>Utilizada desde a antiguidade em unguentos e infusões medicinais.</p>

<h4>Modo de Uso Sugerido:</h4>
<ul>
  <li><strong>Infusão Terapêutica:</strong> 1 colher de chá por xícara de água aquecida.</li>
  <li><strong>Infusão Vibracional:</strong> Harmonização de ambientes e altares.</li>
</ul>
`.trim();
    }

    if (value && value.trim()) {
      onChange(value + '\n\n' + template);
    } else {
      onChange(template);
    }
  };

  return (
    <div className="border border-[#E2D9C8] rounded-2xl bg-white overflow-hidden shadow-xs space-y-0 text-xs font-sans">
      
      {/* Formatting & Controls Bar */}
      <div className="bg-[#FAF7F2] p-2.5 border-b border-[#E2D9C8] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTextAtCursor('<strong>', '</strong>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] font-bold border border-transparent hover:border-[#E2D9C8]"
            title="Negrito"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor('<em>', '</em>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] italic border border-transparent hover:border-[#E2D9C8]"
            title="Itálico"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#E2D9C8] mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor('<h3>', '</h3>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] font-serif font-bold border border-transparent hover:border-[#E2D9C8]"
            title="Título H3"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor('<h4>', '</h4>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] font-serif border border-transparent hover:border-[#E2D9C8]"
            title="Subtítulo H4"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#E2D9C8] mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] border border-transparent hover:border-[#E2D9C8]"
            title="Lista com Marcadores"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor('<ol>\n  <li>', '</li>\n</ol>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] border border-transparent hover:border-[#E2D9C8]"
            title="Lista Numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor('<blockquote>"', '"</blockquote>')}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] border border-transparent hover:border-[#E2D9C8]"
            title="Citação Alquímica"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#E2D9C8] mx-1" />

          <button
            type="button"
            onClick={() => {
              const url = prompt('Digite a URL da imagem:');
              if (url) insertTextAtCursor(`<img src="${url}" alt="Imagem Alquímica" class="w-full my-3 rounded-2xl border border-[#E2D9C8]" />`);
            }}
            className="p-1.5 rounded-lg hover:bg-white text-[#14281D] border border-transparent hover:border-[#E2D9C8]"
            title="Inserir Imagem"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Templates Quick Insert dropdown / buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#8C7A5B] uppercase hidden sm:inline">Templates:</span>
          <button
            type="button"
            onClick={() => handleInsertTemplate('banho')}
            className="px-2 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-1"
            title="Inserir Template de Banho"
          >
            <Droplet className="w-3 h-3 text-blue-600" />
            <span>Banho</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertTemplate('defumacao')}
            className="px-2 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-bold text-[10px] flex items-center gap-1"
            title="Inserir Template de Defumação"
          >
            <Flame className="w-3 h-3 text-amber-600" />
            <span>Defumação</span>
          </button>

          <button
            type="button"
            onClick={() => handleInsertTemplate('oleo')}
            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1"
            title="Inserir Template de Óleo"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Óleo</span>
          </button>

          <div className="h-4 w-px bg-[#E2D9C8] mx-1" />

          {/* Editor Mode Toggle */}
          <div className="flex items-center bg-white border border-[#E2D9C8] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setActiveMode('editor')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${
                activeMode === 'editor' ? 'bg-[#14281D] text-[#FAF7F2]' : 'text-[#718096] hover:text-[#14281D]'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${
                activeMode === 'preview' ? 'bg-[#14281D] text-[#FAF7F2]' : 'text-[#718096] hover:text-[#14281D]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Input / Preview Container */}
      {activeMode === 'editor' ? (
        <textarea
          id="rich-text-textarea"
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 font-mono text-xs text-[#14281D] bg-white focus:outline-none resize-y leading-relaxed"
        />
      ) : (
        <div className="p-6 bg-[#FAF7F2]/40 min-h-[220px] prose prose-sm max-w-none text-[#14281D]">
          {value ? (
            <div
              className="space-y-3 font-sans text-xs leading-relaxed [&_h3]:font-serif [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#14281D] [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-[#C5A059] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C5A059] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[#718096]"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <p className="text-[#8C7A5B] italic text-xs">Nenhum conteúdo rico digitado até o momento.</p>
          )}
        </div>
      )}

    </div>
  );
};
