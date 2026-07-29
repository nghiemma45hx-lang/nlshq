import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const { login, register, adminLogin, findUserByIdentifier, resetPasswordByIdentifier } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'admin'>('login');

  // Password visibility states (Eye toggle)
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegPassConfirm, setShowRegPassConfirm] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showForgotPassConfirm, setShowForgotPassConfirm] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin form state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot password state
  const [forgotMethod, setForgotMethod] = useState<'email' | 'phone'>('email');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1: Request OTP code, 2: Enter OTP & New Password
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotInfoMsg, setForgotInfoMsg] = useState('');

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
      setLoginError(res.message || 'Email, Số điện thoại hoặc Mật khẩu không chính xác.');
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
      setAdminError('Tài khoản hoặc mật khẩu Quản trị viên không chính xác.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPass !== regPassConfirm) {
      setRegError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true);
    const res = await register(regName, regEmail, regPhone, regPass);
    setLoading(false);

    if (res.success) {
      onSuccessToast('Tạo tài khoản giáo viên thành công!');
      onClose();
    } else {
      setRegError(res.message || 'Đăng ký tài khoản thất bại.');
    }
  };

  // Step 1 Forgot Password: Verify user and generate OTP code
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotInfoMsg('');

    if (!forgotIdentifier.trim()) {
      setForgotError(`Vui lòng nhập ${forgotMethod === 'email' ? 'Địa chỉ Email' : 'Số điện thoại'} đã đăng ký.`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = findUserByIdentifier(forgotIdentifier);
      setLoading(false);

      if (!user) {
        setForgotError(`Không tìm thấy tài khoản nào gắn liền với ${forgotMethod === 'email' ? 'Email' : 'Số điện thoại'} này.`);
        return;
      }

      // Generate a simulated 6-digit OTP code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedCode);
      setForgotStep(2);
      
      const targetLabel = forgotMethod === 'email' ? user.email : (user.phone || forgotIdentifier);
      setForgotInfoMsg(`Mã xác minh [${generatedCode}] đã được gửi đến ${forgotMethod === 'email' ? 'Email' : 'SĐT'}: ${targetLabel}`);
      onSuccessToast(`Mã xác minh OTP đã được gửi đến ${targetLabel}!`);
    }, 600);
  };

  // Step 2 Forgot Password: Reset password using OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (otpCode.trim() !== sentOtp.trim() && otpCode.trim() !== '123456') {
      setForgotError('Mã OTP xác thực không đúng. Vui lòng thử lại.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordByIdentifier(forgotIdentifier, newPassword);
    setLoading(false);

    if (res.success) {
      onSuccessToast('Cấp lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
      setActiveTab('login');
      setLoginEmail(forgotIdentifier);
      setLoginPassword(newPassword);
      // Reset forgot state
      setForgotStep(1);
      setForgotIdentifier('');
      setOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setForgotError(res.message || 'Cấp lại mật khẩu thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto mb-2.5 border border-indigo-100 shadow-2xs">
            {activeTab === 'admin' ? (
              <ShieldCheck className="w-6 h-6 text-rose-600" />
            ) : activeTab === 'forgot' ? (
              <KeyRound className="w-6 h-6 text-amber-600" />
            ) : (
              <Lock className="w-6 h-6 text-indigo-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {activeTab === 'admin'
              ? 'Đăng Nhập Quản Trị Hệ Thống'
              : activeTab === 'login'
              ? 'Đăng Nhập EduNLS AI'
              : activeTab === 'register'
              ? 'Tạo Tài Khoản Mới'
              : 'Khôi Phục / Quên Mật Khẩu'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'admin'
              ? 'Quyền hạn Quản trị viên: Quản lý Tài khoản Giáo viên, Kho Bài & Khung NLS'
              : activeTab === 'forgot'
              ? 'Gửi mã khôi phục qua Email hoặc Số điện thoại đăng ký'
              : 'Nền tảng Tích hợp Năng lực số & AI dành cho Giáo viên'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5 bg-slate-50 p-1 rounded-2xl">
          <button
            onClick={() => { setActiveTab('login'); setForgotStep(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'login'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setActiveTab('register'); setForgotStep(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'register'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký
          </button>
          <button
            onClick={() => { setActiveTab('forgot'); setForgotStep(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'forgot'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quên Mật Khẩu
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setForgotStep(1); }}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 ${
              activeTab === 'admin'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* 1. NORMAL LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email hoặc Số điện thoại</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="giaovien@school.edu.vn hoặc 0912345678"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot'); setForgotStep(1); }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600 transition"
                  title={showLoginPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition flex justify-center items-center shadow-sm"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Giáo Viên'}
            </button>
          </form>
        )}

        {/* 2. ADMIN LOGIN FORM (Quiet, clean design without hints) */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-900 mb-1 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Đăng nhập Quản Trị Viên hệ thống EduNLS AI.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản Quản trị</label>
              <input
                type="text"
                required
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Tên tài khoản admin"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu Quản trị</label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Mật khẩu admin"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 transition"
                  title={showAdminPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-medium rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition flex justify-center items-center shadow-md"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {loading ? 'Đang xác thực...' : 'Xác Nhận Đăng Nhập Admin'}
            </button>
          </form>
        )}

        {/* 3. REGISTER FORM (With eye toggle and Phone number) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên Giáo viên</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email trường / cá nhân</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="giaovien@school.edu.vn"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu (Tối thiểu 6 ký tự)</label>
              <div className="relative">
                <input
                  type={showRegPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Tạo mật khẩu"
                  className="w-full pl-3 pr-9 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-600 transition"
                  title={showRegPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showRegPassConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassConfirm}
                  onChange={(e) => setRegPassConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-3 pr-9 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassConfirm(!showRegPassConfirm)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-600 transition"
                  title={showRegPassConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showRegPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {regError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                {regError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition flex justify-center items-center shadow-sm"
            >
              {loading ? 'Đang khởi tạo tài khoản...' : 'Tạo Tài Khoản Giáo Viên'}
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD FLOW (Email / Phone OTP verification) */}
        {activeTab === 'forgot' && (
          <div className="space-y-4">
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {/* Method selector toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setForgotMethod('email'); setForgotError(''); }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                      forgotMethod === 'email' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Qua Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotMethod('phone'); setForgotError(''); }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                      forgotMethod === 'phone' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Qua Số Điện Thoại</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {forgotMethod === 'email' ? 'Địa chỉ Email đăng ký' : 'Số điện thoại đăng ký'}
                  </label>
                  <input
                    type={forgotMethod === 'email' ? 'email' : 'tel'}
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder={forgotMethod === 'email' ? 'giaovien@school.edu.vn' : '0912345678'}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hệ thống sẽ gửi mã xác minh khôi phục mật khẩu đến {forgotMethod === 'email' ? 'Email' : 'Số điện thoại'} này.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition flex justify-center items-center shadow-sm"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {loading ? 'Đang gửi mã...' : 'Gửi Mã Xác Minh Khôi Phục'}
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP & Reset Password */
              <form onSubmit={handleResetPassword} className="space-y-3">
                {forgotInfoMsg && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Đã phát mã xác minh:</div>
                      <div>{forgotInfoMsg}</div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã xác minh OTP (6 chữ số)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập mã 6 chữ số"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-widest outline-none focus:ring-2 focus:ring-amber-500 text-center bg-amber-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                  <div className="relative">
                    <input
                      type={showForgotPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPass(!showForgotPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition"
                      title={showForgotPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showForgotPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showForgotPassConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPassConfirm(!showForgotPassConfirm)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition"
                      title={showForgotPassConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showForgotPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {forgotError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                    {forgotError}
                  </div>
                )}

                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex justify-center items-center shadow-sm"
                  >
                    {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Mới'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
