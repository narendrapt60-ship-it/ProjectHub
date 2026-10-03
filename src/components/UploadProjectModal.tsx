import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Check, 
  Plus, 
  Smartphone, 
  Globe, 
  Cpu, 
  Gamepad2, 
  Palette, 
  Sparkles,
  Users
} from 'lucide-react';
import { Project, ProjectCategory, ProjectFeature, ProjectStatus, Student } from '../types';
import { images } from '../assets/imageUrls';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (project: Project) => Promise<void>;
  currentUser: Student | null;
}

const CATEGORY_OPTIONS: { label: string; value: ProjectCategory }[] = [
  { label: 'Mobile App', value: 'Mobile App' },
  { label: 'Web', value: 'Web App' },
  { label: 'AI / ML', value: 'AI / ML' },
  { label: 'Game', value: 'Game Dev' },
  { label: 'Desain / Poster', value: 'Desain' },
  { label: 'Lainnya', value: 'Lainnya' }
];

const SUBJECT_OPTIONS = [
  'Informatika (Pemrograman & Rekayasa Perangkat Lunak)',
  'Pemrograman Web & Perangkat Bergerak (PWPB)',
  'Basis Data & Cloud Systems',
  'Desain Komunikasi Visual (DKV)',
  'Teknik Komputer & Jaringan (TKJ)',
  'Mekatronika & Robotika Otomasi',
  'Seni Budaya & Kriya Kreatif'
];

