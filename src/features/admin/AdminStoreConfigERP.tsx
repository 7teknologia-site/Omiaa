import React from 'react';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';
import { AdminSettings, SettingsTabId } from './AdminSettings';

interface AdminStoreConfigERPProps {
  initialTab?: SettingsTabId;
  subItemLabel?: string;
}

export const AdminStoreConfigERP: React.FC<AdminStoreConfigERPProps> = ({
  initialTab = 'brand',
  subItemLabel = 'Informações da Marca'
}) => {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Configurações da Loja" subItemLabel={subItemLabel} />
      <AdminSettings initialTab={initialTab} />
    </div>
  );
};
