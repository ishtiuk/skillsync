'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';

import GoalForm from './AddGoalForm';
import UpdateGoalForm from './UpdateGoalForm';
import type { GetGoalResponse } from '../types';
import EmptyState from '@/components/EmptyState';
import { Button } from '@workspace/ui/components/button';
import { getGoalsOptions } from '../api/queries/getGoals';
import { Circular } from '@workspace/ui/components/progress-meter/Circular';
import { dehydrate, HydrationBoundary, useQuery } from '@tanstack/react-query';

type GoalsProps = {
  publicView?: boolean;
};

const circularProgresses: Record<number, React.ReactNode> = {
  0: <Circular size="48px" percentage={17} variant="networking" />,
  1: <Circular size="48px" percentage={17} variant="interviewing" />,
  2: <Circular size="48px" percentage={17} variant="compensation" />,
  3: <Circular size="48px" percentage={17} variant="organization" />
};

export const Goals = ({}: GoalsProps) => {
  const queryClient = getQueryClient();
  const [openAddGoalModal, setOpenAddGoalModal] = useState(false);

  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);
  const [viewGoalModalOpen, setViewGoalModalOpen] = useState(false);

  const { data: goals } = useQuery(getGoalsOptions);

  const getTaskCompletion = (tasks: { [key: string]: boolean }) => {
    const completedTasks = Object.values(tasks).filter(task => task);
    const totalTasks = Object.keys(tasks).length;
    const completionPercentage = (completedTasks.length / totalTasks) * 100;

    if (isNaN(completionPercentage)) return 0;
    return Math.round(completionPercentage);
  };

  const getRandomCircularProgress = (
    goal: GetGoalResponse
  ): React.ReactElement => {
    return (
      <Circular
        size="48px"
        variant={goal?.type}
        percentage={getTaskCompletion(goal?.tasks)}
      />
    );
  };

  // Function to handle opening the ViewGoal modal
  const handleViewGoal = (index: number) => {
    setSelectedGoalIndex(index);
    setViewGoalModalOpen(true);
  };

  // Functions to handle navigation between goals
  const handlePrevGoal = () => {
    if (goals && goals.length > 0) {
      setSelectedGoalIndex(prev => (prev > 0 ? prev - 1 : goals.length - 1));
    }
  };

  const handleNextGoal = () => {
    if (goals && goals.length > 0) {
      setSelectedGoalIndex(prev => (prev < goals.length - 1 ? prev + 1 : 0));
    }
  };

  const sortedGoals = useMemo(
    () =>
      goals?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [goals]
  );

  const currentGoal = useMemo(() => {
    return sortedGoals &&
      sortedGoals.length > 0 &&
      selectedGoalIndex < sortedGoals.length
      ? {
          name: sortedGoals[selectedGoalIndex].name,
          type: sortedGoals[selectedGoalIndex].type,
          tasks: sortedGoals[selectedGoalIndex].tasks,
          is_completed: sortedGoals[selectedGoalIndex].is_completed,
          description: sortedGoals[selectedGoalIndex].description || '',
          id: sortedGoals[selectedGoalIndex].id || String(selectedGoalIndex)
        }
      : null;
  }, [sortedGoals, selectedGoalIndex]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col border rounded-[16px] border-neutral-300 overflow-clip bg-white">
        <SectionHeader
          className="w-full"
          title={'Your goals'}
          leftImageSrc={'/images/chart-donut.svg'}
          count={goals && goals?.length > 0 ? goals?.length : undefined}
          rightButtonProps={{
            variant: 'tertiary',
            label: 'Add new goal',
            onClick: () => setOpenAddGoalModal(true)
          }}
        />

        {goals && goals.length > 0 ? (
          goals
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((goal, index) => (
              <ListItem
                key={index}
                title={goal.name}
                ContentImage={getRandomCircularProgress(goal)}
                subTitle={`${getTaskCompletion(goal.tasks)}% complete`}
                className="border-b border-neutral-300 last:border-b-0 items-center py-2"
                ListItemRight={
                  <Button
                    label="View Goal"
                    variant="secondary"
                    onClick={() => handleViewGoal(index)}
                  />
                }
              />
            ))
        ) : (
          <EmptyState
            callToAction={
              <Button
                label="Add Goal"
                className="w-fit"
                variant="secondary"
                onClick={() => setOpenAddGoalModal(true)}
              />
            }
            title="What are your goals?"
            imageUrl="/images/empty-state-goals.svg"
            description="There's not a one-size fits all approach to building your climate career, create goals and find your own path forward!"
          />
        )}

        <GoalForm open={openAddGoalModal} onOpenChange={setOpenAddGoalModal} />

        <UpdateGoalForm
          open={viewGoalModalOpen}
          goal={currentGoal || undefined}
          onNavigatePrev={handlePrevGoal}
          onNavigateNext={handleNextGoal}
          onOpenChange={setViewGoalModalOpen}
        />
      </div>
    </HydrationBoundary>
  );
};
