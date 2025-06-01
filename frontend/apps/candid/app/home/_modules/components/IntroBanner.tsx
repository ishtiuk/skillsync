import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';
import { typographyVariants } from '@workspace/ui/components/typography/Typography';

const IntroBanner = () => {
  const router = useRouter();

  return (
    <div className="flex px-12 py-4 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl">
      <div className="relative w-full flex justify-between bg-primary-g-800 rounded-2xl px-16 py-8 h-[400px] overflow-clip">
        <div className={`flex flex-col justify-around items-start gap-2 w-1/2`}>
          <div>
            <Typography variant="heading-md" className="text-blue-b-200 mb-2">
              Get Seattle Aquarium up and <br />
              running on Candid.
            </Typography>

            <Typography variant="body" className="text-blue-200">
              Add Seattle Aquarium’s details and start building out <br /> your
              team with Candid.
            </Typography>
          </div>

          <Button
            size="default"
            variant="tertiary"
            label="Add Company Details"
            onClick={() => router.push('/profile')}
            className="-ml-1 mt-1 rounded-[16px] text-primary-g-800"
          >
            {typographyVariants['caption-strong']}
          </Button>
        </div>

        <Image
          width={550}
          height={550}
          alt="decorative-bio-image"
          className="absolute right-4 bottom-0"
          src="/images/add-company-details-banner-image.svg"
        />
      </div>
    </div>
  );
};

export default IntroBanner;
