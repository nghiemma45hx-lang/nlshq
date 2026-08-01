import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { marked } from 'marked';
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
  Upload,
  Lock
} from 'lucide-react';
import { LessonPlanItem, ExamItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ExamGeneratorViewProps {
  onSaveLesson?: (lesson: Partial<LessonPlanItem>) => Promise<void>;
  onSaveExam: (exam: ExamItem) => Promise<void>;
  onSuccessToast: (msg: string) => void;
  onSwitchView: (view: string) => void;
}

export const ExamGeneratorView: React.FC<ExamGeneratorViewProps> = ({
  onSaveLesson,
  onSaveExam,
  onSuccessToast,
  onSwitchView
}) => {
  const { currentUser, isAdmin } = useAuth();
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

  // Point values per question type (Decimal points like 0.25, 0.5, 1.0...)
  const [mcqPoints, setMcqPoints] = useState<number>(0.25);
  const [trueFalsePoints, setTrueFalsePoints] = useState<number>(1.0);
  const [fillBlankPoints, setFillBlankPoints] = useState<number>(0.5);
  const [matchingPoints, setMatchingPoints] = useState<number>(0.5);
  const [shortAnswerPoints, setShortAnswerPoints] = useState<number>(0.25);
  const [essayPoints, setEssayPoints] = useState<number>(3.5);

  const formatPoints = (num: number) => {
    return parseFloat(num.toFixed(2)).toString();
  };

  const totalMcqPts = mcqCount * mcqPoints;
  const totalTrueFalsePts = trueFalseCount * trueFalsePoints;
  const totalFillBlankPts = fillBlankCount * fillBlankPoints;
  const totalMatchingPts = matchingCount * matchingPoints;
  const totalShortAnswerPts = shortAnswerCount * shortAnswerPoints;
  const totalEssayPts = essayCount * essayPoints;

  const totalExamQuestions = mcqCount + trueFalseCount + fillBlankCount + matchingCount + shortAnswerCount + essayCount;
  const totalExamScore = totalMcqPts + totalTrueFalsePts + totalFillBlankPts + totalMatchingPts + totalShortAnswerPts + totalEssayPts;

  // Exam details
  const [subject, setSubject] = useState<string>('Ngữ văn');
  const [grade, setGrade] = useState<string>('Khối 8');
  const [durationMinutes, setDurationMinutes] = useState<string>('60');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS HỒNG QUANG');
  const [headerDept, setHeaderDept] = useState<string>('UBND XÃ HÒA XÁ');
  const [schoolYear, setSchoolYear] = useState<string>('2025 - 2026');

  // Custom Subject and Grade Management
  const [subjectsList, setSubjectsList] = useState<string[]>([
    'Ngữ văn',
    'Toán học',
    'Tiếng Anh',
    'Vật lí',
    'Hóa học',
    'Sinh học',
    'Khoa học tự nhiên',
    'Lịch sử & Địa lý',
    'Lịch sử',
    'Địa lý',
    'Tin học',
    'GDCD / GD KT&PL',
    'Công nghệ',
    'Âm nhạc',
    'Mỹ thuật',
    'Hoạt động trải nghiệm'
  ]);
  const [isAddingSubject, setIsAddingSubject] = useState<boolean>(false);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');

  const [gradesList, setGradesList] = useState<string[]>([
    'Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5',
    'Khối 6', 'Khối 7', 'Khối 8', 'Khối 9',
    'Khối 10', 'Khối 11', 'Khối 12'
  ]);
  const [isAddingGrade, setIsAddingGrade] = useState<boolean>(false);
  const [customGradeInput, setCustomGradeInput] = useState<string>('');

  const handleAddNewSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;
    if (!subjectsList.includes(trimmed)) {
      setSubjectsList(prev => [...prev, trimmed]);
    }
    setSubject(trimmed);
    setCustomSubjectInput('');
    setIsAddingSubject(false);
    onSuccessToast(`Đã thêm và chọn môn học: "${trimmed}"`);
  };

  const handleAddNewGrade = () => {
    const trimmed = customGradeInput.trim();
    if (!trimmed) return;
    if (!gradesList.includes(trimmed)) {
      setGradesList(prev => [...prev, trimmed]);
    }
    setGrade(trimmed);
    setCustomGradeInput('');
    setIsAddingGrade(false);
    onSuccessToast(`Đã thêm và chọn khối lớp: "${trimmed}"`);
  };
  
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

  const readFileToText = (file: File, fileType: string): Promise<string> => {
    return new Promise(resolve => {
      if (fileType === 'word') {
        file.arrayBuffer().then(async arrayBuffer => {
          try {
            const result = await mammoth.extractRawText({ arrayBuffer });
            if (result && result.value && result.value.trim().length > 10) {
              resolve(result.value.trim());
              return;
            }
          } catch (err) {
            console.warn('Mammoth extraction failed:', err);
          }

          // Try server-side /api/parse-docx
          try {
            const reader = new FileReader();
            reader.onload = async () => {
              const base64 = (reader.result as string).split(',')[1];
              const res = await fetch('/api/parse-docx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Data: base64 })
              });
              const data = await res.json();
              if (data.html) {
                const tmp = document.createElement('div');
                tmp.innerHTML = data.html;
                const text = tmp.innerText || tmp.textContent || '';
                if (text.trim().length > 10) {
                  resolve(text.trim());
                  return;
                }
              }
              resolve(`[Tệp Word đính kèm: ${file.name}]`);
            };
            reader.readAsDataURL(file);
          } catch (e) {
            resolve(`[Tệp Word đính kèm: ${file.name}]`);
          }
        }).catch(() => resolve(`[Tệp Word đính kèm: ${file.name}]`));
      } else if (fileType === 'pdf') {
        file.arrayBuffer().then(arrayBuffer => {
          try {
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const rawText = decoder.decode(arrayBuffer);
            const matches = rawText.match(/[\u0020-\u007E\u00C0-\u024F\u1EA0-\u1EF9]{4,}/g);
            if (matches && matches.length > 0) {
              const filtered = matches.filter(m => !m.includes('obj') && !m.includes('endobj') && !m.includes('stream') && !m.includes('PDF')).join(' ');
              resolve(filtered.slice(0, 25000));
              return;
            }
          } catch (e) {}
          resolve(`[Tệp PDF đính kèm: ${file.name}]`);
        }).catch(() => resolve(`[Tệp PDF đính kèm: ${file.name}]`));
      } else if (fileType === 'image') {
        resolve(`[Ảnh chụp tài liệu/đề/SGK đính kèm: ${file.name}]`);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = (event.target?.result as string) || '';
          resolve(content.trim());
        };
        reader.onerror = () => resolve(`[Tài liệu đính kèm: ${file.name}]`);
        reader.readAsText(file);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachedItems: AttachedFileItem[] = [];

    for (const file of Array.from(files)) {
      const sizeKb = (file.size / 1024).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKb} KB`;
      
      let fileType = 'other';
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (['doc', 'docx'].includes(ext)) fileType = 'word';
      else if (ext === 'pdf') fileType = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) fileType = 'image';
      else if (['txt', 'md', 'json', 'csv', 'html', 'xml'].includes(ext)) fileType = 'text';

      const extractedContent = await readFileToText(file, fileType);

      const newItem: AttachedFileItem = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: sizeStr,
        type: fileType,
        content: extractedContent,
      };

      newAttachedItems.push(newItem);
    }

    setAttachedFiles(prev => [...prev, ...newAttachedItems]);

    // Automatically replace placeholder text in topicScope with actual extracted content
    const validExtractedItem = newAttachedItems.find(f => f.content && !f.content.startsWith('[Tệp') && !f.content.startsWith('[Ảnh') && f.content.length > 20);
    if (validExtractedItem) {
      setTopicScope(`=== NỘI DUNG TỆP GỐC TẢI LÊN (${validExtractedItem.name}) ===\n${validExtractedItem.content}`);
    } else {
      const summaryText = newAttachedItems.map(f => `• Tệp đính kèm gốc: ${f.name} (${f.size})`).join('\n');
      setTopicScope(`[SỬ DỤNG CHUẨN DỮ LIỆU GỐC TỪ TỆP ĐÍNH KÈM]\n${summaryText}`);
    }

    onSuccessToast(`Đã đọc & trích xuất thành công ${newAttachedItems.length} tệp tài liệu gốc!`);
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
      setMcqPoints(0.25);
      setTrueFalseCount(0);
      setTrueFalsePoints(1.0);
      setFillBlankCount(0);
      setFillBlankPoints(0.5);
      setMatchingCount(0);
      setMatchingPoints(0.5);
      setShortAnswerCount(0);
      setShortAnswerPoints(0.25);
      setEssayCount(2);
      setEssayPoints(3.5);
      onSuccessToast('Đã áp dụng cấu trúc Chuẩn THCS/THPT (12 MCQ + 2 Tự luận = 10.0đ)!');
    } else if (preset === 'diverse') {
      setMcqCount(8);
      setMcqPoints(0.25); // 2.0đ
      setTrueFalseCount(2);
      setTrueFalsePoints(1.0); // 2.0đ
      setFillBlankCount(2);
      setFillBlankPoints(0.5); // 1.0đ
      setMatchingCount(2);
      setMatchingPoints(0.5); // 1.0đ
      setShortAnswerCount(2);
      setShortAnswerPoints(0.5); // 1.0đ
      setEssayCount(1);
      setEssayPoints(3.0); // 3.0đ
      onSuccessToast('Đã áp dụng cấu trúc Tích hợp Đa dạng 6 dạng câu hỏi (Tổng 10.0đ)!');
    } else if (preset === 'thpt') {
      setMcqCount(18);
      setMcqPoints(0.25); // 4.5đ
      setTrueFalseCount(4);
      setTrueFalsePoints(1.0); // 4.0đ
      setFillBlankCount(0);
      setFillBlankPoints(0.5);
      setMatchingCount(0);
      setMatchingPoints(0.5);
      setShortAnswerCount(6);
      setShortAnswerPoints(0.25); // 1.5đ
      setEssayCount(0);
      setEssayPoints(3.5);
      onSuccessToast('Đã áp dụng cấu trúc Mẫu Thi THPT Quốc Gia Mới (10.0đ)!');
    } else if (preset === 'essayOnly') {
      setMcqCount(0);
      setMcqPoints(0.25);
      setTrueFalseCount(0);
      setTrueFalsePoints(1.0);
      setFillBlankCount(0);
      setFillBlankPoints(0.5);
      setMatchingCount(0);
      setMatchingPoints(0.5);
      setShortAnswerCount(0);
      setShortAnswerPoints(0.25);
      setEssayCount(4);
      setEssayPoints(2.5); // 10.0đ
      onSuccessToast('Đã áp dụng cấu trúc 100% Tự luận (4 câu x 2.5đ = 10.0đ)!');
    }
  };

  // Loading & generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [generatedExamHtml, setGeneratedExamHtml] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'matrix' | 'spec' | 'exam' | 'rubric'>('all');

  // Download Sample Word (.DOC) file directly for presets
  const handleDownloadSampleFile = (presetType: string) => {
    let sampleTitle = '';
    let sampleSubject = '';
    let sampleGrade = '';
    let sampleBodyHtml = '';

    if (presetType === 'literary') {
      sampleSubject = 'Ngữ văn';
      sampleGrade = 'Khối 8';
      sampleTitle = 'Mau_De_Kiem_Tra_Ngu_Van_8_Giuahk1';
      sampleBodyHtml = `
        <table style="width:100%; border-collapse:collapse; margin-bottom:12pt;">
          <tr>
            <td style="width:45%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              PHÒNG GIÁO DỤC VÀ ĐÀO TẠO<br/>TRƯỜNG THCS CHUẨN MẪU
            </td>
            <td style="width:55%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              ĐỀ KIỂM TRA GIỮA HỌC KÌ I<br/>NĂM HỌC 2025 - 2026<br/>Môn: NGỮ VĂN - KHỐI 8<br/><i>Thời gian làm bài: 60 phút (Không kể thời gian phát đề)</i>
            </td>
          </tr>
        </table>
        <hr class="header-line" />
        <h2 style="text-align:center; font-size:13pt; margin-top:12pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">I. MA TRẬN ĐỀ KIỂM TRA (10.0 ĐIỂM)</h2>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;" border="1">
          <thead>
            <tr style="background-color:#f1f5f9;">
              <th style="padding:6px;">TT</th>
              <th style="padding:6px;">Chủ đề / Nội dung</th>
              <th style="padding:6px;">Nhận biết</th>
              <th style="padding:6px;">Thông hiểu</th>
              <th style="padding:6px;">Vận dụng</th>
              <th style="padding:6px;">Vận dụng cao</th>
              <th style="padding:6px;">Tổng % điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px; text-align:center;">1</td>
              <td style="padding:6px;">Đọc hiểu văn bản (Hịch tướng sĩ / Thơ yêu nước)</td>
              <td style="padding:6px; text-align:center;">4 câu MCQ (1.0đ)</td>
              <td style="padding:6px; text-align:center;">4 câu MCQ (1.0đ)</td>
              <td style="padding:6px; text-align:center;">2 câu Tự luận (2.0đ)</td>
              <td style="padding:6px; text-align:center;">1 câu TL (2.0đ)</td>
              <td style="padding:6px; text-align:center; font-weight:bold;">60% (6.0đ)</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center;">2</td>
              <td style="padding:6px;">Tập làm văn (Nghị luận xã hội về tinh thần tự học)</td>
              <td style="padding:6px; text-align:center;">-</td>
              <td style="padding:6px; text-align:center;">1.0đ</td>
              <td style="padding:6px; text-align:center;">2.0đ</td>
              <td style="padding:6px; text-align:center;">1.0đ</td>
              <td style="padding:6px; text-align:center; font-weight:bold;">40% (4.0đ)</td>
            </tr>
            <tr style="font-weight:bold; background-color:#f8fafc;">
              <td colspan="2" style="padding:6px; text-align:center;">Tổng cộng điểm</td>
              <td style="padding:6px; text-align:center;">2.0đ (20%)</td>
              <td style="padding:6px; text-align:center;">3.0đ (30%)</td>
              <td style="padding:6px; text-align:center;">3.0đ (30%)</td>
              <td style="padding:6px; text-align:center;">2.0đ (20%)</td>
              <td style="padding:6px; text-align:center;">10.0 điểm (100%)</td>
            </tr>
          </tbody>
        </table>

        <h2 style="text-align:center; font-size:13pt; margin-top:18pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">II. ĐỀ THI CHÍNH THỨC</h2>
        <p><b>PHẦN I: ĐỌC HIỂU (6.0 ĐIỂM)</b></p>
        <p><i>Đọc đoạn trích sau và thực hiện các yêu cầu bên dưới:</i></p>
        <blockquote style="margin:8pt 16pt; padding:8pt; background-color:#f8fafc; border-left:3pt solid #0284c7;">
          "Huống chi ta cùng các ngươi sinh phải thời loạn lạc, lớn gặp buổi gian nan... Thấy sứ giặc đi lại nghênh ngang ngoài đường, uốn lưỡi cú diều mà lăng mạ triều đình, đem thân dê chó mà bắt nạt phụ đạo..."
          <br/><i>(Trích Hịch tướng sĩ - Trần Quốc Tuấn)</i>
        </blockquote>
        <p><b>Câu 1 (0.25đ):</b> Tác giả của đoạn trích trên là ai?<br/>
        A. Nguyễn Trãi &nbsp;&nbsp;&nbsp;&nbsp; B. Trần Quốc Tuấn &nbsp;&nbsp;&nbsp;&nbsp; C. Lý Thường Kiệt &nbsp;&nbsp;&nbsp;&nbsp; D. Hồ Chí Minh</p>
        <p><b>Câu 2 (0.25đ):</b> Đoạn trích trên được viết theo thể loại nào trong văn học trung đại?<br/>
        A. Hịch &nbsp;&nbsp;&nbsp;&nbsp; B. Cáo &nbsp;&nbsp;&nbsp;&nbsp; C. Chiếu &nbsp;&nbsp;&nbsp;&nbsp; D. Tấu</p>
        <p><b>Câu 3 (2.0đ) (Tự luận):</b> Nêu ngắn gọn thái độ của tác giả đối với tội ác và sự hống hách của kẻ thù trong đoạn trích.</p>

        <p><b>PHẦN II: VIẾT (4.0 ĐIỂM)</b></p>
        <p>Viết bài văn nghị luận (khoảng 400 - 500 chữ) trình bày suy nghĩ của em về ý nghĩa của tinh thần tự học đối với học sinh hiện nay.</p>

        <h2 style="text-align:center; font-size:13pt; margin-top:18pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">III. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM</h2>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;" border="1">
          <thead>
            <tr style="background-color:#f1f5f9;">
              <th style="padding:6px;">Câu</th>
              <th style="padding:6px;">Nội dung / Đáp án chi tiết</th>
              <th style="padding:6px;">Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px; text-align:center; font-weight:bold;">Câu 1</td>
              <td style="padding:6px;">Đáp án B. Trần Quốc Tuấn</td>
              <td style="padding:6px; text-align:center;">0.25đ</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center; font-weight:bold;">Câu 2</td>
              <td style="padding:6px;">Đáp án A. Hịch</td>
              <td style="padding:6px; text-align:center;">0.25đ</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center; font-weight:bold;">Câu 3</td>
              <td style="padding:6px;">Thái độ căm thù sục sôi, khinh bỉ sâu sắc tội ác hống hách của giặc; khơi dậy lòng tự tôn dân tộc cho các tướng sĩ.</td>
              <td style="padding:6px; text-align:center;">2.0đ</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center; font-weight:bold;">Phần Viết</td>
              <td style="padding:6px;">
                • Mở bài (0.5đ): Dẫn dắt vấn đề tự học.<br/>
                • Thân bài (3.0đ): Giải thích khái niệm (0.5đ), Phân tích vai trò & lợi ích tự học (1.5đ), Dẫn chứng & Phản biện (1.0đ).<br/>
                • Kết bài (0.5đ): Bài học nhận thức và hành động của bản thân.
              </td>
              <td style="padding:6px; text-align:center;">4.0đ</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (presetType === 'math') {
      sampleSubject = 'Toán học';
      sampleGrade = 'Khối 10';
      sampleTitle = 'Mau_De_Kiem_Tra_Toan_10_Cuoihk1';
      sampleBodyHtml = `
        <table style="width:100%; border-collapse:collapse; margin-bottom:12pt;">
          <tr>
            <td style="width:45%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO<br/>TRƯỜNG THPT MẪU TOÁN HỌC
            </td>
            <td style="width:55%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              ĐỀ KIỂM TRA CUỐI HỌC KÌ I<br/>NĂM HỌC 2025 - 2026<br/>Môn: TOÁN HỌC - KHỐI 10<br/><i>Thời gian làm bài: 90 phút</i>
            </td>
          </tr>
        </table>
        <hr class="header-line" />
        <h2 style="text-align:center; font-size:13pt; margin-top:12pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">I. MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN 10</h2>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;" border="1">
          <thead>
            <tr style="background-color:#f1f5f9;">
              <th style="padding:6px;">STT</th>
              <th style="padding:6px;">Nội dung kiến thức</th>
              <th style="padding:6px;">Trắc nghiệm MCQ (12c)</th>
              <th style="padding:6px;">Đúng/Sai (4c)</th>
              <th style="padding:6px;">Trả lời ngắn (4c)</th>
              <th style="padding:6px;">Tự luận (2c)</th>
              <th style="padding:6px;">Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px; text-align:center;">1</td>
              <td style="padding:6px;">Mệnh đề & Tập hợp</td>
              <td style="padding:6px; text-align:center;">3 câu (0.75đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (1.0đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (0.5đ)</td>
              <td style="padding:6px; text-align:center;">-</td>
              <td style="padding:6px; text-align:center; font-weight:bold;">2.25đ</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center;">2</td>
              <td style="padding:6px;">Bất phương trình & Hàm số bậc hai</td>
              <td style="padding:6px; text-align:center;">4 câu (1.0đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (1.0đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (0.5đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (1.5đ)</td>
              <td style="padding:6px; text-align:center; font-weight:bold;">4.0đ</td>
            </tr>
            <tr>
              <td style="padding:6px; text-align:center;">3</td>
              <td style="padding:6px;">Vectơ & Lượng giác mặt phẳng</td>
              <td style="padding:6px; text-align:center;">5 câu (1.25đ)</td>
              <td style="padding:6px; text-align:center;">2 câu (2.0đ)</td>
              <td style="padding:6px; text-align:center;">2 câu (1.0đ)</td>
              <td style="padding:6px; text-align:center;">1 câu (1.5đ)</td>
              <td style="padding:6px; text-align:center; font-weight:bold;">3.75đ</td>
            </tr>
          </tbody>
        </table>
        <h2 style="text-align:center; font-size:13pt; margin-top:18pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">II. ĐỀ THI VÀ ĐÁP ÁN MẪU</h2>
        <p><b>PHẦN 1: TRẮC NGHIỆM KHÁCH QUAN (3.0 ĐIỂM)</b></p>
        <p><b>Câu 1:</b> Cho tập hợp A = [1; 5) và B = (2; 7]. Tìm tập hợp A &cap; B.<br/>
        A. [1; 7] &nbsp;&nbsp;&nbsp;&nbsp; B. (2; 5) &nbsp;&nbsp;&nbsp;&nbsp; C. [1; 2] &nbsp;&nbsp;&nbsp;&nbsp; D. (5; 7]</p>
        <p><b>PHẦN 2: TỰ LUẬN BÀI TẬP (3.0 ĐIỂM)</b></p>
        <p><b>Câu 1 (1.5đ):</b> Lập bảng biến thiên và vẽ đồ thị hàm số y = x<sup>2</sup> - 4x + 3.</p>
        <p><b>Câu 2 (1.5đ):</b> Trong mặt phẳng tọa độ Oxy, cho tam giác ABC có A(1; 2), B(-2; 3), C(5; 4). Tính tọa độ trọng tâm G và độ dài cạnh BC.</p>
      `;
    } else if (presetType === 'english') {
      sampleSubject = 'Tiếng Anh';
      sampleGrade = 'Khối 9';
      sampleTitle = 'Mau_De_Kiem_Tra_Tieng_Anh_9_Giuahk2';
      sampleBodyHtml = `
        <table style="width:100%; border-collapse:collapse; margin-bottom:12pt;">
          <tr>
            <td style="width:45%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              PHÒNG GIÁO DỤC VÀ ĐÀO TẠO<br/>TRƯỜNG THCS TIẾNG ANH CHUẨN
            </td>
            <td style="width:55%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              ENGLISH MID-TERM EXAMINATION<br/>GRADE 9 - SCHOOL YEAR 2025 - 2026<br/><i>Time allowed: 60 minutes</i>
            </td>
          </tr>
        </table>
        <hr class="header-line" />
        <h2 style="text-align:center; font-size:13pt; margin-top:12pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">I. SPECIFICATION MATRIX (10 MARKS)</h2>
        <p>Includes Phonetics, Vocabulary & Grammar, Reading Comprehension, Listening, and Sentence Transformation.</p>
        <h2 style="text-align:center; font-size:13pt; margin-top:18pt; margin-bottom:12pt; font-weight:bold; color:#1e293b;">II. OFFICIAL TEST PAPER</h2>
        <p><b>SECTION A: MULTIPLE CHOICE (4.0 MARKS)</b></p>
        <p><b>Question 1:</b> Choose the word whose underlined part is pronounced differently:<br/>
        A. r<u>e</u>cipe &nbsp;&nbsp;&nbsp;&nbsp; B. d<u>e</u>licious &nbsp;&nbsp;&nbsp;&nbsp; C. l<u>e</u>mon &nbsp;&nbsp;&nbsp;&nbsp; D. m<u>e</u>nu</p>
        <p><b>Question 2:</b> If you want to lose weight, you __________ eat too much fast food.<br/>
        A. shouldn't &nbsp;&nbsp;&nbsp;&nbsp; B. must &nbsp;&nbsp;&nbsp;&nbsp; C. can &nbsp;&nbsp;&nbsp;&nbsp; D. might</p>
        <p><b>SECTION B: WRITING TRANSFORMATION (2.0 MARKS)</b></p>
        <p><b>Question 1:</b> "If I don't practice every day, I won't improve my speaking skills."<br/>
        &rarr; Unless _______________________________________________________</p>
      `;
    } else {
      sampleSubject = presetType === 'chemistry' ? 'Hóa học' : 'Vật lí';
      sampleGrade = presetType === 'chemistry' ? 'Khối 10' : 'Khối 11';
      sampleTitle = `Mau_De_Kiem_Tra_${sampleSubject}_${sampleGrade}`.replace(/\s+/g, '_');
      sampleBodyHtml = `
        <table style="width:100%; border-collapse:collapse; margin-bottom:12pt;">
          <tr>
            <td style="width:45%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO<br/>TRƯỜNG THPT CHUYÊN MẪU
            </td>
            <td style="width:55%; text-align:center; font-weight:bold; font-size:11pt; vertical-align:top;">
              ĐỀ KIỂM TRA ĐỊNH KỲ MÔN ${sampleSubject.toUpperCase()}<br/>KHỐI ${sampleGrade.toUpperCase()}<br/><i>Thời gian làm bài: 45 phút</i>
            </td>
          </tr>
        </table>
        <hr class="header-line" />
        <h2 style="text-align:center; font-size:13pt; margin-top:12pt; margin-bottom:12pt; font-weight:bold;">MA TRẬN & ĐỀ THI MẪU CHUẨN BỘ GD&ĐT</h2>
        <p>Tài liệu bao gồm đầy đủ Ma trận 10 điểm, Bảng đặc tả 4 mức độ tư duy (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao), Đề kiểm tra và Bảng đáp án chấm chi tiết.</p>
      `;
    }

    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${sampleTitle}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.25; margin: 20pt; }
        table { border-collapse: collapse; width: 100%; margin-top: 6pt; margin-bottom: 6pt; }
        th, td { border: 1pt solid #000; padding: 5pt; text-align: left; }
        hr.header-line { border: none; border-top: 1.5pt solid #000; margin-top: 6pt; margin-bottom: 12pt; }
      </style>
      </head>
      <body>
    `;
    const fullSourceHtml = wordHeader + sampleBodyHtml + `</body></html>`;

    const blob = new Blob(['\ufeff', fullSourceHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sampleTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onSuccessToast(`📥 Đã tải xuống thành công File Mẫu (.DOC): ${sampleSubject} ${sampleGrade}!`);
  };

  // Load Presets
  const handleLoadPreset = (presetType: 'literary' | 'math' | 'english' | 'physics' | 'chemistry') => {
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
      onSuccessToast('Đã tải thông số Mẫu Ngữ văn 8 vào Form! Bấm [Tải Mẫu .DOC] để tải file Word về máy.');
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
      onSuccessToast('Đã tải thông số Mẫu Toán 10 vào Form! Bấm [Tải Mẫu .DOC] để tải file Word về máy.');
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
      onSuccessToast('Đã tải thông số Mẫu Tiếng Anh 9 vào Form! Bấm [Tải Mẫu .DOC] để tải file Word về máy.');
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
      onSuccessToast('Đã tải thông số Mẫu Vật lí 11 vào Form! Bấm [Tải Mẫu .DOC] để tải file Word về máy.');
    } else if (presetType === 'chemistry') {
      setSubject('Hóa học');
      setGrade('Khối 10');
      setExamType('Giữa học kì I');
      setDurationMinutes('45');
      setMcqCount(16);
      setTrueFalseCount(2);
      setFillBlankCount(0);
      setMatchingCount(0);
      setShortAnswerCount(4);
      setEssayCount(2);
      setTopicScope(
        `1. Cấu tạo nguyên tử: Hạt nhân, Electron, Đồng vị, Cấu hình electron nguyên tử.
2. Bảng tuần hoàn các nguyên tố hóa học & Định luật tuần hoàn.
3. Liên kết hóa học: Liên kết ion, liên kết cộng hóa trị.`
      );
      setAdditionalNotes('Gồm 16 câu MCQ, 2 câu Đúng/Sai, 4 câu Trả lời ngắn và 2 câu Tự luận tính toán.');
      onSuccessToast('Đã tải thông số Mẫu Hóa học 10 vào Form! Bấm [Tải Mẫu .DOC] để tải file Word về máy.');
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
      fullTopicScopePayload += `========================================================================\n`;
      fullTopicScopePayload += `YÊU CẦU QUAN TRỌNG NHẤT: BÁM SÁT 100% TÀI LIỆU/TỆP ĐÍNH KÈM TẢI LÊN DƯỚI ĐÂY (LẤY CHUẨN DỮ LIỆU GỐC, KHÔNG THÊM, KHÔNG BỚT).\n`;
      fullTopicScopePayload += `BẠN BẮT BUỘC CHỈ ĐƯỢC LẤY KIẾN THỨC, TRÍCH ĐOẠN VĂN BẢN, TÁC PHẨM, SỐ LIỆU VÀ CÂU HỎI TRONG NỘI DUNG TỆP NÀY ĐỂ XÂY DỰNG ĐỀ THI, MA TRẬN, BẢNG ĐẶC TẢ VÀ HƯỚNG DẪN CHẤM.\n`;
      fullTopicScopePayload += `TUYỆT ĐỐI KHÔNG DÙNG CÁC TÁC PHẨM MẶC ĐỊNH KHÁC (NHƯ HỊCH TƯỚNG SĨ, NAM QUỐC SƠN HÀ...) HOẶC TỰ Ý BỔ SUNG TÁC PHẨM KHÔNG CÓ TRONG TỆP TẢI LÊN!\n`;
      fullTopicScopePayload += `========================================================================\n\n`;

      attachedFiles.forEach((f, idx) => {
        fullTopicScopePayload += `--- TỆP TẢI LÊN GỐC #${idx + 1}: ${f.name} (${f.type.toUpperCase()}, Dung lượng: ${f.size}) ---\n`;
        fullTopicScopePayload += `NỘI DUNG VĂN BẢN/BÀI HỌC TRONG TỆP:\n${f.content || '(Tệp: ' + f.name + ')'}\n\n`;
      });
    }

    if (driveLinks.length > 0) {
      fullTopicScopePayload += `--- DANH SÁCH LINK DRIVE / SGK ONLINE TÍCH HỢP ---\n`;
      driveLinks.forEach((l) => {
        fullTopicScopePayload += `- Tên tài liệu: ${l.title} | URL: ${l.url}\n`;
      });
      fullTopicScopePayload += `\n`;
    }

    const isDefaultPresetText = topicScope.includes('Chủ đề 1: Thơ vần bằng') || topicScope.includes('Hịch tướng sĩ');
    if (!isDefaultPresetText || attachedFiles.length === 0) {
      fullTopicScopePayload += `--- PHẠM VI BÀI HỌC VÀ GHI CHÚ BỔ SUNG ---:\n${topicScope}`;
    }

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
          schoolYear,
          durationMinutes,
          additionalNotes,
          questionStructure: {
            mcqCount,
            mcqPoints,
            trueFalseCount,
            trueFalsePoints,
            fillBlankCount,
            fillBlankPoints,
            matchingCount,
            matchingPoints,
            shortAnswerCount,
            shortAnswerPoints,
            essayCount,
            essayPoints,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.examHtml) {
        let html = data.examHtml;
        if (!html.trim().startsWith('<div') && !html.trim().startsWith('<!DOCTYPE')) {
          html = await marked.parse(html);
        }
        setGeneratedExamHtml(html);
        onSuccessToast('Đã khởi tạo xong Hồ sơ Đề kiểm tra chuẩn BGDĐT!');
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

    // Parse extracted topics/text from topicScope & attachedFiles
    const sourceText = (topicScope || '').trim();
    const rawLines = sourceText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('===') && !l.startsWith('---'));

    // Helper function to clean section headings, scores, and quotes from topic titles
    const cleanTopicTitle = (str: string): string => {
      if (!str) return '';
      const cleaned = str
        .replace(/^===.*?===/g, '')
        .replace(/\[Tệp.*?\]/g, '')
        .replace(/^NỘI DUNG TỆP GỐC:\s*/i, '')
        .replace(/^PHẦN\s+[I|V|X\d]+\.?\s*(ĐỌC\s+HIỂU|VIẾT|TỰ\ LUẬN)?/gi, '')
        .replace(/\(\s*\d+[\.,]?\d*\s*đ(?:iểm)?\s*\)/gi, '') // Removes (5,0 điểm), (5.0 điểm), (5đ)...
        .replace(/^[\"\“\”\'\:\-\–\—\s\.\,]+|[\"\“\”\'\:\-\–\—\s\.\,]+$/g, '')
        .trim();
      
      if (/^(đọc hiểu|tự luận|trắc nghiệm|phần i|phần ii|ngữ liệu|đề bài|ngữ liệu gốc)$/i.test(cleaned)) {
        return '';
      }
      return cleaned;
    };

    let primaryTopic = '';
    for (const line of rawLines) {
      const cleanLine = line.replace(/^\[.*?\]/, '').replace(/^•\s*/, '').replace(/^NỘI DUNG TỆP GỐC:\s*/i, '').trim();
      const topicCandidate = cleanTopicTitle(cleanLine);
      if (topicCandidate.length > 5 && !cleanLine.startsWith('SỬ DỤNG CHUẨN DỮ LIỆU')) {
        primaryTopic = topicCandidate.slice(0, 120);
        break;
      }
    }

    const displayTopic = cleanTopicTitle(primaryTopic);

    const textParagraphs = rawLines.filter(l => l.length > 25 && !/^(câu|cau|đáp án|đề số|thời gian|môn|lớp|họ và tên)/i.test(l));
    const mainPassage = textParagraphs.slice(0, 5).join('\n\n') || sourceText.slice(0, 600) || `Tài liệu đính kèm cho môn ${subject} ${grade}`;

    const mcqQuestions: { q: string; options: string[]; answer: string }[] = [];
    const countToGen = mcqCount > 0 ? mcqCount : 0;

    if (countToGen > 0) {
      for (let i = 1; i <= countToGen; i++) {
        const pChoice = textParagraphs[(i - 1) % (textParagraphs.length || 1)] || primaryTopic;
        const cleanSnippet = pChoice.replace(/^"|"$/g, '').trim();
        const shortPhrase = cleanSnippet.split('.')[0] || cleanSnippet;

        let qText = '';
        let options: string[] = [];
        const correctAns = ['A', 'B', 'C', 'D'][(i - 1) % 4];
        const qType = (i - 1) % 5;

        if (qType === 0) {
          qText = `Câu ${i}. (${mcqPoints} điểm) Phương thức biểu đạt chính được sử dụng trong ngữ liệu/đoạn trích trên là gì?`;
          options = ['A. Miêu tả kết hợp tự sự và biểu cảm', 'B. Thuyết minh khoa học', 'C. Nghị luận xã hội', 'D. Hành chính - công vụ'];
        } else if (qType === 1) {
          qText = `Câu ${i}. (${mcqPoints} điểm) Dựa vào đoạn trích, chi tiết "${shortPhrase.slice(0, 60)}..." thể hiện nội dung gì?`;
          options = [
            `A. Tái hiện sinh động hình ảnh/nội dung: ${shortPhrase.slice(0, 40)}...`,
            `B. Diễn tả sự việc trái ngược với ngữ liệu thực tế`,
            `C. Phản ánh sự kiện không xuất hiện trong tác phẩm`,
            `D. Đưa ra nhận định mang tính giả thuyết`
          ];
        } else if (qType === 2) {
          qText = `Câu ${i}. (${mcqPoints} điểm) Trong câu văn: "${shortPhrase.slice(0, 65)}...", cách sử dụng từ ngữ/biện pháp nghệ thuật nổi bật là gì?`;
          options = [
            `A. Biện pháp so sánh/nhân hóa/ẩn dụ giàu giá trị biểu cảm`,
            `B. Thuật ngữ mượn tiếng nước ngoài`,
            `C. Phép liệt kê kỹ thuật`,
            `D. Biện pháp nói giảm nói tránh`
          ];
        } else if (qType === 3) {
          qText = `Câu ${i}. (${mcqPoints} điểm) Chủ đề trọng tâm bao trùm ngữ liệu đính kèm là gì?`;
          options = [
            `A. ${primaryTopic.slice(0, 70)}`,
            `B. Phân tích biến đổi khí hậu sinh thái`,
            `C. Giới thiệu xu hướng công nghệ hiện đại`,
            `D. Tóm tắt các lý thuyết xã hội`
          ];
        } else {
          qText = `Câu ${i}. (${mcqPoints} điểm) Thông điệp/ý nghĩa sâu sắc nhất rút ra từ ngữ liệu đính kèm là gì?`;
          options = [
            `A. Bồi dưỡng tình yêu thiên nhiên, quê hương và đạo lý con người`,
            `B. Phản đối việc tìm hiểu các giá trị truyền thống`,
            `C. Tăng cường sử dụng thiết bị công nghệ`,
            `D. Bỏ qua các bài học lịch sử`
          ];
        }

        const prefixes = ['A. ', 'B. ', 'C. ', 'D. '];
        const formattedOpts = options.map((opt, oIdx) => `${prefixes[oIdx]}${opt.replace(/^[A-D][\.\:\s]*/, '')}`);

        mcqQuestions.push({
          q: qText,
          options: formattedOpts,
          answer: correctAns
        });
      }
    }

    // 2. True/False Questions
    const trueFalseQuestions: { num: number; title: string; items: { label: string; text: string; isTrue: boolean }[] }[] = [];
    if (trueFalseCount > 0) {
      for (let i = 1; i <= trueFalseCount; i++) {
        trueFalseQuestions.push({
          num: i,
          title: `Câu ${i}. (${trueFalsePoints} điểm) Trong các phát biểu sau đây về ngữ liệu gốc, hãy xác định mỗi ý a), b), c), d) là Đúng hay Sai:`,
          items: [
            { label: 'a)', text: `Văn bản/ngữ liệu gốc tập trung thể hiện nội dung "${primaryTopic.slice(0, 60)}".`, isTrue: true },
            { label: 'b)', text: `Tác giả sử dụng các từ ngữ và hình ảnh chân thực, giàu sức gợi tả.`, isTrue: true },
            { label: 'c)', text: `Nội dung phản ánh sự việc trái ngược với tinh thần thực tế của ngữ liệu gốc.`, isTrue: false },
            { label: 'd)', text: `Thông điệp bài học hướng tới việc bồi dưỡng nhận thức và giá trị sống tích cực.`, isTrue: true }
          ]
        });
      }
    }

    // 3. Fill-in-blank Questions
    const fillBlankQuestions: { num: number; title: string; excerpt: string }[] = [];
    if (fillBlankCount > 0) {
      for (let i = 1; i <= fillBlankCount; i++) {
        const pSnippet = textParagraphs[i % (textParagraphs.length || 1)] || primaryTopic;
        fillBlankQuestions.push({
          num: i,
          title: `Câu ${i}. (${fillBlankPoints} điểm) Chọn từ/cụm từ thích hợp từ ngữ liệu gốc để điền vào chỗ trống (...):`,
          excerpt: `"${pSnippet.slice(0, 80)} ... (1) ... ${pSnippet.slice(80, 160)} ... (2) ... "`
        });
      }
    }

    // 4. Matching Questions
    const matchingQuestions: { num: number; title: string; colA: string[]; colB: string[] }[] = [];
    if (matchingCount > 0) {
      for (let i = 1; i <= matchingCount; i++) {
        matchingQuestions.push({
          num: i,
          title: `Câu ${i}. (${matchingPoints} điểm) Ghép thông tin ở Cột A tương ứng với Cột B dựa trên ngữ liệu gốc:`,
          colA: ['1. Chi tiết / Từ ngữ nổi bật', '2. Biện pháp / Phương thức', '3. Ý nghĩa / Thông điệp'],
          colB: ['a. Bồi dưỡng tư tưởng và cảm xúc nhân văn', 'b. Tái hiện không gian và hình ảnh chân thực', 'c. Thể hiện tư tưởng chủ đạo của tác phẩm']
        });
      }
    }

    // 5. Short Answer Questions
    const shortAnswerQuestions: { num: number; title: string }[] = [];
    if (shortAnswerCount > 0) {
      for (let i = 1; i <= shortAnswerCount; i++) {
        shortAnswerQuestions.push({
          num: i,
          title: `Câu ${i}. (${shortAnswerPoints} điểm) Dựa vào ngữ liệu gốc, hãy trả lời ngắn gọn (trong 1-2 câu) nội dung chính hoặc bài học cốt lõi.`
        });
      }
    }

    // 6. Essay Questions
    const essayQuestionsList: { num: number; points: number; text: string }[] = [];
    if (essayCount > 0) {
      const ptsPerEssay = essayCount === 1 ? essayPoints : parseFloat((essayPoints).toFixed(2));
      for (let i = 1; i <= essayCount; i++) {
        if (i === 1) {
          essayQuestionsList.push({
            num: 1,
            points: ptsPerEssay,
            text: displayTopic
              ? `Từ nội dung dữ liệu gốc trong tài liệu "${displayTopic}", em hãy viết một đoạn văn (khoảng 10-12 câu) phân tích ý nghĩa cốt lõi và bài học thực tiễn rút ra cho bản thân.`
              : `Từ nội dung dữ liệu gốc trong tài liệu đính kèm, em hãy viết một đoạn văn (khoảng 10-12 câu) phân tích ý nghĩa cốt lõi và bài học thực tiễn rút ra cho bản thân.`
          });
        } else {
          essayQuestionsList.push({
            num: i,
            points: ptsPerEssay,
            text: displayTopic
              ? `Phân tích toàn diện ngữ liệu/đề bài trong tài liệu tải lên (${displayTopic}). Chỉ rõ các giá trị nội dung, nghệ thuật/phương pháp biểu đạt và liên hệ thực tế.`
              : `Phân tích toàn diện ngữ liệu/đề bài trong tài liệu tải lên. Chỉ rõ các giá trị nội dung, nghệ thuật/phương pháp biểu đạt và liên hệ thực tế.`
          });
        }
      }
    }

    const totalMcqPts = mcqQuestions.length * mcqPoints;
    const totalTrueFalsePts = trueFalseQuestions.length * trueFalsePoints;
    const totalFillBlankPts = fillBlankQuestions.length * fillBlankPoints;
    const totalMatchingPts = matchingQuestions.length * matchingPoints;
    const totalShortAnswerPts = shortAnswerQuestions.length * shortAnswerPoints;
    const totalEssayPts = essayQuestionsList.reduce((acc, curr) => acc + curr.points, 0);
    const totalObjectivePts = totalMcqPts + totalTrueFalsePts + totalFillBlankPts + totalMatchingPts + totalShortAnswerPts;
    const totalExamScore = totalObjectivePts + totalEssayPts;

    const formatPts = (num: number) => {
      const r = Math.round(num * 100) / 100;
      return Number.isInteger(r) ? r.toFixed(1) : r.toString();
    };

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
          
          <!-- OFFICIAL EXAM HEADER (TABLE FORMAT FOR MS WORD COMPATIBILITY) -->
          <table class="header-table" style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 8px; font-family: 'Times New Roman', serif;">
            <tr>
              <td style="width: 48%; text-align: center; vertical-align: top; border: none; padding: 2px;">
                <div style="font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a;">${headerDept}</div>
                <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase; color: #0f172a; margin-top: 2px;">${schoolName}</div>
                <div style="font-style: italic; font-size: 10pt; color: #334155; margin-top: 4px;">Mã đề thi: <b style="font-family: monospace;">101</b></div>
              </td>
              <td style="width: 52%; text-align: center; vertical-align: top; border: none; padding: 2px;">
                <div style="font-weight: bold; font-size: 12.5pt; text-transform: uppercase; color: #1e1b4b;">ĐỀ KIỂM TRA ${examType.toUpperCase()}</div>
                <div style="font-weight: bold; font-size: 11pt; color: #0f172a; margin-top: 2px;">NĂM HỌC ${schoolYear}</div>
                <div style="font-weight: bold; font-size: 11pt; color: #0f172a; margin-top: 2px;">Môn: ${subject.toUpperCase()} - ${grade.toUpperCase()}</div>
                <div style="font-style: italic; font-size: 10pt; color: #334155; margin-top: 2px;">Thời gian làm bài: ${durationMinutes} phút (không kể thời gian phát đề)</div>
              </td>
            </tr>
          </table>

          <hr class="header-line" style="border: none; border-top: 1.5pt solid #0f172a; margin-top: 4px; margin-bottom: 16px;" />

          <!-- STUDENT INFO & GRADE BOX (TABLE FORMAT) -->
          <table class="student-box-table" style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-family: 'Times New Roman', serif;">
            <tr>
              <td class="info-cell" style="width: 64%; border: 1px solid #475569; padding: 10px; vertical-align: top; font-size: 11pt; line-height: 1.8;">
                <div><b>Họ và tên học sinh:</b> ......................................................................................................................</div>
                <div><b>Lớp:</b> .............................................. <b>Trường:</b> ....................................................................................</div>
              </td>
              <td class="score-cell" style="width: 36%; border: 1.5pt solid #0f172a; padding: 8px; text-align: center; vertical-align: top; font-size: 11pt;">
                <div style="font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; font-size: 10pt;">ĐIỂM SỐ & LỜI PHÊ GIÁO VIÊN</div>
                <div style="height: 40px;"></div>
              </td>
            </tr>
          </table>

          <!-- EXAM CONTENT -->
          <div class="space-y-6 text-sm leading-relaxed text-slate-900 font-serif">
            
            <!-- PASSAGE EXCERPT -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-300 font-serif leading-relaxed text-sm">
              <div class="font-bold text-xs uppercase text-slate-500 mb-2 border-b border-slate-200 pb-1">NGỮ LIỆU / TÀI LIỆU CỐT LÕI TẢI LÊN:</div>
              <div class="whitespace-pre-wrap italic text-slate-900">${mainPassage}</div>
            </div>

            <!-- PHẦN I: TRẮC NGHIỆM KHÁCH QUAN -->
            ${(mcqQuestions.length > 0 || trueFalseQuestions.length > 0 || fillBlankQuestions.length > 0 || matchingQuestions.length > 0 || shortAnswerQuestions.length > 0) ? `
            <div>
              <div class="font-bold text-base uppercase text-indigo-950 border-b border-slate-300 pb-1 mb-3">
                PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (${formatPts(totalObjectivePts)} điểm)
              </div>

              <div class="space-y-4">
                ${mcqQuestions.length > 0 ? `
                <div>
                  ${(trueFalseQuestions.length > 0 || fillBlankQuestions.length > 0 || matchingQuestions.length > 0 || shortAnswerQuestions.length > 0) ? `
                    <div class="font-bold text-xs uppercase text-slate-800 mb-2">1. Trắc nghiệm khoanh đáp án đúng:</div>
                  ` : ''}
                  <p class="italic text-xs text-slate-600 mb-3">Khoanh tròn vào duy nhất một chữ cái A, B, C hoặc D đứng trước câu trả lời đúng nhất:</p>

                  <div class="space-y-3">
                    ${mcqQuestions.map(m => `
                      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-sans">
                        <p class="font-bold text-slate-900">${m.q}</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 pl-2">
                          ${m.options.map(opt => `<div>${opt}</div>`).join('')}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${trueFalseQuestions.length > 0 ? `
                <div class="pt-2">
                  <div class="font-bold text-xs uppercase text-slate-800 mb-2">2. Trắc nghiệm lựa chọn Đúng / Sai:</div>
                  <p class="italic text-xs text-slate-600 mb-3">Trong mỗi câu, chọn Đúng hoặc Sai cho mỗi ý a), b), c), d):</p>

                  <div class="space-y-3 text-xs font-sans">
                    ${trueFalseQuestions.map(tf => `
                      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p class="font-bold text-slate-900">${tf.title}</p>
                        <div class="mt-2 pl-3 space-y-1">
                          ${tf.items.map(it => `
                            <div class="flex items-start justify-between border-b border-slate-100 py-1">
                              <span><b>${it.label}</b> ${it.text}</span>
                              <span class="font-bold text-indigo-900 ml-2 font-mono">[Đ/S]</span>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${fillBlankQuestions.length > 0 ? `
                <div class="pt-2">
                  <div class="font-bold text-xs uppercase text-slate-800 mb-2">3. Trắc nghiệm điền khuyết:</div>
                  <div class="space-y-3 text-xs font-sans">
                    ${fillBlankQuestions.map(fb => `
                      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p class="font-bold text-slate-900">${fb.title}</p>
                        <p class="mt-2 italic pl-2 text-slate-800">${fb.excerpt}</p>
                        <p class="mt-2 pl-2 text-slate-600">(1): ........................................ | (2): ........................................</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${matchingQuestions.length > 0 ? `
                <div class="pt-2">
                  <div class="font-bold text-xs uppercase text-slate-800 mb-2">4. Trắc nghiệm Nối cột:</div>
                  <div class="space-y-3 text-xs font-sans">
                    ${matchingQuestions.map(m => `
                      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p class="font-bold text-slate-900">${m.title}</p>
                        <div class="grid grid-cols-2 gap-4 mt-2 border border-slate-200 p-2 rounded bg-white">
                          <div>
                            <p class="font-bold text-indigo-900 border-b pb-1">Cột A</p>
                            <ul class="list-none space-y-1 mt-1">
                              ${m.colA.map(a => `<li>${a}</li>`).join('')}
                            </ul>
                          </div>
                          <div>
                            <p class="font-bold text-indigo-900 border-b pb-1">Cột B</p>
                            <ul class="list-none space-y-1 mt-1">
                              ${m.colB.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                          </div>
                        </div>
                        <p class="mt-2 font-semibold text-slate-700">Trả lời ghép nối: 1 - ..... ; 2 - ..... ; 3 - .....</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                ${shortAnswerQuestions.length > 0 ? `
                <div class="pt-2">
                  <div class="font-bold text-xs uppercase text-slate-800 mb-2">5. Trắc nghiệm trả lời ngắn:</div>
                  <div class="space-y-3 text-xs font-sans">
                    ${shortAnswerQuestions.map(sa => `
                      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p class="font-bold text-slate-900">${sa.title}</p>
                        <p class="mt-2 text-slate-500 italic">Trả lời: ................................................................................................................................................</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}

            <!-- PHẦN II: VIẾT -->
            ${essayQuestionsList.length > 0 ? `
            <div class="pt-4">
              <div class="font-bold text-base uppercase text-indigo-950 border-b border-slate-300 pb-1 mb-3">
                PHẦN II. VIẾT (${formatPts(totalEssayPts)} điểm)
              </div>

              <div class="space-y-4 font-sans text-xs">
                ${essayQuestionsList.map(eq => `
                  <div class="p-4 bg-indigo-50/40 rounded-lg border border-indigo-100">
                    <p class="font-bold text-slate-900">Câu ${eq.num}. (${formatPts(eq.points)} điểm)</p>
                    <p class="mt-1 text-slate-800 leading-relaxed">${eq.text}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

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
              ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT (THANG ĐIỂM ${formatPts(totalExamScore)})
            </h2>
          </div>

          <div class="space-y-6 text-xs">
            <div>
              <h3 class="font-bold text-sm text-indigo-950 mb-3 border-b pb-1">1. Đáp án Phần I: Trắc nghiệm khách quan (${formatPts(totalObjectivePts)} điểm)</h3>
              
              ${mcqQuestions.length > 0 ? `
              <div class="mb-4">
                <p class="font-bold text-slate-800 mb-1.5">a) Trắc nghiệm khoanh đáp án đúng (Mỗi câu ${formatPts(mcqPoints)} điểm):</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-center border-collapse border border-slate-300">
                    <thead>
                      <tr class="bg-slate-800 text-white font-bold">
                        <th class="p-2 border border-slate-300">Câu</th>
                        ${mcqQuestions.map((_, i) => `<th class="p-2 border border-slate-300">${i + 1}</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="font-bold text-indigo-900 bg-amber-50">
                        <td class="p-2 border border-slate-300 bg-slate-100">Đáp án</td>
                        ${mcqQuestions.map(m => `<td class="p-2 border border-slate-300">${m.answer}</td>`).join('')}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              ` : ''}

              ${trueFalseQuestions.length > 0 ? `
              <div class="mb-4">
                <p class="font-bold text-slate-800 mb-1.5">b) Trắc nghiệm lựa chọn Đúng / Sai (Mỗi câu ${formatPts(trueFalsePoints)} điểm - Đúng 1 ý: 0.1đ; Đúng 2 ý: 0.25đ; Đúng 3 ý: 0.5đ; Đúng 4 ý: ${formatPts(trueFalsePoints)}đ):</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse border border-slate-300">
                    <thead>
                      <tr class="bg-indigo-900 text-white font-bold text-center">
                        <th class="p-2 border border-slate-300 w-16">Câu</th>
                        <th class="p-2 border border-slate-300">Đáp án chi tiết các ý a, b, c, d</th>
                        <th class="p-2 border border-slate-300 w-28">Điểm tối đa</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${trueFalseQuestions.map((tf, idx) => `
                        <tr>
                          <td class="p-2 border border-slate-300 font-bold text-center">Câu ${idx + 1}</td>
                          <td class="p-2 border border-slate-300">
                            <div class="grid grid-cols-2 gap-2">
                              ${tf.items.map(it => `
                                <div><b>${it.label}</b> ${it.isTrue ? '<span class="text-emerald-700 font-bold">[Đúng]</span>' : '<span class="text-rose-700 font-bold">[Sai]</span>'} : ${it.text}</div>
                              `).join('')}
                            </div>
                          </td>
                          <td class="p-2 border border-slate-300 text-center font-bold">${formatPts(trueFalsePoints)}đ</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              ` : ''}

              ${fillBlankQuestions.length > 0 ? `
              <div class="mb-4">
                <p class="font-bold text-slate-800 mb-1.5">c) Trắc nghiệm điền khuyết (Mỗi câu ${formatPts(fillBlankPoints)} điểm):</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse border border-slate-300">
                    <thead>
                      <tr class="bg-indigo-900 text-white font-bold text-center">
                        <th class="p-2 border border-slate-300 w-16">Câu</th>
                        <th class="p-2 border border-slate-300">Đáp án từ/cụm từ điền đúng</th>
                        <th class="p-2 border border-slate-300 w-28">Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${fillBlankQuestions.map((fb, idx) => `
                        <tr>
                          <td class="p-2 border border-slate-300 font-bold text-center">Câu ${idx + 1}</td>
                          <td class="p-2 border border-slate-300"><b>(1)</b> Từ/cụm từ cốt lõi 1 từ ngữ liệu gốc ; <b>(2)</b> Khái niệm/Từ khóa 2 từ ngữ liệu gốc.</td>
                          <td class="p-2 border border-slate-300 text-center font-bold">${formatPts(fillBlankPoints)}đ</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              ` : ''}

              ${matchingQuestions.length > 0 ? `
              <div class="mb-4">
                <p class="font-bold text-slate-800 mb-1.5">d) Trắc nghiệm Nối cột (Mỗi câu ${formatPts(matchingPoints)} điểm):</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse border border-slate-300">
                    <thead>
                      <tr class="bg-indigo-900 text-white font-bold text-center">
                        <th class="p-2 border border-slate-300 w-16">Câu</th>
                        <th class="p-2 border border-slate-300">Đáp án ghép nối chuẩn (Cột A - Cột B)</th>
                        <th class="p-2 border border-slate-300 w-28">Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${matchingQuestions.map((m, idx) => `
                        <tr>
                          <td class="p-2 border border-slate-300 font-bold text-center">Câu ${idx + 1}</td>
                          <td class="p-2 border border-slate-300 font-semibold text-indigo-950">1 - b ; 2 - c ; 3 - a (Khớp đúng định nghĩa & chi tiết trong ngữ liệu)</td>
                          <td class="p-2 border border-slate-300 text-center font-bold">${formatPts(matchingPoints)}đ</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              ` : ''}

              ${shortAnswerQuestions.length > 0 ? `
              <div class="mb-4">
                <p class="font-bold text-slate-800 mb-1.5">e) Trắc nghiệm trả lời ngắn (Mỗi câu ${formatPts(shortAnswerPoints)} điểm):</p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse border border-slate-300">
                    <thead>
                      <tr class="bg-indigo-900 text-white font-bold text-center">
                        <th class="p-2 border border-slate-300 w-16">Câu</th>
                        <th class="p-2 border border-slate-300">Nội dung câu hỏi</th>
                        <th class="p-2 border border-slate-300">Đáp án vắn tắt cốt lõi</th>
                        <th class="p-2 border border-slate-300 w-24">Điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${shortAnswerQuestions.map((sa, idx) => `
                        <tr>
                          <td class="p-2 border border-slate-300 font-bold text-center">Câu ${idx + 1}</td>
                          <td class="p-2 border border-slate-300">${sa.title}</td>
                          <td class="p-2 border border-slate-300 font-medium text-emerald-900">Trả lời ngắn gọn, chính xác từ khóa chính bám sát ngữ liệu gốc.</td>
                          <td class="p-2 border border-slate-300 text-center font-bold">${formatPts(shortAnswerPoints)}đ</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              ` : ''}

            </div>

            ${essayQuestionsList.length > 0 ? `
            <div>
              <h3 class="font-bold text-sm text-indigo-950 mb-3 border-b pb-1">2. Hướng dẫn chấm Phần II: Viết / Tự luận (${formatPts(totalEssayPts)} điểm)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse border border-slate-300">
                  <thead>
                    <tr class="bg-indigo-900 text-white font-bold">
                      <th class="p-2.5 border border-slate-300 w-16 text-center">Câu</th>
                      <th class="p-2.5 border border-slate-300">Ý / Yêu cầu đạt được (Bám sát trực tiếp nội dung đề bài)</th>
                      <th class="p-2.5 border border-slate-300 w-24 text-center">Điểm</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    ${essayQuestionsList.map((eq) => `
                      <tr>
                        <td class="p-2.5 border border-slate-300 font-bold text-center bg-slate-50" rowspan="4">Câu ${eq.num}<br/>(${formatPts(eq.points)}đ)</td>
                        <td class="p-2.5 border border-slate-300 font-semibold text-indigo-950 bg-slate-50/80" colspan="2">
                          Đề bài: "${eq.text}"
                        </td>
                      </tr>
                      <tr>
                        <td class="p-2.5 border border-slate-300"><b>Hình thức & Kỹ năng:</b> Đảm bảo thể loại/bố cục bài làm, diễn đạt trôi chảy, không mắc lỗi chính tả, dùng từ.</td>
                        <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 border border-slate-300"><b>Nội dung đáp ứng câu hỏi:</b> Trả lời trực tiếp và trọn vẹn yêu cầu của đề: "${eq.text.length > 80 ? eq.text.slice(0, 80) + '...' : eq.text}". Nêu đủ các luận điểm, phân tích chi tiết và trích dẫn bằng chứng thuyết phục từ ngữ liệu gốc${displayTopic ? ` (${displayTopic})` : ''}.</td>
                        <td class="p-2.5 border border-slate-300 text-center font-bold">${formatPts(Math.max(0.5, eq.points - 1.0))}đ</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 border border-slate-300"><b>Sáng tạo & Liên hệ:</b> Có góc nhìn sâu sắc, vận dụng liên hệ thực tế bản thân, lập luận chặt chẽ.</td>
                        <td class="p-2.5 border border-slate-300 text-center font-bold">0.5đ</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                <h4 class="font-bold text-xs uppercase text-indigo-900 mb-2">3. DÀN Ý GỢI Ý TRẢ LỜI & BÀI LÀM MẪU PHẦN VIẾT / TỰ LUẬN:</h4>
                <div class="space-y-3 text-xs text-slate-800">
                  ${essayQuestionsList.map((eq) => `
                    <div class="p-3 bg-white rounded-lg border border-indigo-100">
                      <p class="font-bold text-indigo-950 mb-1">Câu ${eq.num} (${formatPts(eq.points)} điểm): "${eq.text}"</p>
                      <ul class="list-disc pl-5 space-y-1 text-slate-700">
                        <li><b>Mở bài/đoạn:</b> Giới thiệu trực tiếp vấn đề cần giải quyết trong câu hỏi dựa trên ngữ liệu gốc${displayTopic ? ` (${displayTopic})` : ''}.</li>
                        <li><b>Thân bài/đoạn:</b> Phân tích chi tiết 2 - 3 luận điểm cốt lõi, trích dẫn dẫn chứng tiêu biểu từ văn bản đính kèm, liên hệ tác động thực tiễn.</li>
                        <li><b>Kết bài/đoạn & Bài học:</b> Khẳng định tổng quát thông điệp và rút ra bài học nhận thức, hành động bản thân.</li>
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            ` : ''}

          </div>
        </div>
        ` : ''}

      </div>
    `;

    setGeneratedExamHtml(localHtml);
    onSuccessToast('Đã khởi tạo Hồ sơ Đề kiểm tra chuẩn Bộ (Offline Engine)!');
  };

  // Save to Kho Đề Kiểm Tra & durable IndexedDB/Supabase storage
  const handleSaveToRepository = async () => {
    if (!generatedExamHtml) return;

    const newExam: ExamItem = {
      id: 'exam-' + Date.now(),
      title: generatedTitle || `Đề kiểm tra ${examType} ${subject} ${grade}`,
      subject,
      grade,
      examType,
      durationMinutes,
      schoolName,
      headerDept,
      schoolYear,
      framework: 'TT 02/2025 + QĐ 3439',
      template: 'Mẫu Đề Kiểm Tra Chuẩn BGDĐT 2018',
      originalContent: topicScope,
      integratedContent: generatedExamHtml,
      createdAt: Date.now(),
      dateString: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      userId: currentUser?.uid || 'guest-teacher',
      ownerEmail: currentUser?.email || '',
      authorName: currentUser?.displayName || 'Giáo viên'
    };

    await onSaveExam(newExam);
    onSuccessToast('Đã lưu thành công Đề kiểm tra vào Kho Đề Kiểm Tra riêng biệt (không lưu vào Kho Giáo Án)!');
  };

  // Export Word document (.docx compatible format)
  const handleExportWord = () => {
    if (!generatedExamHtml) return;

    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
      <meta charset='utf-8'>
      <title>${generatedTitle}</title>
      <style>
        @page Section1 {
          size: 21.0cm 29.7cm;
          margin: 2.0cm 2.0cm 2.0cm 2.0cm;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
        }
        div.Section1 { page: Section1; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.35; color: #000; }
        h1, h2, h3, h4 { font-family: 'Times New Roman', serif; font-weight: bold; color: #000; margin-top: 12pt; margin-bottom: 6pt; }
        p { margin-top: 3pt; margin-bottom: 3pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt; }
        th, td { padding: 5pt; font-size: 11pt; vertical-align: top; }
        table:not(.header-table):not(.student-box-table) th, table:not(.header-table):not(.student-box-table) td { border: 1px solid #000; }
        table:not(.header-table):not(.student-box-table) th { background-color: #f1f5f9; color: #000; font-weight: bold; }
        .header-table { width: 100%; border: none !important; margin-bottom: 8pt; }
        .header-table td { border: none !important; padding: 2pt; text-align: center; }
        .student-box-table { width: 100%; border-collapse: collapse; margin-bottom: 15pt; }
        .student-box-table td.info-cell { width: 64%; border: 1px solid #000 !important; padding: 8pt; font-size: 11pt; line-height: 1.8; }
        .student-box-table td.score-cell { width: 36%; border: 1.5pt solid #000 !important; padding: 6pt; text-align: center; font-size: 11pt; }
        hr.header-line { border: none; border-top: 1.5pt solid #000; margin-top: 6pt; margin-bottom: 12pt; }
      </style>
      </head>
      <body>
      <div class="Section1">
    `;
    const wordFooter = `</div></body></html>`;
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
              Tạo Đề Kiểm Tra Định Kỳ & Ma Trận Chuẩn
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Biên soạn trọn bộ hồ sơ kiểm tra: <span className="text-amber-300 font-semibold">Phân tích phạm vi</span>, <span className="text-amber-300 font-semibold">Ma trận đề</span>, <span className="text-amber-300 font-semibold">Bảng đặc tả chi tiết</span>, <span className="text-amber-300 font-semibold">Đề thi chính thức (Trắc nghiệm + Tự luận LaTeX)</span> và <span className="text-amber-300 font-semibold">Đáp án & Hướng dẫn chấm</span>.
            </p>
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

          {/* Question 3: Integrated Question Structure & Point Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-800">
                3. Lựa chọn tích hợp dạng câu hỏi & Thiết lập điểm: <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black px-2 py-0.5 bg-slate-200 text-slate-800 rounded-lg">
                  Tổng: {totalExamQuestions} câu
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${
                  Math.abs(totalExamScore - 10) < 0.01 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {formatPoints(totalExamScore)} điểm {Math.abs(totalExamScore - 10) >= 0.01 && '(Khuyên dùng: 10đ)'}
                </span>
              </div>
            </div>

            {/* Structure Presets Bar */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('standard')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                Mẫu Chuẩn (12 MCQ + 2 TL = 10đ)
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('diverse')}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[10px] font-bold text-amber-800 rounded-lg border border-amber-200 transition cursor-pointer"
              >
                Đa dạng 6 dạng (10đ)
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('thpt')}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-[10px] font-bold text-indigo-800 rounded-lg border border-indigo-200 transition cursor-pointer"
              >
                Mẫu Thi THPT Mới (10đ)
              </button>
              <button
                type="button"
                onClick={() => handleApplyStructurePreset('essayOnly')}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-800 rounded-lg border border-rose-200 transition cursor-pointer"
              >
                100% Tự luận (10đ)
              </button>
            </div>

            <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
              
              {/* 1. MCQ */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">🎯</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm khoanh đáp án đúng</div>
                    <div className="text-[10px] text-slate-500">Lựa chọn 1 đáp án A, B, C hoặc D</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setMcqCount(Math.max(0, mcqCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={mcqCount}
                      onChange={e => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setMcqCount(mcqCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setMcqPoints(Math.max(0, parseFloat((mcqPoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={mcqPoints}
                      onChange={e => setMcqPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setMcqPoints(parseFloat((mcqPoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalMcqPts)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. True / False */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">⚖️</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm lựa chọn đúng sai</div>
                    <div className="text-[10px] text-slate-500">Xác định Đúng/Sai cho 4 ý a, b, c, d</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setTrueFalseCount(Math.max(0, trueFalseCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={trueFalseCount}
                      onChange={e => setTrueFalseCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setTrueFalseCount(trueFalseCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setTrueFalsePoints(Math.max(0, parseFloat((trueFalsePoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={trueFalsePoints}
                      onChange={e => setTrueFalsePoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setTrueFalsePoints(parseFloat((trueFalsePoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-sky-50 text-sky-900 border border-sky-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalTrueFalsePts)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Fill in blank */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">📝</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm điền khuyết</div>
                    <div className="text-[10px] text-slate-500">Điền từ / cụm từ thích hợp vào chỗ trống</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setFillBlankCount(Math.max(0, fillBlankCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={fillBlankCount}
                      onChange={e => setFillBlankCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setFillBlankCount(fillBlankCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setFillBlankPoints(Math.max(0, parseFloat((fillBlankPoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={fillBlankPoints}
                      onChange={e => setFillBlankPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setFillBlankPoints(parseFloat((fillBlankPoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalFillBlankPts)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Matching */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">🔗</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm Nối</div>
                    <div className="text-[10px] text-slate-500">Ghép vế Cột A tương ứng Cột B</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setMatchingCount(Math.max(0, matchingCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={matchingCount}
                      onChange={e => setMatchingCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setMatchingCount(matchingCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setMatchingPoints(Math.max(0, parseFloat((matchingPoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={matchingPoints}
                      onChange={e => setMatchingPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setMatchingPoints(parseFloat((matchingPoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalMatchingPts)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Short Answer */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">💬</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trắc nghiệm trả lời ngắn</div>
                    <div className="text-[10px] text-slate-500">Điền đáp số / câu trả lời vắn tắt</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setShortAnswerCount(Math.max(0, shortAnswerCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={shortAnswerCount}
                      onChange={e => setShortAnswerCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setShortAnswerCount(shortAnswerCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setShortAnswerPoints(Math.max(0, parseFloat((shortAnswerPoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={shortAnswerPoints}
                      onChange={e => setShortAnswerPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShortAnswerPoints(parseFloat((shortAnswerPoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalShortAnswerPts)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. Essay */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">✍️</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Tự luận</div>
                    <div className="text-[10px] text-slate-500">Viết đoạn / bài văn, phân tích, giải bài tập</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Số câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Số câu:</span>
                    <button
                      type="button"
                      onClick={() => setEssayCount(Math.max(0, essayCount - 1))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={essayCount}
                      onChange={e => setEssayCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-9 text-center text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => setEssayCount(essayCount + 1)}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Điểm/câu */}
                  <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 mr-0.5 pl-1">Điểm/câu:</span>
                    <button
                      type="button"
                      onClick={() => setEssayPoints(Math.max(0, parseFloat((essayPoints - 0.25).toFixed(2))))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >-</button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={essayPoints}
                      onChange={e => setEssayPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-12 text-center text-xs font-extrabold text-indigo-950 bg-white border border-slate-200 rounded py-0.5 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setEssayPoints(parseFloat((essayPoints + 0.25).toFixed(2)))}
                      className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
                    >+</button>
                  </div>

                  {/* Tổng điểm dạng */}
                  <div className="min-w-[60px] text-right">
                    <span className="inline-block px-2 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg text-[11px] font-black font-mono">
                      {formatPoints(totalEssayPts)}đ
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Subject & Grade with Add/Edit Capabilities */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Subject Selection & Custom Add */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">Môn học:</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubject(!isAddingSubject)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>{isAddingSubject ? 'Đóng' : '+ Thêm môn mới'}</span>
                  </button>
                </div>

                {!isAddingSubject ? (
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {subjectsList.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="text"
                      value={customSubjectInput}
                      onChange={e => setCustomSubjectInput(e.target.value)}
                      placeholder="Nhập tên môn học mới..."
                      className="w-full p-2 text-xs font-bold bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewSubject}
                      className="px-2.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer"
                    >
                      Lưu
                    </button>
                  </div>
                )}
              </div>

              {/* Grade Selection & Custom Add */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">Khối lớp:</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingGrade(!isAddingGrade)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>{isAddingGrade ? 'Đóng' : '+ Thêm khối'}</span>
                  </button>
                </div>

                {!isAddingGrade ? (
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {gradesList.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="text"
                      value={customGradeInput}
                      onChange={e => setCustomGradeInput(e.target.value)}
                      placeholder="Nhập khối / lớp mới..."
                      className="w-full p-2 text-xs font-bold bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewGrade}
                      className="px-2.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer"
                    >
                      Lưu
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Header Title Information Panel */}
          <div className="space-y-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div className="text-xs font-extrabold text-indigo-950 flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-1.5">
              <span className="flex items-center gap-1.5 flex-wrap">
                Khung Tiêu Đề (Header) Đề Kiểm Tra:
                {!isAdmin && (
                  <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700 inline" /> Chỉ Admin mới có quyền thay đổi
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Xuất chuẩn Word 2 cột</span>
            </div>

            {/* Field: Header Dept (Cơ quan cấp trên) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                1. Cơ quan quản lý / UBND Xã / Phòng / Sở:
              </label>
              <input
                type="text"
                value={headerDept}
                onChange={e => isAdmin && setHeaderDept(e.target.value)}
                disabled={!isAdmin}
                readOnly={!isAdmin}
                placeholder="Ví dụ: UBND XÃ HÒA XÁ, PHÒNG GD&ĐT..."
                className={`w-full p-2 text-xs font-bold border rounded-xl ${
                  isAdmin 
                    ? 'text-slate-900 bg-white border-slate-300 focus:ring-2 focus:ring-rose-500' 
                    : 'text-slate-600 bg-slate-100 border-slate-200 cursor-not-allowed opacity-90'
                }`}
              />
              <div className="flex flex-wrap gap-1 mt-1">
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => isAdmin && setHeaderDept('UBND XÃ HÒA XÁ')}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition ${
                    isAdmin 
                      ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 cursor-pointer' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  + UBND Xã Hòa Xá
                </button>
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => isAdmin && setHeaderDept('UBND XÃ ...')}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition ${
                    isAdmin 
                      ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 cursor-pointer' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  + UBND Xã...
                </button>
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => isAdmin && setHeaderDept('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO')}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition ${
                    isAdmin 
                      ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 cursor-pointer' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  + Phòng GD&ĐT
                </button>
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => isAdmin && setHeaderDept('SỞ GIÁO DỤC VÀ ĐÀO TẠO')}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition ${
                    isAdmin 
                      ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-800 cursor-pointer' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  + Sở GD&ĐT
                </button>
              </div>
            </div>

            {/* School Name & Year & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">2. Tên Trường / Đơn vị:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={e => isAdmin && setSchoolName(e.target.value)}
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                  placeholder="TRƯỜNG THCS HỒNG QUANG"
                  className={`w-full p-2 text-xs font-bold border rounded-xl ${
                    isAdmin 
                      ? 'text-slate-900 bg-white border-slate-300 focus:ring-2 focus:ring-rose-500' 
                      : 'text-slate-600 bg-slate-100 border-slate-200 cursor-not-allowed opacity-90'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">3. Năm học:</label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={e => setSchoolYear(e.target.value)}
                  placeholder="2025 - 2026"
                  className="w-full p-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">4. Thời gian (Phút):</label>
                <input
                  type="text"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(e.target.value)}
                  placeholder="60"
                  className="w-full p-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
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
              <div className="p-4 bg-gradient-to-r from-rose-50 via-indigo-50 to-emerald-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm font-extrabold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Lưu trữ Kho Đề Kiểm Tra riêng biệt</h4>
                    <p className="text-[11px] text-slate-600">Đề được tự động bảo mật theo tài khoản tạo đề (không lưu đè vào Kho Giáo Án).</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveToRepository}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  LƯU VÀO KHO ĐỀ KIỂM TRA
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
