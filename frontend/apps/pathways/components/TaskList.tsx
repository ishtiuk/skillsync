'use client';

import Image from 'next/image';
import type React from 'react';

import { Check, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { useFormContext } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';
import { useClickOutside } from '@workspace/ui/hooks/useClickOutside';
import { IconButton } from '@workspace/ui/components/icon-button/IconButton';

interface TaskListEmptyStateProps {
  onAddTaskClick: () => void;
  goalType?: 'networking' | 'interviewing' | 'compensation' | 'organization';
}

const TaskListEmptyState = ({
  onAddTaskClick,
  goalType = 'networking'
}: TaskListEmptyStateProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography variant="body-strong" className="text-primary-g-800">
          Your Task list
        </Typography>
        <Button
          label="Add task"
          variant="tertiary"
          leftIcon="Plus_bold"
          onClick={onAddTaskClick}
        />
      </div>

      <div className="flex flex-col items-center justify-start">
        <div className="w-32 h-32 relative">
          <Image
            fill
            alt="Empty state goals"
            className="object-contain"
            src="/images/empty-state-goals.svg"
          />
        </div>

        <Typography variant="body-strong" className="text-neutral-n-800">
          Create your first task
        </Typography>

        <Typography
          variant="caption"
          className="text-neutral-n-800 text-center max-w-md mb-8"
        >
          Adding tasks helps break down a larger goal into manageable steps,
          making it easier to achieve.
        </Typography>

        <Button
          label="Add Task"
          variant="secondary"
          leftIcon="Plus_bold"
          onClick={onAddTaskClick}
        >
          Add task
        </Button>
      </div>
    </div>
  );
};

interface Task {
  text: string;
  completed: boolean;
}

interface TaskListProps {
  fieldName?: string;
  standalone?: boolean;
  inputClassName?: string;
  isGoalComplete?: boolean;
  initialTasks?: Record<string, boolean>;
  goalType?: 'networking' | 'interviewing' | 'compensation' | 'organization';
  onTasksChange?: (tasks: Record<string, boolean>) => void;
  onCompleteGoal?: (tasks: Record<string, boolean>) => void;
}

