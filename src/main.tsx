import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Advice } from './pages/Advice';
import { Helpdesk } from './pages/Helpdesk';
import { RiskAssessment } from './pages/RiskAssessment';
import { Procurement } from './pages/Procurement';
import { Training } from './pages/Training';
import { Tooling } from './pages/Tooling';
import { Assets } from './pages/Assets';
import { Accounts } from './pages/Accounts';
import { Ops } from './pages/Ops';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { FAQ } from './pages/FAQ';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route index element={<Protected><Dashboard /></Protected>} />
              <Route path="advice" element={<Protected><Advice /></Protected>} />
              <Route path="helpdesk" element={<Protected><Helpdesk /></Protected>} />
              <Route path="risk" element={<Protected><RiskAssessment /></Protected>} />
              <Route path="procurement" element={<Protected><Procurement /></Protected>} />
              <Route path="training" element={<Protected><Training /></Protected>} />
              <Route path="tooling" element={<Protected><Tooling /></Protected>} />
              <Route path="assets" element={<Protected><Assets /></Protected>} />
              <Route path="accounts" element={<Protected><Accounts /></Protected>} />
              <Route path="ops" element={<Protected><Ops /></Protected>} />
              <Route path="faq" element={<Protected><FAQ /></Protected>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);


