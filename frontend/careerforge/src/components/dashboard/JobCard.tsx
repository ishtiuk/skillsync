import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrackedJob } from '@/types/jobs';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: TrackedJob;
  onStageChange: (jobId: string, stage: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onStageChange }) => {
  const navigate = useNavigate();
  const getCurrentStage = () => {
    const stages = ['saved', 'applied', 'interview-1', 'interview-2', 'interview-3', 'offer', 'hired'];
    for (let i = stages.length - 1; i >= 0; i--) {
      if (job.stage[stages[i] as keyof typeof job.stage]) {
        return stages[i];
      }
    }
    return 'saved';
  };

  const getStageColor = (stage: string) => {
    const colors = {
      saved: 'bg-gray-100 text-gray-800',
      applied: 'bg-blue-100 text-blue-800',
      'interview-1': 'bg-yellow-100 text-yellow-800',
      'interview-2': 'bg-orange-100 text-orange-800',
      'interview-3': 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      hired: 'bg-emerald-100 text-emerald-800',
    };
    return colors[stage as keyof typeof colors] || colors.saved;
  };

  const currentStage = getCurrentStage();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={job.job_info.organization_logo_url} alt={job.job_info.organization_name} />
              <AvatarFallback>
                {job.job_info.organization_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {job.job_info.title}
              </h3>
              <p className="text-gray-600">{job.job_info.organization_name}</p>
            </div>
          </div>
          <Badge className={getStageColor(currentStage)}>
            {currentStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>📍 {job.job_info.city}, {job.job_info.state}</span>
            <span>💼 {job.job_info.position_type}</span>
            <span>🎓 {job.job_info.level_of_experience}</span>
          </div>

          {job.job_info.minimum_pay && job.job_info.maximum_pay && (
            <div className="text-sm text-gray-600">
              💰 ${job.job_info.minimum_pay?.toLocaleString()} - ${job.job_info.maximum_pay?.toLocaleString()}
              {job.job_info.pay_frequency && ` / ${job.job_info.pay_frequency}`}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Applied {formatDistanceToNow(new Date(job.created_at))} ago
          </div>

          {job.notes && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">{job.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStageChange(job.id, 'interview-1')}
              disabled={currentStage === 'hired'}
            >
              Update Stage
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={() => navigate(`/jobs/${job.id}`, { state: { job: job.job_info } })}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
