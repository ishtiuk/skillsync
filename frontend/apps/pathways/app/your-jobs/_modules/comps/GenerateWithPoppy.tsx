import React from 'react';
import Image from 'next/image';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';

type GenerateWithPoppyProps = {
  onClick: () => void;
  isLoading?: boolean;
};

const GenerateWithPoppy = ({ isLoading, onClick }: GenerateWithPoppyProps) => {
  return (
    <div className="relative flex flex-col gap-2 bg-[url('/images/poppy-blend-bg-3.png')] bg-cover bg-center h-[600px] items-center justify-center rounded-[12px]">
      <div className="relative flex flex-col items-center justify-center gap-2 w-[80%] h-full text-white">
        {/*
			<div className="w-[577px] h-[576px] absolute rounded-full bg-orange-o-500 blur-[100px] left-[-84px] top-[-74px]" />
			<div className="w-[550px] h-[550px] absolute rounded-full bg-orange-o-500 blur-[100px] right-[-113px] top-[-61px]" />
			<div className="w-[533px] h-[532px] absolute rounded-full bg-orange-o-500 blur-[100px] right-[-57px] bottom-[-39px]" /> 
		*/}

        <div className="flex flex-col items-center w-full gap-2 mb-8">
          <Typography variant="caption" className="">
            Meet
          </Typography>

          <div className="flex items-center gap-2 justify-between w-[50%]">
            <div className="flex gap-x-2">
              <Typography
                variant="heading-lg"
                className="!text-[80px] font-bold"
              >
                Poppy
              </Typography>
              <Image
                width={48}
                height={48}
                alt="Poppy Logo"
                src="/images/poppy-logo-white.svg"
                className="w-[48px] h-[48px] object-cover"
              />
            </div>

            <div className="-mt-8 flex items-center rounded-[12px] border border-white border-opacity-20 bg-white bg-opacity-20 backdrop-blur-[12px] px-2 py-1">
              <Typography
                variant="caption-strong"
                className="text-neutral-n-200"
              >
                BETA
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[50%] mb-4">
          <div className="flex flex-col border-b border-neutral-n-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <PhosphorIcon
                size={24}
                className="fill-white"
                iconVariant="PencilSimpleLine_fill"
              />

              <Typography variant="body-strong">More Guidance</Typography>
            </div>

            <Typography variant="caption" className="ml-[32px] w-[90%]">
              With Poppy, make your cover letters pop as well as help you build
              better writing skills.
            </Typography>
          </div>

          <div className="flex flex-col border-b border-neutral-n-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <PhosphorIcon
                iconVariant="CheckCircle_fill"
                className="fill-white"
                size={24}
              />

              <Typography variant="body-strong">More Action</Typography>
            </div>

            <Typography variant="caption" className="ml-[32px] w-[90%]">
              Let Poppy enhance your cover letter by adjusting its tone and
              length effortlessly.
            </Typography>
          </div>

          <div className="flex flex-col border-b border-neutral-n-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <PhosphorIcon
                iconVariant="ListChecks_fill"
                className="fill-white"
                size={24}
              />

              <Typography variant="body-strong">More Prepared</Typography>
            </div>

            <Typography variant="caption" className="ml-[32px] w-[90%]">
              With Poppy, you can have custom cover letters in a flash.
            </Typography>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center  gap-2 w-full">
            <Typography variant="caption-strong" className="text-white">
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
            size="default"
            onClick={onClick}
            variant="secondary"
            label="Apply Confidently"
            className="text-primary-g-700"
          />
        )}
      </div>
    </div>
  );
};

export default GenerateWithPoppy;
