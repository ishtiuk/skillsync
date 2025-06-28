import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

type MilestoneType =
  | 'skill_development'
  | 'job_search'
  | 'networking'
  | 'career_advancement'
  | 'education'
  | 'project_completion'
  | 'work_life_balance'
  | 'financial'
  | 'entrepreneurship'
  | 'mentorship'
  | 'professional_brand'
  | 'remote_work';

interface CreateMilestoneData {
  name: string;
  type: MilestoneType;
  description: string;
  tasks: { [key: string]: boolean };
}

interface CreateMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateMilestoneData) => void;
}

const milestoneTypes: { value: MilestoneType; label: string }[] = [
  { value: 'skill_development', label: 'Skill Development' },
  { value: 'job_search', label: 'Job Search' },
  { value: 'networking', label: 'Networking' },
  { value: 'career_advancement', label: 'Career Advancement' },
  { value: 'education', label: 'Education' },
  { value: 'project_completion', label: 'Project Completion' },
  { value: 'work_life_balance', label: 'Work-Life Balance' },
  { value: 'financial', label: 'Financial' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'professional_brand', label: 'Professional Brand' },
  { value: 'remote_work', label: 'Remote Work' },
];

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');

  const form = useForm<CreateMilestoneData>({
    defaultValues: {
      name: '',
      type: 'skill_development',
      description: '',
      tasks: {},
    },
  });

  const handleAddTask = () => {
    if (newTask.trim() && !tasks.includes(newTask.trim())) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (taskToRemove: string) => {
    setTasks(tasks.filter(task => task !== taskToRemove));
  };

  const handleSubmit = (data: Omit<CreateMilestoneData, 'tasks'>) => {
    const tasksObject = tasks.reduce((acc, task) => {
      acc[task] = false;
      return acc;
    }, {} as { [key: string]: boolean });

    onSubmit({
      ...data,
      tasks: tasksObject,
    });

    // Reset form
    form.reset();
    setTasks([]);
    setNewTask('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Create New Milestone
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Milestone name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter milestone name..."
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              rules={{ required: 'Please select a milestone type' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select milestone type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {milestoneTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your milestone and what you want to achieve..."
                      className="min-h-[100px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear description of what this milestone represents and your milestones.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <FormLabel>Tasks</FormLabel>
                <FormDescription>
                  Break down your milestone into actionable tasks to track progress.
                </FormDescription>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTask} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {tasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tasks ({tasks.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {tasks.map((task, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {task}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTask(task)}
                          className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="min-w-[120px]">
                Create Milestone
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
