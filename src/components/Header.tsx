import React from 'react';
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
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onSwitchView: (view: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSwitchView, onOpenAuth }) => {
  const { currentUser, isAdmin, logout } = useAuth();

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

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onSwitchView('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">
                  EduNLS AI
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                  2026
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300 flex items-center" title="Đã kết nối cơ sở dữ liệu Supabase uqkhrynrdobxglnjguhb">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Supabase DB
                </span>
              </div>
              <span className="block text-xs text-slate-500 font-medium -mt-0.5">
                Tích Hợp Năng Lực Số & AI Chuẩn Bộ
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSwitchView(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center space-x-1.5 relative ${
                    active
                      ? 'text-indigo-700 bg-indigo-50/80 border border-indigo-100 shadow-2xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 font-bold rounded-full ${
                      item.badge === 'Admin' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="flex items-center space-x-3">
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  <User className="w-4 h-4 mr-1.5 text-slate-600" />
                  Đăng Nhập
                </button>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition"
                  title="Đăng nhập Quản trị viên"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isAdmin ? 'bg-rose-600' : 'bg-indigo-600'
                  }`}>
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">
                    {currentUser.displayName}
                  </span>
                  {isAdmin && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => onSwitchView('studio')}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-sm hover:shadow transition"
            >
              <Zap className="w-4 h-4 mr-1.5 text-amber-300 fill-amber-300" />
              Tải Giáo Án Ngay
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
