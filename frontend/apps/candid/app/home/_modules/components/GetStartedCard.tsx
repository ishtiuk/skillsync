import React from 'react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';
import { typographyVariants } from '@workspace/ui/components/typography/Typography';
import { useRouter } from 'next/navigation';
import { PhosphorIcon } from '@/icons/PhosphorIcon';

const actionsToPerform = [
  {
    title: 'Add payment option',
    action: 'Set Up',
    link: '/home'
  },
  {
    title: 'Create company profile',
    action: 'Set Up',
    link: '/profile'
  },
  {
    title: 'Create Job Templates',
    action: 'Set Up',
    link: '/home'
  },
  {
    title: 'Start Hiring',
    action: 'New Hire',
    link: '/roles'
  }
];

const GetStartedCard = () => {
  const router = useRouter();
  return (
    <div className="flex pr-12 pl-2 py-4 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl">
      <div className="w-full flex flex-col bg-white rounded-2xl px-8 py-8 h-[400px] border border-neutral-n-300">
        <div className="flex items-center gap-2">
          <PhosphorIcon
            size={24}
            className="text-blue-b-300"
            iconVariant="SealCheck_fill"
          />
          <Typography variant="heading-sm" className="text-primary-g-800">
            Get Started with Candid
          </Typography>
        </div>

        <div className="w-full mt-8">
          {actionsToPerform.map((action, index) => (
            <div className="flex flex-col" key={index}>
              <div className="flex items-center justify-between">
                <Typography
                  variant="body-strong"
                  className="text-primary-g-800"
                >
                  {action.title}
                </Typography>

                <Button
                  size="default"
                  variant="tertiary"
                  label={action.action}
                  onClick={() => router.push(action.link)}
                  className="rounded-[16px] bg-neutral-n-200 text-primary-g-800"
                >
                  {typographyVariants['caption-strong']}
                </Button>
              </div>

              {index !== actionsToPerform.length - 1 && (
                <div className="flex flex-row gap-2 justify-between items-center my-4">
                  <hr
                    style={{
                      flexGrow: 1,
                      borderWidth: '1px',
                      borderColor: 'var(--Neutral-N300, #E5DFD8'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetStartedCard;
