import React, { useState } from 'react';
import { 
  Brain, 
  House, 
  Wand2, 
  FolderOpen, 
  BookMarked, 
  Scale, 
  User, 
  LogOut, 
  Zap, 
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onSwitchView: (view: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSwitchView, onOpenAuth }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Trang chủ', icon: House, badge: null },
    { id: 'studio', label: 'AI Studio Workstation', icon: Wand2, badge: 'Hot' },
    { id: 'repository', label: 'Kho Giáo Án', icon: FolderOpen, badge: null },
    { id: 'library', label: 'Thư Viện NLS & AI', icon: BookMarked, badge: null },
    { id: 'legal', label: 'Cơ Sở Pháp Lý', icon: Scale, badge: null },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Quản Trị Hệ Thống', icon: LayoutDashboard, badge: 'Admin' });
  }

  const handleNavClick = (viewId: string) => {
    onSwitchView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            onClick={() => onSwitchView('landing')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 leading-tight">
                  EduNLS AI
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                  2026
                </span>
                <span className="hidden sm:inline-flex bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300 items-center whitespace-nowrap" title="Đã kết nối cơ sở dữ liệu Supabase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Supabase DB
                </span>
              </div>
              <span className="block text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
                Tích Hợp Năng Lực Số & AI Chuẩn Bộ
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 relative ${
                    active
                      ? 'text-indigo-700 bg-indigo-50/90 border border-indigo-200 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 font-extrabold rounded-full whitespace-nowrap ${
                      item.badge === 'Admin' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Actions & Mobile Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {!currentUser ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-slate-600" />
                  <span className="whitespace-nowrap">Đăng Nhập</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition whitespace-nowrap"
                  title="Đăng nhập Quản trị viên"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    isAdmin ? 'bg-rose-600' : 'bg-indigo-600'
                  }`}>
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] sm:max-w-[130px] truncate whitespace-nowrap">
                    {currentUser.displayName}
                  </span>
                  {isAdmin && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200 whitespace-nowrap hidden sm:inline-block">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => onSwitchView('studio')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-xs transition whitespace-nowrap shrink-0"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-amber-300 fill-amber-300 shrink-0" />
              Tải Giáo Án Ngay
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
                    active
                      ? 'text-indigo-700 bg-indigo-50 border border-indigo-200 font-bold'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                      item.badge === 'Admin' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('studio')}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xs"
            >
              <Zap className="w-4 h-4 mr-1.5 text-amber-300 fill-amber-300" />
              Tải Giáo Án Ngay
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
