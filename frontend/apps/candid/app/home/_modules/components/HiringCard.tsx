import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';
import { typographyVariants } from '@workspace/ui/components/typography/Typography';

const HiringCard = () => {
  const router = useRouter();

  return (
    <div className="flex pl-12 pr-2 py-4 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl">
      <div className="relative w-full flex justify-between bg-blue-b-200 rounded-2xl px-8 py-8 h-[400px] overflow-clip">
        <div className={`flex flex-col justify-between items-start gap-2`}>
          <div>
            <Typography
              variant="heading-md"
              className="text-primary-g-800 mb-2"
            >
              Kickstart your hiring with <br /> Candid.
            </Typography>

            <Typography variant="body" className="text-primary-g-800">
              With Candid you can now create, manage and post <br /> multiple
              roles! Decide when to hire and close <br /> a role all from our
              all in one platform!
            </Typography>
          </div>

          <Button
            size="default"
            variant="tertiary"
            label="Start Hiring"
            onClick={() => router.push('/roles')}
            className="-ml-1 mt-1 rounded-[16px] text-primary-g-800"
          >
            {typographyVariants['caption-strong']}
          </Button>
        </div>

        <Image
          width={350}
          height={350}
          alt="decorative-bio-image"
          className="absolute right-0 bottom-0"
          src="/images/start-hiring-card-image.svg"
        />
      </div>
    </div>
  );
};

export default HiringCard;
