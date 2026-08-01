export interface LessonPlanItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  framework: string;
  template: string;
  status: 'Đã tích hợp NLS' | 'Đã chỉnh sửa' | 'Gốc';
  originalContent: string;
  integratedContent: string;
  createdAt: number;
  dateString: string;
  isFeatured?: boolean;
  userId?: string;
  ownerEmail?: string;
}

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  examType: string;
  durationMinutes?: string;
  schoolName?: string;
  headerDept?: string;
  schoolYear?: string;
  framework: string;
  template: string;
  originalContent: string;
  integratedContent: string;
  createdAt: number;
  dateString: string;
  userId: string;
  ownerEmail: string;
  authorName?: string;
}

export interface CompetencyComponent {
  code: string;
  title: string;
  tag: string;
  description?: string;
}

export interface CompetencyDomain {
  id: string;
  code: string;
  title: string;
  icon: string;
  framework: string;
  description: string;
  fullDescription: string;
  components: CompetencyComponent[];
  lessonGuide: string;
  tools: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  isAdmin?: boolean;
  phone?: string;
  password?: string;
  status?: 'active' | 'locked';
  createdAt?: string;
}

export interface AdminStats {
  totalLessons: number;
  totalAiAnalyses: number;
  activeUsers: number;
  avgResponseTimeMs: number;
  topCompetency: string;
  subjectStats: { subject: string; count: number }[];
  dailyUsage: { date: string; count: number }[];
}

export interface LegalDocument {
  id: string;
  code: string;
  title: string;
  authority: string;
  date: string;
  summary: string;
  keyPoints: string[];
  icon: string;
  badgeColor: string;
  fullText?: string;
  details?: {
    scope: string;
    targetAudience: string;
    structure: { name: string; desc: string; tags?: string[] }[];
    implementationGuide: string[];
    legalReferenceUrl?: string;
  };
}

export interface NavCardConfigItem {
  id: string;
  title: string;
  sub: string;
  badge: string;
  badgeColor: string;
  cardBgColor: string;
  textColor: string;
  isHot?: boolean;
}

export interface HeroBannerConfig {
  badgeText: string;
  badgeColor: string;
  mainTitlePrefix: string;
  mainTitleHighlight: string;
  mainTitleSuffix: string;
  highlightColor: string;
  tickerBadge: string;
  tickerText: string;
  bannerBgTheme: string;
  navCards: NavCardConfigItem[];
}

