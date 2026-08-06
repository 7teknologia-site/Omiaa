import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Award,
  ShoppingBag,
  DollarSign,
  Edit2,
  X
} from 'lucide-react';
import { CustomerProfile, Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from './utils/csvExporter';
import { ErpPagination } from './components/ErpPagination';
import { useShop } from '../../context/ShopContext';

interface AdminCustomersERPProps {
  orders: Order[];
}

export const AdminCustomersERP: React.FC<AdminCustomersERPProps> = ({ orders }) => {
  const { user, showToast } = useShop();

  // Aggregate customers from actual orders + user state
  const customersList = useMemo(() => {
    const customerMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      cpf: string;
      totalSpent: number;
      ordersCount: number;
      tier: 'Neófito' | 'Iniciado' | 'Mestre Alquimista';
    }>();

    // Include system logged user
    if (user.email) {
      customerMap.set(user.email.toLowerCase(), {
        name: user.name || 'Cliente Neófito',
        email: user.email,
        phone: user.phone || '',
        cpf: user.cpf || '',
        totalSpent: 0,
        ordersCount: 0,
        tier: user.tier || 'Mestre Alquimista'
      });
    }

    // Accumulate from orders
    orders.forEach((o) => {
      const emailKey = (o.customerEmail || 'anonimo@omiaa.com.br').toLowerCase();
      const existing = customerMap.get(emailKey) || {
        name: o.customerName || 'Cliente Neófito',
        email: emailKey,
        phone: o.customerPhone || '',
        cpf: o.customerCpf || '',
        totalSpent: 0,
        ordersCount: 0,
        tier: 'Iniciado'
      };

      existing.totalSpent += o.total;
      existing.ordersCount += 1;
      if (existing.totalSpent > 1000) existing.tier = 'Mestre Alquimista';

      customerMap.set(emailKey, existing);
    });

    return Array.from(customerMap.values());
  }, [orders, user]);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('todos');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit Customer Modal
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cpf.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === 'todos' || c.tier === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [customersList, searchQuery, tierFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const handleExportCSV = () => {
    exportToCSV(
      filteredCustomers,
      [
        { key: 'name', label: 'Nome do Cliente' },
        { key: 'email', label: 'E-mail' },
        { key: 'phone', label: 'Telefone' },
        { key: 'cpf', label: 'CPF' },
        { key: 'ordersCount', label: 'Total de Pedidos' },
        { key: 'totalSpent', label: 'Total Gasto (LTV R$)' },
        { key: 'tier', label: 'Nível de Lealdade' }
      ],
      'Clientes_CRM_OMIAA'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C5A059]" />
            <span>CRM & Gestão de Clientes ({filteredCustomers.length})</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Visualize o histórico de compras, LTV (Lifetime Value) e níveis de fidelidade da sua base de clientes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Exportar Clientes CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#E2D9C8] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por nome, e-mail ou CPF..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <Award className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Níveis de Lealdade</option>
            <option value="Neófito">Neófito</option>
            <option value="Iniciado">Iniciado</option>
            <option value="Mestre Alquimista">Mestre Alquimista</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[#8C7A5B] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-3">E-mail / Telefone</th>
                <th className="py-3.5 px-3">Pedidos</th>
                <th className="py-3.5 px-3">Total Gasto (LTV)</th>
                <th className="py-3.5 px-3">Nível Alquímico</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9C8]/60">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#718096]">
                    Nenhum cliente localizado.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#14281D]">
                      {c.name}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[#14281D] block">{c.email}</span>
                      <span className="text-[10px] text-[#718096]">{c.phone || 'Sem telefone'}</span>
                    </td>

                    <td className="py-3.5 px-3 font-bold font-mono text-[#14281D]">
                      {c.ordersCount}
                    </td>

                    <td className="py-3.5 px-3 font-bold font-mono text-[#14281D]">
                      {formatCurrency(c.totalSpent)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.tier === 'Mestre Alquimista' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        c.tier === 'Iniciado' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {c.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#14281D] font-bold"
                        title="Ver / Editar"
                      >
                        <Edit2 className="w-4 h-4 text-[#C5A059]" />
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
            totalItems={filteredCustomers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2D9C8] max-w-md w-full p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
              <h3 className="font-serif font-bold text-base text-[#14281D]">Perfil do Cliente CRM</h3>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p><strong>Nome:</strong> {selectedCustomer.name}</p>
              <p><strong>E-mail:</strong> {selectedCustomer.email}</p>
              <p><strong>Telefone:</strong> {selectedCustomer.phone || 'Não cadastrado'}</p>
              <p><strong>Total de Pedidos:</strong> {selectedCustomer.ordersCount}</p>
              <p><strong>Total Gasto (LTV):</strong> {formatCurrency(selectedCustomer.totalSpent)}</p>
              <p><strong>Nível:</strong> {selectedCustomer.tier}</p>
            </div>

            <div className="pt-3 border-t border-[#E2D9C8] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-[#14281D] text-[#FAF7F2] font-bold"
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
