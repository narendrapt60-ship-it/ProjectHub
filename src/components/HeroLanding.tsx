import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { Project } from '../types';
import { images } from '../assets/imageUrls';

const HERO_PHRASES = ['Portofolio Digitalmu.', 'Karya Bersama.', 'Proyek Impianmu.'];

interface HeroLandingProps {
  onExploreClick: () => void;
  onOpenProjectDetail: (projectId: string) => void;
  featuredProject: Project;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onExploreClick,
  onOpenProjectDetail,
  featuredProject
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % HERO_PHRASES.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#080808] py-12 lg:py-20 border-b border-slate-800">
      
      {/* Background Soft Ambient Light */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Tag Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Platform Kolaborasi & Portofolio Siswa</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Dokumentasikan Karya, Temukan Rekan Tim, & Bangun{' '}
              <span key={phraseIndex} className="hero-rotating-phrase" aria-live="polite">{HERO_PHRASES[phraseIndex]}</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Wadah terintegrasi bagi siswa SMP/SMA/SMK untuk mengunggah tugas kelompok, mencari anggota sesuai keahlian, dan mendapatkan masukan langsung dari guru.
            </p>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:translate-y-[-1px] active:translate-y-[0]"
              >
                <span>Jelajahi Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenProjectDetail(featuredProject.id)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span>Lihat Studi Kasus</span>
              </button>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-4 flex items-center gap-4 border-t border-slate-200/70">
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src={images.narenAvatar}
                  alt="Naren Pratama"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src={images.sitiAvatar}
                  alt="Siti Aminah"
                />
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  AK
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  SP
                </div>
              </div>

              {/* Rating and school */}
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">4.5</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>Digunakan oleh siswa SMK se-Indonesia</span>
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 inline" />
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive High-Fidelity Showcase Card (from Image 1.jpeg) */}
          <div className="lg:col-span-6 relative">
            
            {/* Floating 'Mencari 1 UI/UX Designer' Badge (Animated bounce like Pak Guru) */}
            <div className="absolute -top-4 right-4 sm:right-8 z-20 bg-white/95 backdrop-blur-sm border border-emerald-300 shadow-md rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-bounce duration-1000 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Mencari 1 UI/UX Designer</span>
            </div>

            {/* Main Interactive Showcase Card */}
            <div 
              onClick={() => onOpenProjectDetail(featuredProject.id)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 md:p-6 transition-all duration-200 hover:shadow-2xl hover:border-blue-300 relative"
            >
              
              {/* Card Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  INFORMATIKA & BIOLOGI
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors">
                    Gabung Tim
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    • Dikerjakan
                  </span>
                </div>
              </div>

              {/* Project Title */}
              <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                Website Kampanye Lingkungan (GreenSchool)
              </h2>

              {/* Visual Project Screenshot Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4 shadow-inner">
                <img
                  src={featuredProject.thumbnail}
                  alt="GreenSchool Dashboard Preview"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Tag Chips */}
              <div className="flex items-center gap-2 mb-4 text-xs font-medium text-slate-600">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700">Web Dev</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700">Lingkungan</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700">IoT</span>
              </div>

              {/* Card Meta & Progress */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <img
                      src={images.narenAvatar}
                      alt="Naren Pratama"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-slate-900 font-semibold">Naren Pratama</span>
                    <span>·</span>
                    <span>XII RPL</span>
                  </div>
                  <span className="text-slate-700 font-semibold">3/4 Anggota</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Progres Pengerjaan</span>
                    <span className="font-bold text-blue-600">75% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Live Mentor Feedback Badge (bottom left of card) */}
            <div className="mt-3 sm:absolute sm:-bottom-4 sm:-left-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg rounded-xl p-3 max-w-sm flex items-start gap-2.5 text-xs text-slate-700 animate-bounce duration-1000">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Pak Guru memberi masukan:
                </p>
                <p className="text-slate-600 text-[11px] line-clamp-1 italic">
                  "Ide dashboard sangat aplikatif!" · <span className="text-slate-400 not-italic">Baru saja</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
