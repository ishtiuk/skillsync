import { Button } from '@workspace/ui/components/button';
import React, { useEffect, useState, BaseSyntheticEvent } from 'react';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger
} from '@workspace/ui/components/dialog/Dialog';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@workspace/ui/components/forms/select/Select';

import {
  FormItem,
  FormField,
  FormControl,
  FormMessage
} from '@workspace/ui/components/form/Form';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@workspace/ui/components/typography';
import { TextInput, Form, TextArea } from '@workspace/ui/components/form';

import {
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import TaskList from '../../../../../components/TaskList';
import { GetGoalResponse } from '../types';
import { goalsSchema, GoalsSchema } from '../schema';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { useAdjustHeight } from '@workspace/ui/hooks/useAdjustHeight';
import { createGoal } from '@/app/profile/_modules/goals/api/mutations/create-goal';
import { ContextualAlert } from '@workspace/ui/components/contextual-alerts/ContextualAlert';

type GoalFormProps = {
  open?: boolean;
  isEditing?: boolean;
  data?: GetGoalResponse;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const GoalForm = ({
  open,
  data,
  trigger,
  onOpenChange,
  isEditing = false
}: GoalFormProps) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onError: error => setHasErrors(true),

    onSuccess: () => {
      form.reset();
      onOpenChange?.(false);
      queryClient.invalidateQueries({ queryKey: ['goal'] });
    }
  });

  const queryClient = getQueryClient();

  const form = useForm<GoalsSchema>({
    resolver: zodResolver(goalsSchema),

    defaultValues: {
      name: '',
      tasks: {},
      description: ''
    },

    mode: 'onSubmit'
  });

  const { textbox, adjustHeight } = useAdjustHeight(form.watch('name'));

  const resetAlerts = () => {
    setHasErrors(false);
  };

  const onSubmit = async (formData: GoalsSchema) => {
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    createGoalMutation.mutate(formData);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        name &&
        form.formState.errors[name as keyof typeof form.formState.errors]
      ) {
        setHasErrors(false);
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (open) resetAlerts();
  }, [open]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild onClick={resetAlerts}>
          {trigger && <div>{trigger}</div>}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[900px] max-h-[98%] overflow-auto">
          <Form {...form}>
            <form
              noValidate
              className="flex gap-6"
              onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
            >
              <div className="flex flex-col gap-6 w-1/2">
                <DialogHeader className="mt-12">
                  <DialogTitle className="absolute top-[22px] left-16">
                    <Typography
                      variant="body-strong"
                      className="text-primary-g-800"
                    >
                      {isEditing ? 'Edit Goal' : 'Create Goal'}
                    </Typography>
                  </DialogTitle>

                  {hasErrors && (
                    <Alert
                      variant="critical"
                      onClose={() => setHasErrors(false)}
                      label={'Please fill in all required fields'}
                    />
                  )}
                </DialogHeader>

                <div className="relative">
                  <textarea
                    rows={1}
                    autoFocus
                    ref={textbox}
                    placeholder="Write your goal"
                    className={`w-full text-4xl font-medium focus:outline-none placeholder:text-neutral-n-600`}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      form.setValue('name', e.target.value);
                      adjustHeight();
                    }}
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

                  {form?.formState?.errors?.name && (
                    <ContextualAlert
                      variant="critical"
                      label={String(form?.formState?.errors?.name?.message!)}
                    />
                  )}
                </div>

                <TextArea
                  fieldName="description"
                  placeholder="Goal description"
                />

                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full gap-2">
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="interviewing">
                            Interviewing
                          </SelectItem>
                          <SelectItem value="compensation">
                            Compensation
                          </SelectItem>
                          <SelectItem value="organization">
                            Organization
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="justify-start mt-8">
                  <div className="w-full flex flex-col gap-4">
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full"
                      label="Create Goal"
                      onClick={() => onSubmit(form.getValues())}
                    />

                    <DialogClose asChild ref={buttonRef}>
                      <Button type="button" variant="tertiary" label="Cancel" />
                    </DialogClose>
                  </div>
                </DialogFooter>
              </div>

              <div className="w-1/2 bg-neutral-n-100 rounded-3xl p-6 shadow-sm">
                <TaskList fieldName="tasks" />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default GoalForm;
