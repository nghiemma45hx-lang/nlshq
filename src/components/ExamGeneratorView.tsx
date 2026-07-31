import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { 
  FileCheck, 
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
  ListOrdered,
  HelpCircle,
  FileSpreadsheet,
  Paperclip,
  Link,
  Trash2,
  Image,
  ExternalLink,
  Upload
} from 'lucide-react';
import { LessonPlanItem } from '../types';

interface ExamGeneratorViewProps {
  onSaveLesson: (lesson: Partial<LessonPlanItem>) => Promise<void>;
  onSuccessToast: (msg: string) => void;
  onSwitchView: (view: string) => void;
}

export const ExamGeneratorView: React.FC<ExamGeneratorViewProps> = ({
  onSaveLesson,
  onSuccessToast,
  onSwitchView
}) => {
  // Step 0: Initializing questions according to PDF standard
  const [examType, setExamType] = useState<string>('Giữa học kì I');
  const [outputOption, setOutputOption] = useState<string>('3'); // 1: Matrix only, 2: Matrix+Spec, 3: Full dossier

  // Question Structure Selection Counters (Specific user request)
  const [mcqCount, setMcqCount] = useState<number>(12); // Trắc nghiệm khoanh đáp án đúng
  const [trueFalseCount, setTrueFalseCount] = useState<number>(0); // Trắc nghiệm lựa chọn đúng sai
  const [fillBlankCount, setFillBlankCount] = useState<number>(0); // Trắc nghiệm điền khuyết
  const [matchingCount, setMatchingCount] = useState<number>(0); // Trắc nghiệm Nối
  const [shortAnswerCount, setShortAnswerCount] = useState<number>(0); // Trắc nghiệm trả lời ngắn
  const [essayCount, setEssayCount] = useState<number>(2); // Tự luận

  // Exam details
  const [subject, setSubject] = useState<string>('Ngữ văn');
  const [grade, setGrade] = useState<string>('Khối 8');
  const [durationMinutes, setDurationMinutes] = useState<string>('60');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS LÊ QUÝ ĐÔN');
  const [headerDept, setHeaderDept] = useState<string>('SỞ GIÁO DỤC VÀ ĐÀO TẠO');
  
  const [topicScope, setTopicScope] = useState<string>(
    `Chủ đề 1: Thơ vần bằng và thơ tự do (Bài 1 & Bài 2)
Chủ đề 2: Văn bản nghị luận "Lời sông núi" (Nam quốc sơn hà, Hịch tướng sĩ, Tinh thần yêu nước của nhân dân ta)
Chủ đề 3: Thực hành tiếng Việt (Đoạn văn diễn dịch, quy nạp, song song, từ Hán Việt)
Chủ đề 4: Viết bài văn nghị luận phân tích một tác phẩm văn học`
  );

  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Cấu trúc đề tích hợp theo quy chuẩn GDPT 2018. Bố trí ma trận, đặc tả và đáp án thang điểm 10.'
  );

  // Attachment & Google Drive Link States
  interface AttachedFileItem {
    id: string;
    name: string;
    size: string;
    type: string;
    content?: string;
  }

  interface AttachedDriveLink {
    id: string;
    url: string;
    title: string;
  }

  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([]);
  const [driveLinks, setDriveLinks] = useState<AttachedDriveLink[]>([]);
  const [showDriveInput, setShowDriveInput] = useState<boolean>(false);
  const [driveInputUrl, setDriveInputUrl] = useState<string>('');
  const [driveInputTitle, setDriveInputTitle] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const sizeKb = (file.size / 1024).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKb} KB`;
      
      let fileType = 'other';
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (['doc', 'docx'].includes(ext)) fileType = 'word';
      else if (ext === 'pdf') fileType = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) fileType = 'image';
      else if (['txt', 'md', 'json', 'csv', 'html', 'xml'].includes(ext)) fileType = 'text';

      const newItem: AttachedFileItem = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: sizeStr,
        type: fileType,
        content: '',
      };

      if (fileType === 'word') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          if (result && result.value && result.value.trim().length > 0) {
            newItem.content = result.value.trim();
            onSuccessToast(`Đã đọc & trích xuất ${newItem.content.length} ký tự từ file "${file.name}"!`);
          } else {
            // Fallback decode
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const raw = decoder.decode(arrayBuffer);
            const cleaned = raw.replace(/[^\x20-\x7E\u00C0-\u024F\u1EA0-\u1EF9\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim();
            newItem.content = cleaned.slice(0, 15000);
            onSuccessToast(`Đã đọc nội dung văn bản từ file "${file.name}"!`);
          }
        } catch (err) {
          console.warn('Mammoth extraction fallback:', err);
          const reader = new FileReader();
          reader.onload = (event) => {
            const raw = (event.target?.result as string) || '';
            newItem.content = raw.replace(/[^\x20-\x7E\u00C0-\u024F\u1EA0-\u1EF9\n\r\t]+/g, ' ').replace(/\s+/g, ' ').slice(0, 15000);
            onSuccessToast(`Đã nhận file "${file.name}"!`);
          };
          reader.readAsText(file);
        }
      } else if (fileType === 'pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawText = decoder.decode(arrayBuffer);
          const matches = rawText.match(/[\u0020-\u007E\u00C0-\u024F\u1EA0-\u1EF9]{4,}/g);
          if (matches && matches.length > 0) {
            const filtered = matches.filter(m => !m.includes('obj') && !m.includes('endobj') && !m.includes('stream') && !m.includes('PDF')).join(' ');
            newItem.content = filtered.slice(0, 15000);
            onSuccessToast(`Đã đọc & trích xuất văn bản từ PDF "${file.name}"!`);
          } else {
            newItem.content = `[Nội dung từ file PDF: ${file.name}]`;
            onSuccessToast(`Đã đính kèm file PDF "${file.name}"!`);
          }
        } catch (e) {
          newItem.content = `[Nội dung từ file PDF: ${file.name}]`;
          onSuccessToast(`Đã đính kèm file PDF "${file.name}"!`);
        }
      } else if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          newItem.content = `[Ảnh đính kèm chụp đề/SGK: ${file.name}]`;
          onSuccessToast(`Đã đính kèm ảnh "${file.name}"!`);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          newItem.content = (event.target?.result as string) || '';
          onSuccessToast(`Đã đọc nội dung từ file "${file.name}"!`);
        };
        reader.readAsText(file);
      }

      setAttachedFiles(prev => [...prev, newItem]);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAddDriveLink = () => {
    if (!driveInputUrl.trim()) return;
    let url = driveInputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newLink: AttachedDriveLink = {
      id: Date.now().toString(),
      url: url,
      title: driveInputTitle.trim() || 'Tài liệu Google Drive / SGK Online',
    };

    setDriveLinks(prev => [...prev, newLink]);
    setDriveInputUrl('');
    setDriveInputTitle('');
    setShowDriveInput(false);
    onSuccessToast('Đã đính kèm Link Drive/SGK online thành công!');
  };

  const handleRemoveDriveLink = (id: string) => {
    setDriveLinks(prev => prev.filter(l => l.id !== id));
  };

  // Quick Question Structure Preset applier
  const handleApplyStructurePreset = (preset: 'standard' | 'diverse' | 'thpt' | 'essayOnly') => {
    if (preset === 'standard') {
      setMcqCount(12);
      setTrueFalseCount(0);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(0);
      setEssayCount(2);
      onSuccessToast('Đã áp dụng cấu trúc Chuẩn THCS/THPT (12 MCQ + 2 Tự luận)!');
    } else if (preset === 'diverse') {
      setMcqCount(8);
      setTrueFalseCount(2);
      setFillBlankCount(2);
      setMatchingCount(2);
      setShortAnswerCount(2);
      setEssayCount(1);
      onSuccessToast('Đã áp dụng cấu trúc Tích hợp Đa dạng 6 dạng câu hỏi!');
    } else if (preset === 'thpt') {
      setMcqCount(18);
      setTrueFalseCount(4);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(6);
      setEssayCount(0);
      onSuccessToast('Đã áp dụng cấu trúc Mẫu Thi THPT Quốc Gia Mới!');
    } else if (preset === 'essayOnly') {
      setMcqCount(0);
      setTrueFalseCount(0);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(0);
      setEssayCount(4);
      onSuccessToast('Đã áp dụng cấu trúc 100% Tự luận (4 câu)!');
    }
  };

  // Loading & generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [generatedExamHtml, setGeneratedExamHtml] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'matrix' | 'spec' | 'exam' | 'rubric'>('all');

  // Load Presets
  const handleLoadPreset = (presetType: 'literary' | 'math' | 'english' | 'physics') => {
    if (presetType === 'literary') {
      setSubject('Ngữ văn');
      setGrade('Khối 8');
      setExamType('Giữa học kì I');
      setDurationMinutes('60');
      setMcqCount(12);
      setTrueFalseCount(0);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(0);
      setEssayCount(2);
      setTopicScope(
        `1. Văn bản đọc hiểu: Hịch tướng sĩ (Trần Quốc Tuấn), Nam quốc sơn hà, Tinh thần yêu nước của nhân dân ta (Hồ Chí Minh).
