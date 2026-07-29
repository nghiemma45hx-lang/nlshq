import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto mt-8 bg-slate-900/90 text-slate-200 border border-indigo-800/60 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
      {/* Live Clock & Calendar */}
      <div className="flex items-center space-x-3 shrink-0 bg-indigo-950/90 border border-indigo-800/80 px-3.5 py-1.5 rounded-xl text-indigo-200 font-mono text-xs shadow-xs">
        <div className="flex items-center space-x-1.5 font-bold text-amber-300">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{timeStr}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Marquee Running Text moving Right to Left */}
      <div className="flex-1 w-full md:w-auto overflow-hidden flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5">
        <span className="shrink-0 flex items-center space-x-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>THÔNG BÁO</span>
        </span>
        <div className="flex-1 overflow-hidden">
          <marquee 
            behavior="scroll" 
            direction="left" 
            scrollamount={6} 
            className="text-xs sm:text-sm font-semibold text-indigo-100 tracking-wide"
          >
            Chào mừng quý thầy cô giáo đến với ứng dụng tích hợp năng lực số vào bài dạy.
          </marquee>
        </div>
      </div>
    </div>
  );
};
