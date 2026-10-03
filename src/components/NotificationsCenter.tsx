import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  MessageSquare, 
  ArrowRight, 
  Download, 
  Bookmark, 
  FileText, 
  UserCheck, 
  Bell, 
  Settings,
  Star,
  ExternalLink
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsCenterProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  onOpenProjectDetail: (projectId: string) => void;
  onReplyFeedback: (notif: NotificationItem) => void;
  currentUserId: string;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  onMarkAllAsRead,
  onUpdateStatus,
  onOpenProjectDetail,
  onReplyFeedback,
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'reviews' | 'others'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const counts = useMemo(() => {
    const all = notifications.length;
    const requests = notifications.filter((n) => n.type === 'team_request' || n.type === 'team_invitation').length;
    const reviews = notifications.filter((n) => n.type === 'mentor_review').length;
    const others = notifications.filter((n) => n.type === 'save_project' || n.type === 'document_update' || n.type === 'message_reply').length;
    return { all, requests, reviews, others };
  }, [notifications]);

  const filteredNotifs = useMemo(() => {
    if (activeTab === 'requests') {
      return notifications.filter((n) => n.type === 'team_request' || n.type === 'team_invitation');
    }
    if (activeTab === 'reviews') {
      return notifications.filter((n) => n.type === 'mentor_review');
    }
    if (activeTab === 'others') {
      return notifications.filter((n) => n.type === 'save_project' || n.type === 'document_update' || n.type === 'message_reply');
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleDownload = (notification: NotificationItem) => {
    const content = `${notification.title}\n${notification.message}\nDari: ${notification.senderName}\nVersi: ${notification.fileVersion ?? '-'}\n`;
    const fileUrl = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `projecthub-${notification.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    setDownloadSuccess(notification.id);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Title and Action (matching Image 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-1">
            Notifikasi / Pusat Aktivitas
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pusat Aktivitas & Notifikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola interaksi proyek, permintaan tim masuk, evaluasi guru, dan percakapan anggota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Semua</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Permintaan Tim</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'requests' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {counts.requests}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Evaluasi & Komentar</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'reviews' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {counts.reviews}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('others')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'others'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Aktivitas Lain</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'others' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {counts.others}
          </span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            Tidak ada notifikasi pada kategori ini.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-sm ${
                  !notif.isRead ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  
                  {/* Sender Avatar */}
                  {notif.senderAvatar ? (
                    <img
                      src={notif.senderAvatar}
                      alt={notif.senderName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {notif.senderName[0]}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{notif.senderName}</span>
                        {notif.senderRole && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                              {notif.senderRole}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        ⏱ {notif.timeAgo}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action Status Banner if already acted upon */}
                    {notif.actionStatus && notif.actionStatus !== 'pending' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Permintaan telah {notif.actionStatus === 'accepted' ? 'diterima' : 'ditolak'}</span>
                      </div>
                    )}

                    {/* Action Buttons for Team Request or Invitation */}
                    {notif.actionRequired && notif.actionStatus === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => onUpdateStatus(notif.id, 'accepted')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Terima Permintaan</span>
                        </button>

                        <button
                          onClick={() => onUpdateStatus(notif.id, 'rejected')}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>

                        {notif.projectId && (
                          <button
                            onClick={() => onOpenProjectDetail(notif.projectId!)}
                            className="px-2.5 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 ml-auto"
                          >
                            <span>Lihat Portofolio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action buttons for Mentor Review */}
                    {notif.type === 'mentor_review' && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => onReplyFeedback(notif)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Balas Pesan</span>
                        </button>

                        {notif.projectId && (
                          <button
                            onClick={() => onOpenProjectDetail(notif.projectId!)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            <span>Buka Catatan Lengkap</span>
                          </button>
                        )}
                      </div>
                    )}

                    {(notif.type === 'team_request' || notif.type === 'team_invitation' || notif.type === 'message_reply') && notif.senderId !== currentUserId && (
                      <button
                        onClick={() => onReplyFeedback(notif)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Balas Pesan
                      </button>
                    )}

                    {/* Action buttons for Document Update */}
                    {notif.type === 'document_update' && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {notif.fileVersion}
                        </span>
                        <button
                          onClick={() => handleDownload(notif)}
                          className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadSuccess === notif.id ? 'Terunduh!' : 'Simpan Ringkasan'}</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
