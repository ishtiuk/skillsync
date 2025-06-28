import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, TrendingUp, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { CreateMilestoneModal } from '@/components/milestones/CreateMilestoneModal';
import { milestones as milestonesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Milestones: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<{ milestoneId: string; task: string } | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const data = await milestonesApi.getAll();
      setMilestones(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load milestones', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (data: any) => {
    try {
      await milestonesApi.create(data);
      toast({ title: 'Milestone Created', description: 'Your milestone has been added.' });
      setIsCreateModalOpen(false);
      fetchMilestones();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create milestone', variant: 'destructive' });
    }
  };

  // Toggle task completion and update backend
  const handleToggleTask = async (milestone: any, task: string) => {
    setUpdatingTask({ milestoneId: milestone.id, task });
    try {
      const updatedTasks = { ...milestone.tasks, [task]: !milestone.tasks[task] };
      await milestonesApi.update(milestone.id, { tasks: updatedTasks });
      fetchMilestones();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task status', variant: 'destructive' });
    } finally {
      setUpdatingTask(null);
    }
  };

  const getMilestoneTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      'skill_development': 'Skill Development',
      'job_search': 'Job Search',
      'networking': 'Networking',
      'career_advancement': 'Career Advancement',
      'education': 'Education',
      'project_completion': 'Project Completion',
      'work_life_balance': 'Work-Life Balance',
      'financial': 'Financial',
      'entrepreneurship': 'Entrepreneurship',
      'mentorship': 'Mentorship',
      'professional_brand': 'Professional Brand',
      'remote_work': 'Remote Work'
    };
    return typeLabels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'skill_development': 'bg-blue-100 text-blue-800',
      'job_search': 'bg-green-100 text-green-800',
      'networking': 'bg-purple-100 text-purple-800',
      'career_advancement': 'bg-orange-100 text-orange-800',
      'education': 'bg-indigo-100 text-indigo-800',
      'project_completion': 'bg-yellow-100 text-yellow-800',
      'work_life_balance': 'bg-pink-100 text-pink-800',
      'financial': 'bg-emerald-100 text-emerald-800',
      'entrepreneurship': 'bg-red-100 text-red-800',
      'mentorship': 'bg-cyan-100 text-cyan-800',
      'professional_brand': 'bg-violet-100 text-violet-800',
      'remote_work': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const calculateProgress = (tasks: { [key: string]: boolean }) => {
    const totalTasks = Object.keys(tasks).length;
    const completedTasks = Object.values(tasks).filter(Boolean).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getCompletedTasksCount = (tasks: { [key: string]: boolean }) => {
    return Object.values(tasks).filter(Boolean).length;
  };

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.is_completed).length;
  const averageProgress = Math.round(
    milestones.reduce((sum, milestone) => sum + calculateProgress(milestone.tasks), 0) / totalMilestones
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8">
          <div className="absolute inset-0 bg-grid-primary/[0.02] bg-[size:32px_32px]" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Career Milestones
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">
                Track your professional development journey with meaningful milestones
              </p>
            </div>
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Milestone
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Milestones</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{totalMilestones}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedMilestones} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{averageProgress}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all milestones
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-foreground mt-1">2</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Milestones completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones List */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Your Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone) => {
                const progress = calculateProgress(milestone.tasks);
                const completedTasks = getCompletedTasksCount(milestone.tasks);
                const totalTasks = Object.keys(milestone.tasks).length;

                return (
                  <div key={milestone.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all duration-200">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                              {milestone.name}
                            </h3>
                            <Badge className={`text-xs font-medium ${getTypeColor(milestone.type)}`}>
                              {getMilestoneTypeLabel(milestone.type)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                        <Badge variant={milestone.is_completed ? 'default' : 'secondary'} className="ml-4">
                          {milestone.is_completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-semibold text-foreground">{progress}% ({completedTasks}/{totalTasks} tasks)</span>
                        </div>
                        <Progress value={progress} className="h-3 bg-muted" />

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Tasks:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(milestone.tasks).map(([task, completed]) => (
                              <div key={task} className="flex items-center gap-2 text-sm cursor-pointer select-none"
                                onClick={() => !updatingTask && handleToggleTask(milestone, task)}
                                style={{ opacity: updatingTask && updatingTask.milestoneId === milestone.id && updatingTask.task === task ? 0.5 : 1 }}
                              >
                                {completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>
                                  {task}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                          <span>Created: {new Date(milestone.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(milestone.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <CreateMilestoneModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateMilestone}
        />
      </div>
    </DashboardLayout>
  );
};

export default Milestones;
