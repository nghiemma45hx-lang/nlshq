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
  BookOpen
} from 'lucide-react';
import { LessonPlanItem } from '../types';

interface RepositoryViewProps {
  lessons: LessonPlanItem[];
  onSelectLesson: (lesson: LessonPlanItem) => void;
  onDeleteLesson: (id: string) => void;
  onSwitchView: (view: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  lessons,
  onSelectLesson,
  onDeleteLesson,
  onSwitchView,
  onSuccessToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const filtered = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || l.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const handleDownload = (l: LessonPlanItem, e: React.MouseEvent) => {
    e.stopPropagation();
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
            Danh sách kế hoạch bài dạy đã tích hợp Năng lực số và lưu trữ trên hệ thống
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
                <th className="p-4">Ngày Tạo</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 italic">
                    Chưa có giáo án nào phù hợp. Hãy nhấn nút "Tích Hợp Giáo Án Mới" để bắt đầu!
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-800 max-w-[280px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{item.subject}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                        {item.framework}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">{item.dateString}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => onSelectLesson(item)}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition inline-flex items-center"
                        title="Xem chi tiết"
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
    </div>
  );
};
