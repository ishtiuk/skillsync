'use client';

import { useForm } from 'react-hook-form';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Form, TextInput } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';
import { BrandButton } from '@workspace/ui/components/brand-button/BrandButton';

import {
  registerUserSchema,
  type RegisterUserSchema
} from '../_modules/schema';

import { setToken } from '@/lib/utils/token';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { GoogleTokenResponse, GoogleUser } from '../_modules/types';
import { registerUser } from '../_modules/common/api/mutations/self/register';
import { registerGoogleUser } from '../_modules/common/api/mutations/oauth/register';
import { getGoogleUser } from '../_modules/common/api/queries/getGoogleUser';

type GoogleUserResponse = GoogleTokenResponse | null;

export default function RegisterPage() {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [googleUser, setGoogleUser] = useState<GoogleUserResponse>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => setGoogleUser(tokenResponse),
    onError: error => {
      setHasErrors(true);
      setErrorMessage(
        error?.error_description || 'An error has occurred. Please try again!'
      );
    }
  });

  const selfRegisterMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: data => {
      setToken(data.access_token);
      window.location.href = '/onboarding';
    },

    onError: (error: any) => {
      setHasErrors(true);
      const errorResponse = error?.response?.data?.detail;

      switch (errorResponse) {
        case 'Conflict error':
          setErrorMessage('Email already exists');
          break;
        default:
          setErrorMessage('An error occurred. Please try again.');
          break;
      }
    }
  });

  const googleRegisterMutation = useMutation({
    mutationFn: registerGoogleUser,
    onSuccess: data => {
      setToken(data.access_token);
      window.location.href = '/onboarding';
    },

    onError: (error: any) => {
      setHasErrors(true);
      setErrorMessage(
        error?.response?.data?.detail || 'An error occurred. Please try again.'
      );
    }
  });

  const form = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),

    defaultValues: {
      email: '',
      last_name: '',
      password: '',
      first_name: '',
      passwordReentered: ''
    },

    mode: 'onSubmit'
  });

  const dismissErrors = () => {
    setHasErrors(false);
  };

  const submitForm = async (
    data: RegisterUserSchema,
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    dismissErrors();

    selfRegisterMutation.mutate(data);
  };

  useEffect(() => {
    if (googleUser) {
      (async () => {
        const profile = await getGoogleUser(googleUser?.access_token);

        googleRegisterMutation.mutate({
          provider: 'google',
          platform: 'pathways',
          email: profile.email,
          first_name: profile.given_name,
          last_name: profile.family_name,
          access_token: googleUser?.access_token || ''
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
    <>
      <div className="flex-1 flex flex-col w-full justify-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Typography variant="heading-md">{"Let's Get Started."}</Typography>
            <Typography variant="caption">
              {
                'Create an account today on Pathways to keep track of your job hunt, we’ll help organize and give you snapshot of where you are on your job hunt.'
              }
            </Typography>
          </div>

          <div className="flex flex-row gap-2 justify-between items-center">
            <hr
              style={{
                flexGrow: 1,
                borderWidth: '1px',
                borderColor: 'var(--Neutral-N300, #E5DFD8)'
              }}
            />
            <Typography variant="caption-strong" className="text-neutral-500">
              Or
            </Typography>
            <hr
              style={{
                flexGrow: 1,
                borderWidth: '1px',
                borderColor: 'var(--Neutral-N300, #E5DFD8)'
              }}
            />
          </div>

          <div id="brand-buttons" className="flex flex-col gap-3">
            <BrandButton
              size="large"
              type="button"
              variant="google"
              textVariant="signup"
              onClick={() => googleLogin()}
            />
          </div>
        </div>

        {!!hasErrors && (
          <Alert
            variant="critical"
            label={errorMessage}
            onClose={dismissErrors}
          />
        )}
        <Form {...form}>
          <form
            onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
            noValidate
          >
            <div id="signUpForm" className="flex flex-col gap-4">
              <div id="signUpName" className="flex flex-row gap-4">
                <TextInput
                  rules={{
                    required: true
                  }}
                  type="text"
                  fieldName="first_name"
                  placeholder="First Name"
                  onChangeFunc={() => dismissErrors()}
                />
                <TextInput
                  rules={{
                    required: true
                  }}
                  type="text"
                  fieldName="last_name"
                  placeholder="Last Name"
                  onChangeFunc={() => dismissErrors()}
                />
              </div>
              <TextInput
                rules={{
                  required: true
                }}
                type="text"
                fieldName="email"
                placeholder="Email Address"
                onChangeFunc={() => dismissErrors()}
              />
              <TextInput
                rules={{
                  required: true
                }}
                type="password"
                fieldName="password"
                placeholder="Password"
                onChangeFunc={() => dismissErrors()}
              />
              <TextInput
                rules={{
                  required: true
                }}
                type="password"
                fieldName="passwordReentered"
                placeholder="Re-enter Password"
                onChangeFunc={() => dismissErrors()}
              />
              <Button
                size="large"
                label="Sign Up"
                variant="primary"
                className="w-full"
                onClick={() => submitForm(form.getValues())}
                disabled={
                  form.formState.isSubmitting || selfRegisterMutation.isPending
                }
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
