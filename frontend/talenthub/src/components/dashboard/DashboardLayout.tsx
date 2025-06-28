
import React from 'react';
import { SidebarTalentHub } from '@/components/navigation/Sidebar';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutTalentHubProps {
  children: React.ReactNode;
}

export const DashboardLayoutTalentHub: React.FC<DashboardLayoutTalentHubProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="talenthub-theme min-h-screen flex w-full bg-[hsl(var(--talenthub-secondary))]">
      <SidebarTalentHub />
      <main className="flex-1 overflow-auto bg-[hsl(var(--talenthub-secondary))]">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
