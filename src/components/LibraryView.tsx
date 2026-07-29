import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  ArrowRight,
  Search as SearchIcon,
  MessageSquare,
  FileCode,
  ShieldAlert,
  Wrench,
  Bot
} from 'lucide-react';
import { COMPETENCY_DOMAINS } from '../data/competencyData';
import { CompetencyDomain } from '../types';

interface LibraryViewProps {
  onSelectCompetency: (comp: CompetencyDomain) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectCompetency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('All');

  const filtered = COMPETENCY_DOMAINS.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFw = frameworkFilter === 'All' || comp.framework.includes(frameworkFilter);
    return matchesSearch && matchesFw;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Search': return SearchIcon;
      case 'MessageSquare': return MessageSquare;
      case 'FileCode': return FileCode;
      case 'ShieldAlert': return ShieldAlert;
      case 'Wrench': return Wrench;
      case 'Bot': return Bot;
      default: return Sparkles;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <BookMarked className="w-6 h-6 text-indigo-600 mr-2.5" />
            Thư Viện Năng Lực Số & AI Dành Cho Giáo Viên
          </h1>
          <p className="text-xs text-slate-500">
            Tra cứu 6 miền năng lực theo Thông tư 02/2025/TT-BGDĐT và 4 mạch năng lực AI theo QĐ 3439/QĐ-BGDĐT
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm miền / mạch năng lực..."
              className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <select
            value={frameworkFilter}
            onChange={(e) => setFrameworkFilter(e.target.value)}
            className="text-xs border border-slate-300 bg-white rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="All">Tất cả khung chuẩn</option>
            <option value="TT 02/2025">TT 02/2025/TT-BGDĐT</option>
            <option value="QĐ 3439">QĐ 3439/QĐ-BGDĐT</option>
          </select>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => {
          const IconComp = getIconComponent(comp.icon);
          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompetency(comp)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xl transition-colors border border-indigo-100">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full group-hover:bg-indigo-100 transition flex items-center">
                    Xem chi tiết <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide block mb-1">
                  {comp.code}
                </span>
                <h3 className="font-extrabold text-slate-800 text-base leading-snug mb-2 group-hover:text-indigo-600 transition">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {comp.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  Công cụ AI & Số đề xuất:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.tools.slice(0, 4).map((tool, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-medium group-hover:bg-slate-200 transition"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
