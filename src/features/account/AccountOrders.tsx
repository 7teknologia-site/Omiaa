import React from 'react';
import { PackageCheck, Truck } from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AccountOrdersProps {
  orders: Order[];
}

export const AccountOrders: React.FC<AccountOrdersProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#E2D9C8] text-center space-y-2 font-sans">
        <PackageCheck className="w-10 h-10 text-[#E2D9C8] mx-auto" />
        <h3 className="font-serif font-bold text-base text-[#14281D]">Você ainda não realizou pedidos</h3>
        <p className="text-xs text-[#718096]">Seus rituais adquiridos aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2D9C8] pb-3 gap-2">
            <div>
              <span className="font-serif font-bold text-base text-[#14281D]">Pedido #{order.code}</span>
              <span className="text-[10px] text-[#8C7A5B] block">{formatDate(order.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                {order.status}
              </span>
              <span className="font-serif font-bold text-sm text-[#14281D]">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#FAF7F2] rounded-xl border border-[#E2D9C8]">
                <div className="flex items-center gap-3">
                  <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                  <div>
                    <h4 className="font-serif font-bold text-[#14281D]">{item.product.name}</h4>
                    <span className="text-[10px] text-[#718096]">Qtd: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-serif font-bold text-[#14281D]">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {order.trackingCode && (
            <div className="flex items-center gap-2 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E2D9C8] text-[#8C7A5B]">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Rastreio: <strong className="font-mono text-[#14281D]">{order.trackingCode}</strong></span>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};
