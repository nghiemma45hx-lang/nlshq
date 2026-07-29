-- ====================================================================
-- EDU NLS AI 2026 - SUPABASE DATABASE SCHEMA INITIALIZATION SCRIPT
-- Project URL: https://uqkhrynrdobxglnjguhb.supabase.co
-- ====================================================================

-- 1. TABLE: LESSONS (Kho Kế hoạch bài dạy Tích hợp Năng lực số & AI)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT DEFAULT 'THPT',
  framework TEXT DEFAULT 'TT 02/2025/TT-BGDĐT',
  template TEXT DEFAULT 'Công văn 5512/BGDĐT-GDTrH',
  status TEXT DEFAULT 'Đã tích hợp NLS',
  original_content TEXT,
  integrated_content TEXT,
  created_at BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
  date_string TEXT,
  is_featured BOOLEAN DEFAULT false,
  user_id TEXT DEFAULT 'anonymous-teacher'
);

-- Index for fast title and subject queries
CREATE INDEX IF NOT EXISTS idx_lessons_subject ON public.lessons(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at DESC);

-- 2. TABLE: AI_LOGS (Nhật ký phân tích & tạo giáo án bằng Gemini AI)
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'anonymous-teacher',
  subject TEXT,
  grade TEXT,
  framework TEXT,
  model_name TEXT DEFAULT 'gemini-3.6-flash',
  response_time_ms INT DEFAULT 1200,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for AI logs
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_logs(created_at DESC);

-- 3. TABLE: PROFILES (Hồ sơ Giáo viên & Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) and Allow Public Read/Write for Teacher Workspace
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies so the application operates seamlessly with Anon Key
CREATE POLICY "Allow public read access to lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to lessons" ON public.lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to lessons" ON public.lessons FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to lessons" ON public.lessons FOR DELETE USING (true);

CREATE POLICY "Allow public read access to ai_logs" ON public.ai_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to ai_logs" ON public.ai_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Insert Default Admin Profile
INSERT INTO public.profiles (id, email, display_name, role, is_admin)
VALUES ('admin-001', 'admin@edunls.vn', 'Quản trị viên Hệ thống', 'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Lesson Plan for Mathematics
INSERT INTO public.lessons (id, title, subject, grade, framework, template, status, original_content, integrated_content, created_at, date_string, is_featured)
VALUES (
  'lesson-math-10-01',
  'Đồ thị hàm số bậc hai y = ax² + bx + c (Toán 10)',
  'Toán học',
  'Lớp 10',
  'Thông tư 02/2025/TT-BGDĐT',
  'Công văn 5512/BGDĐT-GDTrH',
  'Đã tích hợp NLS',
  'Bài 3: Đồ thị hàm số bậc hai. Mục tiêu: HS nắm được dạng đồ thị và tọa độ đỉnh Parabol. Tiến trình: GV giảng lý thuyết, HS làm bài tập SGK.',
  '<div class="space-y-4"><div class="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg"><span class="font-bold text-indigo-900 block text-xs uppercase mb-1">MỤC TIÊU BÀI HỌC TÍCH HỢP NLS & AI</span><ul class="list-disc pl-5 text-xs text-slate-700 space-y-1 mt-1"><li><span class="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded font-mono">[NLS 1.1-a]</span> Tra cứu dữ liệu đồ thị trên phần mềm GeoGebra.</li><li><span class="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono">[AI-NLc]</span> Sử dụng AI Prompt giải đáp tham số Parabol.</li></ul></div></div>',
  1785322268000,
  '29/07/2026',
  true
)
ON CONFLICT (id) DO NOTHING;
