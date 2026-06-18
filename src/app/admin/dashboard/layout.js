'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminDashboardLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
        router.push('/admin');
      });
      return;
    }
    setAuthed(true);
  }, [router]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elevated-black">
        <div className="animate-pulse text-elevated-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-elevated-black">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-elevated-dark border-b border-elevated-border shrink-0">
        <span className="text-lg font-black tracking-tight text-gradient">ELEVATED ADMIN</span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-elevated-muted hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block z-40 shrink-0 h-full`}>
        <AdminSidebar onNavClick={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
