
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobCard } from './JobCard';
import { TrackedJob } from '@/types/jobs';

interface KanbanBoardProps {
  jobs: TrackedJob[];
  onStageChange: (jobId: string, stage: string) => void;
}

const STAGES = [
  { key: 'saved', label: 'Saved', color: 'bg-gray-50 border-gray-200' },
  { key: 'applied', label: 'Applied', color: 'bg-blue-50 border-blue-200' },
  { key: 'interview-1', label: 'Interview 1', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'interview-2', label: 'Interview 2', color: 'bg-orange-50 border-orange-200' },
  { key: 'offer', label: 'Offer', color: 'bg-green-50 border-green-200' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-50 border-emerald-200' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobs, onStageChange }) => {
  const getJobsForStage = (stage: string) => {
    return jobs.filter(job => {
      const jobStages = job.stage;
      if (stage === 'saved') return jobStages.saved && !jobStages.applied;
      if (stage === 'applied') return jobStages.applied && !jobStages['interview-1'];
      if (stage === 'interview-1') return jobStages['interview-1'] && !jobStages['interview-2'] && !jobStages.offer;
      if (stage === 'interview-2') return jobStages['interview-2'] && !jobStages['interview-3'] && !jobStages.offer;
      if (stage === 'offer') return jobStages.offer && !jobStages.hired;
      if (stage === 'hired') return jobStages.hired;
      return false;
    });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageJobs = getJobsForStage(stage.key);

        return (
          <div key={stage.key} className="flex-shrink-0 w-80">
            <Card className={`h-full ${stage.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{stage.label}</span>
                  <Badge variant="secondary">{stageJobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No applications in this stage</p>
                  </div>
                ) : (
                  stageJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onStageChange={onStageChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
