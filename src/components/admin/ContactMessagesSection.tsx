import { useEffect, useMemo, useState } from 'react';
import {
  Inbox,
  Mail,
  MailOpen,
  MailCheck,
  Archive,
  Trash2,
  Phone,
  Building2,
  User,
  Clock,
  RefreshCw,
  Search,
  ChevronDown,
  Hash,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { mapConsultationRequestRow } from '../../lib/supabaseMappers';
import { ContactMessage, ContactMessageStatus, Language } from '../../types';
import { useCMS } from '../../context/CMSContext';

interface ContactMessagesSectionProps {
  currentLang: Language;
}

type Filter = 'all' | 'new' | 'read' | 'replied' | 'archived';

export function ContactMessagesSection({ currentLang }: ContactMessagesSectionProps) {
  const { refreshUnreadContactMessages } = useCMS();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMessages((data ?? []).map(mapConsultationRequestRow));
    } catch (err: any) {
      console.error('Failed to load consultation requests:', err);
      setError(err.message ?? 'Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: string, status: ContactMessageStatus) => {
    const now = new Date().toISOString();
    const patch: Record<string, any> = { status };
    const target = messages.find((m) => m.id === id);
    if (status === 'read' && target && !target.readAt) {
      patch.read_at = now;
    }
    if (status === 'replied') {
      patch.replied_at = now;
    }

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              readAt: patch.read_at ?? m.readAt,
              repliedAt: patch.replied_at ?? m.repliedAt,
            }
          : m
      )
    );

    const { error: updateError } = await supabase
      .from('consultation_requests')
      .update(patch)
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update consultation request status:', updateError.message);
      void fetchMessages();
    } else {
      void refreshUnreadContactMessages();
    }
  };

  const deleteMessage = async (id: string) => {
    const previous = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));

    const { error: deleteError } = await supabase
      .from('consultation_requests')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Failed to delete consultation request:', deleteError.message);
      setMessages(previous);
    } else {
      void refreshUnreadContactMessages();
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false;
      if (!q) return true;
      return (
        m.companyName.toLowerCase().includes(q) ||
        m.contactPerson.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.trackingRef ?? '').toLowerCase().includes(q)
      );
    });
  }, [messages, filter, search]);

  const counts = useMemo(
    () => ({
      all: messages.length,
      new: messages.filter((m) => m.status === 'new').length,
      read: messages.filter((m) => m.status === 'read').length,
      replied: messages.filter((m) => m.status === 'replied').length,
      archived: messages.filter((m) => m.status === 'archived').length,
    }),
    [messages]
  );

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(currentLang === 'FR' ? 'fr-FR' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const statusBadge = (status: ContactMessageStatus) => {
    const map: Record<ContactMessageStatus, { label: string; cls: string }> = {
      new: {
        label: currentLang === 'FR' ? 'Nouveau' : 'New',
        cls: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      read: {
        label: currentLang === 'FR' ? 'Lu' : 'Read',
        cls: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      replied: {
        label: currentLang === 'FR' ? 'Répondu' : 'Replied',
        cls: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      },
      archived: {
        label: currentLang === 'FR' ? 'Archivé' : 'Archived',
        cls: 'bg-slate-200 text-slate-700 border-slate-300',
      },
    };
    const item = map[status];
    return (
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${item.cls}`}
      >
        {item.label}
      </span>
    );
  };

  const filterButton = (key: Filter, label: string, count: number) => (
    <button
      type="button"
      onClick={() => setFilter(key)}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
        filter === key
          ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
          : 'bg-white text-slate-700 border-slate-300 hover:border-[#0f4c81]'
      }`}
    >
      {label}
      <span className="ml-1.5 opacity-70">({count})</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#0f4c81]" />
            <span>
              {currentLang === 'FR'
                ? 'Messages & Demandes Clients'
                : 'Client Messages & Requests'}
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'FR'
              ? 'Consultez les demandes de consultation reçues via le formulaire de contact.'
              : 'Review consultation requests received through the contact form.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchMessages()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{currentLang === 'FR' ? 'Rafraîchir' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filters + search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-3">
        <div className="flex flex-wrap gap-2">
          {filterButton('all', currentLang === 'FR' ? 'Tous' : 'All', counts.all)}
          {filterButton('new', currentLang === 'FR' ? 'Nouveaux' : 'New', counts.new)}
          {filterButton('read', currentLang === 'FR' ? 'Lus' : 'Read', counts.read)}
          {filterButton('replied', currentLang === 'FR' ? 'Répondus' : 'Replied', counts.replied)}
          {filterButton('archived', currentLang === 'FR' ? 'Archivés' : 'Archived', counts.archived)}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              currentLang === 'FR'
                ? 'Rechercher par nom, entreprise, référence...'
                : 'Search by name, company, reference...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#0f4c81] outline-none"
          />
        </div>
      </div>

      {/* Loading / error / empty */}
      {isLoading && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {currentLang === 'FR' ? 'Chargement des messages...' : 'Loading messages...'}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {currentLang === 'FR'
            ? 'Aucun message ne correspond à votre recherche.'
            : 'No messages match your search.'}
        </div>
      )}

      {/* Message list */}
      <div className="space-y-3">
        {filtered.map((msg) => {
          const isExpanded = expandedId === msg.id;
          return (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl border shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all ${
                msg.status === 'new' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200/80'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setExpandedId(isExpanded ? null : msg.id);
                  if (!isExpanded && msg.status === 'new') {
                    void updateStatus(msg.id, 'read');
                  }
                }}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 text-left cursor-pointer"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(msg.status)}
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.createdAt)}
                    </span>
                    {msg.trackingRef && (
                      <span className="text-[10px] font-mono text-[#0f4c81] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {msg.trackingRef}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {msg.contactPerson || '—'}
                    </span>
                    {msg.companyName && (
                      <span className="text-xs text-slate-600 flex items-center gap-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {msg.companyName}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-4">
                  {msg.trackingRef && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        {currentLang === 'FR' ? 'Référence de suivi' : 'Tracking Reference'}
                      </span>
                      <span className="font-mono text-xs text-[#0f4c81] font-bold inline-flex items-center gap-1.5">
                        <Hash className="w-3 h-3" />
                        {msg.trackingRef}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      {currentLang === 'FR' ? 'Service demandé' : 'Service requested'}
                    </span>
                    <span className="text-sm text-slate-800">{msg.serviceType || '—'}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      {currentLang === 'FR' ? 'Message' : 'Message'}
                    </span>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 rounded-lg p-3 border border-slate-200">
                      {msg.message || '—'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        currentLang === 'FR'
                          ? `Re: Votre demande ${msg.trackingRef ?? ''} - Cabinet Chia-SN`
                          : `Re: Your inquiry ${msg.trackingRef ?? ''} - Chia-SN Advisory`
                      )}`}
                      onClick={() => {
                        if (msg.status !== 'replied') void updateStatus(msg.id, 'replied');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0f4c81] hover:bg-[#1d70b8] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <MailCheck className="w-3.5 h-3.5" />
                      {currentLang === 'FR' ? 'Répondre par email' : 'Reply by email'}
                    </a>

                    {msg.status !== 'read' && (
                      <button
                        type="button"
                        onClick={() => void updateStatus(msg.id, 'read')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer"
                      >
                        <MailOpen className="w-3.5 h-3.5" />
                        {currentLang === 'FR' ? 'Marquer comme lu' : 'Mark as read'}
                      </button>
                    )}

                    {msg.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => void updateStatus(msg.id, 'archived')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        {currentLang === 'FR' ? 'Archiver' : 'Archive'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            currentLang === 'FR'
                              ? 'Supprimer ce message ?'
                              : 'Delete this message?'
                          )
                        ) {
                          void deleteMessage(msg.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors ml-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {currentLang === 'FR' ? 'Supprimer' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}