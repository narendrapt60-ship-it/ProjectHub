import { Student, Project, NotificationItem } from '../types';
import { images } from '../assets/imageUrls';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-naren',
    name: 'Naren Pratama',
    email: 'naren.pratama@smkn2bandung.sch.id',
    nis: '10220945',
    classGroup: 'Kelas XI DKV / RPL',
    major: 'Rekayasa Perangkat Lunak',
    role: 'UI/UX Designer & Frontend Developer',
    school: 'SMKN 2 Bandung',
    avatar: images.narenAvatar,
    bio: 'UI/UX Designer & Frontend Developer antusias. Suka merancang antarmuka ramah pengguna dan berkolaborasi dalam proyek inovatif sekolah.',
    skills: ['Figma', 'Tailwind CSS', 'React JS', 'TypeScript', 'Wireframing'],
    projectsCount: 8,
    collaborationsCount: 12,
    viewsCount: 1800,
    teacherSatisfaction: 95,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Kolaborasi',
    rating: 4.9,
    github: 'github.com/narenpratama',
    figma: 'figma.com/@naren',
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    twoFactorType: 'authenticator',
    skillLevels: [
      { skill: 'Figma & Wireframing', level: 95, isVerified: true },
      { skill: 'HTML5 / CSS3 & Responsive', level: 92, isVerified: true },
      { skill: 'Tailwind CSS', level: 88, isVerified: true },
      { skill: 'JavaScript (ES6+)', level: 80, isVerified: true }
    ],
    badges: [
      { id: 'b1', title: 'Kontributor Terbaik Bulan Ini', giver: 'SMK Hub Pembina', active: true },
      { id: 'b2', title: 'Kolaborator Aktif (10+ Tim)', giver: 'Bekerja sama lintas jurusan SMK', active: true },
      { id: 'b3', title: 'Ulasan Guru A+', giver: 'Konsistensi tenggat waktu tugas akhir', active: true }
    ]
  },
  {
    id: 'student-siti',
    name: 'Siti Aminah',
    email: 'siti.aminah@smkn2bandung.sch.id',
    nis: '10220912',
    classGroup: 'XI MIPA 2 / SMK',
    major: 'Informatika & Rekayasa Perangkat Lunak',
    role: 'Frontend Developer',
    school: 'SMKN 2 Bandung',
    avatar: images.sitiAvatar,
    bio: 'Suka mengulik React & Next.js. Berpengalaman membangun landing page ramah akses dan antarmuka web interaktif untuk kegiatan ekstrakurikuler.',
    skills: ['Next.js', 'Tailwind CSS', 'React', 'TypeScript'],
    projectsCount: 6,
    collaborationsCount: 18,
    viewsCount: 1450,
    teacherSatisfaction: 96,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Tim Baru',
    rating: 4.9,
    twoFactorEnabled: false,
    skillLevels: [
      { skill: 'React & Next.js', level: 94, isVerified: true },
      { skill: 'Tailwind CSS', level: 90, isVerified: true }
    ],
    badges: [
      { id: 'b4', title: 'Code Clean Master', giver: 'SMK Hub Pembina', active: true }
    ]
  },
  {
    id: 'student-budi',
    name: 'Budi Santoso',
    email: 'budi.santoso@smk.sch.id',
    nis: '10220888',
    classGroup: 'XII TKJ',
    major: 'Teknik Komputer & Jaringan',
    role: 'Machine Learning & AI',
    school: 'SMK TI Global',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    bio: 'Fokus pada pengolahan data tabular, Scikit-learn, serta integrasi REST API FastAPI untuk aplikasi cerdas prediksi kelulusan siswa.',
    skills: ['Python', 'Scikit-Learn', 'FastAPI', 'Data Analytics'],
    projectsCount: 5,
    collaborationsCount: 14,
    viewsCount: 1200,
    teacherSatisfaction: 92,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Tim Baru',
    rating: 4.8,
    twoFactorEnabled: true,
    skillLevels: [
      { skill: 'Python Data Science', level: 90, isVerified: true },
      { skill: 'FastAPI Backend', level: 85, isVerified: true }
    ],
    badges: [
      { id: 'b5', title: 'Data Wizard', giver: 'Komunitas AI Pelajar', active: true }
    ]
  },
  {
    id: 'student-rizky',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@smkn1bandung.sch.id',
    nis: '10220755',
    classGroup: 'XII RPL 1',
    major: 'Rekayasa Perangkat Lunak',
    role: 'Mobile App Developer',
    school: 'SMKN 1 Bandung',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: 'Spesialisasi di Flutter lintas platform (Android/iOS) dengan Firebase backend dan local database SQLite. Juara 2 LKS tingkat kota.',
    skills: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
    projectsCount: 8,
    collaborationsCount: 22,
    viewsCount: 2100,
    teacherSatisfaction: 98,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Tim Baru',
    rating: 5.0,
    twoFactorEnabled: true,
    skillLevels: [
      { skill: 'Flutter & Dart', level: 96, isVerified: true },
      { skill: 'SQLite & Local Sync', level: 92, isVerified: true }
    ],
    badges: [
      { id: 'b6', title: 'Juara LKS Mobile App', giver: 'Dinas Pendidikan', active: true }
    ]
  },
  {
    id: 'student-ayu',
    name: 'Ayu Lestari',
    email: 'ayu.lestari@smkn2.sch.id',
    nis: '10220610',
    classGroup: 'XI DKV',
    major: 'Desain Komunikasi Visual',
    role: 'UI/UX Designer',
    school: 'SMK Negeri 2',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: 'Mendesain design system, wireframe Figma, ilustrasi vektor, dan branding visual proyek kreatif SMK yang siap diuji ke pengguna.',
    skills: ['Figma', 'Wireframing', 'Illustrator', 'Design System'],
    projectsCount: 7,
    collaborationsCount: 19,
    viewsCount: 1750,
    teacherSatisfaction: 94,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Tim Baru',
    rating: 4.9,
    twoFactorEnabled: false,
    skillLevels: [
      { skill: 'Figma Design System', level: 95, isVerified: true },
      { skill: 'Adobe Illustrator', level: 88, isVerified: true }
    ],
    badges: [
      { id: 'b7', title: 'Top Creative Designer', giver: 'SMK Hub Pembina', active: true }
    ]
  },
  {
    id: 'student-dimas',
    name: 'Dimas Saputra',
    email: 'dimas.saputra@smk.sch.id',
    nis: '10220555',
    classGroup: 'X RPL',
    major: 'Rekayasa Perangkat Lunak',
    role: 'Game & Web Developer',
    school: 'SMK Negeri 2 Tabanan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    bio: 'Tertarik membuat game edukasi 2D interaktif berbasis web canvas dan logika pemrograman matematika untuk siswa SMP/SMA.',
    skills: ['JavaScript', 'HTML5 Canvas', 'Phaser.js', 'CSS3'],
    projectsCount: 4,
    collaborationsCount: 11,
    viewsCount: 980,
    teacherSatisfaction: 90,
    availableForTeam: true,
    availabilityText: 'Tersedia Paruh Waktu (Sore)',
    rating: 4.7,
    twoFactorEnabled: false,
    skillLevels: [
      { skill: 'Phaser.js Game Engine', level: 86, isVerified: true },
      { skill: 'Canvas 2D Rendering', level: 84, isVerified: true }
    ],
    badges: [
      { id: 'b8', title: 'Indie Game Builder', giver: 'SMK Game Fest', active: true }
    ]
  },
  {
    id: 'student-fajar',
    name: 'Fajar Nugraha',
    email: 'fajar.nugraha@smk.sch.id',
    nis: '10220490',
    classGroup: 'XI Mekatronika',
    major: 'Teknik Mekatronika & IoT',
    role: 'IoT Hardware',
    school: 'SMK Negeri 1',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
    bio: 'Perakitan modul mikrokontroler ESP32/Arduino, integrasi sensor lingkungan, dan protokol MQTT/WebSockets ke cloud dashboard.',
    skills: ['ESP32', 'Arduino', 'C++', 'MQTT'],
    projectsCount: 5,
    collaborationsCount: 13,
    viewsCount: 1150,
    teacherSatisfaction: 93,
    availableForTeam: true,
    availabilityText: 'Tersedia untuk Tim Baru',
    rating: 4.8,
    twoFactorEnabled: true,
    skillLevels: [
      { skill: 'ESP32 & Sensors', level: 92, isVerified: true },
      { skill: 'MQTT Protocol', level: 88, isVerified: true }
    ],
    badges: [
      { id: 'b9', title: 'IoT Pioneer', giver: 'Lab Hardware Sekolah', active: true }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-greenschool',
    title: 'Website Kampanye Lingkungan (GreenSchool)',
    category: 'Web App',
    subject: 'Informatika (Pemrograman & Rekayasa Perangkat Lunak)',
    description: 'Portal edukasi dan bank sampah digital terintegrasi untuk mencatat dan mengonversi poin daur ulang sampah antar kelas di lingkungan SMKN 2 Bandung.',
    detailedDescription: 'GreenSchool dikembangkan untuk menjembatani partisipasi warga sekolah dan pengurus Bank Sampah OSIS. Setiap hari, area kantin menghasilkan lebih dari 45 kg kemasan tanpa pencatatan yang rapi. Melalui sistem kartu digital ber-QR code, siswa yang menyetor botol plastik terpilah langsung memperoleh poin apresiasi untuk ditukarkan di koperasi sekolah, sekaligus memantau kalkulasi reduksi emisi karbon secara berkala.',
    status: 'Sedang Dikerjakan',
    completionPercentage: 75,
    author: {
      id: 'student-siti',
      name: 'Siti Aminah',
      role: 'Project Lead & Frontend',
      classGroup: 'XI MIPA 2',
      school: 'SMKN 2 Bandung',
      avatar: images.sitiAvatar
    },
    thumbnail: images.greenschool,
    views: 312,
    likes: 84,
    savedByUsers: ['student-naren'],
    techStack: ['Next.js 14', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Vercel', 'Chart.js'],
    milestones: [
      {
        id: 'm1',
        title: 'Riset Timbulan Sampah & Desain UI/UX (Figma)',
        status: 'completed',
        targetDate: '5 Oktober 2024',
        note: 'Wawancara dengan 4 penjaga kantin dan pengurus bank sampah OSIS.'
      },
      {
        id: 'm2',
        title: 'Setup Database Supabase & Autentikasi Siswa',
        status: 'completed',
        targetDate: '18 Oktober 2024',
        note: 'Integrasi akun Google Workspace sekolah (@smkn2bandung.sch.id).'
      },
      {
        id: 'm3',
        title: 'Form Input Setoran & Dashboard Poin Kelas',
        status: 'completed',
        targetDate: '28 Oktober 2024',
        note: 'Pencatatan jenis plastik HDPE, PET, dan kertas duplex.'
      },
      {
        id: 'm4',
        title: 'Integrasi Timbangan Digital & QR Scanner',
        status: 'in_progress',
        targetDate: 'Target Pekan Depan',
        note: 'Pengujian pembacaan serial port timbangan Bluetooth.'
      },
      {
        id: 'm5',
        title: 'Pengujian Beta Antar Kelas X & XI',
        status: 'pending',
        targetDate: 'Menunggu penyelesaian scanner',
        note: 'Pelaksanaan piloting di 6 kelas rintisan Adiwiyata.'
      }
    ],
    openPositions: [
      {
        role: 'Quality Assurance / Beta Tester',
        count: 1,
        description: 'Membantu uji coba alur form setor timbangan di HP Android siswa dan mendokumentasikan kendala error (bug report).',
        targetClass: 'Terbuka untuk Siswa Kelas X atau XI'
      }
    ],
    members: [
      { id: 'm-1', name: 'Siti Aminah', role: 'Project Lead & Frontend', classGroup: 'XI MIPA', isLeader: true },
      { id: 'm-2', name: 'Budi Santoso', role: 'Backend & Database', classGroup: 'XI RPL 1' },
      { id: 'm-3', name: 'Naren Pratama', role: 'UI/UX Designer', classGroup: 'XI DKV 2' }
    ],
    documents: [
      { name: 'Proposal_GreenSchool_v2.pdf', size: '2.4 MB', type: 'pdf', url: '#', approved: true },
      { name: 'SlideDeck_Presentasi_Akhir.pdf', size: '5.1 MB', type: 'pdf', url: '#', approved: true }
    ],
    mentorReview: {
      mentorName: 'Drs. I Made Sudarmawan, M.Kom',
      mentorTitle: 'Guru Produktif RPL',
      school: 'SMKN 2 Bandung',
      score: 92,
      maxScore: 100,
      date: '28 Okt 2024',
      comment: 'Antarmuka pengguna sangat bersih, terstruktur, dan intuitif untuk dipahami. Struktur kode di repository tertata rapi serta normalisasi database Supabase sudah tepat. Tingkatkan filter periode pada grafik analitik sebelum implementasi umum.'
    },
    features: [
      { title: 'Kalkulator Daur Ulang', description: 'Konversi gramatur sampah botol & kertas menjadi estimasi gram CO2 yang dihemat.', badge: 'Algoritma Emisi Terverifikasi' },
      { title: 'Statistik Sampah Sekolah', description: 'Visualisasi data timbulan sampah mingguan per zona sekolah secara real-time.', badge: 'Chart.js & Supabase Realtime' },
      { title: 'Leaderboard Poin Kelas', description: 'Peringkat keaktifan pilah sampah bulanan untuk memicu kompetisi positif antarkelas.', badge: 'Gamifikasi Siswa' },
      { title: 'Modul Edukasi Zero-Waste', description: 'Katalog materi singkat & agenda pembuatan kompos cair dan ecobrick sekolah.', badge: 'Integrasi Video Pembelajaran' }
    ],
    liveDemoUrl: 'https://greenschool.smkn2bandung.sch.id',
    githubUrl: 'https://github.com/smkn2-greenschool/web',
    metadata: {
      license: 'Open Source (MIT)',
      updatedAt: '28 Oktober 2024',
      targetUsers: 'Siswa & Guru SMK'
    },
    createdAt: '2024-10-01'
  },
  {
    id: 'proj-studyflow',
    title: 'Aplikasi Catatan Siswa (StudyFlow)',
    category: 'Mobile App',
    subject: 'Pemrograman Perangkat Bergerak',
    description: 'Aplikasi mobile pengingat tugas harian, jadwal mata pelajaran interaktif, dan fitur sinkronisasi offline antar teman kelas berbasis Flutter dan SQLite.',
    detailedDescription: 'Seringnya siswa lupa tenggat waktu pengumpulan tugas sekolah karena catatan terpisah-pisah di buku tulis, kertas binder, dan obrolan grup kelas yang sering tenggelam menjadi motivasi utama pembuatan aplikasi ini. StudyFlow hadir sebagai solusi one-stop mobile organizer yang bekerja secara instan tanpa perlu koneksi internet terus-menerus.',
    status: 'Mencari Anggota',
    completionPercentage: 60,
    author: {
      id: 'student-rizky',
      name: 'Rizky Pratama',
      role: 'Mobile Lead Developer',
      classGroup: 'XII RPL 1',
      school: 'SMKN 1 Bandung',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: images.studyflow,
    views: 248,
    likes: 19,
    savedByUsers: [],
    techStack: ['Flutter', 'Dart', 'Firebase Firestore', 'SQLite', 'Riverpod', 'Local Notifications'],
    milestones: [
      { id: 'sf1', title: 'Riset Kebutuhan & Desain UI Mobile (Figma)', status: 'completed', targetDate: 'Selesai 12 Okt 2024', note: 'Wireframing 12 halaman utama dan user testing awal' },
      { id: 'sf2', title: 'Arsitektur Database Lokal SQLite & Offline Storage', status: 'completed', targetDate: 'Selesai 18 Okt 2024', note: 'Skema relasional mata pelajaran, tugas, dan tag materi' },
      { id: 'sf3', title: 'Fitur Manajemen Tugas & Notifikasi Pengingat', status: 'completed', targetDate: 'Selesai 24 Okt 2024', note: 'Alarm terjadwal aktif saat background mode' },
      { id: 'sf4', title: 'Sinkronisasi Cloud Firebase & P2P Local Share', status: 'in_progress', targetDate: '40% Berjalan', note: 'Sedang integrasi autentikasi email sekolah dan broadcast Bluetooth' }
    ],
    openPositions: [
      { role: 'UI/UX Mobile Designer', count: 1, description: 'Membantu perancangan micro-interaction dan aset ilustrasi empty state halaman jadwal.', targetClass: 'Terbuka untuk Siswa Kelas X atau XI' },
      { role: 'Android QA Tester', count: 1, description: 'Pengujian skenario offline sync pada berbagai tipe device Android teman-teman siswa.', targetClass: 'Terbuka untuk Siswa Kelas X atau XI' }
    ],
    members: [
      { id: 'sf-m1', name: 'Rizky Pratama', role: 'Mobile Lead Developer', classGroup: 'XII RPL 1', isLeader: true }
    ],
    documents: [
      { name: 'StudyFlow_SRS_Dokumentasi.pdf', size: '3.1 MB', type: 'pdf', url: '#', approved: true }
    ],
    mentorReview: {
      mentorName: 'Drs. I Made Sudarmawan, M.Kom',
      mentorTitle: 'Guru Produktif RPL',
      school: 'SMKN 1 Bandung',
      score: 88,
      maxScore: 100,
      date: '22 Okt 2024',
      comment: 'Pemanfaatan SQLite offline-first sangat cocok untuk kondisi lab sekolah yang kadang terkendala jaringan internet. Pastikan penanganan konflik sinkronisasi antar perangkat ditangani dengan baik sebelum rilis beta.'
    },
    features: [
      { title: 'Smart Task Reminder', description: 'Notifikasi cerdas pengingat H-3, H-1, dan 2 jam sebelum deadline tugas sekolah dikumpulkan ke guru.' },
      { title: 'P2P Offline Sync', description: 'Sinkronisasi data tugas dan jadwal dengan rekan sekelas via Bluetooth atau Wi-Fi Direct tanpa kuota data.' },
      { title: 'Kalender Terintegrasi', description: 'Pengelompokan tugas otomatis berdasarkan mata pelajaran, ruangan kelas, dan guru pengampu secara terstruktur.' },
      { title: 'Manajemen Catatan', description: 'Simpan foto papan tulis materi dan ringkasan rumus dalam format kartu ringkas dengan metadata pencarian cepat.' }
    ],
    liveDemoUrl: 'https://studyflow-preview.app',
    githubUrl: 'https://github.com/rizkypratama/studyflow',
    metadata: {
      license: 'MIT License',
      updatedAt: '24 Oktober 2024',
      targetUsers: 'Siswa SMP / SMA / SMK'
    },
    createdAt: '2024-10-05'
  },
  {
    id: 'proj-gradevision',
    title: 'Prediksi Nilai Siswa (GradeVision)',
    category: 'AI / ML',
    subject: 'Kecerdasan Buatan & Basis Data',
    description: 'Model machine learning untuk menganalisis kebiasaan belajar dan memberikan rekomendasi remedi secara otomatis sebelum ujian kenaikan kelas.',
    detailedDescription: 'Banyak siswa mengalami keterlambatan intervensi belajar saat nilai ujian akhir atau rapor tengah semester sudah keluar. Hal ini menyebabkan guru bimbingan konseling dan wali kelas kesulitan memberikan pendampingan yang tepat waktu. GradeVision hadir menjawab kendala tersebut dengan memprediksi potensi penurunan nilai siswa secara proaktif sejak pekan ke-4 semester.',
    status: 'Mencari Anggota',
    completionPercentage: 48,
    author: {
      id: 'student-budi',
      name: 'Budi Santoso',
      role: 'Ketua / AI & Backend Lead',
      classGroup: 'XII TKJ',
      school: 'SMK TI Bali Global',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: images.gradevision,
    views: 405,
    likes: 34,
    savedByUsers: ['student-naren'],
    techStack: ['Python', 'Scikit-Learn', 'FastAPI', 'React', 'PostgreSQL', 'Chart.js'],
    milestones: [
      { id: 'gv1', title: 'Riset Dataset & Pengujian Model AI (Akurasi 94.5%)', status: 'completed', targetDate: 'Selesai 12 Oktober 2024' },
      { id: 'gv2', title: 'Pembuatan API Prediksi Backend (FastAPI)', status: 'completed', targetDate: 'Selesai 20 Oktober 2024' },
      { id: 'gv3', title: 'Integrasi Dashboard Web & Visualisasi Chart', status: 'in_progress', targetDate: 'Sedang Berjalan (65%) • Target Pekan Depan' },
      { id: 'gv4', title: 'Uji Coba Lapangan di Kelas XII TKJ & XII RPL', status: 'pending', targetDate: 'Menunggu penyelesaian frontend' }
    ],
    openPositions: [
      { role: 'Frontend Web Developer', count: 1, description: 'Membantu implementasi dashboard chart dan responsive UI dengan Tailwind CSS.', targetClass: 'Terbuka untuk Siswa Kelas X atau XI' },
      { role: 'Data Collector & QA Tester', count: 1, description: 'Membantu validasi data uji coba dan feedback antarmuka pengguna di kelas.', targetClass: 'Terbuka untuk Siswa Kelas X atau XI' }
    ],
    members: [
      { id: 'gv-m1', name: 'Budi Santoso', role: 'Ketua / AI & Backend Lead', classGroup: 'XII TKJ', isLeader: true }
    ],
    documents: [
      { name: 'Proposal_GradeVision_v1.pdf', size: '2.1 MB', type: 'pdf', url: '#', approved: true },
      { name: 'Dataset_Testing_Sample.csv', size: '1.4 MB', type: 'doc', url: '#' }
    ],
    mentorReview: {
      mentorName: 'Drs. I Made Sudarmawan, M.Kom',
      mentorTitle: 'Guru Produktif Informatika / AI',
      school: 'SMKN 2 Bandung',
      score: 90,
      maxScore: 100,
      date: '25 Okt 2024',
      comment: 'Pendekatan machine learning yang sangat solutif untuk membantu guru mengenali kendala belajar siswa lebih dini. Pastikan integrasi API ke web responsif dan visualisasi grafik mudah dipahami guru non-teknis.'
    },
    features: [
      { title: 'Early Warning System', description: 'Notifikasi otomatis dikirimkan langsung ke portal guru BK dan wali kelas jika probabilitas remedial seorang siswa melampaui ambang batas 65%.' },
      { title: 'Remedial Recommendation', description: 'Rekomendasi bab pelajaran spesifik, rangkuman materi ringkas, serta latihan soal terfokus sesuai kompetensi dasar yang dinilai lemah oleh algoritma.' },
      { title: 'Student Engagement Heatmap', description: 'Visualisasi matriks interaktif yang menghubungkan korelasi presensi harian, ketepatan waktu pengumpulan tugas, dan konsistensi skor kuis mingguan.' },
      { title: 'Privacy-First Data Guard', description: 'Anonimasi data identitas siswa dengan penomoran hash terenkripsi sesuai standar perlindungan data pribadi dan etika digital lingkungan sekolah.' }
    ],
    liveDemoUrl: 'https://gradevision.smkn2bandung.sch.id',
    githubUrl: 'https://github.com/budisantoso/gradevision-ai',
    metadata: {
      license: 'MIT Open License',
      updatedAt: '25 Okt 2024',
      targetUsers: 'Guru BK & Siswa'
    },
    createdAt: '2024-10-08'
  },
  {
    id: 'proj-mathhero',
    title: 'MathHero: Game Edukasi Aljabar 2D',
    category: 'Game Dev',
    subject: 'Matematika & Pengembangan Game',
    description: 'Game petualangan role-playing interaktif berbasis browser untuk mempermudah pemahaman rumus aljabar melalui tantangan puzzle di dalam dungeon.',
    detailedDescription: 'Game petualangan edukatif yang mengubah rumus aljabar yang abstrak menjadi teka-teki visual dungeon interaktif. Siswa menggerakkan karakter pahlawan, memecahkan persamaan linear untuk membuka gerbang misterius, dan mengumpulkan relik matematika.',
    status: 'Mencari Anggota',
    completionPercentage: 40,
    author: {
      id: 'student-dimas',
      name: 'Dewa Made',
      role: 'Game Programmer',
      classGroup: 'XI Multimedia',
      school: 'SMK Negeri 2 Tabanan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: images.mathhero,
    views: 180,
    likes: 14,
    savedByUsers: [],
    techStack: ['Phaser.js', 'Pixel Art', 'Canvas', 'JavaScript ES6', 'Web Audio API'],
    milestones: [
      { id: 'mh1', title: 'Konsep Storyboard & Karakter Sprite', status: 'completed', targetDate: 'Selesai 10 Okt 2024' },
      { id: 'mh2', title: 'Core Game Loop & Engine Gerak 2D', status: 'completed', targetDate: 'Selesai 22 Okt 2024' },
      { id: 'mh3', title: 'Level 1-3 Aljabar Linear & Integrasi Audio', status: 'in_progress', targetDate: 'Pekan Depan' }
    ],
    openPositions: [
      { role: 'Pixel Artist / Animator', count: 1, description: 'Membuat animasi idle dan running karakter 16x16px serta dekorasi dungeon tileset.' },
      { role: 'Level Designer', count: 1, description: 'Menyusun variasi soal persamaan aljabar kelas VII & VIII SMP ke dalam level teka-teki.' }
    ],
    members: [
      { id: 'mh-m1', name: 'Dewa Made', role: 'Game Programmer', classGroup: 'XI Multimedia', isLeader: true }
    ],
    documents: [
      { name: 'Game_Design_Document_MathHero.pdf', size: '4.2 MB', type: 'pdf', url: '#', approved: true }
    ],
    features: [
      { title: 'Interactive Combat Equation', description: 'Menyerang monster dengan memasukkan nilai x dan y yang tepat pada persamaan grafis.' },
      { title: 'Auto Save Progress', description: 'Penyimpanan checkpoint level di local storage browser tanpa perlu install aplikasi.' }
    ],
    createdAt: '2024-10-12'
  },
  {
    id: 'proj-batik',
    title: 'Redesain Batik Nusantara Digital',
    category: 'Desain',
    subject: 'Desain Komunikasi Visual & Seni Budaya',
    description: 'Koleksi motif batik modern format vektor terbuka untuk identitas kriya dan desain kemasan UMKM lokal binaan sekolah.',
    detailedDescription: 'Mendokumentasikan ragam hias batik tradisional Indonesia (Kawung, Mega Mendung, Parang Rusak) ke dalam format vektor SVG modern yang dapat dikustomisasi warnanya untuk diaplikasikan pada packaging produk UMKM, merchandise, dan antarmuka web sekolah.',
    status: 'Proyek Selesai',
    completionPercentage: 100,
    author: {
      id: 'student-ayu',
      name: 'Ayu Lestari',
      role: 'Creative Director',
      classGroup: 'XI DKV',
      school: 'SMK Negeri 2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: images.batik,
    views: 520,
    likes: 42,
    savedByUsers: ['student-naren'],
    techStack: ['Figma', 'Illustrator', 'SVG', 'CSS Animation'],
    milestones: [
      { id: 'bt1', title: 'Digitalisasi 12 Motif Ornamen Tradisional', status: 'completed', targetDate: 'Selesai 5 Sep 2024' },
      { id: 'bt2', title: 'Penyusunan Brand Guidelines & Palet Warna', status: 'completed', targetDate: 'Selesai 25 Sep 2024' },
      { id: 'bt3', title: 'Pameran Karya Expo Kreatif SMK', status: 'completed', targetDate: 'Selesai 15 Okt 2024' }
    ],
    openPositions: [],
    members: [
      { id: 'bt-m1', name: 'Ayu Lestari', role: 'Lead Graphic Designer', classGroup: 'XI DKV', isLeader: true },
      { id: 'bt-m2', name: 'Naren Pratama', role: 'UI Vector Specialist', classGroup: 'XI DKV 2' }
    ],
    documents: [
      { name: 'Katalog_Vektor_Batik_v1.pdf', size: '8.4 MB', type: 'pdf', url: '#', approved: true },
      { name: 'Aset_Vektor_SVG_Pack.zip', size: '15.2 MB', type: 'zip', url: '#' }
    ],
    features: [
      { title: 'Vektor Skalabel Tanpa Pecah', description: 'Format SVG murni yang dapat dibesarkan untuk billboard cetak maupun icon micro di website.' },
      { title: 'Katalog Lisensi CC-BY', description: 'Dapat digunakan bebas oleh sesama siswa dan pengrajin lokal untuk tugas kreasi.' }
    ],
    createdAt: '2024-09-15'
  },
  {
    id: 'proj-hidroponik',
    title: 'Smart Hidroponik Lab Sekolah',
    category: 'IoT Hardware',
    subject: 'Teknik Komputer & Mekatronika',
    description: 'Sistem monitoring nutrisi otomatis berbasis ESP32 terhubung ke dashboard web siswa untuk kebun sains sekolah.',
    detailedDescription: 'Mengotomatisasi penyiraman dan pengukuran pH serta PPM nutrisi air pada modul hidroponik vertikal rooftop laboratorium biologi. Data sensor dikirim setiap 15 detik menggunakan MQTT broker ke cloud dashboard.',
    status: 'Mencari Anggota',
    completionPercentage: 55,
    author: {
      id: 'student-fajar',
      name: 'Fajar Nugraha',
      role: 'Hardware Engineer',
      classGroup: 'XI Elektronika',
      school: 'SMK Negeri 1',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    views: 270,
    likes: 23,
    savedByUsers: [],
    techStack: ['ESP32', 'Arduino', 'MQTT', 'C++', 'Node.js', 'WebSocket'],
    milestones: [
      { id: 'hp1', title: 'Perakitan Sirkuit Relai & Pompa Submersible', status: 'completed', targetDate: 'Selesai 10 Okt 2024' },
      { id: 'hp2', title: 'Kalibrasi Sensor TDS & pH Meter', status: 'completed', targetDate: 'Selesai 20 Okt 2024' },
      { id: 'hp3', title: 'Integrasi Webhook Notifikasi Telegram & Dashboard', status: 'in_progress', targetDate: 'Pekan Depan' }
    ],
    openPositions: [
      { role: 'Web Dashboard Developer', count: 1, description: 'Menghubungkan API MQTT ke tampilan grafik visualisasi real-time berbasis Tailwind & React.', targetClass: 'Terbuka untuk Siswa Kelas X atau XI' }
    ],
    members: [
      { id: 'hp-m1', name: 'Fajar Nugraha', role: 'Hardware Engineer', classGroup: 'XI Mekatronika', isLeader: true }
    ],
    documents: [
      { name: 'Skema_Rangkaian_ESP32_Hidroponik.pdf', size: '1.8 MB', type: 'pdf', url: '#', approved: true }
    ],
    features: [
      { title: 'Auto Dosing Nutrisi', description: 'Pompa peristaltik otomatis aktif bila kadar kepekatan larutan turun di bawah ambang 800 PPM.' },
      { title: 'Peringatan Darurat Suhu', description: 'Kipas pendingin otomatis menyala jika suhu tandon air melewati 29°C.' }
    ],
    createdAt: '2024-10-14'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'team_request',
    title: 'Pengajuan Bergabung Tim',
    message: 'Mengajukan diri bergabung ke proyek Website Kampanye Lingkungan sebagai Frontend Developer.',
    timeAgo: '10 menit yang lalu',
    senderName: 'Made Vidi',
    senderRole: 'Siswa XI RPL 2',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    projectId: 'proj-greenschool',
    projectTitle: 'Website Kampanye Lingkungan',
    actionRequired: true,
    actionStatus: 'pending',
    createdAt: '2024-10-28T09:40:00Z',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'mentor_review',
    title: 'Evaluasi dari Guru Pembimbing',
    message: 'Memberikan ulasan pada Aplikasi Catatan Siswa: "Desain UI sangat rapi dan konsisten. Pastikan validasi form login berjalan responsif sebelum presentasi Jumat."',
    timeAgo: '1 jam yang lalu',
    senderName: 'Drs. I Made Sudarmawan, M.Kom',
    senderRole: 'Guru Pembimbing Produktif RPL',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    projectId: 'proj-studyflow',
    projectTitle: 'Aplikasi Catatan Siswa (StudyFlow)',
    score: '92/100',
    createdAt: '2024-10-28T08:50:00Z',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'team_invitation',
    title: 'Undangan Kolaborasi Tim',
    message: 'Mengundang kamu untuk berkolaborasi dalam proyek inovasi Prediksi Nilai Siswa AI sebagai UI/UX Designer.',
    timeAgo: '3 jam yang lalu',
    senderName: 'Dinda Larasati',
    senderRole: 'Tim Prediksi Nilai Siswa',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    projectId: 'proj-gradevision',
    projectTitle: 'Prediksi Nilai Siswa (GradeVision)',
    actionRequired: true,
    actionStatus: 'pending',
    createdAt: '2024-10-28T06:50:00Z',
    isRead: false
  },
  {
    id: 'notif-4',
    type: 'save_project',
    title: 'Proyek Disimpan',
    message: 'Budi Santoso menyimpan proyek StudyFlow ke daftar inspirasinya.',
    timeAgo: '5 jam yang lalu',
    senderName: 'Budi Santoso',
    senderRole: 'SMK TI Bali Global',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    projectId: 'proj-studyflow',
    createdAt: '2024-10-28T04:50:00Z',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'document_update',
    title: 'Pembaruan Berkas Tim',
    message: 'Siti Aminah memperbarui berkas diagram arsitektur database tim GreenSchool.',
    timeAgo: 'Kemarin, 16:45',
    senderName: 'Siti Aminah',
    senderRole: 'Project Lead',
    senderAvatar: images.sitiAvatar,
    projectId: 'proj-greenschool',
    fileVersion: 'Versi 1.3',
    createdAt: '2024-10-27T16:45:00Z',
    isRead: true
  }
];
