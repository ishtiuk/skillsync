import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Experience } from '@/types/experience';

const experienceSchema = z.object({
  position_title: z.string().min(1, 'Position title is required'),
  company_name: z.string().min(1, 'Company name is required'),
  employment_type: z.string().min(1, 'Employment type is required'),
  is_current: z.boolean(),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(1900).max(new Date().getFullYear()),
  end_month: z.number().min(1).max(12).optional(),
  end_year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  logo_url: z.string().url().optional().or(z.string().length(0)),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience;
  onSave: (data: ExperienceFormData) => Promise<void>;
}

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function ExperienceDialog({ isOpen, onClose, experience, onSave }: ExperienceDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position_title: '',
      company_name: '',
      employment_type: 'Full-time',
      is_current: false,
      start_month: new Date().getMonth() + 1,
      start_year: new Date().getFullYear(),
      end_month: new Date().getMonth() + 1,
      end_year: new Date().getFullYear(),
      logo_url: '',
    }
  });

  const isCurrent = watch('is_current');

  // Reset form when dialog opens/closes or experience changes
  React.useEffect(() => {
    if (isOpen) {
      if (experience) {
        // Edit mode - set form values from experience
        reset({
          position_title: experience.position_title,
          company_name: experience.company_name,
          employment_type: experience.employment_type,
          is_current: experience.is_current,
          start_month: experience.start_month,
          start_year: experience.start_year,
          end_month: experience.end_month,
          end_year: experience.end_year,
          logo_url: experience.logo_url || '',
        });
      } else {
        // Add mode - reset to defaults
        reset({
          position_title: '',
          company_name: '',
          employment_type: 'Full-time',
          is_current: false,
          start_month: new Date().getMonth() + 1,
          start_year: new Date().getFullYear(),
          end_month: new Date().getMonth() + 1,
          end_year: new Date().getFullYear(),
          logo_url: '',
        });
      }
    }
  }, [isOpen, experience, reset]);

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      await onSave(data);
      onClose();
      toast({
        title: experience ? 'Experience updated' : 'Experience added',
        description: 'Your professional experience has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save experience. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {experience ? 'Edit Experience' : 'Add Experience'}
          </DialogTitle>
          <DialogDescription>
            Add your professional experience details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position_title">Position Title</Label>
            <Input
              id="position_title"
              placeholder="e.g., Software Engineer"
              {...register('position_title')}
              className={errors.position_title ? 'border-red-500' : ''}
            />
            {errors.position_title && (
              <p className="text-sm text-red-500">{errors.position_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              placeholder="e.g., Tech Corp"
              {...register('company_name')}
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && (
              <p className="text-sm text-red-500">{errors.company_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employment_type">Employment Type</Label>
            <Select
              onValueChange={(value) => setValue('employment_type', value)}
              defaultValue={experience?.employment_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employment_type && (
              <p className="text-sm text-red-500">{errors.employment_type.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_current"
              checked={isCurrent}
              onCheckedChange={(checked) => setValue('is_current', checked as boolean)}
            />
            <Label htmlFor="is_current">I currently work here</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  onValueChange={(value) => setValue('start_month', parseInt(value))}
                  defaultValue={experience?.start_month?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => setValue('start_year', parseInt(value))}
                  defaultValue={experience?.start_year?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isCurrent && (
              <div className="space-y-2">
                <Label>End Date</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    onValueChange={(value) => setValue('end_month', parseInt(value))}
                    defaultValue={experience?.end_month?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setValue('end_year', parseInt(value))}
                    defaultValue={experience?.end_year?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Company Logo URL (optional)</Label>
            <Input
              id="logo_url"
              placeholder="https://company.com/logo.png"
              {...register('logo_url')}
              className={errors.logo_url ? 'border-red-500' : ''}
            />
            {errors.logo_url && (
              <p className="text-sm text-red-500">{errors.logo_url.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : experience ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
