import React, { useState } from 'react';
import { 
  FolderOpen, 
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
  ExternalLink,
  Clock,
  Columns,
  Pencil,
  Save,
  Lock,
  User,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { LessonPlanItem } from '../types';
import { formatDateTime } from '../utils/lessonPlanUtils';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_LESSONS } from '../data/competencyData';

interface RepositoryViewProps {
  lessons: LessonPlanItem[];
  onSelectLesson: (lesson: LessonPlanItem) => void;
  onDeleteLesson: (id: string) => void;
  onUpdateLessonTitle?: (id: string, newTitle: string) => void;
  onSwitchView: (view: string) => void;
  onSuccessToast: (msg: string) => void;
  onOpenAuth?: () => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  lessons,
  onSelectLesson,
  onDeleteLesson,
  onUpdateLessonTitle,
  onSwitchView,
  onSuccessToast,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [previewLesson, setPreviewLesson] = useState<LessonPlanItem | null>(null);
  const [viewTab, setViewTab] = useState<'integrated' | 'original' | 'split'>('integrated');

  // Inline title edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [adminViewAll, setAdminViewAll] = useState(false);

  const startEditTitle = (l: LessonPlanItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(l.id);
    setEditTitleText(l.title);
  };

  const saveEditedTitle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!editTitleText.trim()) return;
    if (onUpdateLessonTitle) {
      onUpdateLessonTitle(id, editTitleText.trim());
    }
    if (previewLesson && previewLesson.id === id) {
      setPreviewLesson(prev => prev ? { ...prev, title: editTitleText.trim() } : null);
    }
    setEditingId(null);
  };

  // Unauthenticated screen
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center border border-indigo-100 shadow-sm animate-pulse">
          <Lock className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Yêu Cầu Đăng Nhập Tài Khoản</h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Kho giáo án được bảo mật riêng tư theo từng tài khoản giáo viên. Các tài khoản khác không thể nhìn thấy hoặc truy cập Kế hoạch bài dạy của bạn.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 mx-auto"
          >
            <User className="w-4 h-4" />
            <span>Đăng Nhập Ngay Để Truy Cập Kho Giáo Án</span>
          </button>
        </div>
      </div>
    );
  }

  // Strictly filter lessons belonging to the logged-in user
  const userOwnLessons = lessons.filter(l => {
    // Exact user match by UID or Email
    const matchUid = Boolean(l.userId && l.userId === currentUser.uid);
    const matchEmail = Boolean(l.ownerEmail && currentUser.email && l.ownerEmail.toLowerCase() === currentUser.email.toLowerCase());
    if (matchUid || matchEmail) return true;

    // Admin option: if admin toggles 'adminViewAll', allow viewing all lessons
    if (isAdmin && adminViewAll) {
      return true;
    }

    // Unassigned or guest items created in current session
    if ((!l.userId || l.userId.startsWith('guest') || l.userId === 'anonymous-teacher') && (!l.ownerEmail || l.ownerEmail === '')) {
      return true;
    }

    // Do NOT show lessons belonging to other registered accounts
    return false;
  });

  const filtered = userOwnLessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || l.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const handleDownload = (l: LessonPlanItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const wordHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${l.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        .main-title { text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 10px; }
      </style>
      </head><body>
        <div class="main-title">${l.title}</div>
        <div>Môn học: ${l.subject} | Khung: ${l.framework}</div>
        <hr>
        ${l.integratedContent || l.originalContent}
      </body></html>
    `;
    const blob = new Blob(['\ufeff' + wordHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GiaoAn_${l.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onSuccessToast('Đã tải xuống file Word!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FolderOpen className="w-6 h-6 text-indigo-600 mr-2.5" />
            Kho Giáo Án Của Tôi
          </h1>
          <p className="text-xs text-slate-500">
            Danh sách kế hoạch bài dạy đã tích hợp Năng lực số cá nhân thuộc tài khoản <strong className="text-slate-800">{currentUser.displayName}</strong>
          </p>
        </div>

        <button
          onClick={() => onSwitchView('studio')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tích Hợp Giáo Án Mới</span>
        </button>
      </div>

      {/* Account Owner & Privacy Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-indigo-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-sm">
            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white">{currentUser.displayName || 'Giáo viên'}</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                Kho Cá Nhân Phân Quyền
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 font-mono">
              Email: {currentUser.email} • ID: {currentUser.uid}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setAdminViewAll(!adminViewAll)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 cursor-pointer ${
                adminViewAll 
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/50' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{adminViewAll ? 'Đang xem: Tất cả hệ thống (Admin)' : 'Xem toàn bộ hệ thống (Admin)'}</span>
            </button>
          )}
          <div className="text-xs text-indigo-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center shrink-0">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-300 shrink-0" />
            <span>Chỉ tài khoản <strong className="text-white font-semibold">{currentUser.displayName || currentUser.email}</strong> mới xem được kho này</span>
          </div>
        </div>
      </div>

      {/* Repository Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm giáo án theo tên bài, môn học..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs border border-slate-300 bg-white rounded-xl px-3 py-2 outline-none font-medium"
            >
              <option value="All">Tất cả môn học</option>
              <option value="Toán">Toán học</option>
              <option value="Văn">Ngữ văn</option>
              <option value="Anh">Tiếng Anh</option>
              <option value="Lý">Vật lý</option>
              <option value="Tin">Tin học</option>
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Tên Bài Dạy / Giáo Án</th>
                <th className="p-4">Môn / Khối</th>
                <th className="p-4">Khung NLS</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4">Thời Gian Tạo (Giờ, Ngày)</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="text-sm font-semibold text-slate-700">
                        Chưa có giáo án nào trong kho cá nhân của <span className="text-indigo-600 font-bold">{currentUser.displayName}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Các giáo án bạn tạo trong AI Studio sẽ được tự động lưu bảo mật vào kho riêng của tài khoản này.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => onSwitchView('studio')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tích Hợp Giáo Án Mới Ngay</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setPreviewLesson(item)}
                    className="hover:bg-slate-50/80 transition border-b border-slate-100 cursor-pointer"
                  >
                    <td className="p-4 font-bold text-indigo-950 max-w-[360px]" title={item.title}>
                      {editingId === item.id ? (
                        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitleText}
                            onChange={(e) => setEditTitleText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEditedTitle(item.id)}
                            className="w-full text-xs p-1.5 border border-indigo-500 rounded bg-white text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600"
                            autoFocus
                          />
                          <button
                            onClick={(e) => saveEditedTitle(item.id, e)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition shrink-0"
                            title="Lưu tên bài"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="group flex items-start justify-between gap-1">
                          <div className="line-clamp-2 text-indigo-950 group-hover:text-indigo-600 transition">
                            {item.title}
                          </div>
                          <button
                            onClick={(e) => startEditTitle(item, e)}
                            className="opacity-60 group-hover:opacity-100 p-1 hover:bg-indigo-50 text-indigo-600 rounded transition shrink-0 ml-1"
                            title="Đổi tên bài dạy / tiết dạy"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{item.subject}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                        {item.framework}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      <div className="flex items-center text-slate-600 font-semibold">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {formatDateTime(item.dateString, item.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setPreviewLesson(item)}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition inline-flex items-center"
                        title="Xem toàn bộ giáo án"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Xem
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs transition inline-flex items-center"
                        title="Tải Word"
                      >
                        <FileDown className="w-3.5 h-3.5 mr-1" />
                        Tải
                      </button>
                      <button
                        onClick={() => onDeleteLesson(item.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition inline-flex items-center"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL LESSON PLAN PREVIEW MODAL */}
      {previewLesson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 flex justify-between items-start shrink-0">
              <div className="pr-4 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {previewLesson.subject}
                  </span>
                  <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {previewLesson.framework}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-amber-400" />
                    Tạo lúc: {formatDateTime(previewLesson.dateString, previewLesson.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {previewLesson.title}
                  </h2>
                  <button
                    onClick={(e) => startEditTitle(previewLesson, e)}
                    className="p-1 bg-white/10 hover:bg-white/20 text-indigo-200 rounded transition shrink-0"
                    title="Đổi tên giáo án"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setPreviewLesson(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setViewTab('integrated')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center ${
                    viewTab === 'integrated'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  Giáo Án Đã Tích Hợp NLS & AI
                </button>
                <button
                  onClick={() => setViewTab('original')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center ${
                    viewTab === 'original'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Giáo Án Gốc
                </button>
                <button
                  onClick={() => setViewTab('split')}
                  className={`hidden sm:flex px-3 py-1.5 text-xs font-bold rounded-lg transition items-center ${
                    viewTab === 'split'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 mr-1.5" />
                  Xem Đối Sánh 2 Cột
                </button>
              </div>

              <button
                onClick={() => handleDownload(previewLesson)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center shrink-0"
              >
                <FileDown className="w-3.5 h-3.5 mr-1" />
                Tải File Word
              </button>
            </div>

            {/* Modal Main Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow bg-slate-50/50 text-xs leading-relaxed text-slate-800">
              {viewTab === 'integrated' && (
                <div 
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
                  dangerouslySetInnerHTML={{ __html: previewLesson.integratedContent || previewLesson.originalContent }}
                />
              )}

              {viewTab === 'original' && (
                <div 
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
                  dangerouslySetInnerHTML={{ __html: previewLesson.originalContent }}
                />
              )}

              {viewTab === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="font-bold text-slate-700 border-b pb-2 text-xs uppercase flex items-center">
                      <BookOpen className="w-4 h-4 mr-1.5 text-slate-500" />
                      Giáo Án Gốc
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: previewLesson.originalContent }} />
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-2xs space-y-3">
                    <div className="font-bold text-indigo-900 border-b pb-2 text-xs uppercase flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                      Đã Tích Hợp NLS & AI
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: previewLesson.integratedContent || previewLesson.originalContent }} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-white border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <div className="text-xs text-slate-500 italic">
                Xem toàn bộ nội dung Kế hoạch bài dạy chuẩn CV 5512 / TT 02/2025.
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const l = previewLesson;
                    setPreviewLesson(null);
                    onSelectLesson(l);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Mở Trong AI Studio Bàn Làm Việc
                </button>
                <button
                  onClick={() => setPreviewLesson(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

