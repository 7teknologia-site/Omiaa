import React from 'react';
import { MapPin, Search } from 'lucide-react';
import { Address } from '../../../types';

interface StepAddressProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  isLoadingCep: boolean;
  handleCepLookup: () => void;
  errors: Record<string, string>;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

export const StepAddress: React.FC<StepAddressProps> = ({
  address,
  setAddress,
  isLoadingCep,
  handleCepLookup,
  errors,
  handleNextStep,
  handlePrevStep
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] space-y-6 shadow-xs">
      <div className="border-b border-[#E2D9C8] pb-4">
        <h2 className="font-serif text-xl font-bold text-[#14281D] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#C5A059]" />
          <span>Passo 2: Endereço de Entrega</span>
        </h2>
        <p className="text-xs text-[#718096] mt-1">
          Digite seu CEP para preenchimento automático da sua localização.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            CEP *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address.cep}
              onChange={(e) => setAddress((prev) => ({ ...prev, cep: e.target.value }))}
              placeholder="00000-000"
              className="flex-1 bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="button"
              onClick={handleCepLookup}
              disabled={isLoadingCep}
              className="bg-[#14281D] text-[#FAF7F2] px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#C5A059] hover:text-[#14281D] transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          {errors.cep && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cep}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Rua / Logradouro *
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
          {errors.street && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.street}</p>}
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Número *
          </label>
          <input
            type="text"
            value={address.number}
            onChange={(e) => setAddress((prev) => ({ ...prev, number: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
          {errors.number && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.number}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Complemento
          </label>
          <input
            type="text"
            value={address.complement || ''}
            onChange={(e) => setAddress((prev) => ({ ...prev, complement: e.target.value }))}
            placeholder="Apto, Bloco, Casa..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Bairro *
          </label>
          <input
            type="text"
            value={address.neighborhood}
            onChange={(e) => setAddress((prev) => ({ ...prev, neighborhood: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
          {errors.neighborhood && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.neighborhood}</p>}
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            Cidade *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
          />
          {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">
            UF *
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold uppercase focus:outline-none focus:border-[#C5A059]"
          />
          {errors.state && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.state}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
        <button
          onClick={handlePrevStep}
          className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider"
        >
          Voltar
        </button>

        <button
          onClick={handleNextStep}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
        >
          Avançar para Frete
        </button>
      </div>
    </div>
  );
};
