import { INITIAL_NOTIFICATIONS, INITIAL_PROJECTS, INITIAL_STUDENTS } from '../data/initialData';
import { ChatMessage, NotificationItem, Project, ProjectComment, Student } from '../types';
import { resolveImageUrl } from '../assets/imageUrls';

const STORAGE_KEYS = {
  projects: 'projecthub.projects',
  students: 'projecthub.students',
  notifications: 'projecthub.notifications',
  currentUserId: 'projecthub.currentUserId',
  credentials: 'projecthub.credentials',
  chatMessages: 'projecthub.chatMessages'
} as const;

type Credential = { studentId: string; passwordHash: string };

const hashPassword = async (password: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value) as T;
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('projecthub:change'));
};

const createId = (prefix: string) => {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${id}`;
};

const getProjects = (): Project[] => read<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS).map((project) => ({
  ...project,
  thumbnail: resolveImageUrl(project.thumbnail),
  author: { ...project.author, avatar: resolveImageUrl(project.author.avatar) },
  members: project.members.map((member) => ({ ...member, avatar: resolveImageUrl(member.avatar) }))
}));
const getStudents = (): Student[] => read<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS).map((student) => ({
  ...student,
  avatar: resolveImageUrl(student.avatar)
}));
const getNotifications = (): NotificationItem[] => read<NotificationItem[]>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS).map((notification) => ({
  ...notification,
  senderAvatar: resolveImageUrl(notification.senderAvatar)
}));
const getCredentials = (): Credential[] => read(STORAGE_KEYS.credentials, []);
const getChatMessages = (): ChatMessage[] => read(STORAGE_KEYS.chatMessages, []);
const getConversationId = (firstId: string, secondId: string) => [firstId, secondId].sort().join('::');

const localStorageService = {
  getProjects,
  getStudents,
  getNotifications,
  getChatMessages,

  ensureChatMessage(notification: NotificationItem, currentUser: Student, peer: Pick<ChatMessage, 'recipientId' | 'recipientName' | 'recipientAvatar'>) {
    if (getChatMessages().some((message) => message.sourceNotificationId === notification.id)) return;
    const isOutgoing = notification.senderId === currentUser.id;
    const senderId = isOutgoing ? currentUser.id : notification.senderId ?? peer.recipientId;
    const senderName = isOutgoing ? currentUser.name : notification.senderName;
    const senderAvatar = isOutgoing ? currentUser.avatar : notification.senderAvatar;
    const recipientId = isOutgoing ? peer.recipientId : currentUser.id;
    const recipientName = isOutgoing ? peer.recipientName : currentUser.name;
    const recipientAvatar = isOutgoing ? peer.recipientAvatar : currentUser.avatar;
    const conversationId = getConversationId(currentUser.id, peer.recipientId);
    const message: ChatMessage = {
      id: createId('message'),
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      recipientId,
      recipientName,
      recipientAvatar,
      body: notification.message,
      createdAt: notification.createdAt,
      sourceNotificationId: notification.id,
      isRead: isOutgoing
    };
    write(STORAGE_KEYS.chatMessages, [...getChatMessages(), message]);
  },

  sendChatMessage(input: Omit<ChatMessage, 'id' | 'createdAt' | 'conversationId' | 'isRead'> & { conversationId?: string }) {
    const id = createId('message');
    const message: ChatMessage = {
      ...input,
      id,
      sourceNotificationId: id,
      conversationId: input.conversationId ?? getConversationId(input.senderId, input.recipientId),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    write(STORAGE_KEYS.chatMessages, [...getChatMessages(), message]);
    return message;
  },

  markChatRead(conversationId: string, recipientId: string) {
    const messages = getChatMessages();
    const readMessageIds = new Set(messages
      .filter((message) => message.conversationId === conversationId && message.recipientId === recipientId)
      .map((message) => message.sourceNotificationId)
      .filter((id): id is string => Boolean(id)));
    write(STORAGE_KEYS.chatMessages, messages.map((message) =>
      message.conversationId === conversationId && message.recipientId === recipientId
        ? { ...message, isRead: true }
        : message));
    if (readMessageIds.size > 0) {
      write(STORAGE_KEYS.notifications, getNotifications().map((notification) =>
        readMessageIds.has(notification.id) ? { ...notification, isRead: true } : notification));
    }
  },

  getCurrentUser(): Student | null {
    const id = localStorage.getItem(STORAGE_KEYS.currentUserId);
    return id ? getStudents().find((student) => student.id === id) ?? null : null;
  },

  setCurrentUser(student: Student | null) {
    if (student) localStorage.setItem(STORAGE_KEYS.currentUserId, student.id);
    else localStorage.removeItem(STORAGE_KEYS.currentUserId);
    window.dispatchEvent(new Event('projecthub:change'));
  },

  subscribe(listener: () => void) {
    window.addEventListener('projecthub:change', listener);
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('projecthub:change', listener);
      window.removeEventListener('storage', listener);
    };
  },

  async login(email: string, password: string): Promise<Student> {
    const student = getStudents().find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    const credential = getCredentials().find((item) => item.studentId === student?.id);
    const demoPasswords: Record<string, string> = {
      'student-naren': 'Naren',
      'student-siti': 'Siti',
      'student-budi': 'Budi'
    };

    const isValid = credential
      ? credential.passwordHash === await hashPassword(password)
      : demoPasswords[student?.id ?? ''] === password;
    if (!student || !isValid) {
      throw new Error('Email atau kata sandi tidak sesuai.');
    }
    return student;
  },

  async register(input: {
    name: string;
    email: string;
    nis: string;
    school: string;
    classGroup: string;
    password: string;
  }): Promise<Student> {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    if (!name || !email || !input.password) throw new Error('Lengkapi nama, email, dan kata sandi.');
    if (input.password.length < 10) throw new Error('Kata sandi harus terdiri dari minimal 10 karakter.');
    if (getStudents().some((student) => student.email.toLowerCase() === email)) {
      throw new Error('Email tersebut sudah terdaftar. Silakan masuk.');
    }

    const student: Student = {
      id: createId('student'),
      name,
      email,
      nis: input.nis.trim(),
      classGroup: input.classGroup.trim(),
      major: 'Belum ditentukan',
      role: 'Siswa',
      school: input.school.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
      bio: '',
      skills: [],
      projectsCount: 0,
      collaborationsCount: 0,
      viewsCount: 0,
      teacherSatisfaction: 0,
      availableForTeam: true,
      availabilityText: 'Tersedia untuk Kolaborasi',
      rating: 0,
      twoFactorEnabled: false,
      skillLevels: [],
      badges: []
    };

    write(STORAGE_KEYS.students, [...getStudents(), student]);
    write(STORAGE_KEYS.credentials, [...getCredentials(), {
      studentId: student.id,
      passwordHash: await hashPassword(input.password)
    }]);
    return student;
  },

  saveProject(project: Project) {
    const projects = getProjects();
    const index = projects.findIndex((item) => item.id === project.id);
    if (index < 0) write(STORAGE_KEYS.projects, [project, ...projects]);
    else write(STORAGE_KEYS.projects, projects.map((item) => item.id === project.id ? project : item));
  },

  addProjectComment(projectId: string, comment: Omit<ProjectComment, 'id' | 'createdAt'>) {
    const project = getProjects().find((item) => item.id === projectId);
    if (!project) return false;
    this.saveProject({
      ...project,
      comments: [...(project.comments ?? []), {
        ...comment,
        id: createId('comment'),
        createdAt: new Date().toISOString()
      }]
    });
    return true;
  },

  deleteProject(projectId: string): boolean {
    const projects = getProjects();
    const updated = projects.filter((project) => project.id !== projectId);
    if (updated.length === projects.length) return false;
    write(STORAGE_KEYS.projects, updated);
    return true;
  },

  toggleProjectBookmark(projectId: string, studentId: string): boolean {
    let isSaved = false;
    const projects = getProjects().map((project) => {
      if (project.id !== projectId) return project;
      const savedByUsers = project.savedByUsers ?? [];
      isSaved = !savedByUsers.includes(studentId);
      return {
        ...project,
        savedByUsers: isSaved
          ? [...savedByUsers, studentId]
          : savedByUsers.filter((id) => id !== studentId),
        likes: Math.max(0, project.likes + (isSaved ? 1 : -1))
      };
    });
    write(STORAGE_KEYS.projects, projects);
    return isSaved;
  },

  addNotification(notification: Omit<NotificationItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) {
    const createdAt = notification.createdAt ?? new Date().toISOString();
    const created = { ...notification, id: notification.id ?? createId('notif'), createdAt };
    write(STORAGE_KEYS.notifications, [created, ...getNotifications()]);
    return created;
  },

  updateNotificationStatus(notificationId: string, status: 'accepted' | 'rejected', currentUser: Student) {
    const notification = getNotifications().find((item) => item.id === notificationId);
    write(STORAGE_KEYS.notifications, getNotifications().map((item) => item.id === notificationId
      ? { ...item, actionStatus: status, actionRequired: false, isRead: true }
      : item));

    if (status !== 'accepted' || !notification?.projectId) return;
    const project = getProjects().find((item) => item.id === notification.projectId);
    if (!project) return;

    const joiningStudentId = notification.type === 'team_invitation' ? currentUser.id : notification.senderId;
    const joiningStudent = getStudents().find((item) => item.id === joiningStudentId);
    if (!joiningStudent || project.members.some((member) => member.id === joiningStudent.id)) return;
    const role = notification.senderRole ?? 'Anggota Tim';
    const openPositions = project.openPositions.map((position) => position.role === role
      ? { ...position, count: Math.max(0, position.count - 1) }
      : position).filter((position) => position.count > 0);
    const members = [...project.members, {
      id: joiningStudent.id,
      name: joiningStudent.name,
      role,
      avatar: joiningStudent.avatar,
      classGroup: joiningStudent.classGroup
    }];
    this.saveProject({ ...project, members, openPositions });
  },

  markAllNotificationsRead(recipientId?: string) {
    write(STORAGE_KEYS.notifications, getNotifications().map((notification) =>
      !recipientId || !notification.recipientId || notification.recipientId === recipientId
        ? { ...notification, isRead: true }
        : notification));
  },

  updateStudent(student: Student) {
    const students = getStudents();
    const exists = students.some((item) => item.id === student.id);
    write(STORAGE_KEYS.students, exists
      ? students.map((item) => item.id === student.id ? student : item)
      : [...students, student]);
    write(STORAGE_KEYS.projects, getProjects().map((project) => ({
      ...project,
      author: project.author.id === student.id
        ? { ...project.author, name: student.name, role: student.role, classGroup: student.classGroup, school: student.school, avatar: student.avatar }
        : project.author,
      members: project.members.map((member) => member.id === student.id
        ? { ...member, name: student.name, classGroup: student.classGroup, avatar: student.avatar }
        : member)
    })));
    write(STORAGE_KEYS.notifications, getNotifications().map((notification) => notification.senderId === student.id
      ? { ...notification, senderName: student.name, senderAvatar: student.avatar }
      : notification));
  }
};

export { localStorageService };