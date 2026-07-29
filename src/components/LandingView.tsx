import React from 'react';
import { TopBar } from './TopBar';
import { 
  Sparkles, 
  Upload, 
  BookOpen, 
  Wand2, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Bot,
  Zap,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react';

interface LandingViewProps {
  onSwitchView: (view: string) => void;
  onLoadSample: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSwitchView, onLoadSample }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8 rounded-b-2xl shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Chuẩn Khung Năng Lực Số TT 02/2025/TT-BGDĐT & QĐ 3439/QĐ-BGDĐT</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug max-w-3xl mx-auto uppercase">
            TÍCH HỢP <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-300">NĂNG LỰC SỐ</span> VÀO DẠY HỌC
          </h1>

          {/* Clock, Date, and Scrolling Text Bar placed below the main title */}
          <TopBar />
        </div>
      </section>

      {/* 4-Step Workflow Visual Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Quy Trình Tối Ưu Tự Động
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">4 Bước Tích Hợp Năng Lực Số & AI Dễ Dàng</h2>
          <p className="text-slate-600 text-sm mt-1">Dựa trên mô hình phân tích tự động chuẩn hóa Công văn 5512</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-extrabold mb-4">1</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Tải File Giáo Án Gốc</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Hỗ trợ định dạng <code className="bg-slate-100 px-1 rounded font-mono text-indigo-700">.docx</code> hoặc văn bản. Hệ thống tự động bóc tách Mục tiêu & Tiến trình 4 Hoạt động.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-extrabold mb-4">2</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Cấu Hình Căn Cứ NLS</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Lựa chọn Môn học, Khối lớp, Khung Thông tư 02/2025/TT-BGDĐT hoặc Quyết định 3439/QĐ-BGDĐT phù hợp.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-extrabold mb-4">3</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">AI Bóc Tách & Tích Hợp</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Gợi ý thiết bị số, nền tảng AI (ChatGPT, Quizizz, GeoGebra, Canva) & chèn thẻ mã chỉ báo số <code className="text-indigo-700 bg-indigo-50 font-bold px-1 rounded">[NLS 1.1-a]</code>.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-extrabold mb-4">4</div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Xem Đối Sánh & Tải Word</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Kiểm tra bản so sánh 2 cột trực quan (Bài dạy gốc vs Đã tích hợp) và tải file Word hoàn chỉnh về máy tính.</p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/70 py-12 rounded-3xl border border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Giải Pháp Đột Phá Giúp Giáo Viên Tiết Kiệm 90% Thời Gian Soạn Bài
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Được xây dựng chuyên biệt đáp ứng yêu cầu chuyển đổi số toàn ngành giáo dục Việt Nam năm 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Trợ Lý AI Đa Mô Hình (Gemini 3.6 Flash)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mô hình ngôn ngữ thế hệ mới am hiểu tường tận văn phong sư phạm Việt Nam, đề xuấtPrompt AI mẫu bài bản cho học sinh và giáo viên.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Khung Chỉ Báo Tự Động Định Dạng</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mã hóa chính xác các chỉ số <code className="bg-indigo-50 text-indigo-800 font-mono font-bold px-1 rounded">[NLS 1.1-a]</code>, <code className="bg-amber-50 text-amber-800 font-mono font-bold px-1 rounded">[AI-NLb]</code> tương ứng từng môn học.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Bảo Mật & Lưu Trữ Đổ Dữ Liệu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quản lý Kho Giáo án cá nhân an toàn, hỗ trợ xem lại, chỉnh sửa hoặc xuất file Word bất kỳ lúc nào từ thiết bị của bạn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
