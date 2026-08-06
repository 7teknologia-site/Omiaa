import React, { useState } from 'react';
import { User, PackageCheck, MapPin, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AccountProfile } from './AccountProfile';
import { AccountOrders } from './AccountOrders';
import { AccountAddresses } from './AccountAddresses';

export const AccountView: React.FC = () => {
  const { user, orders, setViewMode } = useShop();
  const [tab, setTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
        <button
          onClick={() => setViewMode('catalog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          Voltar para o Catálogo
        </button>

        <h1 className="font-serif text-2xl font-bold text-[#14281D]">
          Sua Conta Alquímica
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#E2D9C8] pb-2 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setTab('profile')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            tab === 'profile' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Pontos</span>
        </button>

        <button
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            tab === 'orders' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Meus Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setTab('addresses')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            tab === 'addresses' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-[#718096]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Endereços</span>
        </button>
      </div>

      {/* View Content */}
      {tab === 'profile' && <AccountProfile user={user} />}
      {tab === 'orders' && <AccountOrders orders={orders} />}
      {tab === 'addresses' && <AccountAddresses addresses={user.addresses} />}

    </div>
  );
};
