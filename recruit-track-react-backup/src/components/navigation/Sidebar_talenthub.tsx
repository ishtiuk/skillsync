import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Users,
  Building2,
  Target,
  Settings,
  FileText,
  TrendingUp,
  BrainCircuit,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useHandleLogout } from '@/hooks/useAuth';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/talenthub',
    description: 'Overview'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/talenthub/profile',
    description: 'My Profile'
  },
  {
    id: 'positions',
    label: 'Positions',
    icon: Target,
    path: '/talenthub/positions',
    description: 'Open Roles'
  },
  {
    id: 'candidates',
    label: 'Candidates',
    icon: Users,
    path: '/talenthub/candidates',
    description: 'Talent Pool'
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: Building2,
    path: '/talenthub/organization',
    description: 'Company Setup'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    path: '/talenthub/insights',
    description: 'Analytics'
  },
  {
    id: 'ai-matching',
    label: 'AI Matching',
    icon: BrainCircuit,
    path: '/talenthub/ai-matching',
    description: 'Smart Recruitment'
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: FileText,
    path: '/talenthub/resources',
    description: 'Tools'
  }
];

export const SidebarTalentHub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = useHandleLogout();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleCreatePosition = () => {
    navigate('/talenthub/create-position');
  };

  return (
    <div className="w-56 bg-[hsl(var(--talenthub-sidebar-background))] border-r border-[hsl(var(--talenthub-sidebar-border))] h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-[hsl(var(--talenthub-sidebar-border))]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[hsl(var(--talenthub-sidebar-foreground))]">TalentHub</h2>
            <p className="text-xs text-[hsl(var(--talenthub-sidebar-foreground))]/70">Recruiter Portal</p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <Button
          onClick={handleCreatePosition}
          className="w-full bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Position
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full justify-start h-10 px-3 text-left relative group",
                isActive
                  ? "bg-[hsl(var(--talenthub-sidebar-accent))] text-[hsl(var(--talenthub-primary))] border-r-2 border-[hsl(var(--talenthub-primary))]"
                  : "text-[hsl(var(--talenthub-sidebar-foreground))]/80 hover:bg-[hsl(var(--talenthub-sidebar-accent))]/50 hover:text-[hsl(var(--talenthub-sidebar-foreground))]"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 mr-3",
                isActive ? "text-[hsl(var(--talenthub-primary))]" : "text-[hsl(var(--talenthub-sidebar-foreground))]/60"
              )} />
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <span className="font-medium text-sm">{item.label}</span>
                {item.id === 'ai-matching' && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-[hsl(var(--talenthub-primary))]/20 text-[hsl(var(--talenthub-primary))]">AI</Badge>
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[hsl(var(--talenthub-sidebar-border))] space-y-2">
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/talenthub/settings')}
          className="w-full justify-start h-10 px-3 text-[hsl(var(--talenthub-sidebar-foreground))]/80 hover:bg-[hsl(var(--talenthub-sidebar-accent))]/50"
        >
          <Settings className="w-4 h-4 mr-3" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start h-10 px-3 text-red-600 hover:bg-red-50"
        >
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
};
