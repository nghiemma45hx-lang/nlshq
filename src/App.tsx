import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HeroConfigProvider } from './context/HeroConfigContext';
import { Header } from './components/Header';
import { NavigationCards } from './components/NavigationCards';
import { AuthModal } from './components/AuthModal';
import { LandingView } from './components/LandingView';
import { StudioView } from './components/StudioView';
import { ExamGeneratorView } from './components/ExamGeneratorView';
import { ExamRepositoryView } from './components/ExamRepositoryView';
import { RepositoryView } from './components/RepositoryView';
import { LibraryView } from './components/LibraryView';
import { LegalView } from './components/LegalView';
import { AdminDashboard } from './components/AdminDashboard';
import { CompetencyDetailModal } from './components/CompetencyDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SAMPLE_LESSONS } from './data/competencyData';
import { LessonPlanItem, ExamItem, CompetencyDomain } from './types';
import { CheckCircle2 } from 'lucide-react';
import { 
  fetchLessonsFromSupabase, 
  saveLessonToSupabase, 
  deleteLessonFromSupabase, 
  seedSampleDataToSupabase,
  fetchExamsFromSupabase,
  saveExamToSupabase,
  deleteExamFromSupabase
} from './lib/supabaseService';
import {
  saveLessonToStorage,
  saveAllLessonsToStorage,
  deleteLessonFromStorage,
  loadAllLessonsFromStorage,
  saveExamToStorage,
  saveAllExamsToStorage,
  deleteExamFromStorage,
  loadAllExamsFromStorage
} from './lib/storageService';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyDomain | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Saved lessons state (stored in IndexedDB, LocalStorage & Supabase)
  const [lessons, setLessons] = useState<LessonPlanItem[]>(() => {
    const saved = localStorage.getItem('edunls_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_LESSONS;
      }
    }
    return SAMPLE_LESSONS;
  });

  // Saved exams state (stored in Kho Đề Kiểm Tra riêng biệt)
  const [exams, setExams] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('edunls_exams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Durable initial load: Load IndexedDB master cache first, then merge with Supabase
  useEffect(() => {
    const loadDurableData = async () => {
      // 1. Load Lessons from IndexedDB & Supabase
      const localDurableLessons = await loadAllLessonsFromStorage();
      if (localDurableLessons && localDurableLessons.length > 0) {
        setLessons(localDurableLessons);
      }

      try {
        const remoteLessons = await fetchLessonsFromSupabase();
        if (remoteLessons && remoteLessons.length > 0) {
          setLessons(prev => {
            const map = new Map<string, LessonPlanItem>();
            remoteLessons.forEach(l => map.set(l.id, l));
            prev.forEach(l => map.set(l.id, l));
            const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            saveAllLessonsToStorage(merged);
            return merged;
          });
        } else {
          await seedSampleDataToSupabase();
        }
      } catch (err) {
        console.warn('Supabase initial fetch failed, relying on IndexedDB local cache:', err);
      }

      // 2. Load Exams from IndexedDB & Supabase
      const localDurableExams = await loadAllExamsFromStorage();
      if (localDurableExams && localDurableExams.length > 0) {
        setExams(localDurableExams);
      }

      try {
        const remoteExams = await fetchExamsFromSupabase();
        if (remoteExams && remoteExams.length > 0) {
          setExams(prev => {
            const map = new Map<string, ExamItem>();
            remoteExams.forEach(e => map.set(e.id, e));
            prev.forEach(e => map.set(e.id, e));
            const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            saveAllExamsToStorage(merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase exams initial fetch failed, relying on IndexedDB local cache:', err);
      }
    };

    loadDurableData();
  }, []);

  // Sync state changes to durable IndexedDB storage
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      saveAllLessonsToStorage(lessons);
    }
  }, [lessons]);

  useEffect(() => {
    if (exams && exams.length > 0) {
      saveAllExamsToStorage(exams);
    }
  }, [exams]);

  // Selected sample or saved lesson plan for studio
  const [activeSample, setActiveSample] = useState<LessonPlanItem | null>(null);

  const handleSaveExam = async (examData: ExamItem) => {
    const examId = examData.id || 'exam-' + Date.now();
    const newExam: ExamItem = {
      ...examData,
      id: examId,
      userId: currentUser?.uid || examData.userId || 'guest-teacher',
      ownerEmail: currentUser?.email || examData.ownerEmail || '',
      authorName: currentUser?.displayName || examData.authorName || 'Giáo viên'
    };

    setExams(prev => {
      const exists = prev.some(e => e.id === examId);
      if (exists) {
        return prev.map(e => e.id === examId ? newExam : e);
      }
      return [newExam, ...prev];
    });

    await saveExamToStorage(newExam);
    await saveExamToSupabase(newExam, currentUser?.uid || currentUser?.email);
  };

  const handleDeleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    await deleteExamFromStorage(id);
    await deleteExamFromSupabase(id);
    showToast('Đã xóa đề kiểm tra khỏi Kho Đề Kiểm Tra riêng.');
  };

  const handleUpdateExamTitle = (id: string, newTitle: string) => {
    setExams(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, title: newTitle } : e);
      saveAllExamsToStorage(updated);
      return updated;
    });
    showToast('Đã cập nhật tên đề kiểm tra!');
  };

  const handleSaveLesson = async (lessonData: Partial<LessonPlanItem> & Omit<LessonPlanItem, 'createdAt' | 'dateString'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const fullDateString = `${timeStr} - ${dateStr}`;

    const lessonId = lessonData.id || 'lesson-' + Date.now();

    const newLesson: LessonPlanItem = {
      title: lessonData.title || 'Bài dạy chưa đặt tên',
      subject: lessonData.subject || 'Ngữ văn',
      grade: lessonData.grade || 'Lớp 10',
      framework: lessonData.framework || 'TT 02/2025/TT-BGDĐT',
      template: lessonData.template || 'CV 5512/BGDĐT-GDTrH',
      status: lessonData.status || 'Đã tích hợp NLS',
      originalContent: lessonData.originalContent || '',
      integratedContent: lessonData.integratedContent || '',
      ...lessonData,
      id: lessonId,
      createdAt: lessonData.createdAt || Date.now(),
      dateString: fullDateString,
      userId: currentUser?.uid || lessonData.userId || 'guest-teacher',
      ownerEmail: currentUser?.email || lessonData.ownerEmail || '',
    };

    // 1. Update React memory state
    setLessons(prev => {
      const exists = prev.some(l => l.id === lessonId);
      if (exists) {
        return prev.map(l => l.id === lessonId ? newLesson : l);
      }
      return [newLesson, ...prev];
    });

    // 2. Persist to IndexedDB immediately (durable across browser exits)
    await saveLessonToStorage(newLesson);

    // 3. Save to Supabase Cloud Database
    await saveLessonToSupabase(newLesson, currentUser?.uid || currentUser?.email);
  };

  const handleDeleteLesson = async (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    await deleteLessonFromStorage(id);
    await deleteLessonFromSupabase(id);
    showToast('Đã xóa giáo án khỏi bộ nhớ và Supabase Database.');
  };

  const handleUpdateLessonTitle = (id: string, newTitle: string) => {
    setLessons(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, title: newTitle } : l);
      saveAllLessonsToStorage(updated);
      return updated;
    });
    showToast('Đã cập nhật tên bài dạy!');
  };

  const handleSelectSavedLesson = (lesson: LessonPlanItem) => {
    setActiveSample(lesson);
    setCurrentView('studio');
    showToast(`Đã nạp bài dạy "${lesson.title.substring(0, 30)}..." vào AI Studio.`);
  };

  const handleLoadSampleFromLanding = () => {
    setActiveSample(SAMPLE_LESSONS[0]);
    setCurrentView('studio');
    showToast('Đã nạp Kế hoạch bài dạy mẫu Toán 10 (Chuẩn CV 5512)!');
  };

  const handleApplyCompetencyToStudio = (comp: CompetencyDomain) => {
    setSelectedCompetency(null);
    setCurrentView('studio');
    showToast(`Đã áp dụng miền "${comp.title}" vào AI Studio Workstation!`);
  };

  const handleRestoreLessons = (restoredLessons: LessonPlanItem[]) => {
    if (Array.isArray(restoredLessons)) {
      setLessons(restoredLessons);
      try {
        localStorage.setItem('edunls_lessons', JSON.stringify(restoredLessons));
      } catch (e) {
        console.warn('LocalStorage error saving restored lessons:', e);
      }
      showToast(`Đã khôi phục ${restoredLessons.length} kế hoạch bài dạy thành công!`);
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentView={currentView}
        onSwitchView={setCurrentView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Persistent System Function Navigation Cards Banner */}
      <NavigationCards
        currentView={currentView}
        onSwitchView={setCurrentView}
      />

      {/* Main Views Container */}
      <main className="flex-grow">
        {currentView === 'landing' && (
          <LandingView
            onSwitchView={setCurrentView}
            onLoadSample={handleLoadSampleFromLanding}
          />
        )}

        {currentView === 'studio' && (
          <StudioView
            onSaveLesson={handleSaveLesson}
            onSuccessToast={showToast}
            sampleLesson={activeSample}
          />
        )}

        {currentView === 'exam' && (
          <ExamGeneratorView
            onSaveLesson={handleSaveLesson}
            onSaveExam={handleSaveExam}
            onSuccessToast={showToast}
            onSwitchView={setCurrentView}
          />
        )}

        {currentView === 'exam-repo' && (
          <ExamRepositoryView
            exams={exams}
            onDeleteExam={handleDeleteExam}
            onUpdateExamTitle={handleUpdateExamTitle}
            onSwitchView={setCurrentView}
            onSuccessToast={showToast}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'repository' && (
          <RepositoryView
            lessons={lessons}
            onSelectLesson={handleSelectSavedLesson}
            onDeleteLesson={handleDeleteLesson}
            onUpdateLessonTitle={handleUpdateLessonTitle}
            onSwitchView={setCurrentView}
            onSuccessToast={showToast}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            onSelectCompetency={(comp) => setSelectedCompetency(comp)}
          />
        )}

        {currentView === 'legal' && (
          <LegalView onSuccessToast={showToast} />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            lessons={lessons}
            onDeleteLesson={handleDeleteLesson}
            onRestoreLessons={handleRestoreLessons}
            onSuccessToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-extrabold text-indigo-700 text-sm">EduNLS AI 2026</span> - Nền tảng Tích Hợp Năng Lực Số & AI Dành Cho Giáo Viên
            <p className="text-[11px] text-slate-400 mt-0.5">Căn cứ Thông tư 02/2025/TT-BGDĐT, Quyết định 3439/QĐ-BGDĐT & Công văn 5512/BGDĐT-GDTrH</p>
          </div>
          <div className="text-right text-xs font-semibold text-slate-600 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200">
            Bản quyền thuộc về thầy giáo Nghiêm Hồng Quân - 0984839799
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessToast={showToast}
      />

      {/* User Personal Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSuccessToast={showToast}
      />

      {/* Competency Detail Modal */}
      <CompetencyDetailModal
        competency={selectedCompetency}
        onClose={() => setSelectedCompetency(null)}
        onApplyToStudio={handleApplyCompetencyToStudio}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 border border-slate-800 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HeroConfigProvider>
        <AppContent />
      </HeroConfigProvider>
    </AuthProvider>
  );
}

