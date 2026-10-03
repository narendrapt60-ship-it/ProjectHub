import React, { useEffect, useState } from 'react';
import { Users, X } from 'lucide-react';
import { Project } from '../types';

export interface CreateTeamInput {
  projectId: string;
  roles: { role: string; skills: string[]; count: number }[];
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateTeam: (team: CreateTeamInput) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  projects,
  onCreateTeam
}) => {
  const [projectId, setProjectId] = useState(() => projects[0]?.id ?? '');
  const [positions, setPositions] = useState([{ role: '', skills: '', count: 1 }]);

  useEffect(() => {
    if (!projects.some((project) => project.id === projectId)) {
      setProjectId(projects[0]?.id ?? '');
    }
  }, [projects, projectId]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const roles = positions.map((position) => ({
      role: position.role.trim(),
      skills: [...new Set(position.skills.split(',').map((skill) => skill.trim()).filter(Boolean))],
      count: Math.max(1, Number(position.count) || 1)
    }));
    if (!projectId || roles.length === 0 || roles.some((position) => !position.role || position.skills.length === 0)) return;
    onCreateTeam({ projectId, roles });
    setPositions([{ role: '', skills: '', count: 1 }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Buat Tim Baru</h2>
              <p className="text-xs text-slate-500">Pilih proyek, posisi, keahlian, dan jumlah anggota yang dibutuhkan.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="team-project" className="text-xs font-semibold text-slate-700">Proyek yang dikerjakan bersama</label>
            <select
              id="team-project"
              required
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Posisi, keahlian, dan jumlah</span>
              <button type="button" onClick={() => setPositions((current) => [...current, { role: '', skills: '', count: 1 }])} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                <Users className="h-3.5 w-3.5" />
                Tambah Posisi
              </button>
            </div>
            {positions.map((position, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1.2fr_88px_auto]">
                <input required value={position.role} onChange={(event) => setPositions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, role: event.target.value } : item))} placeholder="Posisi" aria-label={`Posisi ${index + 1}`} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                <input required value={position.skills} onChange={(event) => setPositions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, skills: event.target.value } : item))} placeholder="Keahlian, pisahkan koma" aria-label={`Keahlian ${index + 1}`} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                <input required type="number" min="1" max="99" value={position.count} onChange={(event) => setPositions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, count: Number(event.target.value) } : item))} aria-label={`Jumlah anggota posisi ${index + 1}`} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                {positions.length > 1 && <button type="button" onClick={() => setPositions((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus posisi ${index + 1}`} className="justify-self-end rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><X className="h-4 w-4" /></button>}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
            >
              Buat Tim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};