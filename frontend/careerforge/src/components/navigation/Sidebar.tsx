import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Search,
  Target,
  Users,
  Settings,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
    description: 'Overview'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    description: 'My Profile'
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: Search,
    path: '/jobs',
    description: 'Find Jobs'
  },
  {
    id: 'milestones',
    label: 'Milestones',
    icon: Target,
    path: '/milestones',
    description: 'Career Milestones'
  },
  {
    id: 'network',
    label: 'Network',
    icon: Users,
    path: '/network',
    description: 'Connections'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    path: '/insights',
    description: 'Analytics'
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: FileText,
    path: '/resources',
    description: 'Tools'
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo Section - More Compact */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">CareerForge</h2>
            <p className="text-xs text-gray-500">Job Seeker Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items - More Compact */}
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
                  ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 mr-3",
                isActive ? "text-emerald-600" : "text-gray-400"
              )} />
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <span className="font-medium text-sm">{item.label}</span>
                {item.id === 'jobs' && (
                  <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/settings')}
          className="w-full justify-start h-10 px-3 text-gray-600 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4 mr-3" />
          <span className="text-sm">Settings</span>
        </Button>
      </div>
    </div>
  );
};
