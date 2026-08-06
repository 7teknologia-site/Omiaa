import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Address } from '../../types';

interface AccountAddressesProps {
  addresses: Address[];
}

export const AccountAddresses: React.FC<AccountAddressesProps> = ({ addresses }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <h3 className="font-serif font-bold text-lg text-[#14281D]">Endereços Cadastrados</h3>
        <button className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Endereço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-[#E2D9C8] space-y-2 shadow-xs text-xs">
            <div className="flex items-center gap-2 font-bold text-[#14281D]">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Endereço Principal</span>
            </div>
            <p className="font-semibold text-[#14281D]">{addr.street}, {addr.number} {addr.complement}</p>
            <p className="text-[#718096]">{addr.neighborhood} • {addr.city}/{addr.state}</p>
            <p className="text-[#8C7A5B]">CEP: {addr.cep}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
