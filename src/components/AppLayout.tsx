import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { EllipsisVertical, LayoutDashboard, MessageSquare, LifeBuoy, ShieldCheck, Package, GraduationCap, Wrench, Boxes, Users, Activity, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  // サービスページは不要のため削除
  { to: '/advice', label: 'IT相談', icon: MessageSquare },
  { to: '/helpdesk', label: 'ヘルプデスク', icon: LifeBuoy },
  { to: '/risk', label: 'リスク診断', icon: ShieldCheck },
  { to: '/procurement', label: 'PC調達', icon: Package },
  { to: '/training', label: '研修', icon: GraduationCap },
  { to: '/tooling', label: '導入支援', icon: Wrench },
  { to: '/assets', label: '資産管理', icon: Boxes },
  { to: '/accounts', label: 'アカウント', icon: Users },
  { to: '/ops', label: '保守・運用', icon: Activity },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
];

export const AppLayout: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー（幅いっぱい） */}
      <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 w-full">
        <div className="flex items-center gap-2">
          <img src="public/Dr-JoSys_icon.png" alt="Dr.情シス" className="h-[48px] w-[162px] object-contain" />
          {/* スマホ用 3点リーダー */}
          <button className="md:hidden px-2 py-1 rounded border border-border" onClick={() => setMobileOpen((v) => !v)} aria-label="Open Menu">
            <EllipsisVertical size={18} />
          </button>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text/70">{user?.name}</span>
            <button className="px-3 py-1 rounded-md border border-border" onClick={logout}>ログアウト</button>
          </div>
        )}
      </header>

      {/* モバイル用プルダウンメニュー（ヘッダー直下） */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-white">
          <nav className="p-2 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sub2 transition ${isActive ? 'bg-sub2 text-primary' : 'text-text'}`}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* 本体（サイドバーはヘッダーの下に） */}
      <div className="flex-1 grid md:grid-cols-[240px_1fr]">
        {/* デスクトップ用サイドバー */}
        <aside className="hidden md:block bg-white border-r border-border">
          <nav className="p-2 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sub2 transition ${isActive ? 'bg-sub2 text-primary' : 'text-text'}`}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-h-screen">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


