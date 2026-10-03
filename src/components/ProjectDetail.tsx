import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  UserPlus, 
  Bookmark, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Download, 
  Star, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  Layers,
  Heart,
  Lock,
  Trash2,
  Edit3,
  Send,
  MessageCircle,
  X,
  Users
} from 'lucide-react';
import { ChatMessage, Project, ProjectFeature, Student } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onBookmarkToggle: (projectId: string) => void;
  onOpenInviteModal: (projectId: string, roleName?: string) => void;
  onDeleteProject?: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onAddComment: (projectId: string, body: string) => void;
  chatMessages: ChatMessage[];
  onSendTeamMessage: (projectId: string, body: string) => void;
  currentUser: Student;
  currentUserId?: string;
  hasUploadedProject?: boolean;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onBookmarkToggle,
  onOpenInviteModal,
  onDeleteProject,
  onUpdateProject,
  onAddComment,
  chatMessages,
  onSendTeamMessage,
  currentUser,
  currentUserId,
  hasUploadedProject = false
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'metrics' | 'mockup'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isTeamChatOpen, setIsTeamChatOpen] = useState(false);
  const [teamChatDraft, setTeamChatDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [editDraft, setEditDraft] = useState(() => ({
    title: project.title,
    description: project.description,
    status: project.status,
    completionPercentage: project.completionPercentage,
    techStack: project.techStack.join(', '),
    features: project.features?.length ? project.features : [],
    githubUrl: project.githubUrl ?? '',
    liveDemoUrl: project.liveDemoUrl ?? ''
  }));
  const isSaved = project.savedByUsers?.includes(currentUserId || '');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProjectSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateProject({
      ...project,
      title: editDraft.title.trim(),
      description: editDraft.description.trim(),
      status: editDraft.status,
      completionPercentage: editDraft.status === 'Proyek Selesai'
        ? 100
        : Math.min(100, Math.max(0, Number(editDraft.completionPercentage) || 0)),
      techStack: [...new Set(editDraft.techStack.split(',').map((technology) => technology.trim()).filter(Boolean))],
      features: editDraft.features
        .map((feature) => ({ title: feature.title.trim(), description: feature.description.trim() }))
        .filter((feature) => feature.title && feature.description),
      githubUrl: editDraft.githubUrl.trim() || undefined,
      liveDemoUrl: editDraft.liveDemoUrl.trim() || undefined
    });
    setIsEditingProject(false);
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = commentDraft.trim();
    if (!body) return;
    onAddComment(project.id, body);
    setCommentDraft('');
  };

  const isAuthorOfThisProject = Boolean(currentUserId && project.author.id === currentUserId);
  const canAccessTeamChat = isAuthorOfThisProject || project.members.some((member) => member.id === currentUser.id);
  const teamMessages = chatMessages
    .filter((message) => message.projectId === project.id)
    .sort((first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime());

  const handleTeamChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = teamChatDraft.trim();
    if (!body || !canAccessTeamChat) return;
    onSendTeamMessage(project.id, body);
    setTeamChatDraft('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">
            Dashboard
          </button>
          <span>›</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-sm">
            Detail Proyek
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan'}</span>
          </button>

          {isAuthorOfThisProject && onDeleteProject && (
            <button
              onClick={() => onDeleteProject(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-xs"
              title="Hapus Proyek Ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Proyek</span>
            </button>
          )}

          {isAuthorOfThisProject && (
            <button
              onClick={() => setIsEditingProject(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Proyek</span>
            </button>
          )}

          <button
            onClick={() => onOpenInviteModal(project.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Ajak Kolaborasi / Gabung Tim</span>
          </button>
        </div>
      </div>

      {/* Project Header Info */}
      <div className="space-y-3">
        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            • {project.category}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Tahap Pengembangan ({project.completionPercentage}%)
          </span>
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span>{project.views} tayangan</span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <Heart className="w-3.5 h-3.5 fill-rose-600" />
              {project.likes} suka
            </span>
          </div>
        </div>

        {/* Title & Short Description */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {project.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
          {project.description}
        </p>

        {/* Author Card Row */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.author.avatar ? (
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                {project.author.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{project.author.name}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Pelajar
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {project.author.classGroup} • {project.author.school}
              </p>
            </div>
          </div>

          <button
            onClick={() => onBookmarkToggle(project.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isSaved
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
            <span>{isSaved ? 'Tersimpan' : 'Simpan Proyek'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Browser / Device Mockup Screen */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Browser Top Window Chrome */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>

          {/* URL bar */}
          <div className="px-4 py-1 bg-white rounded-md text-xs font-mono text-slate-600 border border-slate-200 flex items-center gap-2 max-w-sm w-full justify-center">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">
              {project.liveDemoUrl?.replace('https://', '') || `${project.id}.projecthub.sch.id`}
            </span>
          </div>

          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            Protokol Sekolah Terenkripsi
          </div>
        </div>

        {/* Mockup Preview Content */}
        <div className="relative aspect-video sm:aspect-[21/9] max-h-[500px] bg-slate-950 overflow-hidden flex items-center justify-center">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Mockup Bottom Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Live Demo</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>PWA & Responsif • Siap Uji Coba</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Project Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Tentang Proyek */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              Tentang Proyek
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.detailedDescription || project.description}
            </p>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Kategori</span>
                <span className="font-semibold text-slate-800">{project.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Target Pengguna</span>
                <span className="font-semibold text-slate-800">{project.metadata?.targetUsers || 'Siswa & Guru'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Lisensi</span>
                <span className="font-semibold text-slate-800">{project.metadata?.license || 'MIT License'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Pembaruan</span>
                <span className="font-semibold text-slate-800">{project.metadata?.updatedAt || 'Terbaru'}</span>
              </div>
            </div>
          </div>

          {/* Fitur Unggulan */}
          {project.features && project.features.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                Fitur Unggulan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                    {feat.badge && (
                      <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teknologi yang Digunakan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              Teknologi yang Digunakan
            </h2>
            <p className="text-xs text-slate-500">
              Arsitektur modern dibangun dengan fokus pada performa cepat dan kehandalan di perangkat sekolah.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone & Progres Pengerjaan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                Milestone & Progres Pengerjaan
              </h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {project.completionPercentage}% Selesai
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${project.completionPercentage}%` }}
              />
            </div>

            <div className="divide-y divide-slate-100 pt-2">
              {project.milestones.map((m) => (
                <div key={m.id} className="py-3 flex items-start gap-3">
                  {m.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : m.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-spin duration-3000" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className={`text-xs sm:text-sm font-semibold ${m.status === 'completed' ? 'text-slate-800' : 'text-slate-900'}`}>
                        {m.title}
                      </p>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {m.targetDate}
                      </span>
                    </div>
                    {m.note && (
                      <p className="text-xs text-slate-500 mt-0.5">{m.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ulasan Pembimbing Guru */}
          {project.mentorReview && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                  Ulasan Pembimbing
                </h2>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{project.mentorReview.score}/{project.mentorReview.maxScore} Nilai Progres</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{project.mentorReview.mentorName}</p>
                    <p className="text-slate-500">{project.mentorReview.mentorTitle} • {project.mentorReview.school}</p>
                  </div>
                  <span className="text-slate-400">{project.mentorReview.date}</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-blue-500 pl-3 leading-relaxed">
                  "{project.mentorReview.comment}"
                </blockquote>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar (Members, Recruitment, Docs) (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Anggota Tim */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Anggota Tim</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">{project.members.length}/4 anggota</span>
                {canAccessTeamChat && (
                  <button onClick={() => setIsTeamChatOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Obrolan Tim
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {member.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{member.role}</p>
                    </div>
                  </div>
                  {member.isLeader && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                      Ketua
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Open Recruitment / Cari Rekan Tim */}
          {project.openPositions && project.openPositions.length > 0 && (
            <div className="bg-white rounded-xl border border-blue-200/80 p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10"></div>
              
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Cari Rekan Tim</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Butuh {project.openPositions.reduce((a, b) => a + b.count, 0)} Rekan
                </span>
              </div>

              {project.openPositions.map((pos, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{pos.role}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{pos.count} orang</span>
                  </div>
                  {pos.description && (
                    <p className="text-[11px] text-slate-600 leading-normal">
                      {pos.description}
                    </p>
                  )}
                  {pos.skills && pos.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pos.skills.map((skill) => <span key={skill} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">{skill}</span>)}
                    </div>
                  )}
                  {pos.targetClass && (
                    <p className="text-[10px] text-blue-600 font-medium">
                      {pos.targetClass}
                    </p>
                  )}

                  {isAuthorOfThisProject ? (
                    <div className="w-full mt-2 py-2 px-3 text-center text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Proyek Milik Anda (Ketua Tim)</span>
                    </div>
                  ) : hasUploadedProject ? (
                    <div className="space-y-1 mt-2">
                      <div className="w-full py-2 px-3 text-center text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Sudah Mengunggah Proyek</span>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center">
                        Tidak dapat mengajukan gabung tim proyek lain
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenInviteModal(project.id, pos.role)}
                      className="w-full mt-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>+ Ajukan Bergabung ke Tim Ini</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Berkas & Dokumen Proyek */}
          {project.documents && project.documents.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Berkas & Dokumen Proyek</span>
              </h3>

              <div className="space-y-2">
                {project.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 font-bold text-[10px] flex items-center justify-center border border-rose-200 shrink-0">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.size} • Disetujui Sekolah</p>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                      title="Unduh Berkas"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Diskusi Proyek</h2>
          <p className="text-xs text-slate-500 mt-1">Komentar tersimpan lokal di browser ini.</p>
        </div>
        <div className="space-y-3">
          {(project.comments ?? []).length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Belum ada komentar. Mulai diskusi tentang proyek ini.</p>
          ) : project.comments?.map((comment) => (
            <article key={comment.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{comment.authorName}</p>
                <time className="text-[11px] text-slate-400">{new Date(comment.createdAt).toLocaleString('id-ID')}</time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
            </article>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row gap-2 border-t border-slate-100 pt-4">
          <textarea
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            rows={2}
            maxLength={1000}
            placeholder={`Tulis komentar sebagai ${currentUser.name}`}
            className="min-h-12 flex-1 resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button type="submit" disabled={!commentDraft.trim()} className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="h-4 w-4" />
            Kirim
          </button>
        </form>
      </section>

      {isTeamChatOpen && canAccessTeamChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5">
          <section className="flex h-[min(680px,90dvh)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Users className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{project.teamName || `Tim ${project.title}`}</h2>
                  <p className="text-[11px] text-slate-500">{project.members.length} anggota · obrolan lokal</p>
                </div>
              </div>
              <button onClick={() => setIsTeamChatOpen(false)} aria-label="Tutup obrolan tim" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </header>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-slate-50 px-3 py-4 sm:px-5">
              {teamMessages.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada pesan. Mulai obrolan tim.</p>
              ) : teamMessages.map((message) => {
                const ownMessage = message.senderId === currentUser.id;
                return (
                  <div key={message.id} className={`flex ${ownMessage ? 'justify-end' : 'justify-start'}`}>
                    <article className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm ${ownMessage ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'}`}>
                      {!ownMessage && <p className="mb-1 text-[10px] font-bold text-blue-700">{message.senderName}</p>}
                      <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                      <time className={`mt-1 block text-right text-[10px] ${ownMessage ? 'text-blue-100' : 'text-slate-400'}`}>{new Date(message.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</time>
                    </article>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleTeamChatSubmit} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 sm:px-4">
              <textarea value={teamChatDraft} onChange={(event) => setTeamChatDraft(event.target.value)} rows={1} maxLength={2000} placeholder="Tulis pesan untuk tim" className="max-h-28 min-h-11 flex-1 resize-y rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
              <button type="submit" disabled={!teamChatDraft.trim()} aria-label="Kirim pesan ke tim" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"><Send className="h-4 w-4" /></button>
            </form>
          </section>
        </div>
      )}

      {isEditingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleProjectSave} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Proyek</h2>
              <p className="mt-1 text-xs text-slate-500">Perubahan disimpan di browser ini.</p>
            </div>
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              Judul
              <input required value={editDraft.title} onChange={(event) => setEditDraft({ ...editDraft, title: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              Deskripsi
              <textarea required rows={4} value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              Teknologi yang Digunakan (pisahkan dengan koma)
              <input value={editDraft.techStack} onChange={(event) => setEditDraft({ ...editDraft, techStack: event.target.value })} placeholder="React, TypeScript, Firebase" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">Fitur Unggulan</span>
                <button type="button" onClick={() => setEditDraft({ ...editDraft, features: [...editDraft.features, { title: '', description: '' }] })} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50">Tambah Fitur</button>
              </div>
              {editDraft.features.map((feature, index) => (
                <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={feature.title} onChange={(event) => setEditDraft({ ...editDraft, features: editDraft.features.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} placeholder="Nama fitur" aria-label={`Nama fitur ${index + 1}`} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
                  <div className="flex gap-2">
                    <input value={feature.description} onChange={(event) => setEditDraft({ ...editDraft, features: editDraft.features.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} placeholder="Deskripsi fitur" aria-label={`Deskripsi fitur ${index + 1}`} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
                    <button type="button" onClick={() => setEditDraft({ ...editDraft, features: editDraft.features.filter((_, itemIndex) => itemIndex !== index) })} aria-label={`Hapus fitur ${index + 1}`} className="rounded-lg px-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">×</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                Status
                <select value={editDraft.status} onChange={(event) => setEditDraft({ ...editDraft, status: event.target.value as Project['status'] })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal">
                  <option>Mencari Anggota</option>
                  <option>Sedang Dikerjakan</option>
                  <option>Proyek Selesai</option>
                </select>
              </label>
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                Progres (%)
                <input type="number" min="0" max="100" value={editDraft.completionPercentage} onChange={(event) => setEditDraft({ ...editDraft, completionPercentage: Number(event.target.value) })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                GitHub URL
                <input type="url" value={editDraft.githubUrl} onChange={(event) => setEditDraft({ ...editDraft, githubUrl: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                Live demo URL
                <input type="url" value={editDraft.liveDemoUrl} onChange={(event) => setEditDraft({ ...editDraft, liveDemoUrl: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsEditingProject(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
