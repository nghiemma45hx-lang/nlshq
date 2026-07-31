import React, { useState } from 'react';
import { 
  X, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { currentUser, isAdmin, updateUserProfile, deletePersonalAccount } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'delete'>('info');

  // Profile Edit State
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [infoError, setInfoError] = useState('');

  // Password Reset State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPassEye, setShowCurrentPassEye] = useState(false);
  const [showNewPassEye, setShowNewPassEye] = useState(false);
  const [showConfirmPassEye, setShowConfirmPassEye] = useState(false);
  const [passError, setPassError] = useState('');

  // Delete Account Confirmation Modal
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError('');

    if (!displayName.trim() || !email.trim()) {
      setInfoError('Họ tên và Email không được để trống.');
      return;
    }

    const res = updateUserProfile(currentUser.uid, {
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    if (res.success) {
      onSuccessToast('Đã cập nhật thông tin tài khoản cá nhân thành công!');
    } else {
      setInfoError(res.message || 'Cập nhật thất bại.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (currentUser.password && currentPass !== currentUser.password) {
      setPassError('Mật khẩu hiện tại nhập không chính xác.');
      return;
    }

    if (newPass.length < 6) {
      setPassError('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    const res = updateUserProfile(currentUser.uid, {
      password: newPass,
    });

    if (res.success) {
      onSuccessToast('Cấp lại / Cập nhật mật khẩu cá nhân thành công!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.message || 'Thay đổi mật khẩu thất bại.');
    }
  };

  const handleConfirmDeleteAccount = () => {
    setDeleteError('');

    // Check if user is admin
    if (isAdmin || currentUser.role === 'admin' || currentUser.email.toLowerCase() === 'admin@edunls.vn') {
      setDeleteError('KHÔNG THỂ XÓA TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)! Tài khoản Admin được bảo vệ tối cao.');
      return;
    }

    if (deleteInputText.trim().toUpperCase() !== 'XÓA TÀI KHOẢN') {
      setDeleteError('Vui lòng gõ chính xác cụm từ "XÓA TÀI KHOẢN" để xác nhận.');
      return;
    }

    const res = deletePersonalAccount(currentUser.uid);
    if (res.success) {
      onSuccessToast('Tài khoản cá nhân đã được xóa vĩnh viễn khỏi hệ thống.');
      setIsDeleteConfirmOpen(false);
      onClose();
    } else {
      setDeleteError(res.message || 'Xóa tài khoản không thành công.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-md shrink-0 ${
            isAdmin ? 'bg-rose-600' : 'bg-indigo-600'
          }`}>
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900">{currentUser.displayName}</h3>
              {isAdmin && (
                <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 mb-5 bg-slate-50 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'info'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Thông Tin Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'password'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Đổi / Cấp Lại MK</span>
          </button>

          <button
            onClick={() => setActiveTab('delete')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'delete'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Tài Khoản</span>
          </button>
        </div>

        {/* TAB 1: UPDATE PROFILE INFO */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên Giáo viên</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {infoError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                {infoError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi Thông Tin</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHANGE / RESET PERSONAL PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            {currentUser.password && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showCurrentPassEye ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassEye(!showCurrentPassEye)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition"
                  >
                    {showCurrentPassEye ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
              <div className="relative">
                <input
                  type={showNewPassEye ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Tạo mật khẩu mới"
                  className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassEye(!showNewPassEye)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition"
                >
                  {showNewPassEye ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirmPassEye ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassEye(!showConfirmPassEye)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition"
                >
                  {showConfirmPassEye ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                {passError}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>Cập Nhật Mật Khẩu Cá Nhân</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: DELETE PERSONAL ACCOUNT WITH DANGER WARNING & ADMIN PROTECTED SAFEGUARDS */}
        {activeTab === 'delete' && (
          <div className="space-y-4">
            {isAdmin || currentUser.role === 'admin' || currentUser.email.toLowerCase() === 'admin@edunls.vn' ? (
              /* Protected Admin Notice */
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-rose-900 space-y-3">
                <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-sm">
                  <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                  <span>CẢNH BÁO: KHÔNG THỂ XÓA TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  Tài khoản <strong className="text-rose-950 font-bold">{currentUser.displayName}</strong> là Tài khoản Quản trị viên Tối cao. Hệ thống đã cài đặt cơ chế bảo vệ nghiêm ngặt: <strong>Không thể xóa tài khoản Quản trị viên</strong> để tránh rủi ro mất quyền kiểm soát hệ thống.
                </p>
                <div className="p-3 bg-white border border-rose-200 rounded-xl text-[11px] font-mono text-rose-800">
                  Cơ chế bảo vệ Admin: LOCKED & PROTECTED
                </div>
                <button
                  disabled
                  className="w-full py-2.5 bg-slate-300 text-slate-500 font-bold rounded-xl text-xs cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Không thể xóa tài khoản Admin
                </button>
              </div>
            ) : (
              /* Normal Personal Account Deletion Safeguard */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Cảnh Báo Xóa Tài Khoản Cá Nhân</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi bạn tiến hành xóa tài khoản cá nhân, toàn bộ hồ sơ đăng ký, thông tin liên hệ và cài đặt cá nhân của bạn sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu hệ thống. Thao tác này <strong>không thể hoàn tác</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Tiến Hành Xóa Tài Khoản Cá Nhân</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DANGER WARNING CONFIRMATION MODAL FOR DELETING PERSONAL ACCOUNT */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h4 className="text-lg font-black text-rose-700">XÁC NHẬN XÓA TÀI KHOẢN CÁ NHÂN</h4>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong className="text-slate-900 font-bold">{currentUser.displayName}</strong>?
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 space-y-1">
              <div className="font-bold">⚠️ Lưu ý quan trọng:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-rose-800">
                <li>Dữ liệu hồ sơ sẽ bị hủy hoàn toàn.</li>
                <li>Bạn sẽ bị đăng xuất khỏi hệ thống ngay lập tức.</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nhập cụm từ <span className="text-rose-600 font-black">XÓA TÀI KHOẢN</span> để xác nhận:
              </label>
              <input
                type="text"
                value={deleteInputText}
                onChange={(e) => setDeleteInputText(e.target.value)}
                placeholder="XÓA TÀI KHOẢN"
                className="w-full px-3.5 py-2 border-2 border-rose-300 rounded-xl text-xs font-black text-center uppercase tracking-widest outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {deleteError && (
              <div className="p-2.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl">
                {deleteError}
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Hủy Thao Tác
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs transition shadow-md"
              >
                Xác Nhận Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
