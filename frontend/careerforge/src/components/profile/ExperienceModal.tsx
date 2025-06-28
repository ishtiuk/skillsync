import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/api';
import { experiences } from '@/lib/api';

interface ExperienceModalProps {
  isEdit?: boolean;
  experience?: {
    id: string;
    position_title: string;
    company_name: string;
    employment_type: string;
    is_current: boolean;
    start_month: number;
    start_year: number;
    end_month?: number;
    end_year?: number;
  };
  children: React.ReactNode;
  onSuccess: () => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isEdit = false,
  experience,
  children,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    position_title: experience?.position_title || '',
    company_name: experience?.company_name || '',
    employment_type: experience?.employment_type || 'Full-time',
    is_current: experience?.is_current || false,
    start_month: experience?.start_month || 1,
    start_year: experience?.start_year || new Date().getFullYear(),
    end_month: experience?.end_month || 1,
    end_year: experience?.end_year || new Date().getFullYear(),
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (isEdit && experience?.id) {
        await experiences.update(experience.id, formData);
      } else {
        await experiences.create(formData);
      }

      toast({
        title: `Experience ${isEdit ? 'updated' : 'added'}`,
        description: `Your work experience has been ${isEdit ? 'updated' : 'added'} successfully.`,
      });

      onSuccess();
      setIsOpen(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Volunteer'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Work Experience' : 'Add Work Experience'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position_title">Position Title</Label>
              <Input
                id="position_title"
                value={formData.position_title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  position_title: e.target.value
                }))}
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  company_name: e.target.value
                }))}
                placeholder="e.g. TechCorp Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <select
                id="employment_type"
                value={formData.employment_type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employment_type: e.target.value
                }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="is_current">Current Position</Label>
              <Switch
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  is_current: checked,
                  end_month: checked ? undefined : prev.end_month,
                  end_year: checked ? undefined : prev.end_year,
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_month">Start Month</Label>
                <select
                  id="start_month"
                  value={formData.start_month}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    start_month: parseInt(e.target.value)
                  }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_year">Start Year</Label>
                <select
                  id="start_year"
                  value={formData.start_year}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    start_year: parseInt(e.target.value)
                  }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {Array.from(
                    { length: 50 },
                    (_, i) => new Date().getFullYear() - i
                  ).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!formData.is_current && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_month">End Month</Label>
                  <select
                    id="end_month"
                    value={formData.end_month}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      end_month: parseInt(e.target.value)
                    }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_year">End Year</Label>
                  <select
                    id="end_year"
                    value={formData.end_year}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      end_year: parseInt(e.target.value)
                    }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {Array.from(
                      { length: 50 },
                      (_, i) => new Date().getFullYear() - i
                    ).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Experience' : 'Add Experience'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
