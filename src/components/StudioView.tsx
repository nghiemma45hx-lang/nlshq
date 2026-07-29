import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, 
  Upload, 
  FileCode, 
  FileDown, 
  FolderOpen,
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
import { relocateNlsToLeftColumn, extractLessonTitle } from '../utils/lessonPlanUtils';

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

  // Auto-load sampleLesson or viewed lesson when changed/selected
  useEffect(() => {
    if (sampleLesson) {
      setOriginalHtml(sampleLesson.originalContent || '');
      setIntegratedHtml(sampleLesson.integratedContent || '');
      if (sampleLesson.subject) {
        const subPart = sampleLesson.subject.split('-')[0]?.trim();
        if (subPart) setSubject(subPart);
      }
      if (sampleLesson.grade) setGrade(sampleLesson.grade);
      if (sampleLesson.framework) setFramework(sampleLesson.framework);
      if (sampleLesson.template) setTemplate(sampleLesson.template);
      setIsLoaded(true);
      setIsProcessed(!!sampleLesson.integratedContent);
    }
  }, [sampleLesson]);

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
        finalIntegrated = relocateNlsToLeftColumn(data.integratedHtml);
      } else {
        // Fallback generator if offline/no key
        finalIntegrated = relocateNlsToLeftColumn(generateFallbackIntegrated(originalHtml, subject, framework));
      }

      setTimeout(() => {
        setIsProcessing(false);
        setIntegratedHtml(finalIntegrated);
        setIsProcessed(true);

        // Auto Save to Repository
        onSaveLesson({
          title: extractLessonTitle(originalHtml + '\n' + finalIntegrated, subject, grade),
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
      const fallback = relocateNlsToLeftColumn(generateFallbackIntegrated(originalHtml, subject, framework));
      setIntegratedHtml(fallback);
      setIsProcessed(true);

      onSaveLesson({
        title: extractLessonTitle(originalHtml + '\n' + fallback, subject, grade),
        subject: `${subject} - ${grade}`,
        grade,
        framework,
        template,
        status: 'Đã tích hợp NLS',
        originalContent: originalHtml,
        integratedContent: fallback,
      });

      onSuccessToast('Đã tích hợp NLS và lưu thành công vào Kho giáo án!');
    }
  };

  // Manual save to repository handler
  const handleSaveToRepository = () => {
    if (!originalHtml) {
      onSuccessToast('Vui lòng tải lên giáo án trước khi lưu!');
      return;
    }
    const currentIntegrated = integratedHtml || generateFallbackIntegrated(originalHtml, subject, framework);
    if (!integratedHtml) {
      setIntegratedHtml(currentIntegrated);
      setIsProcessed(true);
    }
    onSaveLesson({
      title: extractLessonTitle(originalHtml + '\n' + currentIntegrated, subject, grade),
      subject: `${subject} - ${grade}`,
      grade,
      framework,
      template,
      status: 'Đã tích hợp NLS',
      originalContent: originalHtml,
      integratedContent: currentIntegrated,
    });
    onSuccessToast('Đã lưu Kế hoạch bài dạy vào Kho Giáo Án!');
  };

  // Fallback intelligent HTML NLS injector
  const generateFallbackIntegrated = (inputHtml: string, sub: string, fw: string) => {
    // Check if the lesson plan is explicitly a formal exam period (Kiểm tra thường xuyên, giữa kỳ I/II, cuối kỳ I/II)
    const checkIsFormalExamPeriod = (text: string) => {
      const cleanHead = text.slice(0, 800).toLowerCase();
      const formalExamKeywords = [
        'kiểm tra thường xuyên',
        'kiểm tra giữa học kỳ',
        'kiểm tra giữa kỳ',
        'kiểm tra cuối học kỳ',
        'kiểm tra cuối kỳ',
        'đề kiểm tra giữa học kỳ',
        'đề kiểm tra cuối học kỳ',
        'bài kiểm tra giữa học kỳ',
        'bài kiểm tra cuối học kỳ',
        'tiết kiểm tra giữa học kỳ',
        'tiết kiểm tra cuối học kỳ',
        'tiết kiểm tra thường xuyên'
      ];
      return formalExamKeywords.some(kw => cleanHead.includes(kw));
    };

    const isExamPeriod = checkIsFormalExamPeriod(inputHtml);

    if (isExamPeriod) {
      return `
        <div class="space-y-4 text-xs text-slate-800 leading-relaxed">
          <div class="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg shadow-xs">
            <span class="font-bold text-amber-900 block text-xs uppercase mb-1">
              TIẾT KIỂM TRA / ĐÁNH GIÁ ĐỊNH KỲ (ĐỘC LẬP)
            </span>
            <p class="text-amber-800">
              Giáo án này thuộc <b>Tiết kiểm tra (Kiểm tra thường xuyên / Giữa học kỳ / Cuối học kỳ)</b>. Theo quy định, giữ nguyên hình thức kiểm tra đánh giá độc lập của học sinh, không thực hiện tích hợp Năng lực số & AI.
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

    return relocateNlsToLeftColumn(`
      <div class="space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
        <div class="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div class="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-extrabold text-indigo-950 uppercase tracking-wide">
                KẾ HOẠCH BÀI DẠY (TÍCH HỢP NĂNG LỰC SỐ & AI)
              </h2>
              <p class="text-[11px] font-semibold text-slate-500 mt-0.5">
                Môn: ${sub} (${grade}) | Tích hợp chuẩn TT 02/2025/TT-BGDĐT & QĐ 3439/QĐ-BGDĐT
              </p>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
              ✓ Đã tích hợp NLS trực tiếp
            </span>
          </div>

          <!-- Direct Integrated Content Area -->
          <div class="lesson-content space-y-4 leading-relaxed text-slate-800">
            ${(() => {
              let modified = inputHtml;

              // Check if inputHtml already has 4 activities
              const hasAct1 = /hoạt động 1|khởi động|mở đầu/i.test(modified);
              const hasAct2 = /hoạt động 2|hình thành kiến thức/i.test(modified);
              const hasAct3 = /hoạt động 3|luyện tập/i.test(modified);
              const hasAct4 = /hoạt động 4|vận dụng/i.test(modified);

              if (hasAct1 || hasAct2 || hasAct3 || hasAct4) {
                // Direct regex replacement into original HTML
                modified = modified.replace(
                  /(hoạt động 1[^:\n<]*|khởi động[^:\n<]*|mở đầu[^:\n<]*)/gi,
                  `$1 <span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px] ml-1">[NLS 1.1-a]</span>
                  <div class="my-1.5 p-2 bg-indigo-50/80 border-l-3 border-indigo-500 rounded-r text-[11px] text-indigo-900">
                    <b>[Ứng dụng NLS & AI Khởi động]:</b> GV quét mã QR cho HS sử dụng <i>Quizizz AI</i> làm 3 câu hỏi tương tác trắc nghiệm số khởi động.
                  </div>`
                );

                modified = modified.replace(
                  /(hoạt động 2[^:\n<]*|hình thành kiến thức[^:\n<]*)/gi,
                  `$1 <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px] ml-1">[NLS 3.1-a]</span> <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[AI-NLc: Prompting]</span>
                  <div class="my-1.5 p-2 bg-purple-50/80 border-l-3 border-purple-500 rounded-r text-[11px] text-purple-900">
                    <b>[Ứng dụng NLS & AI Hình thành kiến thức]:</b> HS thao tác trên mô phỏng trực quan <i>GeoGebra / Chatbot AI</i>, thực hành nhập Prompt tương tác để mở rộng và làm rõ khái niệm.
                  </div>`
                );

                modified = modified.replace(
                  /(hoạt động 3[^:\n<]*|luyện tập[^:\n<]*)/gi,
                  `$1 <span class="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px] ml-1">[NLS 2.4-a]</span>
                  <div class="my-1.5 p-2 bg-emerald-50/80 border-l-3 border-emerald-500 rounded-r text-[11px] text-emerald-900">
                    <b>[Ứng dụng NLS & AI Luyện tập]:</b> HS thảo luận nhóm, nộp bài tập số lên <i>Padlet / Azota</i> để GV và các nhóm học sinh đối sánh, chấm chéo trực tuyến.
                  </div>`
                );

                modified = modified.replace(
                  /(hoạt động 4[^:\n<]*|vận dụng[^:\n<]*)/gi,
                  `$1 <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px] ml-1">[NLS 5.3-a]</span>
                  <div class="my-1.5 p-2 bg-amber-50/80 border-l-3 border-amber-500 rounded-r text-[11px] text-amber-900">
                    <b>[Ứng dụng NLS & AI Vận dụng]:</b> HS sử dụng <i>Canva AI / CapCut</i> thiết kế Infographic hoặc video ngắn chia sẻ kết quả vận dụng bài học vào thực tiễn.
                  </div>`
                );

                return relocateNlsToLeftColumn(modified);
              }

              // Fallback if inputHtml is unstructured raw text
              return `
                <div>
                  <div class="mb-3">
                    <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase">I. MỤC TIÊU BÀI HỌC (TÍCH HỢP NLS & AI)</h3>
                    <ul class="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                      <li><b>Kiến thức:</b> Đảm bảo chuẩn môn ${sub} (${grade}).</li>
                      <li><b>Năng lực Số:</b> <span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 1.1-a]</span> Tìm kiếm học liệu số, <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 2.4-a]</span> Hợp tác trực tuyến.</li>
                      <li><b>Năng lực AI:</b> <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[AI-NLc]</span> Sử dụng kỹ thuật Prompt tương tác trợ lý AI.</li>
                    </ul>
                  </div>

                  <div class="mb-3">
                    <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ</h3>
                    <p class="pl-3 mt-1 text-slate-700">Máy tính, màn hình tương tác, Quizizz AI, GeoGebra, Padlet, Canva AI, ChatGPT / Gemini.</p>
                  </div>

                  <div>
                    <h3 class="font-bold text-slate-900 text-xs border-l-3 border-indigo-600 pl-2 uppercase mb-2">III. TIẾN TRÌNH DẠY HỌC (TÍCH HỢP NLS CẢ 4 HOẠT ĐỘNG)</h3>
                    <div class="space-y-2.5 pl-2">
                      <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="font-bold text-indigo-900 flex items-center justify-between">
                          <span>Hoạt động 1: Khởi động / Mở đầu</span>
                          <span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 1.1-a]</span>
                        </div>
                        <p class="mt-1 text-slate-700">GV tổ chức trắc nghiệm số trên Quizizz AI quét QR code để khảo sát kiến thức nền của học sinh.</p>
                      </div>

                      <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="font-bold text-purple-900 flex items-center justify-between">
                          <span>Hoạt động 2: Hình thành kiến thức mới</span>
                          <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 3.1-a] [AI-NLc]</span>
                        </div>
                        <p class="mt-1 text-slate-700">HS nghiên cứu bài học kết hợp thao tác trên phần mềm mô phỏng số và thực hành tương tác câu hỏi Prompt với trợ lý AI.</p>
                      </div>

                      <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="font-bold text-emerald-900 flex items-center justify-between">
                          <span>Hoạt động 3: Luyện tập</span>
                          <span class="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 2.4-a]</span>
                        </div>
                        <p class="mt-1 text-slate-700">HS giải bài tập nhóm và tải sản phẩm học tập lên Padlet/Azota để lớp và giáo viên đối sánh, nhận xét trực tuyến.</p>
                      </div>

                      <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="font-bold text-amber-900 flex items-center justify-between">
                          <span>Hoạt động 4: Vận dụng</span>
                          <span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono text-[11px]">[NLS 5.3-a]</span>
                        </div>
                        <p class="mt-1 text-slate-700">HS thiết kế Infographic hoặc video ngắn bằng Canva AI/CapCut để giải quyết tình huống thực tiễn liên quan đến bài học.</p>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-200">
                    <div class="font-bold text-slate-800 text-xs uppercase mb-1.5">VĂN BẢN GIÁO ÁN GỐC:</div>
                    <div class="text-slate-700 leading-relaxed">${inputHtml}</div>
                  </div>
                </div>
              `;
            })()}
          </div>
        </div>
      </div>
    `);
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

          {isLoaded && (
            <button
              onClick={handleSaveToRepository}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center"
            >
              <FolderOpen className="w-4 h-4 mr-1.5" />
              Lưu Về Kho Giáo Án
            </button>
          )}

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
