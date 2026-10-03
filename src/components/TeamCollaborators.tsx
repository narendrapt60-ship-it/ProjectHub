import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  Star, 
  FolderGit2, 
  Users, 
  Lightbulb, 
  Check, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Student } from '../types';

interface TeamCollaboratorsProps {
  students: Student[];
  onInviteStudent: (student: Student) => void;
  onCreateTeam: () => void;
  onViewStudentPortfolio: (student: Student) => void;
}

const SKILL_DOMAINS = [
  'Semua Keahlian',
  'UI/UX & Desain',
  'Frontend & Web',
  'Mobile Dev',
  'Backend & Database',
  'AI / Machine Learning',
  'IoT & Hardware'
];

export const TeamCollaborators: React.FC<TeamCollaboratorsProps> = ({
  students,
  onInviteStudent,
  onCreateTeam,
  onViewStudentPortfolio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Semua Keahlian');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [selectedAvailability, setSelectedAvailability] = useState('Semua Ketersediaan');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(q) ||
        student.role.toLowerCase().includes(q) ||
        student.skills.some((s) => s.toLowerCase().includes(q)) ||
        student.school.toLowerCase().includes(q) ||
        student.classGroup.toLowerCase().includes(q);

      let matchesDomain = true;
      if (selectedDomain === 'UI/UX & Desain') {
        matchesDomain = student.skills.some((s) => ['Figma', 'Wireframing', 'Illustrator', 'Design System'].includes(s));
      } else if (selectedDomain === 'Frontend & Web') {
        matchesDomain = student.skills.some((s) => ['React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'HTML5 Canvas'].includes(s));
      } else if (selectedDomain === 'Mobile Dev') {
        matchesDomain = student.skills.some((s) => ['Flutter', 'Dart', 'Firebase', 'SQLite'].includes(s));
      } else if (selectedDomain === 'Backend & Database') {
        matchesDomain = student.skills.some((s) => ['FastAPI', 'PostgreSQL', 'SQLite', 'Firebase'].includes(s));
      } else if (selectedDomain === 'AI / Machine Learning') {
        matchesDomain = student.skills.some((s) => ['Python', 'Scikit-Learn', 'FastAPI', 'Data Analytics'].includes(s));
      } else if (selectedDomain === 'IoT & Hardware') {
        matchesDomain = student.skills.some((s) => ['ESP32', 'Arduino', 'C++', 'MQTT'].includes(s));
      }

      let matchesClass = true;
      if (selectedClass !== 'Semua Kelas') {
        matchesClass = student.classGroup.includes(selectedClass);
      }

      let matchesAvail = true;
      if (selectedAvailability === 'Tersedia') {
        matchesAvail = student.availableForTeam;
      }

      return matchesSearch && matchesDomain && matchesClass && matchesAvail;
    });
  }, [students, searchQuery, selectedDomain, selectedClass, selectedAvailability]);

  const handleShareVacancy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Cari Anggota
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Cari Anggota & Kolaborator Tim
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Temukan rekan siswa bertalenta berdasarkan keahlian, kelas kejuruan, dan ketersediaan untuk memperkuat tim proyek sekolahmu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{students.length} Siswa Tersedia</span>
          </div>

          <button
            onClick={handleShareVacancy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Tersalin' : 'Bagikan Lowongan Tim'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (matching Image 3) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, keahlian (contoh: UI/UX, Python, Flutter), atau kelas..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Skill filters & dropdowns row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {SKILL_DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedDomain === domain
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Semua Ketersediaan">Semua Ketersediaan</option>
              <option value="Tersedia">Tersedia untuk Tim Baru</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Cards Grid (3 cards per row matching desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          return (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name, School badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {student.classGroup} • {student.role}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    SMK
                  </span>
                </div>

                {/* Availability status badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{student.availabilityText}</span>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[36px]">
                  {student.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats & Invite Action Button */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 text-center divide-x divide-slate-100 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{student.projectsCount}</span>
                    <span className="text-[11px] text-slate-400">Proyek</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{student.collaborationsCount}</span>
                    <span className="text-[11px] text-slate-400">Kolaborasi</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 flex items-center justify-center gap-1">
                      {student.rating}
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <span className="text-[11px] text-slate-400">Rating</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInviteStudent(student)}
                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Bergabung</span>
                  </button>

                  <button
                    onClick={() => onViewStudentPortfolio(student)}
                    className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    Portofolio
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Guidance Card: Tips Merekrut Rekan Tim yang Tepat (Image 3) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900">
              Tips Merekrut Rekan Tim yang Tepat
            </h4>
            <p className="text-xs text-slate-500">
              Penyusunan tim yang seimbang adalah kunci sukses proyek kejuruan:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 pt-1">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                Peran transparan
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                Kesesuaian keahlian tugas akhir
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                Diskusi santai pra-sprint
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onCreateTeam}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg transition-colors shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Buat Tim Baru</span>
        </button>
      </div>

    </div>
  );
};
