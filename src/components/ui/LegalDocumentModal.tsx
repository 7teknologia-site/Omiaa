import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Printer, Download, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { getSavedLegalDocuments } from '../../utils/complianceStorage';
import { LegalDocument, LegalDocumentId } from '../../types/compliance';

export const LegalDocumentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    const handleOpenDocument = (e: CustomEvent<{ documentId: LegalDocumentId }>) => {
      const docs = getSavedLegalDocuments();
      const doc = docs.find((d) => d.id === e.detail.documentId) || docs[0];
      if (doc) {
        setSelectedDoc(doc);
        setIsOpen(true);
      }
    };

    window.addEventListener('omiaa_open_legal_document' as any, handleOpenDocument);
    return () => {
      window.removeEventListener('omiaa_open_legal_document' as any, handleOpenDocument);
    };
  }, []);

  if (!isOpen || !selectedDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FAF7F2] border border-[#D8C7B5] shadow-2xl rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col text-[#2A2421] overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-none"
        >
          {/* HEADER */}
          <div className="p-5 md:p-6 bg-[#EFE8DC] border-b border-[#D8C7B5] flex items-center justify-between shrink-0 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A2421] text-[#D4AF37] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg font-bold text-[#2A2421]">
                    {selectedDoc.title}
                  </h2>
                  <span className="text-[10px] bg-[#2A2421] text-[#D4AF37] font-mono font-medium px-2 py-0.5 rounded-full">
                    v{selectedDoc.version}
                  </span>
                </div>
                <p className="text-xs text-[#6B5748] mt-0.5">
                  Omiaá Alquimia Ancestral • Documento Oficial Vigente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 text-[#5C4D42] hover:bg-[#D8C7B5]/40 rounded-xl transition-colors"
                title="Imprimir documento"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#5C4D42] hover:bg-[#D8C7B5]/40 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* META BAR */}
          <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#E8DCCF] flex items-center justify-between text-xs text-[#7A6251] shrink-0 print:hidden">
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#8B5A2B]" />
              Última atualização: {new Date(selectedDoc.updatedAt).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Publicado e em Conformidade com a LGPD
            </span>
          </div>

          {/* DOCUMENT BODY */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-sm text-[#382E2B] leading-relaxed font-sans select-text">
            <div
              className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#2A2421] prose-h2:text-base prose-h2:font-bold prose-h2:border-b prose-h2:border-[#E8DCCF] prose-h2:pb-1.5 prose-h2:mt-6 prose-p:text-xs prose-p:md:text-sm prose-li:text-xs prose-li:md:text-sm"
              dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
            />
          </div>

          {/* FOOTER */}
          <div className="p-4 bg-[#EFE8DC] border-t border-[#D8C7B5] flex items-center justify-between text-xs text-[#6B5748] shrink-0 print:hidden">
            <span className="font-mono text-[11px]">
              Dúvidas Jurídicas? dpo@omiaa.com.br
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 rounded-xl bg-[#2A2421] text-[#FAF7F2] hover:bg-[#423833] font-semibold text-xs transition-all shadow-md"
            >
              Entendido e Ciente
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
