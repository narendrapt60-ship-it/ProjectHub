import React, { useState } from 'react';
import { X, UserPlus, Send, CheckCircle2 } from 'lucide-react';
import { Student, Project } from '../types';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent?: Student | null;
  targetProjectId?: string;
  defaultRole?: string;
  projects: Project[];
  currentUser: Student | null;
  onSendInvitation: (payload: { studentName: string; targetStudentId?: string; projectId: string; projectTitle: string; role: string; message: string }) => Promise<void>;
}

export const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
  targetProjectId,
  defaultRole,
  projects,
  currentUser,
  onSendInvitation
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(targetProjectId || '');
  const [role, setRole] = useState(defaultRole || '');
  const [message, setMessage] = useState(
    targetStudent 
      ? `Halo ${targetStudent.name}, kami tertarik mengajakmu bergabung dalam proyek tim sekolah kami!`
      : 'Halo, saya ingin mengajukan diri bergabung ke proyek ini sesuai posisi terbuka.'
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const availableProjects = targetProjectId
    ? projects.filter((project) => project.id === targetProjectId && project.openPositions.some((position) => position.count > 0))
    : projects.filter((project) => project.author.id === currentUser?.id && project.openPositions.some((position) => position.count > 0));
  const selectedProject = availableProjects.find((project) => project.id === selectedProjectId) || availableProjects[0];
  const availableRoles = selectedProject?.openPositions.filter((position) => position.count > 0) || [];
  const selectedRole = availableRoles.find((position) => position.role === role) || availableRoles[0];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedRole) return;
    setIsSubmitting(true);
    setRequestError('');
    try {
      await onSendInvitation({
        studentName: targetStudent?.name || currentUser?.name || 'Siswa Pendaftar',
        targetStudentId: targetStudent?.id,
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        role: selectedRole.role,
        message
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Undangan gagal dikirim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {targetStudent ? `Ajak ${targetStudent.name} Bergabung` : 'Ajukan Bergabung ke Tim Proyek'}
              </h3>
              <p className="text-xs text-slate-500">
                Undangan disimpan secara lokal di browser ini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">Undangan Berhasil Terkirim!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Notifikasi telah diteruskan secara real-time ke akun siswa terkait.
            </p>
          </div>
        ) : availableProjects.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">Belum ada proyek dengan posisi tersedia.</p>
            <p className="text-xs text-slate-500">Buat proyek atau pilih posisi yang masih dibuka untuk mengirim permintaan.</p>
            <button onClick={onClose} className="mt-2 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg">
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* Student Preview if inviting specific student */}
            {targetStudent && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={targetStudent.avatar}
                  alt={targetStudent.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{targetStudent.name}</h4>
                  <p className="text-[11px] text-slate-500">{targetStudent.classGroup} • {targetStudent.role}</p>
                </div>
              </div>
            )}

            {/* Choose Project */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pilih Proyek Tim</label>
              <select
                value={selectedProject?.id || ''}
                disabled={Boolean(targetProjectId)}
                onChange={(e) => {
                  const nextProject = availableProjects.find((project) => project.id === e.target.value);
                  setSelectedProjectId(e.target.value);
                  setRole(nextProject?.openPositions[0]?.role || '');
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
              >
                {availableProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({proj.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Position / Role */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Peran / Keahlian yang Ditugaskan</label>
              <select
                required
                value={selectedRole?.role || ''}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih posisi yang tersedia</option>
                {selectedProject?.openPositions.filter((position) => position.count > 0).map((position) => (
                  <option key={position.role} value={position.role}>
                    {position.role} ({position.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pesan Ajakan / Catatan</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              {requestError && <p role="alert" className="mr-auto text-xs text-rose-600">{requestError}</p>}
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Undangan'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
