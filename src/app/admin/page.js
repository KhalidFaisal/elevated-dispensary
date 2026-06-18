'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage for client-side API calls
      localStorage.setItem('admin_token', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-elevated-black flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <svg className="w-16 h-16 mx-auto text-elevated-emerald mb-4 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
          <h1 className="text-3xl font-black text-gradient mb-1">ELEVATED</h1>
          <p className="text-elevated-muted text-sm tracking-widest uppercase">Admin Dashboard</p>
        </div>

        {/* Login form */}
        <div className="glass-card p-8 glow-emerald">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-elevated-muted mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter admin password"
                autoFocus
                id="admin-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-3.5 disabled:opacity-50"
              id="admin-login-btn"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-elevated-muted/40 text-xs mt-6">
          ELEVATED Admin Panel — Authorized personnel only
        </p>
      </div>
    </div>
  );
}
