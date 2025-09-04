import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AppContextValue = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  notifications: string[];
  pushNotification: (message: string) => void;
  clearNotifications: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('drj-notifications');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('drj-notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const value = useMemo<AppContextValue>(() => ({
    sidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed((v) => !v),
    notifications,
    pushNotification: (message: string) => setNotifications((prev) => [message, ...prev].slice(0, 50)),
    clearNotifications: () => setNotifications([]),
  }), [sidebarCollapsed, notifications]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};


