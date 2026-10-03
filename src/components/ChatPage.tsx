import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, Search, Send } from 'lucide-react';
import { ChatMessage, Student } from '../types';

interface ChatPageProps {
  messages: ChatMessage[];
  currentUser: Student;
  initialConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onSendMessage: (conversation: Pick<ChatMessage, 'conversationId' | 'recipientId' | 'recipientName' | 'recipientAvatar'>, body: string) => void;
  onMarkRead: (conversationId: string) => void;
  onBack: () => void;
}

interface Conversation {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar?: string;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
}

const formatTime = (date: string) => new Date(date).toLocaleTimeString('id-ID', {
  hour: '2-digit',
  minute: '2-digit'
});

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  currentUser,
  initialConversationId,
  onSelectConversation,
  onSendMessage,
  onMarkRead,
  onBack
}) => {
  const [activeId, setActiveId] = useState(initialConversationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(initialConversationId));
  const messageEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const conversations = useMemo(() => {
    const grouped = new Map<string, Conversation>();
    for (const message of messages) {
      if (message.projectId) continue;
      if (message.senderId !== currentUser.id && message.recipientId !== currentUser.id) continue;
      const isOutgoing = message.senderId === currentUser.id;
      const peerId = isOutgoing ? message.recipientId : message.senderId;
      const peerName = isOutgoing ? message.recipientName : message.senderName;
      const peerAvatar = isOutgoing ? message.recipientAvatar : message.senderAvatar;
      const conversation = grouped.get(message.conversationId) ?? {
        id: message.conversationId,
        peerId,
        peerName,
        peerAvatar,
        messages: [],
        lastMessage: message
      };
      conversation.messages.push(message);
      if (new Date(message.createdAt).getTime() >= new Date(conversation.lastMessage.createdAt).getTime()) {
        conversation.lastMessage = message;
        conversation.peerName = peerName;
        conversation.peerAvatar = peerAvatar;
      }
      grouped.set(message.conversationId, conversation);
    }
    return [...grouped.values()]
      .map((conversation) => ({
        ...conversation,
        messages: conversation.messages.sort((first, second) =>
          new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime())
      }))
      .sort((first, second) =>
        new Date(second.lastMessage.createdAt).getTime() - new Date(first.lastMessage.createdAt).getTime());
  }, [messages, currentUser.id]);

  const filteredConversations = useMemo(() => conversations.filter((conversation) =>
    conversation.peerName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ), [conversations, searchQuery]);

  useEffect(() => {
    if (initialConversationId) {
      setActiveId(initialConversationId);
      setMobileChatOpen(true);
    }
  }, [initialConversationId]);

  useEffect(() => {
    if ((!activeId || !conversations.some((conversation) => conversation.id === activeId)) && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  const activeConversation = conversations.find((conversation) => conversation.id === activeId);

  useEffect(() => {
    if (activeConversation) onMarkRead(activeConversation.id);
  }, [activeConversation?.id, activeConversation?.lastMessage.id, onMarkRead]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeConversation?.lastMessage.id]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveId(conversationId);
    setMobileChatOpen(true);
    onSelectConversation(conversationId);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!activeConversation || !body) return;
    onSendMessage({
      conversationId: activeConversation.id,
      recipientId: activeConversation.peerId,
      recipientName: activeConversation.peerName,
      recipientAvatar: activeConversation.peerAvatar
    }, body);
    setDraft('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8 md:py-6">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke notifikasi
        </button>
        <h1 className="text-sm font-bold text-slate-900">Obrolan</h1>
      </div>
      <section className="grid h-[calc(100dvh-8rem)] min-h-[480px] grid-cols-1 overflow-hidden border border-slate-200 bg-white shadow-sm md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className={`${mobileChatOpen ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-slate-200`}>
          <div className="border-b border-slate-200 px-4 py-4">
            <h1 className="text-xl font-bold text-slate-900">Obrolan</h1>
            <label className="relative mt-3 block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari percakapan"
                className="w-full rounded-lg bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">Belum ada obrolan.</div>
            ) : filteredConversations.map((conversation) => {
              const unreadCount = conversation.messages.filter((message) =>
                message.recipientId === currentUser.id && !message.isRead
              ).length;
              const isActive = conversation.id === activeId;
              return (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${isActive ? 'bg-blue-50/70' : 'bg-white'}`}
                >
                  {conversation.peerAvatar ? (
                    <img src={conversation.peerAvatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {conversation.peerName.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{conversation.peerName}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">{formatTime(conversation.lastMessage.createdAt)}</span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-slate-500">{conversation.lastMessage.body}</span>
                      {unreadCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={`${mobileChatOpen ? 'flex' : 'hidden md:flex'} min-h-0 flex-col bg-slate-50`}>
          {activeConversation ? (
            <>
              <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 sm:px-5">
                <button onClick={() => setMobileChatOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Kembali ke daftar obrolan">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                {activeConversation.peerAvatar ? (
                  <img src={activeConversation.peerAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{activeConversation.peerName.slice(0, 1).toUpperCase()}</span>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-slate-900">{activeConversation.peerName}</h2>
                  <p className="text-[11px] text-slate-500">Percakapan tersimpan lokal</p>
                </div>
              </header>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-slate-100/70 px-3 py-4 sm:px-6">
                {activeConversation.messages.map((message) => {
                  const isOutgoing = message.senderId === currentUser.id;
                  return (
                    <div key={message.id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                      <article className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm sm:max-w-[75%] ${isOutgoing ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'}`}>
                        {!isOutgoing && <p className="mb-1 text-[10px] font-bold text-blue-700">{message.senderName}</p>}
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
                        <p className={`mt-1 text-right text-[10px] ${isOutgoing ? 'text-blue-100' : 'text-slate-400'}`}>{formatTime(message.createdAt)}</p>
                      </article>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
              <form ref={formRef} onSubmit={handleSubmit} className="flex shrink-0 items-end gap-2 border-t border-slate-200 bg-white p-3 sm:px-5">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={2000}
                  placeholder="Ketik pesan"
                  className="max-h-28 min-h-11 flex-1 resize-y rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <button type="submit" disabled={!draft.trim()} aria-label="Kirim pesan" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><MessageCircle className="h-8 w-8" /></span>
              <h2 className="text-lg font-bold text-slate-900">Pilih obrolan</h2>
              <p className="max-w-xs text-sm text-slate-500">Balas pesan dari notifikasi untuk memulai percakapan.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};
