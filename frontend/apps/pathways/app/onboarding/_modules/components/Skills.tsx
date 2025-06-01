'use client';

import { useForm } from 'react-hook-form';
import { skillsSchema, SkillsSchema } from '../schema';
import React, {
  BaseSyntheticEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Form, TextInput } from '@workspace/ui/components/form';

import { useRouter } from 'next/navigation';

import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Typography } from '@workspace/ui/components/typography';
import { updateUserProfile } from '../../../profile/_modules/common/api/mutations/update-profile';
import { User } from '@/app/profile/_modules/common/types';

type SkillsProps = {
  runSubmit?: boolean;
  onboarding?: boolean;
  onOpenChange?: (open: boolean) => void;
  setRunSubmit?: React.Dispatch<SetStateAction<boolean>>;
};

const Skills = ({
  runSubmit = false,
  onboarding = true,
  onOpenChange,
  setRunSubmit
}: SkillsProps) => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const user = queryClient.getQueryData(['user']) as User;
  const [skills, setSkills] = useState<string[]>(user?.skills || []);

  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Please fill required fields.'
  );

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,

    onError: error => {
      setHasErrors(true);
      setErrorMessage('Something went wrong. Please try again.');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user']
      });

      if (onboarding) {
        router.push('/onboarding?step=goals');
      } else {
        setRunSubmit?.(false);
        onOpenChange?.(false);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    }
  });

  const form = useForm<SkillsSchema>({
    resolver: zodResolver(skillsSchema),

    defaultValues: {
      skill: ''
    },

    mode: 'onSubmit'
  });

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

  useEffect(() => {
    if (runSubmit) onSubmit();
  }, [runSubmit]);

  const onSubmit = async () => {
    if (skills.length === 0) {
      setHasErrors(true);
      setErrorMessage('Please add at least one skill.');
      return;
    }

    updateProfileMutation.mutate({
      ...user,
      skills: skills
    });

    setHasErrors(false);
  };

  const onAddSkill = (skill: string) => {
    setSkills(prev => {
      if (prev.includes(skill)) return prev;
      return [...prev, skill];
    });

    form.setValue('skill', '');
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
          <TextInput
            noSuffix
            type="text"
            fieldName="skill"
            label="Write a skill"
            placeholder="Enter a skill here"
            onKeyPressFunc={e => onAddSkill(e.currentTarget.value)}
          />

          <div className="flex gap-1 items-center -mt-4">
            <PhosphorIcon
              iconVariant="Info_fill"
              className="text-neutral-n-700 w-[14px] h-[14px]"
            />

            <Typography variant="caption" className="text-neutral-n-700">
              Type in a skill and press enter and we’ll add it below!
            </Typography>
          </div>
        </form>
      </Form>

      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills?.map((s, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 bg-neutral-n-200 rounded-lg px-4 py-2"
            >
              <Typography variant="caption" className="text-neutral-n-800">
                {s}
              </Typography>

              <div
                onClick={() => {
                  const filteredSkill = skills.filter((_, i) => i !== index);
                  setSkills(filteredSkill);
                }}
              >
                <PhosphorIcon
                  iconVariant="XCircle_fill"
                  className="rounded-full fill-neutral-n-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {onboarding && (
        <div className="flex gap-4 mt-20">
          <Button
            size="large"
            label="Skip"
            type="button"
            className="w-1/2"
            variant="secondary"
            onClick={() => router.push('/onboarding?step=goals')}
          />
          <Button
            size="large"
            type="submit"
            variant="primary"
            label="Next Step"
            className="w-1/2"
            onClick={onSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Skills;
