import { LessonPlanItem, ExamItem } from '../types';
import { SAMPLE_LESSONS } from '../data/competencyData';

const DB_NAME = 'EduNLS_App_Database_2026';
const STORE_NAME = 'lessons';
const EXAM_STORE_NAME = 'exams';
const DB_VERSION = 2;

/**
 * Open or initialize IndexedDB for EduNLS
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject('IndexedDB is not available in this environment');
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(EXAM_STORE_NAME)) {
        db.createObjectStore(EXAM_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Save a single lesson plan to IndexedDB & LocalStorage
 */
export const saveLessonToStorage = async (lesson: LessonPlanItem): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(lesson);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Also update LocalStorage cache safely without wiping on quota error
    saveLessonsToLocalStorageCache([lesson]);
    return true;
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to LocalStorage:', err);
    saveLessonsToLocalStorageCache([lesson]);
    return false;
  }
};

/**
 * Save array of lessons to IndexedDB
 */
export const saveAllLessonsToStorage = async (lessons: LessonPlanItem[]): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      lessons.forEach(l => store.put(l));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Also update LocalStorage cache safely
    saveLessonsToLocalStorageCache(lessons);
    return true;
  } catch (err) {
    console.warn('IndexedDB saveAll failed:', err);
    saveLessonsToLocalStorageCache(lessons);
    return false;
  }
};

/**
 * Delete a lesson from IndexedDB & LocalStorage
 */
export const deleteLessonFromStorage = async (id: string): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Sync LocalStorage
    try {
      const saved = localStorage.getItem('edunls_lessons');
      if (saved) {
        const parsed: LessonPlanItem[] = JSON.parse(saved);
        const filtered = parsed.filter(l => l.id !== id);
        localStorage.setItem('edunls_lessons', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('LocalStorage error during deletion:', e);
    }

    return true;
  } catch (err) {
    console.warn('IndexedDB delete failed:', err);
    return false;
  }
};

/**
 * Load all lessons from IndexedDB combined with LocalStorage and Sample Data
 */
export const loadAllLessonsFromStorage = async (): Promise<LessonPlanItem[]> => {
  let idbLessons: LessonPlanItem[] = [];
  let lsLessons: LessonPlanItem[] = [];

  // 1. Try reading from IndexedDB
  try {
    const db = await openDB();
    idbLessons = await new Promise<LessonPlanItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB load error:', err);
  }

  // 2. Try reading from LocalStorage
  try {
    const saved = localStorage.getItem('edunls_lessons');
    if (saved) {
      lsLessons = JSON.parse(saved);
    }
  } catch (err) {
    console.warn('LocalStorage load error:', err);
  }

  // 3. Merge IDB, LS, and SAMPLE_LESSONS by ID (preferring IDB/LS)
  const lessonMap = new Map<string, LessonPlanItem>();

  // Add sample lessons as base
  SAMPLE_LESSONS.forEach(l => lessonMap.set(l.id, l));

  // Add LocalStorage lessons
  lsLessons.forEach(l => lessonMap.set(l.id, l));

  // Add IndexedDB lessons (most accurate & durable)
  idbLessons.forEach(l => lessonMap.set(l.id, l));

  return Array.from(lessonMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

/**
 * Safe LocalStorage Cache Writer (NEVER deletes existing storage on QuotaExceeded error)
 */
const saveLessonsToLocalStorageCache = (lessonsToUpdate: LessonPlanItem[]) => {
  try {
    const existing = localStorage.getItem('edunls_lessons');
    let currentList: LessonPlanItem[] = existing ? JSON.parse(existing) : [...SAMPLE_LESSONS];

    const map = new Map<string, LessonPlanItem>();
    currentList.forEach(l => map.set(l.id, l));
    lessonsToUpdate.forEach(l => map.set(l.id, l));

    const merged = Array.from(map.values());
    localStorage.setItem('edunls_lessons', JSON.stringify(merged));
  } catch (e) {
    console.warn('LocalStorage quota limit reached for full cache - IndexedDB holds master data:', e);
    // CRITICAL: DO NOT call removeItem('edunls_lessons') here!
    // Simply attempt to store metadata/recent items if possible
    try {
      const existing = localStorage.getItem('edunls_lessons');
      if (!existing) {
        const lightweight = lessonsToUpdate.slice(0, 5).map(l => ({
          ...l,
          originalContent: l.originalContent.slice(0, 1000),
          integratedContent: l.integratedContent.slice(0, 1000)
        }));
        localStorage.setItem('edunls_lessons', JSON.stringify(lightweight));
      }
    } catch {}
  }
};

/**
 * EXAM STORAGE FUNCTIONS FOR KHO ĐỀ KIỂM TRA
 */
export const saveExamToStorage = async (exam: ExamItem): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE_NAME, 'readwrite');
      const store = tx.objectStore(EXAM_STORE_NAME);
      const req = store.put(exam);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    saveExamsToLocalStorageCache([exam]);
    return true;
  } catch (err) {
    console.warn('IndexedDB save exam failed, falling back to LocalStorage:', err);
    saveExamsToLocalStorageCache([exam]);
    return false;
  }
};

