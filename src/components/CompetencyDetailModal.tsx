import React from 'react';
import { 
  X, 
  Info, 
  ListChecks, 
  Lightbulb, 
  Wrench, 
  Wand2, 
  ShieldCheck, 
  Sparkles,
  Search,
  MessageSquare,
  FileCode,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { CompetencyDomain } from '../types';

interface CompetencyDetailModalProps {
  competency: CompetencyDomain | null;
  onClose: () => void;
  onApplyToStudio: (comp: CompetencyDomain) => void;
}

export const CompetencyDetailModal: React.FC<CompetencyDetailModalProps> = ({
  competency,
  onClose,
  onApplyToStudio,
}) => {
  if (!competency) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-2xs border border-indigo-100">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                {competency.code}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {competency.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-grow space-y-4 text-xs text-slate-700 pr-1">
          {/* Overview Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-[11px] uppercase text-slate-500 mb-1.5 flex items-center">
              <Info className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
              Mô Tả Chi Tiết Chuẩn Bộ GD&ĐT
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed">
              {competency.fullDescription || competency.description}
            </p>
          </div>

          {/* Sub-competencies */}
          <div>
            <h4 className="font-bold text-[11px] uppercase text-slate-500 mb-2.5 flex items-center">
              <ListChecks className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
              Các Năng Lực Thành Phần & Mã Chỉ Báo
            </h4>
            <div className="space-y-2">
              {competency.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <span className="font-semibold text-slate-800 text-xs">
                    {comp.code}. {comp.title}
                  </span>
                  <span className="bg-indigo-50 text-indigo-800 font-mono text-[11px] font-extrabold px-2 py-0.5 rounded border border-indigo-100 shrink-0">
                    {comp.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Integration Recommendation */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-[11px] uppercase text-amber-900 mb-1.5 flex items-center">
              <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5" />
              Gợi Ý Vị Trí Tích Hợp Vào KHBD (Công văn 5512)
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {competency.lessonGuide}
            </p>
          </div>

          {/* AI Tools List */}
          <div>
            <h4 className="font-bold text-[11px] uppercase text-slate-500 mb-2 flex items-center">
              <Wrench className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              Công Cụ AI & Học Liệu Số Đề Xuất
            </h4>
            <div className="flex flex-wrap gap-2">
              {competency.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-lg font-bold flex items-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-slate-200 pt-4 mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1" />
            Thông tư 02/2025 & QĐ 3439
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Đóng
            </button>
            <button
              onClick={() => onApplyToStudio(competency)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              Áp Dụng Vào AI Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
