import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  Download,
  DollarSign,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from './utils/csvExporter';
import { ErpPagination } from './components/ErpPagination';
import { useShop } from '../../context/ShopContext';

interface AdminInventoryERPProps {
  products: Product[];
}

export const AdminInventoryERP: React.FC<AdminInventoryERPProps> = ({ products: initialProducts }) => {
  const { showToast } = useShop();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockLevelFilter, setStockLevelFilter] = useState<'todos' | 'critico' | 'normal'>('todos');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculations
  const totalStockUnits = productsList.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = productsList.reduce((acc, p) => acc + p.price * p.stock, 0);
  const criticalItems = productsList.filter((p) => p.stock <= 5);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesLevel = true;
      if (stockLevelFilter === 'critico') matchesLevel = p.stock <= 5;
      if (stockLevelFilter === 'normal') matchesLevel = p.stock > 5;

      return matchesSearch && matchesLevel;
    });
  }, [productsList, searchQuery, stockLevelFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleAdjustStock = (productId: string, delta: number) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          showToast('Estoque Ajustado', `Estoque de ${p.name} alterado para ${newStock} un.`, 'info');
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredProducts,
      [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Nome do Produto' },
        { key: 'category', label: 'Categoria' },
        { key: 'price', label: 'Preço Unitário (R$)' },
        { key: 'stock', label: 'Estoque Atual' },
        { key: 'volumeOrWeight', label: 'Volume' }
      ],
      'Relatorio_Estoque_Omiaa_Alquimia'
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#C5A059]" />
            <span>Gestão de Estoque & Inventário</span>
          </h2>
          <p className="text-xs text-[#718096] mt-0.5">
            Ajuste quantidades de imediato, controle pontos de pedido e valorização do estoque.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Exportar Inventário CSV</span>
        </button>
      </div>

      {/* Overview Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Valorização do Estoque</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{formatCurrency(totalInventoryValue)}</h3>
          <p className="text-[10px] text-[#718096]">Soma total do valor de venda</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#8C7A5B]">Total de Unidades</span>
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">{totalStockUnits} un.</h3>
          <p className="text-[10px] text-[#718096]">Itens físicos armazenados</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-800">Itens em Alerta Crítico</span>
          <h3 className="font-serif text-2xl font-bold text-amber-900">{criticalItems.length} produtos</h3>
          <p className="text-[10px] text-amber-800 font-bold">Estoque &le; 5 unidades</p>
        </div>
      </div>

      {/* Search and Filters */}
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
            placeholder="Buscar por SKU ou nome do item..."
            className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#14281D] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E2D9C8] rounded-2xl px-3 py-2">
          <AlertTriangle className="w-4 h-4 text-[#8C7A5B] shrink-0" />
          <select
            value={stockLevelFilter}
            onChange={(e) => {
              setStockLevelFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-transparent w-full font-bold text-[#14281D] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Níveis</option>
            <option value="critico">Somente Crítico (&le; 5 un)</option>
            <option value="normal">Normal (&gt; 5 un)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[#8C7A5B] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">SKU / Produto</th>
                <th className="py-3.5 px-3">Categoria</th>
                <th className="py-3.5 px-3">Preço Un.</th>
                <th className="py-3.5 px-3">Valor Total em Estoque</th>
                <th className="py-3.5 px-3">Estoque Atual</th>
                <th className="py-3.5 px-4 text-center">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9C8]/60">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#14281D] block">{p.name}</span>
                    <span className="text-[10px] text-[#8C7A5B] font-mono">{p.sku}</span>
                  </td>

                  <td className="py-3.5 px-3 text-[#718096]">
                    {p.category}
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-[#14281D]">
                    {formatCurrency(p.price)}
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-[#14281D]">
                    {formatCurrency(p.price * p.stock)}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      p.stock === 0 ? 'bg-red-100 text-red-900' :
                      p.stock <= 5 ? 'bg-amber-100 text-amber-900' :
                      'bg-emerald-100 text-emerald-900'
                    }`}>
                      {p.stock} un.
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleAdjustStock(p.id, -1)}
                        className="p-1.5 rounded-lg border border-[#E2D9C8] hover:bg-gray-100 text-[#14281D]"
                        title="Diminuir 1 un"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, 1)}
                        className="p-1.5 rounded-lg border border-[#E2D9C8] hover:bg-[#FAF7F2] text-[#14281D] font-bold"
                        title="Aumentar 1 un"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-2">
          <ErpPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

    </div>
  );
};
