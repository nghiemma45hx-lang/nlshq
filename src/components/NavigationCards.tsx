import React from 'react';
import { 
  House, 
  Wand2, 
  FolderOpen, 
  BookOpen, 
  Scale, 
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';

interface NavigationCardsProps {
  currentView: string;
  onSwitchView: (view: string) => void;
}

export const NavigationCards: React.FC<NavigationCardsProps> = ({ currentView, onSwitchView }) => {
  const navItems = [
    {
      id: 'landing',
      title: 'Trang Chủ',
      sub: 'Tổng quan hệ thống',
      badge: 'Trang chủ',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: House,
      iconBg: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      id: 'studio',
      title: 'AI Studio',
      sub: 'Tích hợp NLS tự động',
      badge: 'HOT',
      badgeColor: 'bg-amber-400 text-amber-950 font-extrabold animate-pulse shadow-xs',
      icon: Wand2,
      iconBg: 'bg-amber-400/20 text-amber-300',
      isHot: true
    },
    {
      id: 'repository',
      title: 'Kho Giáo Án',
      sub: 'Lưu trữ Supabase DB',
      badge: 'Kho bài',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: FolderOpen,
      iconBg: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'library',
      title: 'Thư Viện NLS',
      sub: 'TT 02/2025 & AI',
      badge: 'Chỉ báo',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: BookOpen,
      iconBg: 'bg-purple-500/20 text-purple-300',
    },
    {
      id: 'legal',
      title: 'Cơ Sở Pháp Lý',
      sub: 'QĐ 3439 & CV 5512',
      badge: 'Pháp lý',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Scale,
      iconBg: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'admin',
      title: 'Quản Trị Hệ Thống',
      sub: 'Báo cáo & Người dùng',
      badge: 'Admin',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: LayoutDashboard,
      iconBg: 'bg-rose-500/20 text-rose-300',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-b border-indigo-900/60 py-3.5 px-3 sm:px-6 shadow-md relative z-30">
      <div className="max-w-[1536px] mx-auto">
        <div className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest mb-2.5 flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>LỰA CHỌN CHỨC NĂNG / CHUYỂN HƯỚNG HỆ THỐNG</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSwitchView(item.id)}
                className={`group relative p-2.5 sm:p-3 rounded-2xl transition-all duration-200 text-left flex flex-col justify-between shadow-md cursor-pointer ${
                  isActive
                    ? item.isHot
                      ? 'bg-gradient-to-br from-indigo-800 to-purple-800 border-2 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20'
                      : 'bg-indigo-900/90 border-2 border-indigo-400 ring-2 ring-indigo-400/30 shadow-indigo-500/20'
                    : item.isHot
                      ? 'bg-gradient-to-br from-indigo-950 to-purple-950 hover:from-indigo-900 hover:to-purple-900 border border-amber-400/40 hover:border-amber-300'
                      : 'bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                {/* Active check badge */}
                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm z-10">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-amber-400 text-slate-950 font-bold" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className={`text-xs sm:text-xs font-extrabold transition-colors ${
                    isActive ? 'text-amber-300' : 'text-white group-hover:text-indigo-200'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
