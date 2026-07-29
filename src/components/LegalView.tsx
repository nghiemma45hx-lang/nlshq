import React from 'react';
import { 
  Scale, 
  FileCheck, 
  Sparkles, 
  BookOpen, 
  ListCheck, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LEGAL_DOCUMENTS } from '../data/competencyData';

interface LegalViewProps {
  onSuccessToast: (msg: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onSuccessToast }) => {
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
          Căn cứ pháp lý bắt buộc và hướng dẫn kỹ thuật khi đưa Năng lực số & AI vào Kế hoạch bài dạy (KHBD)
        </p>
      </div>

      {/* Legal Documents Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {LEGAL_DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                {doc.code}
              </span>
              <h3 className="font-extrabold text-slate-800 text-base mt-1 mb-2">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
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

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.badgeColor}`}>
                {doc.authority}
              </span>
              <span className="text-xs text-indigo-600 font-bold flex items-center">
                Ban hành: {doc.date}
              </span>
            </div>
          </div>
        ))}
      </div>

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
