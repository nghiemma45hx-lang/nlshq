import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  adminLogin: (user: string, pass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edunls_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edunls_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edunls_auth_user');
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    // Check if user is entering admin credentials via regular form
    if ((email === 'admin' || email === 'admin@edunls.vn') && pass === 'admin') {
      const adminUser: UserProfile = {
        uid: 'admin-001',
        email: 'admin@edunls.vn',
        displayName: 'Quản trị viên Hệ thống',
        role: 'admin',
        isAdmin: true
      };
      setCurrentUser(adminUser);
      return { success: true };
    }

    // Attempt backend API login if available
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const u: UserProfile = {
            uid: data.user.id || 'admin-001',
            email: data.user.email || 'admin@edunls.vn',
            displayName: data.user.name || 'Quản trị viên',
            role: data.user.role || 'admin',
            isAdmin: true
          };
          setCurrentUser(u);
          return { success: true };
        }
      }
    } catch {
      // Fallback
    }

    // Standard simulated teacher login
    if (email && pass.length >= 6) {
      const teacherUser: UserProfile = {
        uid: 'user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0] || 'Giáo viên',
        role: 'user',
        isAdmin: false
      };
      setCurrentUser(teacherUser);
      return { success: true };
    }

    return { success: false, message: 'Email hoặc mật khẩu không hợp lệ (Mật khẩu ít nhất 6 ký tự).' };
  };

  const adminLogin = (user: string, pass: string): boolean => {
    if (user.trim().toLowerCase() === 'admin' && pass === 'admin') {
      const adminUser: UserProfile = {
        uid: 'admin-001',
        email: 'admin@edunls.vn',
        displayName: 'Quản trị viên (Admin)',
        role: 'admin',
        isAdmin: true
      };
      setCurrentUser(adminUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!name || !email || pass.length < 6) {
      return { success: false, message: 'Mật khẩu phải từ 6 ký tự trở lên.' };
    }
    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email: email,
      displayName: name,
      role: 'user',
      isAdmin: false
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, login, register, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
