import React from 'react';
import { User, Mail, ShieldAlert, Phone, LogIn, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

interface StepIdentificationProps {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerEmail: string;
  setCustomerEmail: (v: string) => void;
  customerCpf: string;
  setCustomerCpf: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  errors: Record<string, string>;
  handleNextStep: () => void;
}

export const StepIdentification: React.FC<StepIdentificationProps> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerCpf,
  setCustomerCpf,
  customerPhone,
  setCustomerPhone,
  errors,
  handleNextStep
}) => {
  const { user, authSession, setViewMode } = useShop();
  const isAuthenticated = Boolean(authSession?.user);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs font-sans">
      
      {/* Header */}
      <div className="border-b border-[#E2D9C8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
            <User className="w-5 h-5 text-[#C5A059]" />
            <span>Passo 1: Login / Identificação</span>
          </h2>
          <p className="text-xs text-[#718096] mt-1">
            {isAuthenticated
              ? 'Confirme seus dados para continuar o pedido.'
              : 'O checkout exige que você esteja autenticado na sua conta OMIAÁ.'}
          </p>
        </div>
      </div>

      {/* Unauthenticated Alert Banner */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-900">
          <div className="flex items-start gap-3">
            <LogIn className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-[#14281D]">Autenticação Necessária</p>
              <p className="text-[#718096] text-xs">
                Para finalizar sua compra, entre na sua conta ou cadastre-se. Seu carrinho permanecerá salvo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('account')}
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            Entrar / Cadastrar
          </button>
        </div>
      )}

      {/* Authenticated Status Badge */}
      {isAuthenticated && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Identificado como <strong>{user?.name || authSession.user.email}</strong> ({authSession.user.email})</span>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ex: Maria Silva Sagrada"
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
          {errors.customerName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.customerName}</p>}
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            E-mail para Rastreio *
          </label>
          <div className="relative">
            <input
              type="email"
              value={authSession?.user?.email || customerEmail}
              readOnly={isAuthenticated}
              onChange={(e) => !isAuthenticated && setCustomerEmail(e.target.value)}
              placeholder="maria@alquimia.com"
              className={`w-full border rounded-xl pl-9 pr-3 py-3 font-semibold focus:outline-none ${
                isAuthenticated
                  ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-[#FAF7F2] border-[#E2D9C8] text-[#14281D] focus:border-[#C5A059]'
              }`}
            />
            <Mail className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.customerEmail && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.customerEmail}</p>}
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            CPF (Nota Fiscal) *
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerCpf}
              onChange={(e) => setCustomerCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-9 pr-3 py-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            <ShieldAlert className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.customerCpf && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.customerCpf}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Telefone / WhatsApp
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-9 pr-3 py-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            <Phone className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E2D9C8] flex justify-end">
        <button
          type="button"
          onClick={handleNextStep}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md min-h-[44px]"
        >
          Avançar para Endereço
        </button>
      </div>
    </div>
  );
};

