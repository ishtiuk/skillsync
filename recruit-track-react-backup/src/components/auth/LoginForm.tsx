
import React, { useState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { LoginRequest } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  platform: z.enum(['careerforge', 'talenthub']),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedinLoading, setIsLinkedinLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      platform: 'careerforge',
    },
  });

  const platform = watch('platform');
  const isCareerForge = platform === 'careerforge';

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      toast({
        title: 'Logging in...',
        description: 'Please wait while we log you in.',
      });
      const { user, access_token } = await auth.login(data.email, data.password, data.platform);
      startTransition(() => {
        login(user, access_token);
      });
      toast({
        title: 'Welcome back!',
        description: `Logged in to ${data.platform === 'careerforge' ? 'CareerForge' : 'TalentHub'}`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      toast({
        title: 'Connecting with Google...',
        description: 'Please wait while we authenticate with Google.',
      });

      // Initialize Google OAuth (this is a simplified example - you'll need proper Google OAuth setup)
      const response = await fetch(`https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=email profile`);

      // For now, show that feature is coming soon
      toast({
        title: 'Coming Soon',
        description: 'Google authentication will be available soon!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Google login failed',
        description: 'Unable to connect with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedinLogin = async () => {
    setIsLinkedinLoading(true);
    try {
      toast({
        title: 'Connecting with LinkedIn...',
        description: 'Please wait while we authenticate with LinkedIn.',
      });

      // For now, show that feature is coming soon
      toast({
        title: 'Coming Soon',
        description: 'LinkedIn authentication will be available soon!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'LinkedIn login failed',
        description: 'Unable to connect with LinkedIn. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLinkedinLoading(false);
    }
  };

  return (
    <Card className={`border-0 shadow-lg hover-gradient-scale ${
      isCareerForge ? 'bg-careerforge-gradient-card' : 'bg-talenthub-gradient-card'
    }`}>
      <CardContent className="p-6">
        <Tabs
          value={platform}
          onValueChange={(value) => setValue('platform', value as 'careerforge' | 'talenthub')}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="careerforge"
              className={`text-sm ${isCareerForge ? 'bg-careerforge-gradient-accent' : ''}`}
            >
              CareerForge
              <span className="ml-2 text-xs text-gray-500">Job Seeker</span>
            </TabsTrigger>
            <TabsTrigger
              value="talenthub"
              className={`text-sm ${!isCareerForge ? 'bg-talenthub-gradient-accent' : ''}`}
            >
              TalentHub
              <span className="ml-2 text-xs text-gray-500">Recruiter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="careerforge">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-gray-900">Job Seeker Portal</h3>
              <p className="text-sm text-gray-600">Track and manage your job applications</p>
            </div>
          </TabsContent>

          <TabsContent value="talenthub">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-gray-900">Recruiter Portal</h3>
              <p className="text-sm text-gray-600">Manage positions and connect with candidates</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Social Login Buttons with gradient styling */}
        <div className="space-y-2 mb-4">
          <Button
            type="button"
            variant="outline"
            className={`w-full bg-white border-gray-300 hover:bg-gray-50 hover-gradient-scale ${
              isCareerForge ? 'border-careerforge-gradient' : 'border-talenthub-gradient'
            }`}
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className={`w-full bg-white border-gray-300 hover:bg-gray-50 hover-gradient-scale ${
              isCareerForge ? 'border-careerforge-gradient' : 'border-talenthub-gradient'
            }`}
            onClick={handleLinkedinLogin}
            disabled={isLinkedinLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            {isLinkedinLoading ? 'Connecting...' : 'Continue with LinkedIn'}
          </Button>
        </div>

        <div className="relative my-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className={`${errors.email ? 'border-red-500' : ''} ${
                isCareerForge ? 'focus:ring-green-500' : 'focus:ring-purple-500'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              className={`${errors.password ? 'border-red-500' : ''} ${
                isCareerForge ? 'focus:ring-green-500' : 'focus:ring-purple-500'
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full mt-4 hover-gradient-scale ${
              isCareerForge
                ? 'bg-careerforge-gradient-primary hover:opacity-90'
                : 'bg-talenthub-gradient-primary hover:opacity-90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Demo credentials: any email and password (6+ chars)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