2. Tiếng Việt: Nghĩa của từ Hán Việt, Đoạn văn diễn dịch - quy nạp.
3. Tập làm văn: Viết bài văn nghị luận xã hội về tinh thần tự học.`
      );
      setAdditionalNotes('Tỉ lệ: 60% Đọc hiểu (Trắc nghiệm 12 câu + Tự luận ngắn 2 câu), 40% Viết tập làm văn.');
      onSuccessToast('Đã tải mẫu thông số Đề thi Giữa HK1 Môn Ngữ văn 8!');
    } else if (presetType === 'math') {
      setSubject('Toán học');
      setGrade('Khối 10');
      setExamType('Cuối học kì I');
      setDurationMinutes('90');
      setMcqCount(12);
      setTrueFalseCount(4);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(4);
      setEssayCount(2);
      setTopicScope(
        `1. Mệnh đề & Tập hợp (Tập con, giao, hợp, hiệu của các khoảng đoạn).
2. Bất phương trình & Hệ bất phương trình bậc nhất hai ẩn.
3. Hàm số bậc hai & Đồ thị ($y = ax^2 + bx + c$).
4. Giá trị lượng giác của một góc từ $0^\\circ$ đến $180^\\circ$, Tích vô hướng của hai vectơ.
5. Véc-tơ trong mặt phẳng tọa độ.`
      );
      setAdditionalNotes('Gồm 12 Trắc nghiệm MCQ, 4 Đúng/Sai, 4 Trả lời ngắn và 2 Tự luận.');
      onSuccessToast('Đã tải mẫu thông số Đề thi Cuối HK1 Môn Toán 10!');
    } else if (presetType === 'english') {
      setSubject('Tiếng Anh');
      setGrade('Khối 9');
      setExamType('Giữa học kì II');
      setDurationMinutes('60');
      setMcqCount(15);
      setTrueFalseCount(0);
      setFillBlankCount(5);
      setMatchingCount(5);
      setShortAnswerCount(5);
      setEssayCount(1);
      setTopicScope(
        `Unit 7: Recipes and Eating Habits (Vocabulary & Grammar: Quantifiers, Modal verbs in conditional sentences type 1).
Unit 8: Tourism (Compound nouns, Articles: a/an/the/zero article).
Phonics: Intonation on questions & lists. Reading comprehension & Writing transformation.`
      );
      setAdditionalNotes('Đề tích hợp Tiếng Anh 9 gồm MCQ, Điền khuyết, Nối và Viết lại câu.');
      onSuccessToast('Đã tải mẫu thông số Đề thi Giữa HK2 Tiếng Anh 9!');
    } else if (presetType === 'physics') {
      setSubject('Vật lí');
      setGrade('Khối 11');
      setExamType('Cuối học kì II');
      setDurationMinutes('45');
      setMcqCount(18);
      setTrueFalseCount(4);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(4);
      setEssayCount(2);
      setTopicScope(
        `1. Điện trường: Lực Cu-lông, Cường độ điện trường $E = \\frac{F}{q}$, Đường sức điện.
