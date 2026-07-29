import React, { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Pencil, 
  Palette, 
  Sliders, 
  LayoutGrid, 
  Type,
  Eye,
  Megaphone,
  Layers
} from 'lucide-react';
import { useHeroConfig } from '../context/HeroConfigContext';
import { HeroBannerConfig, NavCardConfigItem } from '../types';

interface AdminHeroEditorProps {
  onSuccessToast: (msg: string) => void;
}

const HIGHLIGHT_COLOR_PRESETS = [
  { label: 'Tím - Kim Cương - Vàng (Mặc định)', value: 'from-indigo-300 via-purple-300 to-amber-300' },
  { label: 'Vàng Kim Hoàng Gia', value: 'from-amber-300 via-amber-200 to-amber-400' },
  { label: 'Xanh Ngọc - Chanh Tươi', value: 'from-emerald-300 via-teal-200 to-lime-300' },
  { label: 'Hồng Đào - Băng Ngọc', value: 'from-rose-300 via-pink-300 to-amber-300' },
  { label: 'Xanh Dương San Hô', value: 'from-cyan-300 via-sky-300 to-indigo-300' },
];

const BANNER_BG_PRESETS = [
  { label: 'Đêm Slate Indigo (Mặc định)', value: 'from-slate-900 via-indigo-950 to-slate-900' },
  { label: 'Tím Huyền Bí Deep Space', value: 'from-slate-950 via-purple-950 to-slate-950' },
  { label: 'Xanh Ngọc Đêm Midnight Emerald', value: 'from-slate-950 via-teal-950 to-slate-950' },
  { label: 'Đỏ Crimson Admin', value: 'from-slate-950 via-rose-950 to-slate-950' },
  { label: 'Xanh Đen Huyền Thoại Dark Blue', value: 'from-slate-950 via-blue-950 to-slate-950' },
];

