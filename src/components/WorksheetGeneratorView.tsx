import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  Save, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  RotateCcw,
  Paperclip,
  Trash2,
  Image as ImageIcon,
  Upload,
  Info,
  Clock,
  Users,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  buildDynamicLocalWorksheet, 
  exportToWordDocument, 
  printWorksheetDocument, 
  exportWorksheetAsImage 
} from '../utils/worksheetUtils';

interface WorksheetGeneratorViewProps {
  onSuccessToast: (msg: string) => void;
  onSwitchView: (view: string) => void;
}

export const WorksheetGeneratorView: React.FC<WorksheetGeneratorViewProps> = ({
  onSuccessToast,
  onSwitchView
}) => {
  const { currentUser } = useAuth();

  // Form Fields
  const [schoolName, setSchoolName] = useState<string>('Trường THCS Hồng Quang');
  const [durationMinutes, setDurationMinutes] = useState<string>('20 phút');
  const [workMode, setWorkMode] = useState<string>('Nhóm'); // 'Cá nhân' | 'Cặp đôi' | 'Nhóm'
  const [subject, setSubject] = useState<string>('Ngữ văn');
  const [grade, setGrade] = useState<string>('Khối 8');
  const [lessonTitle, setLessonTitle] = useState<string>('Khám phá kiến thức bài học');
  const [sourceNotes, setSourceNotes] = useState<string>(`I. TRI THỨC VĂN HỌC / KIẾN THỨC BÀI HỌC:
- Tác phẩm / Văn bản: Tìm hiểu về văn bản nhật dụng & văn học hiện đại.
- Nội dung chính: Phân tích các chi tiết tiêu biểu, hình ảnh tượng trưng và thông điệp tác giả gửi gắm.
- Bài học đúc kết: Tình yêu thương, tinh thần trách nhiệm và lòng nhân ái trong cuộc sống.
- Công thức & Quy luật bổ trợ: $E = m \\cdot c^2$ và $\\Delta = b^2 - 4ac$.`);
  const [additionalNotes, setAdditionalNotes] = useState<string>('Thiết kế bảng so sánh 3 cột và thêm 2 câu trắc nghiệm ngắn củng cố.');

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation & Results State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generatedHtml, setGeneratedHtml] = useState<string>(() => {
    return buildDynamicLocalWorksheet({
      schoolName: 'Trường THCS Hồng Quang',
      durationMinutes: '20 phút',
      workMode: 'Nhóm',
      subject: 'Ngữ văn',
      grade: 'Khối 8',
      lessonTitle: 'Khám phá kiến thức bài học',
      sourceNotes: `I. TRI THỨC VĂN HỌC / KIẾN THỨC BÀI HỌC:
- Tác phẩm / Văn bản: Tìm hiểu về văn bản nhật dụng & văn học hiện đại.
- Nội dung chính: Phân tích các chi tiết tiêu biểu, hình ảnh tượng trưng và thông điệp tác giả gửi gắm.
- Bài học đúc kết: Tình yêu thương, tinh thần trách nhiệm và lòng nhân ái trong cuộc sống.
- Công thức & Quy luật bổ trợ: $E = m \\cdot c^2$ và $\\Delta = b^2 - 4ac$.`,
      additionalNotes: 'Thiết kế bảng so sánh 3 cột và thêm 2 câu trắc nghiệm ngắn củng cố.'
    });
  });

  const [aiSource, setAiSource] = useState<string>('Chuẩn Bộ GD&ĐT');

  // Load File Handler (.docx or .txt)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.name.endsWith('.docx')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value) {
          setSourceNotes(result.value);
          onSuccessToast(`Đã đọc nội dung từ tệp Word "${file.name}" thành công!`);
        }
      } catch (err) {
        console.error('Error reading docx file:', err);
        alert('Không thể đọc tệp Word. Vui lòng thử tệp khác hoặc dán trực tiếp văn bản.');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setSourceNotes(text);
          onSuccessToast(`Đã đọc nội dung từ tệp "${file.name}"!`);
        }
      };
      reader.readAsText(file);
    }
  };

  // Generate Worksheet Handler
  const handleGenerateWorksheet = async () => {
    if (!sourceNotes.trim()) {
      alert('Vui lòng nhập hoặc tải lên Note / Tài liệu nguồn để tạo phiếu học tập!');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(15);

    const timer = setInterval(() => {
      setGenerationProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 400);

    try {
      const res = await fetch('/api/gemini/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          durationMinutes,
          workMode,
          subject,
          grade,
          lessonTitle,
          sourceNotes,
          additionalNotes
        })
      });

      clearInterval(timer);
      setGenerationProgress(100);

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();
      if (data.worksheetHtml) {
        setGeneratedHtml(data.worksheetHtml);
        setAiSource(data.source || 'gemini-2.5-flash');
        onSuccessToast('Tạo phiếu học tập khám phá kiến thức thành công!');
      } else {
        const fallback = buildDynamicLocalWorksheet({
          schoolName,
          durationMinutes,
          workMode,
          subject,
          grade,
          lessonTitle,
          sourceNotes,
          additionalNotes
        });
        setGeneratedHtml(fallback);
        onSuccessToast('Tạo phiếu học tập hoàn tất (Máy tạo nội dung)!');
      }
    } catch (err) {
      console.error('Error generating worksheet:', err);
      clearInterval(timer);
      const fallback = buildDynamicLocalWorksheet({
        schoolName,
        durationMinutes,
        workMode,
        subject,
        grade,
        lessonTitle,
        sourceNotes,
        additionalNotes
      });
      setGeneratedHtml(fallback);
      onSuccessToast('Đã tạo phiếu học tập (Chế độ dự phòng)!');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Copy to Clipboard Handler
  const handleCopyToClipboard = async () => {
    const printArea = document.getElementById('worksheet-print-area');
    if (!printArea) return;

    try {
      const textToCopy = printArea.innerText || printArea.textContent || '';
      await navigator.clipboard.writeText(textToCopy);
      onSuccessToast('Đã sao chép nội dung phiếu học tập vào bộ nhớ tạm!');
    } catch {
      alert('Không thể sao chép tự động. Quý thầy cô vui lòng bôi đen và nhấn Ctrl+C.');
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 py-6 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl mb-6 border border-indigo-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
              <FileSpreadsheet className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide uppercase">
                  TẠO PHIẾU HỌC TẬP KHÁM PHÁ KIẾN THỨC
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  CHUẨN BỘ 10 PHẦN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                Chuyên gia thiết kế phiếu học tập cho giáo viên phổ thông — Bám sát 100% Note tài liệu nguồn, trình bày LaTeX, hỗ trợ xuất Word, PDF và Ảnh PNG.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onSwitchView('landing')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold border border-white/20 transition flex items-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Trang chủ</span>
            </button>
            <button
              onClick={() => onSwitchView('studio')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition shadow-md flex items-center cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
              <span>AI Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FORM CONTROLS (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
              Cấu Hình Thông Tin Phiếu Học Tập
            </h2>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Trường: Hồng Quang
            </span>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1">
              Tên Trường / Đơn vị dạy học:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="VD: Trường THCS Hồng Quang"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject & Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Môn học:
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                <option value="Tin học">Tin học</option>
                <option value="Vật lí">Vật lí</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="GDCD / GD KT&PL">GDCD / GD KT&PL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Khối lớp:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Khối 6">Khối 6</option>
                <option value="Khối 7">Khối 7</option>
                <option value="Khối 8">Khối 8</option>
                <option value="Khối 9">Khối 9</option>
                <option value="Khối 10">Khối 10</option>
                <option value="Khối 11">Khối 11</option>
                <option value="Khối 12">Khối 12</option>
              </select>
            </div>
          </div>

          {/* Lesson Title */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1">
              Tên bài học / Chủ đề khám phá:
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="VD: Ôn tập Tác phẩm văn học / Phương trình bậc hai..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Duration & Work Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Thời lượng thực hiện:
              </label>
              <input
                type="text"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="VD: 15 phút, 20 phút, 30 phút"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Hình thức học tập:
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Cá nhân">Cá nhân</option>
                <option value="Cặp đôi">Cặp đôi</option>
                <option value="Nhóm">Nhóm</option>
              </select>
            </div>
          </div>

          {/* Source Notes Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-slate-900 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Nội dung tài liệu nguồn (Note):
              </label>

              {/* Upload Word/Text Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition flex items-center cursor-pointer"
              >
                <Upload className="w-3 h-3 mr-1" />
                Tải tệp Word / Note (.docx)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFileName && (
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 p-1.5 rounded-lg mb-1.5 flex items-center justify-between">
                <span className="truncate">📄 Đã nạp: <strong>{uploadedFileName}</strong></span>
                <button 
                  onClick={() => setUploadedFileName(null)}
                  className="text-slate-400 hover:text-rose-600 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <textarea
              rows={6}
              value={sourceNotes}
              onChange={(e) => setSourceNotes(e.target.value)}
              placeholder="Dán hoặc nhập nội dung bài học, tài liệu nguồn (Note) tại đây. AI sẽ căn cứ duy nhất vào nội dung này để tạo phiếu..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
            />
            <p className="text-[11px] text-slate-500 mt-1 italic">
              * Bắt buộc: AI chỉ dùng thông tin trong Note, không bịa thêm ngoài nguồn. Nếu thiếu thông tin sẽ ghi "Không thấy trong tài liệu nguồn".
            </p>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1">
              Ghi chú / Yêu cầu tùy chỉnh bổ sung:
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="VD: Thiết kế bảng so sánh 3 cột, chèn công thức toán LaTeX..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Generate Button */}
          <button
            disabled={isGenerating}
            onClick={handleGenerateWorksheet}
            className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm text-slate-950 transition-all duration-200 shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
              isGenerating
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-500 active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            <span>{isGenerating ? 'Đang Tạo Phiếu Học Tập AI...' : 'BẮT ĐẦU TẠO PHIẾU HỌC TẬP KHÁM PHÁ'}</span>
          </button>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-1">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-2 transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-center font-bold text-amber-700">
                Đang xử lý tài liệu nguồn & đóng gói 10 phần cấu trúc... ({generationProgress}%)
              </div>
            </div>
          )}

          {/* Prompt Guidelines Notice */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5 text-xs text-indigo-950 space-y-1.5">
            <div className="font-extrabold flex items-center text-indigo-900">
              <Info className="w-4 h-4 mr-1.5 text-indigo-700 shrink-0" />
              Quy Chuẩn Biên Soạn Phiếu Học Tập & Đáp Án:
            </div>
            <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-2 text-[11px] font-bold text-amber-950 mb-1">
              📌 Nguyên tắc: Đọc kỹ 100% ngữ liệu gửi lên. Tuyệt đối không thêm ngữ liệu ngoài. Đơn lập & Tách biệt Đáp án / Hướng dẫn chấm ở cuối phiếu.
            </div>
            <ol className="list-decimal list-inside text-[11px] text-indigo-900 space-y-0.5 pl-1 leading-snug">
              <li>Tiêu đề phiếu bài dạy & Trường THCS Hồng Quang</li>
              <li>Thông tin học sinh / nhóm & hình thức học tập</li>
              <li>Mục tiêu học tập (Kiến thức, Năng lực, Phẩm chất)</li>
              <li>Tình huống khởi động dẫn dắt từ ngữ liệu</li>
              <li>Nhiệm vụ quan sát / Đọc tài liệu nguồn</li>
              <li>Câu hỏi gợi mở từ dễ đến khó (Mức 1 - Mức 3)</li>
              <li>Bảng hoặc chỗ trống điền từ / sơ đồ khuyết</li>
              <li>Phần học sinh tự rút ra kết luận</li>
              <li>Hai câu kiểm tra nhanh củng cố</li>
              <li>Tự đánh giá học sinh & Lời phê giáo viên</li>
              <li className="font-bold text-indigo-950">PHẦN TÁCH BIỆT: Đáp án & Hướng dẫn chấm chi tiết dành cho Giáo viên</li>
            </ol>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW & EXPORTS (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          
          {/* Action Toolbar */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-extrabold text-amber-300">PHIẾU HỌC TẬP ĐÃ TẠO</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                {aiSource}
              </span>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              
              {/* Export Word */}
              <button
                onClick={() => exportToWordDocument(generatedHtml, `Phieu_Hoc_Tap_${subject}_${grade}.doc`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-sm cursor-pointer"
                title="Tải tệp Word (.docx / .doc) với đầy đủ bảng và căn lề chuẩn"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Tải Word (.docx)</span>
              </button>

              {/* Print / PDF */}
              <button
                onClick={() => printWorksheetDocument('worksheet-print-area')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-sm cursor-pointer"
                title="Mở giao diện in A4 hoặc lưu thành tệp PDF"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                <span>In / Tải PDF</span>
              </button>

              {/* Export Image */}
              <button
                onClick={() => exportWorksheetAsImage('worksheet-print-area', `Phieu_Hoc_Tap_${subject}.png`)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-sm cursor-pointer"
                title="Xuất phiếu học tập thành hình ảnh chất lượng cao (.png)"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                <span>Xuất Ảnh (.png)</span>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopyToClipboard}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center cursor-pointer"
                title="Sao chép nội dung để dán trực tiếp vào Word"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>Sao Chép</span>
              </button>

            </div>
          </div>

          {/* WORKSHEET DISPLAY PREVIEW AREA */}
          <div className="bg-slate-100 p-3 sm:p-4 rounded-2xl border border-slate-300 overflow-x-auto min-h-[600px]">
            <div 
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />
          </div>

          {/* Bottom Info Note */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1 border-t border-slate-200">
            <span>
              💡 Mẹo: Quý thầy cô có thể bấm <strong>"Tải Word (.docx)"</strong> để chỉnh sửa phông chữ hoặc bấm <strong>"In / Tải PDF"</strong> để in trực tiếp cho học sinh trên lớp.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
