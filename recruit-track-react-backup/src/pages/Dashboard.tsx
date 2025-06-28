
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { JobCard } from '@/components/dashboard/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Bookmark,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  Eye,
  Settings
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const jobTrackerStats = [
    { label: 'Saved', count: 3, color: 'bg-blue-100 text-blue-600' },
    { label: 'Applied', count: 0, color: 'bg-gray-100 text-gray-600' },
    { label: 'Interview', count: 1, color: 'bg-orange-100 text-orange-600' },
    { label: 'Offers', count: 0, color: 'bg-gray-100 text-gray-600' },
    { label: 'Hired', count: 0, color: 'bg-gray-100 text-gray-600' },
  ];

  const savedJobs = [
    {
      id: 1,
      title: 'Sustainability Consultant (Analyst Level)',
      company: 'Green Jobs Board',
      date: 'Sep 12',
      logo: '🌱'
    },
    {
      id: 2,
      title: 'Digital Marketing and Communications Manager',
      company: 'The Nature Conservancy',
      date: 'Sep 12',
      logo: '🌿'
    }
  ];

  const interviewingJobs = [
    {
      id: 1,
      title: 'Director of Development',
      company: 'Waterfront Alliance',
      date: 'Sep 12',
      logo: '🌊'
    }
  ];

  const careerPaths = [
    { name: 'Agriculture', jobs: 6, icon: '🥕', color: 'bg-green-50' },
    { name: 'Conservation', jobs: 95, icon: '🏔️', color: 'bg-blue-50' },
    { name: 'Construction', jobs: 6, icon: '🏗️', color: 'bg-orange-50' },
    { name: 'Education', jobs: 23, icon: '🍎', color: 'bg-red-50' }
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Sustainability Consultant (Analyst Level)',
      company: 'Green Jobs Board',
      type: 'Remote',
      schedule: 'Full Time',
      featured: true,
      logo: '🌱'
    },
    {
      id: 2,
      title: 'Executive Director',
      company: 'Conservation Corps Minnesota and Iowa',
      type: 'Hybrid',
      schedule: 'Full Time',
      featured: true,
      logo: '🌲'
    },
    {
      id: 3,
      title: 'Executive Director',
      company: 'Luckiamute Watershed Council',
      type: 'Onsite',
      schedule: 'Full Time',
      featured: true,
      logo: '💧'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
        </div>

        {/* Job Tracker Pipeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Your Job Tracker</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Your Jobs
            </Button>
          </CardHeader>
          <CardContent>
            {/* Pipeline Stats */}
            <div className="flex items-center gap-2 mb-6">
              {jobTrackerStats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${stat.color} text-lg font-bold`}>
                      {stat.count > 0 ? stat.count : '-'}
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{stat.label}</span>
                  </div>
                  {index < jobTrackerStats.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-[-20px]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Job Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Saved Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Saved</span>
                    <Badge variant="secondary">{savedJobs.length}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Manage Jobs</Button>
                </div>
                <div className="space-y-3">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{job.title}</h4>
                        <p className="text-xs text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-500">{job.date}</p>
                      </div>
                      <Button variant="outline" size="sm">View Job</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interviewing Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Interviewing</span>
                    <Badge variant="secondary">{interviewingJobs.length}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Manage Jobs</Button>
                </div>
                <div className="space-y-3">
                  {interviewingJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{job.title}</h4>
                        <p className="text-xs text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-500">{job.date}</p>
                      </div>
                      <Button variant="outline" size="sm">View Job</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Path Exploration */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Discover various paths</h2>
                <p className="text-gray-600 mb-4">to help you find your climate space.</p>
                <Button variant="outline">
                  Explore Jobs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {careerPaths.map((path) => (
                  <div key={path.name} className={`${path.color} p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer`}>
                    <div className="text-2xl mb-2">{path.icon}</div>
                    <h3 className="font-medium text-sm">{path.name}</h3>
                    <p className="text-xs text-gray-600">{path.jobs} Jobs</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Featured Jobs</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View all jobs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">{job.company}</p>
                      </div>
                    </div>
                    {job.featured && (
                      <Badge variant="default" className="text-xs">Featured</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-3">{job.title}</h3>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.schedule}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
