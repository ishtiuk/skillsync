import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription
} from '@workspace/ui/components/dialog/Dialog';

import {
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { updateUserProfile } from '@/app/profile/_modules/common/api/mutations/update-profile';
import { User } from '../types';

type BackgroundPhotoPopupProps = {
  open: boolean;
  data: User | null;
  backgroundImage: string | null;
  onOpenChange: (open: boolean) => void;
  setBackgroundImage: (image: string | null) => void;
};

const backgroundImages = [
  {
    id: 0,
    src: '/images/backgrounds/nature-01.png'
  },
  {
    id: 1,
    src: '/images/backgrounds/nature-02.png'
  },
  {
    id: 2,
    src: '/images/backgrounds/nature-03.png'
  },
  {
    id: 3,
    src: '/images/backgrounds/abstract-01.png'
  },
  {
    id: 4,
    src: '/images/backgrounds/abstract-02.png'
  },
  {
    id: 5,
    src: '/images/backgrounds/abstract-03.png'
  }
];

const BackgroundPhotoPopup = ({
  open,
  data,
  onOpenChange,
  backgroundImage,
  setBackgroundImage
}: BackgroundPhotoPopupProps) => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [selectedBackground, setSelectedBackground] = useState<number | null>(
    null
  );

  const handleSubmit = () => {
    if (selectedBackground !== null) {
      setBackgroundImage(backgroundImages[selectedBackground].src);
      onOpenChange(false);

      if (data) {
        mutation.mutate({
          ...data,
          background_image_url: backgroundImages[selectedBackground].src
        });
      }
    }
  };

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const queryClient = getQueryClient();

  useEffect(() => {
    console.log('backgroundImage', backgroundImage);

    setTimeout(() => {
      setSelectedBackground(
        backgroundImages.find(image => image.src === backgroundImage)?.id ??
          null
      );
    }, 100);
  }, [open]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[768px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Add your background
              </Typography>
            </DialogTitle>

            <DialogDescription>
              <Typography variant="body" className="text-primary-g-900">
                Express yourself with a background that describes your work or
                personality.
              </Typography>
            </DialogDescription>

            {hasErrors && (
              <Alert
                variant="critical"
                onClose={() => setHasErrors(false)}
                label={'Please fill in all required fields'}
              />
            )}
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {backgroundImages.map((image, index) => (
              <div
                key={image.id}
                className={`flex justify-center relative overflow-hidden rounded-[12px]  max-w-[600px] h-[150px] ${
                  selectedBackground === image.id &&
                  `border-4 border-blue-b-400`
                }`}
              >
                <Image
                  width={3000}
                  height={1980}
                  src={image.src}
                  alt="background"
                  onClick={() => setSelectedBackground(image.id)}
                  className="cursor-pointer transition-all duration-300 transform hover:scale-110 hover:opacity-80 object-cover object-center"
                />
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-end mt-8">
            <DialogClose asChild>
              <Button type="button" variant="tertiary" label="Cancel" />
            </DialogClose>

            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              label="Save Background"
              disabled={selectedBackground === null}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default BackgroundPhotoPopup;
