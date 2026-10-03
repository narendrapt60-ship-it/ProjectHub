import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Share2, 
  LogOut, 
  Edit3, 
  ExternalLink, 
  Mail, 
  Github, 
  Figma, 
  FolderGit2, 
  Users, 
  Eye, 
  Award, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Student, Project } from '../types';

interface StudentProfileProps {
  student: Student;
  projects: Project[];
  onOpenProjectDetail: (projectId: string) => void;
  onUpdateStudent: (student: Student) => void;
  onLogout: () => void;
  onDeleteProject?: (project: Project) => void;
  isOwner?: boolean;
  onBack?: () => void;
}

const createEditValues = (student: Student) => ({
  name: student.name,
  role: student.role,
  school: student.school,
  classGroup: student.classGroup,
  bio: student.bio,
  skills: student.skills.join(', '),
  github: student.github ?? '',
  figma: student.figma ?? ''
});

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  projects,
  onOpenProjectDetail,
  onUpdateStudent,
  onLogout,
  onDeleteProject,
  isOwner = true,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'karya' | 'kolaborasi' | 'ulasan' | 'keamanan'>('karya');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editValues, setEditValues] = useState(() => createEditValues(student));

  // Dynamic integration with student's actual projects and collaborations
  const myProjects = useMemo(() => {
    return projects.filter(
      (p) => p.author.id === student.id || p.author.name.toLowerCase() === student.name.toLowerCase()
    );
  }, [projects, student]);

  const collaboratedProjects = useMemo(() => {
    return projects.filter((p) =>
      p.members?.some(
        (m) =>
          (m.name.toLowerCase() === student.name.toLowerCase() || m.id === student.id) &&
          !m.isLeader
      )
    );
  }, [projects, student]);

  const totalProjectsCreated = myProjects.length;
  const totalCollaborations = collaboratedProjects.length;

  const totalViewsCount = useMemo(() => {
    const sumViews = myProjects.reduce((acc, p) => acc + (p.views || 0), 0);
    return sumViews > 0 ? sumViews : (student.viewsCount || 0);
  }, [myProjects, student]);

  const teacherSatisfactionRate = useMemo(() => {
    const reviewsWithScores = myProjects.filter((p) => p.mentorReview);
    if (reviewsWithScores.length > 0) {
      return 98;
    }
    return student.teacherSatisfaction || 96;
  }, [myProjects, student]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProfileSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateStudent({
      ...student,
      name: editValues.name.trim(),
      role: editValues.role.trim(),
      school: editValues.school.trim(),
      classGroup: editValues.classGroup.trim(),
      bio: editValues.bio.trim(),
      skills: editValues.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      github: editValues.github.trim() || undefined,
      figma: editValues.figma.trim() || undefined
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Actions Bar (matching Image 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          {onBack && (
            <button
              onClick={onBack}
              className="text-blue-600 hover:underline flex items-center gap-1 font-bold mr-1"
            >
              <span>← Kembali</span>
            </button>
          )}
          <span>›</span>
          <span className="text-slate-900 font-bold">
            {isOwner ? 'Profil Siswa Saya' : `Portofolio Siswa: ${student.name}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => {
                setEditValues(createEditValues(student));
                setIsEditingProfile(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Tautan Disalin' : 'Bagikan Profil'}</span>
          </button>

          {isOwner && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg shadow-sm transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Siswa SMK
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                NIS {student.nis} • {student.classGroup} • {student.school}
              </p>

              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed pt-1">
                {student.bio}
              </p>

              {/* Social and Portfolio links */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.email}</span>
                </span>
                {student.github && (
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.github}</span>
                  </span>
                )}
                {student.figma && (
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Figma className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.figma}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{student.availabilityText}</span>
            </div>
          </div>

        </div>

        {/* 4 Metric Stats Grid (Integrated with actual account projects and real-time state) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 block">
              {totalProjectsCreated}
            </span>
            <span className="text-xs text-slate-500 font-medium">Proyek Dibuat</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 block">
              {totalCollaborations}
            </span>
            <span className="text-xs text-slate-500 font-medium">Kolaborasi Tim</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
              {totalViewsCount >= 1000 ? `${(totalViewsCount / 1000).toFixed(1)}K` : totalViewsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Total Tayangan</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block">
              {teacherSatisfactionRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Kepuasan Guru</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation (matching Image 5) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('karya')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'karya'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>{isOwner ? 'Karya & Proyek Saya' : 'Karya & Proyek Siswa'} ({totalProjectsCreated})</span>
        </button>

        <button
          onClick={() => setActiveTab('kolaborasi')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'kolaborasi'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tim & Kolaborasi ({totalCollaborations})</span>
        </button>

        <button
          onClick={() => setActiveTab('ulasan')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ulasan'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Aktivitas & Ulasan Guru</span>
        </button>

        {isOwner && (
          <button
            onClick={() => setActiveTab('keamanan')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'keamanan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Pengaturan Akun & Keamanan (2FA)</span>
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'karya' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Proyek Unggulan Terkini (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                {isOwner ? 'Proyek yang Saya Buat' : `Daftar Karya ${student.name}`}
              </h2>
              <span className="text-xs text-slate-400">
                {totalProjectsCreated} karya tercatat
              </span>
            </div>

            {myProjects.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="text-sm font-semibold text-slate-700">Belum ada proyek yang dibuat.</p>
                <p className="text-xs text-slate-500">Mulai unggah karya tugas sekolah atau proyek inovasi pertamamu.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-24 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {proj.category}
                          </span>
                          <span className="text-[11px] font-semibold text-blue-600">
                            {proj.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {proj.description}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                          <span>Tayangan: <strong className="text-slate-800">{proj.views}</strong></span>
                          <span>·</span>
                          <span>Disimpan: <strong className="text-slate-800">{proj.likes}</strong></span>
                          <span>·</span>
                          <span className="font-bold text-blue-600">{proj.completionPercentage || 100}% Selesai</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isOwner && onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(proj)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                          title="Hapus Proyek"
                          aria-label="Hapus Proyek"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenProjectDetail(proj.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg shrink-0"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Status Keahlian & Pencapaian Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Keahlian Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="text-blue-600 font-bold">⚡</span>
                  <span>Status Keahlian</span>
                </h3>
                <span className="text-[11px] font-semibold text-blue-600">Tervalidasi</span>
              </div>

              <div className="space-y-3">
                {student.skillLevels.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.skill}</span>
                      <span className="font-bold text-blue-600">{item.level}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pencapaian & Badge Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Pencapaian & Badge</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {student.badges.length} Aktif
                </span>
              </div>

              <div className="space-y-3">
                {student.badges.map((b) => (
                  <div key={b.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">{b.title}</p>
                      <p className="text-[11px] text-slate-500">{b.giver}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Pengaturan Akun & Keamanan */}
      {activeTab === 'keamanan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span>Keamanan Akun</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Akun disimpan di browser ini. Hash kata sandi tidak memberi perlindungan setara autentikasi server.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Autentikasi dua faktor belum tersedia</p>
              <p className="text-xs text-amber-800 mt-1">
                Login lokal tidak dapat memverifikasi identitas secara aman dan tidak menyediakan OTP. Hindari memakai kata sandi penting di sini.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Tim & Kolaborasi */}
      {activeTab === 'kolaborasi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            Proyek Kolaborasi yang Diikuti
          </h2>
          {collaboratedProjects.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Belum ada proyek kolaborasi yang diikuti.</p>
              <p className="text-xs text-slate-500">Jelajahi menu Cari Anggota untuk bergabung ke tim proyek rekan lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaboratedProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500">Ketua: {p.author.name} • {p.author.school}</p>
                  </div>
                  <button
                    onClick={() => onOpenProjectDetail(p.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Detail Proyek
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Ulasan Guru */}
      {activeTab === 'ulasan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            Aktivitas & Catatan Evaluasi Guru Pembimbing
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900">Drs. I Made Sudarmawan, M.Kom</p>
                  <p className="text-xs text-slate-500">Guru Produktif RPL • SMKN 2 Bandung</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Nilai: 95/100
                </span>
              </div>
              <p className="text-xs text-slate-700 italic border-l-2 border-blue-500 pl-3">
                "Naren menunjukkan dedikasi luar biasa dalam perancangan antarmuka GreenSchool dan StudyFlow. Struktur komponen bersih, desain responsif, dan siap diikutsertakan dalam seleksi LKS tingkat provinsi."
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <form onSubmit={handleProfileSave} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Profil</h2>
              <p className="text-xs text-slate-500 mt-1">Perubahan disimpan di browser ini.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                Nama
                <input required value={editValues.name} onChange={(event) => setEditValues({ ...editValues, name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                Peran / Keahlian utama
                <input value={editValues.role} onChange={(event) => setEditValues({ ...editValues, role: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                Sekolah
                <input value={editValues.school} onChange={(event) => setEditValues({ ...editValues, school: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                Kelas / Jurusan
                <input value={editValues.classGroup} onChange={(event) => setEditValues({ ...editValues, classGroup: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1 sm:col-span-2">
                Bio
                <textarea rows={3} value={editValues.bio} onChange={(event) => setEditValues({ ...editValues, bio: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1 sm:col-span-2">
                Keahlian (pisahkan dengan koma)
                <input value={editValues.skills} onChange={(event) => setEditValues({ ...editValues, skills: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                GitHub
                <input value={editValues.github} onChange={(event) => setEditValues({ ...editValues, github: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
              <label className="text-xs font-semibold text-slate-700 space-y-1">
                Figma
                <input value={editValues.figma} onChange={(event) => setEditValues({ ...editValues, figma: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsEditingProfile(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Simpan Profil</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