export default function TaskList({
  inputClassName,
  initialTasks = {},
  standalone = false,
  fieldName = 'tasks',
  isGoalComplete = false,
  goalType = 'networking',
  onTasksChange,
  onCompleteGoal
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New state for task editing
  const [editingTaskText, setEditingTaskText] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const [localTasks, setLocalTasks] =
    useState<Record<string, boolean>>(initialTasks);

  useEffect(() => {
    if (standalone && Object.keys(initialTasks).length > 0) {
      setLocalTasks(initialTasks);
    }
  }, [initialTasks, standalone]);

  useEffect(() => {
    if (editingTaskText !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskText]);

  const handleOutsideClick = () => {
    setIsAddingTask(false);
  };

  const ref = useClickOutside(handleOutsideClick);

  // Get form context if not in standalone mode
  const formContext = useFormContext();

  // Get tasks from form or local state
  const tasksRecord: Record<string, boolean> =
    standalone || !formContext
      ? localTasks
      : formContext.watch(fieldName) || {};

  const tasks: Task[] = Object.entries(tasksRecord).map(
    ([text, completed]) => ({
      text,
      completed
    })
  );

  // Update tasks in form or local state
  const updateTasks = (updatedTasksRecord: Record<string, boolean>) => {
    if (standalone) {
      setLocalTasks(updatedTasksRecord);
    } else if (formContext) {
      formContext.setValue(fieldName, updatedTasksRecord, {
        shouldDirty: true,
        shouldValidate: true
      });
    }

    if (onTasksChange) onTasksChange(updatedTasksRecord);
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const updatedTasks = {
        ...tasksRecord,
        [newTaskText]: false
      };

      updateTasks(updatedTasks);

      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  const toggleTaskCompletion = (taskText: string) => {
    const updatedTasks = {
      ...tasksRecord,
      [taskText]: !tasksRecord[taskText]
    };

    updateTasks(updatedTasks);
  };

  const deleteTask = (taskText: string) => {
    const updatedTasks = { ...tasksRecord };
    delete updatedTasks[taskText];
    updateTasks(updatedTasks);
  };

  // New function to start editing a task
  const startEditingTask = (taskText: string) => {
    setEditingTaskText(taskText);
    setEditedTaskText(taskText);
  };

  // New function to save edited task
  const saveEditedTask = () => {
    if (
      editingTaskText &&
      editedTaskText.trim() &&
      editedTaskText !== editingTaskText
    ) {
      const isCompleted = tasksRecord[editingTaskText];
      const updatedTasks = { ...tasksRecord };

      // Remove the old task
      delete updatedTasks[editingTaskText];

      // Add the edited task with the same completion status
      updatedTasks[editedTaskText] = isCompleted;

      updateTasks(updatedTasks);
    }

    setEditingTaskText(null);
    setEditedTaskText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditedTask();
    } else if (e.key === 'Escape') {
      setEditingTaskText(null);
      setEditedTaskText('');
    }
  };

  const startAddingTask = () => {
    setIsAddingTask(true);
  };

  if (tasks.length === 0 && !isAddingTask) {
    return (
      <TaskListEmptyState
        goalType={goalType}
        onAddTaskClick={startAddingTask}
      />
    );
  }

  return (
    <div className="flex flex-col rounded-xl shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <Typography variant="body-strong" className="text-primary-g-800">
          Your Task list
        </Typography>

        <Button
          label="Add Task"
          variant="tertiary"
          leftIcon="Plus_bold"
          onClick={startAddingTask}
        />
      </div>

      <div className="flex-grow space-y-4">
        {tasks.map(task => (
          <div key={task.text} className="group flex items-center gap-3">
            <button
              onClick={() => toggleTaskCompletion(task.text)}
              className={`flex-shrink-0 h-6 w-6 rounded ${task.completed ? 'bg-blue-b-500' : 'border-2 border-neutral-n-400'}`}
            >
              {task.completed && (
                <Check className="h-full w-full text-white p-1" />
              )}
            </button>

            {editingTaskText === task.text ? (
              <div className="flex-1 relative">
                <input
                  type="text"
                  ref={editInputRef}
                  value={editedTaskText}
                  onBlur={saveEditedTask}
                  onKeyDown={handleEditKeyDown}
                  onChange={e => setEditedTaskText(e.target.value)}
                  className={`w-full focus:outline-none  bg-neutral-n-100`}
                />

                <svg width="100%" height="20" className="absolute -bottom-3">
                  <line
                    x1="0"
                    y1="10"
                    y2="10"
                    x2="100%"
                    stroke-width="1"
                    stroke="#CCC6C0"
                    stroke-dasharray="10, 5"
                  />
                </svg>
              </div>
            ) : (
              <Typography
                variant="body"
                onClick={() => startEditingTask(task.text)}
                className={`flex-1 ${task.completed ? 'text-neutral-n-500 line-through' : 'text-black'} cursor-pointer`}
              >
                {task.text}
              </Typography>
            )}

            {/* Delete button - visible on hover */}
            <IconButton
              variant="tertiary"
              iconVariant="Trash_bold"
              aria-label="Delete task"
              onClick={() => deleteTask(task.text)}
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-r-500"
            />
          </div>
        ))}

        {isAddingTask && (
          <div className="flex flex-col items-start w-full" ref={ref}>
            <input
              autoFocus
              type="text"
              value={newTaskText}
              onKeyDown={handleKeyDown}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder={`${tasks?.length > 0 ? `Write another task` : `Write a task`}`}
              className={cn(
                `w-full focus:outline-none bg-neutral-n-100`,
                inputClassName
              )}
            />

            <svg width="100%" height="20" className="-mt-1">
              <line
                x1="0"
                y1="10"
                y2="10"
                x2="100%"
                stroke-width="1"
                stroke="#CCC6C0"
                stroke-dasharray="10, 5"
                className="fill-neutral-n-200"
              />
            </svg>
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-8">
          <Button
            className="w-full"
            variant="secondary"
            disabled={isGoalComplete}
            onClick={() => onCompleteGoal?.(tasksRecord)}
            label={isGoalComplete ? 'Goal Completed' : 'Complete Goal'}
          />
        </div>
      )}
    </div>
  );
}
