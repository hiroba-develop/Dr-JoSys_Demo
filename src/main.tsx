import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Advice } from './pages/Advice';
// 削除: ヘルプデスク
import { Tasks } from './pages/Tasks';
// 削除: リスク診断, PC調達, 研修, 導入支援
import { Accounts } from './pages/Accounts';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { PasswordReset } from './pages/PasswordReset';
import { PasswordReRegister } from './pages/PasswordReRegister';
import { ItAssets } from './pages/ItAssets';
import { ServiceAssets } from './pages/ServiceAssets';
import { Company } from './pages/Company';
import { FAQ } from './pages/FAQ';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

const getCookie = (name: string): string | null => {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    const [k, v] = c.split('=');
    if (k === name) return decodeURIComponent(v || '');
  }
  return null;
};

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const email = getCookie('drj-email');
  if (!email) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/password/reset" element={<PasswordReset />} />
            <Route path="/password/re-register" element={<PasswordReRegister />} />
            <Route element={<AppLayout />}>
              <Route index element={<Protected><Dashboard /></Protected>} />
              <Route path="advice" element={<Protected><Advice /></Protected>} />
              <Route path="tasks" element={<Protected><Tasks /></Protected>} />
              <Route path="it-assets" element={<Protected><ItAssets /></Protected>} />
              <Route path="service-assets" element={<Protected><ServiceAssets /></Protected>} />
              <Route path="company" element={<Protected><Company /></Protected>} />
              <Route path="accounts" element={<Protected><Accounts /></Protected>} />
              <Route path="faq" element={<Protected><FAQ /></Protected>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);


