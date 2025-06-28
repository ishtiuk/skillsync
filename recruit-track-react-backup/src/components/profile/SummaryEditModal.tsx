import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface SummaryEditModalProps {
  children: React.ReactNode;
}

export const SummaryEditModal: React.FC<SummaryEditModalProps> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState(user?.career_summary || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await auth.updateProfile({ career_summary: summary });
      updateUser(response);

      toast({
        title: 'Summary updated',
        description: 'Your career summary has been updated successfully.',
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Your Professional Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Career Summary</Label>
            <RichTextEditor
              value={summary}
              onChange={setSummary}
              placeholder="Write a compelling summary of your professional experience, skills, and career milestones..."
              className="min-h-[200px]"
            />
            <p className="text-sm text-gray-500">
              Tip: Use bold for key points and bullet lists to highlight your achievements.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