2. Điện thế & Hiệu điện thế, Tụ điện $C = \\frac{Q}{U}$.
3. Dòng điện không đổi, Cường độ dòng điện $I = \\frac{q}{t}$, Định luật Ôm cho toàn mạch.`
      );
      setAdditionalNotes('Gồm 18 câu MCQ + 4 câu Đúng/Sai + 4 câu Trả lời ngắn + 2 câu Tự luận bài tập.');
      onSuccessToast('Đã tải mẫu thông số Đề thi Cuối HK2 Vật lí 11!');
    }
  };

  // Generate Exam Dossier via API
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setProgressStep('Đang rà soát tài liệu & phân tích phạm vi kiểm tra...');

    const titleStr = `Đề kiểm tra ${examType} ${subject} - ${grade} (${durationMinutes} phút)`;
    setGeneratedTitle(titleStr);

    let fullTopicScopePayload = '';

    if (attachedFiles.length > 0) {
      fullTopicScopePayload += `====================================================\n`;
      fullTopicScopePayload += `YÊU CẦU QUAN TRỌNG NHẤT: BÁM SÁT 100% NỘI DUNG TỪ TỆP DỮ LIỆU ĐỊNH KÈM NÀY ĐỂ RA ĐỀ THI, MA TRẬN & ĐÁP ÁN.\n`;
      fullTopicScopePayload += `BẠN BẮT BUỘC DÙNG DỮ LIỆU KIẾN THỨC, CÂU HỎI VÀ TÁC PHẨM TRONG TỆP ĐÃ TẢI LÊN. KHÔNG DÙNG CÁC TÁC PHẨM VÀ BÀI HỌC VÍ DỤ KHÔNG CÓ TRONG TỆP!\n`;
      fullTopicScopePayload += `====================================================\n\n`;

      attachedFiles.forEach((f, idx) => {
        fullTopicScopePayload += `--- TỆP ĐÍNH KÈM #${idx + 1}: ${f.name} (${f.type.toUpperCase()}, Dung lượng: ${f.size}) ---\n`;
        fullTopicScopePayload += `${f.content || 'Nội dung file: ' + f.name}\n\n`;
      });
    }

    if (driveLinks.length > 0) {
      fullTopicScopePayload += `--- DANH SÁCH LINK DRIVE / SGK ONLINE TÍCH HỢP ---\n`;
      driveLinks.forEach((l) => {
        fullTopicScopePayload += `- Tên tài liệu: ${l.title} | URL: ${l.url}\n`;
      });
      fullTopicScopePayload += `\n`;
    }

    fullTopicScopePayload += `--- PHẠM VI BÀI HỌC BỔ SUNG KHÁC ---:\n${topicScope}`;

    try {
      setTimeout(() => setProgressStep('Đang thiết lập Ma trận đề & Tỉ lệ phần trăm (40% NB - 30% TH - 30% VD)...'), 1200);
      setTimeout(() => setProgressStep('Đang biên soạn Bảng đặc tả chi tiết từng câu hỏi & Yêu cầu cần đạt...'), 2500);
      setTimeout(() => setProgressStep('Đang trình bày Đề kiểm tra chính thức & Định dạng Công thức LaTeX...'), 4000);
      setTimeout(() => setProgressStep('Đang tổng hợp Đáp án & Hướng dẫn chấm chi tiết thang điểm 10...'), 5500);

      const response = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType,
          outputOption,
          subject,
          grade,
          topicScope: fullTopicScopePayload,
          schoolName,
          headerDept,
          durationMinutes,
          additionalNotes,
          questionStructure: {
            mcqCount,
            trueFalseCount,
            fillBlankCount,
            matchingCount,
            shortAnswerCount,
            essayCount,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.examHtml) {
        setGeneratedExamHtml(data.examHtml);
        onSuccessToast('Đã khởi tạo xong Hồ sơ Đề kiểm tra chuẩn Bộ!');
      } else {
        // Fallback robust template generation
        generateLocalFallbackExam();
      }
    } catch (err) {
      console.warn('API call error, using local fallback:', err);
      generateLocalFallbackExam();
    } finally {
      setIsGenerating(false);
      setProgressStep('');
    }
  };

  // Local Fallback Generator in case of offline/network limits
  const generateLocalFallbackExam = () => {
    const isOption1 = outputOption === '1';
    const isOption2 = outputOption === '2';

    const localHtml = `
      <div class="exam-dossier-document space-y-8 font-sans text-slate-800">
        
        <!-- SECTION 1: PHÂN TÍCH PHẠM VI KIỂM TRA -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="border-b border-indigo-100 pb-3 mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-indigo-900 flex items-center">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black mr-2">I</span>
              PHÂN TÍCH PHẠM VI KIỂM TRA (${examType.toUpperCase()})
            </h2>
            <span class="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
              Môn: ${subject} - ${grade}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-indigo-900 text-white font-bold">
                  <th class="p-2.5 border border-slate-300 w-12 text-center">STT</th>
                  <th class="p-2.5 border border-slate-300">Chủ đề / Nội dung kiến thức</th>
                  <th class="p-2.5 border border-slate-300">Bài học thuộc phạm vi</th>
                  <th class="p-2.5 border border-slate-300">Yêu cầu cần đạt (Chương trình GDPT 2018)</th>
                  <th class="p-2.5 border border-slate-300">Mức độ đánh giá</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 border border-slate-300 text-center font-bold">1</td>
                  <td class="p-2.5 border border-slate-300 font-bold text-indigo-900">Đọc hiểu Văn bản / Lý thuyết trọng tâm</td>
                  <td class="p-2.5 border border-slate-300">${topicScope.split('\n')[0] || 'Chủ đề 1'}</td>
                  <td class="p-2.5 border border-slate-300">Nhận biết được các chi tiết, thông tin cốt lõi, phương thức biểu đạt, cú pháp, công thức và quy luật.</td>
                  <td class="p-2.5 border border-slate-300"><span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Nhận biết (40%)</span></td>
                </tr>
                <tr>
                  <td class="p-2.5 border border-slate-300 text-center font-bold">2</td>
                  <td class="p-2.5 border border-slate-300 font-bold text-indigo-900">Phân tích & Thông hiểu nội dung</td>
                  <td class="p-2.5 border border-slate-300">${topicScope.split('\n')[1] || 'Chủ đề 2'}</td>
                  <td class="p-2.5 border border-slate-300">Giải thích được ý nghĩa, mối liên hệ giữa các khái niệm, lập luận và chứng minh tính đúng đắn.</td>
                  <td class="p-2.5 border border-slate-300"><span class="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">Thông hiểu (30%)</span></td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 border border-slate-300 text-center font-bold">3</td>
                  <td class="p-2.5 border border-slate-300 font-bold text-indigo-900">Vận dụng & Viết / Bài tập thực hành</td>
                  <td class="p-2.5 border border-slate-300">${topicScope.split('\n')[2] || 'Chủ đề 3'}</td>
                  <td class="p-2.5 border border-slate-300">Vận dụng kiến thức để giải quyết bài toán thực tống, viết bài văn/đoạn văn phân tích và liên hệ bản thân.</td>
                  <td class="p-2.5 border border-slate-300"><span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Vận dụng (30%)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECTION 2: MA TRẬN ĐỀ KIỂM TRA -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="border-b border-indigo-100 pb-3 mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-indigo-900 flex items-center">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black mr-2">II</span>
              MA TRẬN ĐỀ KIỂM TRA (${examType.toUpperCase()})
            </h2>
            <span class="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
              Tổng điểm: 10.0 | Thang điểm chuẩn
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-center border-collapse border border-slate-300">
              <thead>
                <tr class="bg-slate-800 text-white font-bold">
                  <th class="p-2 border border-slate-300 text-left" rowspan="2">Nội dung / Chủ đề kiểm tra</th>
                  <th class="p-2 border border-slate-300" colspan="3">Mức độ nhận thức (Số câu)</th>
                  <th class="p-2 border border-slate-300" rowspan="2">Tổng số câu</th>
                  <th class="p-2 border border-slate-300" rowspan="2">Tổng điểm</th>
                  <th class="p-2 border border-slate-300" rowspan="2">Tỉ lệ %</th>
                </tr>
                <tr class="bg-slate-700 text-white font-semibold">
                  <th class="p-1.5 border border-slate-300">Nhận biết</th>
                  <th class="p-1.5 border border-slate-300">Thông hiểu</th>
                  <th class="p-1.5 border border-slate-300">Vận dụng</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="p-2.5 border border-slate-300 text-left font-bold text-slate-900">1. Đọc hiểu / Kiến thức nền tảng</td>
                  <td class="p-2 border border-slate-300 font-semibold text-emerald-700">6 câu TN (1.5đ)</td>
                  <td class="p-2 border border-slate-300 font-semibold text-sky-700">4 câu TN (1.0đ)</td>
                  <td class="p-2 border border-slate-300 font-semibold text-amber-700">2 câu TN (0.5đ)</td>
                  <td class="p-2 border border-slate-300 font-bold">12 câu TN</td>
                  <td class="p-2 border border-slate-300 font-bold text-indigo-900">3.0 điểm</td>
                  <td class="p-2 border border-slate-300 font-bold">30 %</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 border border-slate-300 text-left font-bold text-slate-900">2. Thực hành & Phân tích chuyên sâu</td>
                  <td class="p-2 border border-slate-300 font-semibold text-emerald-700">2 câu (1.0đ)</td>
                  <td class="p-2 border border-slate-300 font-semibold text-sky-700">2 câu (1.5đ)</td>
                  <td class="p-2 border border-slate-300 font-semibold text-amber-700">1 câu (0.5đ)</td>
                  <td class="p-2 border border-slate-300 font-bold">5 câu</td>
                  <td class="p-2 border border-slate-300 font-bold text-indigo-900">3.0 điểm</td>
                  <td class="p-2 border border-slate-300 font-bold">30 %</td>
                </tr>
                <tr>
                  <td class="p-2.5 border border-slate-300 text-left font-bold text-slate-900">3. Bài tập vận dụng & Viết tích hợp</td>
                  <td class="p-2 border border-slate-300 font-semibold text-emerald-700">-</td>
                  <td class="p-2 border border-slate-300 font-semibold text-sky-700">1 câu TL (1.0đ)</td>
                  <td class="p-2 border border-slate-300 font-semibold text-amber-700">1 câu TL (3.0đ)</td>
                  <td class="p-2 border border-slate-300 font-bold">2 câu TL</td>
                  <td class="p-2 border border-slate-300 font-bold text-indigo-900">4.0 điểm</td>
                  <td class="p-2 border border-slate-300 font-bold">40 %</td>
                </tr>
                <tr class="bg-indigo-950 text-white font-bold">
                  <td class="p-2.5 border border-slate-300 text-left">TỔNG CỘNG</td>
                  <td class="p-2 border border-slate-300 text-emerald-300">4.0 điểm (40%)</td>
                  <td class="p-2 border border-slate-300 text-sky-300">3.5 điểm (35%)</td>
                  <td class="p-2 border border-slate-300 text-amber-300">2.5 điểm (25%)</td>
                  <td class="p-2 border border-slate-300">19 câu</td>
                  <td class="p-2 border border-slate-300 text-amber-300">10.0 điểm</td>
                  <td class="p-2 border border-slate-300">100 %</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        ${!isOption1 ? `
        <!-- SECTION 3: BẢNG ĐẶC TẢ ĐỀ KIỂM TRA -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="border-b border-indigo-100 pb-3 mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-indigo-900 flex items-center">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black mr-2">III</span>
              BẢNG ĐẶC TẢ ĐỀ KIỂM TRA (${examType.toUpperCase()})
            </h2>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-indigo-950 text-white font-bold">
                  <th class="p-2 border border-slate-300 text-center">STT</th>
                  <th class="p-2 border border-slate-300">Chủ đề</th>
                  <th class="p-2 border border-slate-300">Mức độ đánh giá</th>
                  <th class="p-2 border border-slate-300">Yêu cầu cần đạt chi tiết</th>
                  <th class="p-2 border border-slate-300 text-center">Dạng câu hỏi</th>
                  <th class="p-2 border border-slate-300 text-center">Số điểm</th>
                  <th class="p-2 border border-slate-300">Năng lực hướng tới</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="p-2 border border-slate-300 text-center font-bold">1-6</td>
                  <td class="p-2 border border-slate-300 font-bold">Đọc hiểu / Nhận biết</td>
                  <td class="p-2 border border-slate-300 text-emerald-700 font-bold">Nhận biết</td>
                  <td class="p-2 border border-slate-300">Xác định phương thức biểu đạt, thể loại, từ ngữ trọng tâm, hoàn cảnh sáng tác của văn bản.</td>
                  <td class="p-2 border border-slate-300 text-center font-mono">Trắc nghiệm (C1-C6)</td>
                  <td class="p-2 border border-slate-300 text-center font-bold">1.5 đ</td>
                  <td class="p-2 border border-slate-300">Năng lực ngôn ngữ & Nhận thức</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2 border border-slate-300 text-center font-bold">7-10</td>
                  <td class="p-2 border border-slate-300 font-bold">Phân tích / Thông hiểu</td>
                  <td class="p-2 border border-slate-300 text-sky-700 font-bold">Thông hiểu</td>
                  <td class="p-2 border border-slate-300">Giải thích được lý do tác giả sử dụng biện pháp tu từ, làm rõ nội dung tư tưởng bài học.</td>
                  <td class="p-2 border border-slate-300 text-center font-mono">Trắc nghiệm (C7-C10)</td>
                  <td class="p-2 border border-slate-300 text-center font-bold">1.0 đ</td>
                  <td class="p-2 border border-slate-300">Năng lực văn học & Tư duy logic</td>
                </tr>
                <tr>
                  <td class="p-2 border border-slate-300 text-center font-bold">11-12</td>
                  <td class="p-2 border border-slate-300 font-bold">Thực hành Tiếng Việt</td>
                  <td class="p-2 border border-slate-300 text-amber-700 font-bold">Vận dụng</td>
                  <td class="p-2 border border-slate-300">Nhận diện kiểu đoạn văn (Diễn dịch, Quy nạp) và sửa lỗi dùng từ trong câu.</td>
                  <td class="p-2 border border-slate-300 text-center font-mono">Trắc nghiệm (C11-C12)</td>
                  <td class="p-2 border border-slate-300 text-center font-bold">0.5 đ</td>
                  <td class="p-2 border border-slate-300">Năng lực thực hành Tiếng Việt</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2 border border-slate-300 text-center font-bold">TL1</td>
                  <td class="p-2 border border-slate-300 font-bold">Nghị luận xã hội ngắn</td>
                  <td class="p-2 border border-slate-300 text-sky-700 font-bold">Thông hiểu - VD</td>
                  <td class="p-2 border border-slate-300">Viết đoạn văn 150 chữ bày tỏ suy nghĩ về thông điệp tự học và tinh thần trách nhiệm.</td>
                  <td class="p-2 border border-slate-300 text-center font-mono">Tự luận (Câu 1)</td>
                  <td class="p-2 border border-slate-300 text-center font-bold">3.0 đ</td>
                  <td class="p-2 border border-slate-300">Năng lực lập luận & Giao tiếp</td>
                </tr>
                <tr>
                  <td class="p-2 border border-slate-300 text-center font-bold">TL2</td>
                  <td class="p-2 border border-slate-300 font-bold">Viết bài văn phân tích</td>
                  <td class="p-2 border border-slate-300 text-amber-700 font-bold">Vận dụng cao</td>
                  <td class="p-2 border border-slate-300">Viết bài văn hoàn chỉnh phân tích đặc sắc nội dung và nghệ thuật của tác phẩm văn học.</td>
                  <td class="p-2 border border-slate-300 text-center font-mono">Tự luận (Câu 2)</td>
                  <td class="p-2 border border-slate-300 text-center font-bold">4.0 đ</td>
                  <td class="p-2 border border-slate-300">Năng lực sáng tạo & Thẩm mỹ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        ${!isOption1 && !isOption2 ? `
        <!-- SECTION 4: ĐỀ KIỂM TRA CHÍNH THỨC -->
        <div class="bg-white p-8 rounded-2xl border border-slate-300 shadow-md printable-exam-paper">
          
          <!-- OFFICIAL EXAM HEADER -->
          <div class="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-900 mb-6 font-serif">
            <div class="text-center">
              <div class="font-bold text-xs uppercase tracking-wide text-slate-900">${headerDept}</div>
              <div class="font-black text-sm uppercase text-slate-900 mt-0.5">${schoolName}</div>
              <div class="text-xs italic text-slate-700 mt-1">Mã đề thi: <span class="font-bold font-mono">101</span></div>
            </div>
            <div class="text-center">
              <div class="font-black text-sm uppercase text-indigo-950">ĐỀ KIỂM TRA ${examType.toUpperCase()}</div>
              <div class="font-bold text-xs text-slate-800 mt-0.5">NĂM HỌC 2025 - 2026</div>
              <div class="text-xs font-semibold text-slate-900 mt-1">Môn: ${subject.toUpperCase()} - ${grade.toUpperCase()}</div>
              <div class="text-xs italic text-slate-700">Thời gian làm bài: ${durationMinutes} phút (không kể thời gian phát đề)</div>
            </div>
          </div>

          <!-- STUDENT INFO & GRADE BOX -->
          <div class="grid grid-cols-12 gap-3 mb-6 font-serif">
            <div class="col-span-8 border border-slate-400 p-3 rounded text-xs space-y-1.5">
              <div>Họ và tên học sinh: ......................................................................................................................</div>
              <div>Lớp: .............................................. Trường: ....................................................................................</div>
            </div>
            <div class="col-span-4 border-2 border-slate-900 rounded p-2 text-center flex flex-col justify-between">
              <div class="font-bold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1">ĐIỂM SỐ & LỜI PHÊ GIÁO VIÊN</div>
              <div class="h-10"></div>
            </div>
          </div>

          <!-- EXAM CONTENT -->
          <div class="space-y-6 text-sm leading-relaxed text-slate-900 font-serif">
            
            <!-- PHẦN I: TRẮC NGHIỆM -->
            <div>
              <div class="font-bold text-base uppercase text-indigo-950 border-b border-slate-300 pb-1 mb-3">
                PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (3.0 điểm)
              </div>
              <p class="italic text-xs text-slate-600 mb-4">Khoanh tròn vào duy nhất một chữ cái A, B, C hoặc D đứng trước câu trả lời đúng nhất:</p>

              <div class="space-y-4">
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p class="font-bold">Câu 1. (0.25 điểm) Văn bản "Hịch tướng sĩ" của Trần Quốc Tuấn thuộc thể loại văn học nào?</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-xs pl-2">
                    <div>A. Thể Cáo</div>
                    <div>B. Thể Hịch</div>
                    <div>C. Thể Chiếu</div>
                    <div>D. Thể Tấu</div>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p class="font-bold">Câu 2. (0.25 điểm) Tác phẩm "Nam quốc sơn hà" được xem là bản tuyên ngôn độc lập đầu tiên vì lý do nào sau đây?</p>
                  <div class="grid grid-cols-1 gap-1 mt-2 text-xs pl-2">
                    <div>A. Khẳng định chủ quyền lãnh thổ và sông núi nước Nam đã được sách trời định sẵn.</div>
                    <div>B. Kêu gọi quân dân đứng lên đánh đuổi giặc ngoại xâm cứu nước.</div>
                    <div>C. Tuyên bố chấm dứt chiến tranh và lập lại hòa bình cho dân tộc.</div>
                    <div>D. Ca ngợi chiến công hiển hách của vua tôi nhà Lý trên sông Như Nguyệt.</div>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p class="font-bold">Câu 3. (0.25 điểm) Phương thức biểu đạt chính được sử dụng trong bài văn "Tinh thần yêu nước của nhân dân ta" là gì?</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-xs pl-2">
                    <div>A. Tự sự</div>
                    <div>B. Biểu cảm</div>
                    <div>C. Nghị luận</div>
                    <div>D. Thuyết minh</div>
                  </div>
                </div>

                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p class="font-bold">Câu 4. (0.25 điểm) Đoạn văn diễn dịch là đoạn văn có câu chủ đề nằm ở vị trí nào?</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-xs pl-2">
                    <div>A. Đầu đoạn văn</div>
                    <div>B. Cuối đoạn văn</div>
                    <div>C. Giữa đoạn văn</div>
                    <div>D. Đầu và cuối đoạn văn</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PHẦN II: TỰ LUẬN -->
            <div class="pt-4">
              <div class="font-bold text-base uppercase text-indigo-950 border-b border-slate-300 pb-1 mb-3">
                PHẦN II. TỰ LUẬN (7.0 điểm)
              </div>

              <div class="space-y-4">
                <div class="p-4 bg-indigo-50/40 rounded-lg border border-indigo-100">
                  <p class="font-bold text-slate-900">Câu 1. (3.0 điểm)</p>
                  <p class="mt-1 text-slate-800">
                    Từ tinh thần yêu nước quật cường của cha ông được thể hiện qua các văn bản lịch sử đã học, em hãy viết một đoạn văn (khoảng 12 - 15 câu, tương đương 150 - 200 chữ) trình bày suy nghĩ về trách nhiệm của thế hệ trẻ học sinh hiện nay trong việc học tập và rèn luyện năng lực số để dựng xây đất nước.
                  </p>
                </div>

                <div class="p-4 bg-indigo-50/40 rounded-lg border border-indigo-100">
                  <p class="font-bold text-slate-900">Câu 2. (4.0 điểm)</p>
                  <p class="mt-1 text-slate-800">
                    Phân tích giá trị nội dung tư tưởng sâu sắc và lòng yêu nước nồng nàn được thể hiện qua đoạn trích bài "Hịch tướng sĩ" của Hưng Đạo Đại Vương Trần Quốc Tuấn.
                  </p>
                </div>
              </div>
            </div>

            <div class="text-center italic font-bold pt-6 text-slate-600 border-t border-slate-200">
              ------------------- HẾT -------------------<br/>
              <span class="font-normal text-xs">(Cán bộ coi thi không giải thích gì thêm. Học sinh không được sử dụng tài liệu)</span>
            </div>

          </div>
        </div>

        <!-- SECTION 5: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="border-b border-indigo-100 pb-3 mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-indigo-900 flex items-center">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black mr-2">V</span>
              ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT (THANG ĐIỂM 10)
            </h2>
          </div>

          <div class="space-y-6 text-xs">
            <div>
              <h3 class="font-bold text-sm text-indigo-950 mb-2">1. Đáp án Phần I: Trắc nghiệm khách quan (3.0 điểm - Mỗi câu 0.25đ)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-center border-collapse border border-slate-300">
                  <thead>
                    <tr class="bg-slate-800 text-white font-bold">
                      <th class="p-2 border border-slate-300">Câu</th>
                      <th class="p-2 border border-slate-300">1</th>
                      <th class="p-2 border border-slate-300">2</th>
                      <th class="p-2 border border-slate-300">3</th>
                      <th class="p-2 border border-slate-300">4</th>
                      <th class="p-2 border border-slate-300">5</th>
                      <th class="p-2 border border-slate-300">6</th>
                      <th class="p-2 border border-slate-300">7</th>
                      <th class="p-2 border border-slate-300">8</th>
                      <th class="p-2 border border-slate-300">9</th>
                      <th class="p-2 border border-slate-300">10</th>
                      <th class="p-2 border border-slate-300">11</th>
                      <th class="p-2 border border-slate-300">12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="font-bold text-indigo-900 bg-amber-50">
                      <td class="p-2 border border-slate-300 bg-slate-100">Đáp án</td>
                      <td class="p-2 border border-slate-300">B</td>
                      <td class="p-2 border border-slate-300">A</td>
                      <td class="p-2 border border-slate-300">C</td>
                      <td class="p-2 border border-slate-300">A</td>
                      <td class="p-2 border border-slate-300">B</td>
                      <td class="p-2 border border-slate-300">D</td>
                      <td class="p-2 border border-slate-300">C</td>
                      <td class="p-2 border border-slate-300">A</td>
                      <td class="p-2 border border-slate-300">B</td>
                      <td class="p-2 border border-slate-300">C</td>
                      <td class="p-2 border border-slate-300">D</td>
                      <td class="p-2 border border-slate-300">A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-sm text-indigo-950 mb-2">2. Hướng dẫn chấm Phần II: Tự luận (7.0 điểm)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse border border-slate-300">
                  <thead>
                    <tr class="bg-indigo-900 text-white font-bold">
                      <th class="p-2.5 border border-slate-300 w-16 text-center">Câu</th>
                      <th class="p-2.5 border border-slate-300">Ý / Yêu cầu đạt được</th>
                      <th class="p-2.5 border border-slate-300 w-24 text-center">Điểm</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr>
                      <td class="p-2.5 border border-slate-300 font-bold text-center" rowspan="4">Câu 1<br/>(3.0đ)</td>
                      <td class="p-2.5 border border-slate-300"><b>Đảm bảo hình thức đoạn văn:</b> Đủ dung lượng 12-15 câu, diễn đạt trôi chảy, không sai chính tả.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 border border-slate-300"><b>Xác định đúng vấn đề nghị luận:</b> Trách nhiệm rèn luyện năng lực số và tri thức của học sinh hiện nay.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 border border-slate-300"><b>Triển khai các ý chủ đạo:</b> Yêu nước thời đại số thể hiện qua việc làm chủ công nghệ, bảo vệ chủ quyền số quốc gia, học tập sáng tạo, tránh xa thông tin xấu độc.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">1.5đ</td>
                    </tr>
                    <tr>
                      <td class="p-2.5 border border-slate-300"><b>Sáng tạo & Bài học liên hệ bản thân:</b> Có góc nhìn mới mẻ, rút ra bài học hành động thiết thực.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>

                    <tr class="bg-slate-50/50">
                      <td class="p-2.5 border border-slate-300 font-bold text-center" rowspan="4">Câu 2<br/>(4.0đ)</td>
                      <td class="p-2.5 border border-slate-300"><b>Mở bài:</b> Giới thiệu tác giả Trần Quốc Tuấn, tác phẩm Hịch tướng sĩ và khái quát tinh thần yêu nước.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>
                    <tr class="bg-slate-50/50">
                      <td class="p-2.5 border border-slate-300"><b>Thân bài - Phân tích nội dung:</b> Tố cáo tội ác giặc Nguyên Mông; Bày tỏ lòng căm thù giặc sâu sắc ("Quên ăn vì giặc, xẻ thịt lột da"); Kêu gọi tướng sĩ đoàn kết, rèn luyện binh pháp.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">2.5đ</td>
                    </tr>
                    <tr class="bg-slate-50/50">
                      <td class="p-2.5 border border-slate-300"><b>Thân bài - Phân tích nghệ thuật:</b> Giọng văn bi hùng, lập luận chặt chẽ, hình ảnh so sánh nhân hóa giàu sức gợi.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>
                    <tr class="bg-slate-50/50">
                      <td class="p-2.5 border border-slate-300"><b>Kết bài:</b> Khẳng định giá trị trường tồn của tác phẩm và bài học lịch sử cho muôn đời sau.</td>
                      <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        ` : ''}

      </div>
    `;

    setGeneratedExamHtml(localHtml);
    onSuccessToast('Đã khởi tạo Hồ sơ Đề kiểm tra chuẩn Bộ (Offline Engine)!');
  };

  // Save to repository & durable IndexedDB/Supabase storage
  const handleSaveToRepository = async () => {
    if (!generatedExamHtml) return;

    const newLesson: Partial<LessonPlanItem> = {
      id: 'exam-' + Date.now(),
      title: generatedTitle || `Đề kiểm tra ${examType} ${subject} ${grade}`,
      subject,
      grade,
      framework: 'TT 02/2025 + QĐ 3439',
      template: 'Mẫu Đề Kiểm Tra Chuẩn BGDĐT 2018',
      originalContent: topicScope,
      integratedContent: generatedExamHtml,
      createdAt: Date.now(),
      dateString: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    await onSaveLesson(newLesson);
    onSuccessToast('Đã lưu Hồ sơ Đề kiểm tra vào Kho bài dạy & CSDL Supabase!');
  };

  // Export Word document (.docx compatible format)
  const handleExportWord = () => {
    if (!generatedExamHtml) return;

    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${generatedTitle}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; }
        h1, h2, h3 { font-weight: bold; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #334155; padding: 6px; text-align: left; font-size: 11pt; }
        th { background-color: #1e293b; color: white; }
        .exam-header { text-align: center; margin-bottom: 20px; }
      </style>
      </head><body>
    `;
    const wordFooter = `</body></html>`;
    const sourceHTML = wordHeader + generatedExamHtml + wordFooter;

    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedTitle.replace(/[^a-zA-Z0-0-9_ -]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onSuccessToast('Đã tải xuống Hồ sơ Đề kiểm tra (.DOC) thành công!');
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Copy plain text
  const handleCopyText = () => {
    if (!generatedExamHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedExamHtml;
    const text = tempDiv.innerText || tempDiv.textContent || '';
    navigator.clipboard.writeText(text);
    onSuccessToast('Đã sao chép toàn bộ nội dung Hồ sơ Đề kiểm tra vào Bộ nhớ tạm!');
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-rose-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-extrabold border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>CHUẨN BỘ GD&ĐT 2018 • MA TRẬN, BẢNG ĐẶC TẢ & NĂNG LỰC ĐÁNH GIÁ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tạo Đề Kiểm Tra Định Kỳ & Ma Trận Chuẩn NotebookLM
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Biên soạn trọn bộ hồ sơ kiểm tra: <span className="text-amber-300 font-semibold">Phân tích phạm vi</span>, <span className="text-amber-300 font-semibold">Ma trận đề</span>, <span className="text-amber-300 font-semibold">Bảng đặc tả chi tiết</span>, <span className="text-amber-300 font-semibold">Đề thi chính thức (Trắc nghiệm + Tự luận LaTeX)</span> và <span className="text-amber-300 font-semibold">Đáp án & Hướng dẫn chấm</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => handleLoadPreset('literary')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-rose-200 border border-rose-700/50 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Mẫu Ngữ Văn 8</span>
            </button>
            <button
              onClick={() => handleLoadPreset('math')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-amber-200 border border-amber-700/50 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Mẫu Toán 10</span>
            </button>
            <button
              onClick={() => handleLoadPreset('english')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-emerald-200 border border-emerald-700/50 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mẫu Tiếng Anh 9</span>
            </button>
            <button
              onClick={() => handleLoadPreset('physics')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-sky-200 border border-sky-700/50 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Mẫu Vật Lí 11</span>
            </button>
          </div>
        </div>
      </div>

      {/* FORM CONFIGURATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PARAMETER SETUP */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Khởi Động & Xác Định Yêu Cầu</h2>
              <p className="text-xs text-slate-500">Thiết lập các tham số đề kiểm tra theo quy định</p>
            </div>
          </div>

          {/* Question 1: Exam Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Loại bài kiểm tra định kì: <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Giữa học kì I',
                'Cuối học kì I',
                'Giữa học kì II',
                'Cuối học kì II'
              ].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExamType(type)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                    examType === type
                      ? 'bg-rose-50 text-rose-900 border-rose-400 ring-2 ring-rose-300/40'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{type}</span>
                  {examType === type && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Output Bundle Option */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              2. Sản phẩm cần khởi tạo: <span className="text-rose-600">*</span>
            </label>
            <div className="space-y-2">
              {[
                { id: '1', title: 'Phương án 1: Chỉ tạo Ma trận đề', desc: 'Bao gồm Phân tích phạm vi & Bảng ma trận 10 điểm' },
                { id: '2', title: 'Phương án 2: Tạo Ma trận đề + Bảng đặc tả', desc: 'Bao gồm Ma trận & Bảng đặc tả chi tiết từng câu' },
                { id: '3', title: 'Phương án 3: Trọn bộ Hồ sơ Kiểm tra', desc: 'Ma trận + Đặc tả + Đề thi + Đáp án & Hướng dẫn chấm' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOutputOption(opt.id)}
                  className={`w-full p-3 rounded-2xl text-xs text-left border transition ${
                    outputOption === opt.id
                      ? 'bg-indigo-50/90 text-indigo-950 border-indigo-400 ring-2 ring-indigo-300/40 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold flex items-center justify-between">
                    <span>{opt.title}</span>
                    {outputOption === opt.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Integrated Question Structure Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                3. Lựa chọn tích hợp dạng câu hỏi: <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-black px-2 py-0.5 bg-rose-100 text-rose-800 rounded-lg">
                Tổng: {mcqCount + trueFalseCount + fillBlankCount + matchingCount + shortAnswerCount + essayCount} câu
              </span>
            </div>

            {/* Structure Presets Bar */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('standard')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                Mẫu Chuẩn (12 MCQ + 2 TL)
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('diverse')}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[10px] font-bold text-amber-800 rounded-lg border border-amber-200 transition cursor-pointer"
              >
                Đa dạng 6 dạng
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('thpt')}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-[10px] font-bold text-indigo-800 rounded-lg border border-indigo-200 transition cursor-pointer"
              >
                Mẫu Thi THPT Mới
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('essayOnly')}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-800 rounded-lg border border-rose-200 transition cursor-pointer"
              >
                100% Tự luận
              </button>
            </div>

            <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
              
              {/* 1. MCQ */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">🎯</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm khoanh đáp án đúng</div>
                    <div className="text-[10px] text-slate-500">Lựa chọn 1 đáp án A, B, C hoặc D</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setMcqCount(Math.max(0, mcqCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={mcqCount}
                    onChange={e => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setMcqCount(mcqCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. True / False */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">⚖️</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm lựa chọn đúng sai</div>
                    <div className="text-[10px] text-slate-500">Xác định Đúng/Sai cho 4 ý a, b, c, d</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setTrueFalseCount(Math.max(0, trueFalseCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={trueFalseCount}
                    onChange={e => setTrueFalseCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setTrueFalseCount(trueFalseCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3. Fill in blank */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">📝</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm điền khuyết</div>
                    <div className="text-[10px] text-slate-500">Điền từ / cụm từ thích hợp vào chỗ trống</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setFillBlankCount(Math.max(0, fillBlankCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={fillBlankCount}
                    onChange={e => setFillBlankCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setFillBlankCount(fillBlankCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4. Matching */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">🔗</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm Nối</div>
                    <div className="text-[10px] text-slate-500">Ghép vế Cột A tương ứng Cột B</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setMatchingCount(Math.max(0, matchingCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={matchingCount}
                    onChange={e => setMatchingCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setMatchingCount(matchingCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 5. Short Answer */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">💬</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm trả lời ngắn</div>
                    <div className="text-[10px] text-slate-500">Điền đáp số / câu trả lời vắn tắt</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setShortAnswerCount(Math.max(0, shortAnswerCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={shortAnswerCount}
                    onChange={e => setShortAnswerCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShortAnswerCount(shortAnswerCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 6. Essay */}
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">✍️</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Tự luận</div>
                    <div className="text-[10px] text-slate-500">Viết đoạn / bài văn, phân tích, giải bài tập</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setEssayCount(Math.max(0, essayCount - 1))}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={essayCount}
                    onChange={e => setEssayCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-10 text-center text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setEssayCount(essayCount + 1)}
                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Subject & Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Môn học:</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Vật lí">Vật lí</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                <option value="Tin học">Tin học</option>
                <option value="GDCD">GDCD / GD Kinh tế & Pháp luật</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Khối lớp:</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
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

          {/* Time & School header info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Thời gian làm bài:</label>
              <input
                type="text"
                value={durationMinutes}
                onChange={e => setDurationMinutes(e.target.value)}
                placeholder="Ví dụ: 60"
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Tên Trường / Đơn vị:</label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="TRƯỜNG THCS..."
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Topic / Scope Text Input with File Upload & Drive Link Buttons */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-800">
                Phạm vi bài học / Nội dung kiểm tra: <span className="text-rose-600">*</span>
              </label>

              {/* Upload & Drive Link Action Buttons */}
              <div className="flex items-center space-x-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.txt,.md"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                  title="Tải lên tệp Đề cương/SGK (Word, PDF, Ảnh, Text...)"
                >
                  <Paperclip className="w-3.5 h-3.5 text-rose-600" />
                  <span>Tải file Word/PDF/Ảnh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDriveInput(!showDriveInput)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                  title="Dán link Google Drive hoặc SGK Online"
                >
                  <Link className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Link Drive/SGK</span>
                </button>
              </div>
            </div>

            {/* Collapsible Drive Link Input Box */}
            {showDriveInput && (
              <div className="p-3 bg-indigo-50/90 border border-indigo-200 rounded-xl space-y-2 text-xs shadow-inner animate-fadeIn">
                <div className="font-extrabold text-indigo-950 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Link className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Thêm Link Google Drive / SGK / Bài học Online</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowDriveInput(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={driveInputTitle}
                    onChange={e => setDriveInputTitle(e.target.value)}
                    placeholder="Tên tài liệu (vd: SGK Toán 10 KNTT)"
                    className="p-2 bg-white border border-indigo-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                  <input
                    type="url"
                    value={driveInputUrl}
                    onChange={e => setDriveInputUrl(e.target.value)}
                    placeholder="Dán URL: https://drive.google.com/..."
                    className="p-2 bg-white border border-indigo-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowDriveInput(false)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-lg border border-slate-200 text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDriveLink}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                  >
                    Xác nhận Thêm Link
                  </button>
                </div>
              </div>
            )}

            {/* Scope Textarea */}
            <textarea
              rows={4}
              value={topicScope}
              onChange={e => setTopicScope(e.target.value)}
              placeholder="Nhập tên bài học, chủ đề, chương kiến thức cần ra đề hoặc đính kèm tệp Word/PDF/Ảnh, link Drive ở nút bấm phía trên..."
              className="w-full p-3 text-xs leading-relaxed font-mono bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />

            {/* Attached Items Badges Bar */}
            {(attachedFiles.length > 0 || driveLinks.length > 0) && (
              <div className="p-2.5 bg-slate-100/90 border border-slate-200 rounded-xl space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Tài liệu đính kèm tham chiếu ({attachedFiles.length + driveLinks.length})</span>
                  <span className="text-[9px] text-slate-400 font-normal">AI sẽ tham chiếu dữ liệu này khi biên soạn đề</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {attachedFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-rose-200 text-rose-900 rounded-lg text-xs shadow-2xs"
                    >
                      {file.type === 'word' ? <FileText className="w-3.5 h-3.5 text-blue-600" /> :
                       file.type === 'pdf' ? <FileText className="w-3.5 h-3.5 text-rose-600" /> :
                       file.type === 'image' ? <Image className="w-3.5 h-3.5 text-emerald-600" /> :
                       <Paperclip className="w-3.5 h-3.5 text-slate-600" />}
                      <span className="font-bold max-w-[150px] truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({file.size})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        title="Xóa tệp đính kèm này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {driveLinks.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg text-xs shadow-2xs"
                    >
                      <Link className="w-3.5 h-3.5 text-indigo-600" />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold max-w-[170px] truncate hover:underline flex items-center space-x-1 text-indigo-700"
                        title={link.url}
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveDriveLink(link.id)}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        title="Xóa link drive này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Ghi chú cấu trúc & Yêu cầu bổ sung:
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="70% trắc nghiệm, 30% tự luận..."
              className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* GENERATE SUBMIT BUTTON */}
          <button
            onClick={handleGenerateExam}
            disabled={isGenerating}
            className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-700 hover:from-rose-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{progressStep || 'Đang tạo Hồ sơ Đề kiểm tra...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>BẮT ĐẦU XÂY DỰNG HỒ SƠ ĐỀ KIỂM TRA</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: WORKSPACE / PREVIEW PANEL */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* ACTION BAR */}
          {generatedExamHtml && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-950">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{generatedTitle}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveToRepository}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer"
                  title="Lưu hồ sơ này vào CSDL Kho Giáo Án & Đề Kiểm Tra"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Kho Đề</span>
                </button>

                <button
                  onClick={handleExportWord}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer"
                  title="Tải về tập tin Microsoft Word (.doc)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer"
                  title="In trực tiếp hoặc Xuất định dạng PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In / PDF</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center space-x-1 cursor-pointer"
                  title="Sao chép văn bản"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW CONTAINER */}
          {!generatedExamHtml && !isGenerating ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl mx-auto flex items-center justify-center font-bold shadow-inner">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-extrabold text-slate-800">Chưa có Hồ sơ Đề kiểm tra nào được tạo</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Vui lòng tùy chọn các tham số ở cột bên trái (Loại bài kiểm tra, môn học, khối lớp, phạm vi bài học) và nhấn nút <span className="font-bold text-rose-700">"Bắt đầu xây dựng"</span> để sinh trọn bộ hồ sơ.
                </p>
              </div>

              <div className="pt-2 flex justify-center space-x-2">
                <button
                  onClick={() => handleLoadPreset('literary')}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition cursor-pointer"
                >
                  Tải mẫu đề Ngữ văn 8
                </button>
                <button
                  onClick={() => handleLoadPreset('math')}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition cursor-pointer"
                >
                  Tải mẫu đề Toán 10
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping"></div>
                <div className="relative w-20 h-20 bg-gradient-to-tr from-rose-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-10 h-10 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-indigo-950">Đang khởi tạo Hồ sơ Đề kiểm tra định kì...</h3>
                <p className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full inline-block border border-rose-200">
                  {progressStep}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto pt-2">
                  Hệ thống AI đang tổng hợp ma trận 3 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng) và biên soạn câu hỏi trắc nghiệm & tự luận chuẩn quy cách.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden space-y-6">
              
              {/* DOCUMENT CONTENT VIEW */}
              <div 
                className="exam-generated-rendered-content text-slate-800 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: generatedExamHtml }}
              />

              {/* BOTTOM SAVE CALLOUT */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm font-extrabold">
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Lưu trữ không lo mất dữ liệu</h4>
                    <p className="text-[11px] text-slate-600">Đã kích hoạt đồng bộ IndexedDB & CSDL Supabase cloud.</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveToRepository}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  LƯU VÀO KHO BÀI DẠY
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
