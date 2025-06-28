import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const genderOptions = ['Male', 'Female', 'Prefer not to say'];

const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  current_job_title: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  x_twitter_url: z.string().url().optional().or(z.literal('')),
  personal_website_url: z.string().url().optional().or(z.literal('')),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  ethnicity: z.string().optional(),
  birthday: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      city: user?.city || '',
      state: user?.state || '',
      country: user?.country || '',
      current_job_title: user?.current_job_title || '',
      linkedin_url: user?.linkedin_url || '',
      github_url: user?.github_url || '',
      x_twitter_url: user?.x_twitter_url || '',
      personal_website_url: user?.personal_website_url || '',
      gender: user?.gender || '',
      nationality: user?.nationality || '',
      ethnicity: user?.ethnicity || '',
      birthday: user?.birthday || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await auth.updateProfile(data);
      updateUser(response);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...register('last_name')}
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  {...register('phone_number')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">Date of Birth</Label>
                <Input
                  id="birthday"
                  type="date"
                  {...register('birthday')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  {...register('nationality')}
                  placeholder="e.g., American"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Input
                  id="ethnicity"
                  {...register('ethnicity')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_job_title">Current Job Title</Label>
              <Input id="current_job_title" {...register('current_job_title')} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...register('linkedin_url')}
                    className={errors.linkedin_url ? 'border-red-500' : ''}
                  />
                  {errors.linkedin_url && (
                    <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/yourusername"
                    {...register('github_url')}
                    className={errors.github_url ? 'border-red-500' : ''}
                  />
                  {errors.github_url && (
                    <p className="text-sm text-red-500">{errors.github_url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="x_twitter_url">X (Twitter) URL</Label>
                  <Input
                    id="x_twitter_url"
                    placeholder="https://x.com/yourusername"
                    {...register('x_twitter_url')}
                    className={errors.x_twitter_url ? 'border-red-500' : ''}
                  />
                  {errors.x_twitter_url && (
                    <p className="text-sm text-red-500">{errors.x_twitter_url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal_website_url">Personal Website</Label>
                  <Input
                    id="personal_website_url"
                    placeholder="https://yourwebsite.com"
                    {...register('personal_website_url')}
                    className={errors.personal_website_url ? 'border-red-500' : ''}
                  />
                  {errors.personal_website_url && (
                    <p className="text-sm text-red-500">{errors.personal_website_url.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
