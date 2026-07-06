import React, { useState, useEffect } from 'react';
import { Sidebar, type Page } from './Sidebar';
import { TopBar } from './TopBar';
import { AuthProvider } from '../auth/AuthProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar currentPage={currentPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-60 overflow-hidden min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} isDark={isDark} onToggleDark={toggleDark} currentPage={currentPage} />
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};
