
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileDashboard } from '@/components/profile/ProfileDashboard';
import { Button } from '@/components/ui/button';
import { Settings, Eye } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'edit'>('dashboard');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <ProfileHeader />

        {/* View Toggle */}
        <div className="flex gap-2 mt-6 mb-8">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Profile Overview
          </Button>
          <Button
            variant={activeView === 'edit' ? 'default' : 'outline'}
            onClick={() => setActiveView('edit')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Update Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>
          <div className="lg:col-span-3">
            {activeView === 'dashboard' ? (
              <ProfileDashboard />
            ) : (
              <ProfileForm />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
