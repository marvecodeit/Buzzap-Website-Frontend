'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already signed in → go straight to the dashboard.
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(form.email, form.password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err.status === 401 ? 'Invalid email or password.' : err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-viewport">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-badge">
          <LogIn size={18} />
        </div>
        <h1 className="login-title">Admin sign in</h1>
        <p className="login-subtitle">Sign in to manage leads, projects, and analytics.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              placeholder="admin@buzzaphq.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
