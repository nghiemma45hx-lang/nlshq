import React from 'react';
import { 
  House, 
  Wand2, 
  FolderOpen, 
  BookOpen, 
  Scale, 
  LayoutDashboard,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useHeroConfig } from '../context/HeroConfigContext';

interface NavigationCardsProps {
  currentView: string;
  onSwitchView: (view: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  landing: House,
  studio: Wand2,
  exam: FileCheck,
  repository: FolderOpen,
  library: BookOpen,
  legal: Scale,
  admin: LayoutDashboard
};

const DEFAULT_ICON_BG: Record<string, string> = {
  landing: 'bg-indigo-500/20 text-indigo-300',
  studio: 'bg-amber-400/20 text-amber-300',
  exam: 'bg-rose-500/20 text-rose-300',
  repository: 'bg-emerald-500/20 text-emerald-300',
  library: 'bg-purple-500/20 text-purple-300',
  legal: 'bg-amber-500/20 text-amber-300',
  admin: 'bg-rose-500/20 text-rose-300'
};

export const NavigationCards: React.FC<NavigationCardsProps> = ({ currentView, onSwitchView }) => {
  const { heroConfig } = useHeroConfig();

  return (
    <div className={`bg-gradient-to-r ${heroConfig.bannerBgTheme || 'from-slate-950 via-indigo-950 to-slate-950'} text-white border-b border-indigo-900/60 py-3.5 px-3 sm:px-6 shadow-md relative z-30 transition-all duration-300`}>
      <div className="max-w-[1536px] mx-auto">
        <div className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest mb-2.5 flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>LỰA CHỌN CHỨC NĂNG / CHUYỂN HƯỚNG HỆ THỐNG</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {heroConfig.navCards.map((item) => {
            const Icon = ICON_MAP[item.id] || House;
            const isActive = currentView === item.id;
            const iconBg = DEFAULT_ICON_BG[item.id] || 'bg-indigo-500/20 text-indigo-300';

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
                      : `${item.cardBgColor || 'bg-slate-900/90'} hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50`
                }`}
              >
                {/* Active check badge */}
                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm z-10">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-amber-400 text-slate-950 font-bold" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className={`text-xs sm:text-xs font-extrabold transition-colors ${
                    isActive ? 'text-amber-300' : `${item.textColor || 'text-white'} group-hover:text-indigo-200`
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
