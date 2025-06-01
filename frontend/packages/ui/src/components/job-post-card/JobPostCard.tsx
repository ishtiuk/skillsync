'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Card } from '../card';
import { Typography } from '../typography';
import { Tag } from '../tag';
import {
  industryTypes,
  PathwayBadge
} from '../badges/pathway-badge/PathwayBadge';
import { cn } from '@/lib/utils';
import { AvatarCompany } from '../avatar-company/AvatarCompany';
import { SavedButton } from '../save-button/SaveButton';
import {
  BadgeTypeLabelMap,
  JobTypeLabelMap,
  WorkplaceTypeLabelMap
} from '../jobs-table/types';
import { CardSizes } from '../card/Card';

const colorVariants = {
  blue: 'bg-blue-b-100 border-blue-b-100 text-blue-b-500 rounded-full',
  orange: 'bg-orange-o-100 border-orange-o-100 text-orange-o-500 rounded-full',
  purple: 'bg-purple-p-100 border-purple-p-100 text-purple-p-500 rounded-full'
};

const badgeTypes = {
  featured: colorVariants['blue'],
  bipoc: colorVariants['purple'],
  closing: colorVariants['orange']
};

interface JobPostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isSaving?: boolean;
  saved?: boolean;
  companyName: string;
  jobPostId: string;
  jobPostName: string;
  companyLogo?: string | undefined | null;
  pathway?: keyof typeof industryTypes;
  workplace?: keyof typeof WorkplaceTypeLabelMap;
  jobType?: keyof typeof JobTypeLabelMap;
  badge?: keyof typeof BadgeTypeLabelMap;
  onSave?: () => void;
  logoLetter?: boolean;
  logoVariant?: any;
  cardVariant?: CardSizes;
}

function JobPostCard({
  isSaving,
  saved,
  companyName,
  jobPostId,
  jobPostName,
  workplace,
  onSave,
  pathway,
  badge,
  jobType,
  logoLetter,
  logoVariant,
  companyLogo,
  cardVariant
}: JobPostCardProps) {
  const [isShown, setIsShown] = useState(false);
  return (
    <Link href={`/jobs/${jobPostId}`}>
      <Card
        size={cardVariant || 'medium'}
        key={`job-${jobPostId}`}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <div className="flex justify-between flex-col h-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between flex-row gap-2 w-full items-center">
              <div className="flex flex-row gap-2 min-w-0 items-center">
                {
                  <AvatarCompany
                    profileIMG={companyLogo || ''}
                    AvatarType="alt"
                    avatarId={jobPostId}
                    size="32px"
                    color={logoVariant}
                    companyName={companyName}
                  />
                }

                <Typography
                  variant="caption"
                  className="font-medium text-neutral-n-800 truncate"
                >
                  {companyName}
                </Typography>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {badge && (
                  <Tag
                    TypographyProps={{ variant: 'caption-strong' }}
                    className={cn(badgeTypes[badge], 'whitespace-nowrap')}
                    label={BadgeTypeLabelMap[badge]}
                  />
                )}
                {pathway && <PathwayBadge variant={pathway || 'energy'} />}
              </div>
            </div>
            <Typography
              variant="heading-sm"
              className={cn(
                'text-neutral-n-800 line-clamp-3',
                isShown && 'line-clamp-2'
              )}
            >
              {jobPostName}
            </Typography>
          </div>
          <div className="flex flex-row gap-2 items-end justify-between">
            <div
              className={cn(
                'flex flex-row gap-2 items-end',
                isShown && 'hidden'
              )}
            >
              {workplace && (
                <Tag
                  className="font-medium"
                  label={WorkplaceTypeLabelMap[workplace]}
                />
              )}
              {jobType && (
                <Tag className="font-medium" label={JobTypeLabelMap[jobType]} />
              )}
            </div>
            <div
              className={cn(
                'flex items-end justify-end ml-auto',
                !isShown && 'hidden'
              )}
            >
              <SavedButton
                onSave={onSave}
                isSaving={isSaving}
                saved={saved || false}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export { JobPostCard };
export type { JobPostCardProps };
