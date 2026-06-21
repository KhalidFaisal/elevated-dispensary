'use client';

import { useState } from 'react';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 bg-hero-gradient relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-md w-full animate-fade-in-up">
        {/* Leaf icon */}
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-pc-green animate-float"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="text-5xl font-black text-gradient mb-2 tracking-tight">
          ELEVATED
        </h1>
        <p className="text-pc-muted text-sm mb-8 tracking-widest uppercase">
          Rise Above
        </p>

        {/* Password Form */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Enter Password
          </h2>
          <p className="text-pc-muted text-sm mb-6">
            This site is protected. Please enter the password to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="bg-pc-dark border border-pc-border text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pc-green transition-all w-full text-center"
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full btn-primary text-lg py-4"
              id="password-submit"
            >
              Enter
            </button>
          </form>
        </div>

        <p className="text-pc-muted/50 text-xs">
          By entering this site, you confirm that you are of legal age in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
