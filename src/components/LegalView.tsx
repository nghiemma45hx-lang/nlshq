import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileCheck, 
  Sparkles, 
  BookOpen, 
  ListCheck, 
  ArrowRight,
  Check,
  Info,
  X,
  Copy,
  FileText,
  Search,
  Eye
} from 'lucide-react';
import { LEGAL_DOCUMENTS } from '../data/competencyData';
import { LegalDocument } from '../types';

interface LegalViewProps {
  onSuccessToast: (msg: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onSuccessToast }) => {
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [modalTab, setModalTab] = useState<'fulltext' | 'summary'>('fulltext');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDoc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDoc = (doc: LegalDocument) => {
    setSelectedDoc(doc);
    setModalTab('fulltext');
    setSearchQuery('');
  };

  const tagMatrix = [
    {
      domain: "1. Khai thác dữ liệu và thông tin",
      doc: "TT 02/2025/TT-BGDĐT",
      tags: ["[NLS 1.1-a]", "[NLS 1.2-b]", "[NLS 1.3-a]"],
      position: "Hoạt động 1 (Khởi động) & Hoạt động 2 (Tìm kiếm tư liệu học tập)"
    },
    {
      domain: "2. Giao tiếp và hợp tác số",
      doc: "TT 02/2025/TT-BGDĐT",
      tags: ["[NLS 2.1-b]", "[NLS 2.4-a]", "[NLS 2.5-c]"],
      position: "Hoạt động 2 & 3 (Thảo luận nhóm trên Padlet, Google Docs)"
    },
    {
      domain: "3. Sáng tạo nội dung số",
      doc: "TT 02/2025/TT-BGDĐT",
      tags: ["[NLS 3.1-a]", "[NLS 3.3-a]", "[NLS 3.4-a]"],
      position: "Hoạt động 3 (Luyện tập) & Hoạt động 4 (Tạo Video/Infographic)"
    },
    {
      domain: "4. An toàn số & Đạo đức AI",
      doc: "QĐ 3439/QĐ-BGDĐT",
      tags: ["[AI-NLb: Đạo đức AI]", "[NLS 4.2-c]"],
      position: "Mục tiêu Phẩm chất & Hoạt động thực hành với công cụ GenAI"
    },
    {
      domain: "5. Kĩ thuật & Ứng dụng AI",
      doc: "QĐ 3439/QĐ-BGDĐT",
      tags: ["[AI-NLc: Prompting]", "[AI-NLd: Model]"],
      position: "Hoạt động 2 & 3 (Dùng ChatGPT/GeoGebra/Quizizz hỗ trợ giải bài)"
    }
  ];

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    onSuccessToast(`Đã sao chép mã chỉ báo ${tag}!`);
  };

  // Formatter for original legal text paragraphs
  const renderFormattedFullText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-2 select-text">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2"></div>;

          const isMainTitle = trimmed.startsWith('THÔNG TƯ') || trimmed.startsWith('QUYẾT ĐỊNH') || trimmed.startsWith('PHỤ LỤC') || trimmed.startsWith('V/v');
          const isHeaderLine = trimmed.startsWith('CỘNG HÒA') || trimmed.startsWith('BỘ GIÁO DỤC') || trimmed.startsWith('Số:') || trimmed.startsWith('Độc lập');
          const isArticle = trimmed.startsWith('Điều ') || trimmed.startsWith('MIỀN ') || trimmed.startsWith('MẠCH ') || trimmed.startsWith('I. ') || trimmed.startsWith('II. ') || trimmed.startsWith('III. ');
          const isSubSection = trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ');

          // Highlight search term
          let contentNode: React.ReactNode = trimmed;
          if (searchQuery.trim().length > 1) {
            const query = searchQuery.trim().toLowerCase();
            const idx = trimmed.toLowerCase().indexOf(query);
            if (idx !== -1) {
              contentNode = (
                <span>
                  {trimmed.substring(0, idx)}
                  <mark className="bg-amber-300 text-slate-900 font-bold px-1 rounded">{trimmed.substring(idx, idx + query.length)}</mark>
                  {trimmed.substring(idx + query.length)}
                </span>
              );
            }
          }

          if (isHeaderLine) {
            return (
              <p key={i} className="font-sans font-bold text-center text-slate-700 text-xs tracking-wider uppercase">
                {contentNode}
              </p>
            );
          }

          if (isMainTitle) {
            return (
              <p key={i} className="font-sans font-black text-center text-indigo-900 text-base sm:text-lg my-3 uppercase tracking-wide">
                {contentNode}
              </p>
            );
          }

          if (isArticle) {
            return (
              <p key={i} className="font-sans font-extrabold text-indigo-800 text-sm pt-2 pb-1 border-b border-indigo-100">
                {contentNode}
              </p>
            );
          }

          if (isSubSection) {
            return (
              <p key={i} className="font-sans font-bold text-slate-900 text-xs pt-1">
                {contentNode}
              </p>
            );
          }

          return (
            <p key={i} className="text-slate-800 text-xs sm:text-sm pl-1">
              {contentNode}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full">
            Cơ Sở Pháp Lý Cốt Lõi
          </span>
          <span className="text-xs text-slate-500 font-medium">Bộ Giáo Dục Và Đào Tạo Ban Hành</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Scale className="w-6 h-6 text-rose-600 mr-2.5" />
          Văn Bản Quy Phạm Pháp Luật & Khung Chuẩn Tích Hợp
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Căn cứ pháp lý bắt buộc và hướng dẫn kỹ thuật khi đưa Năng lực số & AI vào Kế hoạch bài dạy (KHBD). <strong className="text-indigo-600">Nhấp chuột vào bất kỳ thẻ card nào để mở xem TOÀN BỘ VĂN BẢN GỐC!</strong>
        </p>
      </div>

      {/* Legal Documents Cards (Click to open modal, Click outside to close) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {LEGAL_DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDoc(doc)}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold transition">
                  <FileCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Xem Toàn Văn Gốc ↗</span>
                </span>
              </div>

              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wide">
                {doc.code}
              </span>
              <h3 className="font-extrabold text-slate-800 text-base mt-1 mb-2 group-hover:text-indigo-700 transition">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {doc.summary}
              </p>
              <div className="space-y-1.5 mb-4">
                {doc.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start text-[11px] text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.badgeColor}`}>
                  {doc.authority}
                </span>
                <span className="text-xs text-indigo-600 font-bold flex items-center">
                  Ban hành: {doc.date}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-indigo-600 font-bold group-hover:text-indigo-800">
                <span className="flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Kích chuột để xem toàn bộ văn bản</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL ORIGINAL DOCUMENT MODAL (CLICK OUTSIDE TO CLOSE) */}
      {selectedDoc && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedDoc(null)} // CLICK OUTSIDE THE CARD MODAL CLOSES IT
        >
          <div 
            className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()} // PREVENT CLOSE WHEN CLICKING INSIDE MODAL
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex justify-between items-start border-b border-slate-800 shrink-0">
              <div className="pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-xs font-bold font-mono uppercase">
                    {selectedDoc.code}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold">
                    Văn Bản Đầy Đủ BGDĐT
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black leading-snug text-white">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-medium flex flex-wrap items-center gap-2">
                  <span>Cơ quan ban hành: {selectedDoc.authority}</span>
                  <span>•</span>
                  <span>Ban hành: {selectedDoc.date}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition shrink-0"
                title="Đóng cửa sổ (Hoặc bấm ESC / nhấp chuột ra ngoài)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Controls & Search */}
            <div className="bg-slate-100 border-b border-slate-200 p-3 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setModalTab('fulltext')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    modalTab === 'fulltext'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Toàn Văn Văn Bản Gốc</span>
                </button>

                <button
                  onClick={() => setModalTab('summary')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    modalTab === 'summary'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <ListCheck className="w-3.5 h-3.5" />
                  <span>Tóm Tắt & Chỉ Báo KHBD</span>
                </button>
              </div>

              {/* Search input for full text */}
              {modalTab === 'fulltext' && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm từ khóa trong văn bản..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-6 overflow-y-auto grow space-y-6 text-slate-800">
              {modalTab === 'fulltext' ? (
                /* TAB 1: FULL TEXT ORIGINAL DOCUMENT */
                <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-inner relative">
                  <div className="absolute top-4 right-4 opacity-10 pointer-events-none select-none text-slate-900 font-serif font-bold text-3xl">
                    VĂN BẢN CHÍNH THỨC
                  </div>
                  {renderFormattedFullText(selectedDoc.fullText || selectedDoc.summary)}
                </div>
              ) : (
                /* TAB 2: SUMMARY & STRUCTURE BREAKDOWN */
                <div className="space-y-6 text-xs text-slate-700">
                  {/* Summary */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="font-extrabold text-slate-900 uppercase text-[11px] block mb-1">Tóm Tắt Tổng Quan:</span>
                    <p className="text-slate-700 leading-relaxed text-xs">{selectedDoc.summary}</p>
                  </div>

                  {/* Scope & Audience */}
                  {selectedDoc.details?.scope && (
                    <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl space-y-2">
                      <div>
                        <span className="font-extrabold text-indigo-900 uppercase text-[11px] block">Phạm vi áp dụng:</span>
                        <p className="text-slate-800 text-xs mt-0.5">{selectedDoc.details.scope}</p>
                      </div>
                      <div>
                        <span className="font-extrabold text-indigo-900 uppercase text-[11px] block">Đối tượng thực hiện:</span>
                        <p className="text-slate-800 text-xs mt-0.5">{selectedDoc.details.targetAudience}</p>
                      </div>
                    </div>
                  )}

                  {/* Core Key Points */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center">
                      <Check className="w-4 h-4 text-emerald-600 mr-1.5" />
                      Nội Dung & Yêu Cầu Chỉ Đạo Cốt Lõi
                    </h3>
                    <ul className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {selectedDoc.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-2 mt-1.5 shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Structural breakdown */}
                  {selectedDoc.details?.structure && (
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center">
                        <ListCheck className="w-4 h-4 text-indigo-600 mr-1.5" />
                        Cấu Trúc Chi Tiết & Các Mã Chỉ Báo
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedDoc.details.structure.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                            <div className="font-extrabold text-slate-900 text-xs mb-1">{item.name}</div>
                            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{item.desc}</p>
                            {item.tags && (
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tg, tIdx) => (
                                  <button
                                    key={tIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyTag(tg);
                                    }}
                                    className="text-[10px] font-mono font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded transition"
                                    title="Bấm sao chép tag"
                                  >
                                    {tg}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Guide */}
                  {selectedDoc.details?.implementationGuide && (
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
                        Hướng Dẫn Tích Hợp Vào Kế Hoạch Bài Dạy (3 Bước)
                      </h3>
                      <div className="space-y-2 bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl">
                        {selectedDoc.details.implementationGuide.map((step, idx) => (
                          <p key={idx} className="text-xs text-amber-950 font-medium">
                            {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const textToCopy = selectedDoc.fullText || `${selectedDoc.code}: ${selectedDoc.title}\n${selectedDoc.summary}`;
                    navigator.clipboard.writeText(textToCopy);
                    onSuccessToast(`Đã sao chép toàn bộ văn bản ${selectedDoc.code}!`);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép Toàn Văn Gốc</span>
                </button>

                <button
                  onClick={() => {
                    const textToCopy = `${selectedDoc.code}: ${selectedDoc.title}\nCơ quan ban hành: ${selectedDoc.authority} (${selectedDoc.date})\nTóm tắt: ${selectedDoc.summary}`;
                    navigator.clipboard.writeText(textToCopy);
                    onSuccessToast(`Đã sao chép trích dẫn ${selectedDoc.code}!`);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <span>Sao Chép Trích Dẫn</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition text-center"
              >
                Đóng Cửa Sổ (Hoặc bấm ra ngoài)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Reference Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
          <ListCheck className="w-5 h-5 text-indigo-600 mr-2" />
          Bảng Mã Chỉ Báo Tích Hợp Năng Lực Số & AI Trực Tiếp Vào Giáo Án
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="p-3 border-r border-slate-200">Miền / Mạch Năng Lực</th>
                <th className="p-3 border-r border-slate-200">Căn Cứ Pháp Lý</th>
                <th className="p-3 border-r border-slate-200">Mã Chỉ Báo / Tag Tích Hợp (Click copy)</th>
                <th className="p-3">Gợi Ý Vị Trí Chèn Trong KHBD (CV 5512)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tagMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                    {item.domain}
                  </td>
                  <td className="p-3 border-r border-slate-200 font-medium">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.doc}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-200 font-mono">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => handleCopyTag(t)}
                          className="bg-slate-100 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] px-2 py-0.5 rounded border border-slate-300 hover:border-indigo-300 transition"
                          title="Bấm để sao chép tag"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">
                    {item.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

