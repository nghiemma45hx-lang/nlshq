import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  FileDown, 
  Check, 
  Sparkles,
  Calendar,
  BookOpen,
  X,
  Printer,
  Pencil,
  Save,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { ExamItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ExamRepositoryViewProps {
  exams: ExamItem[];
  onDeleteExam: (id: string) => void;
  onUpdateExamTitle?: (id: string, newTitle: string) => void;
  onSwitchView: (view: string) => void;
  onSuccessToast: (msg: string) => void;
  onOpenAuth?: () => void;
}

export const ExamRepositoryView: React.FC<ExamRepositoryViewProps> = ({
  exams,
  onDeleteExam,
  onUpdateExamTitle,
  onSwitchView,
  onSuccessToast,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [previewExam, setPreviewExam] = useState<ExamItem | null>(null);

  // Inline title edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  const startEditTitle = (eItem: ExamItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(eItem.id);
    setEditTitleText(eItem.title);
  };

  const saveEditedTitle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editTitleText.trim()) return;
    if (onUpdateExamTitle) {
      onUpdateExamTitle(id, editTitleText.trim());
    }
    if (previewExam && previewExam.id === id) {
      setPreviewExam(prev => prev ? { ...prev, title: editTitleText.trim() } : null);
    }
    setEditingId(null);
  };

  // Unauthenticated screen
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl mx-auto flex items-center justify-center border border-rose-100 shadow-sm animate-pulse">
          <Lock className="w-10 h-10 text-rose-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Yêu Cầu Đăng Nhập Để Truy Cập Kho Đề Kiểm Tra</h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Kho Đề Kiểm Tra được bảo mật phân quyền riêng tư. Chỉ chính tài khoản tạo đề mới được xem đề kiểm tra của mình (trừ tài khoản Admin).
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 mx-auto cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Đăng Nhập Ngay Để Truy Cập Kho Đề Kiểm Tra</span>
          </button>
        </div>
      </div>
    );
  }

  // PRIVACY FILTER:
  // Non-admin: ONLY see exams created by currentUser.uid / email / local guest session
  // Admin: Sees ALL exams created by all teachers!
  const userOwnExams = exams.filter(item => {
    if (isAdmin) return true; // Admin can view all exams

    const matchUid = Boolean(item.userId && item.userId === currentUser.uid);
    const matchEmail = Boolean(item.ownerEmail && currentUser.email && item.ownerEmail.toLowerCase() === currentUser.email.toLowerCase());
    if (matchUid || matchEmail) return true;

    // Guest/local session exams
    if (!item.userId || !item.ownerEmail || item.userId.startsWith('guest') || item.userId === 'anonymous-teacher' || item.ownerEmail === '') {
      return true;
    }

    return false;
  });

  const filteredExams = userOwnExams.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.grade && item.grade.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = subjectFilter === 'All' || item.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchesType = typeFilter === 'All' || (item.examType && item.examType.toLowerCase().includes(typeFilter.toLowerCase()));
    return matchesSearch && matchesSubject && matchesType;
  });

  const handleDownloadWord = (eItem: ExamItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${eItem.title}</title>
      <style>
        @page Section1 { size: 21.0cm 29.7cm; margin: 2.0cm; }
        div.Section1 { page: Section1; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.35; color: #000; }
        h1, h2, h3, h4 { font-family: 'Times New Roman', serif; font-weight: bold; color: #000; margin-top: 10pt; margin-bottom: 5pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 5pt; margin-bottom: 10pt; }
        th, td { border: 1px solid #000; padding: 4pt; font-size: 11pt; vertical-align: top; }
        th { background-color: #f1f5f9; font-weight: bold; }
      </style>
      </head><body><div class="Section1">
        ${eItem.integratedContent || eItem.originalContent}
      </div></body></html>
    `;
    const blob = new Blob(['\ufeff' + wordHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeKiemTra_${eItem.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onSuccessToast('Đã tải xuống Hồ sơ Đề kiểm tra (.doc)!');
  };

  const handlePrint = (eItem: ExamItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${eItem.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { padding: 0; }
            button { display: none !important; }
          }
          body { font-family: 'Times New Roman', serif; padding: 20px; }
        </style>
      </head>
      <body>
        ${eItem.integratedContent}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FileCheck className="w-6 h-6 text-rose-600 mr-2.5" />
            Kho Đề Kiểm Tra Chuyên Biệt
          </h1>
          <p className="text-xs text-slate-500">
            Lưu trữ ma trận, bảng đặc tả, đề thi chính thức & đáp án chấm điểm phân quyền bảo mật riêng cho giáo viên.
          </p>
        </div>

        <button
          onClick={() => onSwitchView('exam')}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Đề Kiểm Tra Mới</span>
        </button>
      </div>

      {/* Account Privacy & Ownership Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-indigo-950 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-rose-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/80 border border-rose-400/40 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-sm">
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white">{currentUser.displayName}</span>
              {isAdmin ? (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-slate-950" />
                  ADMIN - XEM TOÀN BỘ KHO ĐỀ
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                  Kho Đề Cá Nhân
                </span>
              )}
            </div>
            <p className="text-[11px] text-rose-200/80 font-mono">
              Email: {currentUser.email} • {isAdmin ? 'Quyền Admin (Có thể xem & hỗ trợ tất cả giáo viên)' : 'Đề kiểm tra lưu riêng biệt, không lưu vào kho giáo án'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xl font-black text-rose-300">
            {filteredExams.length} <span className="text-xs font-normal text-slate-300">đề kiểm tra</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative col-span-1 sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên đề, môn học, khối lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option value="All">Tất cả môn học</option>
            <option value="Ngữ văn">Ngữ văn</option>
            <option value="Toán">Toán học</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Vật">Vật lí</option>
            <option value="Hóa">Hóa học</option>
            <option value="Sinh">Sinh học</option>
            <option value="Lịch sử">Lịch sử & Địa lý</option>
            <option value="Tin">Tin học</option>
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option value="All">Tất cả loại đề kiểm tra</option>
            <option value="Giữa học kì I">Giữa học kì I</option>
            <option value="Cuối học kì I">Cuối học kì I</option>
            <option value="Giữa học kì II">Giữa học kì II</option>
            <option value="Cuối học kì II">Cuối học kì II</option>
            <option value="15 phút">15 phút / Thường xuyên</option>
            <option value="1 tiết">1 tiết / Định kì</option>
          </select>
        </div>
      </div>

      {/* Exam Grid List */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl mx-auto flex items-center justify-center border border-rose-100">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Chưa Có Đề Kiểm Tra Nào Trong Kho</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Bạn chưa tạo đề kiểm tra nào hoặc không tìm thấy kết quả phù hợp. Nhấn nút bên dưới để tạo đề tự động với ma trận & đặc tả chuẩn Bộ.
            </p>
          </div>
          <button
            onClick={() => onSwitchView('exam')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition shadow-sm inline-flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đề Kiểm Tra Mới Chi Tiết</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((eItem) => {
            const isEditing = editingId === eItem.id;

            return (
              <div
                key={eItem.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between space-y-3 group relative"
              >
                <div>
                  {/* Tags Header */}
                  <div className="flex items-center justify-between mb-2 gap-1 flex-wrap">
                    <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-rose-200">
                      {eItem.subject} • {eItem.grade}
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-slate-200">
                      {eItem.examType || 'Đề kiểm tra'}
                    </span>
                  </div>

                  {/* Title & Editable Input */}
                  {isEditing ? (
                    <div className="flex items-center space-x-1 mb-2">
                      <input
                        type="text"
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        className="w-full text-xs font-bold border border-rose-400 rounded p-1 focus:outline-none bg-rose-50/50"
                        autoFocus
                      />
                      <button
                        onClick={(e) => saveEditedTitle(eItem.id, e)}
                        className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        title="Lưu tên mới"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="group/title flex items-start justify-between gap-1 mb-2">
                      <h3
                        onClick={() => setPreviewExam(eItem)}
                        className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition cursor-pointer line-clamp-2 leading-snug"
                        title={eItem.title}
                      >
                        {eItem.title}
                      </h3>
                      <button
                        onClick={(e) => startEditTitle(eItem, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 shrink-0 transition"
                        title="Đổi tên đề kiểm tra"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Metadata line */}
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Thởi gian tạo: {eItem.dateString || new Date(eItem.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {isAdmin && eItem.ownerEmail && (
                      <div className="text-[10px] text-amber-700 font-medium bg-amber-50 p-1 rounded border border-amber-200/60 truncate">
                        Tác giả: {eItem.ownerEmail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => setPreviewExam(eItem)}
                    className="flex-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Hồ Sơ Đề</span>
                  </button>

                  <button
                    onClick={(e) => handleDownloadWord(eItem, e)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                    title="Tải về file Word (.doc)"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handlePrint(eItem, e)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200"
                    title="In đề kiểm tra"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Bạn có chắc chắn muốn xóa đề kiểm tra "${eItem.title}" khỏi Kho Đề?`)) {
                        onDeleteExam(eItem.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition border border-rose-100"
                    title="Xóa đề kiểm tra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{previewExam.title}</h3>
                  <p className="text-xs text-rose-200">
                    {previewExam.subject} • {previewExam.grade} • {previewExam.examType}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadWord(previewExam)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất Word</span>
                </button>
                <button
                  onClick={() => handlePrint(previewExam)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">In Đề</span>
                </button>
                <button
                  onClick={() => setPreviewExam(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Preview */}
            <div className="p-6 overflow-y-auto flex-grow bg-slate-50 space-y-6">
              <div
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs prose max-w-none text-xs text-slate-800"
                dangerouslySetInnerHTML={{ __html: previewExam.integratedContent || previewExam.originalContent }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end space-x-3 shrink-0">
              <button
                onClick={() => setPreviewExam(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
