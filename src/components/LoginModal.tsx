import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Student } from '../types';
import { localStorageService } from '../services/localStorageService';
const DEMO_ACCOUNTS = [
  { name: 'Naren', email: 'naren.pratama@smkn2bandung.sch.id', password: 'Naren', studentId: 'student-naren' },
  { name: 'Siti', email: 'siti.aminah@smkn2bandung.sch.id', password: 'Siti', studentId: 'student-siti' },
  { name: 'Budi', email: 'budi.santoso@smk.sch.id', password: 'Budi', studentId: 'student-budi' }
];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: Student) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form States
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNis, setRegNis] = useState('');
  const [regSchool, setRegSchool] = useState('SMKN 2 Bandung');
  const [regClass, setRegClass] = useState('XI RPL 1');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    try {
      const user = await localStorageService.login(email, password);
      onLoginSuccess(user);
      onClose();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName.trim() || !regEmail.trim()) {
      setAuthError('Mohon lengkapi nama dan email sekolah.');
      return;
    }

    setIsLoading(true);
    try {
      const student = await localStorageService.register({
        name: regName,
        email: regEmail,
        nis: regNis,
        school: regSchool,
        classGroup: regClass,
        password: regPassword
      });
      onLoginSuccess(student);
      onClose();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Registrasi gagal.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 p-6 sm:p-7">
        
        {/* TAB 1: MASUK KE AKUNMU (Matching image.png exactly) */}
        {activeTab === 'login' ? (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                  SELAMAT DATANG KEMBALI
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Masuk ke akunmu
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Email
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@smk.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Kata sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.studentId}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setAuthError('');
                    }}
                    className="px-2 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    {account.name}
                  </button>
                ))}
              </div>

              {authError && <p role="alert" className="text-xs text-rose-600">{authError}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] mt-2 flex items-center justify-center"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>

              {/* Footer matching screenshot */}
              <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-blue-600 font-bold hover:underline ml-0.5"
                >
                  Daftar akun
                </button>
              </p>
            </form>
          </div>
        ) : (
          /* TAB 2: DAFTAR AKUN BARU */
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                  REGISTRASI SISWA
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Daftar akun baru
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Arya Saputra"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Sekolah (@smk.sch.id) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="arya.saputra@smkn2bandung.sch.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    NIS / NISN
                  </label>
                  <input
                    type="text"
                    placeholder="10220999"
                    value={regNis}
                    onChange={(e) => setRegNis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Kelas / Jurusan
                  </label>
                  <input
                    type="text"
                    placeholder="XI RPL 1"
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                    minLength={10}
                  placeholder="Minimal 10 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.studentId}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setAuthError('');
                    }}
                    className="px-2 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    {account.name}
                  </button>
                ))}
              </div>

              {authError && <p role="alert" className="text-xs text-rose-600">{authError}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] mt-3 flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>Mendaftarkan...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Daftar akun</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 font-bold hover:underline ml-0.5"
                >
                  Masuk
                </button>
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
