import React from 'react';
import { 
  Brain, 
  User, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onSwitchView: (view: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSwitchView, onOpenAuth }) => {
  const { currentUser, isAdmin, logout } = useAuth();

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

          {/* User Profile / Auth Actions (Admin / Đăng nhập Card) */}
          <div className="flex items-center space-x-2 shrink-0">
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition whitespace-nowrap shadow-2xs"
                >
                  <User className="w-4 h-4 mr-1.5 text-slate-600" />
                  <span className="whitespace-nowrap font-bold">Đăng Nhập</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition whitespace-nowrap shadow-2xs"
                  title="Đăng nhập Quản trị viên"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" />
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 ${
                    isAdmin ? 'bg-rose-600' : 'bg-indigo-600'
                  }`}>
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[120px] sm:max-w-[150px] truncate whitespace-nowrap">
                    {currentUser.displayName}
                  </span>
                  {isAdmin && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-rose-200 whitespace-nowrap">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 border border-rose-200"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
