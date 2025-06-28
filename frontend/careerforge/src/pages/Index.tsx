import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import Auth from './Auth';

const Index: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Auth />;
  }

  // CareerForge only accepts careerforge platform users
  if (user.platform !== 'careerforge') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This is the CareerForge platform for job seekers.</p>
          <p className="text-gray-600">Please use the TalentHub platform for recruiter access.</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