export const saveAllExamsToStorage = async (exams: ExamItem[]): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE_NAME, 'readwrite');
      const store = tx.objectStore(EXAM_STORE_NAME);
      exams.forEach(e => store.put(e));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    saveExamsToLocalStorageCache(exams);
    return true;
  } catch (err) {
    console.warn('IndexedDB saveAllExams failed:', err);
    saveExamsToLocalStorageCache(exams);
    return false;
  }
};

export const deleteExamFromStorage = async (id: string): Promise<boolean> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(EXAM_STORE_NAME, 'readwrite');
      const store = tx.objectStore(EXAM_STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    try {
      const saved = localStorage.getItem('edunls_exams');
      if (saved) {
        const parsed: ExamItem[] = JSON.parse(saved);
        const filtered = parsed.filter(e => e.id !== id);
        localStorage.setItem('edunls_exams', JSON.stringify(filtered));
      }
    } catch (e) {}

    return true;
  } catch (err) {
    console.warn('IndexedDB delete exam failed:', err);
    return false;
  }
};

export const loadAllExamsFromStorage = async (): Promise<ExamItem[]> => {
  let idbExams: ExamItem[] = [];
  let lsExams: ExamItem[] = [];

  try {
    const db = await openDB();
    idbExams = await new Promise<ExamItem[]>((resolve, reject) => {
      if (!db.objectStoreNames.contains(EXAM_STORE_NAME)) {
        resolve([]);
        return;
      }
      const tx = db.transaction(EXAM_STORE_NAME, 'readonly');
      const store = tx.objectStore(EXAM_STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB load exams error:', err);
  }

  try {
    const saved = localStorage.getItem('edunls_exams');
    if (saved) {
      lsExams = JSON.parse(saved);
    }
  } catch (err) {
    console.warn('LocalStorage load exams error:', err);
  }

  const examMap = new Map<string, ExamItem>();
  lsExams.forEach(e => examMap.set(e.id, e));
  idbExams.forEach(e => examMap.set(e.id, e));

  return Array.from(examMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

const saveExamsToLocalStorageCache = (examsToUpdate: ExamItem[]) => {
  try {
    const existing = localStorage.getItem('edunls_exams');
    let currentList: ExamItem[] = existing ? JSON.parse(existing) : [];

    const map = new Map<string, ExamItem>();
    currentList.forEach(e => map.set(e.id, e));
    examsToUpdate.forEach(e => map.set(e.id, e));

    const merged = Array.from(map.values());
    localStorage.setItem('edunls_exams', JSON.stringify(merged));
  } catch (e) {
    console.warn('LocalStorage quota limit reached for exams cache:', e);
  }
};
