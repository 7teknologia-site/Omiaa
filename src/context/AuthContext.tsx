import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { CustomerProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchCustomerProfile } from '../services/supabaseService';

export const MOCK_CUSTOMER: CustomerProfile = {
  name: 'Iniciado Alquímico',
  email: 'cliente@omiaa.com.br',
  phone: '(11) 99887-6655',
  cpf: '123.456.789-00',
  loyaltyPoints: 150,
  tier: 'Iniciado',
  addresses: [
    {
      street: 'Alameda das Camomilas',
      number: '108',
      complement: 'Apto 42 - Bloco A',
      neighborhood: 'Jardim Botânico',
      city: 'São Paulo',
      state: 'SP',
      cep: '01420-001'
    }
  ]
};

export const GUEST_CUSTOMER: CustomerProfile = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  addresses: [],
  loyaltyPoints: 0,
  tier: 'Neófito'
};

export interface AuthContextType {
  session: Session | null;
  authSession: Session | null;
  user: CustomerProfile | null;
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refreshProfile: (userId?: string) => Promise<CustomerProfile | null>;
  signOut: () => Promise<void>;
  signOutAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<CustomerProfile | null>>;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateCustomerState = useCallback((profile: CustomerProfile | null) => {
    setUser(profile);
    setCustomer(profile);
  }, []);

  const refreshProfile = useCallback(async (targetUserId?: string): Promise<CustomerProfile | null> => {
    setLoading(true);
    setError(null);

    // Demo Mode (When Supabase is not configured)
    if (!isSupabaseConfigured) {
      updateCustomerState(MOCK_CUSTOMER);
      setIsAuthenticated(true);
      setLoading(false);
      return MOCK_CUSTOMER;
    }

    // Configured Supabase Auth
    try {
      const { data: { session: activeSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[AuthContext] Error retrieving session:', sessionError);
        const status = (sessionError as any)?.status || (sessionError as any)?.statusCode;
        if (status === 401 || status === 403 || sessionError.message?.toLowerCase().includes('jwt') || sessionError.message?.toLowerCase().includes('invalid')) {
          await supabase.auth.signOut().catch(() => {});
          setSession(null);
          updateCustomerState(null);
          setIsAuthenticated(false);
          setLoading(false);
          return null;
        }
      }

      if (!activeSession || !activeSession.user) {
        // Rule 2: If no authenticated session exists: user = null, customer = null, isAuthenticated = false
        setSession(null);
        updateCustomerState(null);
        setIsAuthenticated(false);
        setLoading(false);
        return null;
      }

      setSession(activeSession);
      const uid = targetUserId || activeSession.user.id;

      const profile = await fetchCustomerProfile(uid);

      if (profile) {
        updateCustomerState(profile);
        setIsAuthenticated(true);
        setError(null);
        setLoading(false);
        return profile;
      } else {
        // Rule 3: Session exists but profile query returned null / failed
        // DO NOT fallback to MOCK_CUSTOMER!
        // Preserve authenticated session with session metadata
        const sessionProfile: CustomerProfile = {
          name: activeSession.user.user_metadata?.full_name || 
                activeSession.user.user_metadata?.name || 
                activeSession.user.email?.split('@')[0] || 
                'Cliente Omiaá',
          email: activeSession.user.email || '',
          phone: activeSession.user.user_metadata?.phone || '',
          cpf: '',
          addresses: [],
          loyaltyPoints: 0,
          tier: 'Neófito'
        };

        console.warn('[AuthContext] Customer profile row missing, using session credentials.');
        updateCustomerState(sessionProfile);
        setIsAuthenticated(true);
        setError('Perfil do cliente não encontrado na base de dados.');
        setLoading(false);
        return sessionProfile;
      }
    } catch (err: any) {
      console.error('[AuthContext] Exception in refreshProfile:', err);

      const status = err?.status || err?.statusCode;
      if (status === 401 || status === 403) {
        // Rule 4: 401 / 403 -> invalidate session, clear state, no mock data
        await supabase.auth.signOut().catch(() => {});
        setSession(null);
        updateCustomerState(null);
        setIsAuthenticated(false);
        setError('Sessão expirada ou não autorizada.');
        setLoading(false);
        return null;
      }

      if (session?.user) {
        const sessionProfile: CustomerProfile = {
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Cliente Omiaá',
          email: session.user.email || '',
          phone: '',
          cpf: '',
          addresses: [],
          loyaltyPoints: 0,
          tier: 'Neófito'
        };
        updateCustomerState(sessionProfile);
        setIsAuthenticated(true);
        setError('Erro temporário de conexão ao carregar perfil.');
        setLoading(false);
        return sessionProfile;
      }

      setSession(null);
      updateCustomerState(null);
      setIsAuthenticated(false);
      setError(err?.message || 'Erro de autenticação.');
      setLoading(false);
      return null;
    }
  }, [updateCustomerState, session]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch((err) => console.error('[AuthContext] SignOut error:', err));
    }
    setSession(null);
    updateCustomerState(null);
    setIsAuthenticated(false);
    setError(null);
  }, [updateCustomerState]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      updateCustomerState(MOCK_CUSTOMER);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    refreshProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        updateCustomerState(null);
        setIsAuthenticated(false);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(newSession);
        refreshProfile(newSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfile, updateCustomerState]);

  return (
    <AuthContext.Provider
      value={{
        session,
        authSession: session,
        user,
        customer: user,
        isAuthenticated,
        loading,
        isLoading: loading,
        error,
        refreshProfile,
        signOut,
        signOutAuth: signOut,
        setUser: (action) => {
          if (typeof action === 'function') {
            setUser((prev) => {
              const updated = action(prev);
              setCustomer(updated);
              return updated;
            });
          } else {
            setUser(action);
            setCustomer(action);
          }
        },
        setCustomer: (action) => {
          if (typeof action === 'function') {
            setCustomer((prev) => {
              const updated = action(prev);
              setUser(updated);
              return updated;
            });
          } else {
            setCustomer(action);
            setUser(action);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
