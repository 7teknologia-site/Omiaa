import React, { useState } from 'react';
import { MessageCircle, X, Send, Copy, Check, Sparkles } from 'lucide-react';
import { CustomFragrance } from '../../../types';

interface WhatsAppNotifierModalProps {
  fragrance: CustomFragrance;
  isOpen: boolean;
  onClose: () => void;
  onSendToast?: (msg: string) => void;
}

export const WhatsAppNotifierModal: React.FC<WhatsAppNotifierModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSendToast
}) => {
  const [copied, setCopied] = useState(false);
  const phoneClean = (fragrance.customerPhone || '+5511987654321').replace(/\D/g, '');

  const defaultMessages: Record<string, string> = {
    solicitado: `✨ *OMIAA Alquimia Ancestral - Solicitação de Fragrância Exclusiva*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nRecebemos a sua solicitação para o perfume *${fragrance.name}* (Lote: ${fragrance.batchNumber || 'OMIAA-CUSTOM'}).\n\nPróximo passo: Agendamento da sua Sessão Olfativa com nosso Mestre Perfumista.\n\nDúvidas? Responda a esta mensagem.`,
    agendado: `🌿 *OMIAA Alquimia Ancestral - Agendamento Confirmado*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nSua consulta olfativa para a criação de *${fragrance.name}* está confirmada!\n\n📅 Data: ${fragrance.appointment?.date || 'A combinar'}\n⏰ Horário: ${fragrance.appointment?.time || '14:00'}\n👤 Perfumista: ${fragrance.appointment?.perfumer || 'Gabriel Alquimista'}\n📍 Modalidade: ${fragrance.appointment?.type === 'presencial' ? 'Presencial no Atelier OMIAA' : 'Sessão Virtual via Vídeo'}\n\nAguardamos você com muita alegria e aromas sagrados.`,
    analise_olfativa: `🧪 *OMIAA Alquimia Ancestral - Análise Olfativa em Andamento*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nSua pirâmide olfativa para *${fragrance.name}* foi aprovada pelo perfumista.\n\n*Notas de Saída:* ${fragrance.topNotes.join(', ')}\n*Notas de Coração:* ${fragrance.heartNotes.join(', ')}\n*Notas de Fundo:* ${fragrance.baseNotes.join(', ')}\n\nEstamos preparando a almotolia para início do ciclo de maceração.`,
    macerando: `🌕 *OMIAA Alquimia Ancestral - Início da Maceração (28 Dias)*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nA sua fragrância personalizada *${fragrance.name}* entrou hoje no alambique solar para maceração alquímica.\n\n⏱ Tempo restante de maturação: *${fragrance.macerationDaysRemaining ?? 28} dias*\n\nVocê pode acompanhar o progresso em tempo real na sua Área do Cliente em nosso site!`,
    envasado: `🏺 *OMIAA Alquimia Ancestral - Fragrância Envasada & Pronta!*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nA maceração do seu perfume *${fragrance.name}* foi concluída com sucesso! A fórmula foi filtrada e envasada no frasco de ${fragrance.bottleSize} com gravação especial.\n\nSua relíquia botânica está pronta para envio/retirada!`,
    enviado: `📦 *OMIAA Alquimia Ancestral - Fragrância Enviada com Carinho*\n\nOlá, *${fragrance.customerName || 'Cliente'}*!\nSeu perfume *${fragrance.name}* já está a caminho do seu altar pessoal.\n\nAcompanhe o rastreio e prepare seu ambiente para o ritual de abertura do frasco.`
  };

  const [message, setMessage] = useState(
    defaultMessages[fragrance.status || 'solicitado'] || defaultMessages.solicitado
  );

  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2D9C8] max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C7A5B] hover:text-[#14281D] p-2 rounded-full hover:bg-[#E2D9C8]/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#14281D]">
              Notificação via WhatsApp
            </h3>
            <p className="text-xs text-[#718096]">
              Destinatário: {fragrance.customerName} ({fragrance.customerPhone || 'Sem telefone'})
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#14281D] uppercase tracking-wider">
            Mensagem Personalizada Automática
          </label>
          <textarea
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-[#E2D9C8] rounded-2xl p-3 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059] font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="flex-1 bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/30 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#8C7A5B]" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (onSendToast) onSendToast('Redirecionando para o WhatsApp...');
              onClose();
            }}
            className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Abrir no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
