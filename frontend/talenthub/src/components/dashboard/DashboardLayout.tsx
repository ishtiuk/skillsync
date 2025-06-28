
import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="talenthub-theme min-h-screen flex w-full bg-[hsl(var(--talenthub-secondary))]">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[hsl(var(--talenthub-secondary))]">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
