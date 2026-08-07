'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, FolderKanban, FileText, MessageSquare, Tag, Award, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from './NotificationBell';
import './dashboard.css';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/case-studies', label: 'Case Studies', icon: Award },
  { href: '/dashboard/blog', label: 'Blog', icon: FileText },
  { href: '/dashboard/pricing', label: 'Pricing', icon: Tag },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  // Guard: only authenticated admin/staff may view the dashboard.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else if (user.role !== 'admin' && user.role !== 'staff') {
      router.replace('/');
    }
  }, [loading, user, router]);

  // While checking the session (or redirecting), show a lightweight loader.
  if (loading || !user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-mark">B</span>
          <span className="dash-brand-name">Buzzap<span>HQ</span></span>
        </div>

        <nav className="dash-nav">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`dash-nav-link${active ? ' active' : ''}`}>
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <span className="dash-user-avatar">{user.name?.[0]?.toUpperCase() || 'A'}</span>
            <div className="dash-user-meta">
              <span className="dash-user-name">{user.name}</span>
              <span className="dash-user-role">{user.role}</span>
            </div>
          </div>
          <button className="dash-signout" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  );
}
