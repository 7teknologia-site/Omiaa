import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0 font-sans">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#14281D] text-[#FAF7F2] border border-[#C5A059]/40 shadow-2xl backdrop-blur-md"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
              {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold tracking-wider uppercase text-[#FAF7F2]">{toast.title}</h4>
              {toast.desc && <p className="text-xs text-[#A8B2A6] mt-0.5 leading-relaxed">{toast.desc}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

