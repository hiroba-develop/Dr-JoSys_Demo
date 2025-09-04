import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { id: string; name: string } | null;

type AuthContextValue = {
  user: User;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('drj-user');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (name: string) => {
      const u: User = { id: 'u-' + Math.random().toString(36).slice(2), name };
      setUser(u);
      try { localStorage.setItem('drj-user', JSON.stringify(u)); } catch {}
    },
    logout: () => {
      setUser(null);
      try { localStorage.removeItem('drj-user'); } catch {}
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


