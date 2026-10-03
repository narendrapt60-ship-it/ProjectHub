import React, { useState, useMemo } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Eye, 
  Bookmark, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Clock, 
  Filter,
  Plus
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus } from '../types';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onBookmarkToggle: (projectId: string) => void;
  onOpenUploadModal: () => void;
  currentUserId?: string;
  initialShowMyProjects?: boolean;
  hideSearchAndFilters?: boolean;
  hideHeader?: boolean;
}

const CATEGORIES: { label: string; value: 'all' | ProjectCategory }[] = [
  { label: 'Semua Kategori', value: 'all' },
  { label: 'Mobile App', value: 'Mobile App' },
  { label: 'Web App', value: 'Web App' },
  { label: 'AI / ML', value: 'AI / ML' },
  { label: 'Game Dev', value: 'Game Dev' },
  { label: 'Desain', value: 'Desain' },
  { label: 'IoT Hardware', value: 'IoT Hardware' }
];

const STATUS_FILTERS: { label: string; value: 'all' | ProjectStatus }[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Mencari Anggota', value: 'Mencari Anggota' },
  { label: 'Sedang Dikerjakan', value: 'Sedang Dikerjakan' },
  { label: 'Proyek Selesai', value: 'Proyek Selesai' }
];

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onBookmarkToggle,
  onOpenUploadModal,
  currentUserId,
  initialShowMyProjects = false,
  hideSearchAndFilters = false,
  hideHeader = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProjectStatus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMyProjects, setFilterMyProjects] = useState(initialShowMyProjects);
  const itemsPerPage = 6;

  const myProjectsCount = useMemo(() => {
    if (!currentUserId) return 0;
    return projects.filter((p) => p.author.id === currentUserId).length;
  }, [projects, currentUserId]);

  const projectSummary = useMemo(() => ({
    total: projects.length,
    recruiting: projects.filter((project) => project.status === 'Mencari Anggota').length,
    inProgress: projects.filter((project) => project.status === 'Sedang Dikerjakan').length,
    completed: projects.filter((project) => project.status === 'Proyek Selesai').length
  }), [projects]);

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      if (filterMyProjects && currentUserId && item.author.id !== currentUserId) {
        return false;
      }
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStat = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStat;
    }).sort((first, second) => {
      if (sortBy === 'views') return second.views - first.views;
      if (sortBy === 'likes') return second.likes - first.likes;
      if (sortBy === 'title') return first.title.localeCompare(second.title, 'id');
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus, filterMyProjects, currentUserId, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const getStatusBadge = (status: ProjectStatus, openPositionsCount: number) => {
    if (status === 'Mencari Anggota') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Butuh {openPositionsCount || 1} Rekan</span>
        </span>
      );
    }
    if (status === 'Sedang Dikerjakan') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
          <span>Dikerjakan</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        <CheckCircle2 className="w-3 h-3 text-slate-500" />
        <span>Selesai</span>
      </span>
    );
  };

  const getCategoryBadgeClass = (category: ProjectCategory) => {
    switch (category) {
      case 'Mobile App':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Web App':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AI / ML':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Game Dev':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Desain':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'IoT Hardware':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {!initialShowMyProjects && !hideHeader && (
        <section aria-label="Ringkasan proyek" className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200 border-y border-slate-200 bg-white">
          {[
            { label: 'Semua Proyek', value: projectSummary.total, color: 'text-slate-900' },
            { label: 'Mencari Anggota', value: projectSummary.recruiting, color: 'text-emerald-700' },
            { label: 'Sedang Dikerjakan', value: projectSummary.inProgress, color: 'text-blue-700' },
            { label: 'Selesai', value: projectSummary.completed, color: 'text-slate-700' }
          ].map((item) => (
            <div key={item.label} className="px-4 py-3 sm:px-5">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Title & Section Header */}
      {!hideHeader && (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {initialShowMyProjects ? 'Proyek Saya' : 'Semua Karya Inovatif'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {initialShowMyProjects
              ? 'Kelola dan lihat semua proyek yang kamu buat.'
              : 'Menampilkan proyek terkini dari berbagai keahlian siswa.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Tampilan Grid"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="Tampilan List"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Proyek Baru</span>
          </button>
        </div>
      </div>
      )}

      {/* Search and Filters Bar */}
      {!initialShowMyProjects && !hideSearchAndFilters && (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama proyek, keahlian, teknologi (contoh: Flutter, React, AI), atau nama siswa..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <label htmlFor="project-sort" className="text-xs font-semibold text-slate-500">Urutkan:</label>
          <select
            id="project-sort"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as typeof sortBy);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="newest">Terbaru</option>
            <option value="views">Tayangan terbanyak</option>
            <option value="likes">Paling disukai</option>
            <option value="title">Nama A-Z</option>
          </select>
        </div>

        {/* Filter categories pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Kategori:
          </span>

          {myProjectsCount > 0 && (
            <button
              onClick={() => {
                setFilterMyProjects(!filterMyProjects);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterMyProjects
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span>⭐ Proyek Saya</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filterMyProjects ? 'bg-white text-blue-600' : 'bg-blue-200/80 text-blue-800'
              }`}>
                {myProjectsCount}
              </span>
            </button>
          )}

          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1">Status:</span>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st.value}
              onClick={() => {
                setSelectedStatus(st.value);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedStatus === st.value
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Projects Grid or List */}
      {paginatedProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-700">
            {initialShowMyProjects ? 'Kamu belum memiliki proyek.' : 'Tidak ada proyek yang sesuai dengan filter.'}
          </p>
          <p className="text-xs text-slate-500">
            {initialShowMyProjects ? 'Unggah proyek pertamamu untuk mulai membangun portofolio.' : 'Coba ubah kata kunci pencarian atau reset kategori.'}
          </p>
          {initialShowMyProjects ? (
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Unggah Proyek
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => {
            const hasSaved = project.savedByUsers?.includes(currentUserId || '');
            const openPosCount = project.openPositions.reduce((acc, pos) => acc + pos.count, 0);

            return (
              <div
                key={project.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col hover:border-slate-300"
              >
                {/* Card Thumbnail Container */}
                <div 
                  onClick={() => onSelectProject(project.id)}
                  className="relative aspect-video bg-slate-100 cursor-pointer overflow-hidden"
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Chip (Top Left) */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm shadow-sm ${getCategoryBadgeClass(project.category)}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Status Chip (Top Right) */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status, openPosCount)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-2">
                    {/* Author Row */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {project.author.avatar ? (
                        <img
                          src={project.author.avatar}
                          alt={project.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          {project.author.name[0]}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800 truncate">{project.author.name}</span>
                      <span>·</span>
                      <span className="truncate">{project.author.classGroup}</span>
                      {currentUserId && project.author.id === currentUserId && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                          Proyek Saya
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProject(project.id)}
                      className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-400 text-[11px]">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Meta: Views, Bookmark, Detail CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.views}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookmarkToggle(project.id);
                        }}
                        className={`flex items-center gap-1 transition-colors ${
                          hasSaved ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Simpan ke favorit"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${hasSaved ? 'fill-blue-600' : ''}`} />
                        <span>{project.likes}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 text-xs transition-colors"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {paginatedProjects.map((project) => {
            const hasSaved = project.savedByUsers?.includes(currentUserId || '');
            const openPosCount = project.openPositions.reduce((acc, pos) => acc + pos.count, 0);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-20 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getCategoryBadgeClass(project.category)}`}>
                        {project.category}
                      </span>
                      {getStatusBadge(project.status, openPosCount)}
                      {currentUserId && project.author.id === currentUserId && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                          Proyek Saya
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 truncate hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-xl">
                      {project.description}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Oleh <span className="font-semibold text-slate-600">{project.author.name}</span> ({project.author.school})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{project.views}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className={`w-3.5 h-3.5 ${hasSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                      <span>{project.likes}</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar (matching image) */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 text-xs text-slate-600">
        <div>
          <span>Menampilkan </span>
          <span className="font-bold text-slate-900">
            {paginatedProjects.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredProjects.length)}
          </span>
          <span> dari </span>
          <span className="font-bold text-slate-900">{filteredProjects.length} Proyek</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            ‹ Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Berikutnya ›
          </button>
        </div>
      </div>

    </div>
  );
};
