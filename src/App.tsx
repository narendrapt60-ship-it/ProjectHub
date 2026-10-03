import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectDetail } from './components/ProjectDetail';
import { TeamCollaborators } from './components/TeamCollaborators';
import { NotificationsCenter } from './components/NotificationsCenter';
import { ChatPage } from './components/ChatPage';
import { StudentProfile } from './components/StudentProfile';
import { UploadProjectModal } from './components/UploadProjectModal';
import { LoginModal } from './components/LoginModal';
import { InviteCollaboratorModal } from './components/InviteCollaboratorModal';
import { CreateTeamModal, CreateTeamInput } from './components/CreateTeamModal';
import { localStorageService } from './services/localStorageService';
import { ChatMessage, Project, Student, NotificationItem } from './types';
import { Lock, User, Trash2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'myProjects' | 'collaborators' | 'notifications' | 'profile' | 'detail'>(() =>
    localStorageService.getCurrentUser() ? 'dashboard' : 'landing'
  );
  const [detailReturnTab, setDetailReturnTab] = useState<typeof currentTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-greenschool');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  // LocalStorage-backed application state
  const [projects, setProjects] = useState<Project[]>(() => localStorageService.getProjects());
  const [students, setStudents] = useState<Student[]>(() => localStorageService.getStudents());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => localStorageService.getNotifications());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => localStorageService.getChatMessages());
  const [chatTarget, setChatTarget] = useState<NotificationItem | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | null>(() => localStorageService.getCurrentUser());

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [inviteModalConfig, setInviteModalConfig] = useState<{
    isOpen: boolean;
    targetStudent?: Student | null;
    targetProjectId?: string;
    defaultRole?: string;
  }>({ isOpen: false });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = localStorageService.subscribe(() => {
      setProjects(localStorageService.getProjects());
      setStudents(localStorageService.getStudents());
      setNotifications(localStorageService.getNotifications());
      setChatMessages(localStorageService.getChatMessages());
      setCurrentUser(localStorageService.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser && currentTab === 'myProjects') {
      setCurrentTab('landing');
    }
  }, [currentTab, currentUser]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((notification) =>
      !notification.recipientId || notification.recipientId === currentUser?.id
    );
  }, [notifications, currentUser]);

  const unreadNotifsCount = useMemo(() => {
    return visibleNotifications.filter((notification) => !notification.isRead).length;
  }, [visibleNotifications]);

  const myProjectsCount = useMemo(() => {
    if (!currentUser) return 0;
    return projects.filter((p) => p.author.id === currentUser.id || p.author.name === currentUser.name).length;
  }, [projects, currentUser]);

  const featuredProject = useMemo(() => {
    return projects.find((p) => p.id === 'proj-greenschool') || projects[0];
  }, [projects]);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Handlers
  const handleOpenProjectDetail = (projectId: string) => {
    if (!currentUser) {
      showToast('Akses dibatasi: Silakan login terlebih dahulu untuk melihat detail proyek!');
      setIsLoginModalOpen(true);
      return;
    }
    setDetailReturnTab(currentTab);
    setSelectedProjectId(projectId);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookmarkToggle = (projectId: string) => {
    if (!currentUser) {
      showToast('Akses dibatasi: Anda dalam mode melihat. Masuk atau daftar akun untuk menyimpan proyek favorit!');
      setIsLoginModalOpen(true);
      return;
    }
    const isNowSaved = localStorageService.toggleProjectBookmark(projectId, currentUser.id);
    showToast(isNowSaved ? 'Proyek berhasil disimpan ke koleksi favorit!' : 'Proyek dihapus dari favorit.');
  };

  const handleTriggerUpload = () => {
    if (!currentUser) {
      showToast('Akses dibatasi: Anda dalam mode melihat. Masuk atau daftar akun untuk mengunggah proyek baru!');
      setIsLoginModalOpen(true);
      return;
    }
    setIsUploadModalOpen(true);
  };

  const handleTriggerCreateTeam = () => {
    if (!currentUser) {
      showToast('Login terlebih dahulu untuk membuat tim baru.');
      setIsLoginModalOpen(true);
      return;
    }
    if (!projects.some((project) => project.author.id === currentUser.id)) {
      showToast('Unggah proyek terlebih dahulu sebelum membuat tim.');
      setIsUploadModalOpen(true);
      return;
    }
    setIsCreateTeamModalOpen(true);
  };

  const handleCreateTeam = (team: CreateTeamInput) => {
    if (!currentUser) return;
    const project = projects.find((item) => item.id === team.projectId && item.author.id === currentUser.id);
    if (!project) {
      showToast('Pilih proyek milikmu untuk membentuk tim.');
      return;
    }
    const openPositions = project.openPositions.map((position) => ({ ...position, skills: [...(position.skills ?? [])] }));
    team.roles.forEach(({ role, skills, count }) => {
      const existingPosition = openPositions.find((position) => position.role.toLowerCase() === role.toLowerCase());
      if (existingPosition) {
        existingPosition.count += count;
        existingPosition.skills = [...new Set([...(existingPosition.skills ?? []), ...skills])];
      } else {
        openPositions.push({ role, count, skills });
      }
    });
    localStorageService.saveProject({
      ...project,
      status: 'Mencari Anggota',
      openPositions
    });
    setDetailReturnTab('collaborators');
    setSelectedProjectId(project.id);
    setCurrentTab('detail');
    showToast(`Kebutuhan anggota tim diperbarui untuk proyek ${project.title}.`);
  };

  const handleTriggerInviteStudent = (student: Student) => {
    if (!currentUser) {
      showToast('Akses dibatasi: Anda dalam mode melihat. Masuk atau daftar akun untuk mengajak bergabung rekan tim!');
      setIsLoginModalOpen(true);
      return;
    }
    setInviteModalConfig({
      isOpen: true,
      targetStudent: student
    });
  };

  const handleTriggerJoinProject = (projId: string, roleName?: string) => {
    if (!currentUser) {
      showToast('Akses dibatasi: Silakan login terlebih dahulu untuk mengajukan bergabung ke tim!');
      setIsLoginModalOpen(true);
      return;
    }
    const isAuthorOfThisProject = projects.some(p => p.id === projId && (p.author.id === currentUser.id || p.author.name === currentUser.name));
    if (isAuthorOfThisProject) {
      showToast('Anda adalah pemilik proyek ini dan bertindak sebagai ketua tim.');
      return;
    }
    if (myProjectsCount > 0) {
      showToast('Akun Anda sudah mengunggah proyek aktif, sehingga tidak dapat mengajukan gabung tim.');
      return;
    }
    setInviteModalConfig({
      isOpen: true,
      targetProjectId: projId,
      defaultRole: roleName
    });
  };

  const handleSelectMyProjects = () => {
    if (!currentUser) {
      setCurrentTab('landing');
      return;
    }
    setCurrentTab('myProjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProjectConfirm = () => {
    if (!projectToDelete) return;
    const title = projectToDelete.title;
    const deleted = localStorageService.deleteProject(projectToDelete.id);
    if (deleted) {
      showToast(`Proyek "${title}" berhasil dihapus.`);
      if (currentTab === 'detail' && selectedProjectId === projectToDelete.id) {
        setCurrentTab(detailReturnTab);
      }
    }
    setProjectToDelete(null);
  };

  const handleViewStudentPortfolio = (student: Student) => {
    setViewingStudent(student);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishProject = async (newProject: Project) => {
    localStorageService.saveProject(newProject);
    showToast('Proyek baru berhasil dipublikasikan!');
    setDetailReturnTab(currentTab);
    setSelectedProjectId(newProject.id);
    setCurrentTab('detail');
  };

  const handleUpdateProject = (project: Project) => {
    localStorageService.saveProject(project);
    showToast('Perubahan proyek berhasil disimpan.');
  };

  const handleAddProjectComment = (projectId: string, body: string) => {
    if (!currentUser) return;
    const added = localStorageService.addProjectComment(projectId, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      body
    });
    if (added) showToast('Komentar berhasil disimpan.');
  };

  const handleLoginSuccess = (student: Student) => {
    localStorageService.setCurrentUser(student);
    setCurrentTab('dashboard');
    showToast(`Berhasil masuk! Selamat datang, ${student.name}.`);
  };

  const handleLogout = () => {
    localStorageService.setCurrentUser(null);
    setViewingStudent(null);
    showToast('Anda telah keluar akun (Mode Penjelajah).');
    setCurrentTab('landing');
  };

  const handleSendInvitation = async (payload: {
    studentName: string;
    targetStudentId?: string;
    projectId: string;
    projectTitle: string;
    role: string;
    message: string;
  }) => {
    const directInvitation = Boolean(payload.targetStudentId);
    const targetProject = projects.find((project) => project.id === payload.projectId);
    localStorageService.addNotification({
      type: directInvitation ? 'team_invitation' : 'team_request',
      title: directInvitation ? 'Undangan Kolaborasi Baru' : 'Pengajuan Bergabung Tim',
      message: directInvitation
        ? `${currentUser?.name || 'Siswa Rekan'} mengundang kamu ke ${payload.projectTitle} sebagai ${payload.role}: "${payload.message}"`
        : `${payload.studentName} mengajukan diri ke ${payload.projectTitle} sebagai ${payload.role}: "${payload.message}"`,
      timeAgo: 'Baru saja',
      senderId: currentUser?.id,
      senderName: currentUser?.name || 'Siswa Rekan',
      recipientId: payload.targetStudentId || targetProject?.author.id,
      senderRole: payload.role,
      senderAvatar: currentUser?.avatar,
      projectId: payload.projectId,
      projectTitle: payload.projectTitle,
      actionRequired: true,
      actionStatus: 'pending',
      isRead: false
    });
    showToast('Undangan kolaborasi berhasil dikirim.');
  };

  const handleUpdateNotifStatus = (notifId: string, status: 'accepted' | 'rejected') => {
    if (!currentUser) return;
    localStorageService.updateNotificationStatus(notifId, status, currentUser);
    showToast(status === 'accepted' ? 'Permintaan kolaborasi telah diterima!' : 'Permintaan telah ditolak.');
  };

  const handleMarkAllNotifsRead = () => {
    localStorageService.markAllNotificationsRead(currentUser?.id);
    showToast('Semua notifikasi telah ditandai sebagai dibaca.');
  };

  const handleReplyFeedback = (notification: NotificationItem) => {
    if (!currentUser) return;
    const peerId = notification.senderId && notification.senderId !== currentUser.id
      ? notification.senderId
      : `external:${notification.senderName.toLowerCase()}`;
    const conversationId = [currentUser.id, peerId].sort().join('::');
    localStorageService.ensureChatMessage(notification, currentUser, {
      recipientId: peerId,
      recipientName: notification.senderName,
      recipientAvatar: notification.senderAvatar
    });
    localStorageService.markChatRead(conversationId, currentUser.id);
    setSelectedConversationId(conversationId);
    setChatTarget(notification);
  };

  const handleSendChatMessage = (
    conversation: Pick<ChatMessage, 'conversationId' | 'recipientId' | 'recipientName' | 'recipientAvatar'>,
    body: string
  ) => {
    if (!currentUser) return;
    const message = localStorageService.sendChatMessage({
      ...conversation,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      body
    });
    localStorageService.addNotification({
      id: message.id,
      type: 'message_reply',
      title: 'Pesan baru',
      message: body,
      timeAgo: 'Baru saja',
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: conversation.recipientId,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      replyToId: chatTarget?.id,
      isRead: false
    });
    showToast(`Pesan dikirim ke ${conversation.recipientName}.`);
  };

  const handleMarkChatRead = (conversationId: string) => {
    if (currentUser) localStorageService.markChatRead(conversationId, currentUser.id);
  };

  const handleSendTeamMessage = (projectId: string, body: string) => {
    if (!currentUser) return;
    const project = projects.find((item) => item.id === projectId);
    if (!project || (project.author.id !== currentUser.id && !project.members.some((member) => member.id === currentUser.id))) {
      showToast('Hanya anggota proyek yang dapat mengirim pesan tim.');
      return;
    }
    localStorageService.sendChatMessage({
      conversationId: `team:${project.id}`,
      projectId: project.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: `team:${project.id}`,
      recipientName: project.teamName || project.title,
      body
    });
    showToast('Pesan tim tersimpan.');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    localStorageService.updateStudent(updatedStudent);
    showToast('Profil berhasil diperbarui.');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      
      {/* Real-time Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'profile') {
            setViewingStudent(null);
          }
          setCurrentTab(tab === 'landing' && currentUser ? 'dashboard' : tab);
        }}
        currentUser={currentUser}
        unreadCount={unreadNotifsCount}
        onOpenUploadModal={handleTriggerUpload}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        myProjectsCount={myProjectsCount}
        onSelectMyProjects={handleSelectMyProjects}
      />

      {/* Main Body Routing */}
      <main className="flex-1 pb-20 md:pb-8">
        <>
        {/* LANDING / HERO VIEW */}
        {currentTab === 'landing' && (
          <div className="space-y-6">
            {featuredProject ? (
              <HeroLanding
                onExploreClick={() => {
                  document.getElementById('projects-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                onOpenProjectDetail={handleOpenProjectDetail}
                featuredProject={featuredProject}
              />
            ) : (
              <div className="px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Belum ada proyek unggulan</h1>
                <p className="mt-2 text-sm text-slate-500">Daftar proyek akan tampil di bawah.</p>
              </div>
            )}
            {/* Quick Preview of Explorer on Landing page */}
            <div id="projects-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Karya Pilihan Siswa SMK
                </h2>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Lihat Semua Proyek (38+) →
                </button>
              </div>
              <ProjectGrid
                projects={projects}
                onSelectProject={handleOpenProjectDetail}
                onBookmarkToggle={handleBookmarkToggle}
                onOpenUploadModal={handleTriggerUpload}
                currentUserId={currentUser?.id}
                hideSearchAndFilters
                hideHeader
              />
            </div>
          </div>
        )}

        {/* DASHBOARD / EXPLORATION VIEW */}
        {currentTab === 'dashboard' && (
          <ProjectGrid
            projects={projects}
            onSelectProject={handleOpenProjectDetail}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenUploadModal={handleTriggerUpload}
            currentUserId={currentUser?.id}
          />
        )}

        {currentTab === 'myProjects' && currentUser && (
          <ProjectGrid
            projects={projects}
            onSelectProject={handleOpenProjectDetail}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenUploadModal={handleTriggerUpload}
            currentUserId={currentUser.id}
            initialShowMyProjects
          />
        )}

        {/* PROJECT DETAIL VIEW */}
        {currentTab === 'detail' && activeProject && (
          currentUser ? (
            <ProjectDetail
              key={activeProject.id}
              project={activeProject}
              onBack={() => setCurrentTab(detailReturnTab)}
              onBookmarkToggle={handleBookmarkToggle}
              onOpenInviteModal={handleTriggerJoinProject}
              onDeleteProject={(proj) => setProjectToDelete(proj)}
              onUpdateProject={handleUpdateProject}
              onAddComment={handleAddProjectComment}
              chatMessages={chatMessages}
              onSendTeamMessage={handleSendTeamMessage}
              currentUser={currentUser}
              currentUserId={currentUser.id}
              hasUploadedProject={myProjectsCount > 0}
            />
          ) : (
            /* Restricted Project Detail Screen for Guest */
            <div className="max-w-xl mx-auto my-16 px-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Login untuk Melihat Detail Proyek
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Detail lengkap, dokumen teknis, repositori, dan fitur live demo proyek ini hanya dapat diakses oleh pengguna yang telah login.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Login Sekarang
                  </button>
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* TEAM COLLABORATORS VIEW */}
        {currentTab === 'collaborators' && (
          <TeamCollaborators
            students={students}
            onInviteStudent={handleTriggerInviteStudent}
            onCreateTeam={handleTriggerCreateTeam}
            onViewStudentPortfolio={handleViewStudentPortfolio}
          />
        )}

        {/* NOTIFICATIONS & ACTIVITY CENTER */}
        {currentTab === 'notifications' && (
          currentUser ? (
            chatTarget ? (
              <ChatPage
                key={chatTarget.id}
                messages={chatMessages}
                currentUser={currentUser}
                initialConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
                onSendMessage={handleSendChatMessage}
                onMarkRead={handleMarkChatRead}
                onBack={() => setChatTarget(null)}
              />
            ) : (
              <NotificationsCenter
                notifications={visibleNotifications}
                onMarkAllAsRead={handleMarkAllNotifsRead}
                onUpdateStatus={handleUpdateNotifStatus}
                onOpenProjectDetail={handleOpenProjectDetail}
                onReplyFeedback={handleReplyFeedback}
                currentUserId={currentUser.id}
              />
            )
          ) : (
            /* Restricted Notification Screen for Guest */
            <div className="max-w-xl mx-auto my-16 px-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Akses Dibatasi: Mode Penjelajah
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Pusat aktivitas dan notifikasi tim hanya dapat diakses oleh akun siswa terdaftar. Masuk atau daftar akun untuk melihat pesan dan tim Anda.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Masuk / Daftar Akun
                  </button>
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Jelajahi Proyek Saja
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* STUDENT PROFILE & 2FA SECURITY */}
        {currentTab === 'profile' && (
          viewingStudent ? (
            <StudentProfile
              student={viewingStudent}
              projects={projects}
              onOpenProjectDetail={handleOpenProjectDetail}
              onUpdateStudent={handleUpdateStudent}
              onLogout={handleLogout}
              onDeleteProject={(proj) => setProjectToDelete(proj)}
              isOwner={currentUser?.id === viewingStudent.id}
              onBack={() => {
                setViewingStudent(null);
                setCurrentTab('collaborators');
              }}
            />
          ) : currentUser ? (
            <StudentProfile
              student={currentUser}
              projects={projects}
              onOpenProjectDetail={handleOpenProjectDetail}
              onUpdateStudent={handleUpdateStudent}
              onLogout={handleLogout}
              onDeleteProject={(proj) => setProjectToDelete(proj)}
              isOwner={true}
            />
          ) : (
            /* Restricted Profile Screen for Guest */
            <div className="max-w-xl mx-auto my-16 px-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Profil Siswa & Portofolio Digital
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Masuk ke akun Anda atau daftar baru untuk membuat portofolio digital, mengunggah karya kejuruan, dan mengatur profil keamanan.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Masuk / Daftar Akun
                  </button>
                  <button
                    onClick={() => setCurrentTab('collaborators')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Lihat Siswa Lain
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        </>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ProjectHub</span>
            <span>·</span>
            <span>Platform Kolaborasi & Portofolio Siswa SMK/SMA</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentTab('profile');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="text-slate-600 hover:text-slate-900"
            >
              Keamanan Akun
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <UploadProjectModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPublish={handlePublishProject}
        currentUser={currentUser}
      />

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        projects={projects.filter((project) => project.author.id === currentUser?.id)}
        onCreateTeam={handleCreateTeam}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <InviteCollaboratorModal
        isOpen={inviteModalConfig.isOpen}
        onClose={() => setInviteModalConfig({ isOpen: false })}
        targetStudent={inviteModalConfig.targetStudent}
        targetProjectId={inviteModalConfig.targetProjectId}
        defaultRole={inviteModalConfig.defaultRole}
        projects={projects}
        currentUser={currentUser}
        onSendInvitation={handleSendInvitation}
      />

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Proyek Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong className="text-slate-800 font-semibold">"{projectToDelete.title}"</strong>? Proyek ini akan dihapus secara permanen dari sistem.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteProjectConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
