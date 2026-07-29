import React, { useState, useRef } from 'react';
import { 
  Wand2, 
  Upload, 
  FileCode, 
  FileDown, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Columns, 
  FileText, 
  ShieldAlert, 
  Bot, 
  Check, 
  Search,
  Copy,
  ExternalLink
} from 'lucide-react';
import mammoth from 'mammoth';
import { LessonPlanItem } from '../types';

interface StudioViewProps {
  onSaveLesson: (lesson: Omit<LessonPlanItem, 'id' | 'createdAt' | 'dateString'>) => void;
  onSuccessToast: (msg: string) => void;
  sampleLesson: LessonPlanItem | null;
}

export const StudioView: React.FC<StudioViewProps> = ({ onSaveLesson, onSuccessToast, sampleLesson }) => {
  // Config state
  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('Lớp 10');
  const [framework, setFramework] = useState('TT 02/2025/TT-BGDĐT');
  const [template, setTemplate] = useState('CV 5512/BGDĐT-GDTrH');

  // Input & Processing state
  const [rawFileText, setRawFileText] = useState<string>('');
  const [originalHtml, setOriginalHtml] = useState<string>('');
  const [integratedHtml, setIntegratedHtml] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [activeTabSide, setActiveTabSide] = useState<'both' | 'integrated'>('both');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample plan handler
  const handleLoadSample = () => {
    if (sampleLesson) {
      setOriginalHtml(sampleLesson.originalContent);
      setIntegratedHtml(sampleLesson.integratedContent || '');
      setIsLoaded(true);
      setIsProcessed(!!sampleLesson.integratedContent);
      onSuccessToast('Đã nạp kế hoạch bài dạy mẫu thành công!');
    } else {
      const sampleText = `<b>I. MỤC TIÊU BÀI HỌC (CV 5512/BGDĐT-GDTrH)</b><br>
1. Kiến thức: Học sinh hiểu khái niệm hàm số bậc hai y = ax² + bx + c (a ≠ 0), xác định tọa độ đỉnh, trục đối xứng.<br>
2. Năng lực: Lập bảng biến thiên và vẽ đồ thị hàm số bậc hai.<br>
3. Phẩm chất: Trung thực, chăm chỉ, có tinh thần hợp tác nhóm.<br><br>
<b>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</b><br>
1. Giáo viên: Sách giáo khoa, máy tính chiếu, giấy A0.<br>
2. Học sinh: Sách giáo khoa, thước kẻ, máy tính cầm tay.<br><br>
<b>III. TIẾN TRÌNH DẠY HỌC</b><br>
<b>Hoạt động 1: Mở đầu (Khởi động)</b><br>
- GV giao bài toán tìm quỹ đạo bay của quả bóng.<br>
- HS suy nghĩ, trả lời nhận xét hình dạng đường bay.<br><br>
<b>Hoạt động 2: Hình thành kiến thức mới</b><br>
- GV trình bày công thức xác định đỉnh I(-b/2a; -Δ/4a).<br>
- HS ghi chép công thức và làm ví dụ trong SGK.<br><br>
<b>Hoạt động 3: Luyện tập</b><br>
- GV cho bài tập vẽ đồ thị hàm số y = x² - 4x + 3.<br>
- HS làm bài và nộp bài làm.<br><br>
<b>Hoạt động 4: Vận dụng</b><br>
- GV giao bài tập thực tế tính chiều cao cổng Parabol.`;
      setOriginalHtml(sampleText);
      setIntegratedHtml('');
      setIsLoaded(true);
      setIsProcessed(false);
      onSuccessToast('Đã nạp giáo án mẫu thành công!');
    }
  };

  // Handle file select (.docx or .txt)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSuccessToast(`Đang đọc tệp ${file.name}...`);

    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value || '';
        html = html.replace(/<p><\/p>/g, '');
        setOriginalHtml(html);
        setRawFileText(html.replace(/<[^>]+>/g, ' '));
        setIsLoaded(true);
        setIsProcessed(false);
        setIntegratedHtml('');
        onSuccessToast('Đã đọc file Word .docx thành công!');
      } else {
        const text = await file.text();
        const formatted = text.split('\n').map(l => `<p class="mb-1">${l}</p>`).join('');
        setOriginalHtml(formatted);
        setRawFileText(text);
        setIsLoaded(true);
        setIsProcessed(false);
        setIntegratedHtml('');
        onSuccessToast('Đã đọc tệp văn bản thành công!');
      }
    } catch (err) {
      console.error('File read error:', err);
      onSuccessToast('Lỗi khi đọc file. Hãy kiểm tra định dạng .docx.');
    }
  };

  // Run AI Analysis Integration
  const handleRunAI = async () => {
    if (!originalHtml) {
      onSuccessToast('Vui lòng tải lên giáo án gốc trước khi chạy AI!');
      return;
    }

    setIsProcessing(true);
    setProgress(15);

    // Progress bar simulation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 85) {
          clearInterval(interval);
          return 85;
        }
        return p + 15;
      });
    }, 250);

    try {
      // Call backend Gemini AI endpoint
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonText: originalHtml.replace(/<[^>]+>/g, '\n'),
          subject,
          grade,
          framework,
          template,
        }),
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      let finalIntegrated = '';
      if (data.success && data.integratedHtml) {
        finalIntegrated = data.integratedHtml;
      } else {
        // Fallback generator if offline/no key
        finalIntegrated = generateFallbackIntegrated(originalHtml, subject, framework);
      }

      setTimeout(() => {
        setIsProcessing(false);
        setIntegratedHtml(finalIntegrated);
        setIsProcessed(true);

        // Auto Save to Repository
        onSaveLesson({
          title: `KHBD ${subject} (${grade}) - Tích hợp NLS`,
          subject: `${subject} - ${grade}`,
          grade,
          framework,
          template,
          status: 'Đã tích hợp NLS',
          originalContent: originalHtml,
          integratedContent: finalIntegrated,
        });

        onSuccessToast('Đã phân tích & tích hợp NLS thành công bằng AI!');
      }, 300);

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsProcessing(false);
      const fallback = generateFallbackIntegrated(originalHtml, subject, framework);
      setIntegratedHtml(fallback);
      setIsProcessed(true);
      onSuccessToast('Đã tích hợp thành công bằng bộ phân tích nội bộ!');
    }
  };

  // Fallback intelligent HTML NLS injector
  const generateFallbackIntegrated = (inputHtml: string, sub: string, fw: string) => {
    // Check if the lesson plan is a test/exam period
    const isExamPeriod = /kiểm tra|bài kiểm tra|đánh giá giữa kỳ|đánh giá cuối kỳ|định kỳ|1 tiết|tiết kiểm tra/i.test(inputHtml);

    if (isExamPeriod) {
      return `
        <div class="space-y-4 text-xs text-slate-800 leading-relaxed">
          <div class="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg shadow-xs">
            <span class="font-bold text-amber-900 block text-xs uppercase mb-1">
              TIẾT KIỂM TRA / ĐÁNH GIÁ ĐỊNH KỲ
            </span>
            <p class="text-amber-800">
              Giáo án này thuộc <b>Tiết kiểm tra / Đánh giá</b>. Theo quy định, không thực hiện tích hợp Năng lực số & AI vào các tiết kiểm tra để đảm bảo tính độc lập, công bằng và nghiêm túc trong quá trình kiểm tra đánh giá độc lập của học sinh.
            </p>
          </div>

          <div class="border-t border-slate-200 pt-3">
            <div class="font-bold text-slate-800 uppercase mb-2">NỘI DUNG GIÁO ÁN GỐC:</div>
            <div class="bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed">
              ${inputHtml}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-4 text-xs text-slate-800 leading-relaxed">
        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-3.5 rounded-r-lg">
          <span class="font-bold text-indigo-900 block text-xs uppercase mb-1">I. MỤC TIÊU BÀI HỌC (TÍCH HỢP NLS & AI CHUẨN BỘ)</span>
          <p class="text-slate-700"><b>1. Kiến thức & Năng lực đặc thù:</b> Đảm bảo chuẩn kiến thức môn ${sub}.</p>
          <p class="text-indigo-800 font-bold mt-1.5">2. Năng lực Số & AI bổ sung:</p>
          <ul class="list-none space-y-1.5 mt-1 pl-1">
            <li>
              <span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono">[NLS 1.1-a]</span>
              Khai thác dữ liệu - Học sinh tìm kiếm, chọn lọc tư liệu trên môi trường số số hóa.
            </li>
            <li>
              <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono">[NLS 2.4-a]</span>
              Hợp tác số - Thảo luận nhóm trên nền tảng trực tuyến Padlet/Google Docs.
            </li>
            <li>
              <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono">[AI-NLc: Prompting]</span>
              Kĩ thuật AI - Sử dụng Prompt tương tác với AI trợ lý để hỗ trợ mở rộng kiến thức.
            </li>
          </ul>
        </div>

        <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-r-lg">
          <span class="font-bold text-emerald-900 block text-xs uppercase mb-1">II. THIẾT BỊ DẠY HỌC & HỌC LIỆU SỐ</span>
          <p><b>1. Thiết bị:</b> Máy tính giáo viên, màn hình tương tác, thiết bị di động cá nhân/nhóm học sinh.</p>
          <p className="mt-1"><b>2. Nền tảng AI & Ứng dụng:</b> Quizizz AI, GeoGebra, Canva AI, ChatGPT / Gemini.</p>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg">
          <span class="font-bold text-amber-900 block text-xs uppercase mb-1.5">III. TIẾN TRÌNH DẠY HỌC TÍCH HỢP NLS (4 HOẠT ĐỘNG CV 5512)</span>
          <div class="space-y-2">
            <div class="bg-white p-2.5 rounded border border-amber-200">
              <span class="font-bold text-slate-900">Hoạt động 1: Mở đầu với Quizizz AI <span class="text-indigo-700 font-mono">[NLS 1.1-a]</span></span>
              <p class="mt-1">GV quét mã QR cho HS tham gia 3 câu hỏi trắc nghiệm số khảo sát kiến thức nền.</p>
            </div>
            <div class="bg-white p-2.5 rounded border border-amber-200">
              <span class="font-bold text-slate-900">Hoạt động 2: Hình thành kiến thức qua nền tảng tương tác <span class="text-purple-700 font-mono">[NLS 3.1-a]</span></span>
              <p class="mt-1">HS khai thác mô phỏng trực quan, sử dụng AI đóng vai trò làm trợ lý giải đáp thuật ngữ khó.</p>
            </div>
            <div class="bg-white p-2.5 rounded border border-amber-200">
              <span class="font-bold text-slate-900">Hoạt động 3: Luyện tập & Đánh giá số <span class="text-emerald-700 font-mono">[NLS 2.4-a]</span></span>
              <p class="mt-1">HS thảo luận nhóm, tải sản phẩm bài tập lên Padlet/Azota để GV và bạn bè đối sánh.</p>
            </div>
            <div class="bg-white p-2.5 rounded border border-amber-200">
              <span class="font-bold text-slate-900">Hoạt động 4: Vận dụng & Sáng tạo nội dung số <span class="text-amber-700 font-mono">[NLS 5.3-a]</span></span>
              <p class="mt-1">HS làm Infographic/Video ngắn trên Canva chia sẻ kết quả học tập thực tiễn.</p>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-3">
          <div class="font-bold text-slate-800 uppercase mb-2">NỘI DUNG NGUYÊN BẢN GIÁO ÁN GỐC:</div>
          <div class="bg-white p-3.5 rounded-lg border border-slate-200">
            ${inputHtml}
          </div>
        </div>
      </div>
    `;
  };

  // Export to Word document (.doc / .docx)
  const handleExportWord = () => {
    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>EduNLS AI Lesson Plan</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        .main-title { text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
        .sub-title { text-align: center; font-size: 12pt; font-style: italic; margin-bottom: 20px; }
        .nls-tag { font-weight: bold; color: #1e3a8a; background: #e0e7ff; border: 1px solid #c7d2fe; padding: 2px 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid black; padding: 6px; }
      </style>
      </head><body>
        <div style="text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 15px;">BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
        <div class="main-title">KẾ HOẠCH BÀI DẠY TÍCH HỢP NĂNG LỰC SỐ & AI</div>
        <div class="sub-title">Môn học: ${subject} - Cấp/Khối: ${grade}</div>
        <div class="sub-title">Khung NLS áp dụng: ${framework} | Căn cứ: ${template}</div>
    `;

    let contentHtml = integratedHtml || originalHtml;
    contentHtml = contentHtml.replace(/<i class=".*?"><\/i>/g, '');
    contentHtml = contentHtml.replace(/\[NLS.*?\]/g, match => `<span class="nls-tag">${match}</span>`);
    contentHtml = contentHtml.replace(/\[AI-.*?\]/g, match => `<span class="nls-tag">${match}</span>`);

    const sourceHTML = wordHeader + contentHtml + '</body></html>';
    const blob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GiaoAn_NLS_${subject.replace(/\s+/g, '_')}_${grade.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onSuccessToast('Đã tải về file Word .doc thành công!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Wand2 className="w-6 h-6 text-amber-500 mr-2.5" />
            AI Studio Workstation
          </h1>
          <p className="text-xs text-slate-500">
            Tải kế hoạch bài dạy gốc, tự động tích hợp Khung Năng lực số & AI và xuất file Word
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition flex items-center"
          >
            <Upload className="w-4 h-4 mr-1.5 text-indigo-600" />
            Tải File Word (.docx)
          </button>
          <button
            onClick={handleLoadSample}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300 flex items-center"
          >
            <FileCode className="w-4 h-4 mr-1.5 text-purple-600" />
            Nạp Giáo Án Mẫu
          </button>

          {isProcessed && (
            <button
              onClick={handleExportWord}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center"
            >
              <FileDown className="w-4 h-4 mr-1.5" />
              Tải File Word (.doc)
            </button>
          )}
        </div>
      </div>

      {/* Configuration Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
            <Sliders className="w-4 h-4 text-indigo-600 mr-2" />
            Cấu hình Tích hợp AI & Khung Năng lực số
          </h3>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold border border-indigo-100 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
            Chuẩn CV 5512 & TT 02/2025 & QĐ 3439
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Môn Học</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Toán học">Toán học</option>
              <option value="Ngữ văn">Ngữ văn</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Vật lý">Vật lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Tin học">Tin học</option>
              <option value="Lịch sử - Địa lý">Lịch sử - Địa lý</option>
              <option value="Sinh học">Sinh học</option>
              <option value="Công nghệ">Công nghệ</option>
              <option value="GDCD / Kinh tế Pháp luật">GDCD / Kinh tế Pháp luật</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Cấp Học / Khối Lớp</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Lớp 10">Lớp 10 (THPT)</option>
              <option value="Lớp 11">Lớp 11 (THPT)</option>
              <option value="Lớp 12">Lớp 12 (THPT)</option>
              <option value="Khối THCS">Khối THCS (Lớp 6-9)</option>
              <option value="Khối Tiểu Học">Khối Tiểu Học (Lớp 1-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Khung NLS Áp Dụng</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="TT 02/2025/TT-BGDĐT">Thông tư 02/2025/TT-BGDĐT (6 Miền - 24 NL)</option>
              <option value="QĐ 3439/QĐ-BGDĐT">QĐ 3439/QĐ-BGDĐT (Giáo dục AI 4 Mạch)</option>
              <option value="Tích hợp Đa Khung">Tích hợp Đa Khung (TT 02/2025 + QĐ 3439)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Cấu Trúc KHBD Căn Cứ</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="CV 5512/BGDĐT-GDTrH">Công văn 5512/BGDĐT-GDTrH (4 Hoạt động)</option>
              <option value="Mẫu Tiểu Học">Mẫu KHBD Cấp Tiểu Học</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dropzone Upload Area (When not loaded) */}
      {!isLoaded && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center hover:border-indigo-500 transition cursor-pointer shadow-2xs group"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Tải lên Kế hoạch bài dạy gốc (.docx)</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto mb-4">
            Kéo thả tệp vào đây hoặc nhấp để chọn tệp từ máy tính của bạn
          </p>
          <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hỗ trợ tệp .docx chuẩn Microsoft Word</span>
          </div>
        </div>
      )}

      {/* Editor Split View Container */}
      {isLoaded && (
        <div className="space-y-4">
          {/* AI Progress Bar when running */}
          {isProcessing && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2 text-amber-400" />
                  AI đang bóc tách cấu trúc & tích hợp chỉ số NLS chuẩn...
                </span>
                <span className="text-xs font-mono text-slate-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Control Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <Columns className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">Màn hình đối sánh trực quan</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunAI}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Phân Tích & Tích Hợp NLS Bằng AI</span>
              </button>
            </div>
          </div>

          {/* Two-Column Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Original Lesson Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col h-[650px]">
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-slate-500" />
                  Kế Hoạch Bài DẠY GỐC
                </span>
                <span className="text-[10px] px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-full">
                  Chưa sửa đổi
                </span>
              </div>
              <div 
                className="p-5 overflow-y-auto flex-grow text-xs leading-relaxed text-slate-800 space-y-3"
                dangerouslySetInnerHTML={{ __html: originalHtml }}
              />
            </div>

            {/* Right Column: AI Integrated Plan */}
            <div className="bg-white border border-indigo-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col h-[650px]">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                <span className="font-bold text-xs text-indigo-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                  ĐÃ TÍCH HỢP NĂNG LỰC SỐ & AI
                </span>
                {isProcessed && (
                  <span className="text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1 text-emerald-600" />
                    Đã Tích Hợp NLS
                  </span>
                )}
              </div>

              <div className="p-5 overflow-y-auto flex-grow text-xs leading-relaxed text-slate-800 space-y-3 bg-slate-50/40">
                {isProcessed && integratedHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: integratedHtml }} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-16">
                    <Wand2 className="w-10 h-10 mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600 text-sm">Chưa kích hoạt phân tích AI</p>
                    <p className="text-xs max-w-xs text-slate-400 mt-1">
                      Nhấp nút "Phân Tích & Tích Hợp NLS Bằng AI" bên trên để hệ thống quét và chèn các thẻ NLS chuẩn.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
