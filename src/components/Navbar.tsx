import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Plus, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Home, 
  LayoutGrid, 
  Users,
  FolderPlus,
  CheckCircle2,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'myProjects' | 'collaborators' | 'notifications' | 'profile' | 'detail';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'myProjects' | 'collaborators' | 'notifications' | 'profile' | 'detail') => void;
  currentUser: Student | null;
  unreadCount: number;
  onOpenUploadModal: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  myProjectsCount?: number;
  onSelectMyProjects?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  unreadCount,
  onOpenUploadModal,
  onOpenLoginModal,
  onLogout,
  myProjectsCount = 0,
  onSelectMyProjects
}) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbLabel = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'myProjects':
        return 'Proyek Saya';
      case 'collaborators':
        return 'Cari Anggota';
      case 'notifications':
        return 'Notifikasi';
      case 'profile':
        return 'Profil Siswa';
      case 'detail':
        return 'Detail Proyek';
      default:
        return 'Beranda';
    }
  };

  const navMenuItems = [
    ...(!currentUser ? [{ id: 'landing', label: 'Beranda Utama', icon: Home }] : []),
    { id: 'dashboard', label: 'Dashboard & Karya Siswa', icon: LayoutGrid },
    ...(currentUser ? [{ id: 'collaborators', label: 'Cari Anggota & Rekan Tim', icon: Users }] : []),
    { id: 'notifications', label: 'Pusat Aktivitas & Notifikasi', icon: Bell, badge: unreadCount },
    ...(currentUser ? [{ id: 'profile', label: 'Profil & Portofolio Siswa', icon: User }] : [])
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 md:h-16">
            
            {/* LEFT: Hamburger Menu + Logo + Breadcrumb (matching exact screenshot design) */}
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              {/* Clean Hamburger Menu Button */}
              {currentUser && (
                <button
                  onClick={() => setIsNavDrawerOpen(true)}
                  className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                  aria-label="Buka Navigasi Menu"
                  title="Menu Navigasi"
                >
                  <Menu className="w-5 h-5 stroke-[2]" />
                </button>
              )}

              {/* Logo Brand */}
              <button
                onClick={() => setCurrentTab(currentUser ? 'dashboard' : 'landing')}
                className="flex items-center gap-2 text-left group shrink-0"
              >
                <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  ProjectHub
                </span>
              </button>

              {/* Breadcrumb Indicator (as seen in Image 3, 5, 7, 9, 13) */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium truncate">
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-800 truncate">
                  {getBreadcrumbLabel()}
                </span>
              </div>
            </div>

            {/* RIGHT: User Profile / Login */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

              {currentUser && (
                <button
                  onClick={() => setCurrentTab('notifications')}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : 'Notifikasi'}
                  title="Notifikasi"
                >
                  <Bell className="w-5 h-5 stroke-[1.9]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-1 pr-2 rounded-lg hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="hidden sm:block leading-tight text-left">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                        {currentUser.name.split(' ')[0]}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[110px]">
                        Siswa SMK 1
                      </p>
                    </div>
                  </button>

                  {/* Clean Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Identity Card */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{currentUser.school}</p>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1">
                        {onSelectMyProjects && (
                          <button
                            onClick={() => {
                              onSelectMyProjects();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
                              <span>Proyek Saya</span>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                              {myProjectsCount}
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setCurrentTab('profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Profil Siswa & Portofolio</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Login
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer (opened by hamburger ☰) */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsNavDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Container */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center">
                <span className="font-extrabold text-base text-slate-900">ProjectHub</span>
              </div>
              <button
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Nav Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Menu Utama
              </p>

              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const isRestrictedForGuest = !currentUser && item.id === 'notifications';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsNavDrawerOpen(false);
                      if (isRestrictedForGuest) {
                        onOpenLoginModal();
                        return;
                      }
                      setCurrentTab(item.id as any);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {isRestrictedForGuest ? (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Masuk</span>
                      </span>
                    ) : item.badge && item.badge > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </button>
                );
              })}

              {currentUser && onSelectMyProjects && (
                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    onSelectMyProjects();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderPlus className="w-4 h-4 text-slate-400" />
                    <span>Proyek Saya</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {myProjectsCount}
                  </span>
                </button>
              )}

              <div className="border-t border-slate-100 my-3"></div>

              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Aksi Proyek
              </p>

              <button
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  onOpenUploadModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50/60 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  <span>Unggah Proyek Baru</span>
                </div>
                {!currentUser ? (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Perlu Akun</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                    +
                  </span>
                )}
              </button>

              {currentUser && (
                <>
                  <div className="border-t border-slate-100 my-3"></div>

                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Keamanan
                  </p>

                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setIsNavDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Akun Terlindungi</span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
              <p className="font-semibold text-slate-800">ProjectHub Siswa SMK</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Versi 1.2 • Portofolio Digital</p>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Docked at the bottom on mobile for thumb-friendly reach) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden">
        <div className={`grid ${currentUser ? 'grid-cols-5' : 'grid-cols-4'} h-16 items-center px-1 max-w-lg mx-auto`}>
          {/* 1. Beranda */}
          <button
            onClick={() => setCurrentTab('landing')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
              currentTab === 'landing' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'landing' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px]">Beranda</span>
          </button>

          {/* 2. Karya */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
              currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px]">Karya</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setCurrentTab('collaborators')}
              className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                currentTab === 'collaborators' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className={`w-5 h-5 ${currentTab === 'collaborators' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px]">Rekan</span>
            </button>
          )}

          {/* Center Action: Unggah Proyek Baru */}
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenLoginModal();
                  return;
                }
                onOpenUploadModal();
              }}
              className="w-11 h-11 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center -mt-4 border-2 border-white ring-2 ring-blue-100"
              aria-label="Unggah Proyek"
              title="Unggah Proyek Baru"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-bold text-blue-600 mt-0.5">Unggah</span>
          </div>

          {/* Akun Siswa / Login */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenLoginModal();
                return;
              }
              setCurrentTab('profile');
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
              currentTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={`w-5 h-5 rounded-full object-cover ring-1 ${
                  currentTab === 'profile' ? 'ring-blue-600' : 'ring-slate-300'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            )}
            <span className="text-[10px] truncate max-w-[50px]">
              {currentUser ? 'Akun' : 'Login'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
