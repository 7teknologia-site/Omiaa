import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Package, ShoppingBag, Users, Tag, Shield, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AdminSearchItem, ADMIN_NAVIGATION_MODULES } from '../../types/adminNav';

export interface AdminGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchItems?: AdminSearchItem[];
  onSelectSubItem?: (moduleId: string, subItemId: string) => void;
  onSelectResult?: (moduleId: string, subItemId: string) => void;
}

export const AdminGlobalSearchModal: React.FC<AdminGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  searchItems,
  onSelectSubItem,
  onSelectResult
}) => {
  const { products, orders } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (modId: string, subId: string) => {
    if (onSelectResult) onSelectResult(modId, subId);
    if (onSelectSubItem) onSelectSubItem(modId, subId);
    onClose();
  };

  const defaultSearchItems: AdminSearchItem[] = searchItems || ADMIN_NAVIGATION_MODULES.flatMap((m) =>
    m.subItems.map((s) => ({
      moduleId: m.id,
      moduleLabel: m.label,
      subItemId: s.id,
      subItemLabel: s.label,
      description: s.description || '',
      keywords: s.keywords || [],
      icon: s.icon
    }))
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search through submodules
  const matchedNav = defaultSearchItems.filter(
    (item) =>
      item.moduleLabel.toLowerCase().includes(q) ||
      item.subItemLabel.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
  );

  // Search through products
  const matchedProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  // Search through orders
  const matchedOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.code?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-[#14281D]/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#E2D9C8] flex items-center gap-3 sticky top-0 z-10">
          <Search className="w-5 h-5 text-[#C5A059]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por módulos, produtos, pedidos, clientes ou ações..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#14281D] placeholder-[#8C7A5B]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8C7A5B] hover:text-[#14281D] rounded-full hover:bg-[#FAF7F2]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-[#8C7A5B] hover:text-[#14281D] bg-[#FAF7F2] border border-[#E2D9C8] rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Menu & Navigation items */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] mb-2 px-2 flex items-center justify-between">
              <span>Módulos & Telas do Sistema</span>
              <span className="font-mono">{matchedNav.length} encontrados</span>
            </div>

            {matchedNav.length === 0 ? (
              <p className="text-xs text-[#8C7A5B] italic px-2 py-3">Nenhum módulo encontrado com "{query}"</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedNav.slice(0, 8).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={`${item.moduleId}-${item.subItemId}`}
                      onClick={() => handleSelect(item.moduleId, item.subItemId)}
                      className="flex items-center gap-3 p-3 bg-white hover:bg-[#14281D] group rounded-2xl border border-[#E2D9C8] transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] group-hover:bg-[#2C4837] flex items-center justify-center text-[#C5A059] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#14281D] group-hover:text-white truncate">
                          {item.subItemLabel}
                        </p>
                        <p className="text-[10px] text-[#8C7A5B] group-hover:text-[#A8B2A6] truncate">
                          {item.moduleLabel}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C7A5B] group-hover:text-[#C5A059] shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products match */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] mb-2 px-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Produtos Relacionados ({matchedProducts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectSubItem('products', 'products-list');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] rounded-xl border border-[#E2D9C8] text-left transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.images?.[0]} alt={p.name} className="w-7 h-7 object-cover rounded-lg border border-[#E2D9C8]" />
                      <div>
                        <p className="text-xs font-bold text-[#14281D]">{p.name}</p>
                        <p className="text-[10px] text-[#8C7A5B]">{p.category} • R$ {p.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#C5A059] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2D9C8]">
                      Ver no Estoque
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders match */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B] mb-2 px-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Pedidos Relacionados ({matchedOrders.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onSelectSubItem('orders', 'orders-list');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-[#FAF7F2] rounded-xl border border-[#E2D9C8] text-left transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#14281D]">{o.code || o.id} — {o.customerName}</p>
                      <p className="text-[10px] text-[#8C7A5B]">{o.date} • Total R$ {o.total.toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#14281D] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E2D9C8]">
                      {o.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-white border-t border-[#E2D9C8] flex items-center justify-between text-[11px] text-[#8C7A5B]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Navegação Rápida Global OMIAA ERP</span>
          </div>
          <span>Use <strong>⌘K</strong> ou <strong>Ctrl+K</strong> a qualquer momento</span>
        </div>
      </div>
    </div>
  );
};
