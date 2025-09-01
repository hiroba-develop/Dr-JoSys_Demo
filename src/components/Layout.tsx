import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// サイドバーのナビゲーションアイテム
const navigationItems = [
  { name: "相談チャット", path: "/" },
  { name: "ファイル共有", path: "/files" },
];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ログアウト処理
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
      {/* ヘッダー */}
      <header className="shadow-sm border-b flex-shrink-0" style={{ backgroundColor: '#222831', borderColor: '#393E46' }}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="ml-2 text-base sm:text-lg font-bold" style={{ color: '#00ADB5' }}>相談アプリ</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex md:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium" style={{ color: '#EEEEEE' }}>
                      {user?.name}さん
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-80 transition-all border"
                      style={{ backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-3 md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md hover:opacity-80 focus:outline-none transition-all"
                  style={{ color: '#EEEEEE', backgroundColor: 'transparent' }}
                >
                  <span className="sr-only">メニューを開く</span>
                  {/* ハンバーガーメニューアイコン */}
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    style={{ color: '#EEEEEE' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden" style={{ backgroundColor: '#222831' }}>
            <div className="pt-4 pb-3 space-y-1 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-4 py-3 border-l-4 text-base font-medium rounded-r-lg transition-all hover:opacity-80"
                  style={{
                    borderColor: location.pathname === item.path ? '#00ADB5' : '#393E46',
                    color: location.pathname === item.path ? '#00ADB5' : '#EEEEEE',
                    backgroundColor: location.pathname === item.path ? 'rgba(0, 173, 181, 0.1)' : 'transparent'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t" style={{ borderColor: '#393E46' }}>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#393E46' }}>
                    <span className="text-lg font-medium" style={{ color: '#EEEEEE' }}>
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium" style={{ color: '#EEEEEE' }}>
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#393E46' }}>
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium hover:opacity-80 transition-all rounded-md"
                  style={{ color: '#EEEEEE', backgroundColor: '#00ADB5' }}
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* サイドバー（デスクトップ） */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 lg:w-80 border-r h-full" style={{ borderColor: '#393E46', backgroundColor: '#222831' }}>
            <div className="flex-1 flex flex-col pt-4 lg:pt-6 pb-4 overflow-y-auto">
              <nav className="mt-4 lg:mt-6 flex-1 px-3 lg:px-4 space-y-2 lg:space-y-3" style={{ backgroundColor: '#222831' }}>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-md border transition-all hover:opacity-80 ${
                      location.pathname === item.path ? "shadow-sm" : ""
                    }`}
                    style={{
                      backgroundColor: location.pathname === item.path ? '#00ADB5' : '#393E46',
                      color: location.pathname === item.path ? 'white' : '#EEEEEE',
                      borderColor: location.pathname === item.path ? '#00ADB5' : '#393E46'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-hidden focus:outline-none">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
