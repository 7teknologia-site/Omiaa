import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  X,
  FileText,
  Mail,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from './utils/csvExporter';
import { ErpPagination } from './components/ErpPagination';
import { useShop } from '../../context/ShopContext';

interface AdminOrdersERPProps {
  orders: Order[];
}

export const AdminOrdersERP: React.FC<AdminOrdersERPProps> = ({ orders: initialOrders }) => {
  const { showToast } = useShop();
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer / Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const matchesSearch =
        order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.trackingCode || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'todos' || order.status === selectedStatus;
      const matchesPayment = selectedPaymentMethod === 'todos' || order.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [ordersList, searchQuery, selectedStatus, selectedPaymentMethod]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast('Status do Pedido Atualizado', `Pedido #${ordersList.find((o) => o.id === orderId)?.code} marcado como ${newStatus}.`, 'success');
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredOrders,
      [
        { key: 'code', label: 'Código Pedido' },
        { key: 'customerName', label: 'Cliente' },
        { key: 'customerEmail', label: 'E-mail' },
        { key: 'customerPhone', label: 'Telefone' },
        { key: 'date', label: 'Data' },
        { key: 'status', label: 'Status' },
        { key: 'paymentMethod', label: 'Forma de Pagamento' },
        { key: 'total', label: 'Total (R$)' },
        { key: 'trackingCode', label: 'Código de Rastreio' }
      ],
      'Pedidos_OMIAA_Alquimia_Ancestral'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
            <span>Gestão de Pedidos ({filteredOrders.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Acompanhe a emissão de pedidos, altere o status de expedição e acesse detalhes do comprador.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por código #OMIA, cliente ou e-mail..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <Filter className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="em_preparo">Em Preparo</option>
            <option value="enviado">Enviado aos Correios</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <CreditCard className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={selectedPaymentMethod}
            onChange={(e) => {
              setSelectedPaymentMethod(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas as Formas de Pagamento</option>
            <option value="pix">PIX Instantâneo</option>
            <option value="credit_card">Cartão de Crédito</option>
            <option value="boleto">Boleto Bancário</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[#8C7A5B] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Pedido</th>
                <th className="py-3.5 px-3">Cliente</th>
                <th className="py-3.5 px-3">Data</th>
                <th className="py-3.5 px-3">Pagamento</th>
                <th className="py-3.5 px-3">Total</th>
                <th className="py-3.5 px-3">Status Atual</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9C8]/60">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#718096]">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#14281D]">
                      #{order.code}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#14281D] block">{order.customerName || 'Cliente'}</span>
                      <span className="text-[10px] text-[#718096]">{order.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-3 text-[#718096] whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    <td className="py-3.5 px-3 font-bold uppercase text-[11px] text-[#14281D]">
                      {order.paymentMethod}
                    </td>

                    <td className="py-3.5 px-3 font-bold font-mono text-[#14281D]">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                          order.status === 'pago' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                          order.status === 'enviado' ? 'bg-sky-50 text-sky-900 border-sky-300' :
                          order.status === 'entregue' ? 'bg-purple-50 text-purple-900 border-purple-300' :
                          order.status === 'cancelado' ? 'bg-red-50 text-red-900 border-red-300' :
                          'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="em_preparo">Em Preparo</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#C5A059] text-[#14281D] font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        title="Ver Detalhes do Pedido"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-2">
          <ErpPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* Order Detail Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 font-sans">
            
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                  Detalhes do Pedido
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#14281D]">
                  Pedido #{selectedOrder.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
              <div>
                <span className="font-bold text-[#14281D] uppercase tracking-wider block mb-1">Dados do Comprador</span>
                <p className="font-bold text-[#14281D]">{selectedOrder.customerName || 'Cliente'}</p>
                <p className="text-[#718096]">{selectedOrder.customerEmail}</p>
                <p className="text-[#718096]">{selectedOrder.customerPhone || 'Não informado'}</p>
                {selectedOrder.customerCpf && <p className="text-[#718096] font-mono">CPF: {selectedOrder.customerCpf}</p>}
              </div>

              <div>
                <span className="font-bold text-[#14281D] uppercase tracking-wider block mb-1">Endereço de Entrega</span>
                <p className="text-[#14281D]">
                  {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}
                  {selectedOrder.deliveryAddress.complement ? ` - ${selectedOrder.deliveryAddress.complement}` : ''}
                </p>
                <p className="text-[#718096]">
                  {selectedOrder.deliveryAddress.neighborhood} - {selectedOrder.deliveryAddress.city}/{selectedOrder.deliveryAddress.state}
                </p>
                <p className="text-[#718096] font-mono">CEP: {selectedOrder.deliveryAddress.cep}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#14281D]">Itens do Pedido ({selectedOrder.items.length})</h4>
              <div className="divide-y divide-[#E2D9C8] border border-[#E2D9C8] rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E2D9C8]"
                      />
                      <div>
                        <p className="font-bold text-[#14281D]">{item.product.name}</p>
                        <span className="text-[10px] text-[#718096]">Qtd: {item.quantity} x {formatCurrency(item.product.price)}</span>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-[#14281D]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-[#E2D9C8] pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#718096]">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Frete:</span>
                <span>{formatCurrency(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Desconto:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif font-bold text-lg text-[#14281D] pt-2 border-t border-[#E2D9C8]">
                <span>Total:</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-[#14281D] text-[#FAF7F2] font-bold text-xs uppercase"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
