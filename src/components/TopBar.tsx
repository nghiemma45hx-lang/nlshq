import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { useHeroConfig } from '../context/HeroConfigContext';

export const TopBar: React.FC = () => {
  const { heroConfig } = useHeroConfig();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const daysVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysVi[now.getDay()];

  const timeStr = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateStr = `${dayName}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 bg-slate-900/90 text-slate-200 border border-indigo-800/60 rounded-xl p-2 sm:p-2.5 flex flex-col md:flex-row items-center justify-between gap-2 shadow-xl backdrop-blur-md">
      {/* Live Clock & Calendar */}
      <div className="flex items-center space-x-2.5 shrink-0 bg-indigo-950/90 border border-indigo-800/80 px-3 py-1 rounded-lg text-indigo-200 font-mono text-xs shadow-xs">
        <div className="flex items-center space-x-1 font-bold text-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{timeStr}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Marquee Running Text moving Right to Left */}
      <div className="flex-1 w-full md:w-auto overflow-hidden flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1">
        <span className="shrink-0 flex items-center space-x-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 z-10">
          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
          <span>{heroConfig.tickerBadge || 'THÔNG BÁO'}</span>
        </span>
        <div className="flex-1 overflow-hidden relative flex items-center h-6">
          <div 
            className="animate-marquee text-xs font-semibold text-indigo-100 tracking-wide cursor-pointer"
            title="Rê chuột vào để tạm dừng chữ chạy"
          >
            {heroConfig.tickerText || 'Chào mừng quý thầy cô giáo đến với ứng dụng tích hợp năng lực số vào bài dạy.'}
          </div>
        </div>
      </div>
    </div>
  );
};
