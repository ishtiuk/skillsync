'use client';

import type React from 'react';
import { useState, useEffect, BaseSyntheticEvent } from 'react';
import { Dialog, DialogContent } from '@workspace/ui/components/dialog/Dialog';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@workspace/ui/components/forms/select/Select';

import TaskList from '../../../../../components/TaskList';
import { useForm } from 'react-hook-form';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { useMutation } from '@tanstack/react-query';
import { goalsSchema, GoalsSchema } from '../schema';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Form, TextArea } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';
import { useClickOutside } from '@workspace/ui/hooks/useClickOutside';
import { useAdjustHeight } from '@workspace/ui/hooks/useAdjustHeight';
import { IconButton } from '@workspace/ui/components/icon-button/IconButton';
import { updateGoal } from '@/app/profile/_modules/goals/api/mutations/update-goal';
import { ProgressLinear } from '@workspace/ui/components/progress-meter/ProgressLinear';

interface Goal {
  id: string;
  name: string;
  description: string;
  is_completed?: boolean;
  tasks: Record<string, boolean>;
  type: 'networking' | 'interviewing' | 'compensation' | 'organization';
}

interface ViewGoalProps {
  open: boolean;
  goal?: Goal | null;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedGoal: Goal) => void;
}

// Theme configuration for different goal types
const themeConfig = {
  networking: {
    bg: 'bg-blue-b-100',
    text: 'text-blue-b-700',
    selectBg: 'bg-blue-b-200',
    border: 'border-blue-b-400',
    progressBg: 'bg-blue-b-500',
    iconColor: 'text-blue-b-700',
    selectText: 'text-blue-b-700',
    icon: <PhosphorIcon iconVariant="Handshake_fill" className="h-5 w-5" />
  },

  interviewing: {
    bg: 'bg-orange-o-100',
    text: 'text-orange-o-700',
    selectBg: 'bg-orange-o-200',
    border: 'border-orange-o-400',
    progressBg: 'bg-orange-o-500',
    iconColor: 'text-orange-o-700',
    selectText: 'text-orange-o-700',
    icon: <PhosphorIcon iconVariant="ChatCircleDots_fill" className="h-5 w-5" />
  },

  compensation: {
    bg: 'bg-primary-g-100',
    text: 'text-primary-g-700',
    selectBg: 'bg-primary-g-200',
    border: 'border-primary-g-400',
    progressBg: 'bg-primary-g-500',
    iconColor: 'text-primary-g-700',
    selectText: 'text-primary-g-700',
    icon: <PhosphorIcon iconVariant="PiggyBank_fill" className="h-5 w-5" />
  },

  organization: {
    bg: 'bg-purple-p-100',
    text: 'text-purple-p-700',
    selectBg: 'bg-purple-p-200',
    border: 'border-purple-p-400',
    progressBg: 'bg-purple-p-500',
    iconColor: 'text-purple-p-700',
    selectText: 'text-purple-p-700',
    icon: <PhosphorIcon iconVariant="Folder_fill" className="h-5 w-5" />
  },

  borderToHex: {
    'border-blue-b-400': '#A4C8E1',
    'border-orange-o-400': '#F6B26B',
    'border-purple-p-400': '#D5A6E8',
    'border-primary-g-400': '#A4D65E'
  }
};

