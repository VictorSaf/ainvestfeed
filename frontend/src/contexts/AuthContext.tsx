import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from '../lib/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getAccessToken());
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token,
    token,
    login: (t: string) => { setAccessToken(t); setTokenState(t); },
    logout: () => { clearAccessToken(); setTokenState(null); },
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


