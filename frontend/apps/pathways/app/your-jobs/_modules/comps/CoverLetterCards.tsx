import Image from 'next/image';
import { Asterisk, Hexagon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { Typography } from '@workspace/ui/components/typography';
import { Badge } from '@workspace/ui/components/badges/badge/Badge';

type GenerateWithPoppyProps = {
  onClick: () => void;
  isLoading?: boolean;
};

export default function CoverLetterCards({
  isLoading,
  onClick
}: GenerateWithPoppyProps) {
  return (
    <div className="px-16 py-10 flex flex-col md:flex-row gap-4 max-w-8xl mx-auto h-full">
      {/* Generate Card */}
      <div className="flex-1 bg-orange-o-500 text-white rounded-[16px] shadow-md overflow-hidden flex flex-col h-full">
        <div className="p-12">
          <div className="mb-10">
            <Image
              width={48}
              height={48}
              alt="Poppy logo"
              className="h-[48px] w-[48px]"
              src="/images/poppy-logo-white.svg"
            />
          </div>

          <Typography
            variant="heading-lg"
            className="text-white text-3xl font-medium mb-4"
          >
            Generate
          </Typography>

          <Typography variant="heading-sm">
            Quickly generate a cover letter using Poppy AI that helps you get
            noticed by employers.
          </Typography>
        </div>

        <div className="p-12 pt-20">
          {isLoading ? (
            <div className="flex items-center justify-center  gap-2 w-full">
              <Typography variant="body-strong" className="text-white">
                Generating...
              </Typography>
              <PhosphorIcon
                size={32}
                iconVariant="CircleNotch_regular"
                className="fill-white animate-spin"
              />
            </div>
          ) : (
            <Button
              size="large"
              label="Generate"
              onClick={onClick}
              className="w-full"
              variant="tertiary"
            />
          )}
        </div>
      </div>

      {/* Update Card */}
      <div className="relative flex-1 bg-yellow-y-400 text-black rounded-[16px] shadow-md overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0">
          <Badge
            text="Coming Soon"
            variant="feature"
            className="w-fit bg-white text-black m-4 border-none"
          />
        </div>
        <div className="p-12 flex-1">
          <div className="mb-10">
            <PhosphorIcon
              iconVariant="Nut_fill"
              className="h-[48px] w-[48px] text-black"
            />
          </div>

          <Typography
            variant="heading-lg"
            className="text-black text-3xl font-medium mb-4"
          >
            Update
          </Typography>

          <Typography variant="heading-sm">
            Revise your cover letter to tailor it to the job and highlight your
            skills and experiences.
          </Typography>
        </div>
        <div className="p-12 pt-20">
          <Button
            size="large"
            variant="tertiary"
            className="w-full"
            label=" Upload Cover Letter"
          />
        </div>
      </div>
    </div>
  );
}
