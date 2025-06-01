import React, { useState } from 'react';
import { getQueryClient } from '@/lib/api/getQueryClient';

import { PublicExperience } from '../types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';

type ExperiencesProps = {
  experiences?: PublicExperience[];
};

export const PublicExperiences = ({ experiences }: ExperiencesProps) => {
  const queryClient = getQueryClient();

  if (!experiences || experiences.length === 0) return null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col border rounded-[16px] border-neutral-300 overflow-clip bg-white">
        <SectionHeader
          count={
            experiences && experiences?.length > 0
              ? experiences?.length
              : undefined
          }
          title={'Work experience'}
          leftIconProps={{
            className: 'text-blue-b-400',
            iconVariant: 'Briefcase_fill'
          }}
          className="w-full"
        />

        {experiences && experiences?.length > 0
          ? experiences.map(experience => (
              <ListItem
                key={experience.company_name}
                title={experience.position_title}
                className="border-b border-neutral-300 last:border-b-0"
                subTitle={`${experience.company_name} • ${experience.employment_type}`}
                ContentImage={
                  <AvatarCompany
                    size="32px"
                    color={'blue'}
                    profileIMG={''}
                    AvatarType="alt"
                    avatarId={experience.company_name}
                    companyName={experience.company_name}
                  />
                }
                ListItemRight={
                  <div className="py-4">
                    {experience.start_year} - {experience.end_year || 'Present'}
                  </div>
                }
              />
            ))
          : null}
      </div>
    </HydrationBoundary>
  );
};
