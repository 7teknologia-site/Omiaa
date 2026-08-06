import React, { useState } from 'react';
import { User, Award, KeyRound, LogOut, Lock } from 'lucide-react';
import { CustomerProfile } from '../../types';
import { useShop } from '../../context/ShopContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AccountProfileProps {
  user: CustomerProfile;
}

export const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  const { setUser, showToast, authSession, signOutAuth } = useShop();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [cpf, setCpf] = useState(user.cpf);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recovery'>('login');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      cpf
    }));
    showToast('Perfil Atualizado!', 'Suas informações foram salvas.', 'success');
  };

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('Supabase não configurado', 'Configure as chaves no arquivo .env para autenticar.', 'info');
      return;
    }

    setIsAuthLoading(true);
    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro ao entrar', error.message, 'alert');
      } else {
        showToast('Sessão Iniciada!', 'Autenticado com sucesso via Supabase Auth.', 'success');
      }
    } else if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword
      });
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro ao cadastrar', error.message, 'alert');
      } else {
        showToast('Conta Criada!', 'Verifique seu e-mail para confirmar a conta Supabase.', 'success');
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail);
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro na recuperação', error.message, 'alert');
      } else {
        showToast('E-mail enviado!', 'Instruções de redefinição de senha foram enviadas ao seu e-mail.', 'success');
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Supabase Authentication Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-lg text-[#14281D]">
              Autenticação Supabase
            </h3>
          </div>

          {authSession ? (
            <button
              onClick={signOutAuth}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:underline"
            >
              <LogOut className="w-3.5 h-3.5" /> Encerra Sessão
            </button>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A5B] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E2D9C8]">
              {isSupabaseConfigured ? 'Conectado ao Supabase Auth' : 'Supabase Demo'}
            </span>
          )}
        </div>

        {authSession ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <p className="font-bold">Sessão Autenticada no Supabase</p>
              <p className="text-[11px] text-emerald-700">UID: {authSession.user?.id}</p>
              <p className="text-[11px] text-emerald-700">Email: {authSession.user?.email}</p>
            </div>
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
        ) : (
          <form onSubmit={handleSupabaseAuth} className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold mb-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-1 border-b-2 ${authMode === 'login' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`pb-1 border-b-2 ${authMode === 'signup' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Criar Conta
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('recovery')}
                className={`pb-1 border-b-2 ${authMode === 'recovery' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Esqueci a Senha
              </button>
            </div>

            <div className={`grid grid-cols-1 ${authMode === 'recovery' ? '' : 'sm:grid-cols-2'} gap-3 text-xs`}>
              <input
                type="email"
                placeholder="Seu e-mail cadastrado"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className="bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-2.5 text-[#14281D]"
              />
              {authMode !== 'recovery' && (
                <input
                  type="password"
                  placeholder="Sua senha de acesso"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-2.5 text-[#14281D]"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isAuthLoading ? 'Aguarde...' : authMode === 'login' ? 'Entrar com Supabase' : authMode === 'signup' ? 'Cadastrar no Supabase' : 'Enviar E-mail de Recuperação'}
            </button>
          </form>
        )}
      </div>

      {/* Tier & Points Loyalty Card */}
      <div className="bg-[#14281D] text-[#FAF7F2] p-6 rounded-3xl border border-[#2C4837] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-[#14281D] flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">Nível do Invocador</span>
            <h3 className="font-serif text-lg font-bold">{user.tier}</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#A8B2A6] tracking-wider block">Pontos Alquímicos</span>
          <span className="font-serif text-2xl font-bold text-[#C5A059]">{user.loyaltyPoints} pts</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <h3 className="font-serif font-bold text-lg text-[#14281D] border-b border-[#E2D9C8] pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#C5A059]" />
          <span>Dados Pessoais</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#14281D] uppercase tracking-wider mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

    </div>
  );
};

