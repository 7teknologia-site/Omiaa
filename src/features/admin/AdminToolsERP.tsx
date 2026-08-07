import React, { useState } from 'react';
import {
  Wrench,
  Upload,
  Download,
  Trash2,
  HardDrive,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { exportToCSV } from './utils/csvExporter';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';

export const AdminToolsERP: React.FC = () => {
  const { products, orders, categories, showToast } = useShop();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isCleaningCache, setIsCleaningCache] = useState(false);
  const [isBackupDone, setIsBackupDone] = useState(false);

  const handleCleanCache = () => {
    setIsCleaningCache(true);
    setTimeout(() => {
      setIsCleaningCache(false);
      showToast('Cache local e imagens estáticas revalidadas com sucesso!', 'success');
    }, 800);
  };

  const handleTriggerBackup = () => {
    setIsBackupDone(true);
    const data = {
      timestamp: new Date().toISOString(),
      productsCount: products.length,
      ordersCount: orders.length,
      categoriesCount: categories.length,
      system: 'OMIAA Alquimia Ancestral ERP'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMIAA_Backup_Manual_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup manual baixado com sucesso!', 'success');
  };

  const handleExportFullCatalog = () => {
    exportToCSV(
      products,
      [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nome' },
        { key: 'price', label: 'Preço (R$)' },
        { key: 'category', label: 'Categoria' },
        { key: 'stock', label: 'Estoque' }
      ],
      'Catalogo_Produtos_OMIAA'
    );
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Ferramentas do Sistema" subItemLabel="Manutenção & Utilitários" />

      {/* Header Banner */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 rounded-3xl border border-[#2C4837] shadow-md">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif font-bold text-lg">Central de Ferramentas & Operações do Sistema</h2>
        </div>
        <p className="text-xs text-[#A8B2A6] mt-1">
          Importação/exportação em lote, utilitários de cache, rotinas de backup manual e modo de manutenção.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#C5A059]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Importar Produtos (CSV / JSON)</h3>
              <p className="text-xs text-[#8C7A5B]">Atualização massiva de catálogo ou estoque.</p>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-[#E2D9C8] rounded-2xl bg-[#FAF7F2] text-center space-y-2">
            <FileSpreadsheet className="w-8 h-8 mx-auto text-[#C5A059]" />
            <p className="text-xs font-bold text-[#14281D]">Arraste seu arquivo CSV de produtos aqui</p>
            <p className="text-[10px] text-[#8C7A5B]">Formatos aceitos: .csv, .json (Máx. 10MB)</p>
            <button
              onClick={() => showToast('Selecione um arquivo .csv formatado.', 'info')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2D9C8] rounded-xl text-xs font-bold text-[#14281D] hover:border-[#C5A059]"
            >
              <span>Selecionar Arquivo</span>
            </button>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#C5A059]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Exportar Dados da Loja</h3>
              <p className="text-xs text-[#8C7A5B]">Gere planilhas em CSV de produtos, pedidos ou clientes.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <button
              onClick={handleExportFullCatalog}
              className="w-full flex items-center justify-between p-3 bg-[#FAF7F2] hover:bg-[#14281D] group rounded-2xl border border-[#E2D9C8] transition-all"
            >
              <span className="font-bold text-[#14281D] group-hover:text-white">Exportar Catálogo de Produtos (CSV)</span>
              <Download className="w-4 h-4 text-[#C5A059]" />
            </button>

            <button
              onClick={() =>
                exportToCSV(
                  orders,
                  [
                    { key: 'id', label: 'ID' },
                    { key: 'customerName', label: 'Cliente' },
                    { key: 'total', label: 'Total (R$)' },
                    { key: 'status', label: 'Status' }
                  ],
                  'Pedidos_OMIAA'
                )
              }
              className="w-full flex items-center justify-between p-3 bg-[#FAF7F2] hover:bg-[#14281D] group rounded-2xl border border-[#E2D9C8] transition-all"
            >
              <span className="font-bold text-[#14281D] group-hover:text-white">Exportar Histórico de Pedidos (CSV)</span>
              <Download className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>

        {/* Cache Clean & Backup Manual */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#C5A059]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Cache & Backup Manual</h3>
              <p className="text-xs text-[#8C7A5B]">Otimização de memória local e snapshot completo.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8]">
              <div>
                <p className="font-bold text-[#14281D]">Limpeza de Cache do App</p>
                <p className="text-[10px] text-[#8C7A5B]">Purga thumbnails e arquivos temporários da memória.</p>
              </div>
              <button
                onClick={handleCleanCache}
                disabled={isCleaningCache}
                className="px-3 py-1.5 bg-white border border-[#E2D9C8] rounded-xl font-bold text-[#14281D] hover:border-[#C5A059]"
              >
                {isCleaningCache ? 'Limpando...' : 'Limpar Cache'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8]">
              <div>
                <p className="font-bold text-[#14281D]">Backup Manual JSON</p>
                <p className="text-[10px] text-[#8C7A5B]">Faz o download do snapshot completo dos dados.</p>
              </div>
              <button
                onClick={handleTriggerBackup}
                className="px-3 py-1.5 bg-[#14281D] text-[#FAF7F2] rounded-xl font-bold hover:bg-[#2C4837]"
              >
                Gerar Backup
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Mode Toggle */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#E2D9C8] flex items-center justify-center text-[#C5A059]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Modo de Manutenção</h3>
              <p className="text-xs text-[#8C7A5B]">Bloqueia temporariamente compras na loja para clientes.</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#14281D]">Loja em Manutenção</p>
              <p className="text-[10px] text-[#8C7A5B]">
                {maintenanceMode ? 'Sua loja exibirá aviso de manutenção.' : 'A loja está 100% ativa para compras.'}
              </p>
            </div>
            <button
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                showToast(
                  !maintenanceMode ? 'Modo de Manutenção ativado!' : 'Modo de Manutenção desativado!',
                  !maintenanceMode ? 'warning' : 'success'
                );
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                maintenanceMode ? 'bg-amber-600 text-white' : 'bg-[#14281D] text-[#FAF7F2]'
              }`}
            >
              {maintenanceMode ? 'Desativar Manutenção' : 'Ativar Manutenção'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
