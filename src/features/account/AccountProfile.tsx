import React, { useState } from 'react';
import { User, Award, KeyRound, LogOut, Lock, ShieldCheck, Mail, Phone, LockKeyhole } from 'lucide-react';
import { CustomerProfile } from '../../types';
import { useShop } from '../../context/ShopContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { upsertCustomerProfile } from '../../services/supabaseService';

interface AccountProfileProps {
  user: CustomerProfile;
}

function getAuthErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro inesperado.';
  const msg = (error.message || '').toLowerCase();
  
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (msg.includes('user already registered') || msg.includes('already registered')) {
    return 'Este e-mail já possui cadastro. Faça login ou solicite recuperação de senha.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
    return 'E-mail não confirmado. Por favor, verifique a caixa de entrada do seu e-mail.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Muitas tentativas consecutivas. Aguarde alguns instantes e tente novamente.';
  }
  return error.message || 'Não foi possível completar a operação de acesso.';
}

export const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  const { setUser, showToast, authSession, signOutAuth } = useShop();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [cpf, setCpf] = useState(user.cpf);

  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recovery'>('login');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: CustomerProfile = {
      ...user,
      name,
      email,
      phone,
      cpf
    };
    setUser(updatedProfile);

    if (authSession?.user?.id) {
      await upsertCustomerProfile(updatedProfile, authSession.user.id);
    }
    showToast('Perfil Atualizado!', 'Suas informações foram salvas com sucesso.', 'success');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('Acesso indisponível', 'Serviço de autenticação temporariamente indisponível.', 'info');
      return;
    }

    setIsAuthLoading(true);
    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword
      });
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro ao acessar', getAuthErrorMessage(error), 'alert');
      } else {
        showToast('Sessão Iniciada!', 'Autenticado com sucesso na sua conta OMIAÁ.', 'success');
      }
    } else if (authMode === 'signup') {
      const fullName = authName.trim() || name.trim() || undefined;
      const userPhone = authPhone.trim() || phone.trim() || undefined;

      const { data, error } = await supabase.auth.signUp({
        email: authEmail.trim(),
        password: authPassword,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
            phone: userPhone
          }
        }
      });
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro ao cadastrar', getAuthErrorMessage(error), 'alert');
      } else {
        if (data.session) {
          showToast('Conta Criada!', 'Seu cadastro foi realizado com sucesso! Sessão iniciada.', 'success');
        } else {
          showToast('Cadastro Realizado!', 'Verifique seu e-mail para confirmar a ativação da sua conta.', 'success');
        }
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim());
      setIsAuthLoading(false);
      if (error) {
        showToast('Erro na recuperação', getAuthErrorMessage(error), 'alert');
      } else {
        showToast('E-mail enviado!', 'Instruções de redefinição de senha foram enviadas ao seu e-mail.', 'success');
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Authentication Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2D9C8] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-lg text-[#14281D]">
              Acesso à Conta
            </h3>
          </div>

          {authSession ? (
            <button
              onClick={signOutAuth}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Encerrar Sessão
            </button>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A5B] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E2D9C8] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
              {isSupabaseConfigured ? 'Acesso Seguro' : 'Modo Demonstração'}
            </span>
          )}
        </div>

        {authSession ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Sessão Autenticada com Segurança
              </p>
              <p className="text-[11px] text-emerald-800">
                E-mail conectado: <span className="font-semibold">{authSession.user?.email}</span>
              </p>
            </div>
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold mb-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer ${authMode === 'login' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer ${authMode === 'signup' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Criar Conta
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('recovery')}
                className={`pb-1 border-b-2 transition-colors cursor-pointer ${authMode === 'recovery' ? 'border-[#C5A059] text-[#14281D]' : 'border-transparent text-[#718096]'}`}
              >
                Esqueci a Senha
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {authMode === 'signup' && (
                <div>
                  <label className="block font-bold text-[#14281D] mb-1">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-2.5 text-[#14281D]"
                  />
                </div>
              )}

              <div className={authMode === 'recovery' || authMode === 'signup' ? '' : 'sm:col-span-1'}>
                <label className="block font-bold text-[#14281D] mb-1">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-8 pr-2.5 py-2.5 text-[#14281D]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#8C7A5B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block font-bold text-[#14281D] mb-1">WhatsApp / Telefone</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-8 pr-2.5 py-2.5 text-[#14281D]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#8C7A5B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {authMode !== 'recovery' && (
                <div className={authMode === 'signup' ? 'sm:col-span-2' : 'sm:col-span-1'}>
                  <label className="block font-bold text-[#14281D] mb-1">Senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl pl-8 pr-2.5 py-2.5 text-[#14281D]"
                    />
                    <LockKeyhole className="w-3.5 h-3.5 text-[#8C7A5B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isAuthLoading}
                className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAuthLoading ? 'Processando...' : authMode === 'login' ? 'Entrar na Conta' : authMode === 'signup' ? 'Criar Cadastro' : 'Enviar E-mail de Recuperação'}
              </button>
            </div>
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
            <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">Nível da Conta</span>
            <h3 className="font-serif text-lg font-bold">{user.tier}</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#A8B2A6] tracking-wider block">Pontos</span>
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
            className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

    </div>
  );
};
