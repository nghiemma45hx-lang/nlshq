import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in EduNLS AI application:', error, errorInfo);
  }

  private handleReload = () => {
    localStorage.removeItem('edunls_auth_user');
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white">Đã Xảy Ra Lỗi Hiển Thị Trang</h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống EduNLS AI vừa phát hiện sự cố khi nạp dữ liệu. Vui lòng bấm phím bên dưới để khôi phục và tải lại trang.
            </p>

            {this.state.error?.message && (
              <div className="p-3 bg-slate-950 rounded-xl text-left font-mono text-[11px] text-rose-300 border border-slate-800 overflow-x-auto">
                <code>{this.state.error.message}</code>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi Phục & Tải Lại Trang</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
