import React, { useState } from 'react';
import {
  Package,
  Heart,
  MapPin,
  Award,
  Sparkles,
  Truck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../store/ProductCard';

export const AccountView: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    setViewMode,
    setSelectedProductId
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address' | 'loyalty'>('orders');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-[#14281D] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#C5A059]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#C5A059] text-[#14281D] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#FAF7F2] shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/20 text-[#C5A059] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#C5A059]/40 mb-1 font-sans">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              Nível: {user.tier}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">{user.name}</h1>
            <p className="text-xs text-[#A8B2A6] mt-0.5 font-sans">{user.email} • {user.phone}</p>
          </div>
        </div>

        {/* Loyalty Points Badge */}
        <div className="bg-[#0D1C14] p-4 rounded-2xl border border-[#C5A059]/30 text-center space-y-1 min-w-[160px] font-sans">
          <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
            Pontos de Alquimia
          </span>
          <span className="font-serif text-3xl font-bold text-[#FAF7F2]">
            {user.loyaltyPoints} pts
          </span>
          <span className="text-[10px] text-[#A8B2A6] block">
            Resgatável em cupons
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#E2D9C8] text-xs font-bold uppercase tracking-wider overflow-x-auto pb-1 gap-2 font-sans">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all ${
            activeTab === 'orders'
              ? 'bg-white border-t-2 border-x border-[#E2D9C8] text-[#14281D] font-bold'
              : 'text-[#718096] hover:text-[#14281D]'
          }`}
        >
          <Package className="w-4 h-4 text-[#C5A059]" />
          <span>Meus Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all ${
            activeTab === 'wishlist'
              ? 'bg-white border-t-2 border-x border-[#E2D9C8] text-[#14281D] font-bold'
              : 'text-[#718096] hover:text-[#14281D]'
          }`}
        >
          <Heart className="w-4 h-4 text-[#C86D51]" />
          <span>Lista de Desejos ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all ${
            activeTab === 'address'
              ? 'bg-white border-t-2 border-x border-[#E2D9C8] text-[#14281D] font-bold'
              : 'text-[#718096] hover:text-[#14281D]'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#C5A059]" />
          <span>Endereços Salvos</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all ${
            activeTab === 'loyalty'
              ? 'bg-white border-t-2 border-x border-[#E2D9C8] text-[#14281D] font-bold'
              : 'text-[#718096] hover:text-[#14281D]'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Clube Alquimista</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-4 font-sans">
          {orders.length > 0 ? (
            orders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-3xl border border-[#E2D9C8] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D9C8] pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#14281D]">{ord.code}</span>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {ord.status === 'enviado' ? 'Em Trânsito' : ord.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Realizado em {new Date(ord.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block uppercase font-bold">Valor Total</span>
                    <span className="font-serif font-bold text-lg text-[#14281D]">
                      R$ {ord.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {ord.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs bg-[#FAF7F2] p-3 rounded-2xl border border-[#E2D9C8]">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-white border border-[#E2D9C8]" />
                        <div>
                          <span className="font-bold text-[#14281D] block">{product.name}</span>
                          <span className="text-[10px] text-gray-500">Qtd: {quantity} • {product.volumeOrWeight}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setViewMode('product-detail');
                        }}
                        className="text-xs font-bold text-[#8C7A5B] hover:text-[#14281D] underline transition-colors"
                      >
                        Comprar Novamente
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tracking Code bar */}
                {ord.trackingCode && (
                  <div className="bg-[#14281D] text-[#FAF7F2] p-3.5 rounded-2xl text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#C5A059]" />
                      <span>Rastreamento Correios/Jadlog: <strong className="font-mono text-[#C5A059]">{ord.trackingCode}</strong></span>
                    </div>
                    <span className="text-[10px] text-[#A8B2A6]">Status: Objeto encaminhado</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E2D9C8] text-center space-y-3">
              <p className="text-xs text-gray-500">Você ainda não realizou pedidos na Apotheca.</p>
              <button
                onClick={() => setViewMode('catalog')}
                className="bg-[#14281D] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
              >
                Explorar Coleção
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="font-sans">
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E2D9C8] text-center space-y-3">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">Sua lista de desejos está vazia.</p>
              <button
                onClick={() => setViewMode('catalog')}
                className="bg-[#14281D] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
              >
                Descobrir Elixires
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'address' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {user.addresses.map((addr, i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#E2D9C8] p-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#14281D] uppercase">
                <span>Endereço Principal</span>
                <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Padrão</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}<br />
                {addr.neighborhood} — {addr.city} / {addr.state}<br />
                CEP: {addr.cep}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="bg-white rounded-3xl border border-[#E2D9C8] p-8 space-y-6 font-sans">
          <div className="max-w-xl space-y-2">
            <h3 className="font-serif text-3xl font-bold text-[#14281D]">
              Programa Círculo de Alquimistas
            </h3>
            <p className="text-xs text-[#5A6578] leading-relaxed">
              A cada R$ 1,00 investido em seu bem-estar na OMIAÁ, você acumula 1 Ponto Alquímico para resgatar em cupons exclusivos e frascos de edição limitada nas fases de Lua Cheia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] space-y-2">
              <span className="font-bold text-[#14281D] block">Neófito (0 - 200 pts)</span>
              <p className="text-gray-500 text-[11px]">Acesso antecipado a lançamentos e newsletters secretas.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#14281D] text-[#FAF7F2] border border-[#C5A059] space-y-2 shadow-md">
              <div className="flex justify-between items-center">
                <span className="font-bold block text-[#C5A059]">Iniciado (201 - 800 pts)</span>
                <span className="text-[10px] bg-[#C5A059] text-[#14281D] px-2 py-0.5 rounded-full font-bold">Seu Nível</span>
              </div>
              <p className="text-[#A8B2A6] text-[11px]">10% OFF em todas as compras e frete grátis sem valor mínimo.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] space-y-2">
              <span className="font-bold text-[#14281D] block">Mestre Alquimista (800+ pts)</span>
              <p className="text-gray-500 text-[11px]">Convite para rituais presenciais e consulta individual de anamnese botânica.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

