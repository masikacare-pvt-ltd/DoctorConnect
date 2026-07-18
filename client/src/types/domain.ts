export type UserRole = 'doctor' | 'admin';
export type AccountStatus = 'active' | 'disabled';

export interface UserAccount {
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: AccountStatus;
  verified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
  avatarData: string;
  gender: string;
  designation: string;
  specializationId: string;
  hospital: string;
  mobile: string;
  bio: string;
  credentials: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Specialization {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export type CaseStatus = 'open' | 'resolved';

export interface ClinicalCase {
  id: string;
  caseNumber: string;
  title: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  specializationId: string;
  category: string;
  description: string;
  urgent: boolean;
  diseaseTags: string[];
  caseQuote: string;
  status: CaseStatus;
  coverImage: string;
  aiReportId: string | null;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseImage {
  id: string;
  caseId: string;
  uploadedBy: string;
  imageData?: string;
  downloadURL: string;
  thumbnailURL: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface CaseComment {
  id: string;
  caseId: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  attachmentName: string | null;
  createdAt: string;
}

export type NotificationType = 'comment' | 'bookmark' | 'mention' | 'ai_complete' | 'system';
export type NotificationRead = boolean;

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  caseId: string | null;
  fromUid: string | null;
  fromName: string | null;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface Bookmark {
  caseId: string;
  caseTitle: string;
  caseCover: string;
  authorName: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  digestEnabled: boolean;
}

export type AiSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AiStatus = 'pending' | 'completed' | 'failed';

export interface AiFinding {
  label: string;
  detail: string;
}

export interface AiReport {
  id: string;
  caseId: string;
  generatedBy: 'groq';
  model: string;
  promptVersion: string;
  status: AiStatus;
  confidence: number;
  findings: AiFinding[];
  differentialDiagnosis: string[];
  recommendations: string[];
  severity: AiSeverity;
  disclaimer: string;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
}

export interface AppSettings {
  aiModel: string;
  features: Record<string, boolean>;
  updatedAt: string;
}

export type ThemeMode = 'light' | 'dark';

export type SortMode = 'Newest' | 'Oldest' | 'Most Commented';
