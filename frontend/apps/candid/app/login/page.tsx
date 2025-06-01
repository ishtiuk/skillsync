'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Form, TextInput } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';
import { loginUserSchema, type LoginUserSchema } from './_modules/schema';
import { BrandButton } from '@workspace/ui/components/brand-button/BrandButton';

import { setToken } from '@/lib/token';
import { GoogleTokenResponse } from './_modules/types';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { loginUser } from './_modules/api/mutations/self/login';
import { getGoogleUser } from './_modules/api/queries/getGoogleUser';
import { loginGoogleUser } from './_modules/api/mutations/oauth/login-google';

export default function LoginPage() {
  const queryClient = getQueryClient();
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [googleUser, setGoogleUser] = useState<GoogleTokenResponse | null>(
    null
  );

  const getGoogleInfoMutation = useGoogleLogin({
    onSuccess: tokenResponse => setGoogleUser(tokenResponse),
    onError: () => {
      setHasErrors(true);
      setErrorMessage('An error has occurred. Please try again!');
    }
  });

  const selfLoginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      setToken(data.access_token);
      window.location.href = '/home';
    },
    onError: error => {
      setHasErrors(true);
      setErrorMessage(
        (error as any)?.response?.data ??
          'An error has occurred. Please try again!'
      );
    }
  });

  const googleLoginMutation = useMutation({
    mutationFn: loginGoogleUser,
    onSuccess: (data: any) => {
      setToken(data.access_token);
      window.location.href = '/home';
    },
    onError: error => {
      setHasErrors(true);
      setErrorMessage('An error occurred. Please try again.');
    }
  });

  const form = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),

    defaultValues: {
      email: '',
      password: ''
    },

    mode: 'onSubmit'
  });

  const submitForm = async (
    data: LoginUserSchema,
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setHasErrors(false);
    selfLoginMutation.mutate(data);

    console.log(JSON.stringify(data));
  };

  useEffect(() => {
    if (googleUser) {
      (async () => {
        googleLoginMutation.mutate({
          access_token: googleUser?.access_token || '',
          platform: 'pathways'
        });
      })();
    }
  }, [googleUser]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && form.formState.errors[name]) {
        setHasErrors(false);
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex-1 flex flex-col w-full justify-center gap-6">
      <div className="flex flex-col gap-2">
        <Typography variant="heading-md">{'Welcome Back'}</Typography>
      </div>
      {hasErrors && (
        <Alert
          variant="critical"
          label={errorMessage}
          onClose={() => setHasErrors(false)}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
          noValidate
        >
          <div id="loginForm" className="flex flex-col gap-4">
            <TextInput
              type="text"
              fieldName="email"
              placeholder="Email Address"
              onChangeFunc={() => setHasErrors(false)}
              rules={{
                required: true
              }}
            />
            <TextInput
              rules={{
                required: true
              }}
              type="password"
              fieldName="password"
              placeholder="Password"
              onChangeFunc={() => setHasErrors(false)}
            />

            {/* <Typography
              variant="caption-strong"
              className="text-primary-g-600 mb-2"
            >
              <Link href="/forgot-password">{'Forgot Password'}</Link>
            </Typography> */}

            <Button
              size="large"
              label="Login"
              variant="primary"
              className="w-full"
              onClick={() => submitForm(form.getValues())}
              disabled={
                form.formState.isSubmitting || selfLoginMutation.isPending
              }
            />
          </div>
        </form>
      </Form>
      {/* <div className="flex flex-row gap-2 justify-between items-center">
        <hr
          style={{
            flexGrow: 1,
            borderWidth: '1px',
            borderColor: 'var(--Neutral-N300, #E5DFD8'
          }}
        />
        <Typography variant="caption-strong" className="text-neutral-500">
          Or
        </Typography>
        <hr
          style={{
            flexGrow: 1,
            borderWidth: '1px',
            borderColor: 'var(--Neutral-N300, #E5DFD8'
          }}
        />
      </div>
      <div id="brand-buttons" className="flex flex-col gap-3">
        <BrandButton
          size="large"
          type="button"
          variant="google"
          textVariant="login"
          onClick={() => getGoogleInfoMutation()}
        />
      </div> */}
    </div>
  );
}
