import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

const INITIAL_MOCK_USERS: UserProfile[] = [
  {
    uid: 'user-101',
    displayName: 'Nguyễn Văn An',
    email: 'nguyenvanan@truong.edu.vn',
    phone: '0912345678',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    status: 'active',
    createdAt: '2026-07-20 09:30'
  },
  {
    uid: 'user-102',
    displayName: 'Trần Thị Bình',
    email: 'tranthibinh@truong.edu.vn',
    phone: '0987654321',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    status: 'active',
    createdAt: '2026-07-22 14:15'
  },
  {
    uid: 'user-103',
    displayName: 'Lê Hoàng Cường',
    email: 'lehoangcuong@truong.edu.vn',
    phone: '0905123456',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    status: 'active',
    createdAt: '2026-07-25 11:00'
  }
];

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  registeredUsers: UserProfile[];
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  adminLogin: (user: string, pass: string) => boolean;
  findUserByIdentifier: (identifier: string) => UserProfile | null;
  resetPasswordByIdentifier: (identifier: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  adminResetUserPassword: (uid: string, newPass: string) => boolean;
  adminToggleUserStatus: (uid: string) => boolean;
  adminDeleteUser: (uid: string) => boolean;
  adminAddUser: (name: string, email: string, phone: string, pass: string, role: 'user' | 'admin') => { success: boolean; message?: string };
  updateUserProfile: (uid: string, data: Partial<UserProfile>) => { success: boolean; message?: string };
  deletePersonalAccount: (uid: string) => { success: boolean; message?: string };
  restoreUsersData: (users: UserProfile[]) => void;
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

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('edunls_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MOCK_USERS;
      }
    }
    return INITIAL_MOCK_USERS;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('edunls_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('edunls_auth_user');
      }
    } catch (e) {
      console.warn('Failed to save currentUser to localStorage:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('edunls_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Failed to save registeredUsers to localStorage:', e);
    }
  }, [registeredUsers]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;

  const findUserByIdentifier = (identifier: string): UserProfile | null => {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return registeredUsers.find(
      u => u.email.toLowerCase() === clean || (u.phone && u.phone.trim() === clean)
    ) || null;
  };

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();

    // Check if user is entering admin credentials
    if ((cleanId === 'admin' || cleanId === 'admin@edunls.vn') && (pass === 'admin' || pass === 'Bomyvn78@')) {
      const adminUser: UserProfile = {
        uid: 'admin-001',
        email: 'admin@edunls.vn',
        displayName: 'Quản trị viên Hệ thống',
        role: 'admin',
        isAdmin: true,
        status: 'active'
      };
      setCurrentUser(adminUser);
      return { success: true };
    }

    // Search in registered users list
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanId || (u.phone && u.phone.trim() === cleanId)
    );

    if (foundUser) {
      if (foundUser.status === 'locked') {
        return { success: false, message: 'Tài khoản này đã bị khóa bởi Quản trị viên. Vui lòng liên hệ Admin.' };
      }
      if (foundUser.password && foundUser.password !== pass) {
        return { success: false, message: 'Mật khẩu nhập không chính xác.' };
      }
      setCurrentUser(foundUser);
      return { success: true };
    }

    // Fallback for simulated general login
    if (cleanId && pass.length >= 6) {
      const teacherUser: UserProfile = {
        uid: 'user-' + Date.now(),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@school.edu.vn`,
        displayName: cleanId.split('@')[0] || 'Giáo viên',
        role: 'user',
        isAdmin: false,
        status: 'active',
        createdAt: new Date().toLocaleString('vi-VN')
      };
      setCurrentUser(teacherUser);
      return { success: true };
    }

    return { success: false, message: 'Email/Số điện thoại hoặc Mật khẩu không chính xác.' };
  };

  const adminLogin = (user: string, pass: string): boolean => {
    if ((user.trim().toLowerCase() === 'admin' || user.trim().toLowerCase() === 'admin@edunls.vn') && (pass === 'admin' || pass === 'Bomyvn78@')) {
      const adminUser: UserProfile = {
        uid: 'admin-001',
        email: 'admin@edunls.vn',
        displayName: 'Quản trị viên (Admin)',
        role: 'admin',
        isAdmin: true,
        status: 'active'
      };
      setCurrentUser(adminUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, phone: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!name || !email || pass.length < 6) {
      return { success: false, message: 'Mật khẩu phải từ 6 ký tự trở lên.' };
    }

    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() || (phone && u.phone && u.phone.trim() === phone.trim())
    );

    if (existing) {
      return { success: false, message: 'Email hoặc Số điện thoại này đã được đăng ký trên hệ thống.' };
    }

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email: email.trim(),
      phone: phone.trim(),
      displayName: name.trim(),
      password: pass,
      role: 'user',
      isAdmin: false,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const resetPasswordByIdentifier = async (identifier: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (!identifier || !newPass || newPass.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải từ 6 ký tự trở lên.' };
    }

    const clean = identifier.trim().toLowerCase();
    const userIndex = registeredUsers.findIndex(
      u => u.email.toLowerCase() === clean || (u.phone && u.phone.trim() === clean)
    );

    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy tài khoản với Email hoặc Số điện thoại này.' };
    }

    setRegisteredUsers(prev => {
      const updated = [...prev];
      updated[userIndex] = {
        ...updated[userIndex],
        password: newPass
      };
      return updated;
    });

    return { success: true };
  };

  // Admin Actions
  const adminResetUserPassword = (uid: string, newPass: string): boolean => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.uid === uid ? { ...u, password: newPass } : u))
    );
    return true;
  };

  const adminToggleUserStatus = (uid: string): boolean => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.uid === uid ? { ...u, status: u.status === 'locked' ? 'active' : 'locked' } : u))
    );
    return true;
  };

  const adminDeleteUser = (uid: string): boolean => {
    setRegisteredUsers(prev => prev.filter(u => u.uid !== uid));
    return true;
  };

  const adminAddUser = (name: string, email: string, phone: string, pass: string, role: 'user' | 'admin') => {
    if (!name || !email || !pass || pass.length < 6) {
      return { success: false, message: 'Vui lòng điền đủ thông tin và mật khẩu ít nhất 6 ký tự.' };
    }
    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email: email.trim(),
      phone: phone.trim(),
      displayName: name.trim(),
      password: pass,
      role: role,
      isAdmin: role === 'admin',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setRegisteredUsers(prev => [newUser, ...prev]);
    return { success: true };
  };

  const updateUserProfile = (uid: string, data: Partial<UserProfile>): { success: boolean; message?: string } => {
    if (!uid) return { success: false, message: 'Không tìm thấy thông tin tài khoản.' };

    setRegisteredUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...data } : u));

    if (currentUser && currentUser.uid === uid) {
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
    }

    return { success: true };
  };

  const deletePersonalAccount = (uid: string): { success: boolean; message?: string } => {
    const target = registeredUsers.find(u => u.uid === uid) || (currentUser?.uid === uid ? currentUser : null);
    if (!target) {
      return { success: false, message: 'Không tìm thấy tài khoản cần xóa.' };
    }

    // Safety check: ABSOLUTELY CANNOT DELETE ADMIN ACCOUNT
    if (
      target.role === 'admin' ||
      target.isAdmin === true ||
      target.email.toLowerCase() === 'admin@edunls.vn' ||
      target.uid === 'admin-001'
    ) {
      return {
        success: false,
        message: 'CẢNH BÁO: KHÔNG THỂ XÓA TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)! Tài khoản Quản trị viên tối cao được bảo vệ để duy trì quyền kiểm soát hệ thống.'
      };
    }

    setRegisteredUsers(prev => prev.filter(u => u.uid !== uid));
    if (currentUser?.uid === uid) {
      setCurrentUser(null);
    }
    return { success: true };
  };

  const restoreUsersData = (users: UserProfile[]) => {
    if (Array.isArray(users) && users.length > 0) {
      setRegisteredUsers(users);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      registeredUsers,
      login,
      register,
      logout,
      adminLogin,
      findUserByIdentifier,
      resetPasswordByIdentifier,
      adminResetUserPassword,
      adminToggleUserStatus,
      adminDeleteUser,
      adminAddUser,
      updateUserProfile,
      deletePersonalAccount,
      restoreUsersData
    }}>
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
