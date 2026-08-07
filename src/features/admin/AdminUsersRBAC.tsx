import React, { useState } from 'react';
import {
  Users,
  Shield,
  Key,
  Lock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Building2,
  RefreshCw,
  Eye,
  Settings,
  Download
} from 'lucide-react';
import { ADMIN_ROLES, getActiveRole, setActiveRole } from '../../utils/adminRbac';
import { AdminRole, AdminRoleConfig } from '../../types/adminNav';
import { AdminBreadcrumb } from '../../components/admin/AdminBreadcrumb';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  lastAccess: string;
  department: string;
}

export const AdminUsersRBAC: React.FC = () => {
  const [activeRole, setCurrentRoleState] = useState<AdminRole>(getActiveRole());
  const [activeTab, setActiveTab] = useState<'admins' | 'roles' | 'permissions'>('admins');
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState<AdminUserRecord[]>([
    {
      id: 'usr_1',
      name: 'Isadora Omiaá',
      email: 'isadora@omiaa.com.br',
      role: 'super_admin',
      status: 'active',
      lastAccess: 'Agora (Sessão Atual)',
      department: 'Diretoria / Alquimia'
    },
    {
      id: 'usr_2',
      name: 'Gabriel Santos',
      email: 'gabriel.santos@omiaa.com.br',
      role: 'admin',
      status: 'active',
      lastAccess: 'Hoje às 09:15',
      department: 'Operações'
    },
    {
      id: 'usr_3',
      name: 'Carolina Botânica',
      email: 'carolina.mkt@omiaa.com.br',
      role: 'marketing',
      status: 'active',
      lastAccess: 'Hoje às 08:30',
      department: 'Marketing & CRM'
    },
    {
      id: 'usr_4',
      name: 'Lucas Financeiro',
      email: 'lucas.fin@omiaa.com.br',
      role: 'financeiro',
      status: 'active',
      lastAccess: 'Ontem às 17:40',
      department: 'Controladoria'
    },
    {
      id: 'usr_5',
      name: 'Marcos Logística',
      email: 'marcos.envios@omiaa.com.br',
      role: 'logistica',
      status: 'active',
      lastAccess: 'Hoje às 07:50',
      department: 'Expedição & Fretes'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'gerente' as AdminRole,
    department: ''
  });

  const handleRoleChange = (role: AdminRole) => {
    setActiveRole(role);
    setCurrentRoleState(role);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: AdminUserRecord = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastAccess: 'Nunca acessou',
      department: newUser.department || 'Operacional'
    };

    setUsers([user, ...users]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'gerente', department: '' });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminBreadcrumb moduleLabel="Usuários" subItemLabel="Administradores & RBAC" />

      {/* Top Banner active role selector */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 rounded-3xl border border-[#2C4837] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif font-bold text-lg">Controle de Acesso RBAC (Role-Based Access Control)</h2>
          </div>
          <p className="text-xs text-[#A8B2A6] mt-1">
            Simule ou altere o perfil administrativo atual para testar a visibilidade de módulos e ações.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#C5A059]">Perfil Ativo:</span>
          <select
            value={activeRole}
            onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
            className="bg-[#2C4837] text-white border border-[#C5A059]/40 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs sub-navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-2">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'admins'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Users className="w-4 h-4 text-[#C5A059]" />
          <span>Administradores ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Shield className="w-4 h-4 text-[#C5A059]" />
          <span>Perfis & Funções ({ADMIN_ROLES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'permissions'
              ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
              : 'bg-white text-[#14281D] border border-[#E2D9C8] hover:border-[#C5A059]'
          }`}
        >
          <Key className="w-4 h-4 text-[#C5A059]" />
          <span>Matriz de Permissões</span>
        </button>
      </div>

      {/* Tab: Administradores */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8C7A5B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuário por nome, email ou setor..."
                className="w-full bg-white border border-[#E2D9C8] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#14281D] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14281D] text-[#FAF7F2] hover:bg-[#2C4837] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Novo Administrador</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Perfil RBAC</th>
                    <th className="p-4">Departamento</th>
                    <th className="p-4">Último Acesso</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D9C8] text-xs">
                  {filteredUsers.map((u) => {
                    const roleInfo = ADMIN_ROLES.find((r) => r.id === u.role);
                    return (
                      <tr key={u.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#14281D] text-[#C5A059] font-bold text-xs flex items-center justify-center">
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[#14281D]">{u.name}</p>
                              <p className="text-[11px] text-[#8C7A5B]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              roleInfo?.badgeColor || 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {roleInfo?.title || u.role}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-[#14281D]">{u.department}</td>
                        <td className="p-4 text-[#8C7A5B] font-mono text-[11px]">{u.lastAccess}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Ativo
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              handleRoleChange(u.role);
                            }}
                            className="text-xs text-[#C5A059] hover:underline font-bold"
                          >
                            Simular Perfil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Perfis & Funções */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADMIN_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${role.badgeColor}`}>
                    {role.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#8C7A5B]">ID: {role.id}</span>
                </div>
                <p className="text-xs text-[#8C7A5B] mt-2 leading-relaxed">{role.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E2D9C8] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#14281D] font-bold">
                  {users.filter((u) => u.role === role.id).length} Usuários Vinculados
                </span>
                <button
                  onClick={() => handleRoleChange(role.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#14281D] hover:bg-[#14281D] hover:text-white transition-all border border-[#E2D9C8] text-xs font-bold"
                >
                  Ativar Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Matriz de Permissões */}
      {activeTab === 'permissions' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-[#14281D]">Matriz da Regra de Negócio (RBAC Matrix)</h3>
              <p className="text-xs text-[#8C7A5B]">
                Mapeamento de permissões granulares por ação (Visualizar, Criar, Editar, Excluir, Exportar, Configurar).
              </p>
            </div>
            <span className="text-xs font-bold text-[#C5A059] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E2D9C8]">
              8 Perfis Configurados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9C8] text-[10px] font-bold uppercase tracking-widest text-[#8C7A5B]">
                  <th className="p-3">Módulo</th>
                  <th className="p-3 text-center">Super Admin</th>
                  <th className="p-3 text-center">Gerente</th>
                  <th className="p-3 text-center">Marketing</th>
                  <th className="p-3 text-center">Financeiro</th>
                  <th className="p-3 text-center">Logística</th>
                  <th className="p-3 text-center">Editor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9C8] text-xs">
                {[
                  { module: 'Dashboard Geral', sa: 'Full', g: 'Ver/Exp', m: 'Ver', f: 'Ver/Exp', l: 'Ver', e: 'Nenhum' },
                  { module: 'Pedidos & Vendas', sa: 'Full', g: 'Full', m: 'Nenhum', f: 'Ver/Edit', l: 'Ver/Edit', e: 'Nenhum' },
                  { module: 'Catálogo de Produtos', sa: 'Full', g: 'Full', m: 'Ver', f: 'Ver', l: 'Ver/Edit', e: 'Nenhum' },
                  { module: 'Marketing & Cupons', sa: 'Full', g: 'Ver', m: 'Full', f: 'Nenhum', l: 'Nenhum', e: 'Ver' },
                  { module: 'Conteúdo & Blog', sa: 'Full', g: 'Ver', m: 'Full', f: 'Nenhum', l: 'Nenhum', e: 'Full' },
                  { module: 'Financeiro & Relatórios', sa: 'Full', g: 'Ver/Exp', m: 'Nenhum', f: 'Full', l: 'Nenhum', e: 'Nenhum' },
                  { module: 'Logística & Transportadoras', sa: 'Full', g: 'Ver/Edit', m: 'Nenhum', f: 'Nenhum', l: 'Full', e: 'Nenhum' },
                  { module: 'Conformidade LGPD', sa: 'Full', g: 'Ver', m: 'Nenhum', f: 'Nenhum', l: 'Nenhum', e: 'Nenhum' },
                  { module: 'Configurações Globais', sa: 'Full', g: 'Nenhum', m: 'Nenhum', f: 'Nenhum', l: 'Nenhum', e: 'Nenhum' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2]/50 font-medium">
                    <td className="p-3 font-bold text-[#14281D]">{row.module}</td>
                    <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/50">{row.sa}</td>
                    <td className="p-3 text-center text-blue-700">{row.g}</td>
                    <td className="p-3 text-center text-purple-700">{row.m}</td>
                    <td className="p-3 text-center text-teal-700">{row.f}</td>
                    <td className="p-3 text-center text-amber-700">{row.l}</td>
                    <td className="p-3 text-center text-rose-700">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal create user */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#14281D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-3xl border border-[#E2D9C8] p-6 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#14281D] mb-4">Cadastrar Novo Administrador</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#14281D] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ex: Mariana Oliveira"
                  className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14281D] mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="mariana@omiaa.com.br"
                  className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14281D] mb-1">Perfil RBAC</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                  className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C5A059]"
                >
                  {ADMIN_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#14281D] mb-1">Departamento</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="Ex: Marketing Digital"
                  className="w-full bg-white border border-[#E2D9C8] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2D9C8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E2D9C8] text-[#8C7A5B] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#14281D] text-[#FAF7F2] font-bold hover:bg-[#2C4837]"
                >
                  Salvar Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
