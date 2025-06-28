import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import DashboardTalentHub from '@/pages/Dashboard_talenthub';
import Profile from '@/pages/Profile';
import ProfileTalentHub from '@/pages/Profile_talenthub';
import PublicProfile from '@/pages/PublicProfile';
import Milestones from '@/pages/Milestones';
import OrganizationTalentHub from '@/pages/Organization_talenthub';
import PositionsTalentHub from '@/pages/Positions_talenthub';
import CandidatesTalentHub from '@/pages/Candidates_talenthub';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children, allowedPlatform }: { children: JSX.Element, allowedPlatform: 'careerforge' | 'talenthub' }) => {
  const { user } = useAuth();
  if (!user || !user.platform) return <Navigate to="/auth" replace />;
  if (user.platform !== allowedPlatform) return <Navigate to="/" replace />;
  return children;
};

export const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={
        user?.platform === 'talenthub' ?
          <ProtectedRoute allowedPlatform="talenthub"><DashboardTalentHub /></ProtectedRoute> :
          <ProtectedRoute allowedPlatform="careerforge"><Dashboard /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        user?.platform === 'talenthub' ?
          <ProtectedRoute allowedPlatform="talenthub"><ProfileTalentHub /></ProtectedRoute> :
          <ProtectedRoute allowedPlatform="careerforge"><Profile /></ProtectedRoute>
      } />
      <Route path="/profile/:userId" element={<PublicProfile />} />
      <Route path="/milestones" element={
        <ProtectedRoute allowedPlatform="careerforge"><Milestones /></ProtectedRoute>
      } />
      <Route path="/organization" element={
        <ProtectedRoute allowedPlatform="talenthub"><OrganizationTalentHub /></ProtectedRoute>
      } />
      <Route path="/positions" element={
        <ProtectedRoute allowedPlatform="talenthub"><PositionsTalentHub /></ProtectedRoute>
      } />
      <Route path="/candidates" element={
        <ProtectedRoute allowedPlatform="talenthub"><CandidatesTalentHub /></ProtectedRoute>
      } />
      {/* Add more platform-specific routes as needed */}
    </Routes>
  );
};
