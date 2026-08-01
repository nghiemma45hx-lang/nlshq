import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeroBannerConfig, NavCardConfigItem } from '../types';

export const DEFAULT_HERO_CONFIG: HeroBannerConfig = {
  badgeText: 'Chuẩn Khung Năng Lực Số TT 02/2025/TT-BGDĐT & QĐ 3439/QĐ-BGDĐT',
  badgeColor: 'bg-indigo-900/60 text-indigo-200 border-indigo-700/50',
  mainTitlePrefix: 'TÍCH HỢP ',
  mainTitleHighlight: 'NĂNG LỰC SỐ',
  mainTitleSuffix: ' VÀO DẠY HỌC',
  highlightColor: 'from-amber-300 via-amber-200 to-amber-400',
  tickerBadge: 'THÔNG BÁO',
  tickerText: 'Chào mừng quý thầy cô giáo đến với tích hợp năng lực số vào bài dạy.',
  bannerBgTheme: 'from-slate-950 via-indigo-950 to-slate-950',
  navCards: [
    {
      id: 'landing',
      title: 'Trang Chủ',
      sub: 'Tổng quan hệ thống',
      badge: 'Trang chủ',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
    {
      id: 'studio',
      title: 'AI Studio',
      sub: 'Tích hợp NLS tự động',
      badge: 'HOT',
      badgeColor: 'bg-amber-400 text-amber-950 font-extrabold',
      cardBgColor: 'bg-gradient-to-br from-indigo-950 to-purple-950',
      textColor: 'text-amber-200',
      isHot: true
    },
    {
      id: 'exam',
      title: 'Tạo Đề Kiểm Tra',
      sub: 'Ma trận & Đặc tả chuẩn',
      badge: 'MỚI 2026',
      badgeColor: 'bg-rose-500 text-white font-extrabold',
      cardBgColor: 'bg-gradient-to-br from-rose-950 to-purple-950',
      textColor: 'text-rose-200',
      isHot: true
    },
    {
      id: 'exam-repo',
      title: 'Kho Đề Kiểm Tra',
      sub: 'Lưu trữ & Bảo mật đề',
      badge: 'Kho Đề',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
    {
      id: 'repository',
      title: 'Kho Giáo Án',
      sub: 'Kế hoạch bài dạy NLS',
      badge: 'Kho Giáo Án',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
    {
      id: 'library',
      title: 'Thư Viện NLS',
      sub: 'TT 02/2025 & AI',
      badge: 'Chỉ báo',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
    {
      id: 'legal',
      title: 'Cơ Sở Pháp Lý',
      sub: 'QĐ 3439 & CV 5512',
      badge: 'Pháp lý',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
    {
      id: 'admin',
      title: 'Quản Trị Hệ Thống',
      sub: 'Báo cáo & Người dùng',
      badge: 'Admin',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      cardBgColor: 'bg-slate-900/90',
      textColor: 'text-white',
    },
  ]
};

const STORAGE_KEY = 'EDU_HERO_CONFIG_2026';

interface HeroConfigContextType {
  heroConfig: HeroBannerConfig;
  updateHeroConfig: (newConfig: HeroBannerConfig) => void;
  updateNavCard: (id: string, updatedCard: Partial<NavCardConfigItem>) => void;
  resetHeroConfig: () => void;
}

const HeroConfigContext = createContext<HeroConfigContextType | undefined>(undefined);

export const HeroConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        return {
          ...DEFAULT_HERO_CONFIG,
          ...parsed,
          navCards: parsed.navCards && parsed.navCards.some((c: any) => c.id === 'exam-repo')
            ? parsed.navCards 
            : DEFAULT_HERO_CONFIG.navCards
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_HERO_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(heroConfig));
    } catch (e) {
      console.error('Failed to save Hero config', e);
    }
  }, [heroConfig]);

  const updateHeroConfig = (newConfig: HeroBannerConfig) => {
    setHeroConfig(newConfig);
  };

  const updateNavCard = (id: string, updatedCard: Partial<NavCardConfigItem>) => {
    setHeroConfig(prev => ({
      ...prev,
      navCards: prev.navCards.map(c => c.id === id ? { ...c, ...updatedCard } : c)
    }));
  };

  const resetHeroConfig = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
  };

  return (
    <HeroConfigContext.Provider value={{ heroConfig, updateHeroConfig, updateNavCard, resetHeroConfig }}>
      {children}
    </HeroConfigContext.Provider>
  );
};

export const useHeroConfig = () => {
  const context = useContext(HeroConfigContext);
  if (!context) {
    throw new Error('useHeroConfig must be used within HeroConfigProvider');
  }
  return context;
};
