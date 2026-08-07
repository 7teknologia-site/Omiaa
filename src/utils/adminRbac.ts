import { AdminRole, AdminRoleConfig, AdminAction } from '../types/adminNav';

const STORAGE_KEY_ACTIVE_ROLE = 'omiaa_admin_active_role';
const STORAGE_KEY_CUSTOM_ROLES = 'omiaa_admin_custom_roles_v1';

export const ADMIN_ROLES: AdminRoleConfig[] = [
  {
    id: 'super_admin',
    title: 'Super Administrador',
    description: 'Acesso total irrestrito a todas as configurações, auditoria e saúde do sistema.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    permissions: { '*': { view: true, create: true, edit: true, delete: true, export: true, configure: true } }
  },
  {
    id: 'admin',
    title: 'Administrador',
    description: 'Acesso completo a operações comerciais, cadastros, relatórios e configurações.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    permissions: { '*': { view: true, create: true, edit: true, delete: true, export: true, configure: true } }
  },
  {
    id: 'gerente',
    title: 'Gerente de Loja',
    description: 'Gestão operacional de produtos, estoques, pedidos, clientes e relatórios.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true, configure: false },
      orders: { view: true, create: true, edit: true, delete: false, export: true, configure: false },
      products: { view: true, create: true, edit: true, delete: true, export: true, configure: false },
      customers: { view: true, create: true, edit: true, delete: false, export: true, configure: false },
      reports: { view: true, create: false, edit: false, delete: false, export: true, configure: false },
      logistics: { view: true, create: true, edit: true, delete: false, export: true, configure: false },
      financial: { view: true, create: false, edit: false, delete: false, export: true, configure: false }
    }
  },
  {
    id: 'marketing',
    title: 'Especialista em Marketing',
    description: 'Gestão de cupons, campanhas, pop-ups, banners, blog e SEO da loja.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    permissions: {
      marketing: { view: true, create: true, edit: true, delete: true, export: true, configure: true },
      content: { view: true, create: true, edit: true, delete: true, export: true, configure: true },
      customers: { view: true, create: false, edit: false, delete: false, export: true, configure: false },
      dashboard: { view: true, create: false, edit: false, delete: false, export: false, configure: false }
    }
  },
  {
    id: 'financeiro',
    title: 'Analista Financeiro',
    description: 'Acompanhamento de faturamento, pagamentos, reembolsos e relatórios fiscais.',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    permissions: {
      financial: { view: true, create: true, edit: true, delete: false, export: true, configure: true },
      orders: { view: true, create: false, edit: true, delete: false, export: true, configure: false },
      reports: { view: true, create: false, edit: false, delete: false, export: true, configure: false },
      dashboard: { view: true, create: false, edit: false, delete: false, export: true, configure: false }
    }
  },
  {
    id: 'logistica',
    title: 'Operador Logístico',
    description: 'Controle de envios, rastreamento de pedidos, transportadoras e estoque.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    permissions: {
      logistics: { view: true, create: true, edit: true, delete: false, export: true, configure: true },
      orders: { view: true, create: false, edit: true, delete: false, export: true, configure: false },
      products: { view: true, create: false, edit: true, delete: false, export: true, configure: false }
    }
  },
  {
    id: 'editor',
    title: 'Editor de Conteúdo',
    description: 'Criação e edição de artigos no blog, guia das ervas e páginas institucionais.',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    permissions: {
      content: { view: true, create: true, edit: true, delete: true, export: false, configure: false }
    }
  },
  {
    id: 'atendimento',
    title: 'Atendimento ao Cliente',
    description: 'Visualização de pedidos, dados de clientes, avaliações e suporte LGPD.',
    badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
    permissions: {
      orders: { view: true, create: false, edit: true, delete: false, export: false, configure: false },
      customers: { view: true, create: false, edit: false, delete: false, export: false, configure: false },
      products: { view: true, create: false, edit: false, delete: false, export: false, configure: false },
      compliance: { view: true, create: true, edit: true, delete: false, export: false, configure: false }
    }
  }
];

export type AdminUserRole = AdminRole;

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  super_admin: 'Super Administrador',
  admin: 'Administrador',
  gerente: 'Gerente de Loja',
  marketing: 'Marketing',
  financeiro: 'Financeiro',
  logistica: 'Logística',
  editor: 'Editor de Conteúdo',
  atendimento: 'Atendimento'
};

export function getActiveRole(): AdminRole {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE);
    if (saved && ADMIN_ROLES.some((r) => r.id === saved)) {
      return saved as AdminRole;
    }
  } catch {
    // ignore
  }
  return 'super_admin';
}

export const getStoredUserRole = getActiveRole;

export function setActiveRole(role: AdminRole): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, role);
    window.dispatchEvent(new CustomEvent('omiaa_admin_role_changed', { detail: role }));
  } catch {
    // ignore
  }
}

export const setStoredUserRole = setActiveRole;

export function hasPermission(role: AdminRole, moduleId: string, action: AdminAction = 'view'): boolean {
  if (role === 'super_admin' || role === 'admin') return true;

  const roleConfig = ADMIN_ROLES.find((r) => r.id === role);
  if (!roleConfig) return true;

  if (roleConfig.permissions['*']) {
    return roleConfig.permissions['*'][action] ?? true;
  }

  const modulePerms = roleConfig.permissions[moduleId];
  if (!modulePerms) {
    // By default, if module isn't strictly defined for lesser roles, allow view only for general modules
    return action === 'view';
  }

  return modulePerms[action] ?? false;
}
