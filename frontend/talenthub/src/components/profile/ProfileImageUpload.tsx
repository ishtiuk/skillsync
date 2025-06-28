import React, { useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { auth } from '@/lib/api';

interface ProfileImageUploadProps {
  children: React.ReactNode;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to backend
      await auth.uploadProfilePicture(file);

      // Get the new profile picture URL
      const { download_url } = await auth.getProfilePictureUrl();
      // Update user state with new profile picture download URL
      updateUser({ ...user!, profile_picture_url: download_url, profile_picture_download_url: download_url });

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture, Face not detected. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update profile picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden
                ${previewUrl ? 'border-none' : 'hover:border-primary cursor-pointer'}`}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-1">Click to upload</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            {previewUrl && (
              <div className="flex gap-2">
                <Button onClick={() => {
                  setPreviewUrl(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Save changes'}
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            Upload a square image for best results. Maximum file size 5MB.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
