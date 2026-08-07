'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Send, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getConversations, createConversation, getMessages, sendMessage } from '@/lib/api';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const loadConversations = useCallback(() => {
    getConversations()
      .then((data) => {
        setConversations(data.conversations || []);
        if (!activeId && data.conversations?.length) setActiveId(data.conversations[0]._id);
      })
      .catch((err) => setError(err.message || 'Failed to load conversations'));
  }, [activeId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages when the active thread changes, then poll every 15s.
  useEffect(() => {
    if (!activeId) return undefined;
    let active = true;
    const load = () =>
      getMessages(activeId)
        .then((data) => {
          if (active) setMessages(data.messages || []);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [activeId]);

  // Auto-scroll to newest message.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    setSending(true);
    try {
      const { message } = await sendMessage(activeId, draft.trim());
      setMessages((prev) => [...prev, message]);
      setDraft('');
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleNewThread = async () => {
    const subject = window.prompt('Subject for the new conversation?');
    if (subject === null) return;
    try {
      const { conversation } = await createConversation({ subject: subject || 'Untitled' });
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation._id);
      setMessages([]);
    } catch (err) {
      setError(err.message || 'Failed to create conversation');
    }
  };

  const activeConv = conversations.find((c) => c._id === activeId);

  return (
    <>
      <div className="dash-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="dash-page-title">Messages</h1>
          <p className="dash-page-sub">Internal team conversations.</p>
        </div>
        <button className="dash-btn" onClick={handleNewThread}>
          <Plus size={15} /> New thread
        </button>
      </div>

      {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

      <div className="dash-msg-layout">
        <div className="dash-msg-threads">
          {conversations.length === 0 ? (
            <p className="dash-bell-empty">No conversations yet.</p>
          ) : (
            conversations.map((c) => (
              <button
                key={c._id}
                className={`dash-msg-thread${c._id === activeId ? ' active' : ''}`}
                onClick={() => setActiveId(c._id)}
              >
                <span className="dash-msg-thread-title">{c.subject || 'Untitled'}</span>
                {c.project?.title && <span className="dash-msg-thread-sub">{c.project.title}</span>}
              </button>
            ))
          )}
        </div>

        <div className="dash-msg-pane">
          {!activeId ? (
            <p className="dash-msg">Select or start a conversation.</p>
          ) : (
            <>
              <div className="dash-msg-pane-head">{activeConv?.subject || 'Conversation'}</div>
              <div className="dash-msg-scroll" ref={scrollRef}>
                {messages.length === 0 ? (
                  <p className="dash-bell-empty">No messages yet. Say hello.</p>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender?._id === user?.id || m.sender === user?.id;
                    return (
                      <div key={m._id} className={`dash-msg-bubble${mine ? ' mine' : ''}`}>
                        {!mine && <span className="dash-msg-sender">{m.sender?.name || 'User'}</span>}
                        <span className="dash-msg-body">{m.body}</span>
                        <span className="dash-msg-time">{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <form className="dash-msg-compose" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="dash-btn" disabled={sending || !draft.trim()}>
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
