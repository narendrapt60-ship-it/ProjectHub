export type ProjectCategory = 
  | 'Mobile App' 
  | 'Web App' 
  | 'AI / ML' 
  | 'Game Dev' 
  | 'Desain' 
  | 'IoT Hardware' 
  | 'Lainnya';

export type ProjectStatus = 
  | 'Mencari Anggota' 
  | 'Sedang Dikerjakan' 
  | 'Proyek Selesai';

export interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  targetDate: string;
  note?: string;
}

export interface MentorReview {
  mentorName: string;
  mentorTitle: string;
  school: string;
  score: number;
  maxScore: number;
  date: string;
  comment: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isLeader?: boolean;
  classGroup?: string;
}

export interface ProjectDocument {
  name: string;
  size: string;
  type: 'pdf' | 'zip' | 'figma' | 'doc';
  url: string;
  approved?: boolean;
}

export interface ProjectFeature {
  title: string;
  description: string;
  badge?: string;
}

export interface ProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  teamName?: string;
  teamDescription?: string;
  category: ProjectCategory;
  subject: string;
  description: string;
  detailedDescription?: string;
  status: ProjectStatus;
  completionPercentage: number;
  author: {
    id: string;
    name: string;
    role: string;
    classGroup: string;
    school: string;
    avatar?: string;
  };
  thumbnail: string;
  views: number;
  likes: number;
  savedByUsers: string[];
  techStack: string[];
  milestones: Milestone[];
  openPositions: {
    role: string;
    count: number;
    description?: string;
    targetClass?: string;
    skills?: string[];
  }[];
  members: ProjectMember[];
  documents: ProjectDocument[];
  mentorReview?: MentorReview;
  comments?: ProjectComment[];
  features?: ProjectFeature[];
  liveDemoUrl?: string;
  githubUrl?: string;
  metadata?: {
    license?: string;
    updatedAt?: string;
    targetUsers?: string;
  };
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  nis: string;
  classGroup: string;
  major: string;
  role: string;
  school: string;
  avatar: string;
  bio: string;
  skills: string[];
  projectsCount: number;
  collaborationsCount: number;
  viewsCount: number;
  teacherSatisfaction: number;
  availableForTeam: boolean;
  availabilityText: string;
  rating: number;
  github?: string;
  figma?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorType?: 'authenticator' | 'sms';
  skillLevels: {
    skill: string;
    level: number;
    isVerified?: boolean;
  }[];
  badges: {
    id: string;
    title: string;
    giver: string;
    active: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  type: 'team_request' | 'mentor_review' | 'team_invitation' | 'save_project' | 'document_update' | 'message_reply';
  title: string;
  message: string;
  timeAgo: string;
  senderId?: string;
  senderName: string;
  recipientId?: string;
  senderRole?: string;
  senderAvatar?: string;
  projectId?: string;
  projectTitle?: string;
  replyToId?: string;
  actionRequired?: boolean;
  actionStatus?: 'pending' | 'accepted' | 'rejected';
  score?: string;
  fileVersion?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  projectId?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  body: string;
  createdAt: string;
  sourceNotificationId?: string;
  isRead: boolean;
}

export interface TeamInvitePayload {
  studentId: string;
  projectId: string;
  role: string;
  message: string;
}
