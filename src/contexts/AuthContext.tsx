import React, { createContext, useContext, useEffect,  useState } from 'react';

type User = { id: string; email: string; name?: string } | null;

type AuthContextValue = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const EMAIL_COOKIE = 'drj-email';
  const ONE_DAY_SECONDS = 60 * 60 * 24;

  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    const path = import.meta.env.BASE_URL || '/';
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=${path}`;
  };

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
      const [k, v] = c.split('=');
      if (k === name) return decodeURIComponent(v || '');
    }
    return null;
  };

  const deleteCookie = (name: string) => {
    const path = import.meta.env.BASE_URL || '/';
    document.cookie = `${name}=; max-age=0; path=${path}`;
  };

  useEffect(() => {
    const email = getCookie(EMAIL_COOKIE);
    if (email) {
      setUser({ id: 'u-' + Math.random().toString(36).slice(2), email });
    } else {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(getCookie(EMAIL_COOKIE)),
    login: (email: string, password: string) => {
      const emailTrimmed = email.trim();
      const passwordTrimmed = password.trim();
      if (!emailTrimmed || !passwordTrimmed) return;
      setCookie(EMAIL_COOKIE, emailTrimmed, ONE_DAY_SECONDS);
      setUser({ id: 'u-' + Math.random().toString(36).slice(2), email: emailTrimmed });
    },
    logout: () => {
      deleteCookie(EMAIL_COOKIE);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


