import React, { useState } from 'react';
import { Mail, X, Send, CheckCircle, Eye } from 'lucide-react';
import { CustomFragrance } from '../../../types';

interface EmailNotifierModalProps {
  fragrance: CustomFragrance;
  isOpen: boolean;
  onClose: () => void;
  onSendToast?: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const EmailNotifierModal: React.FC<EmailNotifierModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSendToast
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const subjectMap: Record<string, string> = {
    solicitado: `✨ Solicitação Confirmada: ${fragrance.name} | OMIAA Alquimia Ancestral`,
    agendado: `📅 Agendamento de Consulta Olfativa: ${fragrance.name}`,
    analise_olfativa: `🧪 Sua Pirâmide Olfativa foi Aprovada - ${fragrance.name}`,
    macerando: `🌕 Ciclo de Maceração Iniciado (28 Dias) - ${fragrance.name}`,
    envasado: `🏺 Fragrância Envasada com Sucesso - ${fragrance.name}`,
    enviado: `📦 Seu Perfume Ritual Foi Enviado - ${fragrance.name}`
  };

  const subject = subjectMap[fragrance.status || 'solicitado'] || `Atualização da sua Fragrância Customizada ${fragrance.name}`;

  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      if (onSendToast) {
        onSendToast(
          'E-mail Disparado!',
          `Notificação enviada com sucesso para ${fragrance.customerEmail || 'cliente@omiaa.com.br'}.`,
          'success'
        );
      }
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2D9C8] max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C7A5B] hover:text-[#14281D] p-2 rounded-full hover:bg-[#E2D9C8]/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#E2D9C8] pb-4">
          <div className="w-10 h-10 bg-[#14281D] text-[#C5A059] rounded-2xl flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#14281D]">
              Disparo de Notificação por E-mail
            </h3>
            <p className="text-xs text-[#718096]">
              Destinatário: <span className="font-bold text-[#14281D]">{fragrance.customerEmail || 'cliente@omiaa.com.br'}</span>
            </p>
          </div>
        </div>

        {/* Email Header info */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2D9C8] space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Assunto</span>
            <span className="font-bold text-[#14281D]">{subject}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8C7A5B] uppercase block">Remetente</span>
            <span className="text-[#14281D]">atelier@omiaa.com.br (OMIAA Alquimia Ancestral)</span>
          </div>
        </div>

        {/* Rendered Email Template Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#14281D] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#C5A059]" />
              <span>Pré-visualização do Template HTML</span>
            </label>
          </div>

          <div className="bg-white border border-[#E2D9C8] rounded-2xl p-6 space-y-6 shadow-inner text-xs font-sans text-[#14281D]">
            {/* Template Header */}
            <div className="text-center border-b border-[#E2D9C8] pb-4 space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase block">OMIAA ALQUIMIA ANCESTRAL</span>
              <h2 className="font-serif text-xl font-bold text-[#14281D]">Alquimia de Fragrâncias Exclusivas</h2>
            </div>

            {/* Body */}
            <div className="space-y-3 leading-relaxed">
              <p>Olá, <strong>{fragrance.customerName || 'Cliente Estimado(a)'}</strong>,</p>

              <p>
                É com imensa honra que informamos o status atual da sua fórmula artesanal <strong>"{fragrance.name}"</strong> (Lote: <code>{fragrance.batchNumber || 'OMIAA-001'}</code>).
              </p>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] space-y-2">
                <div className="flex justify-between items-center border-b border-[#E2D9C8] pb-2">
                  <span className="font-bold text-[#8C7A5B]">Status da Criação</span>
                  <span className="uppercase font-bold text-[#14281D] bg-[#C5A059]/20 px-2 py-0.5 rounded-lg text-[10px]">
                    {fragrance.status?.toUpperCase() || 'EM ANDAMENTO'}
                  </span>
                </div>
                <p><strong>Frasco:</strong> {fragrance.bottleSize}</p>
                <p><strong>Intenção Ritual:</strong> {fragrance.intention}</p>
                <p><strong>Notas de Saída:</strong> {fragrance.topNotes.join(', ')}</p>
                <p><strong>Notas de Coração:</strong> {fragrance.heartNotes.join(', ')}</p>
                <p><strong>Notas de Fundo:</strong> {fragrance.baseNotes.join(', ')}</p>

                {fragrance.alchemistNotes && (
                  <p className="pt-2 text-[#8C7A5B] italic border-t border-[#E2D9C8]">
                    Nota do Perfumista: "{fragrance.alchemistNotes}"
                  </p>
                )}
              </div>

              <p className="text-[#718096] text-[11px]">
                Acompanhe todo o processo de maturação e agendamento diretamente na sua Área do Cliente em nosso site.
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-[#E2D9C8] text-[10px] text-[#8C7A5B] space-y-1">
              <p>© 2026 OMIAA Alquimia Ancestral — Perfumaria Botânica & Sagrada</p>
              <p>Atelier OMIAA, São Paulo / SP • contato@omiaa.com.br</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="bg-white border border-[#E2D9C8] text-[#14281D] hover:bg-[#E2D9C8]/30 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider"
          >
            Cancelar
          </button>

          <button
            onClick={handleSendEmail}
            disabled={isSending || sentSuccess}
            type="button"
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {sentSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>E-mail Enviado!</span>
              </>
            ) : isSending ? (
              <span>Enviando e-mail...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Confirmar & Disparar E-mail</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