export const UploadProjectModal: React.FC<UploadProjectModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Mobile App');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [features, setFeatures] = useState<ProjectFeature[]>([{ title: '', description: '' }]);
  const [status, setStatus] = useState<ProjectStatus>('Mencari Anggota');
  const [positions, setPositions] = useState<string[]>(['UI Designer', 'Frontend Developer']);
  const [newPositionInput, setNewPositionInput] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(images.studyflow);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [publishError, setPublishError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handleAddPosition = () => {
    if (newPositionInput.trim() && !positions.includes(newPositionInput.trim())) {
      setPositions([...positions, newPositionInput.trim()]);
      setNewPositionInput('');
    }
  };

  const handleRemovePosition = (idx: number) => {
    setPositions(positions.filter((_, i) => i !== idx));
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    setFeatures((current) => current.map((feature, featureIndex) =>
      featureIndex === index ? { ...feature, [field]: value } : feature));
  };

  const handleThumbnailUpload = async (file?: File) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setThumbnailError('Pilih file gambar PNG, JPG, atau WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setThumbnailError('Ukuran gambar maksimal 5 MB.');
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas tidak tersedia.');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      setSelectedThumbnail(canvas.toDataURL('image/jpeg', 0.82));
      setThumbnailError('');
    } catch {
      setThumbnailError('Gambar tidak dapat dibaca. Coba pilih file lain.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishError('');
    if (!title.trim()) {
      setPublishError('Mohon masukkan judul proyek.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      category,
      subject,
      description: description.trim() || 'Proyek inovasi yang dikembangkan secara kolaboratif.',
      status,
      completionPercentage: status === 'Proyek Selesai' ? 100 : status === 'Sedang Dikerjakan' ? 50 : 25,
      author: {
        id: currentUser?.id || 'student-naren',
        name: currentUser?.name || 'Naren Pratama',
        role: currentUser?.role || 'Project Lead',
        classGroup: currentUser?.classGroup || 'Kelas XI RPL',
        school: currentUser?.school || 'SMKN 2 Bandung',
        avatar: currentUser?.avatar || images.narenAvatar
      },
      thumbnail: selectedThumbnail,
      features: features
        .map((feature) => ({ title: feature.title.trim(), description: feature.description.trim() }))
        .filter((feature) => feature.title && feature.description),
      githubUrl: githubUrl.trim() || undefined,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      views: 1,
      likes: 1,
      savedByUsers: [],
      techStack: [...new Set(techStackInput.split(',').map((technology) => technology.trim()).filter(Boolean))],
      milestones: [
        {
          id: 'm-init',
          title: 'Perencanaan Fitur & Wireframing',
          status: 'in_progress',
          targetDate: 'Pekan Ini',
          note: 'Penyusunan backlog awal'
        }
      ],
      openPositions: positions.map((p) => ({
        role: p,
        count: 1,
        description: `Posisi ${p} untuk mempercepat pengembangan proyek.`
      })),
      members: [
        {
          id: `m-${Date.now()}`,
          name: currentUser?.name || 'Naren Pratama',
          role: 'Ketua / Project Lead',
          isLeader: true
        }
      ],
      documents: [],
      createdAt: new Date().toISOString()
    };

    setIsPublishing(true);
    setPublishError('');
    try {
      await onPublish(newProject);
      onClose();
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Proyek gagal dipublikasikan.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (matching Image 11) */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Unggah Proyek Sekolah Baru
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Siswa SMK
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Bagikan karya proyekmu, cari rekan tim, atau dokumentasikan untuk portofolio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Judul Proyek */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Judul Proyek <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Aplikasi Pendeteksi Sampah Otomatis (TrashAI)"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Kategori Proyek */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Kategori Proyek <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === cat.value
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mata Pelajaran Terkait */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Mata Pelajaran Terkait <span className="text-rose-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            >
              {SUBJECT_OPTIONS.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi Proyek */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Deskripsi Proyek <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan karya, fitur utama, dan masalah yang ingin diselesaikan oleh aplikasi/proyek ini..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-technologies" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Teknologi yang Digunakan
            </label>
            <input
              id="project-technologies"
              value={techStackInput}
              onChange={(event) => setTechStackInput(event.target.value)}
              placeholder="React, TypeScript, Firebase"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500">Pisahkan setiap teknologi dengan koma.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Fitur Unggulan</label>
              <button
                type="button"
                onClick={() => setFeatures((current) => [...current, { title: '', description: '' }])}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Fitur
              </button>
            </div>
            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]">
                <input
                  value={feature.title}
                  onChange={(event) => handleFeatureChange(index, 'title', event.target.value)}
                  placeholder="Nama fitur"
                  aria-label={`Nama fitur ${index + 1}`}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={feature.description}
                  onChange={(event) => handleFeatureChange(index, 'description', event.target.value)}
                  placeholder="Deskripsi singkat fitur"
                  aria-label={`Deskripsi fitur ${index + 1}`}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setFeatures((current) => current.filter((_, featureIndex) => featureIndex !== index))}
                  aria-label={`Hapus fitur ${index + 1}`}
                  className="justify-self-end rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <p className="text-[11px] text-slate-500">Fitur yang disimpan perlu memiliki nama dan deskripsi.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-github-url" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Repository GitHub
            </label>
            <input
              id="project-github-url"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/nama-proyek"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-live-demo-url" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Live Demo
            </label>
            <input
              id="project-live-demo-url"
              type="url"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
              placeholder="https://demo-proyekmu.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Status Proyek (3 Selectable Cards from Image 11) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Status Proyek <span className="text-rose-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: Mencari Anggota */}
              <div
                onClick={() => setStatus('Mencari Anggota')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  status === 'Mencari Anggota'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                    {status === 'Mencari Anggota' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    • Aktif
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">Mencari Anggota</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Buka peluang teman sekolah bergabung.
                </p>
              </div>

              {/* Option 2: Sedang Dikerjakan */}
              <div
                onClick={() => setStatus('Sedang Dikerjakan')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  status === 'Sedang Dikerjakan'
                    ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    {status === 'Sedang Dikerjakan' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </div>
                </div>
                <h4 className="font-bold text-xs text-slate-900">Sedang Dikerjakan</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Fokus pengembangan bersama tim saat ini.
                </p>
              </div>

              {/* Option 3: Proyek Selesai */}
              <div
                onClick={() => setStatus('Proyek Selesai')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  status === 'Proyek Selesai'
                    ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-400/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 flex items-center justify-center">
                    {status === 'Proyek Selesai' && <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                  </div>
                </div>
                <h4 className="font-bold text-xs text-slate-900">Proyek Selesai</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Karya siap pamer dan penilaian guru.
                </p>
              </div>

            </div>
          </div>

          {/* Posisi & Keahlian yang Dibutuhkan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Posisi & Keahlian yang Dibutuhkan:</span>
              </label>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {positions.length} Rekan
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {positions.map((pos, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <span>{pos}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePosition(idx)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newPositionInput}
                  onChange={(e) => setNewPositionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPosition();
                    }
                  }}
                  placeholder="+ Tambah Posisi"
                  className="px-2.5 py-1 text-xs border border-dashed border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 w-32"
                />
                {newPositionInput && (
                  <button
                    type="button"
                    onClick={handleAddPosition}
                    className="p-1 bg-blue-600 text-white rounded text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Unggah Thumbnail / Tangkapan Layar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Unggah Thumbnail / Tangkapan Layar
            </label>
            
            {/* Visual Presets Selector */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { name: 'StudyFlow UI', path: images.studyflow },
                { name: 'GreenSchool UI', path: images.greenschool },
                { name: 'GradeVision AI', path: images.gradevision },
                { name: 'MathHero Game', path: images.mathhero }
              ].map((preset, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => setSelectedThumbnail(preset.path)}
                  className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    selectedThumbnail === preset.path ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.path} alt={preset.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center truncate py-0.5 px-1">
                    {preset.name}
                  </span>
                </div>
              ))}
            </div>

            <label className="block border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 rounded-xl p-5 text-center transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  void handleThumbnailUpload(e.target.files?.[0]);
                  e.currentTarget.value = '';
                }}
              />
              <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Pilih gambar tangkapan layar proyek
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, atau WebP hingga 5 MB
              </p>
            </label>
            {thumbnailError && <p className="text-xs text-rose-600">{thumbnailError}</p>}
            <img
              src={selectedThumbnail}
              alt="Pratinjau thumbnail proyek"
              className="w-full max-h-52 object-cover rounded-lg border border-slate-200"
            />
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {publishError && <p role="alert" className="mr-auto text-xs text-rose-600">{publishError}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Menyimpan...' : 'Publikasikan Proyek'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
