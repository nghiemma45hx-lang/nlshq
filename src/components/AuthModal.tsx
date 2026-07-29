import React, { useState } from 'react';
import { X, Lock, ShieldCheck, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const { login, register, adminLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin form state
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin');
  const [adminError, setAdminError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [regError, setRegError] = useState('');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      onSuccessToast('Đăng nhập thành công!');
      onClose();
    } else {
      setLoginError(res.message || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);

    const success = adminLogin(adminUser, adminPass);
    setLoading(false);

    if (success) {
      onSuccessToast('Đã đăng nhập thành công với quyền QUẢN TRỊ VIÊN (ADMIN)!');
      onClose();
    } else {
      setAdminError('Tài khoản hoặc mật khẩu Quản trị không chính xác. Hãy dùng admin / admin.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPass !== regPassConfirm) {
      setRegError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    const res = await register(regName, regEmail, regPass);
    setLoading(false);

    if (res.success) {
      onSuccessToast('Đăng ký tài khoản thành công!');
      onClose();
    } else {
      setRegError(res.message || 'Đăng ký thất bại.');
    }
  };

  const fillAdminQuick = () => {
    setActiveTab('admin');
    setAdminUser('admin');
    setAdminPass('admin');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto mb-2 border border-indigo-100 shadow-2xs">
            {activeTab === 'admin' ? (
              <ShieldCheck className="w-6 h-6 text-rose-600" />
            ) : (
              <Lock className="w-6 h-6 text-indigo-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {activeTab === 'admin'
              ? 'Đăng Nhập Quản Trị Hệ Thống'
              : activeTab === 'login'
              ? 'Đăng Nhập EduNLS AI'
              : 'Tạo Tài Khoản Mới'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'admin'
              ? 'Quyền hạn Quản trị viên: Quản lý Kho Giáo án, Khung NLS & Thống kê'
              : 'Nền tảng Tích hợp Năng lực số & AI dành cho Giáo viên'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5 bg-slate-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'register'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1 ${
              activeTab === 'admin'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Admin Fill Helper Banner */}
        {activeTab !== 'admin' && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />
              Tài khoản Quản trị: <code className="bg-amber-100 font-bold px-1 py-0.5 rounded ml-1">admin / admin</code>
            </span>
            <button
              onClick={fillAdminQuick}
              className="text-[11px] bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-2 py-1 rounded transition"
            >
              Chọn ngay
            </button>
          </div>
        )}

        {/* Normal Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Tên đăng nhập</label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="teacher@truong.edu.vn hoặc admin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
            {loginError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition flex justify-center items-center shadow-sm"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập Giáo Viên'}
            </button>
          </form>
        )}

        {/* ADMIN LOGIN FORM (user/pass: admin/admin) */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 mb-2">
              <div className="font-bold flex items-center mb-1">
                <ShieldCheck className="w-4 h-4 mr-1 text-rose-600" />
                Đăng nhập Quản Trị Viên (Admin Mode)
              </div>
              <p>Dành cho Quản trị viên hệ thống EduNLS AI. Thông tin đăng nhập mặc định:</p>
              <div className="mt-1 font-mono font-bold text-slate-800 bg-white/80 px-2 py-1 rounded border border-rose-200">
                Tài khoản: <span className="text-rose-700">admin</span> | Mật khẩu: <span className="text-rose-700">admin</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản Quản trị (Username)</label>
              <input
                type="text"
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu Quản trị (Password)</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>
            {adminError && (
              <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-medium rounded-lg">
                {adminError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm transition flex justify-center items-center shadow-md"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {loading ? 'Đang xác thực Admin...' : 'Đăng Nhập Quản Trị (admin / admin)'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên Giáo viên</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email trường / cá nhân</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="giaovien@school.edu.vn"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu (Tối thiểu 6 ký tự)</label>
              <input
                type="password"
                required
                minLength={6}
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                minLength={6}
                value={regPassConfirm}
                onChange={(e) => setRegPassConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {regError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
                {regError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm transition flex justify-center items-center shadow-sm"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
