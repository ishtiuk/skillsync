
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackedJob } from '@/types/jobs';

interface StatsCardsProps {
  jobs: TrackedJob[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ jobs }) => {
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter(job => job.stage.applied).length;
  const interviewJobs = jobs.filter(job =>
    job.stage['interview-1'] || job.stage['interview-2'] || job.stage['interview-3']
  ).length;
  const offerJobs = jobs.filter(job => job.stage.offer).length;
  const hiredJobs = jobs.filter(job => job.stage.hired).length;

  const stats = [
    {
      title: 'Total Tracked',
      value: totalJobs,
      description: 'Jobs being tracked',
      color: 'text-blue-600',
    },
    {
      title: 'Applications',
      value: appliedJobs,
      description: 'Applications submitted',
      color: 'text-green-600',
    },
    {
      title: 'Interviews',
      value: interviewJobs,
      description: 'Interview opportunities',
      color: 'text-yellow-600',
    },
    {
      title: 'Offers',
      value: offerJobs,
      description: 'Job offers received',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