const BADGE_COLOR_PRESETS = [
  { label: 'Nổi bật HOT (Vàng)', value: 'bg-amber-400 text-amber-950 font-extrabold' },
  { label: 'Chăm sóc Indigo', value: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { label: 'Kho bài Emerald', value: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { label: 'Chỉ báo Purple', value: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { label: 'Pháp lý Amber', value: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Quản trị Rose', value: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

export const AdminHeroEditor: React.FC<AdminHeroEditorProps> = ({ onSuccessToast }) => {
  const { heroConfig, updateHeroConfig, resetHeroConfig } = useHeroConfig();
  const [formData, setFormData] = useState<HeroBannerConfig>(heroConfig);
  const [activeCardTab, setActiveCardTab] = useState<string>('landing');

  const handleTextChange = (field: keyof HeroBannerConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (cardId: string, field: keyof NavCardConfigItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      navCards: prev.navCards.map(c => c.id === cardId ? { ...c, [field]: value } : c)
    }));
  };

  const handleSave = () => {
    updateHeroConfig(formData);
    onSuccessToast('Đã lưu và cập nhật giao diện Hero Banner & Thẻ chức năng thành công!');
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục giao diện Hero Banner về mặc định ban đầu?')) {
      resetHeroConfig();
      setFormData(heroConfig);
      onSuccessToast('Đã khôi phục cài đặt mặc định thành công!');
    }
  };

  const selectedCard = formData.navCards.find(c => c.id === activeCardTab) || formData.navCards[0];

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-600 mr-1" />
              Tùy Chỉnh Giao Diện Banner
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center">
            <Palette className="w-5 h-5 text-indigo-600 mr-2" />
            Quản Lý Toàn Bộ Hero Banner & Thẻ Chuyển Hướng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thay đổi chữ tiêu đề, màu sắc gradient, thông báo chạy chữ và nội dung của 6 thẻ chuyển hướng hệ thống.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl transition shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cấu Hình Giao Diện</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-indigo-900/80 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
          <div className="flex items-center space-x-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Xem Trước Trực Tiếp (Live Preview Box)</span>
          </div>
          <span className="text-[10px] bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-700">
            Cập nhật thời gian thực
          </span>
        </div>

        {/* Live Banner Preview */}
        <div className={`p-6 rounded-2xl bg-gradient-to-b ${formData.bannerBgTheme} text-center space-y-3 border border-indigo-800/50 shadow-inner`}>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-semibold ${formData.badgeColor}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{formData.badgeText || 'Chuẩn Khung Năng Lực Số...'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
            {formData.mainTitlePrefix}
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${formData.highlightColor}`}>
              {formData.mainTitleHighlight}
            </span>
            {formData.mainTitleSuffix}
          </h1>

          {/* Ticker Preview */}
          <div className="max-w-2xl mx-auto bg-slate-900/90 text-slate-200 border border-indigo-800/60 rounded-xl p-2 flex items-center justify-between text-xs">
            <span className="shrink-0 flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{formData.tickerBadge || 'THÔNG BÁO'}</span>
            </span>
            <span className="truncate text-xs font-medium text-indigo-100 ml-2">
              {formData.tickerText}
            </span>
          </div>
        </div>

        {/* Live Cards Row Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {formData.navCards.map((card) => (
            <div
              key={card.id}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between ${card.cardBgColor || 'bg-slate-900'} border-slate-800`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">THẺ #{card.id}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <div className={`text-xs font-extrabold ${card.textColor || 'text-white'}`}>
                  {card.title}
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Fields Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: HERO BANNER TEXT & STYLES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Type className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
              1. Cấu Hình Nội Dung & Màu Sắc Hero Banner
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dòng Huy Hiệu Trên Tiêu Đề (Badge Text)
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => handleTextChange('badgeText', e.target.value)}
                placeholder="Ví dụ: Chuẩn Khung Năng Lực Số TT 02/2025/TT-BGDĐT..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tiền tố (Prefix)
                </label>
                <input
                  type="text"
                  value={formData.mainTitlePrefix}
                  onChange={(e) => handleTextChange('mainTitlePrefix', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-indigo-700 mb-1">
                  Từ Nổi Bật (Highlight)
                </label>
                <input
                  type="text"
                  value={formData.mainTitleHighlight}
                  onChange={(e) => handleTextChange('mainTitleHighlight', e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-400 bg-indigo-50/50 rounded-xl text-xs font-black text-indigo-950 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Hậu tố (Suffix)
                </label>
                <input
                  type="text"
                  value={formData.mainTitleSuffix}
                  onChange={(e) => handleTextChange('mainTitleSuffix', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phối Màu Gradient Cho Từ Nổi Bật
              </label>
              <select
                value={formData.highlightColor}
                onChange={(e) => handleTextChange('highlightColor', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {HIGHLIGHT_COLOR_PRESETS.map((p, idx) => (
                  <option key={idx} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tông Màu Phông Nền Banner (Background Gradient)
              </label>
              <select
                value={formData.bannerBgTheme}
                onChange={(e) => handleTextChange('bannerBgTheme', e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {BANNER_BG_PRESETS.map((p, idx) => (
                  <option key={idx} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Nội Dung Dòng Thông Báo Chạy Chữ</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nhãn Ticker</label>
                  <input
                    type="text"
                    value={formData.tickerBadge}
                    onChange={(e) => handleTextChange('tickerBadge', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nội dung câu thông báo</label>
                  <input
                    type="text"
                    value={formData.tickerText}
                    onChange={(e) => handleTextChange('tickerText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NAVIGATION CARDS CONFIGURATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                2. Cấu Hình 6 Thẻ Navigation Cards
              </h3>
            </div>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full">
              6 Thẻ chức năng
            </span>
          </div>

          {/* Card selector tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            {formData.navCards.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCardTab(c.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center space-x-1 ${
                  activeCardTab === c.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{c.title}</span>
              </button>
            ))}
          </div>

          {/* Active Card Form */}
          {selectedCard && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-indigo-950 uppercase">
                  Chỉnh Sửa Thẻ: <span className="text-indigo-600">{selectedCard.title}</span> ({selectedCard.id})
                </span>
                {selectedCard.isHot && (
                  <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                    HOT FEATURE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Thẻ (Tiêu Đề)
                  </label>
                  <input
                    type="text"
                    value={selectedCard.title}
                    onChange={(e) => handleCardChange(selectedCard.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nhãn Badge Tóm Tắt
                  </label>
                  <input
                    type="text"
                    value={selectedCard.badge}
                    onChange={(e) => handleCardChange(selectedCard.id, 'badge', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô Tả Phụ (Subtext)
                </label>
                <input
                  type="text"
                  value={selectedCard.sub}
                  onChange={(e) => handleCardChange(selectedCard.id, 'sub', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phong Cách Màu Nhãn (Badge Color Style)
                </label>
                <select
                  value={selectedCard.badgeColor}
                  onChange={(e) => handleCardChange(selectedCard.id, 'badgeColor', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {BADGE_COLOR_PRESETS.map((p, idx) => (
                    <option key={idx} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Màu Phông Nền Thẻ (Card Background Class)
                </label>
                <select
                  value={selectedCard.cardBgColor}
                  onChange={(e) => handleCardChange(selectedCard.id, 'cardBgColor', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="bg-slate-900/90">Mặc định Slate Đen Tuyền (bg-slate-900/90)</option>
                  <option value="bg-gradient-to-br from-indigo-950 to-purple-950">Chuyên Nghiệp Tím Đêm (from-indigo-950 to-purple-950)</option>
                  <option value="bg-gradient-to-br from-emerald-950 to-teal-950">Ngọc Lục Bảo (from-emerald-950 to-teal-950)</option>
                  <option value="bg-gradient-to-br from-rose-950 to-slate-950">Crimson Quản Trị (from-rose-950 to-slate-950)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
