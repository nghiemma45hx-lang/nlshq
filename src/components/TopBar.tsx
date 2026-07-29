import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Volume2, Sparkles } from 'lucide-react';

export const TopBar: React.FC = () => {
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
    <div className="bg-slate-950 text-slate-200 border-b border-indigo-900/50 text-xs py-2 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2 overflow-hidden shadow-inner">
      {/* Live Clock & Calendar */}
      <div className="flex items-center space-x-4 shrink-0 bg-indigo-950/80 border border-indigo-800/60 px-3 py-1 rounded-full text-indigo-200 font-mono shadow-xs">
        <div className="flex items-center space-x-1.5 font-bold text-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>{timeStr}</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Marquee Running Text moving Right to Left */}
      <div className="flex-1 w-full md:w-auto overflow-hidden flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1">
        <span className="shrink-0 flex items-center space-x-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Thông báo</span>
        </span>
        <div className="flex-1 overflow-hidden">
          <marquee 
            behavior="scroll" 
            direction="left" 
            scrollamount={6} 
            className="text-xs font-semibold text-indigo-200 tracking-wide"
          >
            Chào mừng quý thầy cô giáo đến với ứng dụng tích hợp năng lực số vào bài dạy.
          </marquee>
        </div>
      </div>
    </div>
  );
};
