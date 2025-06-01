'use client';

import { useForm } from 'react-hook-form';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Form, TextInput, TextArea } from '@workspace/ui/components/form';
import { goalsSchema, GoalsSchema } from '@/app/profile/_modules/goals/schema';

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

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { useAdjustHeight } from '@workspace/ui/hooks/useAdjustHeight';
import { createGoal } from '@/app/profile/_modules/goals/api/mutations/create-goal';
import { User } from '@/app/profile/_modules/common/types';

const Goals = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Please fill required fields.'
  );

  const user = queryClient.getQueryData(['user']) as User;

  const createGoalMutation = useMutation({
    mutationFn: createGoal,

    onError: error => {
      setHasErrors(true);
      setErrorMessage('Something went wrong. Please try again.');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['goal']
      });

      router.push('/onboarding?step=experiences');
    }
  });

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

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        name &&
        form.formState.errors[name as keyof typeof form.formState.errors]
      ) {
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: GoalsSchema, event?: BaseSyntheticEvent) => {
    event?.preventDefault();
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    createGoalMutation.mutate({
      name: data?.name!,
      type: data?.type!,
      tasks: data?.tasks!,
      description: data?.description!
    });

    setHasErrors(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {hasErrors && (
        <Alert
          variant="critical"
          label={errorMessage}
          onClose={() => setHasErrors(false)}
        />
      )}

      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
          noValidate
        >
          <div>
            <textarea
              rows={1}
              autoFocus
              ref={textbox}
              placeholder="Write your goal"
              className={`w-full text-4xl font-medium focus:outline-none px-1 py-1 placeholder:text-neutral-n-600`}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                form.setValue('name', e.target.value);
                adjustHeight();
              }}
            />

            <svg width="100%" height="20">
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

          <TextArea fieldName="description" placeholder="Goal description" />

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
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="compensation">Compensation</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex gap-4 mt-20">
        <Button
          size="large"
          type="button"
          label="Skip"
          className="w-1/2"
          variant="secondary"
          onClick={() => router.push('/onboarding?step=experiences')}
        />
        <Button
          size="large"
          type="submit"
          variant="primary"
          label="Next Step"
          className="w-1/2"
          onClick={() => onSubmit(form.getValues())}
        />
      </div>
    </div>
  );
};

export default Goals;
