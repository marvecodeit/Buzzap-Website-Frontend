'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = () => {
    getNotifications()
      .then((data) => {
        setItems(data.notifications || []);
        setUnread(data.unread || 0);
      })
      .catch(() => {});
  };

  // Load on mount, then poll every 30s (simple, no websockets).
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleItemClick = async (n) => {
    if (!n.read) {
      try {
        await markNotificationRead(n._id);
        setUnread((u) => Math.max(0, u - 1));
        setItems((list) => list.map((i) => (i._id === n._id ? { ...i, read: true } : i)));
      } catch {
        /* ignore */
      }
    }
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setItems((list) => list.map((i) => ({ ...i, read: true })));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="dash-bell" ref={ref}>
      <button className="dash-bell-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="dash-bell-dot">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="dash-bell-panel">
          <div className="dash-bell-head">
            <span>Notifications</span>
            {unread > 0 && (
              <button className="dash-bell-markall" onClick={handleMarkAll}>Mark all read</button>
            )}
          </div>
          <div className="dash-bell-list">
            {items.length === 0 ? (
              <p className="dash-bell-empty">You&apos;re all caught up.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n._id}
                  className={`dash-bell-item${n.read ? '' : ' unread'}`}
                  onClick={() => handleItemClick(n)}
                >
                  <span className="dash-bell-item-title">{n.title}</span>
                  {n.message && <span className="dash-bell-item-msg">{n.message}</span>}
                  <span className="dash-bell-item-time">{new Date(n.createdAt).toLocaleString()}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