export default function ViewGoal({
  open,
  goal,
  onUpdate,
  onOpenChange,
  onNavigatePrev,
  onNavigateNext
}: ViewGoalProps) {
  const queryClient = getQueryClient();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleOutsideClick = () => {
    setIsEditingTitle(false);
  };

  const ref = useClickOutside(handleOutsideClick);

  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  const [goalType, setGoalType] = useState<
    'networking' | 'interviewing' | 'compensation' | 'organization'
  >(goal?.type || 'networking');

  const updateGoalMutation = useMutation({
    mutationFn: updateGoal,
    onError: error => console.log(error),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goal'] })
  });

  const form = useForm<GoalsSchema>({
    resolver: zodResolver(goalsSchema),

    defaultValues: {
      type: goalType,
      name: goal?.type,
      tasks: goal?.tasks || {},
      description: goal?.description
    },

    mode: 'onSubmit'
  });

  const { textbox, adjustHeight } = useAdjustHeight(title);

  const theme = themeConfig[goalType];
  const totalTasks = Object.keys(tasks).length;
  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const progress = Math.round((completedTasks / totalTasks) * 100) || 0;

  useEffect(() => {
    if (goal) {
      setTasks(goal.tasks || {});
      setTitle(goal.name || '');
      setDescription(goal.description || '');
      setGoalType(goal.type || 'networking');

      form.setValue('name', goal.name || '');
      form.setValue('tasks', goal.tasks || {});
      form.setValue('type', goal.type || 'networking');
      form.setValue('description', goal.description || '');
    }
  }, [goal]);

  useEffect(() => {
    if (isEditingTitle) adjustHeight();
  }, [isEditingTitle, adjustHeight]);

  const handleTasksChange = (updatedTasks: Record<string, boolean>) => {
    setTasks(updatedTasks);

    const checkIfGoalComplete = Object.values(updatedTasks).every(
      task => task === true
    );

    if (onUpdate && goal) {
      onUpdate({
        ...goal,
        tasks: updatedTasks
      });
    }

    if (goal) {
      updateGoalMutation.mutate({
        id: goal.id,
        request: {
          ...goal,
          name: title,
          type: goalType,
          tasks: updatedTasks,
          description: description,
          is_completed: checkIfGoalComplete
        }
      });
    }
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);

    if (onUpdate && goal) {
      onUpdate({
        ...goal,
        name: title
      });
    }

    if (goal) {
      updateGoalMutation.mutate({
        id: goal.id,
        request: {
          ...goal,
          name: title,
          tasks: tasks,
          type: goalType,
          description: description
        }
      });
    }
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);

    if (onUpdate && goal) {
      onUpdate({
        ...goal,
        description
      });
    }

    if (goal) {
      updateGoalMutation.mutate({
        id: goal.id,
        request: {
          ...goal,
          name: title,
          tasks: tasks,
          type: goalType,
          description: form.getValues('description')
        }
      });
    }
  };

  const handleTypeChange = (
    value: 'networking' | 'interviewing' | 'compensation' | 'organization'
  ) => {
    setGoalType(value);
    form.setValue('type', value);

    if (onUpdate && goal) {
      onUpdate({
        ...goal,
        type: value
      });
    }

    if (goal) {
      updateGoalMutation.mutate({
        id: goal.id,
        request: {
          ...goal,
          type: value,
          name: title,
          tasks: tasks,
          description: description
        }
      });
    }
  };

  const handleCompleteGoal = (tasks: Record<string, boolean>) => {
    const completedTasks = Object.keys(tasks).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    if (goal) {
      updateGoalMutation.mutate({
        id: goal.id,
        request: {
          ...goal,
          name: title,
          type: goalType,
          is_completed: true,
          tasks: completedTasks,
          description: description
        }
      });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[98%] p-0 overflow-hidden">
        {goal ? (
          <Form {...form}>
            <form
              className={`flex min-h-[600px] ${theme.bg}`}
              noValidate
              onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
            >
              {/* Left Section */}
              <div className="w-[55%] p-6 flex flex-col">
                <div className="flex items-center justify-end gap-x-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <Select value={goalType} onValueChange={handleTypeChange}>
                      <SelectTrigger
                        className={`${theme.selectBg} rounded-lg px-4 py-2 border-0 ${theme.selectText} font-medium min-w-[180px]`}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="networking">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {themeConfig['networking'].icon}
                            </span>
                            <span>Networking</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="interviewing">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {themeConfig['interviewing'].icon}
                            </span>
                            <span>Interviewing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="compensation">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {themeConfig['compensation'].icon}
                            </span>
                            <span>Compensation</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="organization">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {themeConfig['organization'].icon}
                            </span>
                            <span>Organization</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <IconButton
                      className="w-10 h-10"
                      variant={'tertiary'}
                      onClick={onNavigatePrev}
                      iconVariant="CaretLeft_bold"
                    />
                    <IconButton
                      className="w-10 h-10"
                      variant={'tertiary'}
                      onClick={onNavigateNext}
                      iconVariant="CaretRight_bold"
                    />
                  </div>
                </div>

                {/* Editable Goal Title */}
                <div>
                  {isEditingTitle ? (
                    <div className="space-y-2" ref={ref}>
                      <textarea
                        rows={1}
                        autoFocus
                        ref={textbox}
                        value={title}
                        onKeyDown={handleTitleKeyDown}
                        className={`w-full text-4xl font-medium ${theme.text} ${theme.bg} focus:outline-none`}
                        onChange={e => {
                          setTitle(e.target.value);
                          adjustHeight();
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative group cursor-text"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Typography variant="heading-md" className={theme.text}>
                        {title}
                      </Typography>
                    </div>
                  )}
                </div>

                <div className={`flex-grow`}>
                  <svg width="100%" height="20">
                    <line
                      x1="0"
                      y1="10"
                      y2="10"
                      x2="100%"
                      stroke-width="1"
                      stroke-dasharray="10, 5"
                      stroke={
                        themeConfig.borderToHex[
                          theme.border as keyof typeof themeConfig.borderToHex
                        ]
                      }
                    />
                  </svg>
                </div>

                {/* Goal Description */}
                <div className="bg-white rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="caption-strong"
                      className="text-neutral-n-800"
                    >
                      Goal Description
                    </Typography>

                    {!isEditingDescription && (
                      <IconButton
                        variant={'tertiary'}
                        iconVariant="PencilSimpleLine_fill"
                        onClick={() => setIsEditingDescription(true)}
                        className={`w-4 h-4 ${themeConfig['compensation'].iconColor}`}
                      />
                    )}
                  </div>

                  {isEditingDescription ? (
                    <div className="space-y-4">
                      <TextArea
                        noSuffix
                        fieldName="description"
                        placeholder="Write your description here"
                      />

                      <Button
                        label="Save"
                        type="button"
                        className="-ml-3"
                        variant="tertiary"
                        onClick={handleSaveDescription}
                      />
                    </div>
                  ) : (
                    <Typography
                      variant="caption"
                      className="text-neutral-n-800"
                    >
                      {description}
                    </Typography>
                  )}

                  <div className="border-t border-neutral-n-300 my-4"></div>

                  <div>
                    <Typography
                      variant="caption-strong"
                      className="text-primary-g-800 mb-4"
                    >
                      Goal Progress
                    </Typography>

                    <ProgressLinear
                      size="regular"
                      className="mb-4"
                      variant={goalType}
                      percentage={progress}
                    />

                    <div className="flex items-center mt-1">
                      <Typography variant="caption">{progress}%</Typography>

                      <Typography
                        variant="caption"
                        className="ml-2 text-neutral-n-600"
                      >
                        Complete
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[45%] bg-white p-6 my-6 mr-6 rounded-3xl">
                <TaskList
                  standalone={true}
                  goalType={goalType}
                  inputClassName="bg-white"
                  initialTasks={goal?.tasks || {}}
                  onTasksChange={handleTasksChange}
                  isGoalComplete={goal.is_completed}
                  onCompleteGoal={tasks => handleCompleteGoal(tasks)}
                />
              </div>
            </form>
          </Form>
        ) : (
          <div className="p-8 text-center">
            <p>No goal selected or goal data is unavailable.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
